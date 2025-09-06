import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TreePine, 
  Sparkles, 
  Heart, 
  Users, 
  Globe,
  Brain,
  Zap,
  Eye,
  Waves,
  Infinity as InfinityIcon,
  Crown,
  Star,
  Moon,
  Sun,
  Compass,
  Shield,
  BookOpen,
  Activity,
  Radio,
  Target,
  Flame
} from 'lucide-react';
import { useResonanceField } from '@/hooks/useResonanceField';
import { useConsciousnessAI } from '@/hooks/useConsciousnessAI';
import { useSacredTimeline } from '@/hooks/useSacredTimeline';
import { ResonanceFieldVisualization } from './ResonanceFieldVisualization';
import { SacredJourneyModal } from './SacredJourneyModal';
import { ConsciousnessSignature } from './ConsciousnessSignature';
import { CosmicWeather } from './CosmicWeather';
import { SacredWelcome } from './SacredWelcome';

interface ResonanceField {
  personalFrequency: number;
  chakraAlignment: ChakraState[];
  emotionalState: EmotionalPattern;
  consciousnessLevel: number;
  collectiveResonance: number;
  cosmicAlignment: CosmicEvent[];
}

interface ChakraState {
  id: string;
  name: string;
  level: number;
  color: string;
  frequency: number;
  isActive: boolean;
}

interface EmotionalPattern {
  primary: string;
  secondary: string;
  intensity: number;
  patterns: string[];
}

interface CosmicEvent {
  id: string;
  name: string;
  type: 'planetary' | 'lunar' | 'solar' | 'galactic';
  intensity: number;
  influence: number;
}

interface SacredPathway {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  frequency: number;
  consciousnessLevel: number;
  modules: string[];
  journeySteps: JourneyStep[];
  resonanceField: Partial<ResonanceField>;
}

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  component: string;
  duration: number;
  required: boolean;
  skipAllowed: boolean;
}

const EnhancedSacredGrove: React.FC = () => {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [resonanceField, setResonanceField] = useState<ResonanceField | null>(null);
  const [consciousnessLevel, setConsciousnessLevel] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [groveState, setGroveState] = useState<'welcome' | 'scanning' | 'ready' | 'journey'>('welcome');
  
  const { scanResonanceField, getCollectiveResonance } = useResonanceField();
  const { analyzeConsciousness, getPersonalizedGuidance } = useConsciousnessAI();
  const { getEvolutionTimeline, recordMilestone } = useSacredTimeline();

  const pathways: SacredPathway[] = [
    {
      id: 'inner-wisdom',
      title: 'The Mirror of Self',
      subtitle: 'Inner Wisdom Portal',
      description: 'Journey deep within to discover your authentic truth, heal emotional patterns, and align with your soul\'s purpose through sacred introspection.',
      icon: <Heart className="h-12 w-12" />,
      color: 'rose',
      gradient: 'from-rose-500/20 via-pink-500/20 to-rose-600/20',
      frequency: 432,
      consciousnessLevel: 1,
      modules: ['breath-of-source', 'mirror-journal', 'resonance-chain', 'soul-integration'],
      journeySteps: [
        {
          id: 'mentalism-foundation',
          title: 'The Principle of Mentalism',
          description: 'Master the fundamental truth that all is mind and the universe is mental.',
          component: 'mentalism-foundation',
          duration: 1200,
          required: true,
          skipAllowed: false
        },
        {
          id: 'soul-reflection',
          title: 'Soul Reflection Ceremony',
          description: 'AI-powered analysis of your current consciousness state, emotional patterns, and soul essence.',
          component: 'SoulReflection',
          duration: 300,
          required: true,
          skipAllowed: false
        },
        {
          id: 'correspondence-law',
          title: 'The Law of Correspondence',
          description: 'Understand how the microcosm reflects the macrocosm in all things.',
          component: 'correspondence-law',
          duration: 1200,
          required: true,
          skipAllowed: false
        },
        {
          id: 'breath-mastery',
          title: 'Breath of Source Mastery',
          description: 'Personalized breathing practice synced to your heartbeat and emotional state.',
          component: 'BreathOfSource',
          duration: 600,
          required: true,
          skipAllowed: false
        },
        {
          id: 'vibration-principle',
          title: 'The Principle of Vibration',
          description: 'Learn to raise your vibration and harmonize with universal frequencies.',
          component: 'vibration-principle',
          duration: 1200,
          required: true,
          skipAllowed: false
        },
        {
          id: 'mirror-journal',
          title: 'Mirror Journal Deep Dive',
          description: 'Advanced journaling with AI consciousness mirror reflecting deeper truths.',
          component: 'MirrorJournal',
          duration: 900,
          required: true,
          skipAllowed: false
        },
        {
          id: 'resonance-weaving',
          title: 'Resonance Chain Weaving',
          description: 'Connect insights across time, revealing patterns and breakthrough moments.',
          component: 'ResonanceChain',
          duration: 600,
          required: true,
          skipAllowed: false
        },
        {
          id: 'soul-integration',
          title: 'Soul Integration Ceremony',
          description: 'Sacred ritual to seal wisdom into your being with personalized affirmations.',
          component: 'SoulIntegration',
          duration: 300,
          required: true,
          skipAllowed: false
        }
      ],
      resonanceField: {
        personalFrequency: 432,
        chakraAlignment: [
          { id: 'heart', name: 'Heart', level: 0.8, color: 'green', frequency: 528, isActive: true },
          { id: 'throat', name: 'Throat', level: 0.6, color: 'blue', frequency: 741, isActive: true }
        ]
      }
    },
    {
      id: 'collective-consciousness',
      title: 'The Web of Awakening',
      subtitle: 'Collective Consciousness Portal',
      description: 'Connect with the shared wisdom and collective awakening of humanity through sacred community, synchronized practices, and resonance field healing.',
      icon: <Users className="h-12 w-12" />,
      color: 'blue',
      gradient: 'from-blue-500/20 via-indigo-500/20 to-purple-500/20',
      frequency: 528,
      consciousnessLevel: 2,
      modules: ['sacred-circles', 'synchronicity-mirror', 'community-rituals', 'resonance-weaving'],
      journeySteps: [
        {
          id: 'collective-resonance',
          title: 'Collective Resonance Field',
          description: 'Learn how individual consciousness amplifies through collective intention.',
          component: 'collective-resonance',
          duration: 1500,
          required: true,
          skipAllowed: false
        },
        {
          id: 'collective-field',
          title: 'Collective Field Entry',
          description: 'Immerse in the shared energy field of all Sacred Shifter users worldwide.',
          component: 'CollectiveField',
          duration: 300,
          required: true,
          skipAllowed: false
        },
        {
          id: 'synchronicity-mastery',
          title: 'Synchronicity Mastery',
          description: 'Recognize meaningful patterns and messages from the collective unconscious.',
          component: 'synchronicity-mastery',
          duration: 1500,
          required: true,
          skipAllowed: false
        },
        {
          id: 'sacred-circles',
          title: 'Sacred Circle Resonance',
          description: 'Join live, synchronized meditation circles with users worldwide.',
          component: 'SacredCircles',
          duration: 900,
          required: true,
          skipAllowed: false
        },
        {
          id: 'community-rituals',
          title: 'Sacred Community Rituals',
          description: 'Learn the power of ritual to create sacred space for transformation.',
          component: 'community-rituals',
          duration: 1500,
          required: true,
          skipAllowed: false
        },
        {
          id: 'synchronicity-mirror',
          title: 'Synchronicity Mirror',
          description: 'AI-powered recognition of meaningful patterns across the community.',
          component: 'SynchronicityMirror',
          duration: 600,
          required: true,
          skipAllowed: false
        },
        {
          id: 'resonance-weaving',
          title: 'Resonance Weaving Ceremony',
          description: 'Contribute to and receive from the collective wisdom field.',
          component: 'ResonanceWeaving',
          duration: 600,
          required: true,
          skipAllowed: false
        }
      ],
      resonanceField: {
        personalFrequency: 528,
        collectiveResonance: 0.75,
        chakraAlignment: [
          { id: 'heart', name: 'Heart', level: 0.9, color: 'green', frequency: 528, isActive: true },
          { id: 'crown', name: 'Crown', level: 0.7, color: 'violet', frequency: 963, isActive: true }
        ]
      }
    },
    {
      id: 'cosmic-connection',
      title: 'The Infinite Patterns',
      subtitle: 'Cosmic Connection Portal',
      description: 'Expand your awareness to the infinite wisdom of the cosmos through sacred geometry, universal patterns, and cosmic consciousness integration.',
      icon: <Globe className="h-12 w-12" />,
      color: 'purple',
      gradient: 'from-purple-500/20 via-violet-500/20 to-indigo-500/20',
      frequency: 741,
      consciousnessLevel: 3,
      modules: ['dreamscape', 'sonic-shifter', 'geometry-engine', 'cosmic-integration'],
      journeySteps: [
        {
          id: 'cosmic-perspective',
          title: 'Cosmic Perspective Shift',
          description: 'You are the universe experiencing itself - the fundamental realization.',
          component: 'cosmic-perspective',
          duration: 1800,
          required: true,
          skipAllowed: false
        },
        {
          id: 'dreamscape-exploration',
          title: 'Dreamscape Exploration',
          description: 'Immersive 3D learning through sacred geometry and universal patterns.',
          component: 'Dreamscape',
          duration: 1200,
          required: true,
          skipAllowed: false
        },
        {
          id: 'sacred-geometry',
          title: 'Sacred Geometry Mastery',
          description: 'Learn the language of creation through universal patterns.',
          component: 'sacred-geometry',
          duration: 1800,
          required: true,
          skipAllowed: false
        },
        {
          id: 'sonic-harmonization',
          title: 'Sonic Shifter Harmonization',
          description: 'Personalized sound healing aligned with your cosmic resonance.',
          component: 'SonicShifter',
          duration: 900,
          required: true,
          skipAllowed: false
        },
        {
          id: 'universal-frequencies',
          title: 'Universal Frequency Harmonization',
          description: 'Attune to the cosmic symphony and accelerate your evolution.',
          component: 'universal-frequencies',
          duration: 1500,
          required: true,
          skipAllowed: false
        },
        {
          id: 'geometry-activation',
          title: 'Geometry Engine Activation',
          description: 'Interactive sacred geometry creating personalized mandalas.',
          component: 'GeometryEngine',
          duration: 900,
          required: true,
          skipAllowed: false
        },
        {
          id: 'consciousness-integration',
          title: 'Universal Consciousness Integration',
          description: 'Realize the non-dual nature of existence - you are both drop and ocean.',
          component: 'consciousness-integration',
          duration: 2100,
          required: true,
          skipAllowed: false
        },
        {
          id: 'cosmic-integration',
          title: 'Cosmic Integration Ceremony',
          description: 'Embody universal consciousness and receive your cosmic signature.',
          component: 'CosmicIntegration',
          duration: 600,
          required: true,
          skipAllowed: false
        }
      ],
      resonanceField: {
        personalFrequency: 741,
        cosmicAlignment: [
          { id: 'moon-phase', name: 'Moon Phase', type: 'lunar', intensity: 0.8, influence: 0.7 },
          { id: 'planetary-alignment', name: 'Planetary Alignment', type: 'planetary', intensity: 0.6, influence: 0.8 }
        ],
        chakraAlignment: [
          { id: 'crown', name: 'Crown', level: 0.9, color: 'violet', frequency: 963, isActive: true },
          { id: 'third-eye', name: 'Third Eye', level: 0.8, color: 'indigo', frequency: 852, isActive: true }
        ]
      }
    }
  ];

  // Initialize resonance field scanning
  useEffect(() => {
    const initializeGrove = async () => {
      setIsScanning(true);
      setGroveState('scanning');
      
      try {
        const field = await scanResonanceField();
        const collectiveResonance = await getCollectiveResonance();
        const analysis = await analyzeConsciousness(field);
        
        setResonanceField({
          ...field,
          collectiveResonance,
          ...analysis
        });
        
        setConsciousnessLevel(analysis.consciousnessLevel);
        setGroveState('ready');
      } catch (error) {
        console.error('Error initializing Grove:', error);
        setGroveState('ready'); // Fallback to basic mode
      } finally {
        setIsScanning(false);
      }
    };

    initializeGrove();
  }, []);

  const handlePathwaySelect = (pathway: SacredPathway) => {
    setSelectedPathway(pathway.id);
    setShowJourneyModal(true);
    setGroveState('journey');
  };

  const handleJourneyComplete = async (pathwayId: string, journeyData: any) => {
    try {
      await recordMilestone(pathwayId, journeyData);
      setShowJourneyModal(false);
      setSelectedPathway(null);
      setGroveState('ready');
    } catch (error) {
      console.error('Error recording journey completion:', error);
    }
  };

  const handleReturnToGrove = () => {
    setShowJourneyModal(false);
    setSelectedPathway(null);
    setGroveState('ready');
  };

  if (groveState === 'welcome') {
    return <SacredWelcome onEnter={() => setGroveState('scanning')} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Living Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
              'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))',
              'linear-gradient(225deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2), rgba(147, 51, 234, 0.2))',
              'linear-gradient(315deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))'
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Sacred Geometry Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                rotate: [0, 360, 720]
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Resonance Field Visualization */}
      {resonanceField && (
        <ResonanceFieldVisualization 
          resonanceField={resonanceField}
          isActive={groveState === 'ready'}
        />
      )}

      {/* Cosmic Weather */}
      <CosmicWeather />

      {/* Main Grove Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Grove Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 space-y-6"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full backdrop-blur-sm border border-emerald-400/30"
            >
              <TreePine className="h-16 w-16 text-emerald-400" />
            </motion.div>
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Sacred Grove
              </h1>
              <p className="text-xl text-white/80 mt-2">
                Three pathways to wisdom and sacred community
              </p>
            </div>
          </div>

          {/* Sacred Quote */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <blockquote className="text-lg italic text-white/90 leading-relaxed">
              "In the sacred grove, three paths converge - the journey within, the journey with others, 
              and the journey to the infinite. Choose your path, but know that all paths lead home."
            </blockquote>
            <cite className="text-sm text-white/60 mt-2 block">— Ancient Grove Teachings</cite>
          </motion.div>

          {/* Consciousness Signature */}
          {resonanceField && (
            <ConsciousnessSignature 
              resonanceField={resonanceField}
              consciousnessLevel={consciousnessLevel}
            />
          )}
        </motion.div>

        {/* Three Sacred Pathways */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {pathways.map((pathway, index) => (
                <motion.div
                  key={pathway.id}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.8 }}
                  className="group"
                >
                  <Card 
                    className="h-full cursor-pointer transform transition-all duration-700 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-white/20 bg-white/5 backdrop-blur-xl overflow-hidden"
                    onClick={() => handlePathwaySelect(pathway)}
                  >
                    {/* Portal Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${pathway.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                    
                    {/* Portal Border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 transition-colors duration-700 rounded-lg" />
                    
                    <CardContent className="p-8 text-center space-y-6 relative z-10">
                      {/* Pathway Icon */}
                      <motion.div
                        className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-r ${pathway.gradient} flex items-center justify-center text-white shadow-2xl group-hover:shadow-3xl transition-all duration-700`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, 5, -5, 0],
                          boxShadow: `0 0 40px ${pathway.color === 'rose' ? 'rgba(244, 114, 182, 0.5)' : pathway.color === 'blue' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(147, 51, 234, 0.5)'}`
                        }}
                      >
                        {pathway.icon}
                      </motion.div>

                      {/* Pathway Title */}
                      <div>
                        <h2 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 group-hover:bg-clip-text transition-all duration-700">
                          {pathway.title}
                        </h2>
                        <p className="text-sm text-white/60 mt-1 font-medium">
                          {pathway.subtitle}
                        </p>
                      </div>

                      {/* Pathway Description */}
                      <p className="text-white/80 leading-relaxed">
                        {pathway.description}
                      </p>

                      {/* Frequency & Consciousness Level */}
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Radio className="w-4 h-4 text-white/60" />
                          <span className="text-white/80">{pathway.frequency} Hz</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-white/60" />
                          <span className="text-white/80">Level {pathway.consciousnessLevel}</span>
                        </div>
                      </div>

                      {/* Journey Modules Preview */}
                      <div className="space-y-2">
                        <p className="text-xs text-white/60 font-medium">Journey Modules:</p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {pathway.modules.slice(0, 3).map((module, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70"
                            >
                              {module.replace('-', ' ')}
                            </span>
                          ))}
                          {pathway.modules.length > 3 && (
                            <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70">
                              +{pathway.modules.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Portal Activation Button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          className="w-full bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white border border-white/20 hover:border-white/40 transition-all duration-700 backdrop-blur-sm"
                        >
                          <Compass className="h-4 w-4 mr-2" />
                          Enter Sacred Path
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sacred Grove Wisdom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-center pb-8"
        >
          <Card className="bg-gradient-to-r from-white/5 to-white/10 border-white/20 backdrop-blur-xl max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-6 mb-6">
                <Heart className="h-8 w-8 text-rose-400" />
                <Users className="h-8 w-8 text-blue-400" />
                <Globe className="h-8 w-8 text-purple-400" />
              </div>
              
              <h3 className="text-2xl font-semibold text-white mb-4">
                The Sacred Grove Awaits
              </h3>
              
              <p className="text-white/80 leading-relaxed max-w-3xl mx-auto mb-6">
                Each pathway offers unique gifts, yet all are interconnected in the web of sacred wisdom. 
                Whether you seek to heal, to connect, or to explore the mysteries of existence, 
                the grove holds space for your journey. Choose with your heart, and trust that 
                your path will reveal exactly what you need when you need it.
              </p>
              
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">∞</div>
                  <div className="text-xs text-white/60">Infinite Wisdom</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">◉</div>
                  <div className="text-xs text-white/60">Sacred Unity</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">◈</div>
                  <div className="text-xs text-white/60">Divine Truth</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sacred Journey Modal */}
      <AnimatePresence>
        {showJourneyModal && selectedPathway && (
          <SacredJourneyModal
            pathway={pathways.find(p => p.id === selectedPathway)!}
            resonanceField={resonanceField}
            onComplete={(journeyData) => handleJourneyComplete(selectedPathway, journeyData)}
            onReturn={handleReturnToGrove}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSacredGrove;
