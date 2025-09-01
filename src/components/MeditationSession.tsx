import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MeditationVisuals from '@/components/MeditationVisuals';
import { PracticeSetup } from '@/components/PracticeSetup';
import { MeditationPlaylistIntegration } from '@/components/MeditationPlaylistIntegration';

type MeditationType = 'breathing' | 'loving-kindness' | 'chakra' | 'mindfulness' | 'body-scan';

interface MeditationPractice {
  id: string;
  name: string;
  description: string;
  visualType: MeditationType;
  youtubePlaylistId?: string;
  defaultDuration: number;
  guidance: string;
  color: string;
}

interface MeditationSessionProps {
  practice: MeditationPractice;
  duration: number;
  onComplete?: () => void;
  onExit?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function MeditationSession({ 
  practice, 
  duration, 
  onComplete,
  onExit 
}: MeditationSessionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Session state
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioVolume, setAudioVolume] = useState(70);
  const [currentPlayingTitle, setCurrentPlayingTitle] = useState<string>('');
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef<Date | null>(null);

  const startSession = useCallback(async () => {
    setIsActive(true);
    setIsPaused(false);
    sessionStartTime.current = new Date();
    startTimer();
    
    toast({
      title: "Sacred Practice Begins",
      description: `${practice.name} session initiated`,
    });
  }, [practice.name]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseSession = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPaused(true);
  };

  const resumeSession = () => {
    setIsPaused(false);
    startTimer();
  };

  const stopSessionHandler = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    
    toast({
      title: "Session Stopped",
      description: "Your practice has been ended early",
    });
    
    if (onExit) {
      onExit();
    }
  };

  const endSession = async () => {
    setIsCompleted(true);
    
    // Save session to Supabase
    await saveSessionToSupabase();
    
    toast({
      title: "Sacred Practice Complete 🕉️",
      description: "You have touched the infinite within. Honor this moment.",
    });
    
    setTimeout(() => {
      setIsActive(false);
      setIsCompleted(false);
      if (onComplete) {
        onComplete();
      }
    }, 3000);
  };

  const saveSessionToSupabase = async () => {
    if (!user || !sessionStartTime.current) return;
    
    try {
      const sessionData = {
        user_id: user.id,
        practice_type: practice.visualType,
        practice_name: practice.name,
        intended_duration: duration,
        actual_duration: Math.round((duration * 60 - timeLeft) / 60),
        completed_at: new Date().toISOString(),
        session_data: {
          practice_id: practice.id,
          audio_enabled: audioEnabled,
          current_playing: currentPlayingTitle,
        }
      };
      
      const { error } = await supabase
        .from('akashic_records')
        .insert({
          type: 'meditation_session',
          data: sessionData,
          metadata: {
            session_type: 'individual_meditation'
          }
        });
      
      if (error) {
        console.error('Error saving meditation session:', error);
      }
    } catch (error) {
      console.error('Error saving session to Supabase:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* YouTube Playlist Integration */}
      <MeditationPlaylistIntegration
        isActive={isActive && audioEnabled}
        practiceName={practice.name}
        durationMinutes={duration}
        volume={audioVolume}
        onVideoChange={(title) => setCurrentPlayingTitle(title)}
        onError={(error) => {
          console.error('Playlist error:', error);
          toast({
            title: "Audio Error",
            description: "Continuing session without background audio",
            variant: "destructive",
          });
        }}
      />
      
      {/* Session Setup Phase */}
      {!isActive && !isCompleted && (
        <PracticeSetup
          practice={practice}
          duration={duration}
          audioPreloaded={true}
          visualPreloaded={true}
          onStart={startSession}
          onExit={onExit}
          audioEnabled={audioEnabled}
          onAudioToggle={setAudioEnabled}
          audioVolume={audioVolume}
          onVolumeChange={setAudioVolume}
        />
      )}

      {/* Active Session Phase */}
      {isActive && (
        <>
          {/* Fullscreen Visual Layer */}
          <div className="fixed inset-0 z-30 bg-black">
            <MeditationVisuals 
              type={practice.visualType}
              isActive={!isPaused}
            />
          </div>

          {/* Session Controls Overlay */}
          <div className="fixed inset-0 z-40 pointer-events-none">
            
            {/* Timer Display */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2 pointer-events-auto"
            >
              <Card className="bg-black/20 backdrop-blur-md border-white/10 text-white">
                <CardContent className="p-6 text-center space-y-4">
                  <motion.div 
                    className="text-4xl font-light tracking-wider"
                    animate={!isPaused ? { opacity: [0.7, 1, 0.7] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {formatTime(timeLeft)}
                  </motion.div>
                  <Progress 
                    value={progress} 
                    className="h-1 bg-white/20"
                  />
                  <p className="text-sm text-white/80">{practice.guidance}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Control Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 pointer-events-auto"
            >
              {!isPaused ? (
                <Button
                  onClick={pauseSession}
                  className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:bg-black/50 text-white"
                >
                  <Pause className="h-6 w-6" />
                </Button>
              ) : (
                <Button
                  onClick={resumeSession}
                  className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:bg-black/50 text-white"
                >
                  <Play className="h-6 w-6" />
                </Button>
              )}
              
              <Button
                onClick={stopSessionHandler}
                className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:bg-black/50 text-white"
              >
                <Square className="h-6 w-6" />
              </Button>
              
              <Button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:bg-black/50 text-white"
              >
                {audioEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
              </Button>
            </motion.div>
          </div>
        </>
      )}

      {/* Completion Phase */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-60 bg-black/50"
          >
            <Card className="bg-black/40 backdrop-blur-lg border-white/20 text-white max-w-md mx-4">
              <CardContent className="p-8 text-center space-y-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    🕉️
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-2xl font-light mb-2">Sacred Practice Complete</h3>
                  <p className="text-white/80">
                    The light you have kindled within continues to shine. 
                    Take this peace with you as you return to the world.
                  </p>
                </div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sm text-white/60"
                >
                  🙏 Namaste 🙏
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}