import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { TarotCardData } from '../types';

interface JournalLog {
  card_id: number;
  is_reversed: boolean;
  interpretation?: string;
}

export const useTarotJournal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const addLog = async ({ card_id, is_reversed, interpretation }: JournalLog) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to save a journal entry.',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('tarot_journal_logs').insert({
        user_id: user.id,
        card_id,
        is_reversed,
        interpretation,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Your tarot pull has been logged to your Mirror Journal.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error saving log',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  return { addLog, loading };
};
