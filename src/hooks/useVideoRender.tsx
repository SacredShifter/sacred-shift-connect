import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface RenderJob {
  id: string;
  plan_id: string;
  preset: string;
  status: string;
  output_paths: string[];
  edl: any;
  file_size_bytes: number;
  progress_pct: number;
  render_log: string;
  render_time_ms: number;
  created_at: string;
  completed_at: string;
  updated_at: string;
}

export interface RenderOptions {
  preset?: 'long_16x9' | 'short_9x16' | 'square_1x1';
}

export const useVideoRender = () => {
  const [isRendering, setIsRendering] = useState(false);
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);
  const { toast } = useToast();

  const startRender = async (planId: string, options: RenderOptions = {}) => {
    setIsRendering(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('render-video', {
        body: {
          planId,
          preset: options.preset || 'long_16x9'
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Video render started",
          description: `Render job ${data.renderJobId} is processing...`,
        });

        // Refresh render jobs
        await fetchRenderJobs();
        
        return data.renderJobId;
      } else {
        throw new Error(data.error || 'Unknown render error');
      }
    } catch (error) {
      console.error('Render error:', error);
      toast({
        title: "Render failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsRendering(false);
    }
  };

  const fetchRenderJobs = async (planId?: string) => {
    try {
      let query = supabase
        .from('render_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (planId) {
        query = query.eq('plan_id', planId);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;

      setRenderJobs(data || []);
      return data || [];
    } catch (error) {
      console.error('Failed to fetch render jobs:', error);
      toast({
        title: "Failed to load render jobs",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
      return [];
    }
  };

  const getRenderJob = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('render_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch render job:', error);
      return null;
    }
  };

  return {
    isRendering,
    renderJobs,
    startRender,
    fetchRenderJobs,
    getRenderJob,
  };
};