-- Complete Critical RLS Policy Migration - Phase 2 Final
-- Adding missing policies for tables with RLS enabled but no policies

-- Tables with user_id patterns - user-scoped access
CREATE POLICY "Users can manage their beacon nodes" ON public.beacon_nodes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their breath sessions" ON public.breath_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their channeled messages" ON public.channeled_messages
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their chakra snapshots" ON public.chakra_mood_snapshots
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their celestial alignments" ON public.celestial_alignment
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their biofeedback streams" ON public.biofeedback_streams
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Circle and community related tables
CREATE POLICY "Users can view circles they belong to" ON public.circles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM circle_members WHERE circle_id = circles.id AND status = 'active'
    ) OR created_by = auth.uid()
  );

CREATE POLICY "Users can create circles" ON public.circles
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Circle creators can update their circles" ON public.circles
  FOR UPDATE USING (auth.uid() = created_by);

-- Chat and messaging
CREATE POLICY "Users can access chat rooms they're members of" ON public.chat_rooms
  FOR ALL USING (
    auth.uid() IN (
      SELECT unnest(participants)
    ) OR created_by = auth.uid()
  );

CREATE POLICY "Users can create chat rooms" ON public.chat_rooms
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Content sources and user content
CREATE POLICY "Users can manage their content sources" ON public.content_sources
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their dream logs" ON public.dream_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- System and admin-managed tables
CREATE POLICY "Service role can manage compliance data" ON public.compliance_audit_trail
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view their compliance data" ON public.compliance_audit_trail
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage system events" ON public.system_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage error logs" ON public.error_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Public readable, admin managed
CREATE POLICY "Anyone can view public learning modules" ON public.learning_modules
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage learning modules" ON public.learning_modules
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Notification and communication
CREATE POLICY "Users can manage their notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their direct messages" ON public.direct_messages
  FOR ALL USING (auth.uid() = sender_id OR auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = sender_id);

-- Financial and transaction data
CREATE POLICY "Users can view their payment history" ON public.payment_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage payments" ON public.payment_history
  FOR ALL USING (auth.role() = 'service_role');

-- Progress and analytics
CREATE POLICY "Users can view their progress data" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create progress entries" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Session and activity tracking
CREATE POLICY "Users can manage their sessions" ON public.user_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- File and media management
CREATE POLICY "Users can manage their uploaded files" ON public.uploaded_files
  FOR ALL USING (auth.uid() = uploaded_by) WITH CHECK (auth.uid() = uploaded_by);

-- Settings and preferences
CREATE POLICY "Users can manage their settings" ON public.user_settings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Audit and compliance - read-only for users, full access for service
CREATE POLICY "Users can view their audit trail" ON public.user_audit_trail
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage audit trail" ON public.user_audit_trail
  FOR ALL USING (auth.role() = 'service_role');

-- Integration and external services
CREATE POLICY "Users can manage their integrations" ON public.user_integrations
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Subscription and billing
CREATE POLICY "Users can view their subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON public.user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');