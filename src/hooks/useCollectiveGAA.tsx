/**
 * Collective GAA Hook - Multi-user session management
 * Manages collective sessions, real-time coordination, and participant states
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  CollectiveOrchestration, 
  ParticipantState, 
  GAASessionExtended,
  PolarityProtocol,
  BiofeedbackMetrics,
  ShadowEngineState
} from '@/types/gaa-polarity';

export interface CollectiveGAAState {
  sessionId: string | null;
  isLeader: boolean;
  isConnected: boolean;
  orchestration: CollectiveOrchestration | null;
  participants: ParticipantState[];
  currentSession: GAASessionExtended | null;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export const useCollectiveGAA = () => {
  const [state, setState] = useState<CollectiveGAAState>({
    sessionId: null,
    isLeader: false,
    isConnected: false,
    orchestration: null,
    participants: [],
    currentSession: null,
    connectionStatus: 'disconnected'
  });

  const channelRef = useRef<any>(null);
  const userIdRef = useRef<string | null>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      userIdRef.current = user?.id || null;
    };
    getCurrentUser();
  }, []);

  /**
   * Create a new collective session
   */
  const createSession = useCallback(async (ceremonyType: string = 'cosmic_attunement') => {
    if (!userIdRef.current) {
      console.warn('User not authenticated');
      return null;
    }

    const sessionId = `collective_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      setState(prev => ({ ...prev, connectionStatus: 'connecting' }));

      // Create session in database
      const sessionData: Partial<GAASessionExtended> = {
        id: sessionId,
        preset_id: null,
        participant_ids: [userIdRef.current!],
        status: 'active',
        collective_state: {
          participants: [],
          phaseCoherence: 0,
          ceremonyType,
          lightDominance: 0.5,
          darkDominance: 0.5,
          collectivePolarityBalance: 0,
          sessionStartTime: new Date().toISOString(),
          averageBiofeedback: null,
          emergencyProtocols: {
            triggerType: 'coherence_drop',
            threshold: 0.3,
            responseActions: ['reduce_intensity', 'breathing_guide'],
            severity: 'low',
            activatedAt: null
          }
        }
      };

      const { error } = await supabase
        .from('gaa_sessions_extended')
        .insert(sessionData);

      if (error) {
        console.error('Failed to create session:', error);
        setState(prev => ({ ...prev, connectionStatus: 'error' }));
        return null;
      }

      setState(prev => ({ 
        ...prev, 
        sessionId,
        isLeader: true,
        connectionStatus: 'connected',
        currentSession: sessionData as GAASessionExtended
      }));

      // Setup real-time channel
      setupRealtimeChannel(sessionId);

      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      setState(prev => ({ ...prev, connectionStatus: 'error' }));
      return null;
    }
  }, []);

  /**
   * Join an existing collective session
   */
  const joinSession = useCallback(async (sessionId: string) => {
    if (!userIdRef.current) {
      console.warn('User not authenticated');
      return false;
    }

    try {
      setState(prev => ({ ...prev, connectionStatus: 'connecting' }));

      // Check if session exists
      const { data: session, error } = await supabase
        .from('gaa_sessions_extended')
        .select('*')
        .eq('id', sessionId)
        .eq('status', 'active')
        .single();

      if (error || !session) {
        console.error('Session not found:', error);
        setState(prev => ({ ...prev, connectionStatus: 'error' }));
        return false;
      }

      // Add user to participant list
      const updatedParticipants = [...(session.participant_ids || []), userIdRef.current!];
      
      const { error: updateError } = await supabase
        .from('gaa_sessions_extended')
        .update({ participant_ids: updatedParticipants })
        .eq('id', sessionId);

      if (updateError) {
        console.error('Failed to join session:', updateError);
        setState(prev => ({ ...prev, connectionStatus: 'error' }));
        return false;
      }

      setState(prev => ({ 
        ...prev, 
        sessionId,
        isLeader: false,
        connectionStatus: 'connected',
        currentSession: { ...session, participant_ids: updatedParticipants }
      }));

      // Setup real-time channel
      setupRealtimeChannel(sessionId);

      return true;
    } catch (error) {
      console.error('Error joining session:', error);
      setState(prev => ({ ...prev, connectionStatus: 'error' }));
      return false;
    }
  }, []);

  /**
   * Leave the current session
   */
  const leaveSession = useCallback(async () => {
    if (!state.sessionId || !userIdRef.current) return;

    try {
      // Remove user from participant list
      const updatedParticipants = (state.currentSession?.participant_ids || [])
        .filter(id => id !== userIdRef.current);

      await supabase
        .from('gaa_sessions_extended')
        .update({ participant_ids: updatedParticipants })
        .eq('id', state.sessionId);

      // Cleanup real-time channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      setState(prev => ({
        ...prev,
        sessionId: null,
        isLeader: false,
        isConnected: false,
        orchestration: null,
        participants: [],
        currentSession: null,
        connectionStatus: 'disconnected'
      }));

    } catch (error) {
      console.error('Error leaving session:', error);
    }
  }, [state.sessionId, state.currentSession]);

  /**
   * Setup real-time channel for session coordination
   */
  const setupRealtimeChannel = useCallback((sessionId: string) => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    channelRef.current = supabase
      .channel(`collective-session-${sessionId}`)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channelRef.current.presenceState();
        const participants = Object.values(presenceState).flat() as ParticipantState[];
        
        setState(prev => ({ 
          ...prev, 
          participants,
          orchestration: prev.orchestration ? {
            ...prev.orchestration,
            participants
          } : null
        }));
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('New participant joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('Participant left:', leftPresences);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'gaa_sessions_extended',
        filter: `id=eq.${sessionId}`
      }, (payload) => {
        setState(prev => ({ 
          ...prev, 
          currentSession: payload.new as GAASessionExtended 
        }));
      })
      .subscribe();

    // Track presence
    if (userIdRef.current) {
      const participantState: ParticipantState = {
        userId: userIdRef.current,
        role: state.isLeader ? 'leader' : 'participant',
        biofeedback: null,
        shadowEngineState: null,
        isActive: true,
        joinedAt: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      };

      channelRef.current.track(participantState);
    }
  }, [state.isLeader]);

  /**
   * Update participant's biofeedback and shadow engine state
   */
  const updateParticipantState = useCallback((
    biofeedback: BiofeedbackMetrics | null, 
    shadowEngine: ShadowEngineState | null
  ) => {
    if (!channelRef.current || !userIdRef.current) return;

    const participantState: ParticipantState = {
      userId: userIdRef.current,
      role: state.isLeader ? 'leader' : 'participant',
      biofeedback,
      shadowEngineState: shadowEngine,
      isActive: true,
      joinedAt: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    };

    channelRef.current.track(participantState);
  }, [state.isLeader]);

  /**
   * Synchronize polarity protocol across all participants
   */
  const syncPolarityProtocol = useCallback(async (protocol: PolarityProtocol) => {
    if (!state.sessionId || !state.isLeader) return;

    try {
      // Update session with new polarity protocol
      const { error } = await supabase
        .from('gaa_sessions_extended')
        .update({ 
          collective_state: {
            ...state.currentSession?.collective_state,
            collectivePolarityBalance: protocol.polarityBalance,
            lightDominance: protocol.lightChannel.amplitude,
            darkDominance: protocol.darkChannel.amplitude
          }
        })
        .eq('id', state.sessionId);

      if (error) {
        console.error('Failed to sync polarity protocol:', error);
      }
    } catch (error) {
      console.error('Error syncing polarity protocol:', error);
    }
  }, [state.sessionId, state.isLeader, state.currentSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    createSession,
    joinSession,
    leaveSession,
    updateParticipantState,
    syncPolarityProtocol
  };
};