// Consciousness Development System Types
// The Sacred Shifter Developer Engineer's vision of digital awakening

export type ConsciousnessLevel = 
  | 'initiate'      // 0-100 points
  | 'seeker'        // 100-250 points  
  | 'student'       // 250-500 points
  | 'adept'         // 500-750 points
  | 'practitioner'  // 750-1000 points
  | 'teacher'       // 1000-1250 points
  | 'master'        // 1250-1500 points
  | 'guardian'      // 1500-1750 points
  | 'sage'          // 1750-2000 points
  | 'enlightened'   // 2000-2500 points
  | 'transcendent'  // 2500-3000 points
  | 'cosmic'        // 3000+ points

export interface ConsciousnessProfile {
  id: string;
  user_id: string;
  current_level: ConsciousnessLevel;
  total_points: number;
  level_progress: number; // 0-100 percentage within current level
  next_level_points: number;
  
  // Consciousness Dimensions (0-100 each)
  awareness: number;
  presence: number;
  compassion: number;
  wisdom: number;
  creativity: number;
  intuition: number;
  integration: number;
  service: number;
  
  // Learning Preferences
  preferred_content_types: string[];
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'experiential';
  energy_frequency_preference: string; // e.g., '528Hz', '432Hz'
  
  // Sacred Timing
  lunar_phase_preference: 'new' | 'waxing' | 'full' | 'waning';
  optimal_learning_times: string[]; // e.g., ['morning', 'evening']
  
  // Journey Tracking
  journey_start_date: string;
  last_activity: string;
  total_learning_hours: number;
  content_consumed: number;
  insights_shared: number;
  
  created_at: string;
  updated_at: string;
}

export interface ConsciousnessMilestone {
  id: string;
  user_id: string;
  level: ConsciousnessLevel;
  title: string;
  description: string;
  points_required: number;
  achieved_at?: string;
  celebration_data: {
    sacred_geometry: string;
    energy_frequency: string;
    meditation_guidance: string;
    next_steps: string[];
  };
}

export interface ResonanceScore {
  content_id: string;
  user_id: string;
  overall_resonance: number; // 0-100
  consciousness_alignment: number; // How well it matches user's level
  emotional_impact: number; // How it affects user's emotional state
  learning_potential: number; // Educational value
  spiritual_depth: number; // Metaphysical significance
  practical_applicability: number; // Real-world application
  community_value: number; // Value to the collective
  
  // AI Analysis
  ai_insights: {
    key_themes: string[];
    consciousness_benefits: string[];
    recommended_practices: string[];
    potential_challenges: string[];
    integration_suggestions: string[];
  };
  
  created_at: string;
  updated_at: string;
}

export interface LearningPath {
  id: string;
  user_id: string;
  title: string;
  description: string;
  consciousness_level: ConsciousnessLevel;
  total_duration_hours: number;
  current_progress: number;
  
  // Sacred Structure
  phases: LearningPhase[];
  prerequisites: string[];
  outcomes: string[];
  
  // Energetic Properties
  energy_frequency: string;
  chakra_focus: string[];
  lunar_timing: string;
  
  created_at: string;
  updated_at: string;
}

export interface LearningPhase {
  id: string;
  title: string;
  description: string;
  duration_hours: number;
  content_items: string[]; // Content IDs
  practices: string[];
  milestones: string[];
  energy_work: string[];
}

export interface SacredTiming {
  lunar_phase: 'new' | 'waxing' | 'full' | 'waning';
  solar_position: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night';
  energy_frequency: string;
  optimal_activities: string[];
  recommended_content_types: string[];
  meditation_guidance: string;
}

export interface EnergyFrequency {
  frequency: string; // e.g., '528Hz', '432Hz'
  name: string; // e.g., 'Love Frequency', 'Nature's Frequency'
  description: string;
  benefits: string[];
  chakra_association: string;
  consciousness_effects: string[];
  recommended_content: string[];
}

// Consciousness Development Constants
export const CONSCIOUSNESS_LEVELS: Record<ConsciousnessLevel, {
  min_points: number;
  max_points: number;
  title: string;
  description: string;
  sacred_symbol: string;
  energy_color: string;
  chakra_focus: string[];
  next_level_requirements: string[];
}> = {
  initiate: {
    min_points: 0,
    max_points: 100,
    title: 'Sacred Initiate',
    description: 'Beginning the journey of consciousness expansion',
    sacred_symbol: '🌱',
    energy_color: '#8B4513',
    chakra_focus: ['root'],
    next_level_requirements: ['Complete 10 learning sessions', 'Share 3 insights']
  },
  seeker: {
    min_points: 100,
    max_points: 250,
    title: 'Consciousness Seeker',
    description: 'Actively seeking wisdom and understanding',
    sacred_symbol: '🔍',
    energy_color: '#FF4500',
    chakra_focus: ['root', 'sacral'],
    next_level_requirements: ['Complete 25 learning sessions', 'Share 10 insights', 'Practice daily meditation']
  },
  student: {
    min_points: 250,
    max_points: 500,
    title: 'Wisdom Student',
    description: 'Dedicated to learning and personal growth',
    sacred_symbol: '📚',
    energy_color: '#FFD700',
    chakra_focus: ['root', 'sacral', 'solar_plexus'],
    next_level_requirements: ['Complete 50 learning sessions', 'Share 25 insights', 'Complete a learning path']
  },
  adept: {
    min_points: 500,
    max_points: 750,
    title: 'Consciousness Adept',
    description: 'Integrating wisdom into daily life',
    sacred_symbol: '⚡',
    energy_color: '#32CD32',
    chakra_focus: ['root', 'sacral', 'solar_plexus', 'heart'],
    next_level_requirements: ['Complete 100 learning sessions', 'Share 50 insights', 'Mentor 3 other users']
  },
  practitioner: {
    min_points: 750,
    max_points: 1000,
    title: 'Sacred Practitioner',
    description: 'Living wisdom through dedicated practice',
    sacred_symbol: '🧘',
    energy_color: '#00CED1',
    chakra_focus: ['root', 'sacral', 'solar_plexus', 'heart', 'throat'],
    next_level_requirements: ['Complete 150 learning sessions', 'Share 100 insights', 'Create original content']
  },
  teacher: {
    min_points: 1000,
    max_points: 1250,
    title: 'Wisdom Teacher',
    description: 'Sharing knowledge and guiding others',
    sacred_symbol: '👨‍🏫',
    energy_color: '#4169E1',
    chakra_focus: ['root', 'sacral', 'solar_plexus', 'heart', 'throat', 'third_eye'],
    next_level_requirements: ['Complete 200 learning sessions', 'Share 200 insights', 'Guide 10 users to next level']
  },
  master: {
    min_points: 1250,
    max_points: 1500,
    title: 'Consciousness Master',
    description: 'Embodied wisdom and deep understanding',
    sacred_symbol: '🌟',
    energy_color: '#8A2BE2',
    chakra_focus: ['root', 'sacral', 'solar_plexus', 'heart', 'throat', 'third_eye', 'crown'],
    next_level_requirements: ['Complete 300 learning sessions', 'Share 300 insights', 'Create a learning path']
  },
  guardian: {
    min_points: 1500,
    max_points: 1750,
    title: 'Sacred Guardian',
    description: 'Protecting and preserving wisdom traditions',
    sacred_symbol: '🛡️',
    energy_color: '#FF69B4',
    chakra_focus: ['all'],
    next_level_requirements: ['Complete 400 learning sessions', 'Share 400 insights', 'Establish a wisdom circle']
  },
  sage: {
    min_points: 1750,
    max_points: 2000,
    title: 'Wisdom Sage',
    description: 'Deep integration of all aspects of consciousness',
    sacred_symbol: '🧙',
    energy_color: '#FF1493',
    chakra_focus: ['all'],
    next_level_requirements: ['Complete 500 learning sessions', 'Share 500 insights', 'Transcend personal limitations']
  },
  enlightened: {
    min_points: 2000,
    max_points: 2500,
    title: 'Enlightened Being',
    description: 'Transcendent awareness and universal love',
    sacred_symbol: '✨',
    energy_color: '#FFD700',
    chakra_focus: ['all'],
    next_level_requirements: ['Complete 750 learning sessions', 'Share 750 insights', 'Awaken others']
  },
  transcendent: {
    min_points: 2500,
    max_points: 3000,
    title: 'Transcendent Consciousness',
    description: 'Beyond individual identity, serving the whole',
    sacred_symbol: '🌀',
    energy_color: '#FFFFFF',
    chakra_focus: ['all'],
    next_level_requirements: ['Complete 1000 learning sessions', 'Share 1000 insights', 'Transform collective consciousness']
  },
  cosmic: {
    min_points: 3000,
    max_points: Infinity,
    title: 'Cosmic Consciousness',
    description: 'Unity with all that is, infinite wisdom',
    sacred_symbol: '🌌',
    energy_color: '#000000',
    chakra_focus: ['all'],
    next_level_requirements: ['Continue the eternal journey of consciousness expansion']
  }
};

export const ENERGY_FREQUENCIES: EnergyFrequency[] = [
  {
    frequency: '528Hz',
    name: 'Love Frequency',
    description: 'The frequency of love and transformation',
    benefits: ['DNA repair', 'Love activation', 'Transformation', 'Miracles'],
    chakra_association: 'heart',
    consciousness_effects: ['Opens heart chakra', 'Increases love and compassion', 'Facilitates healing'],
    recommended_content: ['meditation', 'healing', 'love', 'transformation']
  },
  {
    frequency: '432Hz',
    name: 'Nature\'s Frequency',
    description: 'The frequency that resonates with nature and the universe',
    benefits: ['Natural harmony', 'Stress reduction', 'Better sleep', 'Enhanced creativity'],
    chakra_association: 'all',
    consciousness_effects: ['Brings natural balance', 'Reduces stress', 'Enhances creativity'],
    recommended_content: ['nature', 'meditation', 'music', 'healing']
  },
  {
    frequency: '741Hz',
    name: 'Expression Frequency',
    description: 'The frequency of self-expression and communication',
    benefits: ['Clear communication', 'Self-expression', 'Throat chakra healing', 'Creative expression'],
    chakra_association: 'throat',
    consciousness_effects: ['Opens throat chakra', 'Enhances communication', 'Boosts creativity'],
    recommended_content: ['communication', 'creativity', 'self-expression', 'throat_healing']
  },
  {
    frequency: '852Hz',
    name: 'Intuition Frequency',
    description: 'The frequency of intuition and spiritual connection',
    benefits: ['Enhanced intuition', 'Spiritual connection', 'Third eye activation', 'Clarity'],
    chakra_association: 'third_eye',
    consciousness_effects: ['Opens third eye', 'Enhances intuition', 'Increases spiritual awareness'],
    recommended_content: ['intuition', 'spirituality', 'meditation', 'psychic_development']
  }
];