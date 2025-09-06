/**
 * App Routes - Main routing configuration for GAA application
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GAADashboard } from '@/components/gaa/GAADashboard';
import { CosmicVisualization } from '@/components/gaa/CosmicVisualization';
import { SessionMetrics } from '@/components/gaa/SessionMetrics';
import SacredVoiceCallingDemo from '@/pages/SacredVoiceCallingDemo';
import TransferHub from '@/routes/transfer';
import GuardianSacredResonanceChamber from '@/pages/GuardianSacredResonanceChamber';
import MicroResetPage from '@/pages/MicroResetPage';

// Mock data for standalone routes
const mockCosmicData = [
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy',
    type: 'galaxy' as const,
    coordinates: { rightAscension: 10.68, declination: 41.27, distance: 2537000 },
    physicalProperties: { mass: 1.5e12, diameter: 220000 },
    geometricSignature: {
      vertices: [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
      boundingBox: { min: [0, 0, 0], max: [1, 1, 1] },
      sacredRatios: { phi: 1.618, pi: 3.14159, sqrt2: 1.414 }
    },
    audioMapping: { baseFrequency: 440, harmonicSeries: [1, 2, 3], amplitude: 0.5, duration: 10 },
    discoveryInfo: { confidence: 'confirmed' as const }
  }
];

const mockGAAEngineState = {
  isInitialized: true,
  isPlaying: false,
  currentPhase: 'idle' as const,
  oscillatorCount: 0,
  currentGeometry: { complexity: 0.5, vertices: 8, faces: 6 },
  biofeedbackIntegration: false,
  lastUpdate: Date.now()
};

// Tarot Mode - showcases all archetypes
const TarotMode: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tarot Archetypes</h1>
      <div className="text-center text-muted-foreground">
        Deep5 Archetype selector will be displayed here
      </div>
    </div>
  );
};

// Cosmic Visualization standalone page
const CosmicPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cosmic Visualization</h1>
      <div className="h-[600px]">
        <CosmicVisualization 
          cosmicData={mockCosmicData}
          shadowEngineState={null}
          isActive={true}
        />
      </div>
    </div>
  );
};

// Session Metrics standalone page
const MetricsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Session Metrics</h1>
      <SessionMetrics
        biofeedbackState={null}
        gaaEngineState={mockGAAEngineState}
        sessionDuration={300000}
        safetyAlerts={[]}
        isActive={false}
      />
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/gaa" element={<GAADashboard />} />
      <Route path="/gaa/archetypes" element={<TarotMode />} />
      <Route path="/gaa/cosmic" element={<CosmicPage />} />
      <Route path="/gaa/metrics" element={<MetricsPage />} />
      <Route path="/sacred-voice-calling" element={<SacredVoiceCallingDemo />} />
      <Route path="/transfer" element={<TransferHub />} />
      <Route path="/guardian-chamber" element={<GuardianSacredResonanceChamber />} />
      <Route path="/micro-reset" element={<MicroResetPage />} />
      <Route path="*" element={<GAADashboard />} />
    </Routes>
  );
};