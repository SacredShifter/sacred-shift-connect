/**
 * Circles Dashboard - Main hub for Sacred Circles messaging platform
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessagingCore } from './MessagingCore';
import { Plus, Users, Lock, Globe, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Circle {
  id: string;
  name: string;
  description?: string;
  is_private: boolean;
  avatar_url?: string;
  creator_id: string;
  member_count: number;
  last_message_time?: string;
  unread_count: number;
}

export const CirclesDashboard: React.FC = () => {
  const { user } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCircles();
    }
  }, [user]);

  const loadCircles = async () => {
    try {
      // Mock data for now since the actual tables are being set up
      const mockCircles: Circle[] = [
        {
          id: '1',
          name: 'Sacred Geometry Explorers',
          description: 'Exploring the divine patterns in nature and consciousness',
          is_private: false,
          creator_id: user?.id || '',
          member_count: 42,
          unread_count: 3,
          last_message_time: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Inner Light Council',
          description: 'Private circle for deep spiritual work',
          is_private: true,
          creator_id: user?.id || '',
          member_count: 7,
          unread_count: 0,
          last_message_time: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          name: 'Cosmic Frequencies',
          description: 'Discussing vibrational healing and sound therapy',
          is_private: false,
          creator_id: user?.id || '',
          member_count: 156,
          unread_count: 12,
          last_message_time: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      setCircles(mockCircles);
    } catch (error) {
      console.error('Failed to load circles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCircle = async () => {
    // TODO: Implement circle creation modal
    console.log('Create new circle');
  };

  const formatLastMessageTime = (time: string) => {
    const now = new Date();
    const messageTime = new Date(time);
    const diffMs = now.getTime() - messageTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return messageTime.toLocaleDateString();
  };

  if (isLoading) {
    return <div>Loading circles...</div>;
  }

  if (selectedCircle) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedCircle(null)}>
            ← Back to Circles
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedCircle.avatar_url} />
              <AvatarFallback>{selectedCircle.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{selectedCircle.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                {selectedCircle.member_count} members
                {selectedCircle.is_private && <Lock className="h-3 w-3" />}
              </div>
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <MessagingCore 
          circleId={selectedCircle.id} 
          userId={user?.id || ''} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sacred Circles</h1>
          <p className="text-muted-foreground">Connect with your spiritual community</p>
        </div>
        <Button onClick={createCircle}>
          <Plus className="h-4 w-4 mr-2" />
          Create Circle
        </Button>
      </div>

      {/* Circles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {circles.map(circle => (
          <Card 
            key={circle.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedCircle(circle)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={circle.avatar_url} />
                    <AvatarFallback>{circle.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{circle.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {circle.member_count} members
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {circle.is_private ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  )}
                  {circle.unread_count > 0 && (
                    <Badge variant="default" className="text-xs">
                      {circle.unread_count}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {circle.description}
              </p>
              
              {circle.last_message_time && (
                <div className="text-xs text-muted-foreground">
                  Last activity: {formatLastMessageTime(circle.last_message_time)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {circles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No circles yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first sacred circle to connect with your community
            </p>
            <Button onClick={createCircle}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Circle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};