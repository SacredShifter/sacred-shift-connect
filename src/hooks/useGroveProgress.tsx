import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface GroveJourneyProgress {
  id: string;
  user_id: string;
  pathway_id: string;
  current_step: number;
  total_steps: number;
  completed_steps: number[];
  consciousness_level: number;
  resonance_field: any;
  journey_data: any;
  current_step_title?: string;
  started_at: string;
  last_activity_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useGroveProgress = () => {
  const { user } = useAuth();
  const [currentJourney, setCurrentJourney] = useState<GroveJourneyProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current journey progress
  const loadCurrentJourney = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('grove_journey_progress')
        .select('*')
        .eq('user_id', user.id)
        .is('completed_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // If table doesn't exist (404 error), create a fallback
        if (error.code === 'PGRST301' || error.message?.includes('relation "grove_journey_progress" does not exist') || error.message?.includes('404')) {
          console.warn('Grove journey progress table not found, using fallback');
          setCurrentJourney(null);
          return;
        }
        throw error;
      }

      setCurrentJourney(data);
    } catch (err) {
      console.error('Error loading current journey:', err);
      // Don't set error for missing table, just use fallback
      if (err instanceof Error && (err.message?.includes('relation "grove_journey_progress" does not exist') || err.message?.includes('404'))) {
        console.warn('Using fallback for missing grove_journey_progress table');
        setCurrentJourney(null);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load journey');
      }
    } finally {
      setLoading(false);
    }
  };

  // Start a new journey
  const startJourney = async (pathwayId: string, pathwayData: any) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const journeyData = {
        user_id: user.id,
        pathway_id: pathwayId,
        current_step: 0,
        total_steps: pathwayData.journeySteps?.length || 1,
        completed_steps: [],
        consciousness_level: pathwayData.consciousnessLevel || 1.0,
        resonance_field: pathwayData.resonanceField || {},
        journey_data: {
          pathway: pathwayData,
          startTime: new Date().toISOString(),
          steps: [],
          insights: []
        },
        current_step_title: pathwayData.journeySteps?.[0]?.title || 'Starting Journey',
        started_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('grove_journey_progress')
        .insert(journeyData)
        .select()
        .single();

      if (error) {
        // If table doesn't exist (404 error), create a fallback journey object
        if (error.code === 'PGRST301' || error.message?.includes('relation "grove_journey_progress" does not exist') || error.message?.includes('404')) {
          console.warn('Grove journey progress table not found, using fallback');
          const fallbackJourney = {
            id: `fallback-${Date.now()}`,
            ...journeyData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setCurrentJourney(fallbackJourney);
          return fallbackJourney;
        }
        throw error;
      }

      setCurrentJourney(data);
      return data;
    } catch (err) {
      console.error('Error starting journey:', err);
      // Create fallback journey if table doesn't exist
      if (err instanceof Error && (err.message?.includes('relation "grove_journey_progress" does not exist') || err.message?.includes('404'))) {
        console.warn('Using fallback for missing grove_journey_progress table');
        const fallbackJourney = {
          id: `fallback-${Date.now()}`,
          user_id: user.id,
          pathway_id: pathwayId,
          current_step: 0,
          total_steps: pathwayData.journeySteps?.length || 1,
          completed_steps: [],
          consciousness_level: pathwayData.consciousnessLevel || 1.0,
          resonance_field: pathwayData.resonanceField || {},
          journey_data: {
            pathway: pathwayData,
            startTime: new Date().toISOString(),
            steps: [],
            insights: []
          },
          current_step_title: pathwayData.journeySteps?.[0]?.title || 'Starting Journey',
          started_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setCurrentJourney(fallbackJourney);
        return fallbackJourney;
      }
      setError(err instanceof Error ? err.message : 'Failed to start journey');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Complete a step
  const completeStep = async (stepData: any, insights: string[] = []) => {
    if (!currentJourney || !user) return;

    setLoading(true);
    setError(null);

    try {
      const updatedCompletedSteps = [...currentJourney.completed_steps, currentJourney.current_step];
      const newCurrentStep = currentJourney.current_step + 1;

      const updates = {
        current_step: newCurrentStep,
        completed_steps: updatedCompletedSteps,
        current_step_title: stepData.title,
        last_activity_at: new Date().toISOString(),
        journey_data: {
          ...currentJourney.journey_data,
          steps: [
            ...(currentJourney.journey_data.steps || []),
            {
              step: currentJourney.current_step,
              title: stepData.title,
              completed_at: new Date().toISOString(),
              insights: insights
            }
          ],
          insights: [
            ...(currentJourney.journey_data.insights || []),
            ...insights
          ]
        }
      };

      // If it's a fallback journey, just update the local state
      if (currentJourney.id.startsWith('fallback-')) {
        const updatedJourney = {
          ...currentJourney,
          ...updates,
          updated_at: new Date().toISOString()
        };
        setCurrentJourney(updatedJourney);
        return updatedJourney;
      }

      const { data, error } = await supabase
        .from('grove_journey_progress')
        .update(updates)
        .eq('id', currentJourney.id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST301' || error.message?.includes('relation "grove_journey_progress" does not exist') || error.message?.includes('404')) {
          // Fallback to local state update
          const updatedJourney = {
            ...currentJourney,
            ...updates,
            updated_at: new Date().toISOString()
          };
          setCurrentJourney(updatedJourney);
          return updatedJourney;
        }
        throw error;
      }

      setCurrentJourney(data);
      return data;
    } catch (err) {
      console.error('Error completing step:', err);
      // Fallback to local state update
      if (err instanceof Error && (err.message?.includes('relation "grove_journey_progress" does not exist') || err.message?.includes('404'))) {
        const updatedJourney = {
          ...currentJourney,
          current_step: currentJourney.current_step + 1,
          completed_steps: [...currentJourney.completed_steps, currentJourney.current_step],
          current_step_title: stepData.title,
          last_activity_at: new Date().toISOString(),
          journey_data: {
            ...currentJourney.journey_data,
            steps: [
              ...(currentJourney.journey_data.steps || []),
              {
                step: currentJourney.current_step,
                title: stepData.title,
                completed_at: new Date().toISOString(),
                insights: insights
              }
            ],
            insights: [
              ...(currentJourney.journey_data.insights || []),
              ...insights
            ]
          },
          updated_at: new Date().toISOString()
        };
        setCurrentJourney(updatedJourney);
        return updatedJourney;
      }
      setError(err instanceof Error ? err.message : 'Failed to complete step');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Complete the entire journey
  const completeJourney = async () => {
    if (!currentJourney || !user) return;

    setLoading(true);
    setError(null);

    try {
      const updates = {
        completed_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
        journey_data: {
          ...currentJourney.journey_data,
          endTime: new Date().toISOString(),
          completionRate: (currentJourney.completed_steps.length / currentJourney.total_steps) * 100
        }
      };

      // If it's a fallback journey, just clear the local state
      if (currentJourney.id.startsWith('fallback-')) {
        setCurrentJourney(null);
        return { ...currentJourney, ...updates };
      }

      const { data, error } = await supabase
        .from('grove_journey_progress')
        .update(updates)
        .eq('id', currentJourney.id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST301' || error.message?.includes('relation "grove_journey_progress" does not exist') || error.message?.includes('404')) {
          // Fallback to local state update
          setCurrentJourney(null);
          return { ...currentJourney, ...updates };
        }
        throw error;
      }

      setCurrentJourney(null); // Clear current journey as it's completed
      return data;
    } catch (err) {
      console.error('Error completing journey:', err);
      // Fallback to local state update
      if (err instanceof Error && (err.message?.includes('relation "grove_journey_progress" does not exist') || err.message?.includes('404'))) {
        setCurrentJourney(null);
        return { ...currentJourney, ...updates };
      }
      setError(err instanceof Error ? err.message : 'Failed to complete journey');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load journey on mount
  useEffect(() => {
    if (user) {
      loadCurrentJourney();
    }
  }, [user]);

  return {
    currentJourney,
    loading,
    error,
    startJourney,
    completeStep,
    completeJourney,
    loadCurrentJourney
  };
};
