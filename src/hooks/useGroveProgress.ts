import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useAuraChat } from '@/hooks/useAuraChat';

export interface GroveJourneyProgress {
  id: string;
  pathwayId: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  consciousnessLevel: number;
  resonanceField: {
    personalFrequency: number;
    collectiveResonance: number;
    chakraAlignment: Array<{
      id: string;
      name: string;
      level: number;
      color: string;
      frequency: number;
      isActive: boolean;
    }>;
  };
  journeyData: {
    insights: string[];
    breakthroughs: string[];
    challenges: string[];
    recommendations: string[];
  };
  startedAt: string;
  lastActivityAt: string;
  completedAt?: string;
}

export interface GroveAnalytics {
  totalJourneys: number;
  completedJourneys: number;
  averageConsciousnessLevel: number;
  totalTimeSpent: number;
  favoritePathway: string;
  recentActivity: Array<{
    pathwayId: string;
    stepTitle: string;
    completedAt: string;
    consciousnessGain: number;
  }>;
}

export const useGroveProgress = () => {
  const { user } = useAuth();
  const { sendMessage: auraSendMessage } = useAuraChat();
  const [currentJourney, setCurrentJourney] = useState<GroveJourneyProgress | null>(null);
  const [analytics, setAnalytics] = useState<GroveAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user's Grove progress
  useEffect(() => {
    if (!user) return;

    const loadGroveProgress = async () => {
      try {
        // Load current active journey
        const { data: activeJourney } = await supabase
          .from('grove_journey_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed_at', null)
          .order('started_at', { ascending: false })
          .limit(1)
          .single();

        if (activeJourney) {
          setCurrentJourney(activeJourney);
        }

        // Load analytics
        const { data: journeyHistory } = await supabase
          .from('grove_journey_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false });

        if (journeyHistory) {
          const totalJourneys = journeyHistory.length;
          const completedJourneys = journeyHistory.filter(j => j.completed_at).length;
          const averageConsciousnessLevel = journeyHistory.reduce((sum, j) => sum + j.consciousness_level, 0) / totalJourneys;
          const totalTimeSpent = journeyHistory.reduce((sum, j) => {
            const start = new Date(j.started_at);
            const end = j.completed_at ? new Date(j.completed_at) : new Date();
            return sum + (end.getTime() - start.getTime());
          }, 0);

          // Find favorite pathway
          const pathwayCounts = journeyHistory.reduce((acc, j) => {
            acc[j.pathway_id] = (acc[j.pathway_id] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const favoritePathway = Object.entries(pathwayCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'inner-wisdom';

          // Recent activity
          const recentActivity = journeyHistory
            .filter(j => j.completed_at)
            .slice(0, 10)
            .map(j => ({
              pathwayId: j.pathway_id,
              stepTitle: j.current_step_title || 'Unknown Step',
              completedAt: j.completed_at,
              consciousnessGain: j.consciousness_level - (j.consciousness_level || 1)
            }));

          setAnalytics({
            totalJourneys,
            completedJourneys,
            averageConsciousnessLevel: Math.round(averageConsciousnessLevel * 10) / 10,
            totalTimeSpent: Math.round(totalTimeSpent / (1000 * 60 * 60)), // Convert to hours
            favoritePathway,
            recentActivity
          });
        }
      } catch (error) {
        console.error('Error loading Grove progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGroveProgress();
  }, [user]);

  // Start a new journey
  const startJourney = async (pathwayId: string, pathwayData: any) => {
    if (!user) return null;

    try {
      const journeyData = {
        user_id: user.id,
        pathway_id: pathwayId,
        current_step: 0,
        total_steps: pathwayData.journeySteps.length,
        completed_steps: [],
        consciousness_level: 1,
        resonance_field: pathwayData.resonanceField,
        journey_data: {
          insights: [],
          breakthroughs: [],
          challenges: [],
          recommendations: []
        },
        started_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('grove_journey_progress')
        .insert([journeyData])
        .select()
        .single();

      if (error) throw error;

      setCurrentJourney(data);
      return data;
    } catch (error) {
      console.error('Error starting journey:', error);
      return null;
    }
  };

  // Complete a journey step
  const completeStep = async (stepData: any, stepInsights: string[]) => {
    if (!currentJourney || !user) return;

    try {
      // Get Aura AI insights for this step
      const auraResponse = await auraSendMessage({
        prompt: `Journey Step: ${stepData.title}\nDescription: ${stepData.description}\nUser Insights: ${stepInsights.join(', ')}\n\nProvide consciousness evolution guidance and next steps.`,
        context: {
          pathwayId: currentJourney.pathwayId,
          currentStep: currentJourney.currentStep,
          consciousnessLevel: currentJourney.consciousnessLevel
        }
      });

      const updatedJourney = {
        ...currentJourney,
        currentStep: currentJourney.currentStep + 1,
        completedSteps: [...currentJourney.completedSteps, currentJourney.currentStep],
        consciousnessLevel: Math.min(currentJourney.consciousnessLevel + 0.1, 5), // Increment consciousness
        journeyData: {
          ...currentJourney.journeyData,
          insights: [...currentJourney.journeyData.insights, ...stepInsights],
          recommendations: [...currentJourney.journeyData.recommendations, auraResponse?.content || '']
        },
        lastActivityAt: new Date().toISOString()
      };

      // Update in database
      const { error } = await supabase
        .from('grove_journey_progress')
        .update({
          current_step: updatedJourney.currentStep,
          completed_steps: updatedJourney.completedSteps,
          consciousness_level: updatedJourney.consciousnessLevel,
          journey_data: updatedJourney.journeyData,
          last_activity_at: updatedJourney.lastActivityAt
        })
        .eq('id', currentJourney.id);

      if (error) throw error;

      setCurrentJourney(updatedJourney);

      // Update user dashboard analytics
      await updateDashboardAnalytics();

      return updatedJourney;
    } catch (error) {
      console.error('Error completing step:', error);
    }
  };

  // Complete entire journey
  const completeJourney = async () => {
    if (!currentJourney || !user) return;

    try {
      const { error } = await supabase
        .from('grove_journey_progress')
        .update({
          completed_at: new Date().toISOString(),
          consciousness_level: Math.min(currentJourney.consciousnessLevel + 0.5, 5) // Bonus for completion
        })
        .eq('id', currentJourney.id);

      if (error) throw error;

      setCurrentJourney(null);
      await updateDashboardAnalytics();
    } catch (error) {
      console.error('Error completing journey:', error);
    }
  };

  // Update dashboard analytics
  const updateDashboardAnalytics = async () => {
    if (!user) return;

    try {
      // Update user's overall consciousness level
      const { data: allJourneys } = await supabase
        .from('grove_journey_progress')
        .select('consciousness_level')
        .eq('user_id', user.id);

      if (allJourneys && allJourneys.length > 0) {
        const avgConsciousnessLevel = allJourneys.reduce((sum, j) => sum + j.consciousness_level, 0) / allJourneys.length;
        
        // Update user profile with consciousness level
        await supabase
          .from('profiles')
          .update({
            consciousness_level: Math.round(avgConsciousnessLevel * 10) / 10,
            last_grove_activity: new Date().toISOString()
          })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error updating dashboard analytics:', error);
    }
  };

  return {
    currentJourney,
    analytics,
    isLoading,
    startJourney,
    completeStep,
    completeJourney,
    updateDashboardAnalytics
  };
};
