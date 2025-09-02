import { useState, useEffect } from 'react';
import { GeometricOscillator, FallbackCounts } from '@/utils/gaa/GeometricOscillator';
import { MultiScaleLayerManager } from '@/utils/gaa/MultiScaleLayerManager';

export interface GAAHealthState {
  fallbackCounts: FallbackCounts & { geometry: number };
  lastError: { id: string, error: string } | null;
}

export const useGAAHealth = (
  geometricOscillator: GeometricOscillator | null,
  layerManager: MultiScaleLayerManager | null
) => {
  const [health, setHealth] = useState<GAAHealthState>({
    fallbackCounts: { frequency: 0, geometry: 0 },
    lastError: null,
  });

  useEffect(() => {
    if (!geometricOscillator || !layerManager) return;

    const handleOscillatorError = (errorData: { id: string, error: any }) => {
      setHealth(prev => ({
        ...prev,
        lastError: { id: errorData.id, error: errorData.error.message || 'Unknown oscillator error' },
      }));
    };

    const updateCounts = () => {
        setHealth(prev => ({
            ...prev,
            fallbackCounts: {
                frequency: geometricOscillator.fallbackCounts.frequency,
                geometry: layerManager.fallbackCounts.geometry,
            }
        }));
    };

    geometricOscillator.on('oscillatorError', handleOscillatorError);
    layerManager.on('geometryFallback', updateCounts);

    // Initial count update
    updateCounts();

    return () => {
      // In a real implementation, we would need an `off` method to unsubscribe
      // For now, this is sufficient as the hook's lifecycle is tied to the engine's.
    };
  }, [geometricOscillator, layerManager]);

  return health;
};
