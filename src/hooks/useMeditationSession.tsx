import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type MeditationType = 'breathing' | 'loving-kindness' | 'chakra' | 'mindfulness' | 'body-scan';

interface MeditationPractice {
  id: string;
  name: string;
  description: string;
  visualType: MeditationType;
  youtubePlaylistId?: string;
  defaultDuration: number;
  guidance: string;
  color: string;
}

interface SessionMetrics {
  heartRateVariability?: number;
  breathingPattern?: 'steady' | 'irregular' | 'deep';
  focusLevel?: number;
  emotionalState?: 'calm' | 'peaceful' | 'agitated' | 'blissful';
}

export function useMeditationSession() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentSession, setCurrentSession] = useState<{
    practice: MeditationPractice;
    startTime: Date;
    duration: number;
    sessionId: string;
  } | null>(null);
  
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const metricsRef = useRef<SessionMetrics>({});

  // Start a new meditation session
  const startSession = useCallback(async (
    practice: MeditationPractice, 
    duration: number
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to track your meditation sessions",
        variant: "destructive",
      });
      return null;
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = new Date();
    
    setCurrentSession({
      practice,
      startTime,
      duration,
      sessionId,
    });

    // Initialize session metrics
    metricsRef.current = {
      heartRateVariability: 0,
      breathingPattern: 'steady',
      focusLevel: 0.5,
      emotionalState: 'calm',
    };

    return sessionId;
  }, [user, toast]);

  // Update session metrics during practice
  const updateSessionMetrics = useCallback((metrics: Partial<SessionMetrics>) => {
    metricsRef.current = {
      ...metricsRef.current,
      ...metrics,
    };
  }, []);

  // Complete the current session
  const completeSession = useCallback(async (actualDuration?: number) => {
    if (!currentSession || !user) return;

    setIsLoading(true);
    
    try {
      const endTime = new Date();
      const sessionDuration = actualDuration || 
        Math.floor((endTime.getTime() - currentSession.startTime.getTime()) / 1000 / 60);

      const sessionData = {
        user_id: user.id,
        session_id: currentSession.sessionId,
        practice_type: currentSession.practice.visualType,
        practice_name: currentSession.practice.name,
        intended_duration: currentSession.duration,
        actual_duration: sessionDuration,
        started_at: currentSession.startTime.toISOString(),
        completed_at: endTime.toISOString(),
        session_data: {
          practice_id: currentSession.practice.id,
          visual_type: currentSession.practice.visualType,
          playlist_used: currentSession.practice.youtubePlaylistId || null,
          completion_rate: (sessionDuration / currentSession.duration) * 100,
        },
        metrics: metricsRef.current,
        tags: generateSessionTags(currentSession.practice, sessionDuration),
      };

      const { error } = await supabase
        .from('meditation_sessions')
        .insert(sessionData);

      if (error) {
        throw error;
      }

      // Update user meditation stats
      await updateUserMeditationStats(sessionDuration);

      toast({
        title: "Session Recorded 📿",
        description: `${sessionDuration} minutes of ${currentSession.practice.name} saved to your journey`,
      });

      // Add to local history
      setSessionHistory(prev => [sessionData, ...prev]);
      
    } catch (error) {
      console.error('Error completing meditation session:', error);
      toast({
        title: "Recording Error",
        description: "Session completed but could not be saved",
        variant: "destructive",
      });
    } finally {
      setCurrentSession(null);
      setIsLoading(false);
    }
  }, [currentSession, user, toast]);

  // Cancel the current session
  const cancelSession = useCallback(() => {
    setCurrentSession(null);
    metricsRef.current = {};
  }, []);

  // Load user's meditation history
  const loadSessionHistory = useCallback(async (limit = 20) => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      setSessionHistory(data || []);
    } catch (error) {
      console.error('Error loading session history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Update user meditation statistics
  const updateUserMeditationStats = async (sessionDuration: number) => {
    if (!user) return;

    try {
      // Get current stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('meditation_stats')
        .eq('user_id', user.id)
        .single();

      const currentStats = profile?.meditation_stats || {
        total_sessions: 0,
        total_minutes: 0,
        streak_days: 0,
        last_session_date: null,
        favorite_practices: {},
      };

      // Calculate new stats
      const today = new Date().toDateString();
      const lastSessionDate = currentStats.last_session_date ? 
        new Date(currentStats.last_session_date).toDateString() : null;
      
      let streakDays = currentStats.streak_days;
      if (lastSessionDate !== today) {
        // Check if yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastSessionDate === yesterday.toDateString()) {
          streakDays += 1;
        } else if (lastSessionDate !== today) {
          streakDays = 1; // Reset streak
        }
      }

      const updatedStats = {
        total_sessions: currentStats.total_sessions + 1,
        total_minutes: currentStats.total_minutes + sessionDuration,
        streak_days: streakDays,
        last_session_date: new Date().toISOString(),
        favorite_practices: {
          ...currentStats.favorite_practices,
          [currentSession?.practice.visualType || 'unknown']: 
            (currentStats.favorite_practices[currentSession?.practice.visualType || 'unknown'] || 0) + 1,
        },
      };

      // Update profile with new stats
      await supabase
        .from('profiles')
        .update({ meditation_stats: updatedStats })
        .eq('user_id', user.id);

    } catch (error) {
      console.error('Error updating meditation stats:', error);
    }
  };

  // Generate contextual tags for the session
  const generateSessionTags = (practice: MeditationPractice, duration: number): string[] => {
    const tags = [practice.visualType];
    
    if (duration >= practice.defaultDuration) {
      tags.push('completed');
    } else if (duration >= practice.defaultDuration * 0.75) {
      tags.push('mostly-completed');
    } else {
      tags.push('partial');
    }
    
    // Add time-based tags
    const hour = new Date().getHours();
    if (hour < 6) tags.push('late-night');
    else if (hour < 12) tags.push('morning');
    else if (hour < 18) tags.push('afternoon');
    else tags.push('evening');
    
    // Add metrics-based tags
    if (metricsRef.current.emotionalState === 'blissful') {
      tags.push('transcendent');
    }
    if (metricsRef.current.focusLevel && metricsRef.current.focusLevel > 0.8) {
      tags.push('high-focus');
    }
    
    return tags;
  };

  return {
    currentSession,
    sessionHistory,
    isLoading,
    startSession,
    completeSession,
    cancelSession,
    updateSessionMetrics,
    loadSessionHistory,
  };
}