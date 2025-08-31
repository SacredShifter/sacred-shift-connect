import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  CollectiveGAAState, 
  ParticipantState, 
  GAASessionExtended,
  CollectiveOrchestration,
  PolarityProtocol,
  BiofeedbackMetrics,
  ShadowEngineState
} from '@/types/gaa-polarity';

// Initial state for the collective GAA system
const initialState: CollectiveGAAState = {
  sessionId: '',
  isLeader: false,
  isConnected: false,
  orchestration: {
    participants: [],
    phaseCoherence: 0,
    ceremonyType: 'harmonic_convergence'
  },
  participants: [],
  currentSession: null,
  connectionStatus: 'disconnected'
};

export const useCollectiveGAA = () => {
  const [state, setState] = useState<CollectiveGAAState>(initialState);
  const channelRef = useRef<any>(null);
  const userIdRef = useRef<string | null>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userIdRef.current = user.id;
      }
    };
    getCurrentUser();
  }, []);

  // Create a new collective session (simulated)
  const createSession = async (ceremonyType?: string): Promise<string | null> => {
    if (!userIdRef.current) {
      console.error('User not authenticated');
      return null;
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const mockSession: GAASessionExtended = {
      id: sessionId,
      presetId: 'cosmic_harmony',
      facilitatorId: userIdRef.current,
      participantIds: [userIdRef.current],
      status: 'active',
      collectiveState: {
        participants: [],
        phaseCoherence: 0,
        ceremonyType: (ceremonyType as any) || 'harmonic_convergence'
      },
      sessionAnalytics: {
        startTime: new Date(),
        totalParticipants: 1,
        averageCoherence: 0,
        peakCoherence: 0
      }
    };

    // Set up realtime channel
    setupRealtimeChannel(sessionId);
    
    setState(prev => ({
      ...prev,
      sessionId,
      isLeader: true,
      isConnected: true,
      currentSession: mockSession,
      connectionStatus: 'connected',
      orchestration: {
        participants: [],
        phaseCoherence: 0,
        ceremonyType: (ceremonyType as any) || 'harmonic_convergence'
      }
    }));

    return sessionId;
  };

  // Join an existing session (simulated)
  const joinSession = async (sessionId: string): Promise<boolean> => {
    if (!userIdRef.current) {
      console.error('User not authenticated');
      return false;
    }

    // Simulate joining session
    const mockSession: GAASessionExtended = {
      id: sessionId,
      presetId: 'cosmic_harmony',
      facilitatorId: 'other_user',
      participantIds: ['other_user', userIdRef.current],
      status: 'active',
      collectiveState: {
        phaseCoherence: 0.3,
        participants: [],
        ceremonyType: 'harmonic_convergence' as any
      },
      sessionAnalytics: {
        startTime: new Date(),
        totalParticipants: 2,
        averageCoherence: 0.3,
        peakCoherence: 0.5
      }
    };

    // Set up realtime channel
    setupRealtimeChannel(sessionId);

    setState(prev => ({
      ...prev,
      sessionId,
      isLeader: false,
      connectionStatus: 'connected',
      currentSession: mockSession,
      isConnected: true,
      orchestration: {
        phaseCoherence: 0.3,
        participants: [],
        ceremonyType: 'harmonic_convergence' as any
      }
    }));

    return true;
  };

  // Leave the current session
  const leaveSession = async (): Promise<void> => {
    // Clean up realtime channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Reset state
    setState(initialState);
  };

  // Set up realtime channel for session coordination
  const setupRealtimeChannel = (sessionId: string): void => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`collective-session-${sessionId}`)
      .on('presence', { event: 'sync' }, () => {
        const presences = channel.presenceState();
        const participantList = Object.values(presences).map(presence => ({
          userId: (presence[0] as any)?.user_id || (presence[0] as any)?.presence_ref || 'unknown',
          displayName: (presence[0] as any)?.display_name || 'Anonymous',
          polarityBalance: (presence[0] as any)?.polarity_balance || 0.5,
          biofeedback: (presence[0] as any)?.biofeedback || null,
          shadowEngineState: (presence[0] as any)?.shadow_engine_state || null,
          lastActivity: new Date((presence[0] as any)?.last_activity || Date.now()),
          lastActive: new Date((presence[0] as any)?.last_activity || Date.now()),
          consentLevel: 'participant' as const,
          role: (presence[0] as any)?.role || 'participant'
        })) as ParticipantState[];

        setState(prev => ({
          ...prev,
          participants: participantList,
          orchestration: {
            ...prev.orchestration,
            participants: participantList
          }
        }));
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('Participant joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('Participant left:', leftPresences);
      })
      .subscribe();

    channelRef.current = channel;
  };

  // Update participant state with biofeedback and shadow engine data
  const updateParticipantState = (
    biofeedback: BiofeedbackMetrics | null,
    shadowEngine: ShadowEngineState | null
  ): void => {
    if (!channelRef.current || !userIdRef.current) return;

    const presence = {
      user_id: userIdRef.current,
      display_name: `User ${userIdRef.current.slice(-4)}`,
      polarity_balance: shadowEngine?.polarityBalance || 0.5,
      biofeedback,
      shadow_engine_state: shadowEngine,
      last_activity: new Date().toISOString(),
      role: state.isLeader ? 'facilitator' : 'participant'
    };

    channelRef.current.track(presence);
  };

  // Sync polarity protocol across all participants
  const syncPolarityProtocol = async (protocol: PolarityProtocol): Promise<void> => {
    if (!state.isLeader) {
      console.warn('Only the session leader can sync polarity protocol');
      return;
    }

    // Update local orchestration state
    setState(prev => ({
      ...prev,
      orchestration: {
        ...prev.orchestration,
        ...protocol as any
      }
    }));

    // Broadcast to all participants via realtime channel
    if (channelRef.current) {
      channelRef.current.send({
        type: 'polarity_sync',
        payload: protocol
      });
    }
  };

  // Simulate participant presence for testing
  const simulateParticipant = () => {
    if (!channelRef.current) return;

    const mockParticipant = {
      user_id: `mock_${Date.now()}`,
      display_name: `Participant ${Math.floor(Math.random() * 1000)}`,
      polarity_balance: Math.random(),
      biofeedback: {
        heartRateVariability: Math.random() * 100,
        brainwaveActivity: {
          alpha: Math.random() * 50,
          beta: Math.random() * 30,
          theta: Math.random() * 40,
          delta: Math.random() * 20,
          gamma: Math.random() * 10
        },
        breathingPattern: {
          rate: 12 + Math.random() * 8,
          depth: Math.random(),
          coherence: Math.random()
        },
        autonomicBalance: {
          sympathetic: Math.random(),
          parasympathetic: Math.random()
        }
      },
      shadow_engine_state: {
        isActive: true,
        currentPhase: 'integration' as const,
        polarityBalance: Math.random(),
        shadowIntensity: Math.random(),
        lightDominance: Math.random(),
        darkDominance: Math.random(),
        breathCoherence: Math.random(),
        heartVariability: Math.random(),
        neuralEntrainment: Math.random()
      },
      last_activity: new Date().toISOString(),
      role: state.isLeader ? 'facilitator' : 'participant'
    };

    channelRef.current.track(mockParticipant);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  return {
    ...state,
    createSession,
    joinSession,
    leaveSession,
    updateParticipantState,
    syncPolarityProtocol,
    simulateParticipant
  };
};