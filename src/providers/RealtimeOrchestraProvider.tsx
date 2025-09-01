/**
 * Realtime Orchestra Provider - Manages multi-user synchronization
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OrchestraParticipant {
  id: string;
  userId: string;
  isLeader: boolean;
  phaseOffset: number;
  lastSync: number;
  biofeedback?: {
    heartRate: number;
    breathingRate: number;
  };
}

interface OrchestraContextType {
  sessionId: string | null;
  participants: OrchestraParticipant[];
  phaseError: number;
  isLeader: boolean;
  isConnected: boolean;
  createSession: () => Promise<string | null>;
  joinSession: (sessionId: string) => Promise<boolean>;
  leaveSession: () => Promise<void>;
  updatePhase: (phase: number) => void;
  syncBiofeedback: (data: { heartRate: number; breathingRate: number }) => void;
}

const OrchestraContext = createContext<OrchestraContextType | null>(null);

export const useOrchestra = () => {
  const context = useContext(OrchestraContext);
  if (!context) {
    throw new Error('useOrchestra must be used within RealtimeOrchestraProvider');
  }
  return context;
};

interface RealtimeOrchestraProviderProps {
  children: React.ReactNode;
}

export const RealtimeOrchestraProvider: React.FC<RealtimeOrchestraProviderProps> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<OrchestraParticipant[]>([]);
  const [phaseError, setPhaseError] = useState(0);
  const [isLeader, setIsLeader] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<any>(null);
  const [userId, setUserId] = useState<string>('');

  // Get user ID on mount
  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || `anonymous_${Math.random().toString(36).substr(2, 9)}`);
    };
    getUserId();
  }, []);

  // Calculate phase error from participants
  useEffect(() => {
    if (participants.length < 2) {
      setPhaseError(0);
      return;
    }

    const phases = participants.map(p => p.phaseOffset);
    const avgPhase = phases.reduce((sum, phase) => sum + phase, 0) / phases.length;
    const maxDeviation = Math.max(...phases.map(phase => Math.abs(phase - avgPhase)));
    setPhaseError(maxDeviation);
  }, [participants]);

  const processPresenceState = (presenceState: any) => {
    const newParticipants: OrchestraParticipant[] = [];
    
    Object.entries(presenceState).forEach(([key, presenceArray]) => {
      const presenceList = presenceArray as any[];
      if (presenceList && presenceList.length > 0) {
        const presence = presenceList[0];
        newParticipants.push({
          id: key,
          userId: presence?.userId || key,
          isLeader: presence?.isLeader || false,
          phaseOffset: presence?.phaseOffset || 0,
          lastSync: presence?.lastSync || Date.now(),
          biofeedback: presence?.biofeedback || null
        });
      }
    });
    
    setParticipants(newParticipants);
  };

  const createSession = async (): Promise<string | null> => {
    try {
      const newSessionId = `orchestra_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create Supabase realtime channel
      const newChannel = supabase.channel(`orchestra:${newSessionId}`)
        .on('presence', { event: 'sync' }, () => {
          const presenceState = newChannel.presenceState();
          processPresenceState(presenceState);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('Orchestra participant joined:', key);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('Orchestra participant left:', key);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await newChannel.track({
              userId,
              isLeader: true,
              phaseOffset: 0,
              lastSync: Date.now(),
              biofeedback: null
            });
            setIsConnected(true);
          }
        });

      setChannel(newChannel);
      setSessionId(newSessionId);
      setIsLeader(true);
      return newSessionId;
    } catch (error) {
      console.error('Failed to create orchestra session:', error);
      return null;
    }
  };

  const joinSession = async (targetSessionId: string): Promise<boolean> => {
    try {
      // Create Supabase realtime channel
      const newChannel = supabase.channel(`orchestra:${targetSessionId}`)
        .on('presence', { event: 'sync' }, () => {
          const presenceState = newChannel.presenceState();
          processPresenceState(presenceState);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('Orchestra participant joined:', key);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('Orchestra participant left:', key);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await newChannel.track({
              userId,
              isLeader: false,
              phaseOffset: 0,
              lastSync: Date.now(),
              biofeedback: null
            });
            setIsConnected(true);
          }
        });

      setChannel(newChannel);
      setSessionId(targetSessionId);
      setIsLeader(false);
      return true;
    } catch (error) {
      console.error('Failed to join orchestra session:', error);
      return false;
    }
  };

  const leaveSession = async (): Promise<void> => {
    if (channel) {
      await channel.unsubscribe();
      setChannel(null);
    }
    
    setSessionId(null);
    setParticipants([]);
    setIsLeader(false);
    setIsConnected(false);
    setPhaseError(0);
  };

  const updatePhase = (phase: number) => {
    if (channel && isConnected) {
      channel.track({
        userId,
        isLeader,
        phaseOffset: phase,
        lastSync: Date.now(),
        biofeedback: participants.find(p => p.userId === userId)?.biofeedback
      });
    }
  };

  const syncBiofeedback = (data: { heartRate: number; breathingRate: number }) => {
    if (channel && isConnected) {
      channel.track({
        userId,
        isLeader,
        phaseOffset: participants.find(p => p.userId === userId)?.phaseOffset || 0,
        lastSync: Date.now(),
        biofeedback: data
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [channel]);

  return (
    <OrchestraContext.Provider value={{
      sessionId,
      participants,
      phaseError,
      isLeader,
      isConnected,
      createSession,
      joinSession,
      leaveSession,
      updatePhase,
      syncBiofeedback
    }}>
      {children}
    </OrchestraContext.Provider>
  );
};