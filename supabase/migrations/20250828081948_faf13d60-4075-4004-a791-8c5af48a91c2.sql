-- Fix existing circle_intentions table by adding missing columns
ALTER TABLE circle_intentions 
ADD COLUMN IF NOT EXISTS sigil_url text,
ADD COLUMN IF NOT EXISTS sigil_svg text,
ADD COLUMN IF NOT EXISTS energy_frequency numeric DEFAULT 432.0;

-- Fix existing synchronicity_context table by adding missing columns
ALTER TABLE synchronicity_context 
ADD COLUMN IF NOT EXISTS energy_signature jsonb DEFAULT '{}';

-- Create teaching_prompts table
CREATE TABLE IF NOT EXISTS teaching_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resonance_tag text NOT NULL,
  prompt_text text NOT NULL,
  context_type text DEFAULT 'general',
  context_filter jsonb DEFAULT '{}',
  wisdom_level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  usage_count integer DEFAULT 0,
  last_used_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_teaching_prompts_tag ON teaching_prompts(resonance_tag);

-- Create synchronicity_mirror_readings table
CREATE TABLE IF NOT EXISTS synchronicity_mirror_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  journal_entry_id uuid REFERENCES mirror_journal_entries(id) ON DELETE CASCADE,
  mirror_data jsonb NOT NULL,
  resonance_validation jsonb DEFAULT '{}',
  circle_matches jsonb DEFAULT '{}',
  context_data jsonb DEFAULT '{}',
  teaching_prompt text,
  sealed_at timestamptz DEFAULT now(),
  shared_to text DEFAULT 'private',
  integration_status text DEFAULT 'pending',
  
  CONSTRAINT valid_sharing_option 
    CHECK (shared_to IN ('private', 'codex', 'circle'))
);

-- RLS policies
ALTER TABLE teaching_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE synchronicity_mirror_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view teaching prompts"
  ON teaching_prompts FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage prompts"
  ON teaching_prompts FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can manage their own mirror readings"
  ON synchronicity_mirror_readings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public codex readings viewable by all"
  ON synchronicity_mirror_readings FOR SELECT
  USING (shared_to = 'codex');

-- Function to generate sigil patterns
CREATE OR REPLACE FUNCTION generate_resonance_sigil(tags text[])
RETURNS text AS $$
DECLARE
  sigil_pattern text;
  tag_hash bigint;
BEGIN
  tag_hash := hashtext(array_to_string(tags, ''));
  sigil_pattern := '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="' || (20 + (tag_hash % 20)) || '" 
            fill="none" stroke="hsl(var(--primary))" stroke-width="2"/>
    <circle cx="50" cy="50" r="' || (10 + (tag_hash % 10)) || '" 
            fill="none" stroke="hsl(var(--secondary))" stroke-width="1"/>
  </svg>';
  RETURN sigil_pattern;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger function for resonance counts refresh
CREATE OR REPLACE FUNCTION trigger_refresh_resonance_counts()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('refresh_resonance', '');
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger on mirror journal entries
DROP TRIGGER IF EXISTS refresh_resonance_on_journal_change ON mirror_journal_entries;
CREATE TRIGGER refresh_resonance_on_journal_change
  AFTER INSERT OR UPDATE OR DELETE ON mirror_journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION trigger_refresh_resonance_counts();

-- Insert sample teaching prompts
INSERT INTO teaching_prompts (resonance_tag, prompt_text, wisdom_level) VALUES
('Freedom', 'Freedom isn''t only release, it''s trust. Notice where you still grip control.', 2),
('Freedom', 'Freedom appears when you choose presence over fear.', 1),
('Release', 'Release is the doorway to renewal. What weight can you set down today?', 2),
('Trust', 'Trust begins where certainty ends. Can you sit in the unknown?', 3),
('Clarity', 'Clarity is not found, it''s revealed. Where are you willing to let the fog burn off?', 2),
('Compassion', 'Compassion grows when you include yourself. Where do you need your own kindness?', 2),
('Transformation', 'Every ending is a doorway. What new identity calls you through this change?', 3),
('Surrender', 'Surrender is not giving up, it''s giving over to what wants to emerge.', 4),
('Love', 'Love is the recognition of yourself in all beings. Where do you withhold this truth?', 5),
('Wisdom', 'Wisdom whispers before it shouts. What quiet knowing have you been ignoring?', 4),
('Growth', 'Growth happens in the space between who you were and who you''re becoming.', 3),
('Balance', 'Balance is not stillness, it''s the dance between opposing forces.', 2),
('Healing', 'Healing occurs when you allow what is broken to reveal its hidden wholeness.', 4),
('Purpose', 'Your purpose isn''t what you do, it''s how you show up while doing it.', 3),
('Joy', 'Joy is not the absence of struggle, it''s the presence of meaning within it.', 2)
ON CONFLICT DO NOTHING;

-- Insert sample synchronicity context for today
INSERT INTO synchronicity_context (context_date, context_type, title, description, resonance_tags) VALUES
(CURRENT_DATE, 'astrological', 'Cosmic Alignment for Truth', 'The celestial energies support deep introspection and truth-seeking. Perfect time for mirror work.', ARRAY['truth', 'clarity', 'wisdom']),
(CURRENT_DATE, 'historical', 'Transformational Currents', 'Historical patterns show this is a day of breakthrough and revelation across cultures.', ARRAY['transformation', 'breakthrough', 'revelation'])
ON CONFLICT (context_date, context_type, title) DO NOTHING;