-- Create render jobs table
CREATE TABLE public.render_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL,
  preset TEXT NOT NULL DEFAULT 'long_16x9',
  status TEXT NOT NULL DEFAULT 'queued',
  output_paths JSONB DEFAULT '[]'::jsonb,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  processing_time_ms INTEGER
);

-- Create YouTube publish table
CREATE TABLE public.yt_publish (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  render_job_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  playlist_id TEXT,
  visibility TEXT NOT NULL DEFAULT 'unlisted',
  thumb_path TEXT,
  youtube_video_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create resonance metrics table
CREATE TABLE public.resonance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_video_id TEXT NOT NULL,
  time_window TEXT NOT NULL, -- d1, d7, d30
  yt_watch_time INTEGER NOT NULL DEFAULT 0,
  avg_view_pct NUMERIC NOT NULL DEFAULT 0,
  ctr NUMERIC NOT NULL DEFAULT 0,
  subs_from_video INTEGER NOT NULL DEFAULT 0,
  ss_journal_events INTEGER NOT NULL DEFAULT 0,
  circle_coherence_delta NUMERIC NOT NULL DEFAULT 0,
  resonance_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(youtube_video_id, time_window)
);

-- Create media assets table for thumbnails and renders
CREATE TABLE public.media_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL,
  type TEXT NOT NULL, -- 'video', 'thumb', 'audio'
  storage_path TEXT NOT NULL,
  duration_ms INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.render_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yt_publish ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resonance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role can manage render jobs" ON public.render_jobs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage YouTube publish" ON public.yt_publish
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage resonance metrics" ON public.resonance_metrics
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage media assets" ON public.media_assets
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can view everything
CREATE POLICY "Admins can view render jobs" ON public.render_jobs
  FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view YouTube publish" ON public.yt_publish
  FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view resonance metrics" ON public.resonance_metrics
  FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view media assets" ON public.media_assets
  FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Add foreign key relationships
ALTER TABLE public.render_jobs 
ADD CONSTRAINT render_jobs_plan_id_fkey 
FOREIGN KEY (plan_id) REFERENCES public.content_plans(id) ON DELETE CASCADE;

ALTER TABLE public.yt_publish 
ADD CONSTRAINT yt_publish_render_job_id_fkey 
FOREIGN KEY (render_job_id) REFERENCES public.render_jobs(id) ON DELETE CASCADE;

ALTER TABLE public.media_assets 
ADD CONSTRAINT media_assets_plan_id_fkey 
FOREIGN KEY (plan_id) REFERENCES public.content_plans(id) ON DELETE CASCADE;