import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTeachingProgress } from '@/hooks/useTeachingProgress';

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
  const { recordSession } = useTeachingProgress();
  
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
        .from('akashic_records')
        .insert({
          type: 'meditation_session',
          data: sessionData as any,
          metadata: {
            session_type: 'individual_meditation'
          }
        });

      if (error) {
        throw error;
      }

      // Update user meditation stats
      await updateUserMeditationStats(sessionDuration);

      // Record session for teaching progression
      recordSession();

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
  }, [currentSession, user, toast, recordSession]);

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
        .from('akashic_records')
        .select('*')
        .eq('type', 'meditation_session')
        .order('created_at', { ascending: false })
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
      // Store meditation stats update in akashic_records for now
      await supabase.from('akashic_records').insert({
        type: 'meditation_stats_update',
        data: {
          user_id: user.id,
          session_duration: sessionDuration,
          updated_at: new Date().toISOString()
        },
        metadata: {
          stats_type: 'session_completion'
        }
      });
    } catch (error) {
      console.error('Error updating meditation stats:', error);
    }
  };

  // Generate contextual tags for the session
  const generateSessionTags = (practice: MeditationPractice, duration: number): string[] => {
    const tags: string[] = [practice.visualType];
    
    if (duration >= practice.defaultDuration) {
      tags.push('session-completed');
    } else if (duration >= practice.defaultDuration * 0.75) {
      tags.push('session-mostly-completed');
    } else {
      tags.push('session-partial');
    }
    
    // Add time-based tags
    const hour = new Date().getHours();
    if (hour < 6) tags.push('time-late-night');
    else if (hour < 12) tags.push('time-morning');
    else if (hour < 18) tags.push('time-afternoon');
    else tags.push('time-evening');
    
    // Add metrics-based tags
    if (metricsRef.current.emotionalState === 'blissful') {
      tags.push('state-transcendent');
    }
    if (metricsRef.current.focusLevel && metricsRef.current.focusLevel > 0.8) {
      tags.push('focus-high');
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