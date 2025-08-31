import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { useDailyRoutine, DailyStep } from '@/providers/DailyRoutineProvider';
import { 
  Sunrise, 
  Sunset, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Play,
  CheckCircle,
  Timer
} from 'lucide-react';

interface DailyRitualCardProps {
  step: DailyStep;
  isToday?: boolean;
  showWhyExpanded?: boolean;
}

const getTimeIcon = (timeOfDay: DailyStep['timeOfDay']) => {
  switch (timeOfDay) {
    case 'morning': return Sunrise;
    case 'evening': return Sunset;
    default: return Clock;
  }
};

const getTimeColor = (timeOfDay: DailyStep['timeOfDay']) => {
  switch (timeOfDay) {
    case 'morning': return 'text-amber-500';
    case 'evening': return 'text-purple-500';
    default: return 'text-blue-500';
  }
};

export const DailyRitualCard: React.FC<DailyRitualCardProps> = ({ 
  step, 
  isToday = false,
  showWhyExpanded = false 
}) => {
  const { completeStep } = useDailyRoutine();
  const [whyExpanded, setWhyExpanded] = useState(showWhyExpanded);
  const [reflection, setReflection] = useState('');

  const TimeIcon = getTimeIcon(step.timeOfDay);
  const timeColor = getTimeColor(step.timeOfDay);

  const handleComplete = () => {
    completeStep(step.id, reflection);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`
        relative overflow-hidden
        ${isToday ? 'ring-2 ring-primary/50 bg-gradient-to-br from-primary/5 to-primary/10' : ''}
        ${step.completed ? 'bg-gradient-to-br from-green-500/5 to-emerald-500/10 border-green-500/30' : ''}
      `}>
        {isToday && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
        )}
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-3">
                <TimeIcon className={`h-5 w-5 ${timeColor}`} />
                {step.title}
                {isToday && (
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
                    Today
                  </Badge>
                )}
                {step.completed && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </CardTitle>
              <p className="text-muted-foreground mt-2 font-codex">
                {step.description}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                {step.estimatedMinutes}m
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Practice Instructions */}
          <div className="p-4 rounded-lg bg-card/50 border border-border/50">
            <h4 className="font-medium text-truth mb-2 flex items-center gap-2">
              <Play className="h-4 w-4" />
              Practice
            </h4>
            <p className="text-sm text-foreground/80 font-codex leading-relaxed">
              {step.practice}
            </p>
          </div>

          {/* Why This Matters - Expandable */}
          <Collapsible open={whyExpanded} onOpenChange={setWhyExpanded}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-4 h-auto bg-gradient-to-r from-resonance/10 to-resonance/5 hover:from-resonance/20 hover:to-resonance/10 border border-resonance/30"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-resonance" />
                  <span className="font-medium text-resonance">Why this matters</span>
                </div>
                {whyExpanded ? (
                  <ChevronUp className="h-4 w-4 text-resonance" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-resonance" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 p-4 rounded-lg bg-gradient-to-br from-resonance/5 to-resonance/10 border border-resonance/20"
                >
                  <p className="text-sm text-foreground/90 font-codex leading-relaxed italic">
                    {step.why}
                  </p>
                </motion.div>
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>

          {/* Action Buttons */}
          {!step.completed && (
            <>
              <Separator className="my-4" />
              
              <div className="space-y-3">
                {/* Quick reflection for completion */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Quick reflection (optional):
                  </label>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="How did this practice land for you?"
                    className="w-full p-3 rounded-lg bg-card border border-border/50 text-sm resize-none h-20 font-codex"
                  />
                </div>

                <Button 
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete & Save to Journal
                </Button>
              </div>
            </>
          )}

          {step.completed && step.completedAt && (
            <div className="text-center py-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30">
                Completed {new Date(step.completedAt).toLocaleDateString()}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};