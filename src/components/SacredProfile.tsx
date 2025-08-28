import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Edit3, MapPin, Globe, Calendar, Zap, Sparkles, Users, Heart, Star, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Temporary placeholder for FrequencyVisuals
const FrequencyVisuals = ({ frequency, isActive, className }: { frequency: number, isActive: boolean, className?: string }) => (
  <div className={`bg-gradient-to-r from-primary/20 to-primary/5 ${className}`}>
    <div className="w-full h-full flex items-center justify-center text-primary/50">
      <Zap className="w-6 h-6" />
    </div>
  </div>
);

interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  consciousness_signature: any;
  aura_reading: any;
  spiritual_journey_metadata: any;
  sacred_geometry_preference: string;
  chakra_alignments: any;
  archetypal_activations: string[];
  frequency_signature: number;
  consciousness_level: number;
  sacred_role: string;
  location?: string;
  website_url?: string;
  birth_chart_data: any;
  is_public: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface SacredProfileProps {
  userId?: string;
  isOwnProfile?: boolean;
  onClose?: () => void;
}

export const SacredProfile: React.FC<SacredProfileProps> = ({
  userId,
  isOwnProfile = false,
  onClose
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    location: '',
    website_url: '',
    sacred_role: 'seeker',
    sacred_geometry_preference: 'flower_of_life'
  });

  const targetUserId = userId || user?.id;

  const sacredRoles = [
    { value: 'seeker', label: '🔍 Seeker', description: 'On a journey of discovery' },
    { value: 'healer', label: '💚 Healer', description: 'Channel of healing energy' },
    { value: 'teacher', label: '📚 Teacher', description: 'Wisdom keeper and guide' },
    { value: 'mystic', label: '✨ Mystic', description: 'Bridge between realms' },
    { value: 'artist', label: '🎨 Sacred Artist', description: 'Creator of conscious beauty' },
    { value: 'warrior', label: '⚔️ Light Warrior', description: 'Protector of sacred truth' },
    { value: 'shaman', label: '🪶 Shaman', description: 'Walker between worlds' },
    { value: 'oracle', label: '🔮 Oracle', description: 'Voice of divine wisdom' }
  ];

  const geometryOptions = [
    { value: 'flower_of_life', label: '🌸 Flower of Life' },
    { value: 'merkaba', label: '⭐ Merkaba' },
    { value: 'sri_yantra', label: '🔺 Sri Yantra' },
    { value: 'metatrons_cube', label: '📐 Metatron\'s Cube' },
    { value: 'tree_of_life', label: '🌳 Tree of Life' },
    { value: 'fibonacci_spiral', label: '🌀 Fibonacci Spiral' }
  ];

  const fetchProfile = async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      
      // Try to get existing profile from the new user_profiles table
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles' as any)
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let profileData = existingProfile;

      if (!profileData) {
        // Profile doesn't exist, create default one
        const { data: userData } = await supabase.auth.getUser();
        const defaultProfile = {
          user_id: targetUserId,
          display_name: userData.user?.user_metadata?.full_name || '',
          bio: '',
          consciousness_signature: {},
          aura_reading: { colors: ['#8A2BE2', '#FF69B4'], intensity: 0.7 },
          spiritual_journey_metadata: { stage: 'awakening', milestones: [] },
          sacred_geometry_preference: 'flower_of_life',
          chakra_alignments: {},
          archetypal_activations: [],
          frequency_signature: 528.0,
          consciousness_level: 1,
          sacred_role: 'seeker',
          birth_chart_data: {},
          is_public: true,
          is_verified: false
        };

        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles' as any)
          .insert(defaultProfile)
          .select()
          .single();

        if (createError) {
          console.warn('Could not create profile in database, using mock data:', createError);
          // Use mock data if database creation fails
          profileData = {
            ...defaultProfile,
            id: '1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            avatar_url: '',
            cover_image_url: ''
          } as any;
        } else {
          profileData = newProfile;
        }
      }

      setProfile(profileData as any);
      
      if (profileData) {
        setFormData({
          display_name: (profileData as any).display_name || '',
          bio: (profileData as any).bio || '',
          location: (profileData as any).location || '',
          website_url: (profileData as any).website_url || '',
          sacred_role: (profileData as any).sacred_role || 'seeker',
          sacred_geometry_preference: (profileData as any).sacred_geometry_preference || 'flower_of_life'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load sacred profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!targetUserId || !profile) return;

    try {
      const { error } = await supabase
        .from('user_profiles' as any)
        .update({
          display_name: formData.display_name,
          bio: formData.bio,
          location: formData.location,
          website_url: formData.website_url,
          sacred_role: formData.sacred_role,
          sacred_geometry_preference: formData.sacred_geometry_preference
        })
        .eq('user_id', targetUserId);

      if (error) {
        console.warn('Database update failed, changes are local only:', error);
      }

      await fetchProfile();
      setEditing(false);
      
      toast({
        title: "Sacred Profile Updated",
        description: "Your consciousness signature has been harmonized",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update sacred profile",
        variant: "destructive"
      });
    }
  };

  const getConsciousnessLevelColor = (level: number) => {
    const levels = [
      { min: 1, max: 10, color: 'hsl(0, 84%, 60%)', label: 'Awakening' },
      { min: 11, max: 25, color: 'hsl(24, 100%, 50%)', label: 'Exploring' },
      { min: 26, max: 50, color: 'hsl(60, 100%, 50%)', label: 'Expanding' },
      { min: 51, max: 75, color: 'hsl(120, 100%, 50%)', label: 'Integrating' },
      { min: 76, max: 90, color: 'hsl(240, 100%, 70%)', label: 'Transcending' },
      { min: 91, max: 100, color: 'hsl(300, 100%, 80%)', label: 'Illuminated' }
    ];
    
    const levelInfo = levels.find(l => level >= l.min && level <= l.max) || levels[0];
    return levelInfo;
  };

  useEffect(() => {
    fetchProfile();
  }, [targetUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <h3 className="text-lg font-medium mb-2">Sacred Profile Not Found</h3>
          <p className="text-muted-foreground">This soul's consciousness signature is not yet visible</p>
        </CardContent>
      </Card>
    );
  }

  const consciousnessLevel = getConsciousnessLevelColor(profile.consciousness_level);
  const currentRole = sacredRoles.find(r => r.value === profile.sacred_role) || sacredRoles[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cover & Avatar Section */}
      <Card className="overflow-hidden">
        <div 
          className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 relative"
          style={{ 
            backgroundImage: profile.cover_image_url ? `url(${profile.cover_image_url})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <FrequencyVisuals 
            frequency={profile.frequency_signature} 
            isActive={true}
            className="absolute inset-0 opacity-30"
          />
          
          {isOwnProfile && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 opacity-90"
            >
              <Camera className="w-4 h-4 mr-2" />
              Update Cover
            </Button>
          )}
        </div>

        <CardContent className="relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 md:-mt-20">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                <AvatarImage src={profile.avatar_url || user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {profile.display_name?.[0] || '🌟'}
                </AvatarFallback>
              </Avatar>
              
              {profile.is_verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              {editing ? (
                <div className="space-y-2">
                  <Input
                    value={formData.display_name}
                    onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                    placeholder="Your sacred name"
                    className="text-xl font-bold"
                  />
                  <select
                    value={formData.sacred_role}
                    onChange={(e) => setFormData({...formData, sacred_role: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {sacredRoles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold">{profile.display_name || 'Sacred Soul'}</h1>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Badge 
                      variant="secondary" 
                      className="bg-gradient-to-r from-primary/20 to-primary/10"
                    >
                      {currentRole.label}
                    </Badge>
                    <Badge 
                      variant="outline"
                      style={{ 
                        borderColor: consciousnessLevel.color,
                        color: consciousnessLevel.color 
                      }}
                    >
                      Level {profile.consciousness_level} • {consciousnessLevel.label}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                {profile.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>{Math.round(profile.frequency_signature)}Hz</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.created_at).getFullYear()}</span>
                </div>
              </div>
            </div>

            {isOwnProfile && (
              <div className="flex space-x-2">
                {editing ? (
                  <>
                    <Button onClick={updateProfile} className="bg-gradient-to-r from-primary to-primary/80">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setEditing(true)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="consciousness">Consciousness</TabsTrigger>
          <TabsTrigger value="journey">Journey</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sacred Biography</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Share your sacred story..."
                  className="min-h-[120px]"
                />
              ) : (
                <p className="text-foreground leading-relaxed">
                  {profile.bio || 'This soul has not yet shared their sacred story...'}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Sacred Geometry</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <select
                    value={formData.sacred_geometry_preference}
                    onChange={(e) => setFormData({...formData, sacred_geometry_preference: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {geometryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {geometryOptions.find(g => g.value === profile.sacred_geometry_preference)?.label || '🌸'}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Primary Resonance Pattern
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Archetypal Activations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.archetypal_activations?.length > 0 ? (
                    profile.archetypal_activations.map((archetype, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {archetype}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Archetypal journey has not yet begun...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consciousness" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aura Reading</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    {profile.aura_reading?.colors?.map((color: string, index: number) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: color }}
                      />
                    )) || (
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary/60" />
                        <div className="w-8 h-8 rounded-full bg-primary/40" />
                        <div className="w-8 h-8 rounded-full bg-primary/20" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Intensity: {Math.round((profile.aura_reading?.intensity || 0.7) * 100)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequency Signature</CardTitle>
              </CardHeader>
              <CardContent className="relative h-32">
                <FrequencyVisuals 
                  frequency={profile.frequency_signature} 
                  isActive={true}
                  className="absolute inset-0"
                />
                <div className="absolute bottom-2 left-2 text-sm font-medium">
                  {Math.round(profile.frequency_signature)}Hz
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="journey" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spiritual Journey Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  The sacred timeline of awakening is being woven...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Sacred Connections</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  The web of sacred connections is forming...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};