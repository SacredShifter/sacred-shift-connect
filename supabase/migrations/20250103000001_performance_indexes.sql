-- Performance Optimization Indexes
-- This migration adds indexes to improve query performance

-- User-related indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- User roles indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_created_at ON public.user_roles(created_at);

-- Content indexes
CREATE INDEX IF NOT EXISTS idx_content_items_created_at ON public.content_items(created_at);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON public.content_items(category);
CREATE INDEX IF NOT EXISTS idx_content_items_consciousness_level ON public.content_items(consciousness_level);
CREATE INDEX IF NOT EXISTS idx_content_items_energy_frequency ON public.content_items(energy_frequency);

-- Circle posts indexes
CREATE INDEX IF NOT EXISTS idx_circle_posts_created_at ON public.circle_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_circle_posts_group_id ON public.circle_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_circle_posts_user_id ON public.circle_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_posts_chakra_tag ON public.circle_posts(chakra_tag);

-- Circle groups indexes
CREATE INDEX IF NOT EXISTS idx_circle_groups_created_at ON public.circle_groups(created_at);
CREATE INDEX IF NOT EXISTS idx_circle_groups_is_private ON public.circle_groups(is_private);
CREATE INDEX IF NOT EXISTS idx_circle_groups_is_active ON public.circle_groups(is_active);

-- Circle group members indexes
CREATE INDEX IF NOT EXISTS idx_circle_group_members_group_id ON public.circle_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_circle_group_members_user_id ON public.circle_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_group_members_created_at ON public.circle_group_members(created_at);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);

-- Registry entries indexes
CREATE INDEX IF NOT EXISTS idx_registry_entries_created_at ON public.registry_of_resonance(created_at);
CREATE INDEX IF NOT EXISTS idx_registry_entries_user_id ON public.registry_of_resonance(user_id);
CREATE INDEX IF NOT EXISTS idx_registry_entries_access_level ON public.registry_of_resonance(access_level);
CREATE INDEX IF NOT EXISTS idx_registry_entries_frequency_rating ON public.registry_of_resonance(frequency_rating);

-- Registry entry resonance indexes
CREATE INDEX IF NOT EXISTS idx_registry_entry_resonance_entry_id ON public.registry_entry_resonance(entry_id);
CREATE INDEX IF NOT EXISTS idx_registry_entry_resonance_user_id ON public.registry_entry_resonance(user_id);
CREATE INDEX IF NOT EXISTS idx_registry_entry_resonance_created_at ON public.registry_entry_resonance(created_at);

-- Registry entry comments indexes
CREATE INDEX IF NOT EXISTS idx_registry_entry_comments_entry_id ON public.registry_entry_comments(entry_id);
CREATE INDEX IF NOT EXISTS idx_registry_entry_comments_user_id ON public.registry_entry_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_registry_entry_comments_created_at ON public.registry_entry_comments(created_at);

-- Sacred seals indexes
CREATE INDEX IF NOT EXISTS idx_sacred_lineage_seals_created_at ON public.sacred_lineage_seals(created_at);
CREATE INDEX IF NOT EXISTS idx_sacred_lineage_seals_seal_type ON public.sacred_lineage_seals(seal_type);
CREATE INDEX IF NOT EXISTS idx_sacred_lineage_seals_is_active ON public.sacred_lineage_seals(is_active);

-- User sacred initiations indexes
CREATE INDEX IF NOT EXISTS idx_user_sacred_initiations_user_id ON public.user_sacred_initiations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sacred_initiations_seal_id ON public.user_sacred_initiations(seal_id);
CREATE INDEX IF NOT EXISTS idx_user_sacred_initiations_created_at ON public.user_sacred_initiations(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sacred_initiations_status ON public.user_sacred_initiations(status);

-- Consciousness evolution indexes
CREATE INDEX IF NOT EXISTS idx_consciousness_evolution_user_id ON public.consciousness_evolution(user_id);
CREATE INDEX IF NOT EXISTS idx_consciousness_evolution_created_at ON public.consciousness_evolution(created_at);
CREATE INDEX IF NOT EXISTS idx_consciousness_evolution_level ON public.consciousness_evolution(level);

-- Meditation sessions indexes
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_id ON public.meditation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_created_at ON public.meditation_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_duration ON public.meditation_sessions(duration);

-- Journal entries indexes
CREATE INDEX IF NOT EXISTS idx_mirror_journal_entries_user_id ON public.mirror_journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mirror_journal_entries_created_at ON public.mirror_journal_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_mirror_journal_entries_mood ON public.mirror_journal_entries(mood);

-- Breath sessions indexes
CREATE INDEX IF NOT EXISTS idx_breath_sessions_user_id ON public.breath_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_breath_sessions_created_at ON public.breath_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_breath_sessions_duration ON public.breath_sessions(duration);

-- AI assistant requests indexes
CREATE INDEX IF NOT EXISTS idx_ai_assistant_requests_user_id ON public.ai_assistant_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_assistant_requests_created_at ON public.ai_assistant_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_assistant_requests_request_type ON public.ai_assistant_requests(request_type);

-- Active user metrics indexes
CREATE INDEX IF NOT EXISTS idx_active_user_metrics_user_id ON public.active_user_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_active_user_metrics_created_at ON public.active_user_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_active_user_metrics_session_id ON public.active_user_metrics(session_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_circle_posts_group_created ON public.circle_posts(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registry_entries_user_created ON public.registry_of_resonance(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_created ON public.meditation_sessions(user_id, created_at DESC);

-- Partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_circle_groups_active ON public.circle_groups(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_sacred_seals_active ON public.sacred_lineage_seals(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_initiations_completed ON public.user_sacred_initiations(user_id, seal_id) WHERE status = 'completed';

-- Text search indexes (if using full-text search)
CREATE INDEX IF NOT EXISTS idx_circle_posts_content_search ON public.circle_posts USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_registry_entries_content_search ON public.registry_of_resonance USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_journal_entries_content_search ON public.mirror_journal_entries USING gin(to_tsvector('english', content));

-- Analyze tables to update statistics
ANALYZE public.profiles;
ANALYZE public.user_roles;
ANALYZE public.content_items;
ANALYZE public.circle_posts;
ANALYZE public.circle_groups;
ANALYZE public.circle_group_members;
ANALYZE public.messages;
ANALYZE public.registry_of_resonance;
ANALYZE public.registry_entry_resonance;
ANALYZE public.registry_entry_comments;
ANALYZE public.sacred_lineage_seals;
ANALYZE public.user_sacred_initiations;
ANALYZE public.consciousness_evolution;
ANALYZE public.meditation_sessions;
ANALYZE public.mirror_journal_entries;
ANALYZE public.breath_sessions;
ANALYZE public.ai_assistant_requests;
ANALYZE public.active_user_metrics;
