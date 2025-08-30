import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface ResistanceLog {
  id: string;
  user_id: string;
  reason: string;
  reflection: string;
  created_at: string;
  resistance_type: 'skip' | 'partial' | 'blocked';
}

export interface MicroPractice {
  id: string;
  practice_name: string;
  description: string;
  estimated_seconds: number;
  practice_type: 'breath' | 'journal' | 'visual' | 'movement';
  instructions: string;
  created_at: string;
}

export interface MicroPracticeCompletion {
  id: string;
  user_id: string;
  micro_practice_id: string;
  completed_at: string;
  notes?: string;
  micro_practice: MicroPractice;
}

export interface UserPracticePreferences {
  id: string;
  user_id: string;
  practice_pace: 'gentle' | 'moderate' | 'intensive';
  spiritual_lens: 'scientific' | 'metaphysical' | 'esoteric';
  trauma_informed_mode: boolean;
  micro_practices_enabled: boolean;
  shadow_work_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Get available micro-practices
export const useMicroPractices = () => {
  return useQuery({
    queryKey: ['micro-practices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('micro_practices' as any)
        .select('*')
        .order('practice_name');
      
      if (error) throw error;
      return data as unknown as MicroPractice[];
    }
  });
};

// Get user's micro-practice completions
export const useMicroPracticeCompletions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['micro-practice-completions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('micro_practice_completions' as any)
        .select(`
          *,
          micro_practice:micro_practices(*)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as MicroPracticeCompletion[];
    },
    enabled: !!user?.id
  });
};

// Complete a micro-practice
export const useCompleteMicroPractice = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ practiceId, notes }: { practiceId: string; notes?: string }) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('micro_practice_completions' as any)
        .insert({
          user_id: user.id,
          micro_practice_id: practiceId,
          notes
        })
        .select('*, micro_practice:micro_practices(*)')
        .single();
      
      if (error) throw error;
      return data as unknown as MicroPracticeCompletion;
    },
    onSuccess: (data) => {
      toast({
        title: '🌱 Micro-Practice Complete',
        description: `${data.micro_practice.practice_name} - Every small step counts.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['micro-practice-completions'] });
      queryClient.invalidateQueries({ queryKey: ['sacred-progress'] });
    }
  });
};

// Get user's resistance logs
export const useResistanceLogs = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['resistance-logs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('resistance_logs' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as ResistanceLog[];
    },
    enabled: !!user?.id
  });
};

// Log resistance/skip
export const useLogResistance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      reason, 
      reflection, 
      resistanceType 
    }: { 
      reason: string; 
      reflection: string; 
      resistanceType: 'skip' | 'partial' | 'blocked';
    }) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('resistance_logs' as any)
        .insert({
          user_id: user.id,
          reason,
          reflection,
          resistance_type: resistanceType
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as ResistanceLog;
    },
    onSuccess: () => {
      toast({
        title: '🌑 Resistance Witnessed',
        description: 'Your awareness of resistance is part of the sacred journey.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['resistance-logs'] });
      queryClient.invalidateQueries({ queryKey: ['sacred-progress'] });
    }
  });
};

// Get/update user practice preferences
export const usePracticePreferences = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['practice-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_practice_preferences' as any)
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as unknown as UserPracticePreferences | null;
    },
    enabled: !!user?.id
  });
};

export const useUpdatePracticePreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (preferences: Partial<UserPracticePreferences>) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('user_practice_preferences' as any)
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as UserPracticePreferences;
    },
    onSuccess: () => {
      toast({
        title: '⚙️ Preferences Updated',
        description: 'Your practice path has been personalized.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['practice-preferences'] });
    }
  });
};