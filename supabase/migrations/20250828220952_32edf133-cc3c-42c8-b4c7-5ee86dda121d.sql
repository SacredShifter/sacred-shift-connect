-- Phase 1: Sacred Social Architecture Foundation

-- Create enhanced user profiles with consciousness signatures
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,
    consciousness_signature JSONB DEFAULT '{}',
    aura_reading JSONB DEFAULT '{}',
    spiritual_journey_metadata JSONB DEFAULT '{}',
    sacred_geometry_preference TEXT DEFAULT 'flower_of_life',
    chakra_alignments JSONB DEFAULT '{}',
    archetypal_activations TEXT[] DEFAULT '{}',
    frequency_signature NUMERIC DEFAULT 528.0,
    consciousness_level INTEGER DEFAULT 1,
    sacred_role TEXT DEFAULT 'seeker',
    location TEXT,
    website_url TEXT,
    birth_chart_data JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on user profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view public profiles" ON public.user_profiles
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own profile" ON public.user_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Create sacred social relationships (friends/connections)
CREATE TABLE IF NOT EXISTS public.social_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    addressee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'blocked', 'sacred_bond')) DEFAULT 'pending',
    relationship_type TEXT CHECK (relationship_type IN ('friend', 'sacred_connection', 'mentor', 'guide', 'soul_family')) DEFAULT 'friend',
    sacred_resonance_score NUMERIC DEFAULT 0.5,
    consciousness_compatibility JSONB DEFAULT '{}',
    synchronicity_events JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(requester_id, addressee_id)
);

-- Enable RLS on social relationships
ALTER TABLE public.social_relationships ENABLE ROW LEVEL SECURITY;

-- Social relationships RLS policies
CREATE POLICY "Users can view their own relationships" ON public.social_relationships
    FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can manage their own relationships" ON public.social_relationships
    FOR ALL USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Enhance circle_posts with social media features
ALTER TABLE public.circle_posts 
ADD COLUMN IF NOT EXISTS post_type TEXT CHECK (post_type IN ('text', 'image', 'video', 'audio', 'sacred_sigil', 'event', 'poll', 'story')) DEFAULT 'text',
ADD COLUMN IF NOT EXISTS media_urls JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS sacred_sigil_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS consciousness_metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS engagement_stats JSONB DEFAULT '{"likes": 0, "comments": 0, "shares": 0, "sacred_resonance": 0}',
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS tagged_users UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hashtags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_story BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS story_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS parent_post_id UUID REFERENCES public.circle_posts(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS mood_signature TEXT,
ADD COLUMN IF NOT EXISTS quantum_entanglement_id UUID;

-- Create post reactions (beyond simple likes)
CREATE TABLE IF NOT EXISTS public.post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.circle_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reaction_type TEXT CHECK (reaction_type IN ('like', 'love', 'sacred_blessing', 'quantum_resonance', 'aura_boost', 'chakra_alignment', 'synchronicity')) NOT NULL,
    reaction_intensity NUMERIC DEFAULT 1.0,
    consciousness_state TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(post_id, user_id, reaction_type)
);

-- Enable RLS on post reactions
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

-- Post reactions RLS policies
CREATE POLICY "Anyone can view post reactions" ON public.post_reactions
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own reactions" ON public.post_reactions
    FOR ALL USING (auth.uid() = user_id);

-- Create post comments with threading
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.circle_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    parent_comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url TEXT,
    consciousness_level INTEGER DEFAULT 1,
    sacred_tone TEXT CHECK (sacred_tone IN ('compassionate', 'wise', 'questioning', 'supportive', 'celebratory', 'healing')),
    mentioned_users UUID[] DEFAULT '{}',
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on post comments
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Post comments RLS policies
CREATE POLICY "Anyone can view comments on public posts" ON public.post_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.circle_posts 
            WHERE id = post_id AND visibility = 'circle'
        )
    );

CREATE POLICY "Users can manage their own comments" ON public.post_comments
    FOR ALL USING (auth.uid() = user_id);

-- Create sacred events system
CREATE TABLE IF NOT EXISTS public.sacred_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    circle_id UUID REFERENCES public.circle_groups(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT CHECK (event_type IN ('meditation', 'ceremony', 'workshop', 'gathering', 'ritual', 'healing_circle', 'consciousness_expansion', 'sacred_celebration')) NOT NULL,
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    is_virtual BOOLEAN DEFAULT false,
    virtual_meeting_data JSONB DEFAULT '{}',
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    cover_image_url TEXT,
    astrological_timing JSONB DEFAULT '{}',
    required_consciousness_level INTEGER DEFAULT 1,
    chakra_focus TEXT[],
    sacred_geometry_template TEXT DEFAULT 'circle',
    intention_setting TEXT,
    preparation_instructions TEXT,
    materials_needed TEXT[],
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB DEFAULT '{}',
    visibility TEXT CHECK (visibility IN ('public', 'circle', 'private', 'sacred_family')) DEFAULT 'circle',
    tags TEXT[] DEFAULT '{}',
    rsvp_deadline TIMESTAMP WITH TIME ZONE,
    requires_approval BOOLEAN DEFAULT false,
    price_conscious_exchange NUMERIC DEFAULT 0,
    donation_suggested BOOLEAN DEFAULT false,
    energy_exchange_type TEXT CHECK (energy_exchange_type IN ('free', 'donation', 'energy_trade', 'sacred_offering', 'monetary')) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on sacred events
ALTER TABLE public.sacred_events ENABLE ROW LEVEL SECURITY;

-- Sacred events RLS policies
CREATE POLICY "Anyone can view public events" ON public.sacred_events
    FOR SELECT USING (visibility = 'public' OR auth.uid() = creator_id);

CREATE POLICY "Circle members can view circle events" ON public.sacred_events
    FOR SELECT USING (
        visibility = 'circle' AND 
        EXISTS (
            SELECT 1 FROM public.circle_group_members 
            WHERE group_id = circle_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own events" ON public.sacred_events
    FOR ALL USING (auth.uid() = creator_id);

-- Create event RSVPs with consciousness integration
CREATE TABLE IF NOT EXISTS public.event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.sacred_events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    response TEXT CHECK (response IN ('attending', 'maybe', 'not_attending', 'interested', 'sacred_commitment')) NOT NULL,
    consciousness_intention TEXT,
    energy_offering TEXT,
    preparation_commitment TEXT,
    dietary_requirements TEXT,
    accessibility_needs TEXT,
    arrival_time TIMESTAMP WITH TIME ZONE,
    plus_ones INTEGER DEFAULT 0,
    sacred_offering_description TEXT,
    synchronicity_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(event_id, user_id)
);

-- Enable RLS on event RSVPs
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

-- Event RSVPs RLS policies
CREATE POLICY "Event attendees can view RSVPs" ON public.event_rsvps
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.sacred_events 
            WHERE id = event_id AND creator_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own RSVPs" ON public.event_rsvps
    FOR ALL USING (auth.uid() = user_id);

-- Create consciousness synchronicity tracking
CREATE TABLE IF NOT EXISTS public.consciousness_synchronicity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    related_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    synchronicity_type TEXT CHECK (synchronicity_type IN ('simultaneous_thought', 'quantum_message_sync', 'aura_resonance', 'chakra_alignment', 'archetypal_activation', 'consciousness_bridge', 'sacred_number_appearance', 'dream_synchronicity')) NOT NULL,
    synchronicity_data JSONB NOT NULL,
    consciousness_state_before JSONB DEFAULT '{}',
    consciousness_state_after JSONB DEFAULT '{}',
    resonance_strength NUMERIC DEFAULT 0.5,
    geometric_pattern TEXT,
    frequency_detected NUMERIC,
    location TEXT,
    environmental_factors JSONB DEFAULT '{}',
    verification_status TEXT CHECK (verification_status IN ('unverified', 'user_confirmed', 'community_validated', 'AI_analyzed', 'sacred_witnessed')) DEFAULT 'unverified',
    quantum_entanglement_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on synchronicity logs
ALTER TABLE public.consciousness_synchronicity_logs ENABLE ROW LEVEL SECURITY;

-- Synchronicity logs RLS policies
CREATE POLICY "Users can view their own synchronicity logs" ON public.consciousness_synchronicity_logs
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = related_user_id);

CREATE POLICY "Users can create synchronicity logs" ON public.consciousness_synchronicity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create sacred stories (ephemeral content)
CREATE TABLE IF NOT EXISTS public.sacred_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    circle_id UUID REFERENCES public.circle_groups(id) ON DELETE CASCADE,
    content_type TEXT CHECK (content_type IN ('text', 'image', 'video', 'audio', 'consciousness_snapshot', 'aura_reading', 'sacred_geometry_animation')) NOT NULL,
    content TEXT,
    media_url TEXT,
    consciousness_snapshot JSONB DEFAULT '{}',
    aura_colors TEXT[] DEFAULT '{}',
    sacred_geometry_data JSONB DEFAULT '{}',
    background_music_url TEXT,
    story_duration INTEGER DEFAULT 24, -- hours
    visibility TEXT CHECK (visibility IN ('public', 'circle', 'sacred_family', 'private')) DEFAULT 'circle',
    viewers UUID[] DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    sacred_reactions JSONB DEFAULT '{}',
    quantum_resonance_score NUMERIC DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '24 hours'),
    is_highlight BOOLEAN DEFAULT false,
    highlight_category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on sacred stories
ALTER TABLE public.sacred_stories ENABLE ROW LEVEL SECURITY;

-- Sacred stories RLS policies
CREATE POLICY "Users can view stories based on visibility" ON public.sacred_stories
    FOR SELECT USING (
        visibility = 'public' OR
        auth.uid() = user_id OR
        (visibility = 'circle' AND EXISTS (
            SELECT 1 FROM public.circle_group_members 
            WHERE group_id = circle_id AND user_id = auth.uid()
        ))
    );

CREATE POLICY "Users can manage their own stories" ON public.sacred_stories
    FOR ALL USING (auth.uid() = user_id);

-- Create functions to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_relationships_updated_at 
    BEFORE UPDATE ON public.social_relationships 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at 
    BEFORE UPDATE ON public.post_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sacred_events_updated_at 
    BEFORE UPDATE ON public.sacred_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_rsvps_updated_at 
    BEFORE UPDATE ON public.event_rsvps 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for all new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.social_relationships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sacred_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_rsvps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.consciousness_synchronicity_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sacred_stories;