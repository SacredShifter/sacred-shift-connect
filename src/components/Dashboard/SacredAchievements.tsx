import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Zap, Heart, BookOpen, Activity, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'meditation' | 'journal' | 'breath' | 'streak' | 'milestone';
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  isNew: boolean;
  unlockedAt?: string;
}

export const SacredAchievements: React.FC = () => {
  const { user } = useAuth();

  const { data: achievements, isLoading } = useQuery({
    queryKey: ['sacred-achievements', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get user's actual data
      const [meditationData, journalData, breathData, profileData] = await Promise.all([
        supabase
          .from('meditation_sessions')
          .select('id, created_at, actual_duration')
          .eq('user_id', user.id),
        
        supabase
          .from('mirror_journal_entries')
          .select('id, created_at')
          .eq('user_id', user.id),
        
        supabase
          .from('breath_sessions')
          .select('id, created_at, duration')
          .eq('user_id', user.id),
        
        supabase
          .from('profiles')
          .select('streak_days, total_meditation_minutes, total_journal_entries, total_breath_sessions')
          .eq('user_id', user.id)
          .single()
      ]);

      const meditationSessions = meditationData.data || [];
      const journalEntries = journalData.data || [];
      const breathSessions = breathData.data || [];
      const profile = profileData.data;

      const totalMeditationMinutes = profile?.total_meditation_minutes || 0;
      const totalJournalEntries = profile?.total_journal_entries || 0;
      const totalBreathSessions = profile?.total_breath_sessions || 0;
      const streakDays = profile?.streak_days || 0;

      // Calculate achievements based on real data
      const achievements: Achievement[] = [
        {
          id: 'first-meditation',
          title: 'First Meditation Complete',
          description: 'Begin your sacred journey',
          icon: Heart,
          category: 'meditation',
          progress: meditationSessions.length > 0 ? 1 : 0,
          maxProgress: 1,
          isCompleted: meditationSessions.length > 0,
          isNew: meditationSessions.length === 1
        },
        {
          id: 'meditation-master',
          title: 'Meditation Master',
          description: 'Complete 100 meditation sessions',
          icon: Star,
          category: 'meditation',
          progress: meditationSessions.length,
          maxProgress: 100,
          isCompleted: meditationSessions.length >= 100,
          isNew: meditationSessions.length >= 100 && meditationSessions.length < 105
        },
        {
          id: 'journal-keeper',
          title: 'Mirror Mystic',
          description: 'Write 5 journal entries',
          icon: BookOpen,
          category: 'journal',
          progress: Math.min(journalEntries.length, 5),
          maxProgress: 5,
          isCompleted: journalEntries.length >= 5,
          isNew: journalEntries.length >= 5 && journalEntries.length < 7
        },
        {
          id: 'breath-practitioner',
          title: 'Breath of Source',
          description: 'Complete 10 breath sessions',
          icon: Activity,
          category: 'breath',
          progress: Math.min(breathSessions.length, 10),
          maxProgress: 10,
          isCompleted: breathSessions.length >= 10,
          isNew: breathSessions.length >= 10 && breathSessions.length < 12
        },
        {
          id: 'streak-keeper',
          title: 'Sacred Streak',
          description: 'Maintain a 7-day practice streak',
          icon: Calendar,
          category: 'streak',
          progress: Math.min(streakDays, 7),
          maxProgress: 7,
          isCompleted: streakDays >= 7,
          isNew: streakDays >= 7 && streakDays < 10
        },
        {
          id: 'time-master',
          title: 'Time Master',
          description: 'Accumulate 1000 minutes of practice',
          icon: Target,
          category: 'milestone',
          progress: Math.min(totalMeditationMinutes, 1000),
          maxProgress: 1000,
          isCompleted: totalMeditationMinutes >= 1000,
          isNew: totalMeditationMinutes >= 1000 && totalMeditationMinutes < 1100
        }
      ];

      return achievements;
    },
    enabled: !!user
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meditation': return 'from-teal-500/20 to-teal-600/20';
      case 'journal': return 'from-violet-500/20 to-violet-600/20';
      case 'breath': return 'from-emerald-500/20 to-emerald-600/20';
      case 'streak': return 'from-amber-500/20 to-amber-600/20';
      case 'milestone': return 'from-purple-500/20 to-purple-600/20';
      default: return 'from-gray-500/20 to-gray-600/20';
    }
  };

  const getCategoryIconColor = (category: string) => {
    switch (category) {
      case 'meditation': return 'text-teal-500';
      case 'journal': return 'text-violet-500';
      case 'breath': return 'text-emerald-500';
      case 'streak': return 'text-amber-500';
      case 'milestone': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Sacred Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-2 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedAchievements = achievements?.filter(a => a.isCompleted) || [];
  const newAchievements = achievements?.filter(a => a.isNew) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Sacred Achievements
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {completedAchievements.length}/{achievements?.length || 0}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {achievements?.slice(0, 4).map((achievement) => {
            const Icon = achievement.icon;
            const progress = (achievement.progress / achievement.maxProgress) * 100;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg bg-gradient-to-r ${getCategoryColor(achievement.category)} border ${
                  achievement.isCompleted ? 'border-green-500/30' : 'border-border/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(achievement.category)}`}>
                      <Icon className={`w-4 h-4 ${getCategoryIconColor(achievement.category)}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{achievement.title}</span>
                        {achievement.isNew && (
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700">
                            New
                          </Badge>
                        )}
                        {achievement.isCompleted && (
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </div>
                
                {!achievement.isCompleted && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{achievement.progress} / {achievement.maxProgress}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {completedAchievements.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {completedAchievements.length} achievement{completedAchievements.length !== 1 ? 's' : ''} unlocked
              </p>
              <div className="flex justify-center gap-1">
                {completedAchievements.slice(0, 5).map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center"
                    >
                      <Icon className="w-3 h-3 text-amber-600" />
                    </div>
                  );
                })}
                {completedAchievements.length > 5 && (
                  <div className="w-6 h-6 rounded-full bg-muted/30 border border-border/50 flex items-center justify-center text-xs text-muted-foreground">
                    +{completedAchievements.length - 5}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
