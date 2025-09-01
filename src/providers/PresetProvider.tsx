/**
 * Preset Provider - Manages GAA presets and tradition-specific configurations
 */
import React, { createContext, useContext, useState } from 'react';
import { TarotTradition, PolarityProtocol } from '@/types/gaa-polarity';

interface GAAPreset {
  id: string;
  name: string;
  tradition: TarotTradition;
  archetype: string;
  polarity: PolarityProtocol;
  audioParams: {
    darkPhaseHonor: number; // seconds
    thetaAMDepth: number;
    macroPulseAudible: boolean;
    limitThreshold: number; // dBFS
    rebuildTime: number; // ms
  };
  description?: string;
}

interface PresetContextType {
  presets: GAAPreset[];
  currentPreset: GAAPreset | null;
  loadPreset: (presetId: string) => void;
  createPreset: (preset: Omit<GAAPreset, 'id'>) => string;
  updatePreset: (presetId: string, updates: Partial<GAAPreset>) => void;
  deletePreset: (presetId: string) => void;
  moonPresetByTradition: (tradition: TarotTradition) => GAAPreset;
  towerPresetByTradition: (tradition: TarotTradition) => GAAPreset;
  devilPresetByTradition: (tradition: TarotTradition) => GAAPreset;
  deathPresetByTradition: (tradition: TarotTradition) => GAAPreset;
  sunPresetByTradition: (tradition: TarotTradition) => GAAPreset;
}

const PresetContext = createContext<PresetContextType | null>(null);

export const usePresets = () => {
  const context = useContext(PresetContext);
  if (!context) {
    throw new Error('usePresets must be used within PresetProvider');
  }
  return context;
};

// Default presets for each archetype and tradition
const createDefaultPresets = (): GAAPreset[] => {
  const traditions: TarotTradition[] = ['marseille', 'rws', 'thoth', 'etteilla'];
  const presets: GAAPreset[] = [];

  traditions.forEach(tradition => {
    // Moon XVIII presets
    presets.push({
      id: `moon_${tradition}`,
      name: `Moon XVIII - ${tradition.toUpperCase()}`,
      tradition,
      archetype: 'moon',
      polarity: {
        lightChannel: { enabled: true, amplitude: tradition === 'etteilla' ? 0.4 : 0.6, phase: 0, resonanceMode: 'harmonic' },
        darkChannel: { enabled: true, amplitude: tradition === 'etteilla' ? 0.6 : 0.4, phase: Math.PI, resonanceMode: 'chaotic' },
        polarityBalance: tradition === 'etteilla' ? -0.2 : 0.2,
        darkEnergyDrift: { driftRate: 0.05, expansionFactor: 1.2 },
        timestamp: Date.now()
      },
      audioParams: {
        darkPhaseHonor: tradition === 'rws' ? 120 : tradition === 'marseille' ? 150 : tradition === 'thoth' ? 140 : 90,
        thetaAMDepth: 0.15,
        macroPulseAudible: true,
        limitThreshold: -3.0,
        rebuildTime: 300
      }
    });

    // Tower XVI presets
    presets.push({
      id: `tower_${tradition}`,
      name: `Tower XVI - ${tradition.toUpperCase()}`,
      tradition,
      archetype: 'tower',
      polarity: {
        lightChannel: { enabled: true, amplitude: 0.3, phase: 0, resonanceMode: 'harmonic' },
        darkChannel: { enabled: true, amplitude: 0.7, phase: Math.PI, resonanceMode: 'chaotic' },
        polarityBalance: -0.7,
        darkEnergyDrift: { driftRate: 0.1, expansionFactor: 1.5 },
        timestamp: Date.now()
      },
      audioParams: {
        darkPhaseHonor: 60,
        thetaAMDepth: 0.05,
        macroPulseAudible: false,
        limitThreshold: 0.0, // Exactly at 0dBFS
        rebuildTime: 600
      }
    });

    // Devil XV presets
    presets.push({
      id: `devil_${tradition}`,
      name: `Devil XV - ${tradition.toUpperCase()}`,
      tradition,
      archetype: 'devil',
      polarity: {
        lightChannel: { enabled: true, amplitude: 0.2, phase: 0, resonanceMode: 'harmonic' },
        darkChannel: { enabled: true, amplitude: 0.8, phase: Math.PI, resonanceMode: 'chaotic' },
        polarityBalance: -0.8,
        darkEnergyDrift: { driftRate: 0.15, expansionFactor: 1.8 },
        timestamp: Date.now()
      },
      audioParams: {
        darkPhaseHonor: 30,
        thetaAMDepth: 0.25,
        macroPulseAudible: true,
        limitThreshold: -6.0,
        rebuildTime: 200
      }
    });

    // Death XIII presets
    presets.push({
      id: `death_${tradition}`,
      name: `Death XIII - ${tradition.toUpperCase()}`,
      tradition,
      archetype: 'death',
      polarity: {
        lightChannel: { enabled: true, amplitude: 0.5, phase: 0, resonanceMode: 'harmonic' },
        darkChannel: { enabled: true, amplitude: 0.5, phase: Math.PI, resonanceMode: 'adaptive' },
        polarityBalance: 0,
        darkEnergyDrift: { driftRate: 0.08, expansionFactor: 1.3 },
        timestamp: Date.now()
      },
      audioParams: {
        darkPhaseHonor: 45,
        thetaAMDepth: 0.1,
        macroPulseAudible: false,
        limitThreshold: -9.0,
        rebuildTime: 800
      }
    });

    // Sun XIX presets
    presets.push({
      id: `sun_${tradition}`,
      name: `Sun XIX - ${tradition.toUpperCase()}`,
      tradition,
      archetype: 'sun',
      polarity: {
        lightChannel: { enabled: true, amplitude: 0.8, phase: 0, resonanceMode: 'harmonic' },
        darkChannel: { enabled: true, amplitude: 0.2, phase: Math.PI, resonanceMode: 'harmonic' },
        polarityBalance: 0.8,
        darkEnergyDrift: { driftRate: 0.02, expansionFactor: 1.1 },
        timestamp: Date.now()
      },
      audioParams: {
        darkPhaseHonor: 25,
        thetaAMDepth: 0.05,
        macroPulseAudible: true,
        limitThreshold: -12.0,
        rebuildTime: 400
      }
    });
  });

  return presets;
};

interface PresetProviderProps {
  children: React.ReactNode;
}

export const PresetProvider: React.FC<PresetProviderProps> = ({ children }) => {
  const [presets, setPresets] = useState<GAAPreset[]>(createDefaultPresets());
  const [currentPreset, setCurrentPreset] = useState<GAAPreset | null>(null);

  const loadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setCurrentPreset(preset);
    }
  };

  const createPreset = (preset: Omit<GAAPreset, 'id'>): string => {
    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPreset = { ...preset, id };
    setPresets(prev => [...prev, newPreset]);
    return id;
  };

  const updatePreset = (presetId: string, updates: Partial<GAAPreset>) => {
    setPresets(prev => prev.map(p => 
      p.id === presetId ? { ...p, ...updates } : p
    ));
    if (currentPreset?.id === presetId) {
      setCurrentPreset(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deletePreset = (presetId: string) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
    if (currentPreset?.id === presetId) {
      setCurrentPreset(null);
    }
  };

  // Helper functions for archetype-specific presets
  const moonPresetByTradition = (tradition: TarotTradition): GAAPreset => {
    return presets.find(p => p.archetype === 'moon' && p.tradition === tradition) || presets[0];
  };

  const towerPresetByTradition = (tradition: TarotTradition): GAAPreset => {
    return presets.find(p => p.archetype === 'tower' && p.tradition === tradition) || presets[0];
  };

  const devilPresetByTradition = (tradition: TarotTradition): GAAPreset => {
    return presets.find(p => p.archetype === 'devil' && p.tradition === tradition) || presets[0];
  };

  const deathPresetByTradition = (tradition: TarotTradition): GAAPreset => {
    return presets.find(p => p.archetype === 'death' && p.tradition === tradition) || presets[0];
  };

  const sunPresetByTradition = (tradition: TarotTradition): GAAPreset => {
    return presets.find(p => p.archetype === 'sun' && p.tradition === tradition) || presets[0];
  };

  return (
    <PresetContext.Provider value={{
      presets,
      currentPreset,
      loadPreset,
      createPreset,
      updatePreset,
      deletePreset,
      moonPresetByTradition,
      towerPresetByTradition,
      devilPresetByTradition,
      deathPresetByTradition,
      sunPresetByTradition
    }}>
      {children}
    </PresetContext.Provider>
  );
};