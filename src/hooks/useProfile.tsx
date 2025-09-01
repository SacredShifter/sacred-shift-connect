import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string;
  bio?: string;
  full_name?: string;
  date_of_birth?: string;
  gender_identity?: string;
  timezone?: string;
  primary_language?: string;
  soul_identity?: string;
  resonance_tags?: string[];
  aura_signature?: string;
  circles_joined?: string[];
  current_stage?: 'Entry' | 'Expansion' | 'Integration' | 'Crown' | 'Beyond';
  last_login?: string;
  streak_days?: number;
  total_meditation_minutes?: number;
  total_journal_entries?: number;
  total_breath_sessions?: number;
  mood_trends?: Record<string, number>;
  last_synchronicity_event?: string;
  synchronicity_chain?: string[];
  synchronicity_score?: number;
  ascension_title?: string;
  consciousness_level?: number;
  current_chakra_focus?: string;
  energy_frequency?: number;
  astral_coordinates?: string;
  dimensional_access?: string[];
  quantum_entanglements?: string[];
  spirit_guide_name?: string;
  last_vision_quest?: string;
  sacred_geometry_preference?: string;
  moon_phase_affinity?: string;
  elemental_alignment?: string;
  crystal_resonance?: string[];
  mantra_collection?: string[];
  dream_journal_entries?: number;
  past_life_memories?: string[];
  future_self_visions?: string[];
  cosmic_events_witnessed?: string[];
  interdimensional_travels?: number;
  light_body_activation?: number;
  dna_activation_level?: number;
  merkaba_spin_rate?: number;
  completed_tours?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  full_name?: string;
  date_of_birth?: string;
  gender_identity?: string;
  timezone?: string;
  primary_language?: string;
  soul_identity?: string;
  resonance_tags?: string[];
  aura_signature?: string;
  circles_joined?: string[];
  current_stage?: Profile['current_stage'];
  mood_trends?: Record<string, number>;
  synchronicity_chain?: string[];
}

export function useProfile() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }

      return data as Profile | null;
    },
    retry: (failureCount, error: any) => {
      // Don't retry if user is not authenticated
      if (error.message?.includes('not authenticated')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      toast({
        title: "Profile updated",
        description: "Your sacred profile has been synchronized with the field.",
      });
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast({
        title: "Profile sync failed",
        description: error.message || "Unable to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: ProfileUpdate & { 
      full_name: string; 
      date_of_birth: string; 
      timezone: string; 
      primary_language: string; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          ...profileData,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      toast({
        title: "Profile created",
        description: "Welcome to Sacred Shifter. Your journey begins now.",
      });
    },
    onError: (error: any) => {
      console.error('Profile creation error:', error);
      toast({
        title: "Profile creation failed",
        description: error.message || "Unable to create your profile. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateProfileMetrics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // For now, we'll just invalidate the query to refresh the profile
      // In the future, this could calculate metrics from other tables
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}