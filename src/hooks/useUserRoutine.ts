import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UserRoutine {
  id: string;
  user_id: string;
  template_id: string;
  customizations: any;
  is_active: boolean;
  completion_count: number;
  current_streak: number;
  longest_streak: number;
  last_completed_at: string | null;
  created_at: string;
  updated_at: string;
  template?: any;
}

export const useUserRoutine = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userRoutine', user?.id],
    queryFn: async (): Promise<UserRoutine | null> => {
      if (!user) return null;
      
      // Return mock data until database migration is approved
      const storedRoutine = localStorage.getItem(`userRoutine_${user.id}`);
      if (storedRoutine) {
        return JSON.parse(storedRoutine);
      }
      return null;
    },
    enabled: !!user?.id
  });
};

export const useCreateUserRoutine = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ templateId, customizations = {} }: { 
      templateId: string; 
      customizations?: any; 
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Create mock routine data
      const routine: UserRoutine = {
        id: `routine_${Date.now()}`,
        user_id: user.id,
        template_id: templateId,
        customizations,
        is_active: true,
        completion_count: 0,
        current_streak: 0,
        longest_streak: 0,
        last_completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Store in localStorage until database is ready
      localStorage.setItem(`userRoutine_${user.id}`, JSON.stringify(routine));
      
      return routine;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userRoutine'] });
      toast({
        title: "Sacred Routine Activated",
        description: "Your pathway has been chosen. Let the initiation begin.",
      });
    },
    onError: (error) => {
      toast({
        title: "Activation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};