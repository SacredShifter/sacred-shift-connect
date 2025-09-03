-- Create circles table for messaging groups
CREATE TABLE public.circles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES auth.users(id) NOT NULL,
  is_private BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create circle members table
CREATE TABLE public.circle_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(circle_id, user_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'image', 'video', 'file')),
  metadata JSONB,
  parent_message_id UUID REFERENCES public.messages(id), -- For threaded replies
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create message reactions table
CREATE TABLE public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Create read receipts table
CREATE TABLE public.message_read_receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Create karma reflections table
CREATE TABLE public.karma_reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event TEXT NOT NULL,
  reflection TEXT NOT NULL,
  perceived_outcome TEXT CHECK (perceived_outcome IN ('positive', 'negative', 'neutral')) DEFAULT 'neutral',
  tags TEXT[] DEFAULT '{}',
  circle_id UUID REFERENCES public.circles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karma_reflections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for circles
CREATE POLICY "Users can view circles they are members of" 
ON public.circles FOR SELECT 
USING (
  id IN (
    SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
  ) OR NOT is_private
);

CREATE POLICY "Users can create circles" 
ON public.circles FOR INSERT 
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Circle creators and admins can update circles" 
ON public.circles FOR UPDATE 
USING (
  creator_id = auth.uid() OR 
  id IN (
    SELECT circle_id FROM public.circle_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for circle members
CREATE POLICY "Users can view circle members for circles they belong to" 
ON public.circle_members FOR SELECT 
USING (
  circle_id IN (
    SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Circle admins can manage members" 
ON public.circle_members FOR ALL 
USING (
  circle_id IN (
    SELECT circle_id FROM public.circle_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'creator')
  )
);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in circles they belong to" 
ON public.messages FOR SELECT 
USING (
  circle_id IN (
    SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to circles they belong to" 
ON public.messages FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  circle_id IN (
    SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.messages FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for message reactions
CREATE POLICY "Users can view reactions in circles they belong to" 
ON public.message_reactions FOR SELECT 
USING (
  message_id IN (
    SELECT id FROM public.messages 
    WHERE circle_id IN (
      SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can add reactions to messages in their circles" 
ON public.message_reactions FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  message_id IN (
    SELECT id FROM public.messages 
    WHERE circle_id IN (
      SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
    )
  )
);

-- RLS Policies for read receipts
CREATE POLICY "Users can view read receipts in their circles" 
ON public.message_read_receipts FOR SELECT 
USING (
  message_id IN (
    SELECT id FROM public.messages 
    WHERE circle_id IN (
      SELECT circle_id FROM public.circle_members WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can mark messages as read" 
ON public.message_read_receipts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for karma reflections
CREATE POLICY "Users can view their own karma reflections" 
ON public.karma_reflections FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own karma reflections" 
ON public.karma_reflections FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own karma reflections" 
ON public.karma_reflections FOR UPDATE 
USING (auth.uid() = user_id);

-- Create storage buckets for media
INSERT INTO storage.buckets (id, name, public) VALUES ('voice-notes', 'voice-notes', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('circle-media', 'circle-media', false);

-- Storage policies for voice notes
CREATE POLICY "Users can upload voice notes to their circles" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'voice-notes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view voice notes in their circles" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'voice-notes');

-- Storage policies for circle media
CREATE POLICY "Users can upload media to their circles" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'circle-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view circle media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'circle-media');

-- Create indexes for performance
CREATE INDEX idx_circle_members_user_circle ON public.circle_members(user_id, circle_id);
CREATE INDEX idx_messages_circle_created ON public.messages(circle_id, created_at);
CREATE INDEX idx_messages_parent ON public.messages(parent_message_id);
CREATE INDEX idx_karma_reflections_user_created ON public.karma_reflections(user_id, created_at);

-- Create update triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_circles_updated_at
  BEFORE UPDATE ON public.circles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_karma_reflections_updated_at
  BEFORE UPDATE ON public.karma_reflections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();