/**
 * GAA Master Dashboard - Main interface for all GAA components
 * Integrates Deep5 Archetypes, CosmicVis, Biofeedback, Orchestra, and Metrics
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Shield,
  Users,
  Brain,
  Sun,
  Moon as MoonIcon,
  Info,
  BookOpen,
  Star,
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useGAAEngine } from '@/hooks/useGAAEngine';
import { useEmbodiedBiofeedback } from '@/hooks/useEmbodiedBiofeedback';
import { useCollectiveGAA } from '@/hooks/useCollectiveGAA';
import { SessionMetrics } from './SessionMetrics';
import { CosmicVisualization } from './CosmicVisualization';
import { GAAInfoPanel } from './GAAInfoPanel';
import { GAADemoMode } from './GAADemoMode';
import { CosmicVisualizationLegend } from './CosmicVisualizationLegend';
import { PolarityProtocol, TarotTradition } from '@/types/gaa-polarity';
import { FLAGS } from '@/config/flags';

// Archetype imports
import { MoonXVIII } from './archetypes/MoonXVIII';
import { TowerXVI } from './archetypes/TowerXVI';
import { DevilXV } from './archetypes/DevilXV';
import { DeathXIII } from './archetypes/DeathXIII';
import { SunXIX } from './archetypes/SunXIX';

const DEEP5_ARCHETYPES = [
  { id: 'moon', name: 'Moon XVIII', component: MoonXVIII },
  { id: 'tower', name: 'Tower XVI', component: TowerXVI },
  { id: 'devil', name: 'Devil XV', component: DevilXV },
  { id: 'death', name: 'Death XIII', component: DeathXIII },
  { id: 'sun', name: 'Sun XIX', component: SunXIX }
] as const;

interface GAADashboardProps {
  className?: string;
}

export const GAADashboard: React.FC<GAADashboardProps> = ({ className = '' }) => {
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [tradition, setTradition] = useState<TarotTradition>('rws');
  const [polarity, setPolarity] = useState<PolarityProtocol>({
    lightChannel: { enabled: true, amplitude: 0.7, phase: 0, resonanceMode: 'harmonic' },
    darkChannel: { enabled: true, amplitude: 0.3, phase: Math.PI, resonanceMode: 'chaotic' },
    polarityBalance: 0.3,
    darkEnergyDrift: { driftRate: 0.05, expansionFactor: 1.2 }
  });
  const [sessionStartTime] = useState(Date.now());
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [firmamentVisible, setFirmamentVisible] = useState(true);
  const [shadowDomeVisible, setShadowDomeVisible] = useState(true);
  const [sessionBadges, setSessionBadges] = useState<string[]>([]);

  // Core hooks
  const gaaEngine = useGAAEngine();
  const biofeedback = useEmbodiedBiofeedback();
  const orchestra = useCollectiveGAA();

  // Transport controls
  const handlePlay = async () => {
    console.log('🎮 Play button pressed - START OF FUNCTION');
    alert('Play button clicked!'); // Visual feedback
    
    try {
      console.log('🔍 Current GAA Engine state:', {
        isInitialized: gaaEngine.isInitialized,
        isPlaying: gaaEngine.isPlaying,
        activeOscillators: gaaEngine.activeOscillators
      });
      
      if (!gaaEngine.isInitialized) {
        console.log('🔧 Engine not initialized, initializing...');
        const result = await gaaEngine.initializeGAA();
        console.log('🔧 Initialize result:', result);
      }
      
      console.log('▶️ Starting GAA...');
      await gaaEngine.startGAA();
      console.log('✅ GAA started successfully');
    } catch (error) {
      console.error('❌ Error in handlePlay:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleStop = async () => {
    console.log('⏹️ Stop button pressed - START OF FUNCTION');
    alert('Stop button clicked!'); // Visual feedback
    
    try {
      await gaaEngine.stopGAA();
      console.log('✅ GAA stopped successfully');
    } catch (error) {
      console.error('❌ Error in handleStop:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handlePanic = () => {
    setPolarity(prev => ({
      ...prev,
      polarityBalance: 0.9, // Full light
      lightChannel: { ...prev.lightChannel, amplitude: 1.0 },
      darkChannel: { ...prev.darkChannel, amplitude: 0.1 }
    }));
  };

  const handleLightBias = () => {
    setPolarity(prev => ({
      ...prev,
      polarityBalance: prev.polarityBalance > 0.5 ? 0.3 : 0.8
    }));
  };

  // Mock orchestra metrics
  const mockOrchestraMetrics = orchestra.sessionId ? {
    phaseError: Math.floor(Math.random() * 100) + 20, // 20-120ms
    participantCount: orchestra.participants.length,
    syncQuality: (orchestra.participants.length > 2 ? 'excellent' : 'good') as 'excellent' | 'good' | 'poor'
  } : undefined;

  // Handle demo mode changes
  const handleDemoArchetypeChange = (archetypeId: string) => {
    setSelectedArchetype(archetypeId);
  };

  const handleDemoTraditionChange = (newTradition: TarotTradition) => {
    setTradition(newTradition);
  };

  // Handle completion badge (demo feature)
  const handleCompletionBadge = (badge: string) => {
    if (!sessionBadges.includes(badge)) {
      setSessionBadges(prev => [...prev, badge]);
    }
  };

  const sessionDuration = Date.now() - sessionStartTime;
  const safetyAlerts = [
    ...(biofeedback.biofeedbackState?.heartRateVariability && 
        biofeedback.biofeedbackState.heartRateVariability < 20 ? ['HRV low - monitoring'] : []),
    ...(gaaEngine.shadowEngine ? ['Shadow engine active'] : []),
    ...(orchestra.connectionStatus === 'error' ? ['Orchestra connection error'] : [])
  ];

  // Mock cosmic data for visualization
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
      discoveryMetadata: { confidence: 'confirmed' as const }
    }
  ];

  return (
    <div className={`space-y-6 p-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">GAA Dashboard</h1>
          <p className="text-muted-foreground">
            Geometrically Aligned Audio • Deep5 Protocol
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInfoPanel(true)}
            className="mt-3"
          >
            <Info className="w-4 h-4 mr-2" />
            Learn GAA
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={gaaEngine.isPlaying ? 'default' : 'secondary'}>
            {gaaEngine.isPlaying ? 'Active' : 'Idle'}
          </Badge>
          {FLAGS.orchestra && orchestra.sessionId && (
            <Badge variant="outline">
              <Users className="w-3 h-3 mr-1" />
              {orchestra.participants.length}
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Transport Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={gaaEngine.isPlaying ? 'secondary' : 'default'}
                size="sm"
                onClick={handlePlay}
                disabled={gaaEngine.isPlaying}
              >
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStop}
                disabled={!gaaEngine.isPlaying}
              >
                <Square className="w-4 h-4 mr-1" />
                Stop
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="destructive"
                size="sm"
                onClick={handlePanic}
              >
                <Shield className="w-4 h-4 mr-1" />
                Panic
              </Button>
              <Button
                variant={polarity.polarityBalance > 0.5 ? 'secondary' : 'outline'}
                size="sm"
                onClick={handleLightBias}
              >
                <Sun className="w-4 h-4 mr-1" />
                Light Bias
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${polarity.polarityBalance * 100}%` }}
                  />
                </div>
              </div>
              {FLAGS.embodiedBiofeedback && (
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <Badge variant={biofeedback.isConnected ? 'default' : 'secondary'}>
                    {biofeedback.isConnected ? 'Connected' : 'Offline'}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Polarity Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MoonIcon className="w-5 h-5" />
                Polarity Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Polarity Balance</label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value={polarity.polarityBalance}
                  onChange={(e) => setPolarity(prev => ({
                    ...prev,
                    polarityBalance: parseFloat(e.target.value)
                  }))}
                  className="w-full mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {polarity.polarityBalance > 0 ? 'Light' : 'Dark'} ({Math.abs(polarity.polarityBalance * 100).toFixed(0)}%)
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Light Channel</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={polarity.lightChannel.amplitude}
                    onChange={(e) => setPolarity(prev => ({
                      ...prev,
                      lightChannel: { ...prev.lightChannel, amplitude: parseFloat(e.target.value) }
                    }))}
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Dark Channel</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={polarity.darkChannel.amplitude}
                    onChange={(e) => setPolarity(prev => ({
                      ...prev,
                      darkChannel: { ...prev.darkChannel, amplitude: parseFloat(e.target.value) }
                    }))}
                    className="w-full mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Archetype Quick Pick */}
          {FLAGS.tarotDeep5 && (
            <Card>
              <CardHeader>
                <CardTitle>Deep5 Archetypes</CardTitle>
                <div className="flex gap-2">
                  {(['marseille', 'rws', 'thoth', 'etteilla'] as TarotTradition[]).map((t) => {
                    const provenanceText = {
                      marseille: 'c.1650-1760 • Original Tarot de Marseille tradition',
                      rws: '1909 • Rider-Waite-Smith deck by Pamela Colman Smith',
                      thoth: '1969 • Aleister Crowley & Lady Frieda Harris collaboration', 
                      etteilla: '1788 • First printed Tarot for divination by Etteilla'
                    }[t];
                    
                    return (
                      <Button
                        key={t}
                        variant={tradition === t ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTradition(t)}
                        title={provenanceText}
                      >
                        {t.toUpperCase()}
                      </Button>
                    );
                  })}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {DEEP5_ARCHETYPES.map(({ id, name, component: Component }) => (
                    <Component
                      key={id}
                      tradition={tradition}
                      polarity={polarity}
                      isActive={selectedArchetype === id}
                      onActivate={() => setSelectedArchetype(
                        selectedArchetype === id ? null : id
                      )}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Demo Mode Panel */}
          <GAADemoMode
            isActive={isDemoMode}
            onToggle={() => setIsDemoMode(!isDemoMode)}
            onArchetypeChange={handleDemoArchetypeChange}
            onTraditionChange={handleDemoTraditionChange}
          />

          {/* Biofeedback Status */}
          {FLAGS.embodiedBiofeedback && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Biofeedback Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">HRV</div>
                    <div className="text-lg font-bold">
                      {biofeedback.biofeedbackState?.heartRateVariability?.toFixed(0) || '--'} ms
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Breathing</div>
                    <div className="text-lg font-bold">
                      {biofeedback.biofeedbackState?.breathingRate?.toFixed(1) || '--'}/min
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Alpha</div>
                    <div className="text-lg font-bold">
                      {biofeedback.biofeedbackState?.brainwaveAlpha ? 
                        `${(biofeedback.biofeedbackState.brainwaveAlpha * 100).toFixed(0)}%` : '--'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Skin Conductance</div>
                    <div className="text-lg font-bold">
                      {biofeedback.biofeedbackState?.skinConductance ? 
                        `${(biofeedback.biofeedbackState.skinConductance * 100).toFixed(0)}%` : '--'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Cosmic Visualization */}
          {FLAGS.cosmicVisV2 && (
            <Card>
              <CardHeader>
                <CardTitle>Cosmic Now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <CosmicVisualization 
                    cosmicData={mockCosmicData}
                    shadowEngineState={gaaEngine.shadowEngine}
                    isActive={gaaEngine.isPlaying}
                  />
                </div>
                
                {/* Cosmic Visualization Legend */}
                <CosmicVisualizationLegend
                  firmamentVisible={firmamentVisible}
                  shadowDomeVisible={shadowDomeVisible}
                  onFirmamentToggle={() => setFirmamentVisible(!firmamentVisible)}
                  onShadowDomeToggle={() => setShadowDomeVisible(!shadowDomeVisible)}
                  className="mt-4"
                />
              </CardContent>
            </Card>
          )}

          {/* Session Metrics */}
          {FLAGS.sessionMetrics && (
            <SessionMetrics
              biofeedbackState={biofeedback.biofeedbackState}
              gaaEngineState={{
                isInitialized: gaaEngine.isInitialized,
                isPlaying: gaaEngine.isPlaying,
                currentPhase: 'idle' as const,
                oscillatorCount: gaaEngine.activeOscillators,
                currentGeometry: {
                  complexity: 0.5,
                  vertices: 8,
                  faces: 6
                },
                biofeedbackIntegration: biofeedback.isConnected,
                lastUpdate: Date.now()
              }}
              sessionDuration={sessionDuration}
              safetyAlerts={safetyAlerts}
              isActive={gaaEngine.isPlaying}
              orchestraMetrics={mockOrchestraMetrics}
              sessionBadges={sessionBadges}
              onCompletionBadge={handleCompletionBadge}
              onExportSession={() => {
                const sessionData = {
                  duration: sessionDuration,
                  darkPhaseSeconds: gaaEngine.shadowEngine ? 30 : 0,
                  avgPolarityBalance: polarity.polarityBalance,
                  archetype: selectedArchetype,
                  tradition,
                  deviceClass: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
                };
                
                const blob = new Blob([JSON.stringify(sessionData, null, 2)], {
                  type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `gaa-session-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            />
          )}

          {/* Orchestra Status */}
          {FLAGS.orchestra && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Orchestra Sync
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orchestra.sessionId ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Session ID</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {orchestra.sessionId.slice(0, 8)}...
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Participants</span>
                      <span className="text-sm font-medium">
                        {orchestra.participants.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Connection</span>
                      <Badge variant={orchestra.connectionStatus === 'connected' ? 'default' : 'secondary'}>
                        {orchestra.connectionStatus}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => orchestra.leaveSession()}
                      className="w-full"
                    >
                      Leave Session
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => orchestra.createSession()}
                      className="w-full"
                    >
                      Create Session
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const sessionId = prompt('Enter session ID:');
                        if (sessionId) orchestra.joinSession(sessionId);
                      }}
                      className="w-full"
                    >
                      Join Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <GAAInfoPanel 
        isOpen={showInfoPanel}
        onClose={() => setShowInfoPanel(false)}
      />
    </div>
  );
};