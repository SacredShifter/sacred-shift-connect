import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';
import { 
  Play, 
  CheckCircle, 
  Timer, 
  Info,
  Brain,
  Heart,
  Zap,
  Target,
  ArrowRight,
  Activity,
  Camera
} from 'lucide-react';

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

export const TodaysPracticeInterface: React.FC = () => {
  const { state, getTodaysStep, completeStep } = useDailyRoutine();
  const [reflection, setReflection] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  const todaysStep = getTodaysStep();
  
  if (!todaysStep) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No Practice Available</h3>
        <p className="text-muted-foreground">Your daily routine is not yet set up.</p>
      </div>
    );
  }

  const StepIcon = getStepIcon(todaysStep.id);
  const stepColor = getStepColor(todaysStep.id);

  const handleBegin = () => {
    // Check if this step has sensor flow integration
    if (todaysStep.sensorFlow && todaysStep.component) {
      // Navigate to the sensor flow component
      window.location.href = `/baseline-scan`;
    } else {
      // Navigate to the specific practice
      window.location.href = `/daily-practice?step=${todaysStep.id}`;
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    completeStep(todaysStep.id, reflection);
    setIsCompleting(false);
  };

  return (
    <div className="space-y-6">
      {/* Morning Intention Card */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-amber-500/5 border-orange-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Brain className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-orange-600">Morning Intention</h3>
          </div>
          <p className="text-sm text-foreground/80">
            Your consciousness is ready for: <span className="font-medium text-orange-600">{todaysStep.title}</span>. 
            What resistance or excitement do you notice?
          </p>
        </CardContent>
      </Card>

      {/* Today's Practice Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-background/50 ${stepColor}`}>
                <StepIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {todaysStep.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {todaysStep.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Today
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                {todaysStep.estimatedMinutes}m
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Practice Instructions */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Play className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-2">Practice</h4>
                {todaysStep.sensorFlow ? (
                  <div className="space-y-3">
                    <p className="text-foreground/80 leading-relaxed">
                      Choose your preferred method for baseline measurement:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-600">Quick Check</span>
                        </div>
                        <p className="text-xs text-muted-foreground">1-10 sliders for Mood, Energy, Clarity, Stress</p>
                      </div>
                      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">Biometric Scan</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Camera-based pulse + HRV detection</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-foreground/80 leading-relaxed">
                    {todaysStep.practice}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Why This Matters - Collapsible */}
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={() => setShowWhy(!showWhy)}
              className="w-full justify-between p-4 h-auto bg-gradient-to-r from-muted/20 to-muted/10 hover:from-muted/30 hover:to-muted/20"
            >
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Why this matters</span>
              </div>
              {showWhy ? (
                <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
              ) : (
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>

            {showWhy && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-muted/20 rounded-lg p-4">
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {todaysStep.why}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Reflection Input */}
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

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Begin Button for Sensor Flow */}
            {todaysStep.sensorFlow && (
              <Button
                onClick={handleBegin}
                className="w-full gap-2 py-4 text-base font-medium bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                size="lg"
              >
                <Activity className="h-4 w-4" />
                Start Sensor Scan
              </Button>
            )}
            
            {/* Complete Button */}
            <Button
              onClick={handleComplete}
              disabled={isCompleting}
              variant={todaysStep.sensorFlow ? "outline" : "default"}
              className="w-full gap-2 py-4 text-base font-medium"
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
                  {todaysStep.sensorFlow ? 'Mark Complete' : 'Mark Complete & Save to Journal'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Coming Up Preview */}
      <Card className="bg-muted/20 border-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium text-foreground">Coming Up in Your Journey</h4>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>2. Truth Orientation</div>
            <div>3. Sovereignty Anchoring</div>
            <div>4. Energy Literacy</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
