import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  CollectiveGAAState, 
  GAASessionExtended,
  CollectiveOrchestration,
  PolarityProtocol,
  BiofeedbackMetrics,
  ShadowEngineState
} from '@/types/gaa-polarity';
import { CollectiveField, CollectiveReceiver, ParticipantState } from '@/modules/collective/CollectiveReceiver';
import { CollectiveSync } from '@/utils/gaa/CollectiveSync';

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

import * as Tone from 'tone';

export const useCollectiveGAA = (transport: typeof Tone.Transport) => {
  const [state, setState] = useState<CollectiveGAAState & { collectiveField: CollectiveField | null }>({
    ...initialState,
    collectiveField: null,
  });
  const channelRef = useRef<any>(null);
  const userIdRef = useRef<string | null>(null);
  const clockOffsetRef = useRef<number>(0);
  const clockSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const collectiveReceiverRef = useRef<CollectiveReceiver | null>(null);
  const collectiveSyncRef = useRef<CollectiveSync | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{ [key: string]: MediaStream }>({});
  const [phase, setPhase] = useState(0);
  const [coherence, setCoherence] = useState(0);

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

  const setLocalAudioStream = (stream: MediaStream) => {
    setLocalStream(stream);
    if (collectiveReceiverRef.current) {
      collectiveReceiverRef.current.setLocalStream(stream);
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

  // Create a new collective session
  const createSession = async (ceremonyType: any = 'harmonic_convergence'): Promise<string | null> => {
    console.log('ethos.event: CollectiveSessionCreated');
    if (!userIdRef.current) {
      console.error('User not authenticated');
      return null;
    }

    const { data, error } = await supabase
      .from('gaa_sessions')
      .insert({
        host_uid: userIdRef.current,
        is_public: true,
        settings: { ceremonyType },
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating session:', error);
      return null;
    }

    const newSession = data as unknown as GAASessionExtended;
    const sessionId = newSession.id;

    // Set up realtime channel
    setupRealtimeChannel(sessionId);
    
    if(userIdRef.current) {
        const receiver = new CollectiveReceiver(userIdRef.current);
        collectiveReceiverRef.current = receiver;

        const sync = new CollectiveSync((newPhase, newCoherence) => {
            setPhase(newPhase);
            setCoherence(newCoherence);
        });
        collectiveSyncRef.current = sync;

        receiver.onFieldUpdate((field) => {
          setState(prev => ({ ...prev, collectiveField: field }));
        });
        receiver.onStream((userId, stream) => {
            setRemoteStreams(prev => ({...prev, [userId]: stream}));
        });

        receiver.onSignal((peerId, data) => {
            if (channelRef.current) {
                channelRef.current.send({
                    type: 'broadcast',
                    event: 'signal',
                    payload: { from: userIdRef.current, to: peerId, signal: data },
                });
            }
        });

        sync.startSync((message) => {
            receiver.broadcast(message);
        });

        receiver.onSyncMessage((message) => {
            collectiveSyncRef.current?.handleSyncMessage(message, Date.now());
        });
    }

    setState(prev => ({
      ...prev,
      sessionId,
      isLeader: true,
      isConnected: true,
      currentSession: newSession,
      connectionStatus: 'connected',
      orchestration: {
        participants: [],
        phaseCoherence: 0,
        ceremonyType: ceremonyType
      }
    }));

    return sessionId;
  };

  // Join an existing session
  const joinSession = async (sessionId: string): Promise<boolean> => {
    console.log('ethos.event: CollectiveSessionJoined');
    if (!userIdRef.current) {
      console.error('User not authenticated');
      return false;
    }

    const { data, error } = await supabase
      .from('gaa_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !data) {
      console.error('Error joining session:', error);
      return false;
    }

    const session = data as unknown as GAASessionExtended;

    // Set up realtime channel
    setupRealtimeChannel(sessionId);

    if(userIdRef.current) {
        const receiver = new CollectiveReceiver(userIdRef.current);
        collectiveReceiverRef.current = receiver;

        const sync = new CollectiveSync((newPhase, newCoherence) => {
            setPhase(newPhase);
            setCoherence(newCoherence);
        });
        collectiveSyncRef.current = sync;

        receiver.onFieldUpdate((field) => {
          setState(prev => ({ ...prev, collectiveField: field }));
        });
        receiver.onStream((userId, stream) => {
            setRemoteStreams(prev => ({...prev, [userId]: stream}));
        });

        receiver.onSignal((peerId, data) => {
            if (channelRef.current) {
                channelRef.current.send({
                    type: 'broadcast',
                    event: 'signal',
                    payload: { from: userIdRef.current, to: peerId, signal: data },
                });
            }
        });

        sync.startSync((message) => {
            receiver.broadcast(message);
        });

        receiver.onSyncMessage((message) => {
            collectiveSyncRef.current?.handleSyncMessage(message, Date.now());
        });
    }

    setState(prev => ({
      ...prev,
      sessionId,
      isLeader: false,
      connectionStatus: 'connected',
      currentSession: session,
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
    console.log('ethos.event: CollectiveSessionLeft');
    // Clean up realtime channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    collectiveReceiverRef.current?.disconnect();
    collectiveReceiverRef.current = null;
    collectiveSyncRef.current?.stopSync();
    collectiveSyncRef.current = null;

    // Reset state
    setState({ ...initialState, collectiveField: null });
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
    }
    setRemoteStreams({});
  };

  // Set up realtime channel for session coordination
  const setupRealtimeChannel = (sessionId: string): void => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`collective-session-${sessionId}`);

    channel.on('broadcast', { event: 'signal' }, ({ payload }: { payload: { from: string, to: string, signal: any } }) => {
        if (payload.to === userIdRef.current) {
            collectiveReceiverRef.current?.signal(payload.from, payload.signal);
        }
    });

    channel.on('broadcast', { event: 'state_update' }, ({ payload }: { payload: any }) => {
      if (payload.userId !== userIdRef.current) {
        collectiveReceiverRef.current?.updateParticipantState(payload.userId, payload as ParticipantState);
        setState(prev => ({
          ...prev,
          participants: prev.participants.map(p => p.userId === payload.userId ? payload : p)
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
      newPresences.forEach(p => {
        const peerId = (p as any).user_id;
        if (peerId !== userIdRef.current) {
          console.log(`Initiating connection to ${peerId}`);
          collectiveReceiverRef.current?.connect(peerId, true);
        }
      });
    })
    .on('presence', { event: 'leave' }, ({ leftPresences }) => {
      console.log('Participant left:', leftPresences);
      leftPresences.forEach(p => collectiveReceiverRef.current?.unregisterParticipant((p as any).user_id));
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
    if (!channelRef.current || !userIdRef.current) return;

    const participantState: any = {
      userId: userIdRef.current,
      displayName: 'Anonymous', // This should be fetched from the profile
      polarityBalance: shadowEngine?.polarityBalance || 0.5,
      biofeedback,
      shadowEngineState: shadowEngine,
      lastActive: new Date(),
      lastActivity: new Date(),
      role: state.isLeader ? 'facilitator' : 'participant',
      consentLevel: 'participant',
    };

    channelRef.current.send({
      type: 'broadcast',
      event: 'state_update',
      payload: participantState,
    });
  };

  // Sync polarity protocol across all participants
  const syncPolarityProtocol = async (protocol: Omit<PolarityProtocol, 'timestamp'>): Promise<void> => {
    if (!state.isLeader) {
      console.warn('Only the session leader can sync polarity protocol');
      return;
    }

    const fullProtocol: PolarityProtocol = {
      ...protocol,
      timestamp: Date.now() + clockOffsetRef.current,
    };

    // Update local orchestration state
    setState(prev => ({
      ...prev,
      orchestration: {
        ...prev.orchestration,
        ...fullProtocol as any
      }
    }));

    // Broadcast to all participants via realtime channel
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'polarity_sync',
        payload: fullProtocol
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
    setLocalAudioStream,
    remoteStreams,
    updateConsentLevel: (level: 'observer' | 'participant' | 'full_integration') => {
      // This would be a broadcast message to the leader/server
      console.log(`Setting consent level to: ${level}`);
    },
    // --- Placeholder for future advanced sync logic ---
    getNetworkTime: () => Date.now() + clockOffsetRef.current,
    getParticipantLatency: (userId: string) => collectiveSyncRef.current?.getNetworkStats().averageLatency || 0,
    phase,
    coherence,
    connectionStatus: state.connectionStatus,
  };
};