-- Justice YouTube Automation System - Foundation Schema
-- Step 1: Create new tables for YouTube pipeline

-- 1. Taxonomy (controlled vocabulary for content categorization)
CREATE TABLE IF NOT EXISTS taxonomy (
  id bigserial primary key,
  kind text not null check (kind in ('theme','tone','module','circle','visual_style','content_type')),
  key text not null,
  label text not null,
  description text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(kind, key)
);

-- Enable RLS on taxonomy
ALTER TABLE taxonomy ENABLE ROW LEVEL SECURITY;

-- Taxonomy policies
CREATE POLICY "Anyone can read taxonomy" ON taxonomy
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage taxonomy" ON taxonomy
  FOR ALL USING (auth.role() = 'service_role');

-- 2. Content seeds (captured from Sacred Shifter events)
CREATE TABLE IF NOT EXISTS content_seeds (
  id uuid primary key default gen_random_uuid(),
  source_type text not null, -- 'journal','circle_post','ritual','dashboard','codex'
  source_id text not null,
  user_id uuid, -- nullable for system-generated seeds
  module text not null, -- 'meditation','dreamscape','resonance_tech','astrology'
  circle_id text, -- optional external reference
  tags text[] default '{}',
  summary text not null,
  raw_payload jsonb not null,
  sensitivity_level int not null default 0, -- 0=public, 1=sensitive, 2=private
  tri_law_status text not null default 'pending', -- pending|approved|held|rejected
  tri_law_notes text,
  justice_processed boolean not null default false,
  resonance_score numeric default 0.5, -- initial resonance prediction
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on content_seeds
ALTER TABLE content_seeds ENABLE ROW LEVEL SECURITY;

-- Content seeds policies
CREATE POLICY "Users can view their own seeds" ON content_seeds
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can manage all seeds" ON content_seeds
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can view all seeds" ON content_seeds
  FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Indexes for content_seeds
CREATE INDEX content_seeds_created_at_idx ON content_seeds (created_at);
CREATE INDEX content_seeds_tri_law_status_idx ON content_seeds (tri_law_status);
CREATE INDEX content_seeds_module_idx ON content_seeds (module);
CREATE INDEX content_seeds_justice_processed_idx ON content_seeds (justice_processed);

-- 3. Content plans (Justice's script and outline generation)
CREATE TABLE IF NOT EXISTS content_plans (
  id uuid primary key default gen_random_uuid(),
  seed_id uuid not null references content_seeds(id) on delete cascade,
  intent text not null check (intent in ('teach','ritual','inspire','teaser','guide')),
  target_form text not null check (target_form in ('short','long','podcast','interactive')),
  target_duration_seconds int, -- planned duration
  outline jsonb not null, -- structured outline bullets
  script_md text not null, -- markdown script
  visual_style text default 'cosmic', -- cosmic|nature|geometric|minimal
  tone text default 'calm', -- calm|energetic|mystical|playful
  status text not null default 'draft', -- draft|approved|held|rejected|published
  approval_notes text,
  confidence_score numeric default 0.7, -- Justice's confidence in the plan
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on content_plans
ALTER TABLE content_plans ENABLE ROW LEVEL SECURITY;

-- Content plans policies  
CREATE POLICY "Users can view plans for their seeds" ON content_plans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM content_seeds 
      WHERE content_seeds.id = content_plans.seed_id 
      AND (content_seeds.user_id = auth.uid() OR content_seeds.user_id IS NULL)
    )
  );

CREATE POLICY "Service role can manage all plans" ON content_plans
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage all plans" ON content_plans
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Indexes for content_plans
CREATE INDEX content_plans_seed_id_idx ON content_plans (seed_id);
CREATE INDEX content_plans_status_idx ON content_plans (status);
CREATE INDEX content_plans_created_at_idx ON content_plans (created_at);

-- 4. Media assets (generated content components)
CREATE TABLE IF NOT EXISTS media_assets (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references content_plans(id) on delete cascade,
  type text not null check (type in ('vo','music','broll','overlay','thumb','caption','sigil')),
  storage_path text not null, -- path in Supabase storage
  duration_ms int, -- for audio/video assets
  dimensions jsonb, -- {width: 1920, height: 1080} for visuals
  checksum text, -- for cache validation
  license_ref text, -- licensing info if applicable
  generation_params jsonb default '{}', -- params used to generate
  quality_score numeric default 1.0,
  created_at timestamptz not null default now()
);

-- Enable RLS on media_assets
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Media assets policies
CREATE POLICY "Users can view assets for their plans" ON media_assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM content_plans cp
      JOIN content_seeds cs ON cs.id = cp.seed_id
      WHERE cp.id = media_assets.plan_id
      AND (cs.user_id = auth.uid() OR cs.user_id IS NULL)
    )
  );

CREATE POLICY "Service role can manage all assets" ON media_assets
  FOR ALL USING (auth.role() = 'service_role');

-- Index for media_assets
CREATE INDEX media_assets_plan_id_idx ON media_assets (plan_id);
CREATE INDEX media_assets_type_idx ON media_assets (type);

-- 5. Render jobs (video assembly pipeline)
CREATE TABLE IF NOT EXISTS render_jobs (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references content_plans(id) on delete cascade,
  preset text not null check (preset in ('shorts_9x16','long_16x9','square_1x1','story_9x16')),
  edl jsonb not null, -- Edit Decision List (timeline specification)
  status text not null default 'queued', -- queued|running|done|failed|cancelled
  progress_pct numeric default 0,
  output_paths text[] default '{}', -- where rendered files are stored
  render_log text, -- ffmpeg logs and debug info
  render_time_ms int, -- how long rendering took
  file_size_bytes bigint, -- output file size
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Enable RLS on render_jobs
ALTER TABLE render_jobs ENABLE ROW LEVEL SECURITY;

-- Render jobs policies
CREATE POLICY "Users can view their render jobs" ON render_jobs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM content_plans cp
      JOIN content_seeds cs ON cs.id = cp.seed_id  
      WHERE cp.id = render_jobs.plan_id
      AND (cs.user_id = auth.uid() OR cs.user_id IS NULL)
    )
  );

CREATE POLICY "Service role can manage all render jobs" ON render_jobs
  FOR ALL USING (auth.role() = 'service_role');

-- Indexes for render_jobs
CREATE INDEX render_jobs_plan_id_idx ON render_jobs (plan_id);
CREATE INDEX render_jobs_status_idx ON render_jobs (status);
CREATE INDEX render_jobs_created_at_idx ON render_jobs (created_at);

-- 6. YouTube publish records
CREATE TABLE IF NOT EXISTS yt_publish (
  id uuid primary key default gen_random_uuid(),
  render_job_id uuid not null references render_jobs(id) on delete cascade,
  youtube_video_id text, -- YouTube's video ID after upload
  playlist_id text, -- YouTube playlist ID  
  visibility text not null default 'unlisted', -- public|unlisted|private
  title text not null,
  description text not null,
  tags text[] default '{}',
  category_id int default 22, -- People & Blogs
  thumb_path text, -- thumbnail storage path
  upload_status text not null default 'queued', -- queued|uploading|processing|done|failed
  publish_error text,
  youtube_url text, -- full video URL
  scheduled_for timestamptz, -- if scheduled publishing
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on yt_publish
ALTER TABLE yt_publish ENABLE ROW LEVEL SECURITY;

-- YouTube publish policies
CREATE POLICY "Users can view their YouTube publishes" ON yt_publish
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM render_jobs rj
      JOIN content_plans cp ON cp.id = rj.plan_id
      JOIN content_seeds cs ON cs.id = cp.seed_id
      WHERE rj.id = yt_publish.render_job_id
      AND (cs.user_id = auth.uid() OR cs.user_id IS NULL)
    )
  );

CREATE POLICY "Service role can manage all YouTube publishes" ON yt_publish
  FOR ALL USING (auth.role() = 'service_role');

-- Indexes for yt_publish
CREATE INDEX yt_publish_render_job_id_idx ON yt_publish (render_job_id);
CREATE INDEX yt_publish_upload_status_idx ON yt_publish (upload_status);
CREATE INDEX yt_publish_youtube_video_id_idx ON yt_publish (youtube_video_id);

-- 7. Resonance metrics (round-trip analytics)
CREATE TABLE IF NOT EXISTS resonance_metrics (
  id bigserial primary key,
  youtube_video_id text not null,
  window text not null check (window in ('d1','d7','d30','d90')), -- time window
  -- YouTube metrics
  yt_views bigint default 0,
  yt_watch_time_minutes numeric default 0,
  yt_avg_view_duration_seconds numeric default 0,
  yt_avg_view_percentage numeric default 0,
  yt_click_through_rate numeric default 0,
  yt_subscribers_gained int default 0,
  yt_likes int default 0,
  yt_comments int default 0,
  yt_shares int default 0,
  -- Sacred Shifter metrics  
  ss_journal_events int default 0, -- journals written after watching
  ss_ritual_starts int default 0, -- rituals initiated after watching
  ss_circle_coherence_delta numeric default 0, -- coherence change in related circles
  ss_resonance_votes int default 0, -- user resonance feedback
  ss_saves int default 0, -- times saved to personal collections
  -- Composite scores
  resonance_score numeric, -- calculated composite resonance
  authenticity_score numeric, -- how "true" the content feels
  transformation_score numeric, -- measurable growth impact
  collected_at timestamptz not null default now(),
  unique(youtube_video_id, window)
);

-- Enable RLS on resonance_metrics
ALTER TABLE resonance_metrics ENABLE ROW LEVEL SECURITY;

-- Resonance metrics policies
CREATE POLICY "Anyone can view resonance metrics" ON resonance_metrics
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage resonance metrics" ON resonance_metrics
  FOR ALL USING (auth.role() = 'service_role');

-- Indexes for resonance_metrics
CREATE INDEX resonance_metrics_youtube_video_id_idx ON resonance_metrics (youtube_video_id, window);
CREATE INDEX resonance_metrics_collected_at_idx ON resonance_metrics (collected_at);
CREATE INDEX resonance_metrics_resonance_score_idx ON resonance_metrics (resonance_score);

-- 8. Justice configuration
CREATE TABLE IF NOT EXISTS justice_config (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default now()
);

-- Enable RLS on justice_config
ALTER TABLE justice_config ENABLE ROW LEVEL SECURITY;

-- Justice config policies
CREATE POLICY "Service role can manage justice config" ON justice_config
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can view justice config" ON justice_config
  FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

-- 9. Update existing platform_events table to support Justice processing
ALTER TABLE platform_events ADD COLUMN IF NOT EXISTS justice_processed boolean DEFAULT false;
ALTER TABLE platform_events ADD COLUMN IF NOT EXISTS justice_processed_at timestamptz;
ALTER TABLE platform_events ADD COLUMN IF NOT EXISTS seed_eligibility_score numeric DEFAULT 0.0;

-- Index for justice processing
CREATE INDEX IF NOT EXISTS platform_events_justice_processed_idx ON platform_events (justice_processed);

-- Insert initial taxonomy data
INSERT INTO taxonomy (kind, key, label, description) VALUES
-- Modules
('module', 'meditation', 'Meditation & Mindfulness', 'Guided meditations, breathing, presence practices'),
('module', 'dreamscape', 'Dreamscape & Astral', 'Dream work, astral projection, lucid dreaming'),
('module', 'resonance_tech', 'Resonance Technology', 'Frequency healing, sound therapy, binaural beats'),
('module', 'astrology', 'Astrology & Cosmos', 'Astrological insights, cosmic alignments, planetary influences'),
('module', 'sacred_geometry', 'Sacred Geometry', 'Geometric patterns, fractals, mathematical mysticism'),
('module', 'light_language', 'Light Language', 'Channeled symbols, energy transmissions, galactic codes'),

-- Themes  
('theme', 'awakening', 'Spiritual Awakening', 'Consciousness expansion and spiritual growth'),
('theme', 'healing', 'Energy Healing', 'Restoration, clearing, energetic alignment'),
('theme', 'manifestation', 'Conscious Creation', 'Manifesting, reality creation, intention setting'),
('theme', 'unity', 'Unity Consciousness', 'Oneness, connection, collective awakening'),
('theme', 'sovereignty', 'Personal Sovereignty', 'Self-empowerment, authentic living, boundaries'),
('theme', 'mystery', 'Sacred Mystery', 'Unknown, mystical experiences, divine encounters'),

-- Tones
('tone', 'calm', 'Calm & Centered', 'Peaceful, grounding, stable energy'),
('tone', 'energetic', 'Energetic & Uplifting', 'Dynamic, motivating, activating energy'),  
('tone', 'mystical', 'Mystical & Sacred', 'Deep, reverent, otherworldly energy'),
('tone', 'playful', 'Playful & Light', 'Joyful, curious, experimental energy'),
('tone', 'profound', 'Profound & Transformative', 'Deep wisdom, life-changing insights'),

-- Visual Styles
('visual_style', 'cosmic', 'Cosmic & Celestial', 'Stars, galaxies, cosmic phenomena'),
('visual_style', 'nature', 'Nature & Earth', 'Natural landscapes, organic patterns'),
('visual_style', 'geometric', 'Sacred Geometry', 'Mathematical patterns, fractals, mandalas'),
('visual_style', 'minimal', 'Minimal & Clean', 'Simple, elegant, uncluttered aesthetics'),
('visual_style', 'ethereal', 'Ethereal & Dreamy', 'Soft, flowing, otherworldly visuals'),

-- Content Types
('content_type', 'teaching', 'Teaching & Education', 'Instructional content, explanations'),
('content_type', 'guided_practice', 'Guided Practice', 'Led experiences, meditations, rituals'),
('content_type', 'inspiration', 'Inspiration & Motivation', 'Uplifting messages, encouragement'),
('content_type', 'community', 'Community & Connection', 'Shared experiences, group activities'),
('content_type', 'insight', 'Insights & Wisdom', 'Deep perspectives, realizations, teachings')

ON CONFLICT (kind, key) DO NOTHING;

-- Insert initial justice configuration
INSERT INTO justice_config (key, value, description) VALUES
('youtube_playlists', '{
  "meditation": "PLxxxxxx_meditation",
  "dreamscape": "PLxxxxxx_dreamscape", 
  "resonance_tech": "PLxxxxxx_resonance",
  "astrology": "PLxxxxxx_astrology",
  "shorts": "PLxxxxxx_shorts"
}'::jsonb, 'YouTube playlist IDs for each module'),

('content_generation', '{
  "daily_seed_limit": 10,
  "max_video_length_seconds": 600,
  "default_visibility": "unlisted",
  "require_approval_sensitivity": 2
}'::jsonb, 'Content generation settings and limits'),

('resonance_scoring', '{
  "weights": {
    "yt_retention": 0.3,
    "yt_engagement": 0.2, 
    "ss_journals": 0.25,
    "ss_coherence": 0.15,
    "ss_saves": 0.1
  },
  "thresholds": {
    "high_resonance": 0.8,
    "medium_resonance": 0.5,
    "low_resonance": 0.3
  }
}'::jsonb, 'Resonance calculation weights and thresholds')

ON CONFLICT (key) DO NOTHING;