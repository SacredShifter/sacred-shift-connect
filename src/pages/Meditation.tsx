import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Square, 
  Users, 
  Clock, 
  Sparkles, 
  Heart, 
  Brain, 
  Volume2,
  VolumeX,
  Settings,
  Video,
  PlayCircle,
  Waves,
  Circle,
  Info,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { useYouTubeAPI } from '@/hooks/useYouTubeAPI';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { YouTubeVideo, YouTubePlaylist } from '@/types/youtube';

import { GroupMeditationSession } from '@/components/GroupMeditationSession';
import { MEDITATION_MODULE_CONFIG } from '@/config/mediaMaps';
import { Slogan } from '@/components/ui/Slogan';
import MeditationVisuals from '@/components/MeditationVisuals';
import { MeditationPlaylistIntegration } from '@/components/MeditationPlaylistIntegration';
import { motion, AnimatePresence } from 'framer-motion';
import { MeditationPracticeGuide } from '@/components/MeditationPracticeGuide';
import { MeditationPrompts } from '@/components/MeditationPrompts';
import { PostMeditationReflection } from '@/components/PostMeditationReflection';

type MeditationType = 'breathing' | 'loving-kindness' | 'chakra' | 'mindfulness' | 'body-scan';
type SessionState = 'idle' | 'active' | 'paused' | 'completed';

interface MeditationSession {
  id: string;
  type: MeditationType;
  duration: number;
  participantCount: number;
  startedAt: string;
  isActive: boolean;
  circleId?: string;
  backgroundAudio?: YouTubeVideo;
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

export default function Meditation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { circles, loading: circlesLoading } = useSacredCircles();
  const { getVideosFromPlaylistByTitle, loading: youtubeLoading } = useYouTubeAPI();
  
  // Meditation state
  const [selectedType, setSelectedType] = useState<MeditationType>('breathing');
  const [duration, setDuration] = useState([10]);
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState([70]);
  const [showControls, setShowControls] = useState(true);
  
  // Group meditation state
  const [activeSessions, setActiveSessions] = useState<MeditationSession[]>([]);
  const [joinedSessionId, setJoinedSessionId] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  
  // YouTube integration state
  const [meditationVideos, setMeditationVideos] = useState<YouTubeVideo[]>([]);
  const [selectedBackgroundAudio, setSelectedBackgroundAudio] = useState<YouTubeVideo | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState([30]);
  
  // Enhanced UX state
  const [showReflectionPrompt, setShowReflectionPrompt] = useState(false);
  const [showPracticeInfo, setShowPracticeInfo] = useState(false);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const youtubePlayerRef = useRef<any>(null);

  useEffect(() => {
    fetchActiveSessions();
    loadMeditationContent();
    const interval = setInterval(fetchActiveSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const fetchActiveSessions = async () => {
    try {
      setActiveSessions([
        {
          id: '1',
          type: 'breathing',
          duration: 15,
          participantCount: 3,
          startedAt: new Date().toISOString(),
          isActive: true,
          circleId: circles[0]?.id
        },
        {
          id: '2',
          type: 'loving-kindness',
          duration: 20,
          participantCount: 7,
          startedAt: new Date(Date.now() - 600000).toISOString(),
          isActive: true,
          circleId: circles[1]?.id
        }
      ]);
    } catch (error) {
      console.error('Error fetching meditation sessions:', error);
    }
  };

  const loadMeditationContent = async () => {
    try {
      const videosData = await getVideosFromPlaylistByTitle(MEDITATION_MODULE_CONFIG.playlistTitle, 25);
      setMeditationVideos(videosData.videos);
    } catch (error) {
      console.error('Error loading meditation content:', error);
      toast({
        title: "Error",
        description: "Could not load meditation videos. Please try again later.",
        variant: "destructive",
      });
    }
  };


  const startSoloMeditation = () => {
    console.log(`🚀 Starting solo meditation: ${selectedMeditation?.name} for ${duration[0]} minutes`);
    const totalTime = duration[0] * 60;
    setTimeRemaining(totalTime);
    setSessionState('active');
    setSessionProgress(0);
    setShowControls(false);
    
    if (soundEnabled) {
      if (selectedBackgroundAudio) {
        startBackgroundAudio(selectedBackgroundAudio);
      } else {
        playMeditationSound('start');
      }
    }
    
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        const progress = ((totalTime - newTime) / totalTime) * 100;
        setSessionProgress(progress);
        
        if (newTime <= 0) {
          completeMeditation();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    toast({
      title: "Sacred Practice Begins",
      description: `${meditationTypes.find(t => t.id === selectedType)?.name} session initiated`,
    });
  };

  const pauseMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSessionState('paused');
    setShowControls(true);
    
    if (soundEnabled) {
      playMeditationSound('pause');
    }
  };

  const resumeMeditation = () => {
    setSessionState('active');
    setShowControls(false);
    
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        const totalTime = duration[0] * 60;
        const progress = ((totalTime - newTime) / totalTime) * 100;
        setSessionProgress(progress);
        
        if (newTime <= 0) {
          completeMeditation();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  const stopMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSessionState('idle');
    setTimeRemaining(0);
    setSessionProgress(0);
    setShowControls(true);
    
    stopBackgroundAudio();
    
    if (soundEnabled) {
      playMeditationSound('stop');
    }

    toast({
      title: "Practice Complete",
      description: "May the peace you cultivated remain with you",
    });
  };

  const startBackgroundAudio = (video: YouTubeVideo) => {
    try {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`;
      iframe.style.display = 'none';
      iframe.allow = 'autoplay';
      document.body.appendChild(iframe);
      youtubePlayerRef.current = iframe;
      setIsAudioPlaying(true);
    } catch (error) {
      console.error('Error starting background audio:', error);
    }
  };

  const stopBackgroundAudio = () => {
    if (youtubePlayerRef.current) {
      document.body.removeChild(youtubePlayerRef.current);
      youtubePlayerRef.current = null;
    }
    setIsAudioPlaying(false);
  };

  const selectBackgroundAudio = (video: YouTubeVideo) => {
    setSelectedBackgroundAudio(video);
    toast({
      title: "Sacred Soundscape Selected",
      description: `${video.title} will accompany your practice`,
    });
  };

  const completeMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSessionState('completed');
    setShowControls(true);
    
    stopBackgroundAudio();
    
    if (soundEnabled) {
      playMeditationSound('complete');
    }

    toast({
      title: "Sacred Practice Complete 🕉️",
      description: "You have touched the infinite within. Honor this moment.",
    });

    // Show reflection prompt after a brief moment
    setTimeout(() => {
      setShowReflectionPrompt(true);
    }, 2000);

    setTimeout(() => {
      setSessionState('idle');
      setSessionProgress(0);
    }, 8000);
  };

  const handlePracticeSelect = (practiceId: string) => {
    const practice = meditationTypes.find(t => t.id === practiceId);
    if (practice) {
      setSelectedType(practice.id);
      setDuration([practice.defaultDuration]);
    }
  };

  const handleReflectionClose = () => {
    setShowReflectionPrompt(false);
  };

  const playMeditationSound = (type: 'start' | 'pause' | 'stop' | 'complete') => {
    console.log(`Playing ${type} sound`);
  };

  const createGroupSession = async () => {
    setIsCreatingSession(true);
    try {
      const newSession: MeditationSession = {
        id: Date.now().toString(),
        type: selectedType,
        duration: duration[0],
        participantCount: 1,
        startedAt: new Date().toISOString(),
        isActive: true,
        circleId: circles[0]?.id,
        backgroundAudio: selectedBackgroundAudio || undefined
      };

      setActiveSessions(prev => [...prev, newSession]);
      setJoinedSessionId(newSession.id);

      toast({
        title: "Sacred Circle Created",
        description: "Others may now join your meditation journey",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group session",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSession(false);
    }
  };

  const joinGroupSession = async (sessionId: string) => {
    try {
      setJoinedSessionId(sessionId);
      
      setActiveSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, participantCount: session.participantCount + 1 }
            : session
        )
      );

      toast({
        title: "Joined Sacred Circle",
        description: "You are now part of the collective practice",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join session",
        variant: "destructive",
      });
    }
  };

  const leaveGroupSession = () => {
    if (joinedSessionId) {
      setActiveSessions(prev => 
        prev.map(session => 
          session.id === joinedSessionId 
            ? { ...session, participantCount: Math.max(0, session.participantCount - 1) }
            : session
        )
      );
      setJoinedSessionId(null);

      toast({
        title: "Left Sacred Circle",
        description: "Your individual practice continues",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedMeditation = meditationTypes.find(t => t.id === selectedType);
  const joinedSession = activeSessions.find(s => s.id === joinedSessionId);

  return (
    <>
      {/* YouTube Playlist Integration */}
      <MeditationPlaylistIntegration
        isActive={sessionState === 'active' && soundEnabled}
        practiceName={selectedMeditation?.name || 'Sacred Shifter Journey Snippets'}
        durationMinutes={duration[0]}
        volume={volume[0]}
        onVideoChange={(title) => {
          console.log(`🎵 Now playing: ${title}`);
        }}
        onError={(error) => {
          console.error('🚨 Playlist error:', error);
          toast({
            title: "Audio Error",
            description: "Continuing session without background audio",
            variant: "destructive",
          });
        }}
      />

      {/* Practice Guide */}
      <MeditationPracticeGuide
        practices={meditationTypes}
        onSelectPractice={handlePracticeSelect}
      />

      {/* Dynamic Meditation Prompts */}
      {selectedMeditation?.prompts && (
        <MeditationPrompts
          isActive={sessionState === 'active'}
          sessionProgress={sessionProgress}
          prompts={selectedMeditation.prompts}
          practiceColor={selectedMeditation.color}
        />
      )}

      {/* Post-Meditation Reflection */}
      <PostMeditationReflection
        isVisible={showReflectionPrompt}
        onClose={handleReflectionClose}
        practiceName={selectedMeditation?.name || 'Meditation'}
        practiceType={selectedType}
        sessionDuration={duration[0]}
        reflectionPrompt={selectedMeditation?.reflectionPrompt || 'How did this practice affect you?'}
      />


      {/* Group Session Interface Overlay */}
      {joinedSession && (
        <GroupMeditationSession
          sessionId={joinedSession.id}
          sessionType={joinedSession.type}
          duration={joinedSession.duration}
          backgroundAudio={joinedSession.backgroundAudio}
          onLeave={leaveGroupSession}
        />
        )}

      <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        {/* Fullscreen Meditation Visual */}
        <div className="absolute inset-0">
          <MeditationVisuals 
            type={selectedType} 
            isActive={sessionState === 'active'}
          />
        </div>

        {/* Floating Session Timer (when active) */}
        <AnimatePresence>
          {(sessionState === 'active' || sessionState === 'paused') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50"
            >
              <Card className="bg-black/20 backdrop-blur-md border-white/10 text-white">
                <CardContent className="p-6 text-center space-y-4">
                  <motion.div 
                    className="text-4xl font-light tracking-wider"
                    animate={sessionState === 'active' ? { opacity: [0.7, 1, 0.7] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {formatTime(timeRemaining)}
                  </motion.div>
                  <Progress 
                    value={sessionProgress} 
                    className="h-1 bg-white/20"
                  />
                  <p className="text-sm text-white/80">{selectedMeditation?.guidance}</p>
                  
                  {sessionState === 'paused' && (
                    <div className="flex gap-2 pt-2">
                      <Button variant="ghost" size="sm" onClick={resumeMeditation} className="text-white hover:bg-white/20">
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                      <Button variant="ghost" size="sm" onClick={stopMeditation} className="text-white hover:bg-white/20">
                        <Square className="h-4 w-4 mr-2" />
                        End
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button - Pause (when active) */}
        <AnimatePresence>
          {sessionState === 'active' && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50"
            >
              <Button
                onClick={pauseMeditation}
                className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:bg-black/50 text-white shadow-2xl"
              >
                <Pause className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sacred Practice Completion */}
        <AnimatePresence>
          {sessionState === 'completed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center z-50 bg-black/50"
            >
              <Card className="bg-black/40 backdrop-blur-lg border-white/20 text-white max-w-md mx-4">
                <CardContent className="p-8 text-center space-y-6">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-16 w-16 mx-auto text-gold-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-light mb-2">Practice Complete</h3>
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
                    🕉️ Namaste 🕉️
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Panel (when not active and no group session joined) */}
        <AnimatePresence>
          {showControls && sessionState === 'idle' && !joinedSession && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute bottom-0 left-0 right-0 z-40"
            >
              <div className="bg-black/40 backdrop-blur-xl border-t border-white/10 p-6">
                <Tabs defaultValue="solo" className="w-full max-w-6xl mx-auto">
                  <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
                    <TabsTrigger value="solo" className="text-white data-[state=active]:bg-white/20">Solo Practice</TabsTrigger>
                    <TabsTrigger value="group" className="text-white data-[state=active]:bg-white/20">Group Sessions</TabsTrigger>
                    <TabsTrigger value="soundscape" className="text-white data-[state=active]:bg-white/20">Soundscapes</TabsTrigger>
                  </TabsList>

                  {/* Solo Practice Tab */}
                  <TabsContent value="solo" className="space-y-6 mt-6">
                    <div className="text-center space-y-4">
                      <h2 className="text-2xl font-light text-white">Sacred Meditation Practice</h2>
                      <p className="text-white/70 max-w-2xl mx-auto">
                        Choose your path to inner awakening. Each practice opens different doorways to consciousness.
                      </p>
                    </div>

                    {/* Practice Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-50">
                      {meditationTypes.map((practice) => (
                        <motion.div
                          key={practice.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative z-50"
                        >
                          <Card 
                            className={`cursor-pointer transition-all duration-300 relative z-50 ${
                              selectedType === practice.id 
                                ? 'bg-white/20 border-white/40 shadow-lg shadow-white/10' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            onClick={() => handlePracticeSelect(practice.id)}
                          >
                            <CardContent className="p-4 text-center space-y-3">
                              <div className={`mx-auto w-12 h-12 rounded-full bg-gradient-to-br ${practice.color} flex items-center justify-center text-white`}>
                                {practice.icon}
                              </div>
                              <div>
                                <h3 className="font-medium text-white">{practice.name}</h3>
                                <p className="text-xs text-white/70 mt-1">{practice.description}</p>
                                <Badge variant="outline" className="mt-2 text-white/60 border-white/20">
                                  {practice.defaultDuration} min
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Duration & Controls */}
                    <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                      <div className="flex items-center gap-4 text-white">
                        <Clock className="h-5 w-5" />
                        <span className="text-sm">Duration:</span>
                        <div className="flex items-center gap-3">
                          <Slider
                            value={duration}
                            onValueChange={setDuration}
                            max={60}
                            min={5}
                            step={5}
                            className="w-32"
                          />
                          <span className="text-sm font-medium min-w-[3rem]">{duration[0]} min</span>
                        </div>
                      </div>

                      <Button
                        onClick={startSoloMeditation}
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm px-8 py-3 text-lg"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Begin Sacred Practice
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setShowPracticeInfo(true)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Practice Info
                      </Button>

                      <Button
                        variant="outline"
                        onClick={createGroupSession}
                        disabled={isCreatingSession}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        {isCreatingSession ? 'Creating...' : 'Create Circle'}
                      </Button>
                    </div>

                    {/* Sound Controls */}
                    <div className="flex items-center justify-center gap-4 text-white">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="text-white hover:bg-white/10"
                      >
                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                      {soundEnabled && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Volume:</span>
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            min={0}
                            step={5}
                            className="w-20"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Group Sessions Tab */}
                  <TabsContent value="group" className="space-y-4">
                    <div className="text-center space-y-2 text-white">
                      <h3 className="text-xl font-light">Sacred Circles</h3>
                      <p className="text-white/70">Join others in collective consciousness expansion</p>
                    </div>
                    
                    {activeSessions.length > 0 ? (
                      <div className="grid gap-4">
                        {activeSessions.map((session) => (
                          <Card key={session.id} className="bg-white/10 border-white/20 text-white">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                                    meditationTypes.find(t => t.id === session.type)?.color || 'from-blue-500 to-cyan-500'
                                  }`} />
                                  <div>
                                    <h4 className="font-medium">
                                      {meditationTypes.find(t => t.id === session.type)?.name}
                                    </h4>
                                    <p className="text-sm text-white/70">
                                      {session.duration} min • {session.participantCount} souls
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => joinGroupSession(session.id)}
                                  disabled={joinedSessionId === session.id}
                                  className="bg-white/20 hover:bg-white/30 text-white"
                                >
                                  {joinedSessionId === session.id ? 'Joined' : 'Join Circle'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-white/60">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No active circles at this moment</p>
                        <p className="text-sm mt-2">Create one to begin gathering souls for practice</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Soundscapes Tab */}
                  <TabsContent value="soundscape" className="space-y-4">
                    <div className="text-center space-y-2 text-white">
                      <h3 className="text-xl font-light">Sacred Soundscapes</h3>
                      <p className="text-white/70">Frequencies to deepen your practice</p>
                    </div>

                    {selectedBackgroundAudio ? (
                      <Card className="bg-white/10 border-white/20 text-white">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{selectedBackgroundAudio.title}</h4>
                              <p className="text-sm text-white/70">{selectedBackgroundAudio.duration}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedBackgroundAudio(null)}
                              className="text-white hover:bg-white/20"
                            >
                              Change
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {youtubeLoading ? (
                          <div className="text-center py-8 text-white/60">
                            <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full mx-auto mb-4" />
                            <p>Loading sacred sounds...</p>
                          </div>
                        ) : meditationVideos.length > 0 ? (
                          meditationVideos.slice(0, 5).map((video, index) => (
                            <Card
                              key={video.id}
                              className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                              onClick={() => selectBackgroundAudio(video)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-12 h-8 object-cover rounded"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white line-clamp-1">{video.title}</p>
                                    <p className="text-xs text-white/60">{video.duration}</p>
                                  </div>
                                  <PlayCircle className="h-5 w-5 text-white/60" />
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-8 text-white/60">
                            <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Sacred soundscapes unavailable</p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Practice Info Modal */}
      <Dialog open={showPracticeInfo} onOpenChange={setShowPracticeInfo}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              {selectedMeditation && (
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedMeditation.color} flex items-center justify-center text-white`}>
                  {selectedMeditation.icon}
                </div>
              )}
              {selectedMeditation?.name} Practice Guide
            </DialogTitle>
            <DialogDescription className="text-white/70 text-lg">
              {selectedMeditation?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMeditation && (
            <div className="space-y-6 text-white">
              {/* Practice Overview */}
              <div>
                <p className="text-white/90 italic mb-4">"{selectedMeditation.guidance}"</p>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <Badge variant="outline" className="text-white/60 border-white/20">
                    {selectedMeditation.defaultDuration} minutes
                  </Badge>
                  <span>• Default duration</span>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Benefits & Effects
                </h3>
                <ul className="space-y-2">
                  {selectedMeditation.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-white/80">
                      <span className="text-white/60">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Practice Instructions
                </h3>
                <ol className="space-y-3">
                  {selectedMeditation.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3 text-white/80">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Sacred Prompts */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Sacred Meditation Prompts
                </h3>
                <div className="grid gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="font-medium text-white/90 mb-2">Beginning</h4>
                    <p className="text-white/70 italic">"{selectedMeditation.prompts.beginning}"</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="font-medium text-white/90 mb-2">Midpoint</h4>
                    <p className="text-white/70 italic">"{selectedMeditation.prompts.midpoint}"</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="font-medium text-white/90 mb-2">Closing</h4>
                    <p className="text-white/70 italic">"{selectedMeditation.prompts.closing}"</p>
                  </div>
                </div>
              </div>

              {/* Reflection Question */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/20">
                <h4 className="font-medium text-white/90 mb-2">Post-Practice Reflection</h4>
                <p className="text-white/80 italic">"{selectedMeditation.reflectionPrompt}"</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setShowPracticeInfo(false);
                    startSoloMeditation();
                  }}
                  className={`flex-1 bg-gradient-to-r ${selectedMeditation.color} hover:opacity-90 text-white`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Begin This Practice
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPracticeInfo(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </>
  );
}