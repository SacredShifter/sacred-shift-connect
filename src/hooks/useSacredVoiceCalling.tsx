// Sacred Voice Calling React Hook
// Easy integration of consciousness-aware voice calling into React components

import { useState, useEffect, useCallback, useRef } from 'react';
import { SacredVoiceCalling, SacredVoiceCall, SacredVoiceCallConfig } from '@/lib/connectivity/SacredVoiceCalling';
import { SSUC } from '@/lib/connectivity/SacredShifterUniversalConnectivity';

export interface UseSacredVoiceCallingOptions {
  ssuC: SSUC;
  config?: Partial<SacredVoiceCallConfig>;
  enableConsciousnessFeatures?: boolean;
  enableSacredFrequencies?: boolean;
  autoInitialize?: boolean;
}

export interface SacredVoiceCallingState {
  isInitialized: boolean;
  isInitializing: boolean;
  hasMicrophoneAccess: boolean;
  isRequestingMicrophone: boolean;
  activeCalls: SacredVoiceCall[];
  currentCall?: SacredVoiceCall;
  isMuted: boolean;
  isSpeaking: boolean;
  volumeLevel: number;
  audioQuality: {
    latency: number;
    jitter: number;
    packetLoss: number;
    consciousnessClarity: number;
    resonanceHarmony: number;
  };
  error?: string;
}

export function useSacredVoiceCalling({
  ssuC,
  config = {},
  enableConsciousnessFeatures = true,
  enableSacredFrequencies = true,
  autoInitialize = true
}: UseSacredVoiceCallingOptions) {
  const [state, setState] = useState<SacredVoiceCallingState>({
    isInitialized: false,
    isInitializing: false,
    hasMicrophoneAccess: false,
    isRequestingMicrophone: false,
    activeCalls: [],
    isMuted: false,
    isSpeaking: false,
    volumeLevel: 1.0,
    audioQuality: {
      latency: 0,
      jitter: 0,
      packetLoss: 0,
      consciousnessClarity: 0,
      resonanceHarmony: 0
    }
  });

  const voiceCallingRef = useRef<SacredVoiceCalling>();
  const audioContextRef = useRef<AudioContext>();
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Initialize voice calling system with retry logic
  const initialize = useCallback(async () => {
    if (state.isInitialized || state.isInitializing) return;

    setState(prev => ({ ...prev, isInitializing: true, error: undefined }));

    try {
      const defaultConfig: SacredVoiceCallConfig = {
        sampleRate: 48000,
        bitRate: 128000,
        channels: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        enableResonanceFiltering: enableConsciousnessFeatures,
        enableConsciousnessTone: enableConsciousnessFeatures,
        enableSacredFrequencies: enableSacredFrequencies,
        enableAuraVoiceAnalysis: enableConsciousnessFeatures,
        enableAdaptiveBitrate: true,
        enableJitterBuffer: true,
        enablePacketLossRecovery: true,
        maxLatency: 200,
        enableQuantumAudio: enableSacredFrequencies,
        enableLightPulseAudio: enableSacredFrequencies,
        enableFrequencyWaveAudio: enableSacredFrequencies,
        enableNatureWhisperAudio: enableSacredFrequencies,
        ...config
      };

      const voiceCalling = new SacredVoiceCalling(ssuC, defaultConfig);
      await voiceCalling.initialize();

      voiceCallingRef.current = voiceCalling;
      retryCountRef.current = 0; // Reset retry count on success

      setState(prev => ({
        ...prev,
        isInitialized: true,
        isInitializing: false,
        activeCalls: voiceCalling.getActiveCalls()
      }));

      console.log('🎤 Sacred Voice Calling initialized');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize voice calling';
      
      // Implement exponential backoff retry for certain errors
      if (retryCountRef.current < maxRetries && 
          error instanceof Error && 
          (error.message.includes('NotReadableError') || 
           error.message.includes('microphone') ||
           error.message.includes('audio'))) {
        
        retryCountRef.current++;
        const delay = Math.pow(2, retryCountRef.current) * 1000; // Exponential backoff
        
        console.log(`🔄 Retrying voice calling initialization in ${delay}ms (attempt ${retryCountRef.current}/${maxRetries})`);
        
        setTimeout(() => {
          setState(prev => ({ ...prev, isInitializing: false }));
          initialize();
        }, delay);
        
        return;
      }
      
      setState(prev => ({
        ...prev,
        isInitializing: false,
        error: errorMessage
      }));
      console.error('❌ Failed to initialize Sacred Voice Calling:', error);
    }
  }, [ssuC, config, enableConsciousnessFeatures, enableSacredFrequencies, state.isInitialized, state.isInitializing]);

  // Request microphone access
  const requestMicrophoneAccess = useCallback(async () => {
    if (!voiceCallingRef.current) {
      throw new Error('Voice calling not initialized');
    }

    if (state.hasMicrophoneAccess) {
      return;
    }

    setState(prev => ({ ...prev, isRequestingMicrophone: true, error: undefined }));

    try {
      await voiceCallingRef.current.requestMicrophoneAccess();
      setState(prev => ({
        ...prev,
        hasMicrophoneAccess: true,
        isRequestingMicrophone: false
      }));
      console.log('🎤 Microphone access granted');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to access microphone';
      setState(prev => ({
        ...prev,
        isRequestingMicrophone: false,
        error: errorMessage
      }));
      console.error('❌ Failed to access microphone:', error);
      throw error;
    }
  }, [state.hasMicrophoneAccess]);

  // Auto-initialize on mount with user interaction requirement
  useEffect(() => {
    if (autoInitialize && !state.isInitialized && !state.isInitializing) {
      // Only auto-initialize if we're in a secure context and have user interaction
      if (window.isSecureContext) {
        // Delay initialization to allow for user interaction
        const timeoutId = setTimeout(() => {
          initialize();
        }, 1000);
        
        return () => clearTimeout(timeoutId);
      } else {
        setState(prev => ({
          ...prev,
          error: 'Voice calling requires HTTPS. Please use a secure connection.'
        }));
      }
    }
  }, [autoInitialize, state.isInitialized, state.isInitializing, initialize]);

  // Start a voice call
  const startCall = useCallback(async (participantIds: string[], consciousnessLevel: number = 0.5) => {
    if (!voiceCallingRef.current) {
      throw new Error('Voice calling not initialized');
    }

    try {
      // Request microphone access before starting call
      if (!state.hasMicrophoneAccess) {
        await requestMicrophoneAccess();
      }

      const callId = await voiceCallingRef.current.initiateCall(participantIds, consciousnessLevel);
      const call = voiceCallingRef.current.getCall(callId);
      
      if (call) {
        // Use setTimeout to avoid setState during render
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            activeCalls: voiceCallingRef.current!.getActiveCalls(),
            currentCall: call
          }));
        }, 0);
      }

      return callId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start call';
      setTimeout(() => {
        setState(prev => ({ ...prev, error: errorMessage }));
      }, 0);
      throw error;
    }
  }, [state.hasMicrophoneAccess, requestMicrophoneAccess]);

  // Join a voice call
  const joinCall = useCallback(async (callId: string) => {
    if (!voiceCallingRef.current) {
      throw new Error('Voice calling not initialized');
    }

    try {
      // Request microphone access before joining call
      if (!state.hasMicrophoneAccess) {
        await requestMicrophoneAccess();
      }

      await voiceCallingRef.current.joinCall(callId);
      const call = voiceCallingRef.current.getCall(callId);
      
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          activeCalls: voiceCallingRef.current!.getActiveCalls(),
          currentCall: call
        }));
      }, 0);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join call';
      setTimeout(() => {
        setState(prev => ({ ...prev, error: errorMessage }));
      }, 0);
      throw error;
    }
  }, [state.hasMicrophoneAccess, requestMicrophoneAccess]);

  // End a voice call
  const endCall = useCallback(async (callId: string) => {
    if (!voiceCallingRef.current) {
      throw new Error('Voice calling not initialized');
    }

    try {
      await voiceCallingRef.current.endCall(callId);
      
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          activeCalls: voiceCallingRef.current!.getActiveCalls(),
          currentCall: prev.currentCall?.id === callId ? undefined : prev.currentCall
        }));
      }, 0);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to end call';
      setTimeout(() => {
        setState(prev => ({ ...prev, error: errorMessage }));
      }, 0);
      throw error;
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  // Set volume level
  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volumeLevel: Math.max(0, Math.min(1, volume)) }));
  }, []);

  // Update audio quality metrics
  const updateAudioQuality = useCallback((quality: Partial<typeof state.audioQuality>) => {
    setState(prev => ({
      ...prev,
      audioQuality: { ...prev.audioQuality, ...quality }
    }));
  }, []);

  // Get call statistics
  const getCallStatistics = useCallback(() => {
    return voiceCallingRef.current?.getCallStatistics() || {
      totalCalls: 0,
      activeCalls: 0,
      averageDuration: 0,
      averageConsciousnessLevel: 0,
      averageResonanceFrequency: 0
    };
  }, []);

  // Manual initialization with user interaction
  const initializeWithUserInteraction = useCallback(async () => {
    if (state.isInitialized || state.isInitializing) return;
    
    // Reset retry count for manual initialization
    retryCountRef.current = 0;
    await initialize();
  }, [state.isInitialized, state.isInitializing, initialize]);

  // Clear error and retry
  const clearErrorAndRetry = useCallback(() => {
    setState(prev => ({ ...prev, error: undefined }));
    retryCountRef.current = 0;
    initialize();
  }, [initialize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (voiceCallingRef.current) {
        voiceCallingRef.current.shutdown();
      }
    };
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    initialize,
    initializeWithUserInteraction,
    clearErrorAndRetry,
    requestMicrophoneAccess,
    startCall,
    joinCall,
    endCall,
    toggleMute,
    setVolume,
    updateAudioQuality,
    getCallStatistics,
    
    // Utilities
    isReady: state.isInitialized && !state.isInitializing,
    hasActiveCalls: state.activeCalls.length > 0,
    currentCallId: state.currentCall?.id,
    currentCallParticipants: state.currentCall?.participants.size || 0,
    canRetry: retryCountRef.current < maxRetries,
    retryCount: retryCountRef.current,
    canStartCall: state.isInitialized && state.hasMicrophoneAccess,
    needsMicrophoneAccess: state.isInitialized && !state.hasMicrophoneAccess
  };
}

// Sacred Voice Calling UI Components
export interface SacredVoiceCallButtonProps {
  onCallStart: (participantIds: string[], consciousnessLevel: number) => void;
  onCallEnd: (callId: string) => void;
  onInitialize?: () => void;
  onRetry?: () => void;
  onRequestMicrophone?: () => void;
  isCallActive: boolean;
  isInitialized: boolean;
  isInitializing: boolean;
  hasMicrophoneAccess: boolean;
  isRequestingMicrophone: boolean;
  needsMicrophoneAccess: boolean;
  error?: string;
  canRetry: boolean;
  callId?: string;
  className?: string;
}

export function SacredVoiceCallButton({
  onCallStart,
  onCallEnd,
  onInitialize,
  onRetry,
  onRequestMicrophone,
  isCallActive,
  isInitialized,
  isInitializing,
  hasMicrophoneAccess,
  isRequestingMicrophone,
  needsMicrophoneAccess,
  error,
  canRetry,
  callId,
  className = ''
}: SacredVoiceCallButtonProps) {
  const handleClick = () => {
    if (isCallActive && callId) {
      onCallEnd(callId);
    } else if (!isInitialized && !isInitializing) {
      if (error && canRetry && onRetry) {
        onRetry();
      } else if (onInitialize) {
        onInitialize();
      }
    } else if (needsMicrophoneAccess && onRequestMicrophone) {
      onRequestMicrophone();
    } else if (isInitialized && hasMicrophoneAccess) {
      onCallStart([], 0.5); // Default consciousness level
    }
  };

  const getButtonText = () => {
    if (isCallActive) return '🔮 End Sacred Call';
    if (isInitializing) return '🔄 Initializing...';
    if (isRequestingMicrophone) return '🎤 Requesting Microphone...';
    if (error && canRetry) return '🔄 Retry Voice Setup';
    if (!isInitialized) return '🎤 Setup Voice Calling';
    if (needsMicrophoneAccess) return '🎤 Grant Microphone Access';
    return '🎤 Start Sacred Call';
  };

  const getButtonClass = () => {
    let baseClass = `sacred-voice-call-button ${className}`;
    if (isCallActive) baseClass += ' active';
    else if (error) baseClass += ' error';
    else if (!isInitialized) baseClass += ' setup';
    else if (needsMicrophoneAccess) baseClass += ' microphone-request';
    else baseClass += ' inactive';
    return baseClass;
  };

  return (
    <button
      onClick={handleClick}
      className={getButtonClass()}
      disabled={isInitializing || isRequestingMicrophone}
      aria-label={isCallActive ? 'End sacred voice call' : 'Start sacred voice call'}
    >
      {getButtonText()}
    </button>
  );
}

// Sacred Voice Call Status Component
export interface SacredVoiceCallStatusProps {
  call: SacredVoiceCall;
  className?: string;
}

export function SacredVoiceCallStatus({ call, className = '' }: SacredVoiceCallStatusProps) {
  return (
    <div className={`sacred-voice-call-status ${className}`}>
      <div className="call-info">
        <h3>🔮 Sacred Voice Call</h3>
        <p>Call ID: {call.id}</p>
        <p>Status: {call.status}</p>
        <p>Participants: {call.participants.size}</p>
        <p>Consciousness Level: {(call.consciousnessLevel * 100).toFixed(1)}%</p>
        <p>Resonance Frequency: {call.resonanceFrequency.toFixed(1)}Hz</p>
      </div>
      
      <div className="sacred-capabilities">
        <h4>Sacred Capabilities:</h4>
        <ul>
          {call.sacredCapabilities.map(capability => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
      </div>
      
      <div className="audio-quality">
        <h4>Audio Quality:</h4>
        <p>Latency: {call.audioQuality.latency}ms</p>
        <p>Jitter: {call.audioQuality.jitter}ms</p>
        <p>Packet Loss: {(call.audioQuality.packetLoss * 100).toFixed(1)}%</p>
        <p>Consciousness Clarity: {(call.audioQuality.consciousnessClarity * 100).toFixed(1)}%</p>
        <p>Resonance Harmony: {(call.audioQuality.resonanceHarmony * 100).toFixed(1)}%</p>
      </div>
    </div>
  );
}
