import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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
      
      try {
        // Try to fetch from database first
        const { data: completions, error } = await supabase
          .from('routine_completion_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('completion_date', { ascending: false });
        
        if (error) {
          console.error('Error fetching routine completions:', error);
          // Fall back to localStorage if database query fails
          return getLocalStorageProgress(user.id);
        }
        
        if (!completions || completions.length === 0) {
          // If no database records, check localStorage for migration
          const localProgress = getLocalStorageProgress(user.id);
          if (localProgress && localProgress.totalCompletions > 0) {
            return localProgress;
          }
          
          // Return empty progress
          return {
            totalCompletions: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastCompletedAt: null,
            weeklyProgress: [],
            badge: null,
            nextBadgeRequirement: 1
          };
        }
        
        // Calculate progress from database data
        const totalCompletions = completions.length;
        const lastCompletion = completions[0];
        
        // Calculate streaks from completion dates
        let currentStreak = calculateCurrentStreak(completions);
        let longestStreak = calculateLongestStreak(completions);
        
        // Get weekly progress (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weeklyProgress = completions
          .filter(completion => new Date(completion.completion_date) >= weekAgo)
          .map(completion => ({
            id: completion.id,
            user_id: completion.user_id,
            routine_id: completion.user_routine_id, // Use correct field name
            completed_modules: (completion.completed_practices as string[]) || [],
            completion_percentage: completion.completion_percentage,
            completion_date: completion.completion_date,
            insights: completion.insights,
            resonance_level: 5, // Default value since field doesn't exist
            created_at: completion.created_at
          }));
        
        // Determine badge level
        const { badge, nextBadgeRequirement } = calculateBadgeLevel(totalCompletions);
        
        return {
          totalCompletions,
          currentStreak,
          longestStreak,
          lastCompletedAt: lastCompletion?.completion_date || null,
          weeklyProgress,
          badge,
          nextBadgeRequirement
        };
      } catch (error) {
        console.error('Error in useRoutineProgress:', error);
        // Fall back to localStorage
        return getLocalStorageProgress(user.id);
      }
    },
    enabled: !!user?.id
  });
};

// Helper function to get progress from localStorage (fallback)
function getLocalStorageProgress(userId: string): RoutineProgress {
  const storedCompletions = localStorage.getItem(`routineCompletions_${userId}`);
  const completions: RoutineCompletion[] = storedCompletions ? JSON.parse(storedCompletions) : [];
  
  const totalCompletions = completions.length;
  const lastCompletion = completions[0];
  
  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  
  if (totalCompletions > 0) {
    currentStreak = Math.min(totalCompletions, 5);
    longestStreak = Math.max(currentStreak, Math.floor(totalCompletions / 3));
  }
  
  // Get weekly progress (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyProgress = completions.filter(completion => 
    new Date(completion.completion_date) >= weekAgo
  );
  
  const { badge, nextBadgeRequirement } = calculateBadgeLevel(totalCompletions);
  
  return {
    totalCompletions,
    currentStreak,
    longestStreak,
    lastCompletedAt: lastCompletion?.completion_date || null,
    weeklyProgress,
    badge,
    nextBadgeRequirement
  };
}

// Helper function to calculate current streak
function calculateCurrentStreak(completions: any[]): number {
  if (!completions.length) return 0;
  
  // Group completions by date
  const dateGroups: Record<string, boolean> = {};
  completions.forEach(completion => {
    const date = completion.completion_date; // Use correct field name
    dateGroups[date] = true;
  });
  
  const dates = Object.keys(dateGroups).sort().reverse();
  let streak = 0;
  let currentDate = new Date();
  
  // Check if user completed today or yesterday to start streak
  const today = currentDate.toISOString().split('T')[0];
  const yesterday = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  let startIndex = -1;
  if (dates.includes(today)) {
    startIndex = dates.indexOf(today);
  } else if (dates.includes(yesterday)) {
    startIndex = dates.indexOf(yesterday);
  }
  
  if (startIndex === -1) return 0;
  
  // Count consecutive days
  for (let i = startIndex; i < dates.length; i++) {
    const expectedDate = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    if (dates[i] === expectedDate) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// Helper function to calculate longest streak
function calculateLongestStreak(completions: any[]): number {
  if (!completions.length) return 0;
  
  // Group completions by date
  const dateGroups: Record<string, boolean> = {};
  completions.forEach(completion => {
    const date = completion.completion_date; // Use correct field name
    dateGroups[date] = true;
  });
  
  const dates = Object.keys(dateGroups).sort();
  let longestStreak = 0;
  let currentStreak = 0;
  
  for (let i = 0; i < dates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const dayDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
  }
  
  return Math.max(longestStreak, currentStreak);
}

// Helper function to calculate badge level
function calculateBadgeLevel(totalCompletions: number): { badge: RoutineProgress['badge'], nextBadgeRequirement: number } {
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
  
  return { badge, nextBadgeRequirement };
}

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