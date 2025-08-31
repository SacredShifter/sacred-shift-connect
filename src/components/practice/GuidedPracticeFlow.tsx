import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, ArrowRight, Info } from 'lucide-react';
import { BreathingAnimation } from './BreathingAnimation';
import { PracticeTimer } from './PracticeTimer';
import { ReflectionInput } from './ReflectionInput';

interface DailyStep {
  id: string;
  title: string;
  description: string;
  why: string;
  practice: string;
  timeOfDay: string;
  estimatedMinutes: number;
  completed?: boolean;
}

interface GuidedPracticeFlowProps {
  step: DailyStep;
  streak: number;
  onComplete: (reflection?: string) => void;
  onExit: () => void;
}

type FlowState = 'intention' | 'practice' | 'integration' | 'completion';

export const GuidedPracticeFlow: React.FC<GuidedPracticeFlowProps> = ({
  step,
  streak,
  onComplete,
  onExit
}) => {
  const [flowState, setFlowState] = useState<FlowState>('intention');
  const [showWhy, setShowWhy] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [reflection, setReflection] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(step.estimatedMinutes * 60);

  const handleStartPractice = useCallback(() => {
    setFlowState('practice');
    setIsTimerActive(true);
  }, []);

  const handleTimerComplete = useCallback(() => {
    setIsTimerActive(false);
    setFlowState('integration');
  }, []);

  const handleIntegrationNext = useCallback(() => {
    setFlowState('completion');
  }, []);

  const handleCompleteFlow = useCallback(() => {
    onComplete(reflection);
  }, [reflection, onComplete]);

  const renderIntentionState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-primary">
            {step.timeOfDay}
          </Badge>
          <Badge variant="outline">
            {step.estimatedMinutes} minutes
          </Badge>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground">
          Today's Sacred Practice
        </h2>
        
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {step.title}
          </h3>
          <p className="text-muted-foreground text-lg">
            {step.description}
          </p>
        </div>

        {/* Why Toggle */}
        <motion.div
          layout
          className="space-y-3"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowWhy(!showWhy)}
            className="gap-2"
          >
            <Info className="h-4 w-4" />
            {showWhy ? 'Hide' : 'Why this matters'}
          </Button>
          
          <AnimatePresence>
            {showWhy && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-muted/30 rounded-lg p-4 text-sm text-foreground/80"
              >
                {step.why}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="space-y-4">
        <p className="text-foreground font-medium">Ready to begin?</p>
        <Button 
          size="lg"
          onClick={handleStartPractice}
          className="gap-2 px-8 py-6 text-lg"
        >
          <Play className="h-5 w-5" />
          Start Practice
        </Button>
        <Button 
          variant="ghost"
          onClick={onExit}
          className="text-muted-foreground"
        >
          Return Later
        </Button>
      </div>
    </motion.div>
  );

  const renderPracticeState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">
          {step.title}
        </h3>
        
        <PracticeTimer
          duration={step.estimatedMinutes * 60}
          isActive={isTimerActive}
          onComplete={handleTimerComplete}
          onTimeUpdate={setTimeRemaining}
        />
        
        <BreathingAnimation 
          isActive={isTimerActive}
          size={200}
        />
      </div>

      <div className="bg-muted/30 rounded-xl p-6 max-w-2xl mx-auto">
        <p className="text-foreground/90 text-lg leading-relaxed">
          {step.practice}
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => setIsTimerActive(!isTimerActive)}
          className="gap-2"
        >
          {isTimerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isTimerActive ? 'Pause' : 'Resume'}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setIsTimerActive(false);
            setTimeRemaining(step.estimatedMinutes * 60);
          }}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </motion.div>
  );

  const renderIntegrationState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="space-y-4">
        <div className="text-4xl mb-4">✨</div>
        <h3 className="text-xl font-semibold text-foreground">
          Practice Complete
        </h3>
        <p className="text-muted-foreground">
          Take a moment to notice how you feel
        </p>
      </div>

      <ReflectionInput
        value={reflection}
        onChange={setReflection}
        placeholder="What did you notice? How do you feel? Any insights?"
      />

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => setFlowState('practice')}
        >
          Return to Practice
        </Button>
        <Button 
          onClick={handleIntegrationNext}
          className="gap-2"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );

  const renderCompletionState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="space-y-4">
        <div className="text-6xl mb-6">🙏</div>
        <h3 className="text-2xl font-bold text-foreground">
          Sacred Practice Complete
        </h3>
        
        {streak > 0 && (
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-6 border border-primary/30">
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <h4 className="text-lg font-semibold text-foreground">
                  {streak + 1} Day Streak
                </h4>
                <p className="text-muted-foreground">
                  Your dedication illuminates the path
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-muted/30 rounded-xl p-6">
          <p className="text-foreground/80 text-lg">
            Tomorrow's practice unlocks at dawn. 
            <br />
            The Sacred Journey continues...
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Button 
          size="lg"
          onClick={handleCompleteFlow}
          className="px-8 py-6 text-lg"
        >
          Complete & Return to Dashboard
        </Button>
      </div>
    </motion.div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-8">
        <AnimatePresence mode="wait">
          {flowState === 'intention' && (
            <motion.div key="intention">
              {renderIntentionState()}
            </motion.div>
          )}
          {flowState === 'practice' && (
            <motion.div key="practice">
              {renderPracticeState()}
            </motion.div>
          )}
          {flowState === 'integration' && (
            <motion.div key="integration">
              {renderIntegrationState()}
            </motion.div>
          )}
          {flowState === 'completion' && (
            <motion.div key="completion">
              {renderCompletionState()}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};