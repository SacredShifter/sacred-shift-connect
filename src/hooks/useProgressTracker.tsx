import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProgressUpdates {
  breathSessions: number;
  journalEntries: number;
  meditationMinutes: number;
  circleParticipation: number;
  codeEntries: number;
}

type ProgressUpdateCallback = (updates: Partial<ProgressUpdates>) => void;

export const useProgressTracker = (onProgressUpdate: ProgressUpdateCallback) => {
  const { user } = useAuth();
  const updateCallbackRef = useRef(onProgressUpdate);
  
  // Keep callback ref current
  useEffect(() => {
    updateCallbackRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  useEffect(() => {
    if (!user?.id) return;

    // Create a single channel for all progress tracking
    const channel = supabase
      .channel('tao-progress-tracker')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'breath_sessions',
          filter: `user_id=eq.${user.id}`
        },
        async () => {
          // Count breath sessions for this user
          const { count } = await supabase
            .from('breath_sessions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          updateCallbackRef.current({ breathSessions: count || 0 });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mirror_journal_entries',
          filter: `user_id=eq.${user.id}`
        },
        async () => {
          // Count journal entries for this user
          const { count } = await supabase
            .from('mirror_journal_entries')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          updateCallbackRef.current({ journalEntries: count || 0 });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'meditation_sessions',
          filter: `user_id=eq.${user.id}`
        },
        async () => {
          // Sum meditation minutes for this user
          const { data } = await supabase
            .from('meditation_sessions')
            .select('actual_duration')
            .eq('user_id', user.id);
          
          const totalMinutes = data?.reduce((sum, session) => sum + (session.actual_duration || 0), 0) || 0;
          updateCallbackRef.current({ meditationMinutes: totalMinutes });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'personal_codex_entries',
          filter: `user_id=eq.${user.id}`
        },
        async () => {
          // Count codex entries for this user
          const { count } = await supabase
            .from('personal_codex_entries')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          updateCallbackRef.current({ codeEntries: count || 0 });
        }
      )
      .subscribe();

    // Initial data fetch when component mounts
    const fetchInitialProgress = async () => {
      try {
        const [breathResult, journalResult, meditationResult, codexResult] = await Promise.all([
          supabase.from('breath_sessions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('mirror_journal_entries').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('meditation_sessions').select('actual_duration').eq('user_id', user.id),
          supabase.from('personal_codex_entries').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
        ]);

        const totalMeditationMinutes = meditationResult.data?.reduce((sum, session) => sum + (session.actual_duration || 0), 0) || 0;

        const initialProgress: ProgressUpdates = {
          breathSessions: breathResult.count || 0,
          journalEntries: journalResult.count || 0,
          meditationMinutes: totalMeditationMinutes,
          circleParticipation: 0, // Will implement when circle system is built
          codeEntries: codexResult.count || 0
        };

        updateCallbackRef.current(initialProgress);
      } catch (error) {
        console.error('Error fetching initial progress:', error);
      }
    };

    fetchInitialProgress();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
};
