import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  ConsciousnessProfile, 
  ConsciousnessLevel, 
  CONSCIOUSNESS_LEVELS,
  LearningPath,
  ConsciousnessMilestone
} from '@/types/consciousness';
import { useToast } from '@/hooks/use-toast';

export const useConsciousnessTracking = () => {
  const [profile, setProfile] = useState<ConsciousnessProfile | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [milestones, setMilestones] = useState<ConsciousnessMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize or fetch consciousness profile
  const initializeProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingProfile, error: fetchError } = await supabase
        .from('consciousness_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        // Create new profile
        const newProfile: Omit<ConsciousnessProfile, 'id' | 'created_at' | 'updated_at'> = {
          user_id: user.id,
          current_level: 'initiate',
          total_points: 0,
          level_progress: 0,
          next_level_points: 100,
          awareness: 20,
          presence: 20,
          compassion: 20,
          wisdom: 20,
          creativity: 20,
          intuition: 20,
          integration: 20,
          service: 20,
          preferred_content_types: ['video', 'audio'],
          learning_style: 'visual',
          energy_frequency_preference: '528Hz',
          lunar_phase_preference: 'full',
          optimal_learning_times: ['morning', 'evening'],
          journey_start_date: new Date().toISOString(),
          last_activity: new Date().toISOString(),
          total_learning_hours: 0,
          content_consumed: 0,
          insights_shared: 0
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('consciousness_profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;
        setProfile(createdProfile);
      }
    } catch (error: any) {
      console.error('Error initializing consciousness profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize consciousness tracking',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add points and update consciousness dimensions
  const addPoints = useCallback(async (
    points: number,
    dimension?: keyof Pick<ConsciousnessProfile, 'awareness' | 'presence' | 'compassion' | 'wisdom' | 'creativity' | 'intuition' | 'integration' | 'service'>,
    dimensionPoints?: number
  ) => {
    if (!profile) return;

    try {
      const newTotalPoints = profile.total_points + points;
      const currentLevel = CONSCIOUSNESS_LEVELS[profile.current_level];
      
      // Check if user should level up
      let newLevel = profile.current_level;
      let newLevelProgress = profile.level_progress;
      let newNextLevelPoints = profile.next_level_points;

      if (newTotalPoints >= currentLevel.max_points) {
        // Find next level
        const levelKeys = Object.keys(CONSCIOUSNESS_LEVELS) as ConsciousnessLevel[];
        const currentIndex = levelKeys.indexOf(profile.current_level);
        
        if (currentIndex < levelKeys.length - 1) {
          newLevel = levelKeys[currentIndex + 1];
          const nextLevelConfig = CONSCIOUSNESS_LEVELS[newLevel];
          newLevelProgress = ((newTotalPoints - nextLevelConfig.min_points) / (nextLevelConfig.max_points - nextLevelConfig.min_points)) * 100;
          newNextLevelPoints = nextLevelConfig.max_points;
          
          // Celebrate level up
          toast({
            title: '🎉 Level Up!',
            description: `Congratulations! You've reached ${CONSCIOUSNESS_LEVELS[newLevel].title}`,
          });
        } else {
          newLevelProgress = 100;
        }
      } else {
        newLevelProgress = ((newTotalPoints - currentLevel.min_points) / (currentLevel.max_points - currentLevel.min_points)) * 100;
      }

      // Update dimension if specified
      const updatedDimensions = { ...profile };
      if (dimension && dimensionPoints) {
        updatedDimensions[dimension] = Math.min(100, profile[dimension] + dimensionPoints);
      }

      const updatedProfile: Partial<ConsciousnessProfile> = {
        total_points: newTotalPoints,
        current_level: newLevel,
        level_progress: newLevelProgress,
        next_level_points: newNextLevelPoints,
        last_activity: new Date().toISOString(),
        ...(dimension && dimensionPoints ? { [dimension]: updatedDimensions[dimension] } : {})
      };

      const { error } = await supabase
        .from('consciousness_profiles')
        .update(updatedProfile)
        .eq('user_id', profile.user_id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);

      // Check for milestones
      await checkMilestones(newTotalPoints, newLevel);

    } catch (error: any) {
      console.error('Error adding points:', error);
      toast({
        title: 'Error',
        description: 'Failed to update consciousness progress',
        variant: 'destructive'
      });
    }
  }, [profile, toast]);

  // Track content consumption
  const trackContentConsumption = useCallback(async (
    contentId: string,
    durationMinutes: number,
    engagementScore: number
  ) => {
    if (!profile) return;

    try {
      // Calculate points based on duration and engagement
      const basePoints = Math.floor(durationMinutes / 5); // 1 point per 5 minutes
      const engagementMultiplier = 1 + (engagementScore * 0.5); // Up to 1.5x multiplier
      const totalPoints = Math.floor(basePoints * engagementMultiplier);

      // Add points
      await addPoints(totalPoints, 'wisdom', Math.floor(totalPoints * 0.1));

      // Update learning hours and content consumed
      const updatedProfile = {
        total_learning_hours: profile.total_learning_hours + (durationMinutes / 60),
        content_consumed: profile.content_consumed + 1,
        last_activity: new Date().toISOString()
      };

      const { error } = await supabase
        .from('consciousness_profiles')
        .update(updatedProfile)
        .eq('user_id', profile.user_id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);

    } catch (error: any) {
      console.error('Error tracking content consumption:', error);
    }
  }, [profile, addPoints]);

  // Track insight sharing
  const trackInsightSharing = useCallback(async (insightText: string) => {
    if (!profile) return;

    try {
      // Calculate points based on insight quality (simple heuristic)
      const wordCount = insightText.split(' ').length;
      const qualityScore = Math.min(1, wordCount / 50); // Max quality at 50+ words
      const points = Math.floor(10 + (qualityScore * 20)); // 10-30 points

      await addPoints(points, 'service', Math.floor(points * 0.2));

      // Update insights shared
      const updatedProfile = {
        insights_shared: profile.insights_shared + 1,
        last_activity: new Date().toISOString()
      };

      const { error } = await supabase
        .from('consciousness_profiles')
        .update(updatedProfile)
        .eq('user_id', profile.user_id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);

    } catch (error: any) {
      console.error('Error tracking insight sharing:', error);
    }
  }, [profile, addPoints]);

  // Check for milestones
  const checkMilestones = useCallback(async (totalPoints: number, currentLevel: ConsciousnessLevel) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all possible milestones for this level
      const levelMilestones = Object.entries(CONSCIOUSNESS_LEVELS)
        .filter(([_, config]) => config.min_points <= totalPoints)
        .map(([level, config]) => ({
          level: level as ConsciousnessLevel,
          points_required: config.min_points,
          title: config.title,
          description: config.description
        }));

      // Check which milestones haven't been achieved yet
      const { data: achievedMilestones } = await supabase
        .from('consciousness_milestones')
        .select('level')
        .eq('user_id', user.id);

      const achievedLevels = achievedMilestones?.map(m => m.level) || [];
      const newMilestones = levelMilestones.filter(m => !achievedLevels.includes(m.level));

      // Create new milestone records
      if (newMilestones.length > 0) {
        const milestoneData = newMilestones.map(milestone => ({
          user_id: user.id,
          level: milestone.level,
          title: milestone.title,
          description: milestone.description,
          points_required: milestone.points_required,
          achieved_at: new Date().toISOString(),
          celebration_data: {
            sacred_geometry: CONSCIOUSNESS_LEVELS[milestone.level].sacred_symbol,
            energy_frequency: '528Hz',
            meditation_guidance: `Meditate on the energy of ${milestone.title}`,
            next_steps: CONSCIOUSNESS_LEVELS[milestone.level].next_level_requirements
          }
        }));

        const { error } = await supabase
          .from('consciousness_milestones')
          .insert(milestoneData);

        if (error) throw error;

        // Update local milestones
        setMilestones(prev => [...prev, ...milestoneData]);

        // Show celebration for each new milestone
        newMilestones.forEach(milestone => {
          toast({
            title: `🏆 Milestone Achieved!`,
            description: `You've reached ${milestone.title}`,
          });
        });
      }

    } catch (error: any) {
      console.error('Error checking milestones:', error);
    }
  }, [toast]);

  // Get learning recommendations
  const getLearningRecommendations = useCallback(async () => {
    if (!profile) return [];

    try {
      // This would typically call an AI service for personalized recommendations
      // For now, we'll return basic recommendations based on consciousness level
      const currentLevel = CONSCIOUSNESS_LEVELS[profile.current_level];
      
      const recommendations = [
        {
          id: '1',
          title: `${currentLevel.title} Development Path`,
          description: `Continue your journey as a ${currentLevel.title}`,
          consciousness_level: profile.current_level,
          total_duration_hours: 10,
          current_progress: 0,
          phases: [
            {
              id: '1',
              title: 'Foundation',
              description: 'Build your foundation',
              duration_hours: 3,
              content_items: [],
              practices: ['Daily meditation', 'Mindful awareness'],
              milestones: ['Complete foundation phase'],
              energy_work: ['Root chakra activation']
            }
          ],
          prerequisites: [],
          outcomes: ['Increased awareness', 'Better presence'],
          energy_frequency: '528Hz',
          chakra_focus: currentLevel.chakra_focus,
          lunar_timing: 'any'
        }
      ];

      return recommendations;
    } catch (error: any) {
      console.error('Error getting learning recommendations:', error);
      return [];
    }
  }, [profile]);

  // Update learning preferences
  const updateLearningPreferences = useCallback(async (preferences: Partial<Pick<ConsciousnessProfile, 'learning_style' | 'energy_frequency_preference' | 'lunar_phase_preference' | 'optimal_learning_times' | 'preferred_content_types'>>) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('consciousness_profiles')
        .update(preferences)
        .eq('user_id', profile.user_id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...preferences } : null);

      toast({
        title: 'Preferences Updated',
        description: 'Your learning preferences have been updated',
      });

    } catch (error: any) {
      console.error('Error updating learning preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update learning preferences',
        variant: 'destructive'
      });
    }
  }, [profile, toast]);

  // Initialize on mount
  useEffect(() => {
    initializeProfile();
  }, [initializeProfile]);

  return {
    profile,
    learningPaths,
    milestones,
    loading,
    addPoints,
    trackContentConsumption,
    trackInsightSharing,
    getLearningRecommendations,
    updateLearningPreferences,
    checkMilestones
  };
};
