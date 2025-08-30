-- Create Shadow Path extensions to the Sacred Shifter system

-- Add Shadow Path seals to the existing sacred_lineage_seals table
INSERT INTO public.sacred_lineage_seals (
  seal_name, seal_order, geometry_type, color_signature, icon_name,
  oath_text, blessing_text, description_text,
  minimum_routines, requires_module_diversity, requires_community_contribution,
  requires_streak_days, requires_journal_entries, requires_circle_leadership,
  esoteric_unlock_level
) VALUES 
-- Shadow Path Seals
('Witness Seal', 1, 'triangle', 'hsl(280, 30%, 40%)', 'Eye', 
 'I witness my resistance without judgment', 
 'In acknowledgment, you find the first light in darkness',
 'Earned by acknowledging inability to practice 3 times. Every witness moment is sacred.',
 0, false, false, 0, 0, false, 1),

('Shadowwalker Seal', 2, 'hexagon', 'hsl(260, 40%, 35%)', 'Moon', 
 'I walk with my shadows as teachers', 
 'Your resistance carries wisdom that completion cannot teach',
 'Earned by reflecting on resistance 7 times. Shadow work is soul work.',
 0, false, false, 0, 7, false, 2),

('Resilience Seal', 3, 'octagon', 'hsl(300, 35%, 45%)', 'Phoenix', 
 'I return to the path with compassion', 
 'Every return is a rebirth, every comeback is courage incarnate',
 'Earned by returning after a 3+ day gap. The comeback is the completion.',
 0, false, false, 0, 0, false, 2),

('Supporter Seal', 4, 'star', 'hsl(240, 45%, 50%)', 'Heart', 
 'I hold space for others when I cannot hold my own practice', 
 'In lifting others, you discover your own unshakeable strength',
 'Earned by encouraging others 5 times. Community care is self-care.',
 0, false, true, 0, 0, false, 3),

('Silent Seal', 5, 'circle', 'hsl(320, 25%, 30%)', 'Pause', 
 'I honor the wisdom found in stillness', 
 'In silence, you discovered what sound could never teach',
 'Earned by reflecting on absence after missing 7 routines. Silence is sacred.',
 0, false, false, 0, 1, false, 3);

-- Create resistance logs table
CREATE TABLE public.resistance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  log_type TEXT NOT NULL CHECK (log_type IN ('skip_acknowledgment', 'resistance_reflection', 'return_after_gap', 'silence_reflection')),
  reason TEXT,
  emotional_state TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  gap_days INTEGER DEFAULT 0,
  reflection_content TEXT
);

-- Enable RLS
ALTER TABLE public.resistance_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for resistance logs
CREATE POLICY "Users can manage their own resistance logs" 
ON public.resistance_logs 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create micro practices table
CREATE TABLE public.micro_practices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  practice_name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 30,
  practice_type TEXT NOT NULL CHECK (practice_type IN ('breath', 'journal', 'visual', 'movement', 'sound')),
  instructions TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Sparkles',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.micro_practices ENABLE ROW LEVEL SECURITY;

-- Create policies for micro practices
CREATE POLICY "Anyone can view active micro practices" 
ON public.micro_practices 
FOR SELECT 
USING (is_active = true);

-- Insert default micro practices
INSERT INTO public.micro_practices (practice_name, description, duration_seconds, practice_type, instructions, icon_name) VALUES
('Sacred Breath', 'One conscious breath to center yourself', 30, 'breath', 'Breathe in slowly for 4 counts, hold for 4, exhale for 6. Feel your connection to life force.', 'Wind'),
('Micro Journal', 'Write one line of truth', 60, 'journal', 'Complete this sentence: "Right now, I am feeling..." Write whatever comes up without editing.', 'PenTool'),
('Grove Glimpse', 'Receive one image from the Sacred Grove', 15, 'visual', 'Open your inner eye and let one image, color, or symbol arise from the Grove. Simply witness it.', 'Eye'),
('Body Check', 'Feel one part of your body', 30, 'movement', 'Place your hand on your heart or belly. Feel the aliveness there. Send gratitude to that part of you.', 'Heart'),
('Sacred Sound', 'Make one sound from your soul', 30, 'sound', 'Hum, sigh, or vocalize whatever sound wants to emerge. Let it carry what words cannot.', 'Volume2');

-- Create user practice preferences table
CREATE TABLE public.user_practice_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  practice_pace TEXT NOT NULL DEFAULT 'gentle' CHECK (practice_pace IN ('gentle', 'moderate', 'intensive')),
  spiritual_lens TEXT NOT NULL DEFAULT 'scientific' CHECK (spiritual_lens IN ('scientific', 'metaphysical', 'esoteric')),
  trauma_safe_mode BOOLEAN DEFAULT true,
  micro_practices_enabled BOOLEAN DEFAULT true,
  shadow_path_enabled BOOLEAN DEFAULT true,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_practice_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user practice preferences
CREATE POLICY "Users can manage their own practice preferences" 
ON public.user_practice_preferences 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create micro practice completions table
CREATE TABLE public.micro_practice_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  micro_practice_id UUID NOT NULL REFERENCES public.micro_practices(id),
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reflection_notes TEXT,
  emotional_state_before TEXT,
  emotional_state_after TEXT
);

-- Enable RLS
ALTER TABLE public.micro_practice_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for micro practice completions
CREATE POLICY "Users can manage their own micro practice completions" 
ON public.micro_practice_completions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Update the calculate_sacred_progress function to include Shadow Path metrics
CREATE OR REPLACE FUNCTION public.calculate_sacred_progress(p_user_id uuid)
RETURNS TABLE(
  total_routines integer, 
  unique_module_types integer, 
  current_streak integer, 
  longest_streak integer, 
  community_contributions integer, 
  journal_entries integer, 
  circles_leadership integer,
  module_diversity_score numeric, 
  consistency_score numeric, 
  leadership_score numeric,
  -- Shadow Path metrics
  resistance_acknowledgments integer,
  resistance_reflections integer,
  comeback_count integer,
  support_given_count integer,
  silence_reflections integer,
  micro_practices_completed integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
DECLARE
    v_total_routines INTEGER := 0;
    v_unique_modules INTEGER := 0;
    v_current_streak INTEGER := 0;
    v_longest_streak INTEGER := 0;
    v_community_posts INTEGER := 0;
    v_journal_entries INTEGER := 0;
    v_circles_leadership INTEGER := 0;
    v_diversity_score DECIMAL := 0.00;
    v_consistency_score DECIMAL := 0.00;
    v_leadership_score DECIMAL := 0.00;
    v_last_routine_date DATE;
    v_days_since_last INTEGER;
    -- Shadow Path variables
    v_resistance_acknowledgments INTEGER := 0;
    v_resistance_reflections INTEGER := 0;
    v_comeback_count INTEGER := 0;
    v_support_given_count INTEGER := 0;
    v_silence_reflections INTEGER := 0;
    v_micro_practices_completed INTEGER := 0;
BEGIN
    -- Existing Light Path calculations
    SELECT COUNT(*), MAX(completed_at::DATE)
    INTO v_total_routines, v_last_routine_date
    FROM routine_completion_logs 
    WHERE user_id = p_user_id AND modules_completed >= 3;
    
    SELECT COUNT(DISTINCT unnest(modules_completed))
    INTO v_unique_modules
    FROM routine_completion_logs 
    WHERE user_id = p_user_id AND modules_completed >= 3;
    
    -- Current streak calculation (existing logic)
    WITH daily_completions AS (
        SELECT completed_at::DATE as completion_date
        FROM routine_completion_logs 
        WHERE user_id = p_user_id AND modules_completed >= 3
        GROUP BY completed_at::DATE
        ORDER BY completed_at::DATE DESC
    ),
    streak_calc AS (
        SELECT completion_date,
               completion_date - (ROW_NUMBER() OVER (ORDER BY completion_date DESC))::INTEGER as streak_group
        FROM daily_completions
    )
    SELECT COUNT(*)
    INTO v_current_streak
    FROM streak_calc
    WHERE streak_group = (
        SELECT streak_group 
        FROM streak_calc 
        WHERE completion_date = CURRENT_DATE - INTERVAL '0 days'
        OR completion_date = CURRENT_DATE - INTERVAL '1 days'
        LIMIT 1
    );
    
    v_days_since_last := COALESCE(CURRENT_DATE - v_last_routine_date, 999);
    IF v_days_since_last > 2 THEN
        v_current_streak := 0;
    END IF;
    
    -- Existing community and journal calculations
    SELECT COUNT(*)
    INTO v_community_posts
    FROM circle_posts 
    WHERE author_id = p_user_id;
    
    SELECT COUNT(*)
    INTO v_journal_entries
    FROM (
        SELECT id FROM personal_codex_entries WHERE user_id = p_user_id
        UNION ALL
        SELECT id FROM mirror_journal_entries WHERE user_id = p_user_id
    ) combined_entries;
    
    SELECT COUNT(*)
    INTO v_circles_leadership
    FROM sacred_circles sc
    WHERE sc.created_by = p_user_id
    AND (
        SELECT COUNT(*) 
        FROM circle_memberships cm 
        WHERE cm.circle_id = sc.id AND cm.status = 'active'
    ) >= 5;
    
    -- Shadow Path calculations
    SELECT COUNT(*)
    INTO v_resistance_acknowledgments
    FROM resistance_logs
    WHERE user_id = p_user_id AND log_type = 'skip_acknowledgment';
    
    SELECT COUNT(*)
    INTO v_resistance_reflections
    FROM resistance_logs
    WHERE user_id = p_user_id AND log_type = 'resistance_reflection';
    
    SELECT COUNT(*)
    INTO v_comeback_count
    FROM resistance_logs
    WHERE user_id = p_user_id AND log_type = 'return_after_gap';
    
    -- Support given count (encouragement posts in circles)
    SELECT COUNT(*)
    INTO v_support_given_count
    FROM circle_posts
    WHERE author_id = p_user_id 
    AND (content ILIKE '%encourage%' OR content ILIKE '%support%' OR content ILIKE '%you can%');
    
    SELECT COUNT(*)
    INTO v_silence_reflections
    FROM resistance_logs
    WHERE user_id = p_user_id AND log_type = 'silence_reflection';
    
    SELECT COUNT(*)
    INTO v_micro_practices_completed
    FROM micro_practice_completions
    WHERE user_id = p_user_id;
    
    -- Calculate derived scores (including Shadow Path contributions)
    v_diversity_score := LEAST(100.00, (v_unique_modules * 20.0) + (v_micro_practices_completed * 0.5));
    v_consistency_score := CASE 
        WHEN v_total_routines = 0 AND v_micro_practices_completed = 0 THEN 0.00
        ELSE LEAST(100.00, (v_current_streak * 5.0) + (v_total_routines * 0.1) + (v_micro_practices_completed * 0.2))
    END;
    v_leadership_score := (v_circles_leadership * 25.0) + (v_community_posts * 2.0) + (v_support_given_count * 3.0);
    
    RETURN QUERY SELECT 
        v_total_routines, v_unique_modules, v_current_streak, v_longest_streak,
        v_community_posts, v_journal_entries, v_circles_leadership,
        v_diversity_score, v_consistency_score, v_leadership_score,
        v_resistance_acknowledgments, v_resistance_reflections, v_comeback_count,
        v_support_given_count, v_silence_reflections, v_micro_practices_completed;
END;
$function$;

-- Update the check_and_award_sacred_seals function to include Shadow Path logic
CREATE OR REPLACE FUNCTION public.check_and_award_sacred_seals(p_user_id uuid)
RETURNS TABLE(newly_awarded_seal text, ceremony_required boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
DECLARE
    v_progress RECORD;
    v_seal RECORD;
    v_already_has_seal BOOLEAN;
    v_meets_requirements BOOLEAN;
    v_conditions_snapshot JSONB;
    v_newly_awarded TEXT := NULL;
BEGIN
    -- Get current user progress (now includes Shadow Path metrics)
    SELECT * INTO v_progress FROM public.calculate_sacred_progress(p_user_id) LIMIT 1;
    
    -- Check each seal in order
    FOR v_seal IN 
        SELECT * FROM public.sacred_lineage_seals ORDER BY seal_order ASC
    LOOP
        -- Check if user already has this seal
        SELECT EXISTS(
            SELECT 1 FROM public.user_sacred_initiations 
            WHERE user_id = p_user_id AND seal_id = v_seal.id
        ) INTO v_already_has_seal;
        
        IF NOT v_already_has_seal THEN
            -- Check if user meets requirements
            v_meets_requirements := TRUE;
            
            -- Shadow Path seal requirements
            IF v_seal.seal_name = 'Witness Seal' THEN
                IF v_progress.resistance_acknowledgments < 3 THEN
                    v_meets_requirements := FALSE;
                END IF;
            ELSIF v_seal.seal_name = 'Shadowwalker Seal' THEN
                IF v_progress.resistance_reflections < 7 THEN
                    v_meets_requirements := FALSE;
                END IF;
            ELSIF v_seal.seal_name = 'Resilience Seal' THEN
                IF v_progress.comeback_count < 1 THEN
                    v_meets_requirements := FALSE;
                END IF;
            ELSIF v_seal.seal_name = 'Supporter Seal' THEN
                IF v_progress.support_given_count < 5 THEN
                    v_meets_requirements := FALSE;
                END IF;
            ELSIF v_seal.seal_name = 'Silent Seal' THEN
                IF v_progress.silence_reflections < 1 THEN
                    v_meets_requirements := FALSE;
                END IF;
            ELSE
                -- Original Light Path seal requirements
                IF v_progress.total_routines < v_seal.minimum_routines THEN
                    v_meets_requirements := FALSE;
                END IF;
                
                IF v_seal.requires_module_diversity AND v_progress.unique_module_types < 2 THEN
                    v_meets_requirements := FALSE;
                END IF;
                
                IF v_seal.requires_community_contribution AND v_progress.community_contributions < 10 THEN
                    v_meets_requirements := FALSE;
                END IF;
                
                IF v_seal.requires_streak_days > 0 AND v_progress.current_streak < v_seal.requires_streak_days THEN
                    v_meets_requirements := FALSE;
                END IF;
                
                IF v_seal.requires_journal_entries > 0 AND v_progress.journal_entries < v_seal.requires_journal_entries THEN
                    v_meets_requirements := FALSE;
                END IF;
                
                IF v_seal.requires_circle_leadership AND v_progress.circles_leadership < 1 THEN
                    v_meets_requirements := FALSE;
                END IF;
            END IF;
            
            -- Award seal if requirements are met
            IF v_meets_requirements THEN
                -- Create conditions snapshot (now includes Shadow Path data)
                v_conditions_snapshot := jsonb_build_object(
                    'total_routines', v_progress.total_routines,
                    'unique_modules', v_progress.unique_module_types,
                    'current_streak', v_progress.current_streak,
                    'community_contributions', v_progress.community_contributions,
                    'journal_entries', v_progress.journal_entries,
                    'circles_leadership', v_progress.circles_leadership,
                    'resistance_acknowledgments', v_progress.resistance_acknowledgments,
                    'resistance_reflections', v_progress.resistance_reflections,
                    'comeback_count', v_progress.comeback_count,
                    'support_given_count', v_progress.support_given_count,
                    'silence_reflections', v_progress.silence_reflections,
                    'micro_practices_completed', v_progress.micro_practices_completed,
                    'awarded_timestamp', extract(epoch from now())
                );
                
                -- Award the seal
                INSERT INTO public.user_sacred_initiations (
                    user_id, seal_id, conditions_snapshot, ceremony_completed
                ) VALUES (
                    p_user_id, v_seal.id, v_conditions_snapshot, FALSE
                );
                
                -- Log the trigger event
                INSERT INTO public.initiation_trigger_log (
                    user_id, seal_name, trigger_event, conditions_met, seal_awarded
                ) VALUES (
                    p_user_id, v_seal.seal_name, 'automatic_check', v_conditions_snapshot, TRUE
                );
                
                v_newly_awarded := v_seal.seal_name;
                
                -- Return the first newly awarded seal
                RETURN QUERY SELECT v_newly_awarded, TRUE;
                RETURN;
            END IF;
        END IF;
    END LOOP;
    
    -- No new seals awarded
    RETURN QUERY SELECT v_newly_awarded, FALSE;
END;
$function$;