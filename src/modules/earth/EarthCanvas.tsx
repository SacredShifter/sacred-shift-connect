import React, { useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMachine } from '@xstate/react';
import { earthMachine } from './machine';
import { EarthProvider } from './context/EarthContext';
import { EarthResonanceMap, Node, MeshLink } from '@/components/EarthResonanceMap';
import { StorytellingOverlay } from '@/components/StorytellingOverlay';
import { HUD } from './ui/HUD';
import { AudioEngine } from './audio/AudioEngine';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useCollectiveGAA } from '@/hooks/useCollectiveGAA';

interface ReconnectionWithLivingEarthProps {
  onExit?: () => void;
}

// Wrapper component to use the hook for the 3D map
const EarthResonanceMapWrapper = () => {
    const { collectiveField } = useCollectiveGAA();

    const nodes: Node[] = useMemo(() => {
        if (!collectiveField || !collectiveField.participantStates) return [];
        // @ts-ignore
        return Object.values(collectiveField.participantStates).map((p: any) => ({
            id: p.userId,
            lat: p.lat ?? Math.random() * 180 - 90, // Fuzzed geolocation
            lon: p.lon ?? Math.random() * 360 - 180,
            glowSize: p.resonance,
            color: p.polarity > 0 ? '#88ffff' : '#ff88cc',
            pulseSpeed: p.coherence * 2,
        }));
    }, [collectiveField]);

    const links: MeshLink[] = useMemo(() => {
        // A simple link logic: connect each node to the next one in the list
        if (nodes.length < 2) return [];
        return nodes.slice(0, -1).map((node, i) => ({
            from: node.id,
            to: nodes[i+1].id
        }));
    }, [nodes]);

    return (
        <EarthResonanceMap
            nodes={nodes}
            links={links}
            planetaryGlow={collectiveField?.globalCoherence ?? 0}
            auroraIntensity={collectiveField?.regionalCoherence?.north_pole ?? 0}
        />
    );
}

// Wrapper component for the storytelling overlay
const StorytellingWrapper = () => {
    const { collectiveField } = useCollectiveGAA();
    return (
        <StorytellingOverlay
            nodeCount={collectiveField?.nodeCount ?? 0}
            globalCoherence={collectiveField?.globalCoherence ?? 0}
        />
    )
}


export default function ReconnectionWithLivingEarth({ onExit }: ReconnectionWithLivingEarthProps) {
  const [state, send] = useMachine(earthMachine);

  // Default exit handler if none provided
  const handleExit = onExit || (() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/learning-3d';
    }
  });

  useEffect(() => {
    send({ type: 'START' });
  }, [send]);

  return (
    <ErrorBoundary name="ReconnectionWithLivingEarth">
      <EarthProvider value={{ state, send, onExit: handleExit }}>
        <div className="fixed inset-0 bg-gradient-to-b from-green-900 to-brown-900 z-[100]">
          <Canvas
            dpr={[1, 2]}
            shadows
            camera={{ 
              position: [0, 2, 8], 
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
            <EarthResonanceMapWrapper />
          </Canvas>
          
          <HUD />
          <StorytellingWrapper />
          <AudioEngine />
        </div>
      </EarthProvider>
    </ErrorBoundary>
  );
}