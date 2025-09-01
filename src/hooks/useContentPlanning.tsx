import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useContentPlanning = () => {
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const { toast } = useToast();

  const createContentPlan = async (seedId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-content-plan', {
        body: { 
          seed_id: seedId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;

      setCurrentPlan(data.content_plan);
      toast({
        title: "Content Plan Generated",
        description: "Sacred content plan has been created successfully",
      });

      return data.plan_id;
    } catch (error: any) {
      console.error('Content planning error:', error);
      toast({
        title: "Planning Failed",
        description: error.message || "Failed to generate content plan",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getContentPlans = async (status?: string) => {
    try {
      let query = (supabase as any)
        .from('content_plans')
        .select(`
          *,
          content_seeds (
            id,
            content_text,
            primary_taxonomy,
            emotional_intensity
          )
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching content plans:', error);
      toast({
        title: "Fetch Failed",
        description: "Failed to load content plans",
        variant: "destructive"
      });
      return [];
    }
  };

  const updatePlanStatus = async (planId: string, status: string, updates?: any) => {
    try {
      const updateData = { status, ...updates };
      
      const { error } = await (supabase as any)
        .from('content_plans')
        .update(updateData)
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: "Plan Updated",
        description: `Content plan status changed to ${status}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error updating plan:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update plan",
        variant: "destructive"
      });
      return false;
    }
  };

  const getMediaAssets = async (planId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('media_assets')
        .select('*')
        .eq('plan_id', planId)
        .order('priority', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching media assets:', error);
      return [];
    }
  };

  const approveContentPlan = async (planId: string) => {
    setLoading(true);
    try {
      const success = await updatePlanStatus(planId, 'approved', {
        approved_at: new Date().toISOString()
      });
      
      if (success) {
        // Trigger render job creation
        await createRenderJob(planId);
      }
      
      return success;
    } finally {
      setLoading(false);
    }
  };

  const createRenderJob = async (planId: string) => {
    try {
      const { data: plan } = await (supabase as any)
        .from('content_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (!plan) throw new Error('Plan not found');

      const { error } = await (supabase as any)
        .from('render_jobs')
        .insert({
          plan_id: planId,
          render_config: {
            resolution: '1920x1080',
            fps: 30,
            format: 'mp4',
            quality: 'high',
            duration: plan.target_duration
          },
          status: 'queued',
          priority: 1
        });

      if (error) throw error;

      toast({
        title: "Render Job Created",
        description: "Content is queued for video rendering",
      });

      return true;
    } catch (error: any) {
      console.error('Error creating render job:', error);
      toast({
        title: "Render Failed",
        description: "Failed to queue content for rendering",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    loading,
    currentPlan,
    createContentPlan,
    getContentPlans,
    updatePlanStatus,
    getMediaAssets,
    approveContentPlan
  };
};