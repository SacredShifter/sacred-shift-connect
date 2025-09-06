import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useDailyRoutine, DailyStep } from '@/providers/DailyRoutineProvider';
import { 
  Play, 
  CheckCircle, 
  Timer, 
  Info,
  ChevronDown,
  ChevronUp,
  Zap,
  Brain,
  Heart,
  Target,
  Activity,
  Camera
} from 'lucide-react';

interface StreamlinedPracticeCardProps {
  step: DailyStep;
  isToday?: boolean;
}

const getStepIcon = (stepId: string) => {
  const icons: { [key: string]: React.ComponentType<any> } = {
    'baseline-scan': Brain,
    'micro-reset': Heart,
    'resonance-drop': Zap,
    'fragment-capture': Target,
    'seal-close': CheckCircle
  };
  return icons[stepId] || Play;
};

const getStepColor = (stepId: string) => {
  const colors: { [key: string]: string } = {
    'baseline-scan': 'text-blue-500',
    'micro-reset': 'text-green-500',
    'resonance-drop': 'text-purple-500',
    'fragment-capture': 'text-orange-500',
    'seal-close': 'text-pink-500'
  };
  return colors[stepId] || 'text-primary';
};

export const StreamlinedPracticeCard: React.FC<StreamlinedPracticeCardProps> = ({ 
  step, 
  isToday = false 
}) => {
  const { completeStep } = useDailyRoutine();
  const [showDetails, setShowDetails] = useState(false);
  const [reflection, setReflection] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  const StepIcon = getStepIcon(step.id);
  const stepColor = getStepColor(step.id);

  const handleBegin = () => {
    // Check if this step has sensor flow integration
    if (step.sensorFlow && step.component) {
      // Navigate to the sensor flow component
      window.location.href = `/baseline-scan`;
    } else {
      // Navigate to the specific practice
      window.location.href = `/daily-practice?step=${step.id}`;
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate completion
    completeStep(step.id, reflection);
    setIsCompleting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`
        relative overflow-hidden transition-all duration-300
        ${isToday ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg' : ''}
        ${step.completed ? 'bg-gradient-to-br from-green-500/5 to-emerald-500/10 border-green-500/30' : 'hover:shadow-md'}
      `}>
        {isToday && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-background/50 ${stepColor}`}>
                <StepIcon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {step.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                {step.estimatedMinutes}m
              </Badge>
              {step.completed && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Practice Summary */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Play className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-foreground">Quick Start</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {step.practice.length > 120 
                    ? `${step.practice.substring(0, 120)}...` 
                    : step.practice
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Expandable Details */}
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full justify-between p-3 h-auto bg-gradient-to-r from-muted/20 to-muted/10 hover:from-muted/30 hover:to-muted/20"
            >
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Why this matters</span>
              </div>
              {showDetails ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {step.why}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reflection Input (only for today's practice) */}
          {isToday && !step.completed && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Quick reflection (optional)
              </label>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="How did this practice land for you?"
                className="min-h-[80px] resize-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          {isToday && !step.completed && (
            <div className="space-y-3">
              {/* Begin Button for Sensor Flow */}
              {step.sensorFlow && (
                <Button
                  onClick={handleBegin}
                  className="w-full gap-2 py-3 text-base font-medium"
                  size="lg"
                >
                  {step.id === 'baseline-scan' ? (
                    <>
                      <Activity className="h-4 w-4" />
                      Start Sensor Scan
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Begin Practice
                    </>
                  )}
                </Button>
              )}
              
              {/* Complete Button */}
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                variant={step.sensorFlow ? "outline" : "default"}
                className="w-full gap-2 py-3 text-base font-medium"
                size="lg"
              >
                {isCompleting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    {step.sensorFlow ? 'Mark Complete' : 'Mark Complete & Save to Journal'}
                  </>
                )}
              </Button>
            </div>
          )}

          {step.completed && (
            <div className="flex items-center justify-center gap-2 py-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
