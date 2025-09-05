/**
 * GAA Master Dashboard - Main interface for all GAA components
 * Integrates Deep5 Archetypes, CosmicVis, Biofeedback, Orchestra, and Metrics
 */
import React, { useState, useRef, useEffect } from 'react';
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
  HelpCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import * as Tone from 'tone';
import { useGAAEngine } from '@/hooks/useGAAEngine';
import { useCollectiveGAA } from '@/hooks/useCollectiveGAA';
import { SessionMetrics } from './SessionMetrics';
import { GAAHardwareTeaser } from '@/components/pulseFi/GAAHardwareTeaser';
import { CosmicVisualization } from './CosmicVisualization';
import { GAAInfoPanel } from './GAAInfoPanel';
import { GAADemoMode } from './GAADemoMode';
import { CosmicVisualizationLegend } from './CosmicVisualizationLegend';
import { PolarityProtocol, TarotTradition } from '@/types/gaa-polarity';
import { CosmicDataStream, CosmicStructure } from '@/utils/cosmic/CosmicDataStream';
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
    darkEnergyDrift: { driftRate: 0.05, expansionFactor: 1.2 },
    timestamp: Date.now()
  });
  const [sessionStartTime] = useState(Date.now());
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [firmamentVisible, setFirmamentVisible] = useState(true);
  const [shadowDomeVisible, setShadowDomeVisible] = useState(true);
  const [sessionBadges, setSessionBadges] = useState<string[]>([]);
  const cosmicDataStreamRef = useRef<CosmicDataStream | null>(null);
  const [cosmicData, setCosmicData] = useState<CosmicStructure[]>([]);

  useEffect(() => {
    if (!cosmicDataStreamRef.current) {
      cosmicDataStreamRef.current = new CosmicDataStream();
    }
    const stream = cosmicDataStreamRef.current;

    setCosmicData(stream.getAllStructures());

    const listener = (data) => {
      setCosmicData(data.structures);
    };
    stream.addListener(listener);
    stream.startStreaming();

    return () => {
      stream.removeListener(listener);
      stream.stopStreaming();
    };
  }, []);

  // Core hooks
  const orchestra = useCollectiveGAA(Tone.Transport);
  const gaaEngine = useGAAEngine(orchestra.collectiveField);

  useEffect(() => {
    if (gaaEngine.state.isPlaying && gaaEngine.state.isInitialized) {
      const stream = gaaEngine.getAudioStream();
      if (stream) {
        orchestra.setLocalAudioStream(stream);
      }
    }
  }, [gaaEngine.state.isPlaying, gaaEngine.state.isInitialized]);
  const { phonePulseSensor, accelerometer } = gaaEngine;

  // Live GAA engine state integration
  const liveBiofeedbackState = {
    bpm: (phonePulseSensor.bpm > 0 ? phonePulseSensor.bpm : accelerometer.bpm) || 0,
    signalQuality: (phonePulseSensor.isSensing ? phonePulseSensor.signalQuality : 
                   accelerometer.isSensing ? accelerometer.signalQuality : 'no_signal'),
    isConnected: phonePulseSensor.isSensing || accelerometer.isSensing,
    hrv: 0, // Will be calculated below
    breathingRate: 0 // Will be calculated below
  };

  // Calculate HRV and breathing rate from BPM
  liveBiofeedbackState.hrv = Math.max(0, Math.min(100, (1 - ((liveBiofeedbackState.bpm - 60) / 40)) * 100));
  liveBiofeedbackState.breathingRate = Math.round((liveBiofeedbackState.bpm || 60) / 4);

  const signalQuality = liveBiofeedbackState.signalQuality;
  const isBiofeedbackConnected = liveBiofeedbackState.isConnected;

  // Transport controls
  const handlePlay = async () => {
    console.log('🎮 Play button pressed - START OF FUNCTION');
    
    try {
      console.log('🔍 Current GAA Engine state:', gaaEngine.state);
      
      if (!gaaEngine.state.isInitialized) {
        console.log('🔧 Engine not initialized, initializing...');
        const result = await gaaEngine.initializeGAA();
        console.log('🔧 Initialize result:', result);
      }
      
      console.log('▶️ Starting GAA...');
      await gaaEngine.startGAA();
      console.log('✅ GAA started successfully');
    } catch (error) {
      console.error('❌ Error in handlePlay:', error);
      alert(`Error starting GAA: ${error.message}`);
    }
  };

  const handleStop = async () => {
    console.log('⏹️ Stop button pressed - START OF FUNCTION');
    
    try {
      await gaaEngine.stopGAA();
      console.log('✅ GAA stopped successfully');
    } catch (error) {
      console.error('❌ Error in handleStop:', error);
      alert(`Error stopping GAA: ${error.message}`);
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

  // Live GAA engine metrics with null safety
  const liveGAAEngineState = {
    oscillatorCount: gaaEngine?.state?.activeOscillators || 0,
    currentFrequency: gaaEngine?.state?.shadowState?.lastOutputs?.fHz || 432,
    groupCoherence: orchestra?.isConnected ? (orchestra?.coherence || 0) : 0,
    sessionDuration: sessionDuration,
    safetyAlerts: gaaEngine?.state?.safetyAlerts?.map(alert => alert?.message) || []
  };

  const allWarnings = [
    ...(gaaEngine?.state?.safetyAlerts?.map(a => ({ message: a?.message || 'Unknown alert', type: a?.type || 'warning' })) || []),
  ];

  // Add real-time warnings based on live data
  if (liveGAAEngineState.currentFrequency === 432 && gaaEngine?.state?.isPlaying) {
    allWarnings.push({ message: '⚠️ Invalid geometry – fallback frequency applied (432 Hz).', type: 'warning' });
  }

  if (gaaEngine?.state?.isPlaying && !isBiofeedbackConnected) {
    allWarnings.push({ message: '⚠️ No biofeedback sensors connected – using default values.', type: 'warning' });
  }

  if (signalQuality === 'weak') {
    allWarnings.push({ message: '⚠️ Weak biofeedback signal.', type: 'warning' });
  } else if (signalQuality === 'no_signal' && isBiofeedbackConnected) {
    allWarnings.push({ message: '⚠️ No biofeedback signal.', type: 'warning' });
  }

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
          {gaaEngine.state.isRecovering && (
            <Button
              variant="destructive"
              size="sm"
              onClick={gaaEngine.recoverSession}
              className="mt-3"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Recover Session
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={gaaEngine.state.isPlaying ? 'default' : 'secondary'}>
            {gaaEngine.state.isPlaying ? 'Active' : 'Idle'}
          </Badge>
          {FLAGS.orchestra && orchestra.sessionId && (
            <Badge variant="outline">
              <Users className="w-3 h-3 mr-1" />
              {orchestra.participants.length}
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Warning Banners */}
      {allWarnings.length > 0 && (
        <div className="space-y-2">
          {allWarnings.map((warning, index) => (
            <Badge key={index} variant={warning.type === 'critical' ? 'destructive' : 'default'} className="p-2 w-full justify-start">
              <AlertCircle className="w-4 h-4 mr-2" />
              {warning.message}
            </Badge>
          ))}
        </div>
      )}

      {/* Transport Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
              variant={gaaEngine.state.isPlaying ? 'secondary' : 'default'}
                size="sm"
                onClick={handlePlay}
              disabled={gaaEngine.state.isPlaying}
              >
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStop}
              disabled={!gaaEngine.state.isPlaying}
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
                    <Badge variant={isBiofeedbackConnected ? 'default' : 'secondary'}>
                      {isBiofeedbackConnected ? 'Connected' : 'Offline'}
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
          {/* Engine State */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Engine State
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
              <div>
                 <div className="text-sm text-muted-foreground">Oscillators</div>
                 <div className="text-2xl font-bold">{liveGAAEngineState.oscillatorCount}</div>
              </div>
              <div>
                 <div className="text-sm text-muted-foreground">Frequency</div>
                 <div className="text-2xl font-bold">
                   {liveGAAEngineState.currentFrequency.toFixed(1)}
                   <span className="text-sm text-muted-foreground ml-1">Hz</span>
                 </div>
              </div>
              <div>
                 <div className="text-sm text-muted-foreground">Coherence</div>
                 <div className="text-2xl font-bold">
                   {(liveGAAEngineState.groupCoherence * 100).toFixed(0)}
                   <span className="text-sm text-muted-foreground ml-1">%</span>
                 </div>
              </div>
            </CardContent>
          </Card>

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
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Biofeedback Status
                    </div>
                    <Badge variant={signalQuality === 'good' ? 'default' : signalQuality === 'weak' ? 'secondary' : 'destructive'}>
                      {signalQuality.replace('_', ' ')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                     <div className="text-sm text-muted-foreground">Heart Rate</div>
                     <div className="text-lg font-bold">
                       {liveBiofeedbackState.bpm > 0 ? liveBiofeedbackState.bpm.toFixed(0) : '--'} BPM
                     </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Source</div>
                      <div className="text-lg font-bold">
                        {phonePulseSensor.isSensing ? 'Camera' : accelerometer.isSensing ? 'Motion' : 'N/A'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hardware Biofeedback Teaser */}
            <GAAHardwareTeaser 
              onLearnMore={() => window.open('/hardware/pulse-fi', '_blank')}
            />
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
                    cosmicData={cosmicData}
                      shadowEngineState={gaaEngine.state.shadowState}
                      isActive={gaaEngine.state.isPlaying}
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
                biofeedbackState={{
                  heartRate: liveBiofeedbackState.bpm,
                  heartRateVariability: liveBiofeedbackState.hrv,
                  breathingRate: liveBiofeedbackState.breathingRate,
                  brainwaveAlpha: gaaEngine.state.shadowState?.neuralEntrainment || 0,
                  signalQuality: liveBiofeedbackState.signalQuality
                }}
                gaaEngineState={{
                  isInitialized: gaaEngine.state.isInitialized,
                  isPlaying: gaaEngine.state.isPlaying,
                  currentPhase: (gaaEngine.state.shadowState?.currentPhase || 'idle') as 'idle' | 'activation' | 'processing' | 'integration',
                  oscillatorCount: liveGAAEngineState.oscillatorCount,
                  currentGeometry: {
                    complexity: gaaEngine.state.shadowState?.polarityBalance || 0,
                    vertices: 8,
                    faces: 6
                  },
                  biofeedbackIntegration: isBiofeedbackConnected,
                  lastUpdate: Date.now()
                }}
                sessionDuration={sessionDuration}
                safetyAlerts={liveGAAEngineState.safetyAlerts}
                isActive={gaaEngine.state.isPlaying}
                orchestraMetrics={mockOrchestraMetrics}
                sessionBadges={sessionBadges}
                onCompletionBadge={handleCompletionBadge}
                onExportSession={() => {
                  const sessionData = {
                    duration: sessionDuration,
                    darkPhaseSeconds: gaaEngine.state.shadowState ? 30 : 0,
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
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg. Latency</span>
                      <span className="text-sm font-medium">
                        {orchestra.getParticipantLatency('').toFixed(0)}ms
                      </span>
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