import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDailyRoutine, DailyMode } from '@/providers/DailyRoutineProvider';
import { 
  Compass, 
  Wand2, 
  ArrowRight, 
  BookOpen,
  Zap
} from 'lucide-react';

export const ModeSelector: React.FC = () => {
  const { state, setMode } = useDailyRoutine();

  const modes = [
    {
      id: 'guided' as DailyMode,
      title: 'Guided Journey',
      description: 'The app walks you through today\'s step in your awakening journey',
      icon: Compass,
      benefits: ['One step at a time', 'Progressive development', 'Like a spiritual Duolingo'],
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      id: 'free' as DailyMode,
      title: 'Free Exploration',
      description: 'Access all practices while getting daily recommendations',
      icon: Wand2,
      benefits: ['Full access', 'Your own pace', 'Guided suggestions available'],
      color: 'accent',
      gradient: 'from-accent/20 to-accent/5'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-truth font-sacred">Choose Your Path</h2>
        <p className="text-muted-foreground font-codex">
          How would you like to experience your daily practice?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          const isSelected = state.mode === mode.id;
          
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`
                cursor-pointer transition-all duration-300 hover:shadow-lg
                ${isSelected 
                  ? `ring-2 ring-${mode.color}/50 bg-gradient-to-br ${mode.gradient}` 
                  : 'hover:bg-card/50'
                }
              `}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`
                          p-3 rounded-lg 
                          ${isSelected 
                            ? `bg-${mode.color} text-${mode.color}-foreground` 
                            : 'bg-muted'
                          }
                        `}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-truth">
                            {mode.title}
                          </h3>
                          {isSelected && (
                            <Badge variant="secondary" className="mt-1">
                              <Zap className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground font-codex leading-relaxed">
                      {mode.description}
                    </p>

                    {/* Benefits */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-truth">Benefits:</h4>
                      <ul className="space-y-1">
                        {mode.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ArrowRight className="h-3 w-3 text-resonance" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <Button 
                      onClick={() => setMode(mode.id)}
                      variant={isSelected ? "default" : "outline"}
                      className={`
                        w-full mt-4
                        ${isSelected 
                          ? `bg-${mode.color} hover:bg-${mode.color}/90` 
                          : `border-${mode.color}/30 hover:bg-${mode.color}/10`
                        }
                      `}
                    >
                      {isSelected ? (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Continue Journey
                        </>
                      ) : (
                        `Switch to ${mode.title}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Current Progress */}
      {state.streak > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center p-6 rounded-lg bg-gradient-to-r from-resonance/10 to-truth/10 border border-resonance/20"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-resonance">{state.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-truth">{state.longestStreak}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purpose">{state.badges.length}</div>
              <div className="text-sm text-muted-foreground">Badges</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};