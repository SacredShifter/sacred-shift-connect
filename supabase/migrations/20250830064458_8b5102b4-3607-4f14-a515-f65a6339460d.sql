-- Enable RLS on content tables
ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_orchestration ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for content_sources
CREATE POLICY "Users can manage their own content sources"
ON public.content_sources
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for content_items  
CREATE POLICY "Users can view content from their sources"
ON public.content_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.content_sources 
    WHERE content_sources.id = content_items.source_id 
    AND content_sources.user_id = auth.uid()
  )
);

CREATE POLICY "System can manage content items"
ON public.content_items
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Create RLS policies for sync_orchestration
CREATE POLICY "Users can manage their own sync orchestration"
ON public.sync_orchestration
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can manage sync orchestration"
ON public.sync_orchestration
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');