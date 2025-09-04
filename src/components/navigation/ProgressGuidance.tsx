import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Star, Compass, Heart, Lightbulb } from 'lucide-react';
import { useTaoFlow } from '@/providers/TaoFlowProvider';

export const ProgressGuidance: React.FC = () => {
  const { progress, getCurrentStage } = useTaoFlow();
  const currentStage = getCurrentStage();

  const stageInfo = {
    wuWei: {
      name: 'Wu Wei - Natural Flow',
      description: 'Beginning your journey with effortless action',
      color: 'hsl(220, 70%, 60%)',
      icon: <Compass className="w-4 h-4" />,
      suggestions: ['Start with grounding practices', 'Explore root chakra work', 'Begin breath awareness']
    },
    yinYang: {
      name: 'Yin Yang - Balance',
      description: 'Finding harmony between opposing forces',
      color: 'hsl(280, 70%, 60%)',
      icon: <Heart className="w-4 h-4" />,
      suggestions: ['Work with heart center', 'Practice emotional alchemy', 'Explore creativity']
    },
    advancedCeremony: {
      name: 'Advanced Ceremony',
      description: 'Deepening into sacred practices',
      color: 'hsl(60, 70%, 60%)',
      icon: <Star className="w-4 h-4" />,
      suggestions: ['Third eye activation', 'Visionary states', 'Truth telling practices']
    },
    returnToSilence: {
      name: 'Return to Silence',
      description: 'Unity consciousness and transcendence',
      color: 'hsl(300, 70%, 60%)',
      icon: <Lightbulb className="w-4 h-4" />,
      suggestions: ['Crown chakra work', 'Meditation mastery', 'Unity consciousness']
    }
  };

  const currentInfo = stageInfo[currentStage];
  const progressPercentage = Math.min(
    ((progress.breathSessions + progress.journalEntries + progress.meditationMinutes / 10) / 10) * 100,
    100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mb-6"
    >
      <Card className="p-4 bg-gradient-to-br from-card/50 to-card/20 border border-primary/20">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="p-2 rounded-full"
            style={{ backgroundColor: `${currentInfo.color}20` }}
          >
            {currentInfo.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{currentInfo.name}</h3>
            <p className="text-xs text-muted-foreground">{currentInfo.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">Journey Progress</span>
              <span className="text-xs font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div>
            <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
              <Star className="w-3 h-3" />
              Suggested Path
            </h4>
            <div className="flex flex-wrap gap-1">
              {currentInfo.suggestions.map((suggestion, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-xs px-2 py-1"
                  style={{ borderColor: currentInfo.color }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-xs text-center text-muted-foreground italic">
            💫 All paths are open - follow your intuition or our gentle guidance
          </div>
        </div>
      </Card>
    </motion.div>
  );
};