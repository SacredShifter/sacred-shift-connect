import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface OnboardingStatus {
  completed: boolean;
  profileExists: boolean;
  lastStep?: string;
}

export const useOnboardingStatus = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['onboardingStatus', user?.id],
    queryFn: async (): Promise<OnboardingStatus> => {
      if (!user) {
        return { completed: false, profileExists: false };
      }
      
      // Check if profile exists and if onboarding is completed
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed, display_name')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking onboarding status:', error);
        return { completed: false, profileExists: false };
      }
      
      const profileExists = !!profile;
      const completed = profile?.onboarding_completed || false;
      
      return {
        completed,
        profileExists,
        lastStep: completed ? 'completed' : 'welcome'
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCompleteOnboarding = () => {
  const { user } = useAuth();
  
  return async (profileData?: any) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          user_id: user.id,
          display_name: profileData?.display_name || user.email?.split('@')[0] || 'Sacred Seeker',
          onboarding_completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...profileData
        });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };
};