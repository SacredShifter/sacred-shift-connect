import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JournalLog {
  card_id: number;
  is_reversed: boolean;
  interpretation?: string;
}

export const useTarotJournal = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const addLog = async ({ card_id, is_reversed, interpretation }: JournalLog) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('log-tarot-pull', {
        body: { card_id, is_reversed, interpretation },
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
