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
  Heart,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface ActivityItem {
  id: string;
  type: 'meditation' | 'journal' | 'breath';
  title: string;
  description: string;
  created_at: string;
  duration?: number;
  mood_rating?: number;
  session_type?: string;
  entry_type?: string;
}

export const ActivityFeed = () => {
  const { user } = useAuth();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activity-feed', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Fetch recent activities from multiple tables
      const [meditationResponse, journalResponse, breathResponse] = await Promise.all([
        supabase
          .from('meditation_sessions')
          .select('id, created_at, actual_duration, practice_type')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        
        supabase
          .from('mirror_journal_entries')
          .select('id, created_at, title, mood_tag, entry_mode')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        
        supabase
          .from('breath_sessions')
          .select('id, created_at, duration')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const activities: ActivityItem[] = [];

      // Process meditation sessions
      if (meditationResponse.data) {
        meditationResponse.data.forEach(session => {
          activities.push({
            id: `meditation-${session.id}`,
            type: 'meditation',
            title: `${session.practice_type || 'Meditation'} Session`,
            description: `${Math.round((session.actual_duration || 0) / 60)} minutes of mindful practice`,
            created_at: session.created_at,
            duration: session.actual_duration,
            session_type: session.practice_type
          });
        });
      }

      // Process journal entries
      if (journalResponse.data) {
        journalResponse.data.forEach(entry => {
          activities.push({
            id: `journal-${entry.id}`,
            type: 'journal',
            title: entry.title || 'Journal Entry',
            description: `${entry.entry_mode || 'Reflection'} • Mood: ${entry.mood_tag || 'Not tagged'}`,
            created_at: entry.created_at,
            mood_rating: 0, // Not available in this schema
            entry_type: entry.entry_mode
          });
        });
      }

      // Process breath sessions
      if (breathResponse.data) {
        breathResponse.data.forEach(session => {
          activities.push({
            id: `breath-${session.id}`,
            type: 'breath',
            title: 'Breath Practice',
            description: `${Math.round((session.duration || 0) / 60)} minutes of conscious breathing`,
            created_at: session.created_at,
            duration: session.duration,
            session_type: 'breath'
          });
        });
      }

      // Sort all activities by date and return top 10
      return activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);
    },
    enabled: !!user
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meditation':
        return Heart;
      case 'journal':
        return BookOpen;
      case 'breath':
        return Activity;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'meditation':
        return 'text-teal-500';
      case 'journal':
        return 'text-violet-500';
      case 'breath':
        return 'text-emerald-500';
      default:
        return 'text-primary';
    }
  };

  const getActivityLink = (type: string) => {
    switch (type) {
      case 'meditation':
        return '/meditation';
      case 'journal':
        return '/journal';
      case 'breath':
        return '/grove';
      default:
        return '/';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
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
            <Calendar className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {activities?.length || 0} this week
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!activities || activities.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No activities yet</p>
            <div className="flex gap-2 justify-center">
              <Link to="/meditation">
                <Badge variant="outline" className="cursor-pointer hover:bg-teal-500/10">
                  Start Meditation
                </Badge>
              </Link>
              <Link to="/journal">
                <Badge variant="outline" className="cursor-pointer hover:bg-violet-500/10">
                  Write Journal
                </Badge>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              const linkPath = getActivityLink(activity.type);
              
              return (
                <Link key={activity.id} to={linkPath} className="block group">
                  <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${
                      activity.type === 'meditation' ? 'from-teal-500/20 to-teal-600/20' :
                      activity.type === 'journal' ? 'from-violet-500/20 to-violet-600/20' :
                      'from-emerald-500/20 to-emerald-600/20'
                    }`}>
                      <Icon className={`w-4 h-4 ${colorClass}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {activity.title}
                        </p>
                        <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};