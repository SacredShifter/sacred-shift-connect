-- Phase 2: Enable RLS on all public tables without row level security
-- These are the ERROR-level security issues that must be fixed

-- Get list of tables without RLS and enable it
ALTER TABLE public.circle_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.era_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gaa_usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soul_radar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_evolution ENABLE ROW LEVEL SECURITY;

-- Add basic RLS policies for each table where data should be user-scoped
-- circle_memberships
CREATE POLICY "Users can manage their own memberships"
  ON public.circle_memberships
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- consent_history  
CREATE POLICY "Users can view their own consent history"
  ON public.consent_history
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- donations (admin managed, users can view their own)
CREATE POLICY "Users can view their own donations"
  ON public.donations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage donations"
  ON public.donations
  FOR ALL
  USING (auth.role() = 'service_role');

-- feedback (admin managed)
CREATE POLICY "Service role can manage feedback"
  ON public.feedback
  FOR ALL
  USING (auth.role() = 'service_role');

-- support_requests (users own, admins all)
CREATE POLICY "Users can manage their own support requests"
  ON public.support_requests
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all support requests"
  ON public.support_requests
  FOR SELECT
  USING (user_has_role(auth.uid(), 'admin'::app_role));