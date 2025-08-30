import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

export interface RoutineCompletion {
  id: string;
  user_id: string;
  routine_id: string;
  completed_modules: string[];
  completion_percentage: number;
  completion_date: string;
  insights: string | null;
  resonance_level: number;
  created_at: string;
}

export interface RoutineProgress {
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt: string | null;
  weeklyProgress: RoutineCompletion[];
  badge: 'initiate' | 'shifter' | 'custodian' | 'torch_bearer' | 'elder' | null;
  nextBadgeRequirement: number;
}

export const useRoutineProgress = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['routineProgress', user?.id],
    queryFn: async (): Promise<RoutineProgress | null> => {
      if (!user) return null;
      
      // Use localStorage for mock data until database migration is approved
      const storedCompletions = localStorage.getItem(`routineCompletions_${user.id}`);
      const completions: RoutineCompletion[] = storedCompletions ? JSON.parse(storedCompletions) : [];
      
      const totalCompletions = completions.length;
      const lastCompletion = completions[0];
      
      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      
      // Mock streak calculation
      if (totalCompletions > 0) {
        currentStreak = Math.min(totalCompletions, 5); // Mock current streak
        longestStreak = Math.max(currentStreak, Math.floor(totalCompletions / 3));
      }
      
      // Get weekly progress (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyProgress = completions.filter(completion => 
        new Date(completion.completion_date) >= weekAgo
      );
      
      // Determine badge level
      let badge: RoutineProgress['badge'] = null;
      let nextBadgeRequirement = 1;
      
      if (totalCompletions >= 1000) {
        badge = 'elder';
        nextBadgeRequirement = 1000;
      } else if (totalCompletions >= 365) {
        badge = 'torch_bearer';
        nextBadgeRequirement = 1000;
      } else if (totalCompletions >= 100) {
        badge = 'custodian';
        nextBadgeRequirement = 365;
      } else if (totalCompletions >= 7) {
        badge = 'shifter';
        nextBadgeRequirement = 100;
      } else if (totalCompletions >= 1) {
        badge = 'initiate';
        nextBadgeRequirement = 7;
      } else {
        nextBadgeRequirement = 1;
      }
      
      return {
        totalCompletions,
        currentStreak,
        longestStreak,
        lastCompletedAt: lastCompletion?.completion_date || null,
        weeklyProgress,
        badge,
        nextBadgeRequirement
      };
    },
    enabled: !!user?.id
  });
};

export const useCompleteRoutine = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      routineId,
      completedModules,
      insights,
      resonanceLevel = 5
    }: {
      routineId: string;
      completedModules: string[];
      insights?: string;
      resonanceLevel?: number;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const completionPercentage = (completedModules.length / 5) * 100;
      
      const completion: RoutineCompletion = {
        id: `completion_${Date.now()}`,
        user_id: user.id,
        routine_id: routineId,
        completed_modules: completedModules,
        completion_percentage: completionPercentage,
        completion_date: new Date().toISOString().split('T')[0],
        insights: insights || null,
        resonance_level: resonanceLevel,
        created_at: new Date().toISOString()
      };
      
      // Store in localStorage until database is ready
      const storedCompletions = localStorage.getItem(`routineCompletions_${user.id}`);
      const completions: RoutineCompletion[] = storedCompletions ? JSON.parse(storedCompletions) : [];
      completions.unshift(completion); // Add to beginning
      localStorage.setItem(`routineCompletions_${user.id}`, JSON.stringify(completions.slice(0, 100))); // Keep last 100
      
      return completion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routineProgress'] });
      queryClient.invalidateQueries({ queryKey: ['userRoutine'] });
    }
  });
};