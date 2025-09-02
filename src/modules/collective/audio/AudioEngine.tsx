import React, { useEffect } from 'react';
import { useGAAEngine } from '@/hooks/useGAAEngine';
import { CollectiveField } from '@/modules/collective/CollectiveReceiver';

interface AudioEngineProps {
    collectiveField: CollectiveField | null;
    phase: number;
    coherence: number;
}

export const AudioEngine: React.FC<AudioEngineProps> = ({ collectiveField, phase, coherence }) => {
    const { startGAA, stopGAA, state } = useGAAEngine(collectiveField);

    useEffect(() => {
        startGAA();
        return () => {
            stopGAA();
        };
    }, [startGAA, stopGAA]);

    // This component doesn't render anything, it just runs the audio engine.
    return null;
};