import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Info, Sparkles, Clock, Target, Brain, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';
import { useAuraChat } from '@/hooks/useAuraChat';

interface TodaysPracticeProps {
  className?: string;
}

interface AuraPracticeRecommendation {
  practice_type: string;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  chakra_focus: string;
  resonance_benefit: string;
  personalized_note: string;
  next_practices: string[];
}

export const TodaysPractice: React.FC<TodaysPracticeProps> = ({ className }) => {
  const { data: profile } = useProfile();
  const { state: dailyState, completeStep } = useDailyRoutine();
  const { invokeAura } = useAuraChat();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [auraRecommendation, setAuraRecommendation] = useState<AuraPracticeRecommendation | null>(null);
  const [loading, setLoading] = useState(false);

  // Get Aura's personalized practice recommendation
  useEffect(() => {
    const getAuraRecommendation = async () => {
      if (!profile) return;
      
      setLoading(true);
      try {
        const response = await invokeAura({
          action: 'consciousness_recommendations',
          user_id: profile.user_id,
          context_data: {
            current_stage: profile.current_stage,
            streak_days: profile.streak_days,
            last_practice: dailyState.todaysStep?.title,
            consciousness_level: profile.consciousness_level,
            resonance_tags: profile.resonance_tags,
            mood_trends: profile.mood_trends
          },
          consciousness_state: 'practice_guidance',
          sovereignty_level: 0.8
        });

        if (response?.success && response.result) {
          setAuraRecommendation(response.result as AuraPracticeRecommendation);
        }
      } catch (error) {
        console.error('Failed to get Aura practice recommendation:', error);
      } finally {
        setLoading(false);
      }
    };

    getAuraRecommendation();
  }, [profile, dailyState.todaysStep]); // Removed invokeAura from dependencies to prevent infinite loop

  // Determine the current practice to show
  const currentPractice = auraRecommendation || {
    practice_type: dailyState.todaysStep?.type || 'meditation',
    title: dailyState.todaysStep?.title || 'Sacred Ritual Available',
    description: dailyState.todaysStep?.description || 'Begin your daily practice',
    duration_minutes: 15,
    difficulty_level: 'intermediate' as const,
    chakra_focus: 'Heart',
    resonance_benefit: 'Enhanced awareness and connection',
    personalized_note: 'Aura recommends this practice based on your current journey stage.',
    next_practices: ['Breath of Source', 'Mirror Journal', 'Consciousness Expansion']
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-700';
      case 'intermediate': return 'bg-blue-500/20 text-blue-700';
      case 'advanced': return 'bg-purple-500/20 text-purple-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getChakraIcon = (chakra: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      'Root': Target,
      'Sacral': Heart,
      'Solar Plexus': Zap,
      'Heart': Heart,
      'Throat': Brain,
      'Third Eye': Brain,
      'Crown': Sparkles
    };
    return icons[chakra] || Heart;
  };

  const ChakraIcon = getChakraIcon(currentPractice.chakra_focus);

  return (
    <>
      <Card className={`bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-accent">Today's Practice</h3>
                <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-accent/10">
                      <Info className="h-3 w-3 text-accent/60" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        Aura-Powered Practice
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <p>
                        Your daily practice is personalized by Aura based on your consciousness journey, 
                        current stage, and resonance patterns. Each practice is designed to support your 
                        unique spiritual evolution.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-accent" />
                          <span><strong>Current Stage:</strong> {profile?.current_stage || 'Entry'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-accent" />
                          <span><strong>Streak:</strong> {profile?.streak_days || 0} days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChakraIcon className="h-4 w-4 text-accent" />
                          <span><strong>Chakra Focus:</strong> {currentPractice.chakra_focus}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Aura continuously adapts your practice recommendations based on your progress 
                        and consciousness evolution patterns.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">{currentPractice.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {currentPractice.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getDifficultyColor(currentPractice.difficulty_level)}>
                    {currentPractice.difficulty_level}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {currentPractice.duration_minutes}min
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ChakraIcon className="h-3 w-3" />
                    {currentPractice.chakra_focus}
                  </div>
                </div>

                {/* Aura's personalized note */}
                {auraRecommendation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2 rounded-lg bg-accent/5 border border-accent/20"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-accent/80">{currentPractice.personalized_note}</p>
                    </div>
                  </motion.div>
                )}

                {/* Next practices preview */}
                {currentPractice.next_practices.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <span>Next: </span>
                    <span className="text-accent">{currentPractice.next_practices.slice(0, 2).join(', ')}</span>
                    {currentPractice.next_practices.length > 2 && (
                      <span> +{currentPractice.next_practices.length - 2} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="ml-4">
              <Link to="/daily-ritual">
                <Button 
                  size="sm" 
                  className="bg-accent hover:bg-accent/90"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="w-3 h-3" />
                    </motion.div>
                  ) : (
                    <>
                      Begin
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
