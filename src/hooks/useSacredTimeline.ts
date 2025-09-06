import { useState, useEffect } from 'react';

interface TimelineEvent {
  id: string;
  type: 'milestone' | 'insight' | 'breakthrough' | 'integration';
  title: string;
  description: string;
  timestamp: string;
  pathway: string;
  consciousnessLevel: number;
  data: any;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  pathway: string;
  achievedAt: string;
  consciousnessLevel: number;
  rewards: string[];
}

export const useSacredTimeline = () => {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    setIsLoading(true);
    try {
      // Load timeline from localStorage or API
      const savedTimeline = localStorage.getItem('sacred-timeline');
      const savedMilestones = localStorage.getItem('sacred-milestones');
      
      if (savedTimeline) {
        setTimeline(JSON.parse(savedTimeline));
      }
      
      if (savedMilestones) {
        setMilestones(JSON.parse(savedMilestones));
      }
    } catch (error) {
      console.error('Error loading timeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const recordMilestone = async (pathway: string, journeyData: any): Promise<void> => {
    try {
      const milestone: Milestone = {
        id: `milestone-${Date.now()}`,
        title: `${pathway} Journey Completed`,
        description: `Successfully completed the ${pathway} pathway with ${journeyData.completionRate?.toFixed(0) || 100}% completion rate`,
        pathway,
        achievedAt: new Date().toISOString(),
        consciousnessLevel: journeyData.consciousnessLevel || 1,
        rewards: [
          'Consciousness Level +0.1',
          'New Sacred Practice Unlocked',
          'Resonance Field Enhanced',
          'Community Recognition'
        ]
      };

      const newMilestones = [...milestones, milestone];
      setMilestones(newMilestones);
      localStorage.setItem('sacred-milestones', JSON.stringify(newMilestones));

      // Add to timeline
      const timelineEvent: TimelineEvent = {
        id: `event-${Date.now()}`,
        type: 'milestone',
        title: milestone.title,
        description: milestone.description,
        timestamp: milestone.achievedAt,
        pathway,
        consciousnessLevel: milestone.consciousnessLevel,
        data: journeyData
      };

      const newTimeline = [...timeline, timelineEvent];
      setTimeline(newTimeline);
      localStorage.setItem('sacred-timeline', JSON.stringify(newTimeline));

    } catch (error) {
      console.error('Error recording milestone:', error);
      throw error;
    }
  };

  const addTimelineEvent = async (event: Omit<TimelineEvent, 'id' | 'timestamp'>): Promise<void> => {
    try {
      const timelineEvent: TimelineEvent = {
        ...event,
        id: `event-${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      const newTimeline = [...timeline, timelineEvent];
      setTimeline(newTimeline);
      localStorage.setItem('sacred-timeline', JSON.stringify(newTimeline));
    } catch (error) {
      console.error('Error adding timeline event:', error);
      throw error;
    }
  };

  const getEvolutionTimeline = (): TimelineEvent[] => {
    return timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getPathwayTimeline = (pathway: string): TimelineEvent[] => {
    return timeline.filter(event => event.pathway === pathway);
  };

  const getConsciousnessEvolution = (): { level: number; date: string }[] => {
    const evolution: { level: number; date: string }[] = [];
    
    timeline.forEach(event => {
      if (event.consciousnessLevel) {
        evolution.push({
          level: event.consciousnessLevel,
          date: event.timestamp
        });
      }
    });

    return evolution.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getRecentMilestones = (limit: number = 5): Milestone[] => {
    return milestones
      .sort((a, b) => new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime())
      .slice(0, limit);
  };

  const getConsciousnessLevel = (): number => {
    if (timeline.length === 0) return 1;
    
    const latestEvent = timeline
      .filter(event => event.consciousnessLevel)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    return latestEvent?.consciousnessLevel || 1;
  };

  const getPathwayProgress = (pathway: string): { completed: number; total: number; percentage: number } => {
    const pathwayEvents = timeline.filter(event => event.pathway === pathway);
    const completedJourneys = pathwayEvents.filter(event => event.type === 'milestone').length;
    
    // Assuming 3 main pathways
    const total = 3;
    const percentage = (completedJourneys / total) * 100;
    
    return {
      completed: completedJourneys,
      total,
      percentage
    };
  };

  const getInsights = (): TimelineEvent[] => {
    return timeline.filter(event => event.type === 'insight');
  };

  const getBreakthroughs = (): TimelineEvent[] => {
    return timeline.filter(event => event.type === 'breakthrough');
  };

  const clearTimeline = (): void => {
    setTimeline([]);
    setMilestones([]);
    localStorage.removeItem('sacred-timeline');
    localStorage.removeItem('sacred-milestones');
  };

  return {
    timeline,
    milestones,
    isLoading,
    recordMilestone,
    addTimelineEvent,
    getEvolutionTimeline,
    getPathwayTimeline,
    getConsciousnessEvolution,
    getRecentMilestones,
    getConsciousnessLevel,
    getPathwayProgress,
    getInsights,
    getBreakthroughs,
    clearTimeline
  };
};
