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
import * as Tone from 'tone';

interface CollectiveCoherenceCircleProps {
  onExit: () => void;
}

const CollectiveGAAWrapper = ({ onStartAudio }: { onStartAudio: () => void }) => {
  const { remoteStreams, joinSession, createSession } = useCollectiveGAA(Tone.Transport);

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

  return (
    <>
      <SceneRouter />
      <RemoteAudioPlayer streams={remoteStreams} />
    </>
  );
};


export default function CollectiveCoherenceCircle({ onExit }: CollectiveCoherenceCircleProps) {
  const [state, send] = useMachine(collectiveMachine);
  const { startAudioStreaming } = useCollectiveGAA(Tone.Transport);

  return (
    <ErrorBoundary name="CollectiveCoherenceCircle">
      <CollectiveProvider value={{ state, send, onExit }}>
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
            <CollectiveGAAWrapper onStartAudio={startAudioStreaming} />
          </Canvas>
          
          <HUD onStartAudio={startAudioStreaming} />
          <AudioEngine />
        </div>
      </CollectiveProvider>
    </ErrorBoundary>
  );
}