import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Users, 
  Heart, 
  Brain, 
  Volume2, 
  VolumeX,
  Timer,
  Target,
  Zap,
  Moon,
  Sun,
  Waves
} from 'lucide-react';
import { GroupMeditation, CollectiveMember } from '@/types/collective';

interface GroupMeditationSyncProps {
  userId: string;
  onMeditationComplete?: (session: GroupMeditation) => void;
}

export const GroupMeditationSync: React.FC<GroupMeditationSyncProps> = ({
  userId,
  onMeditationComplete
}) => {
  const [currentSession, setCurrentSession] = useState<GroupMeditation | null>(null);
  const [isMeditating, setIsMeditating] = useState(false);
  const [isSynchronized, setIsSynchronized] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [breathCycle, setBreathCycle] = useState(0); // 0-100
  const [heartRate, setHeartRate] = useState(72);
  const [hrv, setHRV] = useState(45);
  const [coherenceLevel, setCoherenceLevel] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [targetFrequency, setTargetFrequency] = useState(432);
  const [meditationTime, setMeditationTime] = useState(0);
  const [isHost, setIsHost] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const meditationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context for binaural beats
  useEffect(() => {
    if (audioEnabled && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioEnabled]);

  // Generate binaural beats
  const generateBinauralBeat = useCallback((frequency: number) => {
    if (!audioContextRef.current || !audioEnabled) return;

    const ctx = audioContextRef.current;
    const oscillator1 = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Create binaural beat (difference between two frequencies)
    const baseFreq = 200; // Base frequency
    const beatFreq = frequency; // Beat frequency
    const leftFreq = baseFreq;
    const rightFreq = baseFreq + beatFreq;

    oscillator1.frequency.setValueAtTime(leftFreq, ctx.currentTime);
    oscillator2.frequency.setValueAtTime(rightFreq, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator1.start();
    oscillator2.start();

    oscillatorRef.current = oscillator1;
    gainNodeRef.current = gainNode;

    return () => {
      oscillator1.stop();
      oscillator2.stop();
    };
  }, [audioEnabled]);

  // Breath synchronization
  const startBreathSync = useCallback(() => {
    if (breathIntervalRef.current) return;

    const breathDuration = 4000; // 4 seconds per cycle
    let startTime = Date.now();

    breathIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const cycle = (elapsed % breathDuration) / breathDuration;
      
      // Inhale for first half, exhale for second half
      const breathPhase = cycle < 0.5 ? cycle * 2 : (1 - cycle) * 2;
      setBreathCycle(breathPhase * 100);

      // Simulate heart rate variability based on breath
      const hrvVariation = Math.sin(cycle * Math.PI * 2) * 5;
      setHRV(45 + hrvVariation);
    }, 50);
  }, []);

  const stopBreathSync = useCallback(() => {
    if (breathIntervalRef.current) {
      clearInterval(breathIntervalRef.current);
      breathIntervalRef.current = null;
    }
    setBreathCycle(0);
  }, []);

  // Start meditation session
  const startMeditation = useCallback(() => {
    const newSession: GroupMeditation = {
      id: `meditation-${Date.now()}`,
      name: 'Sacred Collective Meditation',
      description: 'Synchronized group meditation for collective consciousness',
      hostId: userId,
      participants: [
        {
          id: userId,
          username: 'You',
          consciousnessState: {
            brainwaveFrequency: 8.5,
            emotionalResonance: 85,
            spiritualAlignment: 90,
            currentArchetype: 'Meditator',
            energyFrequency: `${targetFrequency}Hz`,
            meditationDepth: 0,
            focusLevel: 0
          },
          isOnline: true,
          lastSeen: new Date(),
          connectionStrength: 100,
          sharedIntentions: ['peace', 'healing'],
          resonanceSignature: 'alpha-theta-sync'
        }
      ],
      startTime: new Date(),
      duration: 20, // 20 minutes
      isActive: true,
      meditationType: 'guided',
      targetFrequency,
      sharedIntention: 'Collective peace and healing',
      synchronization: {
        isSynchronized: false,
        syncMethod: 'breath',
        syncData: { breathRate: 15 }
      },
      collectiveMetrics: {
        averageHeartRate: heartRate,
        averageHRV: hrv,
        coherenceLevel: 0,
        energyFieldIntensity: 0,
        participantsInSync: 1
      }
    };

    setCurrentSession(newSession);
    setIsMeditating(true);
    setIsHost(true);
    setMeditationTime(0);

    // Start breath synchronization
    startBreathSync();

    // Start meditation timer
    meditationTimerRef.current = setInterval(() => {
      setMeditationTime(prev => prev + 1);
    }, 1000);

    // Generate binaural beats
    if (audioEnabled) {
      generateBinauralBeat(targetFrequency);
    }

    // Simulate synchronization process
    setTimeout(() => {
      setIsSynchronized(true);
      setSyncProgress(100);
    }, 3000);
  }, [userId, targetFrequency, heartRate, hrv, audioEnabled, startBreathSync, generateBinauralBeat]);

  // Stop meditation session
  const stopMeditation = useCallback(() => {
    setIsMeditating(false);
    setIsSynchronized(false);
    setSyncProgress(0);
    setMeditationTime(0);

    // Stop breath sync
    stopBreathSync();

    // Stop meditation timer
    if (meditationTimerRef.current) {
      clearInterval(meditationTimerRef.current);
      meditationTimerRef.current = null;
    }

    // Stop audio
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }

    // Complete session
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        isActive: false,
        endTime: new Date(),
        collectiveMetrics: {
          ...currentSession.collectiveMetrics,
          coherenceLevel: coherenceLevel,
          energyFieldIntensity: 85,
          participantsInSync: 1
        }
      };
      onMeditationComplete?.(completedSession);
    }

    setCurrentSession(null);
  }, [currentSession, coherenceLevel, stopBreathSync, onMeditationComplete]);

  // Simulate real-time metrics
  useEffect(() => {
    if (!isMeditating) return;

    const interval = setInterval(() => {
      // Simulate heart rate variability
      setHeartRate(prev => prev + (Math.random() - 0.5) * 2);
      
      // Simulate coherence level increase over time
      if (isSynchronized) {
        setCoherenceLevel(prev => Math.min(100, prev + Math.random() * 2));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMeditating, isSynchronized]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFrequencyColor = (freq: number) => {
    if (freq <= 4) return 'text-purple-400'; // Delta
    if (freq <= 8) return 'text-blue-400'; // Theta
    if (freq <= 13) return 'text-green-400'; // Alpha
    if (freq <= 30) return 'text-yellow-400'; // Beta
    return 'text-red-400'; // Gamma
  };

  return (
    <div className="space-y-6">
      {/* Meditation Controls */}
      <Card className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-indigo-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-300">
            <Moon className="h-5 w-5" />
            Group Meditation Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Frequency Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">
                Target Frequency: {targetFrequency}Hz
              </label>
              <Slider
                value={[targetFrequency]}
                onValueChange={(value) => setTargetFrequency(value[0])}
                min={1}
                max={40}
                step={0.5}
                className="w-full"
                disabled={isMeditating}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Delta (1-4Hz)</span>
                <span>Theta (4-8Hz)</span>
                <span>Alpha (8-13Hz)</span>
                <span>Beta (13-30Hz)</span>
                <span>Gamma (30-40Hz)</span>
              </div>
            </div>

            {/* Audio Control */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {audioEnabled ? <Volume2 className="h-4 w-4 text-green-400" /> : <VolumeX className="h-4 w-4 text-red-400" />}
                <span className="text-sm">Binaural Beats</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                disabled={isMeditating}
                className="border-indigo-500 text-indigo-400 hover:bg-indigo-500/10"
              >
                {audioEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>

            {/* Meditation Controls */}
            <div className="flex gap-2">
              {!isMeditating ? (
                <Button
                  onClick={startMeditation}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Meditation
                </Button>
              ) : (
                <Button
                  onClick={stopMeditation}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/10 flex-1"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  End Meditation
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isMeditating && currentSession && (
        <>
          {/* Meditation Status */}
          <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <Timer className="h-5 w-5" />
                Meditation in Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Time and Status */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-mono text-green-400">
                    {formatTime(meditationTime)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isSynchronized ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                    <span className="text-sm">
                      {isSynchronized ? 'Synchronized' : 'Synchronizing...'}
                    </span>
                  </div>
                </div>

                {/* Synchronization Progress */}
                {!isSynchronized && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Connecting to Collective</span>
                      <span>{syncProgress}%</span>
                    </div>
                    <Progress value={syncProgress} className="h-2" />
                  </div>
                )}

                {/* Breath Visualization */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Breath Cycle</span>
                    <span>{breathCycle.toFixed(0)}%</span>
                  </div>
                  <div className="relative h-8 bg-black/20 rounded-lg overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 opacity-30"
                      animate={{
                        scaleX: breathCycle / 100,
                        originX: 0
                      }}
                      transition={{ duration: 0.1 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-white">
                      {breathCycle < 50 ? 'Inhale' : 'Exhale'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Metrics */}
          <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <Target className="h-5 w-5" />
                Real-time Consciousness Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{heartRate.toFixed(0)}</div>
                  <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <Heart className="h-3 w-3" />
                    BPM
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{hrv.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">HRV</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{coherenceLevel.toFixed(0)}%</div>
                  <div className="text-xs text-gray-400">Coherence</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getFrequencyColor(targetFrequency)}`}>
                    {targetFrequency}Hz
                  </div>
                  <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <Brain className="h-3 w-3" />
                    Brainwave
                  </div>
                </div>
              </div>

              {/* Coherence Progress */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Collective Coherence</span>
                  <span>{coherenceLevel.toFixed(0)}%</span>
                </div>
                <Progress value={coherenceLevel} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-300">
                <Users className="h-5 w-5" />
                Session Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-300">Session Name:</span>
                  <span className="text-sm text-yellow-300">{currentSession.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-300">Shared Intention:</span>
                  <span className="text-sm text-yellow-300">{currentSession.sharedIntention}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-300">Participants:</span>
                  <Badge className="bg-green-500/20 text-green-400">
                    {currentSession.participants.length} connected
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-300">Duration:</span>
                  <span className="text-sm text-yellow-300">{currentSession.duration} minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default GroupMeditationSync;
