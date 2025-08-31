import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';
import { useToast } from '@/hooks/use-toast';
import { DailyRitualCard } from './DailyRitualCard';
import { 
  Sunrise, 
  Sunset, 
  Sparkles, 
  BookOpen, 
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const DailyPrompts: React.FC = () => {
  const { state, setMorningPrompt, setEveningReflection } = useDailyRoutine();
  const { toast } = useToast();
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening' | 'anytime'>('morning');
  const [showReflectionInput, setShowReflectionInput] = useState(false);
  const [reflectionText, setReflectionText] = useState('');

  // Determine time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 18 || hour < 5) {
      setTimeOfDay('evening');
    } else {
      setTimeOfDay('anytime');
    }
  }, []);

  const todaysStep = state.todaysStep;
  
  const getMorningPrompt = () => {
    if (!todaysStep) return "Welcome to your sacred practice. Take a moment to center yourself.";
    
    const prompts = [
      `Today's journey: ${todaysStep.title}. What intention do you set for this practice?`,
      `The sacred path offers: ${todaysStep.title}. How might this serve your awakening today?`,
      `Your consciousness is ready for: ${todaysStep.title}. What resistance or excitement do you notice?`,
      `Today's gift: ${todaysStep.title}. How does your body feel about this practice?`
    ];
    
    return prompts[new Date().getDate() % prompts.length];
  };

  const getEveningPrompt = () => {
    if (!todaysStep) return "How did today's practice land in your being?";
    
    const prompts = [
      `You engaged with ${todaysStep.title} today. What shifted in your awareness?`,
      `After practicing ${todaysStep.title}, what insights emerged?`,
      `Your journey through ${todaysStep.title} - what wants to be integrated?`,
      `Reflecting on ${todaysStep.title} - what truth became clearer today?`
    ];
    
    return prompts[new Date().getDate() % prompts.length];
  };

  const handleSaveReflection = () => {
    if (reflectionText.trim()) {
      setEveningReflection(reflectionText);
      toast({
        title: "Reflection saved",
        description: "Your evening reflection has been saved to your journal.",
      });
      setReflectionText('');
      setShowReflectionInput(false);
    }
  };

  const isCompleted = todaysStep?.completed;

  return (
    <div className="space-y-6">
      {/* Time of Day Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-2">
          {timeOfDay === 'morning' ? (
            <Sunrise className="h-6 w-6 text-amber-500" />
          ) : timeOfDay === 'evening' ? (
            <Sunset className="h-6 w-6 text-purple-500" />
          ) : (
            <Clock className="h-6 w-6 text-blue-500" />
          )}
          <h2 className="text-2xl font-bold font-sacred text-truth capitalize">
            {timeOfDay === 'anytime' ? 'Sacred Practice' : `${timeOfDay} Practice`}
          </h2>
        </div>
        
        {state.streak > 0 && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            <Sparkles className="w-3 h-3 mr-1" />
            {state.streak} day streak
          </Badge>
        )}
      </motion.div>

      {/* Morning Prompt */}
      {timeOfDay === 'morning' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <Sunrise className="h-5 w-5" />
                Morning Intention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 font-codex italic leading-relaxed">
                {getMorningPrompt()}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Evening Prompt */}
      {timeOfDay === 'evening' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Sunset className="h-5 w-5" />
                Evening Reflection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90 font-codex italic leading-relaxed">
                {getEveningPrompt()}
              </p>
              
              {!showReflectionInput ? (
                <Button 
                  onClick={() => setShowReflectionInput(true)}
                  variant="outline"
                  className="w-full border-purple-500/30 hover:bg-purple-500/10"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Quick Journal Entry
                </Button>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="What insights emerged today? How did the practice land in your being?"
                    className="w-full p-3 rounded-lg bg-card border border-border/50 text-sm resize-none h-24 font-codex"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveReflection}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save to Journal
                    </Button>
                    <Button 
                      onClick={() => setShowReflectionInput(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Today's Step Card */}
      {todaysStep && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DailyRitualCard 
            step={todaysStep} 
            isToday={true}
            showWhyExpanded={timeOfDay === 'morning' && !isCompleted}
          />
        </motion.div>
      )}

      {/* Next Steps Preview (if in guided mode) */}
      {state.mode === 'guided' && state.currentFlow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-muted/50 to-muted/20 border border-muted-foreground/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <ArrowRight className="h-5 w-5" />
                Coming Up in Your Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {state.currentFlow.steps
                  .slice(state.currentFlow.currentStepIndex + 1, state.currentFlow.currentStepIndex + 4)
                  .map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {index + 2}
                      </div>
                      <span className="text-sm text-muted-foreground font-codex">
                        {step.title}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};