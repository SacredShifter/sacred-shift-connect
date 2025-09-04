import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfile } from '@/hooks/useProfile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const EnhancedResonanceChain = () => {
  const { data: profile } = useProfile();
  
  const streakDays = profile?.streak_days || 0;
  const totalMeditation = profile?.total_meditation_minutes || 0;
  const totalJournal = profile?.total_journal_entries || 0;
  
  // Calculate resonance strength based on activities
  const resonanceStrength = Math.min(100, (streakDays * 10) + (totalMeditation * 0.1) + (totalJournal * 2));
  
  const getStreakMessage = (days: number) => {
    if (days === 0) return "Begin your journey";
    if (days < 7) return "Building momentum";
    if (days < 21) return "Sacred rhythm flowing";
    if (days < 100) return "Awakening accelerating";
    return "Master of the Chain";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 cursor-help hover:border-primary/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-primary mb-1">Resonance Chain</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      animate={{ 
                        scale: streakDays > 0 ? [1, 1.1, 1] : 1,
                        rotate: streakDays > 0 ? [0, 5, -5, 0] : 0
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: streakDays > 0 ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      <Zap className="w-4 h-4 text-primary" />
                    </motion.div>
                    <span className="text-2xl font-bold">{streakDays}</span>
                    <span className="text-sm text-muted-foreground">day streak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-primary/60" />
                    <span className="text-xs text-muted-foreground">{getStreakMessage(streakDays)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <motion.div
                    animate={{ 
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Target className="w-8 h-8 text-primary/60" />
                  </motion.div>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {Math.round(resonanceStrength)}% power
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">Resonance Chain</p>
            <p className="text-sm">Your Resonance Chain tracks consecutive days of spiritual practice. Each day you complete a sacred practice, your chain grows stronger, amplifying your connection to higher consciousness.</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Meditation, breathwork, and journaling strengthen your chain</div>
              <div>• Longer streaks unlock deeper spiritual insights</div>
              <div>• Your resonance power influences synchronicity manifestation</div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};