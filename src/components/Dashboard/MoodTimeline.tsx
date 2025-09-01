import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Smile,
  Heart
} from 'lucide-react';
import { format } from 'date-fns';

export const MoodTimeline = () => {
  const { user } = useAuth();

  // Convert mood tags to numeric values
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

  const { data: moodData, isLoading } = useQuery({
    queryKey: ['mood-timeline', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get mood ratings from journal entries for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('mirror_journal_entries')
        .select('mood_tag, created_at, title, entry_mode')
        .eq('user_id', user.id)
        .not('mood_tag', 'is', null)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          entries: [],
          avgMood: 0,
          trend: 'stable',
          recentMood: 0,
          totalEntries: 0
        };
      }

      // Calculate average mood
      const avgMood = data.reduce((sum, entry) => sum + getMoodValue(entry.mood_tag), 0) / data.length;
      
      // Calculate trend (comparing first half vs second half)
      const midpoint = Math.floor(data.length / 2);
      const firstHalf = data.slice(0, midpoint);
      const secondHalf = data.slice(midpoint);
      
      const firstHalfAvg = firstHalf.length > 0 ? 
        firstHalf.reduce((sum, entry) => sum + getMoodValue(entry.mood_tag), 0) / firstHalf.length : 0;
      const secondHalfAvg = secondHalf.length > 0 ?
        secondHalf.reduce((sum, entry) => sum + getMoodValue(entry.mood_tag), 0) / secondHalf.length : 0;
      
      let trend = 'stable';
      const difference = secondHalfAvg - firstHalfAvg;
      if (difference > 0.3) trend = 'improving';
      else if (difference < -0.3) trend = 'declining';
      
      const recentMood = getMoodValue(data[data.length - 1]?.mood_tag) || 0;

      return {
        entries: data.slice(-7), // Last 7 entries for timeline
        avgMood: avgMood.toFixed(1),
        trend,
        recentMood,
        totalEntries: data.length
      };
    },
    enabled: !!user
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-rose-500" />;
      default:
        return <Minus className="w-4 h-4 text-amber-500" />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Needs Attention';
      default:
        return 'Stable';
    }
  };

  const getMoodEmoji = (rating: number) => {
    if (rating >= 4.5) return '😊';
    if (rating >= 3.5) return '🙂';
    if (rating >= 2.5) return '😐';
    if (rating >= 1.5) return '😕';
    return '😢';
  };

  const getMoodColor = (rating: number) => {
    if (rating >= 4) return 'bg-emerald-500';
    if (rating >= 3) return 'bg-teal-500';
    if (rating >= 2) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Mood Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-16 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!moodData || moodData.totalEntries === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Mood Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Smile className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No mood data yet</p>
            <p className="text-sm text-muted-foreground">
              Rate your mood in journal entries to see trends
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Mood Timeline
          </CardTitle>
          <div className="flex items-center gap-2">
            {getTrendIcon(moodData.trend)}
            <span className="text-sm font-medium">{getTrendText(moodData.trend)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/30">
            <div className="text-2xl font-bold text-primary mb-1">
              {moodData.avgMood}
            </div>
            <div className="text-sm text-muted-foreground">Average Mood</div>
            <div className="text-xs text-muted-foreground mt-1">
              From {moodData.totalEntries} entries
            </div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-muted/30">
            <div className="text-2xl mb-1">
              {getMoodEmoji(moodData.recentMood)}
            </div>
            <div className="text-sm text-muted-foreground">Recent Mood</div>
            <div className="text-xs text-muted-foreground mt-1">
              {moodData.recentMood}/5.0
            </div>
          </div>
        </div>

        {/* Mood Timeline */}
        {moodData.entries.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Recent Entries</h4>
            <div className="space-y-3">
              {moodData.entries.map((entry, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div 
                    className={`w-3 h-3 rounded-full ${getMoodColor(getMoodValue(entry.mood_tag))}`}
                  />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          {entry.title || 'Journal Entry'}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {format(new Date(entry.created_at), 'MMM d')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg">{getMoodEmoji(getMoodValue(entry.mood_tag))}</span>
                        <span className="text-xs text-muted-foreground">
                          {entry.mood_tag || 'No mood'} • {entry.entry_mode || 'Reflection'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mood Scale Reference */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span>1-2</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>2-3</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <span>3-4</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>4-5</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};