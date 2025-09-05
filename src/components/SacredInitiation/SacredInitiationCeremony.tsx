/**
 * Sacred Shifter Sacred Initiation Ceremony
 * Interactive ceremonial experience for seal integration
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Sparkles, 
  Flame, 
  Star, 
  Moon, 
  Sun,
  Heart,
  Eye,
  Zap,
  Shield,
  Key,
  Lock,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useCompleteCeremony, useUserInitiations, SacredSeal, UserInitiation } from '@/hooks/useSacredInitiations';
import { useAuth } from '@/hooks/useAuth';

interface CeremonyStep {
  id: string;
  title: string;
  description: string;
  duration: number; // seconds
  action: string;
  visualization: string;
  chakraFocus: string[];
  energyFrequency: string;
  sacredText: string;
}

interface SacredInitiationCeremonyProps {
  initiation: UserInitiation;
  onComplete: () => void;
  onClose: () => void;
}

export const SacredInitiationCeremony: React.FC<SacredInitiationCeremonyProps> = ({
  initiation,
  onComplete,
  onClose
}) => {
  const { user } = useAuth();
  const { mutate: completeCeremony, isPending } = useCompleteCeremony();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const seal = initiation.seal;

  // Generate ceremony steps based on seal
  const ceremonySteps: CeremonyStep[] = [
    {
      id: 'preparation',
      title: 'Sacred Preparation',
      description: 'Center yourself and prepare for the sacred ceremony',
      duration: 30,
      action: 'Breathe deeply and set your intention',
      visualization: 'Imagine a golden light surrounding you, creating a sacred space',
      chakraFocus: ['root', 'heart'],
      energyFrequency: '432Hz',
      sacredText: 'In the beginning was the Word, and the Word was with God, and the Word was God'
    },
    {
      id: 'invocation',
      title: 'Sacred Invocation',
      description: 'Call upon the divine energies to witness this ceremony',
      duration: 45,
      action: 'Recite the sacred oath with full presence',
      visualization: 'See ancient symbols and sacred geometry forming around you',
      chakraFocus: ['crown', 'third-eye'],
      energyFrequency: '528Hz',
      sacredText: seal.oath_text
    },
    {
      id: 'seal-activation',
      title: 'Seal Activation',
      description: 'Activate the sacred seal within your consciousness',
      duration: 60,
      action: 'Visualize the seal integrating into your energy field',
      visualization: `See the ${seal.seal_name} seal glowing with ${seal.color_signature} energy`,
      chakraFocus: seal.geometry_type === 'merkaba' ? ['crown', 'root'] : ['heart', 'solar-plexus'],
      energyFrequency: '852Hz',
      sacredText: 'The seal is not merely a symbol, but a living key to higher consciousness'
    },
    {
      id: 'blessing-reception',
      title: 'Blessing Reception',
      description: 'Receive the sacred blessing and wisdom',
      duration: 45,
      action: 'Open your heart to receive the divine blessing',
      visualization: 'Feel the blessing flowing through every cell of your being',
      chakraFocus: ['heart', 'throat'],
      energyFrequency: '963Hz',
      sacredText: seal.blessing_text
    },
    {
      id: 'integration',
      title: 'Sacred Integration',
      description: 'Integrate the seal into your daily consciousness',
      duration: 30,
      action: 'Commit to living according to the seal\'s wisdom',
      visualization: 'See yourself walking through life with this new awareness',
      chakraFocus: ['all'],
      energyFrequency: '432Hz',
      sacredText: 'As above, so below. As within, so without. The seal is now part of your being'
    }
  ];

  const currentCeremonyStep = ceremonySteps[currentStep];
  const progress = ((currentStep + 1) / ceremonySteps.length) * 100;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleStepComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const startCeremony = () => {
    setIsPlaying(true);
    setTimeRemaining(currentCeremonyStep.duration);
  };

  const pauseCeremony = () => {
    setIsPlaying(false);
  };

  const resetStep = () => {
    setIsPlaying(false);
    setTimeRemaining(currentCeremonyStep.duration);
  };

  const handleStepComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    setIsPlaying(false);
    
    if (currentStep < ceremonySteps.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setTimeRemaining(ceremonySteps[currentStep + 1].duration);
      }, 2000);
    } else {
      // Ceremony complete
      completeCeremony(initiation.id, {
        onSuccess: () => {
          onComplete();
        }
      });
    }
  };

  const skipStep = () => {
    handleStepComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getChakraIcon = (chakra: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'root': <Shield className="w-4 h-4 text-red-500" />,
      'sacral': <Flame className="w-4 h-4 text-orange-500" />,
      'solar-plexus': <Sun className="w-4 h-4 text-yellow-500" />,
      'heart': <Heart className="w-4 h-4 text-green-500" />,
      'throat': <Zap className="w-4 h-4 text-blue-500" />,
      'third-eye': <Eye className="w-4 h-4 text-indigo-500" />,
      'crown': <Crown className="w-4 h-4 text-purple-500" />,
      'all': <Sparkles className="w-4 h-4 text-gold-500" />
    };
    return icons[chakra] || <Star className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-sacred text-white mb-2">
              Sacred Initiation Ceremony
            </CardTitle>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-gold-400" />
              <span className="text-lg text-gold-300">{seal.seal_name}</span>
              <Crown className="w-6 h-6 text-gold-400" />
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
            <p className="text-sm text-purple-200 mt-2">
              Step {currentStep + 1} of {ceremonySteps.length}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Current Step */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {currentCeremonyStep.title}
                </h3>
                <p className="text-purple-200 mb-4">
                  {currentCeremonyStep.description}
                </p>
                
                {/* Timer */}
                <div className="mb-4">
                  <div className="text-4xl font-mono text-white mb-2">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="flex justify-center gap-2">
                    {!isPlaying ? (
                      <Button onClick={startCeremony} className="bg-gold-500 hover:bg-gold-600">
                        <Play className="w-4 h-4 mr-2" />
                        Begin Step
                      </Button>
                    ) : (
                      <Button onClick={pauseCeremony} variant="outline" className="border-white/30 text-white">
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={resetStep} variant="outline" className="border-white/30 text-white">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={skipStep} variant="outline" className="border-white/30 text-white">
                      Skip
                    </Button>
                  </div>
                </div>

                {/* Action and Visualization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 rounded-lg bg-white/10 border border-white/20">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Action
                    </h4>
                    <p className="text-sm text-purple-200">{currentCeremonyStep.action}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white/10 border border-white/20">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-400" />
                      Visualization
                    </h4>
                    <p className="text-sm text-purple-200">{currentCeremonyStep.visualization}</p>
                  </div>
                </div>

                {/* Chakra Focus and Energy */}
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-purple-200">Chakra Focus:</span>
                    <div className="flex gap-1">
                      {currentCeremonyStep.chakraFocus.map((chakra, index) => (
                        <div key={index} className="flex items-center gap-1">
                          {getChakraIcon(chakra)}
                          <span className="text-xs text-white">{chakra}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-purple-200">Frequency:</span>
                    <Badge variant="outline" className="border-gold-400/50 text-gold-300">
                      {currentCeremonyStep.energyFrequency}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Sacred Text */}
              <div className="p-4 rounded-lg bg-black/30 border border-gold-400/30">
                <p className="text-sm italic text-center text-gold-200">
                  "{currentCeremonyStep.sacredText}"
                </p>
              </div>
            </motion.div>

            {/* Step Progress */}
            <div className="flex justify-center gap-2">
              {ceremonySteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index < currentStep
                      ? 'bg-gold-400'
                      : index === currentStep
                      ? 'bg-purple-400'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-white/20">
              <Button onClick={onClose} variant="outline" className="border-white/30 text-white">
                Exit Ceremony
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                
                {isPending && (
                  <div className="flex items-center gap-2 text-sm text-purple-200">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold-400"></div>
                    Completing ceremony...
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
