import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Users, 
  Heart, 
  Sparkles,
  MessageCircle,
  Share2,
  RotateCcw,
  Timer,
  Music,
  X,
  Settings,
  Clock,
  Waves,
  Circle,
  Brain,
  Video,
  PlayCircle,
  Square
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { YouTubeVideo } from '@/types/youtube';
import { useToast } from '@/hooks/use-toast';
import { useYouTubeAPI } from '@/hooks/useYouTubeAPI';
import { MEDITATION_MODULE_CONFIG } from '@/config/mediaMaps';
import { motion, AnimatePresence } from 'framer-motion';
import MeditationVisuals from '@/components/MeditationVisuals';
import { MeditationPracticeGuide } from '@/components/MeditationPracticeGuide';
import { MeditationPrompts } from '@/components/MeditationPrompts';
import { PostMeditationReflection } from '@/components/PostMeditationReflection';
import { MeditationPlaylistIntegration } from '@/components/MeditationPlaylistIntegration';

type MeditationType = 'breathing' | 'loving-kindness' | 'chakra' | 'mindfulness' | 'body-scan';

interface GroupMeditationSessionProps {
  sessionId: string;
  sessionType: MeditationType;
  duration: number;
  backgroundAudio?: YouTubeVideo;
  onLeave: () => void;
}

interface Participant {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  joined_at: string;
  status: 'meditating' | 'listening' | 'away';
  heart_rate?: number;
}

interface SessionState {
  is_playing: boolean;
  current_time: number;
  volume: number;
  synchronized_start?: string;
  session_type: MeditationType;
  session_duration: number;
  background_audio?: YouTubeVideo;
}

const meditationTypes = [
  {
    id: 'breathing' as MeditationType,
    name: 'Breath Awareness',
    description: 'Connect with the sacred rhythm of life force',
    icon: <Waves className="w-5 h-5" />,
    defaultDuration: 10,
    guidance: 'Follow the natural flow of prana through your being',
    color: 'from-emerald-600 to-teal-600',
    benefits: [
      'Activates parasympathetic nervous system for deep calm',
      'Increases present moment awareness and mindfulness',
      'Balances life force energy (prana) throughout the body',
      'Reduces stress hormones and anxiety naturally'
    ],
    instructions: [
      'Sit comfortably with spine naturally erect',
      'Close eyes and bring attention to natural breathing',
      'Notice the pause between inhale and exhale',
      'When mind wanders, gently return to breath sensation',
      'Feel the breath as sacred life force flowing through you'
    ],
    prompts: {
      beginning: "Notice how your breath flows naturally without control.",
      midpoint: "Bring attention to the space between breaths—what do you find there?",
      closing: "Feel gratitude for this sacred rhythm that sustains your being."
    },
    reflectionPrompt: "What shifted in your breath or body awareness?"
  },
  {
    id: 'loving-kindness' as MeditationType,
    name: 'Heart Opening',
    description: 'Expand love and compassion to all existence',
    icon: <Heart className="w-5 h-5" />,
    defaultDuration: 15,
    guidance: 'Radiate unconditional love from your heart center',
    color: 'from-rose-500 to-pink-500',
    benefits: [
      'Cultivates self-compassion and emotional resilience',
      'Strengthens neural pathways for empathy and connection',
      'Reduces social anxiety and interpersonal conflicts',
      'Opens the heart chakra for deeper spiritual connection'
    ],
    instructions: [
      'Place hand on heart and feel its gentle rhythm',
      'Begin by sending love to yourself: "May I be happy, may I be peaceful"',
      'Extend love to loved ones, then neutral people, then difficult people',
      'Finally, radiate love to all beings everywhere',
      'Feel your heart expanding with each loving intention'
    ],
    prompts: {
      beginning: "Feel the warmth in your heart center as you begin.",
      midpoint: "Notice how love naturally wants to expand beyond boundaries.",
      closing: "Carry this open heart with you into the world."
    },
    reflectionPrompt: "What emotions or connections arose during your practice?"
  },
  {
    id: 'chakra' as MeditationType,
    name: 'Energy Alignment',
    description: 'Harmonize your subtle energy centers',
    icon: <Circle className="w-5 h-5" />,
    defaultDuration: 20,
    guidance: 'Feel each chakra spinning with divine light',
    color: 'from-purple-600 to-violet-600',
    benefits: [
      'Balances and aligns the seven main energy centers',
      'Clears energetic blocks and stagnant emotions',
      'Enhances intuition and spiritual awareness',
      'Promotes overall energetic health and vitality'
    ],
    instructions: [
      'Visualize each chakra as a spinning wheel of light',
      'Start at root (red) and move up to crown (violet)',
      'Breathe colored light into each energy center',
      'Feel each chakra becoming bright and balanced',
      'Sense the flow of energy throughout your entire being'
    ],
    prompts: {
      beginning: "Visualize roots extending from your base into the earth.",
      midpoint: "Feel the rainbow of light ascending through your spine.",
      closing: "Sense all chakras spinning in perfect harmony."
    },
    reflectionPrompt: "Which energy centers felt most active or in need of attention?"
  },
  {
    id: 'mindfulness' as MeditationType,
    name: 'Consciousness Observation',
    description: 'Witness the nature of awareness itself',
    icon: <Brain className="w-5 h-5" />,
    defaultDuration: 12,
    guidance: 'Rest in pure awareness, the witness of all experience',
    color: 'from-blue-600 to-cyan-600',
    benefits: [
      'Develops meta-cognitive awareness and mental clarity',
      'Reduces identification with thoughts and emotions',
      'Cultivates the witness consciousness beyond the ego',
      'Enhances equanimity and inner peace'
    ],
    instructions: [
      'Sit in relaxed alertness, spine straight but not rigid',
      'Simply observe whatever arises in consciousness',
      'Notice thoughts, sensations, emotions without judgment',
      'Ask: "Who is aware of these experiences?"',
      'Rest as the aware presence that witnesses all'
    ],
    prompts: {
      beginning: "Simply notice what is here in this moment.",
      midpoint: "Who or what is aware of these changing experiences?",
      closing: "Rest as the unchanging awareness itself."
    },
    reflectionPrompt: "What did you notice about the nature of awareness itself?"
  },
  {
    id: 'body-scan' as MeditationType,
    name: 'Somatic Integration',
    description: 'Awaken embodied presence and release',
    icon: <Sparkles className="w-5 h-5" />,
    defaultDuration: 18,
    guidance: 'Feel the light of consciousness illuminating every cell',
    color: 'from-violet-600 to-purple-600',
    benefits: [
      'Releases physical tension and stored trauma',
      'Increases body awareness and somatic intelligence',
      'Promotes deep relaxation and nervous system regulation',
      'Integrates mind-body connection for holistic wellness'
    ],
    instructions: [
      'Lie down or sit comfortably with eyes closed',
      'Systematically scan from toes to head',
      'Breathe into each area, noticing sensations',
      'Send loving awareness to tense or uncomfortable areas',
      'Feel your entire body relaxed and integrated'
    ],
    prompts: {
      beginning: "Bring gentle curiosity to how your body feels right now.",
      midpoint: "Breathe loving awareness into any areas of tension.",
      closing: "Feel your body as a temple of consciousness."
    },
    reflectionPrompt: "What sensations, tensions, or releases did you experience?"
  }
];

export function GroupMeditationSession({ 
  sessionId, 
  sessionType, 
  duration, 
  backgroundAudio,
  onLeave 
}: GroupMeditationSessionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getVideosFromPlaylistByTitle, loading: youtubeLoading } = useYouTubeAPI();
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sessionState, setSessionState] = useState<SessionState>({
    is_playing: false,
    current_time: 0,
    volume: 50,
    session_type: sessionType,
    session_duration: duration,
    background_audio: backgroundAudio
  });
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isHost, setIsHost] = useState(false);
  const [showBreathingGuide, setShowBreathingGuide] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [personalVolume, setPersonalVolume] = useState([70]);
  const [meditationVideos, setMeditationVideos] = useState<YouTubeVideo[]>([]);
  const [selectedBackgroundAudio, setSelectedBackgroundAudio] = useState<YouTubeVideo | null>(backgroundAudio || null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [availableDurations] = useState([5, 10, 15, 20, 25, 30, 45, 60]);
  const [actionBarMinimized, setActionBarMinimized] = useState(true);
  const [actionBarVisible, setActionBarVisible] = useState(true);
  
  // Enhanced UX state
  const [showReflectionPrompt, setShowReflectionPrompt] = useState(false);
  
  const channelRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const youtubePlayerRef = useRef<any>(null);

  useEffect(() => {
    loadMeditationContent();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Create realtime channel for session
    const channel = supabase.channel(`meditation_session_${sessionId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track user presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const currentParticipants: Participant[] = [];
        
        Object.entries(presenceState).forEach(([userId, presences]: [string, any]) => {
          if (presences && presences.length > 0) {
            const presence = presences[0];
            currentParticipants.push({
              id: userId,
              user_id: userId,
              name: presence.name || 'Anonymous',
              avatar_url: presence.avatar_url,
              joined_at: presence.joined_at,
              status: presence.status || 'meditating'
            });
          }
        });
        
        setParticipants(currentParticipants);
        
        // Determine if current user is host (first to join)
        const sortedParticipants = currentParticipants.sort((a, b) => 
          new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime()
        );
        setIsHost(sortedParticipants[0]?.user_id === user.id);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .on('broadcast', { event: 'session_state' }, ({ payload }) => {
        setSessionState(payload);
        if (payload.synchronized_start) {
          synchronizeTimer(payload.synchronized_start);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track current user presence
          await channel.track({
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
            avatar_url: user.user_metadata?.avatar_url,
            joined_at: new Date().toISOString(),
            status: 'meditating'
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopBackgroundAudio();
      supabase.removeChannel(channel);
    };
  }, [user, sessionId]);

  const loadMeditationContent = async () => {
    try {
      const videosData = await getVideosFromPlaylistByTitle(MEDITATION_MODULE_CONFIG.playlistTitle, 25);
      setMeditationVideos(videosData.videos);
    } catch (error) {
      console.error('Error loading meditation content:', error);
    }
  };

  const synchronizeTimer = (startTime: string) => {
    const elapsed = (Date.now() - new Date(startTime).getTime()) / 1000;
    const remaining = Math.max(0, sessionState.session_duration * 60 - elapsed);
    setTimeRemaining(remaining);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (remaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = Math.max(0, prev - 1);
          if (newTime === 0) {
            clearInterval(timerRef.current!);
            completeMeditation();
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const broadcastSessionState = (newState: Partial<SessionState>) => {
    const updatedState = { ...sessionState, ...newState };
    setSessionState(updatedState);
    
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'session_state',
        payload: updatedState
      });
    }
  };

  const startSession = () => {
    const startTime = new Date().toISOString();
    setShowControls(false);
    setActionBarMinimized(true); // Minimize to action bar during meditation
    broadcastSessionState({ 
      is_playing: true, 
      synchronized_start: startTime 
    });
    synchronizeTimer(startTime);
    
    if (soundEnabled) {
      if (selectedBackgroundAudio) {
        startBackgroundAudio(selectedBackgroundAudio);
      } else {
        playMeditationSound('start');
      }
    }
    
    toast({
      title: "Sacred Circle Begins",
      description: `Collective meditation for ${sessionState.session_duration} minutes`,
    });
  };

  const pauseSession = () => {
    setShowControls(true);
    setActionBarMinimized(false); // Show full interface when paused
    broadcastSessionState({ is_playing: false });
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (soundEnabled) {
      playMeditationSound('pause');
    }
    
    toast({
      title: "Session Paused",
      description: "Group meditation has been paused",
    });
  };

  const stopSession = () => {
    setShowControls(true);
    setActionBarMinimized(false); // Show full interface when stopped
    broadcastSessionState({ is_playing: false });
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeRemaining(sessionState.session_duration * 60);
    
    stopBackgroundAudio();
    
    if (soundEnabled) {
      playMeditationSound('stop');
    }

    toast({
      title: "Session Ended",
      description: "Group meditation has been stopped",
    });
  };

  const completeMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setSessionCompleted(true);
    setShowControls(true);
    
    stopBackgroundAudio();
    
    if (soundEnabled) {
      playMeditationSound('complete');
    }

    toast({
      title: "Sacred Circle Complete 🕉️",
      description: "The collective light you have kindled continues to shine",
    });

    // Show reflection prompt after a brief moment
    setTimeout(() => {
      setShowReflectionPrompt(true);
    }, 2000);

    setTimeout(() => {
      setSessionCompleted(false);
    }, 8000);
  };

  const handlePracticeSelect = (practiceId: string) => {
    const practice = meditationTypes.find(t => t.id === practiceId);
    if (practice && isHost) {
      updateSessionType(practice.id);
    }
  };

  const handleReflectionClose = () => {
    setShowReflectionPrompt(false);
  };

  const adjustVolume = (newVolume: number[]) => {
    if (isHost) {
      broadcastSessionState({ volume: newVolume[0] });
    }
  };

  const updateSessionType = (newType: MeditationType) => {
    if (isHost && !sessionState.is_playing) {
      broadcastSessionState({ session_type: newType });
    }
  };

  const updateSessionDuration = (newDuration: number) => {
    if (isHost && !sessionState.is_playing) {
      broadcastSessionState({ session_duration: newDuration });
      setTimeRemaining(newDuration * 60);
    }
  };

  const updateBackgroundAudio = (audio: YouTubeVideo | null) => {
    if (isHost) {
      setSelectedBackgroundAudio(audio);
      broadcastSessionState({ background_audio: audio || undefined });
    }
  };

  const startBackgroundAudio = (video: YouTubeVideo) => {
    try {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`;
      iframe.style.display = 'none';
      iframe.allow = 'autoplay';
      document.body.appendChild(iframe);
      youtubePlayerRef.current = iframe;
    } catch (error) {
      console.error('Error starting background audio:', error);
    }
  };

  const stopBackgroundAudio = () => {
    if (youtubePlayerRef.current) {
      document.body.removeChild(youtubePlayerRef.current);
      youtubePlayerRef.current = null;
    }
  };

  const playMeditationSound = (type: 'start' | 'pause' | 'stop' | 'complete') => {
    console.log(`Playing ${type} sound for group session`);
  };

  const shareSession = () => {
    const sessionUrl = `${window.location.origin}/meditation?session=${sessionId}`;
    if (navigator.share) {
      navigator.share({ 
        title: `Join our ${meditationTypes.find(t => t.id === sessionState.session_type)?.name} meditation circle`,
        text: `Experience collective consciousness expansion in a ${sessionState.session_type} meditation session`,
        url: sessionUrl
      });
    } else {
      navigator.clipboard?.writeText(sessionUrl);
      toast({
        title: "Session Link Copied",
        description: "Share this link to invite others to your meditation circle",
      });
    }
  };

  const sendHeartbeat = () => {
    if (channelRef.current && user) {
      channelRef.current.track({
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        avatar_url: user.user_metadata?.avatar_url,
        joined_at: new Date().toISOString(),
        status: 'meditating',
        heart_rate: Math.floor(Math.random() * 20) + 60 // Simulated heart rate
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  console.log('GroupMeditationSession render:', { 
    isPlaying: sessionState.is_playing, 
    sessionType: sessionState.session_type,
    participantCount: participants.length 
  });

  const progress = ((sessionState.session_duration * 60 - timeRemaining) / (sessionState.session_duration * 60)) * 100;
  const selectedMeditation = meditationTypes.find(t => t.id === sessionState.session_type);

  return (
    <>
      {/* YouTube Playlist Integration for Group Session */}
      <MeditationPlaylistIntegration
        isActive={sessionState.is_playing && soundEnabled}
        practiceName={selectedMeditation?.name || 'Group Meditation'}
        durationMinutes={sessionState.session_duration}
        volume={personalVolume[0]}
        onVideoChange={(title) => {
          console.log(`🎵 Group session now playing: ${title}`);
        }}
        onError={(error) => {
          console.error('🚨 Group session playlist error:', error);
          toast({
            title: "Audio Error",
            description: "Continuing group session without background audio",
            variant: "destructive",
          });
        }}
      />

      {/* Practice Guide for Group Sessions */}
      <MeditationPracticeGuide
        practices={meditationTypes}
        onSelectPractice={handlePracticeSelect}
      />

      {/* Dynamic Meditation Prompts for Group Sessions */}
      {selectedMeditation?.prompts && (
        <MeditationPrompts
          isActive={sessionState.is_playing}
          sessionProgress={progress}
          prompts={selectedMeditation.prompts}
          practiceColor={selectedMeditation.color}
        />
      )}

      {/* Post-Meditation Reflection for Group Sessions */}
      <PostMeditationReflection
        isVisible={showReflectionPrompt}
        onClose={handleReflectionClose}
        practiceName={selectedMeditation?.name || 'Group Meditation'}
        practiceType={sessionState.session_type}
        sessionDuration={sessionState.session_duration}
        reflectionPrompt={selectedMeditation?.reflectionPrompt || 'How did this group practice affect you?'}
      />
      {/* Session Completion Overlay */}
      <AnimatePresence>
        {sessionCompleted && (
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
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="h-16 w-16 mx-auto text-gold-400" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-light mb-2">Sacred Circle Complete</h3>
                  <p className="text-white/80">
                    The collective light you have kindled within continues to shine. 
                    May this shared peace remain with all souls who gathered here.
                  </p>
                </div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="text-sm text-white/60"
                >
                  🕉️ Collective Namaste 🕉️
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Action Bar during meditation */}
      <AnimatePresence>
        {sessionState.is_playing && actionBarVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <Card className={`mx-4 mb-4 bg-black/40 backdrop-blur-md border-white/20 text-white transition-all duration-300 ${
              actionBarMinimized ? 'rounded-full' : 'rounded-xl'
            }`}>
              <CardContent className={`p-0 ${actionBarMinimized ? 'py-3 px-6' : 'p-6'}`}>
                {actionBarMinimized ? (
                  // Minimized Action Bar
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${selectedMeditation?.color || 'from-purple-500 to-indigo-500'}`}>
                          {selectedMeditation?.icon}
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-mono tracking-wide">
                            {formatTime(timeRemaining)}
                          </div>
                          <div className="text-xs text-white/70">
                            {participants.length} souls present
                          </div>
                        </div>
                      </div>
                      
                      <Progress 
                        value={progress} 
                        className="w-24 h-1 bg-white/20" 
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isHost && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={pauseSession}
                          className="text-white hover:bg-white/20 rounded-full"
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActionBarMinimized(false)}
                        className="text-white hover:bg-white/20 rounded-full"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActionBarVisible(false)}
                        className="text-white hover:bg-white/20 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Expanded Action Bar
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${selectedMeditation?.color || 'from-purple-500 to-indigo-500'}`}>
                          {selectedMeditation?.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{selectedMeditation?.name}</h3>
                          <p className="text-sm text-white/70">Sacred Circle • {participants.length} participants</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setActionBarMinimized(true)}
                          className="text-white hover:bg-white/20"
                        >
                          Minimize
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={onLeave}
                          className="text-white hover:bg-white/20"
                        >
                          Leave
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-mono tracking-wide mb-2">
                        {formatTime(timeRemaining)}
                      </div>
                      <Progress value={progress} className="h-2 bg-white/20 mb-2" />
                      <p className="text-sm text-white/80">{selectedMeditation?.guidance}</p>
                    </div>
                    
                    {isHost && (
                      <div className="flex justify-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={pauseSession}
                          className="text-white border-white/30 hover:bg-white/20"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={stopSession}
                          className="text-white border-white/30 hover:bg-white/20"
                        >
                          <Square className="h-4 w-4 mr-2" />
                          End Session
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        <Slider
                          value={personalVolume}
                          onValueChange={setPersonalVolume}
                          max={100}
                          step={1}
                          className="w-24"
                        />
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="text-white hover:bg-white/20"
                      >
                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Action Bar Toggle (when action bar is hidden) */}
      <AnimatePresence>
        {sessionState.is_playing && !actionBarVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setActionBarVisible(true)}
              className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 text-white shadow-2xl"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Session Interface - Only show when session is not playing */}
      <AnimatePresence>
        {!sessionState.is_playing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          >
            <Card className="w-full max-w-6xl h-full max-h-[90vh] overflow-hidden animate-scale-in">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${sessionState.is_playing ? 'bg-white/10' : 'bg-primary/10'}`}>
                  <Sparkles className={`h-5 w-5 ${sessionState.is_playing ? 'text-white' : 'text-primary'}`} />
                </div>
                <div>
                  <CardTitle className={`text-xl ${sessionState.is_playing ? 'text-white' : ''}`}>Group Meditation Session</CardTitle>
                  <p className={`text-sm ${sessionState.is_playing ? 'text-white/70' : 'text-muted-foreground'} capitalize`}>
                    {selectedMeditation?.name} • {sessionState.session_duration} minutes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={`flex items-center gap-1 ${sessionState.is_playing ? 'bg-white/10 text-white border-white/20' : ''}`}>
                  <Users className="h-3 w-3" />
                  {participants.length}
                </Badge>
                <Button variant="ghost" size="sm" onClick={onLeave} className={sessionState.is_playing ? 'text-white/60 hover:text-white hover:bg-white/10' : ''}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden p-0">
            <Tabs defaultValue="session" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger value="session">Session</TabsTrigger>
                <TabsTrigger value="settings" disabled={!isHost}>Settings</TabsTrigger>
                <TabsTrigger value="soundscape">Soundscape</TabsTrigger>
                <TabsTrigger value="participants">Circle</TabsTrigger>
              </TabsList>

              {/* Session Tab */}
              <TabsContent value="session" className="flex-1 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
                  
                  {/* Main Session Area */}
                  <div className="lg:col-span-2 p-6 space-y-6">
                
                    {/* Timer and Progress */}
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="text-4xl font-bold text-primary animate-pulse">
                          {formatTime(timeRemaining)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {sessionState.is_playing ? `${selectedMeditation?.name} in progress` : 'Ready to begin sacred practice'}
                        </p>
                      </div>
                      
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Host Controls */}
                    {isHost && (
                      <Card className="border-primary/20">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            Host Controls
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-2">
                          {!sessionState.is_playing ? (
                            <Button onClick={startSession} className="hover-scale">
                              <Play className="h-4 w-4 mr-2" />
                              Start Session
                            </Button>
                          ) : (
                            <Button onClick={pauseSession} variant="outline" className="hover-scale">
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Session
                            </Button>
                          )}
                          <Button variant="outline" onClick={() => setTimeRemaining(sessionState.session_duration * 60)} className="hover-scale">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset Timer
                          </Button>
                          <Button variant="outline" onClick={stopSession} className="hover-scale">
                            <Square className="h-4 w-4 mr-2" />
                            End Session
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {/* Breathing Guide */}
                    {showBreathingGuide && !sessionState.is_playing && (
                      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                        <CardContent className="p-6 text-center">
                          <div className="animate-pulse">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary opacity-30 animate-[pulse_4s_ease-in-out_infinite]" />
                            <p className="mt-4 text-sm text-muted-foreground">
                              Breathe in harmony with the collective consciousness
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Inhale life • Hold integration • Exhale death • Rest in source
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Background Audio */}
                    {selectedBackgroundAudio && (
                      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={selectedBackgroundAudio.thumbnail} 
                              alt={selectedBackgroundAudio.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium line-clamp-1">{selectedBackgroundAudio.title}</h4>
                              <p className="text-sm text-muted-foreground">Sacred Soundscape</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Music className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">{sessionState.volume}%</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Personal Volume:</span>
                              <VolumeX className="h-4 w-4" />
                              <Slider
                                value={personalVolume}
                                onValueChange={setPersonalVolume}
                                max={100}
                                step={1}
                                className="w-24"
                              />
                              <Volume2 className="h-4 w-4" />
                              <span className="text-sm font-medium">{personalVolume[0]}%</span>
                            </div>
                            {isHost && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm">Circle Volume:</span>
                                <Slider
                                  value={[sessionState.volume]}
                                  onValueChange={adjustVolume}
                                  max={100}
                                  step={1}
                                  className="w-24"
                                />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Sound Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="hover-scale"
                      >
                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        <span className="ml-2 text-sm">
                          {soundEnabled ? 'Sound On' : 'Sound Off'}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={shareSession}
                        className="hover-scale"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Session
                      </Button>
                    </div>
                  </div>

                  {/* Participants Sidebar */}
                  <div className="border-l bg-muted/20 p-4 space-y-4 overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Participants ({participants.length})
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors animate-fade-in"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={participant.avatar_url} />
                            <AvatarFallback>
                              {participant.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">
                              {participant.name}
                              {participant.user_id === user?.id && ' (You)'}
                              {isHost && participant.user_id === participants.sort((a, b) => new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime())[0]?.user_id && ' 👑'}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                participant.status === 'meditating' ? 'bg-green-500' :
                                participant.status === 'listening' ? 'bg-blue-500' : 'bg-gray-500'
                              }`} />
                              <span className="text-xs text-muted-foreground capitalize">
                                {participant.status}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={sendHeartbeat}
                            className="p-1 hover-scale"
                          >
                            <Heart className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {participants.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        Waiting for participants to join...
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Settings Tab (Host Only) */}
              <TabsContent value="settings" className="flex-1 p-6 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Session Settings</h3>
                  <p className="text-muted-foreground">Configure your meditation circle</p>
                </div>

                {/* Meditation Type Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Practice Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {meditationTypes.map((type) => (
                        <Card
                          key={type.id}
                          className={`cursor-pointer transition-all ${
                            sessionState.session_type === type.id
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => updateSessionType(type.id)}
                        >
                          <CardContent className="p-4 text-center space-y-2">
                            <div className={`mx-auto w-10 h-10 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center text-white`}>
                              {type.icon}
                            </div>
                            <h4 className="font-medium text-sm">{type.name}</h4>
                            <p className="text-xs text-muted-foreground">{type.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Duration Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Session Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {availableDurations.map((dur) => (
                        <Button
                          key={dur}
                          variant={sessionState.session_duration === dur ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSessionDuration(dur)}
                          className="hover-scale"
                        >
                          {dur} min
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Soundscape Tab */}
              <TabsContent value="soundscape" className="flex-1 p-6 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Sacred Soundscapes</h3>
                  <p className="text-muted-foreground">Choose background audio for your practice</p>
                </div>

                {selectedBackgroundAudio ? (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedBackgroundAudio.thumbnail}
                            alt={selectedBackgroundAudio.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium">{selectedBackgroundAudio.title}</h4>
                            <p className="text-sm text-muted-foreground">{selectedBackgroundAudio.duration}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateBackgroundAudio(null)}
                        >
                          Change
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {youtubeLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading sacred sounds...</p>
                      </div>
                    ) : meditationVideos.length > 0 ? (
                      meditationVideos.slice(0, 8).map((video) => (
                        <Card
                          key={video.id}
                          className="hover:bg-muted/50 cursor-pointer transition-all hover-scale"
                          onClick={() => updateBackgroundAudio(video)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-16 h-12 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium line-clamp-1">{video.title}</p>
                                <p className="text-sm text-muted-foreground">{video.duration}</p>
                              </div>
                              <PlayCircle className="h-5 w-5 text-primary" />
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">Sacred soundscapes unavailable</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Participants Tab */}
              <TabsContent value="participants" className="flex-1 p-6 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Sacred Circle</h3>
                  <p className="text-muted-foreground">Souls gathered for collective practice</p>
                </div>

                <div className="grid gap-4">
                  {participants.map((participant) => (
                    <Card key={participant.id} className="animate-fade-in">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={participant.avatar_url} />
                            <AvatarFallback>
                              {participant.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                {participant.name}
                                {participant.user_id === user?.id && ' (You)'}
                              </h4>
                              {isHost && participant.user_id === participants.sort((a, b) => new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime())[0]?.user_id && (
                                <Badge variant="secondary">Host 👑</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  participant.status === 'meditating' ? 'bg-green-500' :
                                  participant.status === 'listening' ? 'bg-blue-500' : 'bg-gray-500'
                                }`} />
                                <span className="text-xs text-muted-foreground capitalize">
                                  {participant.status}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Joined {new Date(participant.joined_at).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={sendHeartbeat}
                            className="hover-scale"
                          >
                            <Heart className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {participants.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-muted-foreground">Waiting for souls to join the circle...</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Meditation Visual Background */}
      <div className="fixed inset-0 z-40">
        <MeditationVisuals 
          type={sessionState.session_type} 
          isActive={sessionState.is_playing}
        />
      </div>

      {/* Floating Session Timer (when active) - Minimized */}
      <AnimatePresence>
        {sessionState.is_playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 left-4 z-50"
          >
            <Card className="bg-black/30 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-3 flex items-center gap-3 text-sm">
                <div className="font-mono">{formatTime(timeRemaining)}</div>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {participants.length}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}