import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock,
  BookOpen,
  Activity,
  TrendingUp,
  Heart,
  Zap,
  Target,
  Star
} from 'lucide-react';

export const DashboardMetrics = () => {
  const { user } = useAuth();

  // Fetch meditation sessions
  const { data: meditationMetrics } = useQuery({
    queryKey: ['meditation-metrics', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('actual_duration, created_at, practice_type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const totalSessions = data?.length || 0;
      const totalMinutes = data?.reduce((sum, session) => sum + (session.actual_duration || 0), 0) || 0;
      const thisWeekSessions = data?.filter(session => {
        const sessionDate = new Date(session.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return sessionDate >= weekAgo;
      }).length || 0;
      
      return {
        totalSessions,
        totalMinutes: Math.round(totalMinutes / 60), // Convert to minutes
        thisWeekSessions,
        recentSessions: data?.slice(0, 5) || []
      };
    },
    enabled: !!user
  });

  // Fetch journal entries
  const { data: journalMetrics } = useQuery({
    queryKey: ['journal-metrics', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('mirror_journal_entries')
        .select('created_at, mood_tag, entry_mode')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const totalEntries = data?.length || 0;
      const thisWeekEntries = data?.filter(entry => {
        const entryDate = new Date(entry.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entryDate >= weekAgo;
      }).length || 0;
      
      // Calculate mood based on mood tags (simplified rating system)
      const getMoodValue = (tag: string | null) => {
        if (!tag) return 0;
        const lowerTag = tag.toLowerCase();
        if (lowerTag.includes('excellent') || lowerTag.includes('amazing') || lowerTag.includes('blissful')) return 5;
        if (lowerTag.includes('good') || lowerTag.includes('happy') || lowerTag.includes('peaceful')) return 4;
        if (lowerTag.includes('okay') || lowerTag.includes('neutral') || lowerTag.includes('calm')) return 3;
        if (lowerTag.includes('low') || lowerTag.includes('tired') || lowerTag.includes('sad')) return 2;
        if (lowerTag.includes('terrible') || lowerTag.includes('awful') || lowerTag.includes('angry')) return 1;
        return 3; // Default neutral
      };
      
      const avgMood = data?.length ? 
        data.reduce((sum, entry) => sum + getMoodValue(entry.mood_tag), 0) / data.length : 0;
      
      return {
        totalEntries,
        thisWeekEntries,
        avgMood: avgMood.toFixed(1),
        recentEntries: data?.slice(0, 3) || []
      };
    },
    enabled: !!user
  });

  // Fetch breath sessions
  const { data: breathMetrics } = useQuery({
    queryKey: ['breath-metrics', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('breath_sessions')
        .select('duration, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const totalSessions = data?.length || 0;
      const totalMinutes = data?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0;
      const thisWeekSessions = data?.filter(session => {
        const sessionDate = new Date(session.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return sessionDate >= weekAgo;
      }).length || 0;
      
      return {
        totalSessions,
        totalMinutes: Math.round(totalMinutes / 60), // Convert to minutes  
        thisWeekSessions,
        recentSessions: data?.slice(0, 3) || []
      };
    },
    enabled: !!user
  });

  const metrics = [
    {
      title: 'Meditation Time',
      value: `${meditationMetrics?.totalMinutes || 0}`,
      unit: 'minutes',
      change: `${meditationMetrics?.thisWeekSessions || 0} this week`,
      icon: Heart,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20'
    },
    {
      title: 'Journal Entries',
      value: `${journalMetrics?.totalEntries || 0}`,
      unit: 'entries',
      change: `${journalMetrics?.thisWeekEntries || 0} this week`,
      icon: BookOpen,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20'
    },
    {
      title: 'Breath Sessions',
      value: `${breathMetrics?.totalSessions || 0}`,
      unit: 'sessions',
      change: `${breathMetrics?.thisWeekSessions || 0} this week`,
      icon: Activity,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Average Mood',
      value: `${journalMetrics?.avgMood || '0.0'}`,
      unit: '/ 5.0',
      change: 'From journal entries',
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className={`${metric.bg} ${metric.border} border`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
              {metric.title === 'Average Mood' && journalMetrics?.avgMood && parseFloat(journalMetrics.avgMood) >= 4.0 && (
                <Badge variant="secondary" className="text-xs">Excellent</Badge>
              )}
              {metric.title === 'Meditation Time' && meditationMetrics && meditationMetrics.thisWeekSessions >= 5 && (
                <Badge variant="secondary" className="text-xs">Streak</Badge>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{metric.value}</span>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
              <p className="text-xs text-muted-foreground">{metric.change}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};