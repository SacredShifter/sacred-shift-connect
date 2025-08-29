import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp } from 'lucide-react';

export const ProgressRings = () => {
  const { user } = useAuth();

  const { data: weeklyProgress } = useQuery({
    queryKey: ['weekly-progress', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [meditationResponse, journalResponse, breathResponse] = await Promise.all([
        supabase
          .from('meditation_sessions')
          .select('actual_duration')
          .eq('user_id', user.id)
          .gte('created_at', weekAgo.toISOString()),
        
        supabase
          .from('mirror_journal_entries')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', weekAgo.toISOString()),
        
        supabase
          .from('breath_sessions')
          .select('duration')
          .eq('user_id', user.id)
          .gte('created_at', weekAgo.toISOString())
      ]);

      const meditationMinutes = meditationResponse.data?.reduce((sum, session) => 
        sum + (session.actual_duration || 0), 0) / 60 || 0;
      
      const journalEntries = journalResponse.data?.length || 0;
      const breathMinutes = breathResponse.data?.reduce((sum, session) => 
        sum + (session.duration || 0), 0) / 60 || 0;

      return {
        meditation: {
          current: Math.round(meditationMinutes),
          target: 60, // 60 minutes per week
          label: 'Meditation Minutes'
        },
        journal: {
          current: journalEntries,
          target: 7, // 7 entries per week (daily)
          label: 'Journal Entries'
        },
        breath: {
          current: Math.round(breathMinutes),
          target: 30, // 30 minutes per week
          label: 'Breath Practice'
        }
      };
    },
    enabled: !!user
  });

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-emerald-500';
    if (progress >= 75) return 'text-teal-500';
    if (progress >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getProgressBadge = (progress: number) => {
    if (progress >= 100) return { text: 'Complete!', variant: 'secondary' as const };
    if (progress >= 75) return { text: 'On Track', variant: 'outline' as const };
    if (progress >= 50) return { text: 'Good', variant: 'outline' as const };
    return { text: 'Keep Going', variant: 'outline' as const };
  };

  if (!weeklyProgress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-2 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressItems = [
    {
      ...weeklyProgress.meditation,
      color: 'teal',
      icon: '🧘‍♀️'
    },
    {
      ...weeklyProgress.journal,
      color: 'violet',
      icon: '📖'
    },
    {
      ...weeklyProgress.breath,
      color: 'emerald',
      icon: '🌬️'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Weekly Progress
          </CardTitle>
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {progressItems.map((item, index) => {
          const progress = calculateProgress(item.current, item.target);
          const badge = getProgressBadge(progress);
          
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <Badge variant={badge.variant} className="text-xs">
                  {badge.text}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Progress 
                  value={progress} 
                  className={`h-2 ${
                    item.color === 'teal' ? '[&>div]:bg-teal-500' :
                    item.color === 'violet' ? '[&>div]:bg-violet-500' :
                    '[&>div]:bg-emerald-500'
                  }`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{item.current} / {item.target}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="pt-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Weekly Goals Help Track Your Journey
            </p>
            <div className="flex justify-center gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                <span>Meditation</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <span>Journal</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Breath</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};