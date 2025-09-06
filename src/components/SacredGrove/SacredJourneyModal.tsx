import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MirrorJournal } from '@/components/MirrorJournal';
import BreathOfSource from '@/components/BreathOfSource';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  Clock,
  Compass,
  Sparkles,
  Heart,
  Users,
  Globe,
  Brain,
  Zap,
  Eye,
  Infinity as InfinityIcon
} from 'lucide-react';

// Import Grove integration components
import { ModuleOrchestrator } from './ModuleOrchestrator';
import { useGroveProgress } from '@/hooks/useGroveProgress';

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
  resonanceField: any;
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

interface SacredJourneyModalProps {
  pathway: SacredPathway;
  resonanceField: any;
  onComplete: (journeyData: any) => void;
  onReturn: () => void;
}

// Module Renderer Component
interface ModuleRendererProps {
  componentName: string;
  stepData: JourneyStep;
  pathway: SacredPathway;
}

const ModuleRenderer: React.FC<ModuleRendererProps> = ({ componentName, stepData, pathway }) => {
  const moduleComponents: { [key: string]: React.ComponentType<any> } = {
    'MirrorJournal': MirrorJournal,
    'BreathOfSource': BreathOfSource,
    'CosmicPerspective': () => (
      <div className="text-center space-y-6">
        <div className="text-6xl">🌌</div>
        <h3 className="text-2xl font-bold text-white">Cosmic Perspective Shift</h3>
        <p className="text-white/70 max-w-md mx-auto">
          Expand your awareness beyond personal boundaries into the infinite patterns of universal consciousness.
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🔭</div>
            <div className="text-sm text-white/80">Telescopic View</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🌊</div>
            <div className="text-sm text-white/80">Wave Patterns</div>
          </div>
        </div>
      </div>
    ),
    'SacredGeometry': () => (
      <div className="text-center space-y-6">
        <div className="text-6xl">🔺</div>
        <h3 className="text-2xl font-bold text-white">Sacred Geometry</h3>
        <p className="text-white/70 max-w-md mx-auto">
          Explore the fundamental patterns that underlie all creation through interactive geometric meditation.
        </p>
        <div className="flex justify-center space-x-4">
          <div className="w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
            <div className="text-2xl">△</div>
          </div>
          <div className="w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
            <div className="text-2xl">○</div>
          </div>
          <div className="w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
            <div className="text-2xl">□</div>
          </div>
        </div>
      </div>
    ),
    'ResonanceField': () => (
      <div className="text-center space-y-6">
        <div className="text-6xl">⚡</div>
        <h3 className="text-2xl font-bold text-white">Resonance Field</h3>
        <p className="text-white/70 max-w-md mx-auto">
          Tune into the energetic frequencies that connect all consciousness across space and time.
        </p>
        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
      </div>
    ),
    'ResonanceWeaving': () => (
      <div className="text-center space-y-6">
        <div className="text-6xl">🕸️</div>
        <h3 className="text-2xl font-bold text-white">Resonance Weaving Ceremony</h3>
        <p className="text-white/70 max-w-md mx-auto">
          Contribute to and receive from the collective wisdom field through sacred weaving practices.
        </p>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"></div>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"></div>
          <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-60"></div>
        </div>
      </div>
    ),
    'CosmicIntegration': () => (
      <div className="text-center space-y-6">
        <div className="text-6xl">🌟</div>
        <h3 className="text-2xl font-bold text-white">Cosmic Integration Ceremony</h3>
        <p className="text-white/70 max-w-md mx-auto">
          Embody universal consciousness and receive your cosmic signature through sacred ceremony.
        </p>
        <div className="relative">
          <div className="w-24 h-24 mx-auto border-2 border-white/30 rounded-full flex items-center justify-center">
            <div className="text-3xl">∞</div>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    )
  };

  const ModuleComponent = moduleComponents[componentName];

  if (!ModuleComponent) {
    return (
      <div className="text-center space-y-4">
        <div className="text-6xl">🧘</div>
        <h3 className="text-xl font-bold text-white">{stepData.title}</h3>
        <p className="text-white/60">
          {stepData.description}
        </p>
        <p className="text-sm text-white/40">
          Module component: {componentName}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ModuleComponent 
        stepData={stepData}
        pathway={pathway}
        isJourneyMode={true}
      />
    </div>
  );
};

export const SacredJourneyModal: React.FC<SacredJourneyModalProps> = ({
  pathway,
  resonanceField,
  onComplete,
  onReturn
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [journeyData, setJourneyData] = useState<any>({});
  const [showIntro, setShowIntro] = useState(true);
  const [stepInsights, setStepInsights] = useState<string[]>([]);
  
  const { 
    currentJourney, 
    startJourney, 
    completeStep, 
    completeJourney 
  } = useGroveProgress();

  const currentStepData = pathway.journeySteps[currentStep];
  const progress = ((currentStep + 1) / pathway.journeySteps.length) * 100;

  useEffect(() => {
    // Initialize journey data
    setJourneyData({
      pathwayId: pathway.id,
      startTime: new Date().toISOString(),
      steps: [],
      resonanceField: resonanceField,
      insights: []
    });
  }, [pathway.id, resonanceField]);

  const handleStartJourney = async () => {
    setShowIntro(false);
    setIsActive(true);
    
    // Start the journey in the database
    await startJourney(pathway.id, pathway);
  };

  const handleNextStep = () => {
    if (currentStep < pathway.journeySteps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    } else {
      handleCompleteJourney();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkipStep = () => {
    if (currentStepData.skipAllowed) {
      handleNextStep();
    }
  };

  const handleCompleteJourney = async () => {
    const finalJourneyData = {
      ...journeyData,
      endTime: new Date().toISOString(),
      completedSteps: [...completedSteps, currentStep],
      completionRate: ((completedSteps.length + 1) / pathway.journeySteps.length) * 100
    };
    
    // Complete the journey in the database
    await completeJourney();
    
    onComplete(finalJourneyData);
  };

  const handleExitJourney = () => {
    onReturn();
  };

  const getStepIcon = (stepId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'soul-reflection': <Eye className="w-6 h-6" />,
      'breath-mastery': <Heart className="w-6 h-6" />,
      'mirror-journal': <Brain className="w-6 h-6" />,
      'resonance-weaving': <Zap className="w-6 h-6" />,
      'soul-integration': <InfinityIcon className="w-6 h-6" />,
      'collective-field': <Users className="w-6 h-6" />,
      'sacred-circles': <Users className="w-6 h-6" />,
      'synchronicity-mirror': <Eye className="w-6 h-6" />,
      'community-rituals': <Heart className="w-6 h-6" />,
      'cosmic-perspective': <Globe className="w-6 h-6" />,
      'dreamscape-exploration': <Brain className="w-6 h-6" />,
      'sonic-harmonization': <Zap className="w-6 h-6" />,
      'geometry-activation': <Sparkles className="w-6 h-6" />,
      'cosmic-integration': <InfinityIcon className="w-6 h-6" />
    };
    return iconMap[stepId] || <Compass className="w-6 h-6" />;
  };

  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-4xl"
        >
          <Card className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 border-white/20 backdrop-blur-xl">
            <CardContent className="p-12 text-center space-y-8">
              {/* Pathway Icon */}
              <motion.div
                className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${pathway.gradient} flex items-center justify-center text-white shadow-2xl`}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {pathway.icon}
              </motion.div>

              {/* Pathway Title */}
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  {pathway.title}
                </h2>
                <p className="text-xl text-white/80 mb-4">
                  {pathway.subtitle}
                </p>
                <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                  {pathway.description}
                </p>
              </div>

              {/* Journey Overview */}
              <div className="bg-white/5 rounded-xl p-6 max-w-3xl mx-auto">
                <h3 className="text-xl font-semibold text-white mb-4">Journey Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{pathway.journeySteps.length}</div>
                    <div className="text-sm text-white/60">Sacred Steps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{pathway.frequency} Hz</div>
                    <div className="text-sm text-white/60">Resonance Frequency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">Level {pathway.consciousnessLevel}</div>
                    <div className="text-sm text-white/60">Consciousness Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {Math.round(pathway.journeySteps.reduce((sum, step) => sum + step.duration, 0) / 60)}m
                    </div>
                    <div className="text-sm text-white/60">Estimated Duration</div>
                  </div>
                </div>
              </div>

              {/* Journey Steps Preview */}
              <div className="space-y-4 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-white">Sacred Journey Steps</h3>
                <div className="space-y-2">
                  {pathway.journeySteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white font-medium">{step.title}</div>
                        <div className="text-white/60 text-sm">{step.description}</div>
                      </div>
                      <div className="text-white/40 text-sm">
                        {Math.round(step.duration / 60)}m
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleExitJourney}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Return to Grove
                </Button>
                <Button
                  onClick={handleStartJourney}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Begin Sacred Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-6xl h-[90vh]"
      >
        <Card className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 border-white/20 backdrop-blur-xl h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${pathway.gradient} flex items-center justify-center text-white`}>
                  {pathway.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{pathway.title}</h2>
                  <p className="text-white/60">Step {currentStep + 1} of {pathway.journeySteps.length}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleExitJourney}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Exit Journey
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-sm text-white/60 mt-1">
                <span>{Math.round(progress)}% Complete</span>
                <span>{currentStep + 1} / {pathway.journeySteps.length}</span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                {/* Step Icon */}
                <motion.div
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white shadow-2xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {getStepIcon(currentStepData.id)}
                </motion.div>

                {/* Step Title */}
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {currentStepData.title}
                  </h3>
                  <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Step Duration */}
                <div className="flex items-center justify-center gap-2 text-white/60">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {Math.round(currentStepData.duration / 60)} minutes</span>
                </div>

                {/* Real Module Orchestrator */}
                <div className="bg-white/5 rounded-xl p-8 min-h-[300px]">
                  <ModuleOrchestrator
                    stepData={currentStepData}
                    pathway={{
                      ...pathway,
                      currentStep,
                      totalSteps: pathway.journeySteps.length
                    }}
                    onStepComplete={(insights) => {
                      setStepInsights(insights);
                      handleNextStep();
                    }}
                    onJourneyComplete={() => {
                      handleCompleteJourney();
                    }}
                    isJourneyMode={true}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-6 border-t border-white/20">
            <div className="flex items-center justify-between">
              <Button
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {currentStepData.skipAllowed && (
                  <Button
                    onClick={handleSkipStep}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Skip Step
                  </Button>
                )}
                
                <Button
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  {currentStep === pathway.journeySteps.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Journey
                    </>
                  ) : (
                    <>
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
