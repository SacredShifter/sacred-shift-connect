// Sacred Timing Integration System
// The Sacred Shifter Developer Engineer's cosmic timing awareness

import { SacredTiming, EnergyFrequency, ENERGY_FREQUENCIES } from '@/types/consciousness';

export interface LunarPhase {
  phase: 'new' | 'waxing' | 'full' | 'waning';
  name: string;
  description: string;
  energy: string;
  recommended_activities: string[];
  content_suggestions: string[];
  meditation_guidance: string;
  color: string;
  symbol: string;
}

export interface SolarPosition {
  position: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night';
  name: string;
  description: string;
  energy: string;
  recommended_activities: string[];
  content_suggestions: string[];
  meditation_guidance: string;
  color: string;
  symbol: string;
}

export interface SacredDay {
  date: string;
  name: string;
  description: string;
  significance: string;
  recommended_activities: string[];
  content_suggestions: string[];
  energy_frequency: string;
  meditation_guidance: string;
  color: string;
  symbol: string;
}

export class SacredTimingEngine {
  private lunarPhases: LunarPhase[] = [
    {
      phase: 'new',
      name: 'New Moon',
      description: 'A time for new beginnings and setting intentions',
      energy: 'Introspective and contemplative',
      recommended_activities: ['Meditation', 'Journaling', 'Intention setting', 'Planning'],
      content_suggestions: ['meditation', 'intention', 'planning', 'new beginnings'],
      meditation_guidance: 'Focus on inner stillness and clarity. Set intentions for the coming cycle.',
      color: '#2D3748',
      symbol: '🌑'
    },
    {
      phase: 'waxing',
      name: 'Waxing Moon',
      description: 'A time for growth, action, and building momentum',
      energy: 'Dynamic and expansive',
      recommended_activities: ['Learning', 'Creating', 'Building', 'Taking action'],
      content_suggestions: ['learning', 'growth', 'action', 'creativity', 'building'],
      meditation_guidance: 'Channel the growing energy into your goals and aspirations.',
      color: '#4A5568',
      symbol: '🌒'
    },
    {
      phase: 'full',
      name: 'Full Moon',
      description: 'A time for celebration, release, and peak energy',
      energy: 'Intense and powerful',
      recommended_activities: ['Celebration', 'Release', 'Healing', 'Manifestation'],
      content_suggestions: ['celebration', 'release', 'healing', 'manifestation', 'power'],
      meditation_guidance: 'Harness the peak energy for transformation and release.',
      color: '#F7FAFC',
      symbol: '🌕'
    },
    {
      phase: 'waning',
      name: 'Waning Moon',
      description: 'A time for reflection, gratitude, and letting go',
      energy: 'Reflective and releasing',
      recommended_activities: ['Reflection', 'Gratitude', 'Letting go', 'Cleansing'],
      content_suggestions: ['reflection', 'gratitude', 'letting go', 'cleansing', 'release'],
      meditation_guidance: 'Release what no longer serves and prepare for renewal.',
      color: '#718096',
      symbol: '🌖'
    }
  ];

  private solarPositions: SolarPosition[] = [
    {
      position: 'dawn',
      name: 'Dawn',
      description: 'The sacred time of new beginnings and fresh energy',
      energy: 'Fresh and hopeful',
      recommended_activities: ['Sunrise meditation', 'Intention setting', 'Gentle movement'],
      content_suggestions: ['meditation', 'morning', 'intention', 'gentle', 'fresh start'],
      meditation_guidance: 'Welcome the new day with gratitude and intention.',
      color: '#FFD700',
      symbol: '🌅'
    },
    {
      position: 'morning',
      name: 'Morning',
      description: 'A time for active learning and productivity',
      energy: 'Active and focused',
      recommended_activities: ['Learning', 'Work', 'Exercise', 'Planning'],
      content_suggestions: ['learning', 'productivity', 'focus', 'work', 'education'],
      meditation_guidance: 'Channel the morning energy into focused learning and growth.',
      color: '#FFA500',
      symbol: '☀️'
    },
    {
      position: 'noon',
      name: 'Noon',
      description: 'The peak of solar energy and power',
      energy: 'Powerful and intense',
      recommended_activities: ['Power meditation', 'Manifestation', 'Leadership', 'Decision making'],
      content_suggestions: ['power', 'manifestation', 'leadership', 'decision', 'peak'],
      meditation_guidance: 'Harness the peak solar energy for powerful transformation.',
      color: '#FF8C00',
      symbol: '☀️'
    },
    {
      position: 'afternoon',
      name: 'Afternoon',
      description: 'A time for integration and practical application',
      energy: 'Balanced and practical',
      recommended_activities: ['Integration', 'Practice', 'Application', 'Teaching'],
      content_suggestions: ['integration', 'practice', 'application', 'teaching', 'balance'],
      meditation_guidance: 'Integrate your morning insights into practical application.',
      color: '#FF7F50',
      symbol: '🌤️'
    },
    {
      position: 'evening',
      name: 'Evening',
      description: 'A time for reflection and gratitude',
      energy: 'Reflective and grateful',
      recommended_activities: ['Reflection', 'Gratitude', 'Review', 'Gentle practice'],
      content_suggestions: ['reflection', 'gratitude', 'review', 'gentle', 'evening'],
      meditation_guidance: 'Reflect on the day with gratitude and prepare for rest.',
      color: '#FF6347',
      symbol: '🌇'
    },
    {
      position: 'night',
      name: 'Night',
      description: 'A time for deep rest and inner work',
      energy: 'Deep and introspective',
      recommended_activities: ['Deep meditation', 'Dream work', 'Inner journey', 'Rest'],
      content_suggestions: ['deep meditation', 'dreams', 'inner work', 'rest', 'night'],
      meditation_guidance: 'Enter the depths of consciousness for deep transformation.',
      color: '#191970',
      symbol: '🌙'
    }
  ];

  private sacredDays: SacredDay[] = [
    {
      date: '2024-01-01',
      name: 'New Year\'s Day',
      description: 'A time for new beginnings and fresh starts',
      significance: 'Universal day of renewal and intention setting',
      recommended_activities: ['Intention setting', 'Vision boarding', 'Gratitude practice'],
      content_suggestions: ['new year', 'intention', 'vision', 'gratitude', 'renewal'],
      energy_frequency: '528Hz',
      meditation_guidance: 'Set powerful intentions for the year ahead.',
      color: '#FFD700',
      symbol: '🎊'
    },
    {
      date: '2024-02-14',
      name: 'Valentine\'s Day',
      description: 'A day of love and heart opening',
      significance: 'Universal day of love and compassion',
      recommended_activities: ['Heart meditation', 'Love practices', 'Compassion work'],
      content_suggestions: ['love', 'heart', 'compassion', 'relationships', 'connection'],
      energy_frequency: '528Hz',
      meditation_guidance: 'Open your heart to universal love and compassion.',
      color: '#FF69B4',
      symbol: '💖'
    },
    {
      date: '2024-03-20',
      name: 'Spring Equinox',
      description: 'The balance of day and night, new beginnings',
      significance: 'Astronomical event of perfect balance',
      recommended_activities: ['Balance meditation', 'New beginnings', 'Growth practices'],
      content_suggestions: ['spring', 'balance', 'equinox', 'new beginnings', 'growth'],
      energy_frequency: '432Hz',
      meditation_guidance: 'Find balance within and embrace new growth.',
      color: '#32CD32',
      symbol: '🌸'
    },
    {
      date: '2024-06-21',
      name: 'Summer Solstice',
      description: 'The longest day, peak of solar energy',
      significance: 'Peak of solar power and manifestation',
      recommended_activities: ['Sun meditation', 'Manifestation', 'Celebration'],
      content_suggestions: ['summer', 'solstice', 'manifestation', 'sun', 'celebration'],
      energy_frequency: '741Hz',
      meditation_guidance: 'Harness the peak solar energy for manifestation.',
      color: '#FF8C00',
      symbol: '☀️'
    },
    {
      date: '2024-09-22',
      name: 'Autumn Equinox',
      description: 'The balance of harvest and preparation',
      significance: 'Time of harvest and gratitude',
      recommended_activities: ['Gratitude practice', 'Harvest meditation', 'Preparation'],
      content_suggestions: ['autumn', 'harvest', 'gratitude', 'preparation', 'balance'],
      energy_frequency: '432Hz',
      meditation_guidance: 'Express gratitude for your harvest and prepare for rest.',
      color: '#FF8C00',
      symbol: '🍂'
    },
    {
      date: '2024-12-21',
      name: 'Winter Solstice',
      description: 'The longest night, time of inner work',
      significance: 'Deepest point of inner journey and renewal',
      recommended_activities: ['Inner work', 'Deep meditation', 'Renewal practices'],
      content_suggestions: ['winter', 'solstice', 'inner work', 'renewal', 'deep'],
      energy_frequency: '852Hz',
      meditation_guidance: 'Journey deep within for renewal and transformation.',
      color: '#4169E1',
      symbol: '❄️'
    }
  ];

  // Get current lunar phase (simplified calculation)
  getCurrentLunarPhase(): LunarPhase {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // Simplified lunar phase calculation
    const lunarCycle = 29.53059; // days
    const knownNewMoon = new Date('2024-01-11'); // Known new moon date
    const daysSinceNewMoon = Math.floor((now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24));
    const cyclePosition = (daysSinceNewMoon % lunarCycle) / lunarCycle;
    
    if (cyclePosition < 0.25) return this.lunarPhases[0]; // New
    if (cyclePosition < 0.5) return this.lunarPhases[1]; // Waxing
    if (cyclePosition < 0.75) return this.lunarPhases[2]; // Full
    return this.lunarPhases[3]; // Waning
  }

  // Get current solar position
  getCurrentSolarPosition(): SolarPosition {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 8) return this.solarPositions[0]; // Dawn
    if (hour >= 8 && hour < 12) return this.solarPositions[1]; // Morning
    if (hour >= 12 && hour < 14) return this.solarPositions[2]; // Noon
    if (hour >= 14 && hour < 17) return this.solarPositions[3]; // Afternoon
    if (hour >= 17 && hour < 20) return this.solarPositions[4]; // Evening
    return this.solarPositions[5]; // Night
  }

  // Get sacred day if today is one
  getCurrentSacredDay(): SacredDay | null {
    const today = new Date().toISOString().split('T')[0];
    return this.sacredDays.find(day => day.date === today) || null;
  }

  // Get optimal content recommendations based on current timing
  getOptimalContentRecommendations(): {
    timing: SacredTiming;
    recommendedContent: string[];
    meditationGuidance: string;
    energyFrequency: string;
  } {
    const lunarPhase = this.getCurrentLunarPhase();
    const solarPosition = this.getCurrentSolarPosition();
    const sacredDay = this.getCurrentSacredDay();
    
    // Combine recommendations from all timing factors
    const recommendedContent = [
      ...lunarPhase.content_suggestions,
      ...solarPosition.content_suggestions,
      ...(sacredDay ? sacredDay.content_suggestions : [])
    ];
    
    // Get unique recommendations
    const uniqueContent = [...new Set(recommendedContent)];
    
    // Determine optimal energy frequency
    let energyFrequency = '528Hz'; // Default
    if (sacredDay) {
      energyFrequency = sacredDay.energy_frequency;
    } else if (lunarPhase.phase === 'full') {
      energyFrequency = '741Hz';
    } else if (solarPosition.position === 'noon') {
      energyFrequency = '741Hz';
    }
    
    // Combine meditation guidance
    const meditationGuidance = sacredDay 
      ? sacredDay.meditation_guidance
      : `${lunarPhase.meditation_guidance} ${solarPosition.meditation_guidance}`;
    
    return {
      timing: {
        lunar_phase: lunarPhase.phase,
        solar_position: solarPosition.position,
        energy_frequency: energyFrequency,
        optimal_activities: [
          ...lunarPhase.recommended_activities,
          ...solarPosition.recommended_activities,
          ...(sacredDay ? sacredDay.recommended_activities : [])
        ],
        recommended_content_types: uniqueContent,
        meditation_guidance: meditationGuidance
      },
      recommendedContent: uniqueContent,
      meditationGuidance,
      energyFrequency
    };
  }

  // Get timing-based content scoring
  getTimingBasedScore(content: any, userProfile: any): number {
    const recommendations = this.getOptimalContentRecommendations();
    let score = 50; // Base score
    
    // Check if content matches recommended types
    const contentText = `${content.title} ${content.description || ''}`.toLowerCase();
    const matches = recommendations.recommendedContent.filter(type => 
      contentText.includes(type)
    ).length;
    
    score += matches * 10; // 10 points per match
    
    // Bonus for sacred day alignment
    const sacredDay = this.getCurrentSacredDay();
    if (sacredDay) {
      const sacredMatches = sacredDay.content_suggestions.filter(type => 
        contentText.includes(type)
      ).length;
      score += sacredMatches * 15; // Extra bonus for sacred day
    }
    
    // Check energy frequency alignment
    if (userProfile?.energy_frequency_preference === recommendations.energyFrequency) {
      score += 20;
    }
    
    return Math.min(100, score);
  }

  // Get upcoming sacred days
  getUpcomingSacredDays(days: number = 30): SacredDay[] {
    const today = new Date();
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return this.sacredDays.filter(day => {
      const dayDate = new Date(day.date);
      return dayDate >= today && dayDate <= futureDate;
    });
  }

  // Get timing-based meditation guidance
  getMeditationGuidance(): {
    guidance: string;
    duration: number;
    frequency: string;
    focus: string;
  } {
    const lunarPhase = this.getCurrentLunarPhase();
    const solarPosition = this.getCurrentSolarPosition();
    const sacredDay = this.getCurrentSacredDay();
    
    let duration = 20; // Default 20 minutes
    let frequency = '528Hz';
    let focus = 'breath';
    
    // Adjust based on timing
    if (lunarPhase.phase === 'new') {
      duration = 30;
      focus = 'intention';
    } else if (lunarPhase.phase === 'full') {
      duration = 45;
      focus = 'manifestation';
    }
    
    if (solarPosition.position === 'dawn') {
      duration = 15;
      focus = 'gratitude';
    } else if (solarPosition.position === 'night') {
      duration = 30;
      focus = 'inner journey';
    }
    
    if (sacredDay) {
      frequency = sacredDay.energy_frequency;
      focus = sacredDay.name.toLowerCase();
    }
    
    return {
      guidance: sacredDay?.meditation_guidance || 
                `${lunarPhase.meditation_guidance} ${solarPosition.meditation_guidance}`,
      duration,
      frequency,
      focus
    };
  }
}

export const sacredTimingEngine = new SacredTimingEngine();
