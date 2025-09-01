import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';
import { 
  Trophy, 
  Flame, 
  Target, 
  Crown, 
  Zap,
  Star,
  Award
} from 'lucide-react';

const BADGE_DATA = {
  'week-warrior': {
    name: 'Week Warrior',
    description: '7 days of consistent practice',
    icon: Flame,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30'
  },
  'truth-seeker': {
    name: 'Truth Seeker',
    description: '21 days of dedicated awakening',
    icon: Crown,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30'
  },
  'awakening-master': {
    name: 'Awakening Master',
    description: '100 days of consciousness evolution',
    icon: Star,
    color: 'text-gold-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30'
  }
};

export const StreakBadgeDisplay: React.FC = () => {
  const { state, getProgressToNextBadge } = useDailyRoutine();
  const nextBadgeProgress = getProgressToNextBadge();

  return (
    <div className="space-y-6">
      {/* Current Streak */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5" />
              Sacred Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {state.streak}
                </div>
                <div className="text-sm text-muted-foreground">
                  {state.streak === 1 ? 'day' : 'days'} strong
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-truth">
                  {state.longestStreak}
                </div>
                <div className="text-sm text-muted-foreground">
                  best streak
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Earned Badges */}
      {state.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Sacred Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.badges.map((badgeId, index) => {
                  const badge = BADGE_DATA[badgeId as keyof typeof BADGE_DATA];
                  if (!badge) return null;
                  
                  const Icon = badge.icon;
                  
                  return (
                    <motion.div
                      key={badgeId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        p-4 rounded-lg ${badge.bg} ${badge.border} border
                        flex items-center gap-3
                      `}
                    >
                      <div className={`p-2 rounded-lg bg-background/50`}>
                        <Icon className={`h-6 w-6 ${badge.color}`} />
                      </div>
                      <div>
                        <div className={`font-semibold ${badge.color}`}>
                          {badge.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {badge.description}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Progress to Next Badge */}
      {nextBadgeProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-resonance/5 to-truth/5 border border-resonance/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-resonance">
                <Target className="h-5 w-5" />
                Next Achievement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-truth">
                    {nextBadgeProgress.badgeName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {nextBadgeProgress.current} / {nextBadgeProgress.needed} days
                  </div>
                </div>
                <Badge variant="outline" className="bg-resonance/10 text-resonance border-resonance/30">
                  <Award className="w-3 h-3 mr-1" />
                  {nextBadgeProgress.needed - nextBadgeProgress.current} to go
                </Badge>
              </div>
              
              <Progress 
                value={(nextBadgeProgress.current / nextBadgeProgress.needed) * 100}
                className="h-2"
              />
              
              <div className="text-xs text-muted-foreground text-center">
                Keep up your daily practice to unlock this sacred achievement
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Motivation Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center p-4 rounded-lg bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20"
      >
        <p className="text-sm text-foreground/80 font-codex italic">
          {state.streak === 0 && "Every master was once a beginner. Start your sacred streak today."}
          {state.streak > 0 && state.streak < 7 && "You're building sacred momentum. Each day deepens your awakening."}
          {state.streak >= 7 && state.streak < 21 && "Your consistency is creating real transformation. Feel the shift."}
          {state.streak >= 21 && "You are embodying the path. Your practice is a gift to the world."}
        </p>
      </motion.div>
    </div>
  );
};