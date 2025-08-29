import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Volume2, VolumeX, AlertTriangle, RotateCcw, Music } from 'lucide-react';
import { useSacredVentilationMachine } from './hooks/useSacredVentilationMachine';
import { BreathMeter } from './components/BreathMeter';
import { SafetyNotice } from './components/SafetyNotice';
import { PostSessionDialog } from './components/PostSessionDialog';
import { playInhaleCue, playExhaleCue, initializeAudioCues, setMasterVolume } from './audio/cues';
import { getRestPrompt, getGroundingTips } from './utils/prompts';
import { createPlaylistPlayer } from '@/lib/youtube';
import { toast } from 'sonner';

export default function SacredVentilation() {
  const {
    state,
    context,
    send,
    isBreathing,
    currentPhase,
    progress,
    totalCycles,
    canStart,
    canPause,
    canResume,
    canNextRound,
    isCompleted,
    isResting,
  } = useSacredVentilationMachine();

  const [showSafety, setShowSafety] = useState(false);
  const [showPostSession, setShowPostSession] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [restPrompt, setRestPrompt] = useState<string>('');
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);

  // Check if safety already acknowledged
  useEffect(() => {
    const ack = localStorage.getItem('sacred_ventilation_safety_ack');
    if (!ack && !context.safetyAcknowledged) {
      setShowSafety(true);
    }
  }, [context.safetyAcknowledged]);

  // Handle completion
  useEffect(() => {
    if (isCompleted && !showPostSession) {
      setShowPostSession(true);
    }
  }, [isCompleted, showPostSession]);

  // Initialize audio and YouTube
  useEffect(() => {
    initializeAudioCues();
    
    // Initialize YouTube player if music enabled
    if (context.musicEnabled) {
      const playlistId = 'PLrAl3m0RBk0QNbGZcXgTVml7-WvKj6aDq'; // Default playlist
      try {
        const player = createPlaylistPlayer('youtube-player', playlistId, {
          onReady: () => console.log('YouTube player ready'),
        });
        setYoutubePlayer(player);
      } catch (error) {
        console.warn('YouTube player failed to initialize:', error);
      }
    }
  }, [context.musicEnabled]);

  // Handle breath phase changes for audio cues
  useEffect(() => {
    const handlePhaseChange = (event: any) => {
      if (!audioEnabled) return;
      const { phase, intensity } = event.detail;
      const volume = (intensity / 100) * 0.5; // Scale volume with intensity
      
      if (phase === 'inhale') {
        playInhaleCue(volume);
      } else if (phase === 'exhale') {
        playExhaleCue(volume);
      }
    };

    window.addEventListener('breath:phase', handlePhaseChange);
    return () => window.removeEventListener('breath:phase', handlePhaseChange);
  }, [audioEnabled]);

  // Generate rest prompts
  useEffect(() => {
    if (isResting) {
      const prompt = getRestPrompt(context, {
        previousEmotions: [],
        previousResonance: [],
        sessionCount: 1,
        lastIntensity: context.intensity,
      });
      setRestPrompt(prompt);
    }
  }, [isResting, context]);

  const handleStart = () => {
    if (!context.safetyAcknowledged) {
      setShowSafety(true);
      return;
    }
    send({ type: 'START' });
    if (youtubePlayer && context.musicEnabled) {
      youtubePlayer.play();
    }
  };

  const handleSafetyAcknowledge = () => {
    send({ type: 'ACK_SAFETY' });
    setShowSafety(false);
  };

  const handleReturnToBaseline = () => {
    send({ type: 'RETURN_TO_BASELINE' });
    toast.info('Returning to gentle baseline breathing for 60 seconds');
  };

  const roundsOptions = [1, 2, 3, 4];
  const cadenceOptions = [
    { value: 'moderate', label: 'Moderate (18-24 CPM)', desc: '~1.5-2s per phase' },
    { value: 'intense', label: 'Intense (24-36 CPM)', desc: '~1-1.5s per phase' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Sacred Ventilation
        </h1>
        <p className="text-muted-foreground">
          High-ventilation breathwork for release and transformation
        </p>
      </div>

      {/* Safety Banner */}
      {!context.safetyAcknowledged && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 cursor-pointer"
          onClick={() => setShowSafety(true)}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-400">
                Important Safety Notice
              </p>
              <p className="text-xs text-muted-foreground">
                Click to read safety guidelines before beginning
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* Session Configuration */}
          <div className="bg-card rounded-lg border p-4 space-y-4">
            <h3 className="font-semibold text-foreground">Session Setup</h3>
            
            {/* Rounds Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Rounds</label>
              <div className="flex gap-2">
                {roundsOptions.map((rounds) => (
                  <Badge
                    key={rounds}
                    variant={context.roundsPlanned === rounds ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => send({ type: 'SET_ROUNDS', rounds })}
                  >
                    {rounds}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cadence Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Pace</label>
              <div className="space-y-2">
                {cadenceOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      context.cadence === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => send({ type: 'SET_CADENCE', cadence: option.value as any })}
                  >
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Intensity Slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Intensity: {context.intensity}%
              </label>
              <Slider
                value={[context.intensity]}
                onValueChange={([value]) => send({ type: 'SET_INTENSITY', intensity: value })}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Audio Controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="flex items-center gap-2"
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                Audio Cues
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => send({ type: 'TOGGLE_MUSIC' })}
                className="flex items-center gap-2"
              >
                <Music className="h-4 w-4" />
                Music {context.musicEnabled ? 'On' : 'Off'}
              </Button>
            </div>
          </div>

          {/* Session Controls */}
          <div className="space-y-3">
            {!isBreathing && !isResting && !isCompleted && (
              <Button
                onClick={handleStart}
                disabled={!canStart && !canResume}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {canResume ? 'Resume Session' : 'Start Session'}
              </Button>
            )}

            {isBreathing && (
              <Button
                onClick={() => send({ type: 'PAUSE' })}
                variant="outline"
                className="w-full"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}

            {canNextRound && (
              <Button
                onClick={() => send({ type: 'NEXT_ROUND' })}
                className="w-full"
              >
                Next Round ({context.currentRound + 1}/{context.roundsPlanned})
              </Button>
            )}

            <Button
              onClick={handleReturnToBaseline}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Return to Baseline
            </Button>

            {(isBreathing || isResting) && (
              <Button
                onClick={() => send({ type: 'END' })}
                variant="destructive"
                className="w-full"
              >
                <Square className="h-4 w-4 mr-2" />
                End Session
              </Button>
            )}
          </div>
        </div>

        {/* Right Column - Visualization */}
        <div className="space-y-6">
          <BreathMeter
            phase={state === 'completed' || state === 'journal_prompted' ? 'idle' : state}
            currentBreathPhase={currentPhase}
            cycleCount={context.cyclesInRound}
            intensity={context.intensity}
            isBreathing={isBreathing}
          />

          {/* Progress */}
          <div className="bg-card rounded-lg border p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Round {context.currentRound}/{context.roundsPlanned}</span>
              <span>{totalCycles} cycles</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.max(progress * 100, 0)}%` }}
              />
            </div>
          </div>

          {/* Rest Prompts */}
          {isResting && restPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4"
            >
              <p className="text-sm text-emerald-300 font-medium mb-2">Integration Prompt:</p>
              <p className="text-sm text-foreground italic">{restPrompt}</p>
            </motion.div>
          )}

          {/* Grounding Tips */}
          {isResting && (
            <div className="bg-card rounded-lg border p-4">
              <p className="text-sm font-medium text-foreground mb-2">Grounding Tips:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {getGroundingTips().slice(0, 4).map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Hidden YouTube Player */}
      <div id="youtube-player" className="hidden" />

      {/* Modals */}
      <SafetyNotice
        isOpen={showSafety}
        onClose={() => setShowSafety(false)}
        onAcknowledge={handleSafetyAcknowledge}
      />

      <PostSessionDialog
        isOpen={showPostSession}
        onClose={() => setShowPostSession(false)}
        sessionContext={context}
        totalCycles={totalCycles}
      />
    </div>
  );
}