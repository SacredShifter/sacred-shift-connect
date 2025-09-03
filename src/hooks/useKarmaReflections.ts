import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface KarmaReflection {
  id: string;
  user_id: string;
  event: string;
  reflection: string;
  outcome: 'positive' | 'negative' | 'neutral';
  tags: string[];
  linked_modules: string[];
  created_at: string;
  updated_at: string;
}

export const useKarmaReflections = (userId: string) => {
  const [reflections, setReflections] = useState<KarmaReflection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReflections = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('karma_reflections' as any)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReflections((data as any) || []);
    } catch (error) {
      console.error('Error fetching karma reflections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addReflection = async (
    event: string,
    reflection: string,
    outcome: 'positive' | 'negative' | 'neutral',
    tags: string[] = [],
    linkedModules: string[] = []
  ) => {
    if (!userId) return null;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('karma_reflections' as any)
        .insert({
          user_id: userId,
          event,
          reflection,
          outcome,
          tags,
          linked_modules: linkedModules
        })
        .select()
        .single();

      if (error) throw error;
      
      setReflections(prev => [data as any, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding karma reflection:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getKarmicBalance = () => {
    return reflections.reduce((balance, reflection) => {
      switch (reflection.outcome) {
        case 'positive': return balance + 1;
        case 'negative': return balance - 1;
        default: return balance;
      }
    }, 0);
  };

  const getFilteredReflections = (outcomeFilter?: string, tagFilter?: string) => {
    return reflections.filter(reflection => {
      const matchesOutcome = !outcomeFilter || reflection.outcome === outcomeFilter;
      const matchesTag = !tagFilter || reflection.tags.includes(tagFilter);
      return matchesOutcome && matchesTag;
    });
  };

  useEffect(() => {
    fetchReflections();
  }, [userId]);

  return {
    reflections,
    isLoading,
    addReflection,
    getKarmicBalance,
    getFilteredReflections,
    refetch: fetchReflections
  };
};