import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMachine } from '@xstate/react';
import { collectiveMachine } from './machine';
import { CollectiveProvider } from './context/CollectiveContext';
import { SceneRouter } from './scenes/SceneRouter';
import { HUD } from './ui/HUD';
import { AudioEngine } from './audio/AudioEngine';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useCollectiveGAA } from '@/hooks/useCollectiveGAA';
import { RemoteAudioPlayer } from '@/components/RemoteAudioPlayer';
import { CollectiveStats } from '@/components/Collective/CollectiveStats';
import * as Tone from 'tone';

interface CollectiveCoherenceCircleProps {
  onExit: () => void;
}

import { useState, useRef } from 'react';

export default function CollectiveCoherenceCircle({ onExit }: CollectiveCoherenceCircleProps) {
  const [machineState, send] = useMachine(collectiveMachine);
  const {
    remoteStreams,
    joinSession,
    createSession,
    collectiveField,
    phase,
    coherence,
    connectionStatus,
    getParticipantLatency
  } = useCollectiveGAA(Tone.Transport);
  const [showBanner, setShowBanner] = useState('');
  const prevConnectionStatus = useRef(connectionStatus);

  useEffect(() => {
    // For demonstration, let's automatically join a session
    // In a real app, this would be driven by UI events
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    if (sessionId) {
      joinSession(sessionId);
    } else {
      createSession();
    }
  }, [joinSession, createSession]);

  useEffect(() => {
    if (prevConnectionStatus.current === 'connected' && connectionStatus !== 'connected') {
      setShowBanner('unstable');
    } else if (prevConnectionStatus.current !== 'connected' && connectionStatus === 'connected') {
      setShowBanner('restored');
      setTimeout(() => setShowBanner(''), 3000);
    }
    prevConnectionStatus.current = connectionStatus;
  }, [connectionStatus]);

  return (
    <ErrorBoundary name="CollectiveCoherenceCircle">
      <CollectiveProvider value={{ state: machineState, send, onExit }}>
        <div className="fixed inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
          <Canvas
            dpr={[1, 2]}
            shadows
            camera={{ 
              position: [0, 5, 12], 
              fov: 60,
              near: 0.1,
              far: 1000 
            }}
            gl={{ 
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance'
            }}
          >
            <SceneRouter coherence={coherence} />
          </Canvas>
          
          <HUD onStartAudio={() => {}} />
          <AudioEngine collectiveField={collectiveField} phase={phase} coherence={coherence} />
          <RemoteAudioPlayer streams={remoteStreams} />
          <CollectiveStats collectiveField={collectiveField} coherence={coherence} latency={getParticipantLatency('')} />
          {showBanner === 'unstable' && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black p-2 rounded-md">
              ⚠️ Sync unstable – falling back to solo mode.
            </div>
          )}
          {showBanner === 'restored' && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white p-2 rounded-md">
              ✅ Collective resonance restored.
            </div>
          )}
        </div>
      </CollectiveProvider>
    </ErrorBoundary>
  );
}