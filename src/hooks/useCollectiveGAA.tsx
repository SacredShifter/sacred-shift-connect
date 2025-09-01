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
  const clockOffsetRef = useRef<number>(0);
  const clockSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Clock Synchronization Logic ---
  const syncClock = async () => {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.functions.invoke('get-server-time');
      if (error) throw error;

      const endTime = Date.now();
      const roundTripTime = endTime - startTime;
      const serverTime = data.serverTime;

      // Offset = ServerTime - (LocalTime + OneWayLatency)
      const estimatedOffset = serverTime - (endTime - roundTripTime / 2);
      clockOffsetRef.current = estimatedOffset;
      console.log(`🕰️ Clock synchronized. Offset: ${estimatedOffset.toFixed(2)}ms, RTT: ${roundTripTime}ms`);
    } catch (error) {
      console.error('Error syncing clock:', error);
    }
  };

  // Get current user & start clock sync
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userIdRef.current = user.id;
        // Start clock sync immediately and then every 30 seconds
        syncClock();
        clockSyncIntervalRef.current = setInterval(syncClock, 30000);
      }
    };
    getCurrentUser();

    return () => {
      if (clockSyncIntervalRef.current) {
        clearInterval(clockSyncIntervalRef.current);
      }
    };
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

    const channel = supabase.channel(`collective-session-${sessionId}`);

    // *** Add broadcast handler for polarity_sync ***
    channel.on('broadcast', { event: 'polarity_sync' }, ({ payload }) => {
      console.log('Received polarity sync:', payload);
      if (!state.isLeader) {
        setState(prev => ({
          ...prev,
          orchestration: {
            ...prev.orchestration,
            ...payload as any
          }
        }));
      }
    });

    channel.on('presence', { event: 'sync' }, () => {
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

  /**
   * NOTE: This function is deprecated for high-frequency state updates.
   * Supabase Presence is not designed for real-time data streams, but for low-frequency
   * "who is online" status. Using it for frequent updates is inefficient and unreliable.
   * A proper real-time solution (e.g., a dedicated server or WebRTC data channels) is
   * required for true collective state synchronization.
   */
  const updateParticipantState = (
    biofeedback: BiofeedbackMetrics | null,
    shadowEngine: ShadowEngineState | null
  ): void => {
    // No-op: Do not use presence for high-frequency updates.
    return;
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
    simulateParticipant,
    // --- Placeholder for future advanced sync logic ---
    getNetworkTime: () => Date.now() + clockOffsetRef.current,
    getParticipantLatency: (userId: string) => 0, // TODO: Implement latency detection
    applyPLLDriftCorrection: (leaderTimestamp: number) => { /* NO-OP */ }
  };
};

// --- Future Development Roadmap for Collective Sync ---
//
// PHASE 2: LATENCY & JITTER COMPENSATION
//
// 1. PHASE-LOCKED LOOP (PLL) FOR DRIFT CORRECTION:
//    - The `applyPLLDriftCorrection` function below should be implemented.
//    - It should compare the received timestamp of a message with the current network time.
//    - The difference (phase error) should be fed into a PI controller (Proportional-Integral).
//    - The output of the controller adjusts the playback rate of the local audio engine
//      (e.g., `Tone.Transport.bpm`) to slowly pull the client back into phase with the leader.
//
// 2. JITTER BUFFER:
//    - All incoming state messages should be put into a "jitter buffer" for a
//      short, fixed period (e.g., 100-200ms).
//    - After the delay, the client processes messages from the buffer in
//      timestamp order, discarding any that are too old. This ensures smooth
//      playback at the cost of a small, fixed latency.
//
// PHASE 3: SCALABLE ARCHITECTURE
//
// 1. DEDICATED REAL-TIME SERVER:
//    - The Supabase broadcast model will not scale. A dedicated real-time server
//      (e.g., Node.js with WebSockets, or a Phoenix server) is required.
//    - The server would manage session state, process updates, and send targeted
//      messages to clients, reducing client-side load.
//
// 2. WEBRTC DATA CHANNELS:
//    - For even lower latency, a peer-to-peer mesh network using WebRTC data
//      channels can be used. This is complex to manage for groups larger than ~8
//      and would likely require a "selective forwarding unit" (SFU) server architecture.
//
// 1. CLOCK SYNCHRONIZATION:
//    - Create a Supabase edge function that returns the server's timestamp.
//    - Clients should periodically call this function and calculate a running average
//      of the offset between their local clock and the server clock.
//    - The `getNetworkTime()` function should return `Date.now() + clockOffset`.
//
// 2. LATENCY & JITTER COMPENSATION:
//    - All broadcasted state updates MUST include a synchronized timestamp.
//    - Receiving clients should put incoming messages into a "jitter buffer" for a
//      short, fixed period (e.g., 100-200ms).
//    - After the delay, the client processes the messages from the buffer in
//      timestamp order, discarding any that are too old.
//    - This ensures smooth playback at the cost of a small, fixed latency.
//
// 3. STATE SYNCHRONIZATION ARCHITECTURE:
//    - Move away from Supabase broadcast for high-frequency state. It is not designed
//      for this purpose and will not scale.
//    - Option A: Dedicated Real-time Server (e.g., Node.js with WebSockets, or a Phoenix server).
//      The server would manage the state of each session and send targeted updates to clients.
//    - Option B: WebRTC Data Channels. For smaller groups, a peer-to-peer mesh network
//      can provide very low latency state updates. This is more complex to manage.