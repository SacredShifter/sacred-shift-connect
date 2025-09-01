import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface PublishJob {
  id: string;
  render_job_id: string;
  title: string;
  description?: string;
  tags?: string[];
  playlist_id?: string;
  visibility?: string;
  thumb_path?: string;
  youtube_video_id?: string;
  category_id?: number;
  publish_error?: string;
  privacy_status?: string;
  scheduled_for?: string;
  created_at: string;
  published_at?: string;
  updated_at?: string;
}

export interface PublishOptions {
  title: string;
  description?: string;
  tags?: string[];
  playlistId?: string;
  visibility?: 'private' | 'unlisted' | 'public';
}

export const useYouTubePublish = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishJobs, setPublishJobs] = useState<PublishJob[]>([]);
  const { toast } = useToast();

  const publishToYouTube = async (renderJobId: string, options: PublishOptions) => {
    setIsPublishing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('publish-youtube', {
        body: {
          renderJobId,
          title: options.title,
          description: options.description || '',
          tags: options.tags || [],
          playlistId: options.playlistId,
          visibility: options.visibility || 'unlisted'
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "YouTube upload started",
          description: `Publishing job ${data.publishJobId} is processing...`,
        });

        // Refresh publish jobs
        await fetchPublishJobs();
        
        return {
          publishJobId: data.publishJobId,
          youtubeVideoId: data.youtubeVideoId,
          videoUrl: data.videoUrl
        };
      } else {
        throw new Error(data.error || 'Unknown publish error');
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast({
        title: "YouTube publish failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsPublishing(false);
    }
  };

  const fetchPublishJobs = async (renderJobId?: string) => {
    try {
      let query = supabase
        .from('yt_publish')
        .select('*')
        .order('created_at', { ascending: false });

      if (renderJobId) {
        query = query.eq('render_job_id', renderJobId);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;

      setPublishJobs((data as PublishJob[]) || []);
      return (data as PublishJob[]) || [];
    } catch (error) {
      console.error('Failed to fetch publish jobs:', error);
      toast({
        title: "Failed to load publish jobs",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
      return [];
    }
  };

  const getPublishJob = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('yt_publish')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;
      return data as PublishJob;
    } catch (error) {
      console.error('Failed to fetch publish job:', error);
      return null;
    }
  };

  const getResonanceMetrics = async (youtubeVideoId: string) => {
    try {
      const { data, error } = await supabase
        .from('resonance_metrics')
        .select('*')
        .eq('youtube_video_id', youtubeVideoId)
        .order('time_window');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch resonance metrics:', error);
      return [];
    }
  };

  return {
    isPublishing,
    publishJobs,
    publishToYouTube,
    fetchPublishJobs,
    getPublishJob,
    getResonanceMetrics,
  };
};