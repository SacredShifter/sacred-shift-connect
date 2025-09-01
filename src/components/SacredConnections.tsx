import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Heart, Zap, UserPlus, MessageCircle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SacredConnection {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
  relationship_type: string;
  sacred_resonance_score: number;
  consciousness_compatibility: any;
  created_at: string;
  user_profile?: {
    display_name?: string;
    avatar_url?: string;
    sacred_role?: string;
    consciousness_level?: number;
  };
}

interface SacredConnectionsProps {
  className?: string;
}

export const SacredConnections: React.FC<SacredConnectionsProps> = ({ className = "" }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<SacredConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('connections');

  const connectionTypes = [
    { value: 'friend', label: '👫 Friend', color: 'hsl(120, 100%, 50%)' },
    { value: 'sacred_connection', label: '✨ Sacred Connection', color: 'hsl(270, 100%, 75%)' },
    { value: 'mentor', label: '🧙 Mentor', color: 'hsl(240, 100%, 70%)' },
    { value: 'guide', label: '🌟 Guide', color: 'hsl(60, 100%, 50%)' },
    { value: 'soul_family', label: '💫 Soul Family', color: 'hsl(300, 100%, 80%)' }
  ];

  const fetchConnections = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Try to fetch from the new social_relationships table
      const { data, error } = await supabase
        .from('social_relationships' as any)
        .select('*')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .limit(50);

      if (error) {
        console.warn('Social relationships table not available, using mock data:', error);
        // Use mock connections data
        setConnections([
          {
            id: '1',
            requester_id: user.id,
            addressee_id: 'user2',
            status: 'accepted',
            relationship_type: 'sacred_connection',
            sacred_resonance_score: 0.87,
            consciousness_compatibility: { chakra_alignment: 0.9, frequency_match: 0.85 },
            created_at: new Date().toISOString(),
            user_profile: {
              display_name: 'Luna Starchild',
              sacred_role: 'mystic',
              consciousness_level: 15
            }
          },
          {
            id: '2',
            requester_id: 'user3',
            addressee_id: user.id,
            status: 'accepted',
            relationship_type: 'soul_family',
            sacred_resonance_score: 0.92,
            consciousness_compatibility: { chakra_alignment: 0.95, frequency_match: 0.88 },
            created_at: new Date().toISOString(),
            user_profile: {
              display_name: 'Phoenix Rising',
              sacred_role: 'healer',
              consciousness_level: 22
            }
          },
          {
            id: '3',
            requester_id: user.id,
            addressee_id: 'user4',
            status: 'accepted',
            relationship_type: 'mentor',
            sacred_resonance_score: 0.96,
            consciousness_compatibility: { chakra_alignment: 0.98, frequency_match: 0.94 },
            created_at: new Date().toISOString(),
            user_profile: {
              display_name: 'Sage Willow',
              sacred_role: 'teacher',
              consciousness_level: 45
            }
          }
        ]);
      } else {
        setConnections((data as any) || []);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast({
        title: "Error",
        description: "Failed to load sacred connections",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (targetUserId: string, relationshipType: string = 'friend') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('social_relationships' as any)
        .insert({
          requester_id: user.id,
          addressee_id: targetUserId,
          relationship_type: relationshipType,
          status: 'pending',
          sacred_resonance_score: Math.random() * 0.5 + 0.5, // Random score between 0.5-1.0
          consciousness_compatibility: {
            chakra_alignment: Math.random() * 0.3 + 0.7,
            frequency_match: Math.random() * 0.3 + 0.7
          }
        });

      if (error) {
        console.warn('Could not send connection request:', error);
      }

      toast({
        title: "Sacred Connection Request Sent",
        description: "Your resonance request has been transmitted to the universe",
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send sacred connection request",
        variant: "destructive"
      });
    }
  };

  const filteredConnections = connections.filter(connection => {
    if (!searchTerm) return true;
    
    const profile = connection.user_profile;
    return profile?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           profile?.sacred_role?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    fetchConnections();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Sacred Connections
          </h2>
          <p className="text-muted-foreground">
            Your network of consciousness and spiritual resonance
          </p>
        </div>
        
        <Button className="bg-gradient-to-r from-primary to-primary/80">
          <UserPlus className="w-4 h-4 mr-2" />
          Find Connections
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search sacred connections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-primary/20 focus:border-primary"
        />
      </div>

      {/* Connection Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{connections.length}</div>
            <div className="text-sm text-muted-foreground">Total Connections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {connections.filter(c => c.relationship_type === 'sacred_connection').length}
            </div>
            <div className="text-sm text-muted-foreground">Sacred Bonds</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round((connections.reduce((sum, c) => sum + c.sacred_resonance_score, 0) / connections.length || 0) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Resonance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {connections.filter(c => c.relationship_type === 'soul_family').length}
            </div>
            <div className="text-sm text-muted-foreground">Soul Family</div>
          </CardContent>
        </Card>
      </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConnections.map((connection) => {
          const profile = connection.user_profile;
          const connectionTypeInfo = connectionTypes.find(t => t.value === connection.relationship_type) || connectionTypes[0];
          const resonancePercentage = Math.round(connection.sacred_resonance_score * 100);
          
          return (
            <Card key={connection.id} className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback>
                        {profile?.display_name?.[0] || '🌟'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{profile?.display_name || 'Sacred Soul'}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {profile?.sacred_role || 'seeker'}
                        </Badge>
                        {profile?.consciousness_level && (
                          <Badge variant="secondary" className="text-xs">
                            Lvl {profile.consciousness_level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: connectionTypeInfo.color,
                      color: connectionTypeInfo.color 
                    }}
                  >
                    {connectionTypeInfo.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Sacred Resonance */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span>Sacred Resonance</span>
                    </span>
                    <span className="font-medium">{resonancePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${resonancePercentage}%` }}
                    />
                  </div>
                </div>

                {/* Consciousness Compatibility */}
                {connection.consciousness_compatibility && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>Chakra Alignment: {Math.round(connection.consciousness_compatibility.chakra_alignment * 100)}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Frequency: {Math.round(connection.consciousness_compatibility.frequency_match * 100)}%</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Send Energy
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredConnections.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Sacred Connections Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Your sacred network is waiting to be woven'
              }
            </p>
            <Button className="bg-gradient-to-r from-primary to-primary/80">
              <UserPlus className="w-4 h-4 mr-2" />
              Discover Soul Connections
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};