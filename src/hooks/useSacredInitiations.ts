import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface SacredSeal {
  id: string;
  seal_name: string;
  seal_order: number;
  geometry_type: string;
  color_signature: string;
  icon_name: string;
  oath_text: string;
  blessing_text: string;
  description_text: string;
  minimum_routines: number;
  requires_module_diversity: boolean;
  requires_community_contribution: boolean;
  requires_streak_days: number;
  requires_journal_entries: number;
  requires_circle_leadership: boolean;
  esoteric_unlock_level: number;
}

export interface UserInitiation {
  id: string;
  user_id: string;
  seal_id: string;
  awarded_at: string;
  ceremony_completed: boolean;
  ceremony_completed_at?: string;
  conditions_snapshot: any;
  esoteric_access_granted: boolean;
  seal: SacredSeal;
}

export interface SacredProgress {
  total_routines: number;
  unique_module_types: number;
  current_streak: number;
  longest_streak: number;
  community_contributions: number;
  journal_entries: number;
  circles_leadership: number;
  module_diversity_score: number;
  consistency_score: number;
  leadership_score: number;
  // Shadow Path metrics
  resistance_logs: number;
  micro_practices_completed: number;
  comeback_count: number;
  support_given: number;
  silence_reflections: number;
}

// Fetch all sacred seals
export const useSacredSeals = () => {
  return useQuery({
    queryKey: ['sacred-seals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sacred_lineage_seals' as any)
        .select('*')
        .order('seal_order');
      
      if (error) throw error;
      return data as unknown as SacredSeal[];
    }
  });
};

// Fetch user's sacred initiations
export const useUserInitiations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-initiations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_sacred_initiations' as any)
        .select(`
          *,
          seal:sacred_lineage_seals(*)
        `)
        .eq('user_id', user.id)
        .order('awarded_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as UserInitiation[];
    },
    enabled: !!user?.id
  });
};

// Get user's current highest seal
export const useCurrentSeal = () => {
  const { data: initiations } = useUserInitiations();
  
  return { data: initiations?.[0] || null };
};

// Get user's sacred progress
export const useSacredProgress = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['sacred-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('calculate_sacred_progress' as any, { p_user_id: user.id });
      
      if (error) throw error;
      return data?.[0] as SacredProgress;
    },
    enabled: !!user?.id
  });
};

// Check and award seals
export const useCheckSeals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .rpc('check_and_award_sacred_seals' as any, { p_user_id: user.id });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.[0]?.newly_awarded_seal && data?.[0]?.ceremony_required) {
        toast({
          title: '🔥 Sacred Initiation Achieved!',
          description: `You have earned the ${data[0].newly_awarded_seal} seal. The ceremony awaits.`,
          duration: 8000,
        });
      }
      
      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['user-initiations'] });
      queryClient.invalidateQueries({ queryKey: ['sacred-progress'] });
    }
  });
};

// Complete ceremony for a seal
export const useCompleteCeremony = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (initiationId: string) => {
      const { error } = await supabase
        .from('user_sacred_initiations' as any)
        .update({
          ceremony_completed: true,
          ceremony_completed_at: new Date().toISOString()
        })
        .eq('id', initiationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: '✨ Ceremony Complete',
        description: 'The sacred seal has been integrated into your being.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['user-initiations'] });
    }
  });
};