-- Consciousness Tracking System Migration
-- The Sacred Shifter Developer Engineer's consciousness development database

-- 1. Consciousness Profiles Table
CREATE TABLE IF NOT EXISTS consciousness_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  current_level text not null default 'initiate' check (current_level in (
    'initiate', 'seeker', 'student', 'adept', 'practitioner', 'teacher', 
    'master', 'guardian', 'sage', 'enlightened', 'transcendent', 'cosmic'
  )),
  total_points integer not null default 0,
  level_progress numeric(5,2) not null default 0 check (level_progress >= 0 and level_progress <= 100),
  next_level_points integer not null default 100,
  
  -- Consciousness Dimensions (0-100 each)
  awareness numeric(5,2) not null default 20 check (awareness >= 0 and awareness <= 100),
  presence numeric(5,2) not null default 20 check (presence >= 0 and presence <= 100),
  compassion numeric(5,2) not null default 20 check (compassion >= 0 and compassion <= 100),
  wisdom numeric(5,2) not null default 20 check (wisdom >= 0 and wisdom <= 100),
  creativity numeric(5,2) not null default 20 check (creativity >= 0 and creativity <= 100),
  intuition numeric(5,2) not null default 20 check (intuition >= 0 and intuition <= 100),
  integration numeric(5,2) not null default 20 check (integration >= 0 and integration <= 100),
  service numeric(5,2) not null default 20 check (service >= 0 and service <= 100),
  
  -- Learning Preferences
  preferred_content_types text[] default '{"video", "audio"}',
  learning_style text not null default 'visual' check (learning_style in ('visual', 'auditory', 'kinesthetic', 'reading', 'experiential')),
  energy_frequency_preference text not null default '528Hz',
  lunar_phase_preference text not null default 'full' check (lunar_phase_preference in ('new', 'waxing', 'full', 'waning')),
  optimal_learning_times text[] default '{"morning", "evening"}',
  
  -- Journey Tracking
  journey_start_date timestamptz not null default now(),
  last_activity timestamptz not null default now(),
  total_learning_hours numeric(10,2) not null default 0,
  content_consumed integer not null default 0,
  insights_shared integer not null default 0,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  unique(user_id)
);

-- 2. Consciousness Milestones Table
CREATE TABLE IF NOT EXISTS consciousness_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level text not null check (level in (
    'initiate', 'seeker', 'student', 'adept', 'practitioner', 'teacher', 
    'master', 'guardian', 'sage', 'enlightened', 'transcendent', 'cosmic'
  )),
  title text not null,
  description text not null,
  points_required integer not null,
  achieved_at timestamptz,
  celebration_data jsonb default '{}',
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  unique(user_id, level)
);

-- 3. Resonance Scores Table
CREATE TABLE IF NOT EXISTS resonance_scores (
  id uuid primary key default gen_random_uuid(),
  content_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  overall_resonance numeric(5,2) not null check (overall_resonance >= 0 and overall_resonance <= 100),
  consciousness_alignment numeric(5,2) not null check (consciousness_alignment >= 0 and consciousness_alignment <= 100),
  emotional_impact numeric(5,2) not null check (emotional_impact >= 0 and emotional_impact <= 100),
  learning_potential numeric(5,2) not null check (learning_potential >= 0 and learning_potential <= 100),
  spiritual_depth numeric(5,2) not null check (spiritual_depth >= 0 and spiritual_depth <= 100),
  practical_applicability numeric(5,2) not null check (practical_applicability >= 0 and practical_applicability <= 100),
  community_value numeric(5,2) not null check (community_value >= 0 and community_value <= 100),
  
  -- AI Analysis
  ai_insights jsonb default '{}',
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  unique(content_id, user_id)
);

-- 4. Learning Paths Table
CREATE TABLE IF NOT EXISTS learning_paths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  consciousness_level text not null check (consciousness_level in (
    'initiate', 'seeker', 'student', 'adept', 'practitioner', 'teacher', 
    'master', 'guardian', 'sage', 'enlightened', 'transcendent', 'cosmic'
  )),
  total_duration_hours numeric(10,2) not null,
  current_progress numeric(5,2) not null default 0 check (current_progress >= 0 and current_progress <= 100),
  
  -- Sacred Structure
  phases jsonb default '[]',
  prerequisites text[] default '{}',
  outcomes text[] default '{}',
  
  -- Energetic Properties
  energy_frequency text not null default '528Hz',
  chakra_focus text[] default '{}',
  lunar_timing text not null default 'any',
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Wisdom Insights Table
CREATE TABLE IF NOT EXISTS wisdom_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_id text not null,
  insight_text text not null,
  consciousness_level text not null check (consciousness_level in (
    'initiate', 'seeker', 'student', 'adept', 'practitioner', 'teacher', 
    'master', 'guardian', 'sage', 'enlightened', 'transcendent', 'cosmic'
  )),
  user_name text not null,
  user_avatar text,
  likes integer not null default 0,
  is_liked boolean not null default false,
  tags text[] default '{}',
  resonance_score numeric(5,2) not null default 0 check (resonance_score >= 0 and resonance_score <= 100),
  wisdom_type text not null default 'insight' check (wisdom_type in ('insight', 'question', 'practice', 'experience', 'teaching')),
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Wisdom Circles Table
CREATE TABLE IF NOT EXISTS wisdom_circles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  consciousness_level text not null check (consciousness_level in (
    'initiate', 'seeker', 'student', 'adept', 'practitioner', 'teacher', 
    'master', 'guardian', 'sage', 'enlightened', 'transcendent', 'cosmic'
  )),
  member_count integer not null default 0,
  is_member boolean not null default false,
  created_by uuid not null references auth.users(id) on delete cascade,
  topics text[] default '{}',
  energy_frequency text not null default '528Hz',
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Circle Memberships Table
CREATE TABLE IF NOT EXISTS circle_memberships (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references wisdom_circles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  
  unique(circle_id, user_id)
);

-- 8. Content Consumption Tracking Table
CREATE TABLE IF NOT EXISTS content_consumption (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_id text not null,
  duration_minutes numeric(10,2) not null,
  engagement_score numeric(3,2) not null check (engagement_score >= 0 and engagement_score <= 1),
  points_earned integer not null default 0,
  consumed_at timestamptz not null default now(),
  
  unique(user_id, content_id, consumed_at)
);

-- Enable RLS on all tables
ALTER TABLE consciousness_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consciousness_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE resonance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE wisdom_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE wisdom_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_consumption ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consciousness_profiles
CREATE POLICY "Users can view their own consciousness profile" ON consciousness_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own consciousness profile" ON consciousness_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consciousness profile" ON consciousness_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for consciousness_milestones
CREATE POLICY "Users can view their own milestones" ON consciousness_milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own milestones" ON consciousness_milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for resonance_scores
CREATE POLICY "Users can view their own resonance scores" ON resonance_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resonance scores" ON resonance_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resonance scores" ON resonance_scores
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for learning_paths
CREATE POLICY "Users can view their own learning paths" ON learning_paths
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning paths" ON learning_paths
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning paths" ON learning_paths
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for wisdom_insights
CREATE POLICY "Anyone can view wisdom insights" ON wisdom_insights
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own wisdom insights" ON wisdom_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wisdom insights" ON wisdom_insights
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for wisdom_circles
CREATE POLICY "Anyone can view wisdom circles" ON wisdom_circles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert wisdom circles" ON wisdom_circles
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update circles they created" ON wisdom_circles
  FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for circle_memberships
CREATE POLICY "Users can view memberships" ON circle_memberships
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT created_by FROM wisdom_circles WHERE id = circle_id
  ));

CREATE POLICY "Users can join circles" ON circle_memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave circles" ON circle_memberships
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for content_consumption
CREATE POLICY "Users can view their own consumption" ON content_consumption
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consumption" ON content_consumption
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_consciousness_profiles_user_id ON consciousness_profiles(user_id);
CREATE INDEX idx_consciousness_milestones_user_id ON consciousness_milestones(user_id);
CREATE INDEX idx_resonance_scores_user_id ON resonance_scores(user_id);
CREATE INDEX idx_resonance_scores_content_id ON resonance_scores(content_id);
CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_wisdom_insights_content_id ON wisdom_insights(content_id);
CREATE INDEX idx_wisdom_insights_created_at ON wisdom_insights(created_at DESC);
CREATE INDEX idx_circle_memberships_user_id ON circle_memberships(user_id);
CREATE INDEX idx_circle_memberships_circle_id ON circle_memberships(circle_id);
CREATE INDEX idx_content_consumption_user_id ON content_consumption(user_id);
CREATE INDEX idx_content_consumption_content_id ON content_consumption(content_id);

-- Create functions for consciousness tracking
CREATE OR REPLACE FUNCTION update_consciousness_points(
  p_user_id uuid,
  p_points integer,
  p_dimension text DEFAULT NULL,
  p_dimension_points integer DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  current_profile consciousness_profiles%ROWTYPE;
  new_total_points integer;
  new_level text;
  new_level_progress numeric(5,2);
  new_next_level_points integer;
BEGIN
  -- Get current profile
  SELECT * INTO current_profile 
  FROM consciousness_profiles 
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Consciousness profile not found for user %', p_user_id;
  END IF;
  
  -- Calculate new total points
  new_total_points := current_profile.total_points + p_points;
  
  -- Determine new level and progress
  -- This is a simplified calculation - in practice, you'd use the CONSCIOUSNESS_LEVELS mapping
  IF new_total_points >= 3000 THEN
    new_level := 'cosmic';
    new_level_progress := 100;
    new_next_level_points := 3000;
  ELSIF new_total_points >= 2500 THEN
    new_level := 'transcendent';
    new_level_progress := ((new_total_points - 2500)::numeric / 500) * 100;
    new_next_level_points := 3000;
  ELSIF new_total_points >= 2000 THEN
    new_level := 'enlightened';
    new_level_progress := ((new_total_points - 2000)::numeric / 500) * 100;
    new_next_level_points := 2500;
  ELSIF new_total_points >= 1750 THEN
    new_level := 'sage';
    new_level_progress := ((new_total_points - 1750)::numeric / 250) * 100;
    new_next_level_points := 2000;
  ELSIF new_total_points >= 1500 THEN
    new_level := 'guardian';
    new_level_progress := ((new_total_points - 1500)::numeric / 250) * 100;
    new_next_level_points := 1750;
  ELSIF new_total_points >= 1250 THEN
    new_level := 'master';
    new_level_progress := ((new_total_points - 1250)::numeric / 250) * 100;
    new_next_level_points := 1500;
  ELSIF new_total_points >= 1000 THEN
    new_level := 'teacher';
    new_level_progress := ((new_total_points - 1000)::numeric / 250) * 100;
    new_next_level_points := 1250;
  ELSIF new_total_points >= 750 THEN
    new_level := 'practitioner';
    new_level_progress := ((new_total_points - 750)::numeric / 250) * 100;
    new_next_level_points := 1000;
  ELSIF new_total_points >= 500 THEN
    new_level := 'adept';
    new_level_progress := ((new_total_points - 500)::numeric / 250) * 100;
    new_next_level_points := 750;
  ELSIF new_total_points >= 250 THEN
    new_level := 'student';
    new_level_progress := ((new_total_points - 250)::numeric / 250) * 100;
    new_next_level_points := 500;
  ELSIF new_total_points >= 100 THEN
    new_level := 'seeker';
    new_level_progress := ((new_total_points - 100)::numeric / 150) * 100;
    new_next_level_points := 250;
  ELSE
    new_level := 'initiate';
    new_level_progress := (new_total_points::numeric / 100) * 100;
    new_next_level_points := 100;
  END IF;
  
  -- Update profile
  UPDATE consciousness_profiles 
  SET 
    total_points = new_total_points,
    current_level = new_level,
    level_progress = new_level_progress,
    next_level_points = new_next_level_points,
    last_activity = now(),
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Update dimension if specified
  IF p_dimension IS NOT NULL AND p_dimension_points IS NOT NULL THEN
    CASE p_dimension
      WHEN 'awareness' THEN
        UPDATE consciousness_profiles 
        SET awareness = LEAST(100, awareness + p_dimension_points)
        WHERE user_id = p_user_id;
      WHEN 'presence' THEN
        UPDATE consciousness_profiles 
        SET presence = LEAST(100, presence + p_dimension_points)
        WHERE user_id = p_user_id;
      WHEN 'compassion' THEN
        UPDATE consciousness_profiles 
        SET compassion = LEAST(100, compassion + p_dimension_points)
        WHERE user_id = p_user_id;
      WHEN 'wisdom' THEN
        UPDATE consciousness_profiles 
        SET wisdom = LEAST(100, wisdom + p_dimension_points)
        WHERE user_id = p_user_id;
      WHEN 'creativity' THEN
        UPDATE consciousness_profiles 
        SET creativity = LEAST(100, creativity + p_dimension_points)
        WHERE user_id = p_user_id;
      WHEN 'intuition' THEN
        UPDATE consciousness_profiles 
        SET intuition = LEAST(100, intuition + p_dimension_points)
        WHERE user_id = p_user_id;
      WHEN 'integration' THEN
        UPDATE consciousness_profiles 
        SET integration = LEAST(100, integration + p_dimension_points)
        WHERE user_id = p_user_id;
      WHEN 'service' THEN
        UPDATE consciousness_profiles 
        SET service = LEAST(100, service + p_dimension_points)
        WHERE user_id = p_user_id;
    END CASE;
  END IF;
  
  -- Check for level up milestone
  IF new_level != current_profile.current_level THEN
    INSERT INTO consciousness_milestones (user_id, level, title, description, points_required, achieved_at)
    VALUES (p_user_id, new_level, 
            CASE new_level
              WHEN 'seeker' THEN 'Consciousness Seeker'
              WHEN 'student' THEN 'Wisdom Student'
              WHEN 'adept' THEN 'Consciousness Adept'
              WHEN 'practitioner' THEN 'Sacred Practitioner'
              WHEN 'teacher' THEN 'Wisdom Teacher'
              WHEN 'master' THEN 'Consciousness Master'
              WHEN 'guardian' THEN 'Sacred Guardian'
              WHEN 'sage' THEN 'Wisdom Sage'
              WHEN 'enlightened' THEN 'Enlightened Being'
              WHEN 'transcendent' THEN 'Transcendent Consciousness'
              WHEN 'cosmic' THEN 'Cosmic Consciousness'
              ELSE 'Sacred Initiate'
            END,
            'Congratulations on reaching ' || new_level || '!',
            new_total_points,
            now())
    ON CONFLICT (user_id, level) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to track content consumption
CREATE OR REPLACE FUNCTION track_content_consumption(
  p_user_id uuid,
  p_content_id text,
  p_duration_minutes numeric,
  p_engagement_score numeric
)
RETURNS void AS $$
DECLARE
  base_points integer;
  engagement_multiplier numeric;
  total_points integer;
BEGIN
  -- Calculate points based on duration and engagement
  base_points := FLOOR(p_duration_minutes / 5); -- 1 point per 5 minutes
  engagement_multiplier := 1 + (p_engagement_score * 0.5); -- Up to 1.5x multiplier
  total_points := FLOOR(base_points * engagement_multiplier);
  
  -- Add points to consciousness profile
  PERFORM update_consciousness_points(p_user_id, total_points, 'wisdom', FLOOR(total_points * 0.1));
  
  -- Update learning hours and content consumed
  UPDATE consciousness_profiles 
  SET 
    total_learning_hours = total_learning_hours + (p_duration_minutes / 60),
    content_consumed = content_consumed + 1,
    last_activity = now(),
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Record consumption
  INSERT INTO content_consumption (user_id, content_id, duration_minutes, engagement_score, points_earned)
  VALUES (p_user_id, p_content_id, p_duration_minutes, p_engagement_score, total_points);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to share insight
CREATE OR REPLACE FUNCTION share_wisdom_insight(
  p_user_id uuid,
  p_content_id text,
  p_insight_text text,
  p_consciousness_level text,
  p_user_name text,
  p_user_avatar text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  insight_id uuid;
  word_count integer;
  quality_score numeric;
  points integer;
  tags text[];
BEGIN
  -- Calculate insight quality and points
  word_count := array_length(string_to_array(p_insight_text, ' '), 1);
  quality_score := LEAST(1, word_count::numeric / 50); -- Max quality at 50+ words
  points := FLOOR(10 + (quality_score * 20)); -- 10-30 points
  
  -- Extract tags (simplified)
  tags := ARRAY[]::text[];
  IF p_insight_text ILIKE '%meditation%' THEN tags := array_append(tags, 'meditation'); END IF;
  IF p_insight_text ILIKE '%mindfulness%' THEN tags := array_append(tags, 'mindfulness'); END IF;
  IF p_insight_text ILIKE '%breathing%' THEN tags := array_append(tags, 'breathing'); END IF;
  IF p_insight_text ILIKE '%energy%' THEN tags := array_append(tags, 'energy'); END IF;
  IF p_insight_text ILIKE '%chakras%' THEN tags := array_append(tags, 'chakras'); END IF;
  IF p_insight_text ILIKE '%healing%' THEN tags := array_append(tags, 'healing'); END IF;
  IF p_insight_text ILIKE '%presence%' THEN tags := array_append(tags, 'presence'); END IF;
  IF p_insight_text ILIKE '%awareness%' THEN tags := array_append(tags, 'awareness'); END IF;
  IF p_insight_text ILIKE '%consciousness%' THEN tags := array_append(tags, 'consciousness'); END IF;
  IF p_insight_text ILIKE '%spirituality%' THEN tags := array_append(tags, 'spirituality'); END IF;
  IF p_insight_text ILIKE '%wisdom%' THEN tags := array_append(tags, 'wisdom'); END IF;
  IF p_insight_text ILIKE '%beginner%' THEN tags := array_append(tags, 'beginner'); END IF;
  IF p_insight_text ILIKE '%advanced%' THEN tags := array_append(tags, 'advanced'); END IF;
  IF p_insight_text ILIKE '%practice%' THEN tags := array_append(tags, 'practice'); END IF;
  IF p_insight_text ILIKE '%teaching%' THEN tags := array_append(tags, 'teaching'); END IF;
  IF p_insight_text ILIKE '%experience%' THEN tags := array_append(tags, 'experience'); END IF;
  
  -- Calculate resonance score
  DECLARE
    resonance_score numeric := 50; -- Base score
    keyword_count integer := array_length(tags, 1);
  BEGIN
    resonance_score := resonance_score + (keyword_count * 10);
    resonance_score := LEAST(100, resonance_score);
  END;
  
  -- Insert insight
  INSERT INTO wisdom_insights (
    user_id, content_id, insight_text, consciousness_level, 
    user_name, user_avatar, tags, resonance_score
  ) VALUES (
    p_user_id, p_content_id, p_insight_text, p_consciousness_level,
    p_user_name, p_user_avatar, tags, resonance_score
  ) RETURNING id INTO insight_id;
  
  -- Add points for sharing insight
  PERFORM update_consciousness_points(p_user_id, points, 'service', FLOOR(points * 0.2));
  
  -- Update insights shared count
  UPDATE consciousness_profiles 
  SET 
    insights_shared = insights_shared + 1,
    last_activity = now(),
    updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN insight_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
