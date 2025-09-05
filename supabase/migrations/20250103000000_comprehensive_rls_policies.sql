-- Comprehensive RLS Policies for Sacred Shifter Connect
-- This migration adds Row Level Security policies for all user-data tables

-- Enable RLS on all tables that need it
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consciousness_evolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synchronicity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mirror_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breath_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sacred_initiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_ai_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consciousness_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_user_metrics ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles table policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can manage roles" ON public.user_roles
  FOR ALL USING (auth.role() = 'service_role');

-- User journey progress policies
CREATE POLICY "Users can manage their own journey progress" ON public.user_journey_progress
  FOR ALL USING (auth.uid() = user_id);

-- Consciousness evolution policies
CREATE POLICY "Users can manage their own consciousness data" ON public.consciousness_evolution
  FOR ALL USING (auth.uid() = user_id);

-- Synchronicity events policies
CREATE POLICY "Users can manage their own synchronicity events" ON public.synchronicity_events
  FOR ALL USING (auth.uid() = user_id);

-- Mood tracking policies
CREATE POLICY "Users can manage their own mood data" ON public.mood_tracking
  FOR ALL USING (auth.uid() = user_id);

-- Meditation sessions policies
CREATE POLICY "Users can manage their own meditation sessions" ON public.meditation_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Journal entries policies
CREATE POLICY "Users can manage their own journal entries" ON public.mirror_journal_entries
  FOR ALL USING (auth.uid() = user_id);

-- Breath sessions policies
CREATE POLICY "Users can manage their own breath sessions" ON public.breath_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Sacred initiations policies
CREATE POLICY "Users can view their own initiations" ON public.user_sacred_initiations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage initiations" ON public.user_sacred_initiations
  FOR ALL USING (auth.role() = 'service_role');

-- AI context policies
CREATE POLICY "Users can manage their own AI context" ON public.personal_ai_context
  FOR ALL USING (auth.uid() = user_id);

-- Conversation analysis policies
CREATE POLICY "Users can manage their own conversation analysis" ON public.conversation_analysis
  FOR ALL USING (auth.uid() = user_id);

-- Predictive insights policies
CREATE POLICY "Users can manage their own insights" ON public.predictive_insights
  FOR ALL USING (auth.uid() = user_id);

-- Consciousness sessions policies
CREATE POLICY "Users can manage their own consciousness sessions" ON public.consciousness_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Active user metrics policies
CREATE POLICY "Users can view their own metrics" ON public.active_user_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage metrics" ON public.active_user_metrics
  FOR ALL USING (auth.role() = 'service_role');

-- Public content policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view public content" ON public.content_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view public sacred seals" ON public.sacred_lineage_seals
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admin-only policies for sensitive operations
CREATE POLICY "Admins can manage all user data" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Service role policies for system operations
CREATE POLICY "Service role can manage all data" ON public.profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Add indexes for better RLS performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_consciousness_evolution_user_id ON public.consciousness_evolution(user_id);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_id ON public.meditation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON public.mirror_journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_breath_sessions_user_id ON public.breath_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sacred_initiations_user_id ON public.user_sacred_initiations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_context_user_id ON public.personal_ai_context(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_analysis_user_id ON public.conversation_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_predictive_insights_user_id ON public.predictive_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_consciousness_sessions_user_id ON public.consciousness_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_metrics_user_id ON public.active_user_metrics(user_id);
