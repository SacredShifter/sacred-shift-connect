// Sacred Calling Recipient Picker Component
// Consciousness-aware user selection with sovereignty and resonance filtering

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Users, 
  Phone, 
  Shield, 
  Zap, 
  Heart,
  Star,
  Filter,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SacredRecipient {
  id: string;
  name: string;
  avatar?: string;
  consciousnessLevel: number;
  sovereigntyLevel: number;
  resonanceFrequency: number;
  circleId?: string;
  circleName?: string;
  isOnline: boolean;
  lastSeen: string;
  sacredCapabilities: string[];
  resonanceMatch: number;
  isCallable: boolean;
  callabilityReason?: string;
}

interface Circle {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  consciousnessLevel: number;
}

interface RecipientPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipientSelected: (recipient: SacredRecipient) => void;
  currentUserConsciousness: number;
  currentUserSovereignty: number;
}

export const RecipientPicker: React.FC<RecipientPickerProps> = ({
  isOpen,
  onClose,
  onRecipientSelected,
  currentUserConsciousness,
  currentUserSovereignty
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCircle, setSelectedCircle] = useState<string>('all');
  const [recipients, setRecipients] = useState<SacredRecipient[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch circles the user is a member of
  const fetchCircles = useCallback(async () => {
    if (!user) return;

    try {
      const { data: circleMemberships, error: membershipError } = await supabase
        .from('circle_group_members')
        .select(`
          group_id,
          circle_groups!inner(
            id,
            name,
            description
          )
        `)
        .eq('user_id', user.id);

      if (membershipError) throw membershipError;

      const { data: memberCounts, error: countError } = await supabase
        .from('circle_group_members')
        .select('group_id')
        .in('group_id', circleMemberships?.map(cm => cm.group_id) || []);

      if (countError) throw countError;

      const circleMap = new Map();
      circleMemberships?.forEach(cm => {
        circleMap.set(cm.group_id, {
          ...cm.circle_groups,
          memberCount: memberCounts?.filter(mc => mc.group_id === cm.group_id).length || 0,
          consciousnessLevel: 0.5 // Default consciousness level for circles
        });
      });

      setCircles(Array.from(circleMap.values()));
    } catch (error) {
      console.error('Error fetching circles:', error);
      setError('Failed to load circles');
    }
  }, [user]);

  // Fetch callable users based on circle membership and sovereignty rules
  const fetchCallableUsers = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Get users from circles the current user is a member of
      const { data: circleMembers, error: membersError } = await supabase
        .from('circle_group_members')
        .select(`
          user_id,
          group_id,
          circle_groups!inner(
            id,
            name
          )
        `)
        .in('group_id', circles.map(c => c.id));

      if (membersError) throw membersError;

      // Get user IDs from circle members
      const userIds = circleMembers?.map(cm => cm.user_id) || [];
      
      if (userIds.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Fetch user profiles separately
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          user_id,
          display_name,
          avatar_url
        `)
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Process and filter users
      const userMap = new Map<string, SacredRecipient>();
      
      circleMembers?.forEach(member => {
        const circle = member.circle_groups;
        
        // Find the corresponding profile
        const profile = profiles?.find(p => p.user_id === member.user_id);
        if (!profile) return; // Skip if profile not found
        
        if (profile.user_id === user.id) return; // Skip self

        // Use default values for missing consciousness fields
        const consciousnessLevel = 0.5; // Default consciousness level
        const sovereigntyLevel = 0.5; // Default sovereignty level
        const resonanceFrequency = 432; // Default sacred frequency

        // Calculate resonance match
        const resonanceMatch = calculateResonanceMatch(
          currentUserConsciousness,
          consciousnessLevel,
          currentUserSovereignty,
          sovereigntyLevel
        );

        // Check if user is callable based on sovereignty rules
        const { isCallable, reason } = checkCallability(
          currentUserSovereignty,
          sovereigntyLevel,
          consciousnessLevel,
          resonanceMatch
        );

        // Debug logging
        console.log('🔍 Callability check:', {
          userSovereignty: currentUserSovereignty,
          recipientSovereignty: sovereigntyLevel,
          recipientConsciousness: consciousnessLevel,
          resonanceMatch,
          isCallable,
          reason
        });

        const recipient: SacredRecipient = {
          id: profile.user_id,
          name: profile.display_name || 'Sacred Seeker',
          avatar: profile.avatar_url,
          consciousnessLevel,
          sovereigntyLevel,
          resonanceFrequency,
          circleId: circle.id,
          circleName: circle.name,
          isOnline: true, // Default to online since we can't check
          lastSeen: new Date().toISOString(), // Default to now
          sacredCapabilities: getSacredCapabilities(consciousnessLevel),
          resonanceMatch,
          isCallable,
          callabilityReason: reason
        };

        // Only include if callable or if we want to show all for transparency
        if (isCallable || selectedCircle === 'all') {
          userMap.set(profile.user_id, recipient);
        }
      });

      let filteredRecipients = Array.from(userMap.values());

      // Apply search filter
      if (searchQuery.trim()) {
        filteredRecipients = filteredRecipients.filter(recipient =>
          recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipient.circleName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply circle filter
      if (selectedCircle !== 'all') {
        filteredRecipients = filteredRecipients.filter(recipient =>
          recipient.circleId === selectedCircle
        );
      }

      // Sort by resonance match and online status
      filteredRecipients.sort((a, b) => {
        if (a.isOnline !== b.isOnline) {
          return a.isOnline ? -1 : 1;
        }
        return b.resonanceMatch - a.resonanceMatch;
      });

      setRecipients(filteredRecipients);
    } catch (error) {
      console.error('Error fetching callable users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [user, circles, searchQuery, selectedCircle, currentUserConsciousness, currentUserSovereignty]);

  // Calculate resonance match between users
  const calculateResonanceMatch = (
    userConsciousness: number,
    recipientConsciousness: number,
    userSovereignty: number,
    recipientSovereignty: number
  ): number => {
    const consciousnessDiff = Math.abs(userConsciousness - recipientConsciousness);
    const sovereigntyDiff = Math.abs(userSovereignty - recipientSovereignty);
    
    // Higher match for similar consciousness and sovereignty levels
    const consciousnessMatch = 1 - consciousnessDiff;
    const sovereigntyMatch = 1 - sovereigntyDiff;
    
    return (consciousnessMatch + sovereigntyMatch) / 2;
  };

  // Check if a user is callable based on sovereignty rules
  const checkCallability = (
    userSovereignty: number,
    recipientSovereignty: number,
    recipientConsciousness: number,
    resonanceMatch: number
  ): { isCallable: boolean; reason?: string } => {
    // Basic sovereignty check - user must have sufficient sovereignty to initiate calls
    if (userSovereignty < 0.3) {
      return { isCallable: false, reason: 'Insufficient sovereignty to initiate calls' };
    }

    // Recipient must have minimum consciousness level
    if (recipientConsciousness < 0.2) {
      return { isCallable: false, reason: 'Recipient consciousness too low' };
    }

    // High sovereignty users can call anyone
    if (userSovereignty >= 0.8) {
      return { isCallable: true };
    }

    // Medium sovereignty users can call users with similar or lower sovereignty
    if (userSovereignty >= 0.5) {
      if (recipientSovereignty > userSovereignty + 0.2) {
        return { isCallable: false, reason: 'Recipient sovereignty too high' };
      }
      return { isCallable: true };
    }

    // Low sovereignty users can only call users with similar sovereignty
    if (Math.abs(userSovereignty - recipientSovereignty) > 0.3) {
      return { isCallable: false, reason: 'Sovereignty levels too different' };
    }

    return { isCallable: true };
  };

  // Get sacred capabilities based on consciousness level
  const getSacredCapabilities = (consciousnessLevel: number): string[] => {
    const capabilities: string[] = [];
    
    if (consciousnessLevel > 0.8) {
      capabilities.push('quantum-audio', 'light-pulse-voice', 'frequency-wave-voice', 'nature-whisper-voice');
    } else if (consciousnessLevel > 0.5) {
      capabilities.push('frequency-wave-voice', 'light-pulse-voice', 'nature-whisper-voice');
    } else if (consciousnessLevel > 0.3) {
      capabilities.push('frequency-wave-voice', 'nature-whisper-voice');
    } else {
      capabilities.push('nature-whisper-voice');
    }
    
    return capabilities;
  };

  // Load data on mount and when dependencies change
  useEffect(() => {
    if (isOpen) {
      fetchCircles();
    }
  }, [isOpen, fetchCircles]);

  useEffect(() => {
    if (isOpen && circles.length > 0) {
      fetchCallableUsers();
    }
  }, [isOpen, circles, fetchCallableUsers]);

  const handleRecipientClick = (recipient: SacredRecipient) => {
    if (recipient.isCallable) {
      onRecipientSelected(recipient);
    }
  };

  const getResonanceColor = (match: number) => {
    if (match >= 0.8) return 'text-green-400';
    if (match >= 0.6) return 'text-yellow-400';
    if (match >= 0.4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getConsciousnessIcon = (level: number) => {
    if (level >= 0.8) return '🌟';
    if (level >= 0.6) return '✨';
    if (level >= 0.4) return '⭐';
    return '💫';
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-background/95 backdrop-blur-xl border border-primary/20 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Phone className="w-6 h-6 text-primary" />
                Select Sacred Recipient
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a soul to connect with through consciousness-aware calling
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name or circle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={selectedCircle} onValueChange={setSelectedCircle}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {circles.slice(0, 3).map(circle => (
                  <TabsTrigger key={circle.id} value={circle.id}>
                    {circle.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Recipients List */}
          <ScrollArea className="h-96">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6"
                >
                  🔮
                </motion.div>
                <span className="ml-2 text-muted-foreground">Loading sacred souls...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8 text-red-400">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            ) : recipients.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Users className="w-5 h-5 mr-2" />
                No callable souls found
              </div>
            ) : (
              <div className="space-y-2">
                {recipients.map((recipient) => (
                  <motion.div
                    key={recipient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        recipient.isCallable
                          ? 'hover:bg-primary/5 hover:border-primary/30'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => handleRecipientClick(recipient)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={recipient.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                              {recipient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {recipient.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold truncate">{recipient.name}</h3>
                            <div className="flex items-center gap-2">
                              {recipient.isCallable ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {recipient.circleName}
                            </Badge>
                            <span className={`text-xs ${getResonanceColor(recipient.resonanceMatch)}`}>
                              {Math.round(recipient.resonanceMatch * 100)}% match
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <span>{getConsciousnessIcon(recipient.consciousnessLevel)}</span>
                              <span>{(recipient.consciousnessLevel * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              <span>{(recipient.sovereigntyLevel * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              <span>{recipient.resonanceFrequency}Hz</span>
                            </div>
                          </div>

                          {!recipient.isCallable && recipient.callabilityReason && (
                            <div className="mt-2 text-xs text-red-400">
                              {recipient.callabilityReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Callable</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  <span>Restricted</span>
                </div>
              </div>
              <div>
                {recipients.filter(r => r.isCallable).length} callable souls
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecipientPicker;
