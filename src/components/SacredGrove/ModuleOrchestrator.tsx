import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  ArrowRight, 
  Brain, 
  Heart, 
  Zap,
  Activity,
  Target,
  Sparkles
} from 'lucide-react';

// Import actual Sacred Shifter modules
import { MirrorJournal } from '@/components/MirrorJournal';
import BreathOfSource from '@/components/BreathOfSource';
import LearningModule3D from '@/components/3D/LearningModule3D';
import { SacredTeachingDisplay } from './SacredTeachingDisplay';
import { useAuraChat } from '@/hooks/useAuraChat';
import { useGroveProgress } from '@/hooks/useGroveProgress';
import { getTeachingById } from '@/data/sacredTeachings';

interface ModuleOrchestratorProps {
  stepData: any;
  pathway: any;
  onStepComplete: (insights: string[]) => void;
  onJourneyComplete: () => void;
  isJourneyMode?: boolean;
}

export const ModuleOrchestrator: React.FC<ModuleOrchestratorProps> = ({
  stepData,
  pathway,
  onStepComplete,
  onJourneyComplete,
  isJourneyMode = false
}) => {
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [moduleProgress, setModuleProgress] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [moduleData, setModuleData] = useState<any>(null);
  
  const { engageAura } = useAuraChat();
  const { completeStep } = useGroveProgress();

  // Map step components to actual Sacred Shifter modules
  const moduleMap: { [key: string]: any } = {
    'MirrorJournal': {
      component: MirrorJournal,
      type: 'journal',
      duration: 10,
      description: 'Deep self-reflection and truth revelation'
    },
    'BreathOfSource': {
      component: BreathOfSource,
      type: 'breathwork',
      duration: 15,
      description: 'Sovereignty through conscious breathing'
    },
    // Sacred Teachings
    'mentalism-foundation': {
      component: () => <SacredTeachingDisplay teachingId="mentalism-foundation" onComplete={addInsight} isActive={isActive} />,
      type: 'teaching',
      duration: 20,
      description: 'The fundamental principle that all is mind'
    },
    'correspondence-law': {
      component: () => <SacredTeachingDisplay teachingId="correspondence-law" onComplete={addInsight} isActive={isActive} />,
      type: 'teaching',
      duration: 20,
      description: 'As above, so below - the law of correspondence'
    },
    'vibration-principle': {
      component: () => <SacredTeachingDisplay teachingId="vibration-principle" onComplete={addInsight} isActive={isActive} />,
      type: 'teaching',
      duration: 20,
      description: 'Everything vibrates - the principle of vibration'
    },
    'collective-resonance': {
      component: () => <SacredTeachingDisplay teachingId="collective-resonance" onComplete={addInsight} isActive={isActive} />,
      type: 'teaching',
      duration: 25,
      description: 'Individual consciousness amplifies through collective intention'
    },
    'synchronicity-mastery': {
      component: () => <SacredTeachingDisplay teachingId="synchronicity-mastery" onComplete={addInsight} isActive={isActive} />,
      type: 'teaching',
      duration: 25,
      description: 'Recognizing meaningful patterns in consciousness'
    },
    'cosmic-perspective': {
      component: () => <SacredTeachingDisplay teachingId="cosmic-perspective" onComplete={addInsight} isActive={isActive} />,
      type: 'teaching',
      duration: 30,
      description: 'You are the universe experiencing itself'
    },
    'sacred-geometry': {
      component: () => <SacredTeachingDisplay teachingId="sacred-geometry" onComplete={addInsight} isActive={isActive} />,
      type: 'teaching',
      duration: 30,
      description: 'Geometry is the language of creation'
    },
    'universal-frequencies': {
      component: () => <SacredTeachingDisplay teachingId="universal-frequencies" onComplete={addInsight} isActive={isActive} />,
      type: 'teaching',
      duration: 25,
      description: 'Harmonizing with the cosmic symphony'
    },
    'consciousness-integration': {
      component: () => <SacredTeachingDisplay teachingId="consciousness-integration" onComplete={addInsight} isActive={isActive} />,
      type: 'teaching',
      duration: 35,
      description: 'The realization of non-dual awareness'
    },
    'Dreamscape': {
      component: () => <LearningModule3D moduleId="dreamscape" />,
      type: '3d-learning',
      duration: 20,
      description: 'Immersive 3D consciousness exploration'
    },
    'SonicShifter': {
      component: () => <LearningModule3D moduleId="sacred-soundscape" />,
      type: 'audio',
      duration: 15,
      description: 'Sacred frequency harmonization'
    },
    'GeometryEngine': {
      component: () => <LearningModule3D moduleId="sacred-geometry" />,
      type: '3d-learning',
      duration: 25,
      description: 'Interactive sacred geometry patterns'
    },
    'ChakraLearning': {
      component: () => <LearningModule3D moduleId="chakra-system" />,
      type: '3d-learning',
      duration: 18,
      description: '3D chakra energy system exploration'
    },
    'HermeticPrinciples': {
      component: () => <LearningModule3D moduleId="hermetic-principles" />,
      type: '3d-learning',
      duration: 30,
      description: 'Universal laws of consciousness'
    },
    'TorusField': {
      component: () => <LearningModule3D moduleId="torus-field" />,
      type: '3d-learning',
      duration: 15,
      description: 'Heart-brain coherence field dynamics'
    }
  };

  // Initialize module when step data changes
  useEffect(() => {
    if (stepData?.component) {
      const module = moduleMap[stepData.component];
      if (module) {
        setCurrentModule(stepData.component);
        setModuleData(module);
        setModuleProgress(0);
        setInsights([]);
        setIsActive(false);
      }
    }
  }, [stepData]);

  // Start module session
  const startModule = async () => {
    setIsActive(true);
    
    // Get Aura AI guidance for this module
    try {
      const auraResponse = await engageAura(`Starting ${stepData.title}: ${stepData.description}\n\nProvide personalized guidance for this consciousness evolution step.`);

      if (auraResponse?.result) {
        setInsights(prev => [...prev, `Aura Guidance: ${auraResponse.result}`]);
      }
    } catch (error) {
      console.error('Error getting Aura guidance:', error);
    }
  };

  // Complete module session
  const completeModule = async () => {
    setIsActive(false);
    
    // Get Aura AI insights for completion
    try {
      const auraResponse = await engageAura(`Completed ${stepData.title}. User insights: ${insights.join(', ')}\n\nProvide consciousness evolution insights and next steps.`);

      if (auraResponse?.result) {
        setInsights(prev => [...prev, `Completion Insight: ${auraResponse.result}`]);
      }
    } catch (error) {
      console.error('Error getting completion insights:', error);
    }

    // Complete the step
    await completeStep(stepData, insights);
    onStepComplete(insights);
  };

  // Add user insight
  const addInsight = (insight: string) => {
    setInsights(prev => [...prev, insight]);
  };

  // Simulate module progress (in real implementation, this would come from the actual module)
  useEffect(() => {
    if (isActive && moduleProgress < 100) {
      const interval = setInterval(() => {
        setModuleProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, moduleProgress]);

  if (!currentModule || !moduleData) {
    return (
      <div className="text-center space-y-4 p-8">
        <div className="text-6xl">🧘</div>
        <h3 className="text-xl font-bold text-white">{stepData?.title}</h3>
        <p className="text-white/60">{stepData?.description}</p>
        <p className="text-sm text-white/40">Module loading...</p>
      </div>
    );
  }

  const ModuleComponent = moduleData.component;

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-center space-x-4"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            {moduleData.type === 'journal' && <Brain className="w-8 h-8 text-white" />}
            {moduleData.type === 'breathwork' && <Heart className="w-8 h-8 text-white" />}
            {moduleData.type === '3d-learning' && <Zap className="w-8 h-8 text-white" />}
            {moduleData.type === 'audio' && <Activity className="w-8 h-8 text-white" />}
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-bold text-white">{stepData.title}</h3>
            <p className="text-white/70">{moduleData.description}</p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/60">
            <span>Progress</span>
            <span>{moduleProgress}%</span>
          </div>
          <Progress value={moduleProgress} className="h-2" />
        </div>

        {/* Module Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isActive ? (
            <Button
              onClick={startModule}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Play className="w-4 h-4 mr-2" />
              Start {stepData.title}
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsActive(false)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button
                onClick={completeModule}
                disabled={moduleProgress < 100}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Step
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Module Content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 rounded-xl p-6"
          >
            <ModuleComponent 
              isJourneyMode={isJourneyMode}
              onInsight={addInsight}
              stepData={stepData}
              pathway={pathway}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insights Panel */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-xl p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
            Consciousness Insights
          </h4>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-white/80 text-sm">{insight}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Journey Navigation */}
      {isJourneyMode && (
        <div className="flex justify-between items-center pt-4 border-t border-white/20">
          <div className="text-sm text-white/60">
            Step {pathway.currentStep + 1} of {pathway.totalSteps}
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="border-white/20 text-white">
              {moduleData.type.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white">
              {moduleData.duration}min
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};
