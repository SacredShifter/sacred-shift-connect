-- Create consciousness_profiles table
CREATE TABLE IF NOT EXISTS public.consciousness_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    current_level TEXT DEFAULT 'initiate' CHECK (current_level IN (
        'initiate', 'seeker', 'student', 'adept', 'practitioner', 
        'teacher', 'master', 'guardian', 'sage', 'enlightened', 
        'transcendent', 'cosmic'
    )),
    total_points INTEGER DEFAULT 0,
    level_progress DECIMAL(5,2) DEFAULT 0.0,
    awareness DECIMAL(5,2) DEFAULT 0.0 CHECK (awareness >= 0 AND awareness <= 100),
    presence DECIMAL(5,2) DEFAULT 0.0 CHECK (presence >= 0 AND presence <= 100),
    compassion DECIMAL(5,2) DEFAULT 0.0 CHECK (compassion >= 0 AND compassion <= 100),
    wisdom DECIMAL(5,2) DEFAULT 0.0 CHECK (wisdom >= 0 AND wisdom <= 100),
    coherence_level DECIMAL(5,2) DEFAULT 0.0 CHECK (coherence_level >= 0 AND coherence_level <= 100),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consciousness_tracking table
CREATE TABLE IF NOT EXISTS public.consciousness_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content_id TEXT NOT NULL,
    content_type TEXT DEFAULT 'video',
    resonance_score DECIMAL(5,2) DEFAULT 0.0 CHECK (resonance_score >= 0 AND resonance_score <= 1),
    consumption_duration INTEGER DEFAULT 0, -- seconds
    consciousness_impact DECIMAL(5,2) DEFAULT 0.0,
    learning_insights TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consciousness_recommendations table
CREATE TABLE IF NOT EXISTS public.consciousness_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content_id TEXT NOT NULL,
    recommendation_score DECIMAL(5,2) DEFAULT 0.0 CHECK (recommendation_score >= 0 AND recommendation_score <= 1),
    reason TEXT,
    consciousness_benefits TEXT[],
    recommended_practices TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create consciousness_analytics table
CREATE TABLE IF NOT EXISTS public.consciousness_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    metric_type TEXT DEFAULT 'gauge' CHECK (metric_type IN ('gauge', 'counter', 'histogram')),
    tags JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consciousness_profiles_user_id ON public.consciousness_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_consciousness_tracking_user_id ON public.consciousness_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_consciousness_tracking_content_id ON public.consciousness_tracking(content_id);
CREATE INDEX IF NOT EXISTS idx_consciousness_recommendations_user_id ON public.consciousness_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_consciousness_analytics_user_id ON public.consciousness_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_consciousness_analytics_metric_name ON public.consciousness_analytics(metric_name);

-- Enable Row Level Security
ALTER TABLE public.consciousness_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consciousness_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consciousness_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consciousness_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own consciousness profile" ON public.consciousness_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own consciousness profile" ON public.consciousness_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consciousness profile" ON public.consciousness_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own consciousness tracking" ON public.consciousness_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consciousness tracking" ON public.consciousness_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own consciousness recommendations" ON public.consciousness_recommendations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consciousness recommendations" ON public.consciousness_recommendations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own consciousness analytics" ON public.consciousness_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consciousness analytics" ON public.consciousness_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for consciousness_profiles
CREATE TRIGGER update_consciousness_profiles_updated_at 
    BEFORE UPDATE ON public.consciousness_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default consciousness profile for existing users
INSERT INTO public.consciousness_profiles (user_id, current_level, total_points, awareness, presence, compassion, wisdom, coherence_level)
SELECT 
    id as user_id,
    'initiate' as current_level,
    0 as total_points,
    25.0 as awareness,
    25.0 as presence,
    25.0 as compassion,
    25.0 as wisdom,
    25.0 as coherence_level
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.consciousness_profiles)
ON CONFLICT (user_id) DO NOTHING;
