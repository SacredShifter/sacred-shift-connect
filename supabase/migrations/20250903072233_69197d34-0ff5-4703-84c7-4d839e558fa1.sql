-- Complete Critical RLS Policy Migration - Phase 2 Final (Missing Tables Only)
-- Adding policies only for tables that still don't have any

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

-- System/logging tables
CREATE POLICY "Service role can manage sacred event logs" ON public.sacred_event_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage sync events" ON public.sync_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage system state" ON public.system_state
  FOR ALL USING (auth.role() = 'service_role');

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