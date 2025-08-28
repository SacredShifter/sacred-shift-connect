import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SacredJournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  entry_mode?: 'stream' | 'reflection' | 'transmutation' | 'integration';
  resonance_tags?: string[];
  voice_transcription?: boolean;
  is_draft?: boolean;
  mood_tag?: string;
  chakra_alignment?: string;
  created_at: string;
  updated_at: string;
}

export interface NewSacredJournalEntry {
  title: string;
  content: string;
  entry_mode?: 'stream' | 'reflection' | 'transmutation' | 'integration';
  resonance_tags?: string[];
  voice_transcription?: boolean;
  is_draft?: boolean;
}

export const useSacredJournal = () => {
  const [entries, setEntries] = useState<SacredJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEntries = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('mirror_journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      setError('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createEntry = useCallback(async (newEntry: NewSacredJournalEntry) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setError(null);
      const { data, error: createError } = await supabase
        .from('mirror_journal_entries')
        .insert({
          ...newEntry,
          user_id: user.id,
          mood_tag: Array.isArray(newEntry.resonance_tags) ? newEntry.resonance_tags[0] : null,
          chakra_alignment: newEntry.entry_mode || null
        })
        .select()
        .single();

      if (createError) throw createError;
      
      setEntries(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating journal entry:', err);
      setError('Failed to create journal entry');
      throw err;
    }
  }, [user]);

  const updateEntry = useCallback(async (id: string, updates: Partial<NewSacredJournalEntry>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setError(null);
      const { data, error: updateError } = await supabase
        .from('mirror_journal_entries')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString(),
          mood_tag: Array.isArray(updates.resonance_tags) ? updates.resonance_tags[0] : undefined,
          chakra_alignment: updates.entry_mode || undefined
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setEntries(prev => prev.map(entry => 
        entry.id === id ? data : entry
      ));
      return data;
    } catch (err) {
      console.error('Error updating journal entry:', err);
      setError('Failed to update journal entry');
      throw err;
    }
  }, [user]);

  const deleteEntry = useCallback(async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('mirror_journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (err) {
      console.error('Error deleting journal entry:', err);
      setError('Failed to delete journal entry');
      throw err;
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('sacred-journal-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mirror_journal_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEntries(prev => [payload.new as SacredJournalEntry, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setEntries(prev => prev.map(entry => 
              entry.id === payload.new.id ? payload.new as SacredJournalEntry : entry
            ));
          } else if (payload.eventType === 'DELETE') {
            setEntries(prev => prev.filter(entry => entry.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries
  };
};