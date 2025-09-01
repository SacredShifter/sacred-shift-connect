-- Add entry_mode column to mirror_journal_entries table
ALTER TABLE public.mirror_journal_entries 
ADD COLUMN entry_mode TEXT DEFAULT 'stream';