/**
 * Collective Orchestration - Multi-user GAA session management
 * Handles real-time participant coordination and collective coherence
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Crown, 
  Waves, 
  Heart, 
  Brain,
  Shield,
  Zap,
  Eye,
  UserPlus,
  UserMinus,
  VolumeX,
  Volume2
} from 'lucide-react';
import { 
  CollectiveOrchestration as CollectiveOrchestrationData, 
  ParticipantState, 
  ShadowEngineState 
} from '@/types/gaa-polarity';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface CollectiveOrchestrationProps {
  sessionId: string | null;
  isLeader: boolean;
  orchestration: CollectiveOrchestrationData | null;
  onJoinSession: (sessionId: string) => void;
  onCreateSession: () => void;
  onLeaveSession: () => void;
  className?: string;
}

export const CollectiveOrchestration: React.FC<CollectiveOrchestrationProps> = ({
  sessionId,
  isLeader,
  orchestration,
  onJoinSession,
  onCreateSession,
  onLeaveSession,
  className = ""
}) => {
  const [participants, setParticipants] = useState<ParticipantState[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  // Real-time participant updates
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`collective-session-${sessionId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const participantList = Object.values(state).map(presence => {
          const presenceData = presence?.[0] as any;
          return {
            userId: presenceData?.user_id || presenceData?.presence_ref || 'unknown',
            displayName: presenceData?.display_name || `User ${presenceData?.presence_ref?.slice(-4) || '????'}`,
            polarityBalance: presenceData?.polarity_balance || 0.5,
            biofeedback: presenceData?.biofeedback || null,
            shadowEngineState: presenceData?.shadow_engine_state || null,
            lastActivity: new Date(presenceData?.last_activity || Date.now()),
            lastActive: new Date(presenceData?.last_activity || Date.now()),
            consentLevel: 'participant' as const,
            role: presenceData?.role || 'participant'
          };
        }) as ParticipantState[];
        setParticipants(participantList);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('Participant joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('Participant left:', leftPresences);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const getParticipantStatusColor = (participant: ParticipantState) => {
    if (!participant.shadowEngineState) return 'hsl(var(--muted-foreground))';
    
    const coherence = (
      participant.shadowEngineState.breathCoherence + 
      participant.shadowEngineState.heartVariability + 
      participant.shadowEngineState.neuralEntrainment
    ) / 3;

    if (coherence >= 0.8) return 'hsl(var(--success))';
    if (coherence >= 0.6) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getOverallCoherence = () => {
    if (!orchestration || participants.length === 0) return 0;
    return orchestration.phaseCoherence;
  };

  const getCeremonyTypeColor = (type: string) => {
    switch (type) {
      case 'shadow_integration': return 'text-purple-400';
      case 'cosmic_attunement': return 'text-blue-400';
      case 'collective_healing': return 'text-green-400';
      case 'manifestation': return 'text-amber-400';
      default: return 'text-muted-foreground';
    }
  };

  if (!sessionId) {
    return (
      <Card className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border-indigo-500/20 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-indigo-400" />
            Collective Orchestration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Join a collective GAA session or create your own
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              <Button 
                onClick={onCreateSession}
                className="bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/40"
                variant="outline"
              >
                <Crown className="w-4 h-4 mr-2" />
                Create Session
              </Button>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Session ID"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-md bg-background/50 border border-input"
                />
                <Button 
                  onClick={() => onJoinSession(inviteCode)}
                  disabled={!inviteCode}
                  size="sm"
                >
                  Join
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border-indigo-500/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-indigo-400" />
          Collective Session
          {isLeader && (
            <Badge variant="secondary" className="ml-auto">
              <Crown className="w-3 h-3 mr-1" />
              Leader
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Session Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Session ID:</span>
            <code className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">
              {sessionId.slice(-8)}
            </code>
          </div>
          
          {orchestration && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ceremony:</span>
              <span className={getCeremonyTypeColor(orchestration.ceremonyType)}>
                {orchestration.ceremonyType.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Overall Coherence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Collective Coherence</span>
            <span className="text-sm text-indigo-400">{Math.round(getOverallCoherence() * 100)}%</span>
          </div>
          <Progress 
            value={getOverallCoherence() * 100} 
            className="h-2" 
          />
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400" />
              <span>Heart</span>
            </div>
            <div className="flex items-center gap-1">
              <Brain className="w-3 h-3 text-purple-400" />
              <span>Mind</span>
            </div>
            <div className="flex items-center gap-1">
              <Waves className="w-3 h-3 text-blue-400" />
              <span>Breath</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Participants List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Participants ({participants.length})
            </span>
            {isLeader && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInvite(!showInvite)}
              >
                <UserPlus className="w-3 h-3" />
              </Button>
            )}
          </div>
          
          <AnimatePresence>
            {showInvite && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-2 bg-indigo-500/10 rounded-md border border-indigo-500/20"
              >
                <div className="text-xs text-muted-foreground mb-2">Share this code:</div>
                <code className="text-sm font-mono bg-background/50 px-2 py-1 rounded">
                  {sessionId}
                </code>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1 max-h-32 overflow-y-auto">
            <AnimatePresence>
              {participants.map((participant, index) => (
                <motion.div
                  key={participant.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 p-2 rounded-md bg-background/30"
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getParticipantStatusColor(participant) }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      Participant {index + 1}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {participant.role}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {participant.biofeedback && (
                      <>
                        <Heart className="w-3 h-3 text-red-400" />
                        <Brain className="w-3 h-3 text-purple-400" />
                        <Waves className="w-3 h-3 text-blue-400" />
                      </>
                    )}
                    
                    {participant.role === 'facilitator' && (
                      <Crown className="w-3 h-3 text-amber-400" />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <Separator />

        {/* Session Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onLeaveSession}
            className="flex-1 border-red-500/30 hover:bg-red-500/10"
          >
            <UserMinus className="w-4 h-4 mr-2" />
            Leave Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};