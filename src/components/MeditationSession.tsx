import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useYouTubeAPI } from '@/hooks/useYouTubeAPI';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MeditationVisuals from '@/components/MeditationVisuals';
import { PracticeSetup } from '@/components/PracticeSetup';

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
  const { getVideosFromPlaylistByTitle } = useYouTubeAPI();
  
  // Session state
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioVolume, setAudioVolume] = useState(70);
  
  // Audio state
  const [audioPreloaded, setAudioPreloaded] = useState(false);
  const [visualPreloaded, setVisualPreloaded] = useState(false);
  const [playlistVideos, setPlaylistVideos] = useState<any[]>([]);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const youtubePlayerRef = useRef<any>(null);
  const youtubeContainerRef = useRef<HTMLDivElement>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef<Date | null>(null);

  // Preload resources
  useEffect(() => {
    preloadResources();
  }, [practice]);

  const preloadResources = async () => {
    try {
      // Preload YouTube content if playlist exists
      if (practice.youtubePlaylistId) {
        await preloadYouTube(practice.youtubePlaylistId);
      }
      
      // Preload visual (mark as ready)
      preloadVisual(practice.visualType);
      
    } catch (error) {
      console.error('Error preloading resources:', error);
      toast({
        title: "Preload Warning",
        description: "Some resources may take longer to load",
        variant: "destructive",
      });
    }
  };

  const preloadYouTube = async (playlistId: string) => {
    try {
      // Load YouTube playlist videos for better control
      const videosData = await getVideosFromPlaylistByTitle(playlistId, 10);
      setPlaylistVideos(videosData.videos);
      setAudioPreloaded(true);
    } catch (error) {
      console.error('Error preloading YouTube:', error);
      setAudioPreloaded(true); // Continue without audio
    }
  };

  const preloadVisual = (visualType: MeditationType) => {
    // Visual preloading logic (shaders, textures, etc.)
    setVisualPreloaded(true);
  };

  const startSession = useCallback(() => {
    if (!audioPreloaded || !visualPreloaded) {
      toast({
        title: "Loading Resources",
        description: "Please wait while we prepare your session...",
      });
      return;
    }

    setIsActive(true);
    setIsPaused(false);
    sessionStartTime.current = new Date();
    startTimer();
    
    if (audioEnabled && playlistVideos.length > 0) {
      playAudio();
    }
    
    launchVisual(practice.visualType);
    
    toast({
      title: "Sacred Practice Begins",
      description: `${practice.name} session initiated`,
    });
  }, [audioPreloaded, visualPreloaded, audioEnabled, playlistVideos.length, practice]);

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
    
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.pauseVideo();
    }
  };

  const resumeSession = () => {
    setIsPaused(false);
    startTimer();
    
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.playVideo();
    }
  };

  const stopSession = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    fadeOutAudio();
    fadeOutVisual();
    
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
    
    fadeOutAudio();
    fadeOutVisual();
    
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

  const playAudio = () => {
    if (!audioEnabled || playlistVideos.length === 0) return;
    
    // Create YouTube player
    const playerDiv = document.createElement('div');
    playerDiv.style.display = 'none';
    if (youtubeContainerRef.current) {
      youtubeContainerRef.current.appendChild(playerDiv);
    }
    
    // Initialize YouTube player with first video from playlist
    const firstVideo = playlistVideos[0];
    if (firstVideo && window.YT) {
      youtubePlayerRef.current = new window.YT.Player(playerDiv, {
        videoId: firstVideo.id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          loop: 1,
          playlist: playlistVideos.map(v => v.id).join(','),
          volume: audioVolume,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(audioVolume);
            event.target.playVideo();
          },
        },
      });
    }
  };

  const fadeOutAudio = () => {
    if (!youtubePlayerRef.current) return;
    
    let vol = audioVolume;
    fadeIntervalRef.current = setInterval(() => {
      vol -= 5;
      if (vol <= 0) {
        youtubePlayerRef.current?.stopVideo();
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
        // Clean up player
        if (youtubeContainerRef.current) {
          youtubeContainerRef.current.innerHTML = '';
        }
      } else {
        youtubePlayerRef.current?.setVolume(vol);
      }
    }, 200);
  };

  const fadeOutVisual = () => {
    // Visual fade-out will be handled by the visual component
    // through the isActive prop change
  };

  const launchVisual = (visualType: MeditationType) => {
    // Visual launching is handled by the MeditationVisuals component
    // through the type and isActive props
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
          playlist_used: practice.youtubePlaylistId || null,
        }
      };
      
      const { error } = await supabase
        .from('meditation_sessions')
        .insert(sessionData);
      
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
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
      }
    };
  }, []);

  return (
    <>
      {/* Hidden YouTube container */}
      <div ref={youtubeContainerRef} style={{ display: 'none' }} />
      
      {/* Session Setup Phase */}
      {!isActive && !isCompleted && (
        <PracticeSetup
          practice={practice}
          duration={duration}
          audioPreloaded={audioPreloaded}
          visualPreloaded={visualPreloaded}
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
          <div className="fixed inset-0 z-40">
            <MeditationVisuals 
              type={practice.visualType}
              isActive={!isPaused}
            />
          </div>

          {/* Session Controls Overlay */}
          <div className="fixed inset-0 z-50 pointer-events-none">
            
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
                onClick={stopSession}
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