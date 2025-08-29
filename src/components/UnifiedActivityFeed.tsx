import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Users, 
  Calendar, 
  Heart, 
  Star, 
  Zap, 
  Sparkles,
  Activity,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'circle_post' | 'message' | 'event' | 'circle_join' | 'journal_entry';
  title: string;
  content?: string;
  user_name?: string;
  user_avatar?: string;
  created_at: string;
  metadata?: any;
  group_name?: string;
  sacred_role?: string;
}

export function UnifiedActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUnifiedActivity();
    }
  }, [user]);

  const fetchUnifiedActivity = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple activity sources in parallel
      const [postsResponse, eventsResponse] = await Promise.all([
        // Circle posts with basic user info
        supabase
          .from('circle_posts')
          .select('*, profiles!circle_posts_user_id_fkey(display_name, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(15),
          
        // Sacred events
        supabase
          .from('sacred_events')
          .select('*')
          .gte('scheduled_start', new Date().toISOString())
          .order('scheduled_start', { ascending: true })
          .limit(5)
      ]);

      const allActivities: ActivityItem[] = [];

      // Process circle posts
      if (postsResponse.data) {
        postsResponse.data.forEach((post: any) => {
          allActivities.push({
            id: `post_${post.id}`,
            type: 'circle_post',
            title: 'Circle Post',
            content: post.content,
            user_name: (post.profiles as any)?.display_name || 'Sacred Soul',
            user_avatar: (post.profiles as any)?.avatar_url,
            created_at: post.created_at,
            metadata: {
              chakra_tag: post.chakra_tag,
              frequency: post.frequency,
              tone: post.tone
            }
          });
        });
      }

      // Process events
      if (eventsResponse.data) {
        eventsResponse.data.forEach((event: any) => {
          allActivities.push({
            id: `event_${event.id}`,
            type: 'event',
            title: `Sacred Event: ${event.event_type || 'Gathering'}`,
            content: event.description,
            created_at: event.timestamp,
            metadata: {
              scheduled_start: event.scheduled_start,
              event_type: event.event_type,
              chakra_involved: event.chakra_involved
            }
          });
        });
      }

      // Sort all activities by creation time
      allActivities.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setActivities(allActivities);
    } catch (error) {
      console.error('Error fetching unified activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'circle_post': return <Users className="w-5 h-5" />;
      case 'message': return <MessageCircle className="w-5 h-5" />;
      case 'event': return <Calendar className="w-5 h-5" />;
      case 'circle_join': return <Heart className="w-5 h-5" />;
      case 'journal_entry': return <Sparkles className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'circle_post': return 'text-blue-500';
      case 'message': return 'text-green-500';
      case 'event': return 'text-purple-500';
      case 'circle_join': return 'text-pink-500';
      case 'journal_entry': return 'text-amber-500';
      default: return 'text-primary';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-primary/20 rounded w-1/3" />
                  <div className="h-3 bg-primary/10 rounded w-1/4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-primary/20 rounded w-3/4" />
                <div className="h-4 bg-primary/20 rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feed Header */}
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Sacred Activity Stream
        </h2>
        <p className="text-muted-foreground">
          Witness the collective consciousness in motion across all platform dimensions
        </p>
      </div>

      {/* Activity Stream */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <Activity className="w-12 h-12 mx-auto text-primary/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sacred Silence</h3>
              <p className="text-muted-foreground">
                The consciousness stream is in a moment of peaceful stillness. 
                <br />Be the first to create ripples in the sacred waters.
              </p>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full bg-primary/10 ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{activity.title}</h4>
                        {activity.sacred_role && (
                          <Badge variant="outline" className="text-xs">
                            {activity.sacred_role}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        {activity.user_name && (
                          <>
                            <span>{activity.user_name}</span>
                            <span>•</span>
                          </>
                        )}
                        {activity.group_name && (
                          <>
                            <span>in {activity.group_name}</span>
                            <span>•</span>
                          </>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDistanceToNow(new Date(activity.created_at))} ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {activity.user_avatar && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={activity.user_avatar} />
                      <AvatarFallback>{activity.user_name?.charAt(0) || 'S'}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </CardHeader>

              {activity.content && (
                <CardContent className="pt-0">
                  <p className="text-sm leading-relaxed mb-3">{activity.content}</p>
                  
                  {/* Activity-specific metadata */}
                  {activity.metadata && (
                    <div className="flex flex-wrap gap-2">
                      {activity.metadata.chakra_tag && (
                        <Badge variant="outline" className="text-xs">
                          {activity.metadata.chakra_tag} Chakra
                        </Badge>
                      )}
                      {activity.metadata.frequency && (
                        <Badge variant="secondary" className="text-xs flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>{activity.metadata.frequency}Hz</span>
                        </Badge>
                      )}
                      {activity.metadata.event_type && (
                        <Badge variant="outline" className="text-xs">
                          {activity.metadata.event_type}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {activities.length > 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            ✨ More sacred activities flow through time's infinite stream ✨
          </p>
        </div>
      )}
    </div>
  );
}