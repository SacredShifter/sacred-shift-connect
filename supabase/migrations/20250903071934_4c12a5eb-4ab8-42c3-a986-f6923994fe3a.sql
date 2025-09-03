-- Complete Critical RLS Policy Migration - Phase 2 Final (Fixed Enum)
-- Adding missing policies for tables with RLS enabled but no policies

-- User-scoped tables (have user_id column)
CREATE POLICY "Users can manage their own oracle draws" ON public.oracle_draws
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reflection logs" ON public.reflection_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their astrology profiles" ON public.user_astrology_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their sound attempts" ON public.user_sound_attempts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their transit snapshots" ON public.user_transit_snapshots
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their soul threads" ON public.soul_threads
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their soul thread entries" ON public.soul_thread_entries
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their myth progress" ON public.myth_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Admin/System managed tables (no user_id, managed by service/admin)
CREATE POLICY "Service role can manage insights" ON public.insights
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can view insights" ON public.insights
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage sacred blessings" ON public.sacred_blessings
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view sacred blessings" ON public.sacred_blessings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage sacred modules" ON public.sacred_modules
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active sacred modules" ON public.sacred_modules
  FOR SELECT USING (status = 'active');

-- System/logging tables
CREATE POLICY "Service role can manage session logs" ON public.session_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage message delivery status" ON public.message_delivery_status
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage sacred event logs" ON public.sacred_event_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage sync events" ON public.sync_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage system state" ON public.system_state
  FOR ALL USING (auth.role() = 'service_role');

-- Geometry and math tables (public read, service manage)
CREATE POLICY "Service role can manage fractal geometry" ON public.fractal_geometry_reads
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can view fractal geometry" ON public.fractal_geometry_reads
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage fractal glyphs" ON public.fractal_glyphs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can view fractal glyphs" ON public.fractal_glyphs
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage glyphs math" ON public.glyphs_math
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage math glyphs" ON public.math_glyphs
  FOR ALL USING (auth.role() = 'service_role');

-- Spiritual/mystical tracking tables
CREATE POLICY "Service role can manage ley line hits" ON public.ley_line_hits
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage metatron readings" ON public.metatron_readings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage potential seeds" ON public.potential_seeds
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage ritual rooms" ON public.ritual_rooms
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can view ritual rooms" ON public.ritual_rooms
  FOR SELECT USING (true);

-- Reference and codex tables
CREATE POLICY "Service role can manage sound codex entries" ON public.sound_codex_entries
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can view sound codex entries" ON public.sound_codex_entries
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage spoken glyph logs" ON public.spoken_glyph_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage transit insights reference" ON public.transit_insights_reference
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can view transit insights reference" ON public.transit_insights_reference
  FOR SELECT USING (true);