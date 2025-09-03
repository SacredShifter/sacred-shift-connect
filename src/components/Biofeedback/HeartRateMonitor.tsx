/**
 * Heart Rate Variability Monitor
 * Sacred heart rhythm analysis for consciousness tracking
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  Zap, 
  Brain, 
  Waves,
  Play,
  Pause,
  Square,
  AlertCircle,
  CheckCircle,
  Radio
} from 'lucide-react';
import { BiofeedbackData, ConsciousnessState } from '@/types/consciousness';

interface HeartRateMonitorProps {
  onDataUpdate?: (data: BiofeedbackData) => void;
  onConsciousnessUpdate?: (state: ConsciousnessState) => void;
  className?: string;
}

interface HeartRateData {
  bpm: number;
  hrv: number;
  coherence: number;
  stressLevel: number;
  emotionalState: 'calm' | 'excited' | 'stressed' | 'focused' | 'transcendent';
  timestamp: Date;
}

export const HeartRateMonitor: React.FC<HeartRateMonitorProps> = ({
  onDataUpdate,
  onConsciousnessUpdate,
  className = ""
}) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [heartRateData, setHeartRateData] = useState<HeartRateData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [consciousnessLevel, setConsciousnessLevel] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<Date | null>(null);

  // Simulate heart rate monitoring (in real implementation, this would connect to actual hardware)
  const startMonitoring = async () => {
    setConnectionStatus('connecting');
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConnected(true);
    setConnectionStatus('connected');
    setIsMonitoring(true);
    sessionStartRef.current = new Date();
    
    // Start monitoring loop
    intervalRef.current = setInterval(() => {
      generateHeartRateData();
    }, 1000);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setConnectionStatus('disconnected');
    setIsConnected(false);
  };

  const generateHeartRateData = () => {
    // Simulate realistic heart rate data
    const baseBPM = 70 + Math.random() * 20; // 70-90 BPM
    const hrv = 30 + Math.random() * 40; // 30-70ms HRV
    const coherence = Math.min(100, hrv * 1.5); // Higher HRV = higher coherence
    const stressLevel = Math.max(0, 100 - coherence);
    
    // Determine emotional state based on HRV and coherence
    let emotionalState: HeartRateData['emotionalState'] = 'calm';
    if (coherence > 80) emotionalState = 'transcendent';
    else if (coherence > 60) emotionalState = 'focused';
    else if (coherence > 40) emotionalState = 'calm';
    else if (coherence > 20) emotionalState = 'excited';
    else emotionalState = 'stressed';

    const newData: HeartRateData = {
      bpm: Math.round(baseBPM),
      hrv: Math.round(hrv),
      coherence: Math.round(coherence),
      stressLevel: Math.round(stressLevel),
      emotionalState,
      timestamp: new Date()
    };

    setHeartRateData(newData);

    // Update consciousness level based on coherence
    const newConsciousnessLevel = Math.min(100, coherence * 1.2);
    setConsciousnessLevel(newConsciousnessLevel);

    // Create biofeedback data
    const biofeedbackData: BiofeedbackData = {
      heartRate: newData.bpm,
      heartRateVariability: newData.hrv,
      brainwaveFrequencies: {
        delta: Math.random() * 20,
        theta: Math.random() * 30,
        alpha: Math.random() * 40,
        beta: Math.random() * 50,
        gamma: Math.random() * 10
      },
      skinConductance: Math.random() * 10,
      temperature: 36.5 + Math.random() * 1,
      timestamp: new Date()
    };

    onDataUpdate?.(biofeedbackData);

    // Create consciousness state
    const consciousnessState: ConsciousnessState = {
      brainwaveFrequency: newData.bpm,
      emotionalResonance: newData.coherence,
      spiritualAlignment: newConsciousnessLevel,
      mentalClarity: newData.coherence,
      physicalVitality: 100 - newData.stressLevel,
      lunarPhase: 'waxing',
      solarPosition: 'afternoon',
      season: 'spring',
      awakeningLevel: newConsciousnessLevel > 80 ? 'transcend' : 
                     newConsciousnessLevel > 60 ? 'bloom' : 
                     newConsciousnessLevel > 40 ? 'sprout' : 'seed',
      archetype: 'healer',
      energyFrequency: '528Hz',
      sacredGeometry: {
        primary: 'flower-of-life',
        secondary: [],
        resonance: newConsciousnessLevel
      },
      chakras: {
        root: 100 - newData.stressLevel,
        sacral: newData.coherence,
        solar: newData.coherence,
        heart: newData.coherence,
        throat: newData.coherence,
        thirdEye: newConsciousnessLevel,
        crown: newConsciousnessLevel
      },
      timestamp: new Date(),
      sessionId: sessionStartRef.current?.toISOString() || '',
      userId: 'current-user'
    };

    onConsciousnessUpdate?.(consciousnessState);
  };

  // Update session duration
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      if (sessionStartRef.current) {
        const duration = Math.floor((Date.now() - sessionStartRef.current.getTime()) / 1000);
        setSessionDuration(duration);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getEmotionalStateColor = (state: HeartRateData['emotionalState']) => {
    switch (state) {
      case 'transcendent': return 'text-yellow-400';
      case 'focused': return 'text-blue-400';
      case 'calm': return 'text-green-400';
      case 'excited': return 'text-orange-400';
      case 'stressed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getEmotionalStateIcon = (state: HeartRateData['emotionalState']) => {
    switch (state) {
      case 'transcendent': return <Zap className="w-4 h-4" />;
      case 'focused': return <Brain className="w-4 h-4" />;
      case 'calm': return <Waves className="w-4 h-4" />;
      case 'excited': return <Activity className="w-4 h-4" />;
      case 'stressed': return <AlertCircle className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Sacred Heart Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                'bg-gray-400'
              }`} />
              <span className="text-sm text-muted-foreground">
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 'Disconnected'}
              </span>
            </div>
            
            <div className="flex gap-2">
              {!isMonitoring ? (
                <Button
                  onClick={startMonitoring}
                  disabled={connectionStatus === 'connecting'}
                  className="flex items-center gap-1"
                >
                  <Play className="w-4 h-4" />
                  Start Monitoring
                </Button>
              ) : (
                <Button
                  onClick={stopMonitoring}
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </Button>
              )}
            </div>
          </div>

          {/* Session Duration */}
          {isMonitoring && (
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatDuration(sessionDuration)}
              </div>
              <div className="text-sm text-muted-foreground">
                Session Duration
              </div>
            </div>
          )}

          {/* Heart Rate Data */}
          {heartRateData && (
            <div className="space-y-4">
              {/* Main Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">
                    {heartRateData.bpm}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    BPM
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">
                    {heartRateData.hrv}ms
                  </div>
                  <div className="text-sm text-muted-foreground">
                    HRV
                  </div>
                </div>
              </div>

              {/* Coherence and Stress */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Coherence</span>
                    <span>{heartRateData.coherence}%</span>
                  </div>
                  <Progress value={heartRateData.coherence} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Stress Level</span>
                    <span>{heartRateData.stressLevel}%</span>
                  </div>
                  <Progress value={heartRateData.stressLevel} className="h-2" />
                </div>
              </div>

              {/* Emotional State */}
              <div className="flex items-center justify-center gap-2">
                <div className={`flex items-center gap-2 ${getEmotionalStateColor(heartRateData.emotionalState)}`}>
                  {getEmotionalStateIcon(heartRateData.emotionalState)}
                  <span className="font-medium capitalize">
                    {heartRateData.emotionalState}
                  </span>
                </div>
              </div>

              {/* Consciousness Level */}
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {consciousnessLevel}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Consciousness Level
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!isMonitoring && (
            <div className="text-center text-muted-foreground">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Connect your heart rate monitor to begin tracking your sacred heart rhythm
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
