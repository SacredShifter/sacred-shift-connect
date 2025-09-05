/**
 * Sacred Shifter Consciousness Assessment Engine
 * Real-time consciousness evaluation and evolution tracking
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  ConsciousnessState, 
  ConsciousnessEvolution,
  ConsciousnessMilestone,
  BiofeedbackData,
  ConsciousnessMetrics,
  SacredPattern,
  Vector3D
} from '@/types/consciousness';

interface ConsciousnessAssessmentResult {
  overallLevel: number; // 0-100
  dimensions: {
    awareness: number;
    compassion: number;
    wisdom: number;
    unity: number;
    transcendence: number;
  };
  chakraAlignment: {
    root: number;
    sacral: number;
    solar: number;
    heart: number;
    throat: number;
    thirdEye: number;
    crown: number;
  };
  archetypeAlignment: {
    primary: string;
    secondary: string;
    balance: number;
  };
  sacredGeometryResonance: {
    primary: string;
    resonance: number;
    activationLevel: number;
  };
  recommendations: string[];
  nextMilestone: string;
  evolutionPath: string[];
}

interface AssessmentContext {
  recentSessions: any[];
  journalEntries: any[];
  meditationData: any[];
  biofeedbackData: BiofeedbackData | null;
  timeOfDay: number;
  lunarPhase: string;
  season: string;
}

export const useConsciousnessAssessment = () => {
  const [currentAssessment, setCurrentAssessment] = useState<ConsciousnessAssessmentResult | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentHistory, setAssessmentHistory] = useState<ConsciousnessAssessmentResult[]>([]);
  const [evolution, setEvolution] = useState<ConsciousnessEvolution | null>(null);

  // Calculate lunar phase
  const getLunarPhase = useCallback((): string => {
    const now = new Date();
    const start = new Date(2000, 0, 6); // Known new moon
    const days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const phase = days % 29.53;
    
    if (phase < 7.38) return 'new';
    if (phase < 14.77) return 'waxing';
    if (phase < 22.15) return 'full';
    return 'waning';
  }, []);

  // Calculate season
  const getSeason = useCallback((): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }, []);

  // Gather assessment context data
  const gatherAssessmentContext = useCallback(async (userId: string): Promise<AssessmentContext> => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [sessionsResponse, journalResponse, meditationResponse] = await Promise.all([
      supabase
        .from('consciousness_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: false }),
      
      supabase
        .from('mirror_journal_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: false }),
      
      supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: false })
    ]);

    return {
      recentSessions: sessionsResponse.data || [],
      journalEntries: journalResponse.data || [],
      meditationData: meditationResponse.data || [],
      biofeedbackData: null, // Would integrate with real biofeedback
      timeOfDay: new Date().getHours(),
      lunarPhase: getLunarPhase(),
      season: getSeason()
    };
  }, [getLunarPhase, getSeason]);

  // Assess consciousness dimensions
  const assessConsciousnessDimensions = useCallback((context: AssessmentContext): ConsciousnessAssessmentResult['dimensions'] => {
    const { recentSessions, journalEntries, meditationData, timeOfDay, lunarPhase } = context;

    // Awareness assessment (based on meditation depth and journal insights)
    const meditationDepth = meditationData.reduce((sum, session) => 
      sum + (session.consciousness_level || 0), 0) / Math.max(meditationData.length, 1);
    const journalInsights = journalEntries.filter(entry => 
      entry.insights && entry.insights.length > 0).length;
    const awareness = Math.min((meditationDepth + journalInsights * 5) / 2, 100);

    // Compassion assessment (based on journal emotional tone and community engagement)
    const compassionateEntries = journalEntries.filter(entry => 
      entry.mood_tag?.toLowerCase().includes('love') || 
      entry.mood_tag?.toLowerCase().includes('compassion') ||
      entry.mood_tag?.toLowerCase().includes('gratitude')).length;
    const compassion = Math.min((compassionateEntries / Math.max(journalEntries.length, 1)) * 100, 100);

    // Wisdom assessment (based on session complexity and reflection depth)
    const complexSessions = recentSessions.filter(session => 
      session.session_type === 'advanced_meditation' || 
      session.session_type === 'sacred_geometry').length;
    const wisdom = Math.min((complexSessions / Math.max(recentSessions.length, 1)) * 100, 100);

    // Unity assessment (based on collective practices and shared experiences)
    const collectiveSessions = recentSessions.filter(session => 
      session.session_type === 'collective' || 
      session.shared_with?.length > 0).length;
    const unity = Math.min((collectiveSessions / Math.max(recentSessions.length, 1)) * 100, 100);

    // Transcendence assessment (based on peak experiences and spiritual insights)
    const transcendentEntries = journalEntries.filter(entry => 
      entry.insights?.some(insight => 
        insight.toLowerCase().includes('transcendent') ||
        insight.toLowerCase().includes('divine') ||
        insight.toLowerCase().includes('infinite'))).length;
    const transcendence = Math.min((transcendentEntries / Math.max(journalEntries.length, 1)) * 100, 100);

    return {
      awareness: Math.round(awareness),
      compassion: Math.round(compassion),
      wisdom: Math.round(wisdom),
      unity: Math.round(unity),
      transcendence: Math.round(transcendence)
    };
  }, []);

  // Assess chakra alignment
  const assessChakraAlignment = useCallback((context: AssessmentContext): ConsciousnessAssessmentResult['chakraAlignment'] => {
    const { recentSessions, journalEntries, timeOfDay } = context;

    // Root chakra (grounding, stability)
    const groundingSessions = recentSessions.filter(session => 
      session.session_type === 'breathing' || 
      session.session_type === 'grounding').length;
    const root = Math.min((groundingSessions / Math.max(recentSessions.length, 1)) * 100, 100);

    // Sacral chakra (creativity, emotions)
    const creativeEntries = journalEntries.filter(entry => 
      entry.entry_mode === 'creative' || 
      entry.mood_tag?.toLowerCase().includes('creative')).length;
    const sacral = Math.min((creativeEntries / Math.max(journalEntries.length, 1)) * 100, 100);

    // Solar plexus (confidence, willpower)
    const confidentEntries = journalEntries.filter(entry => 
      entry.mood_tag?.toLowerCase().includes('confident') ||
      entry.mood_tag?.toLowerCase().includes('empowered')).length;
    const solar = Math.min((confidentEntries / Math.max(journalEntries.length, 1)) * 100, 100);

    // Heart chakra (love, compassion)
    const lovingEntries = journalEntries.filter(entry => 
      entry.mood_tag?.toLowerCase().includes('love') ||
      entry.mood_tag?.toLowerCase().includes('gratitude')).length;
    const heart = Math.min((lovingEntries / Math.max(journalEntries.length, 1)) * 100, 100);

    // Throat chakra (communication, expression)
    const expressiveEntries = journalEntries.filter(entry => 
      entry.entry_mode === 'voice' || 
      entry.content?.length > 200).length;
    const throat = Math.min((expressiveEntries / Math.max(journalEntries.length, 1)) * 100, 100);

    // Third eye (intuition, insight)
    const insightfulEntries = journalEntries.filter(entry => 
      entry.insights && entry.insights.length > 0).length;
    const thirdEye = Math.min((insightfulEntries / Math.max(journalEntries.length, 1)) * 100, 100);

    // Crown chakra (spirituality, connection)
    const spiritualSessions = recentSessions.filter(session => 
      session.session_type === 'meditation' || 
      session.session_type === 'sacred_geometry').length;
    const crown = Math.min((spiritualSessions / Math.max(recentSessions.length, 1)) * 100, 100);

    return {
      root: Math.round(root),
      sacral: Math.round(sacral),
      solar: Math.round(solar),
      heart: Math.round(heart),
      throat: Math.round(throat),
      thirdEye: Math.round(thirdEye),
      crown: Math.round(crown)
    };
  }, []);

  // Assess archetype alignment
  const assessArchetypeAlignment = useCallback((context: AssessmentContext): ConsciousnessAssessmentResult['archetypeAlignment'] => {
    const { recentSessions, journalEntries } = context;

    // Analyze session types and journal themes to determine archetype
    const archetypeScores = {
      warrior: 0,
      healer: 0,
      sage: 0,
      creator: 0,
      mystic: 0,
      guardian: 0
    };

    // Score based on session types
    recentSessions.forEach(session => {
      switch (session.session_type) {
        case 'breathing':
        case 'healing':
          archetypeScores.healer += 2;
          break;
        case 'meditation':
        case 'sacred_geometry':
          archetypeScores.mystic += 2;
          archetypeScores.sage += 1;
          break;
        case 'creative':
        case 'artistic':
          archetypeScores.creator += 2;
          break;
        case 'protection':
        case 'boundaries':
          archetypeScores.guardian += 2;
          break;
        case 'action':
        case 'movement':
          archetypeScores.warrior += 2;
          break;
      }
    });

    // Score based on journal themes
    journalEntries.forEach(entry => {
      const content = (entry.content || '').toLowerCase();
      const mood = (entry.mood_tag || '').toLowerCase();

      if (content.includes('heal') || content.includes('nurture') || mood.includes('compassion')) {
        archetypeScores.healer += 1;
      }
      if (content.includes('learn') || content.includes('wisdom') || content.includes('understand')) {
        archetypeScores.sage += 1;
      }
      if (content.includes('create') || content.includes('art') || content.includes('beauty')) {
        archetypeScores.creator += 1;
      }
      if (content.includes('protect') || content.includes('guard') || content.includes('boundary')) {
        archetypeScores.guardian += 1;
      }
      if (content.includes('action') || content.includes('strength') || content.includes('courage')) {
        archetypeScores.warrior += 1;
      }
      if (content.includes('mystical') || content.includes('divine') || content.includes('transcendent')) {
        archetypeScores.mystic += 1;
      }
    });

    const sortedArchetypes = Object.entries(archetypeScores)
      .sort(([,a], [,b]) => b - a);

    const primary = sortedArchetypes[0][0];
    const secondary = sortedArchetypes[1][0];
    const balance = Math.round((sortedArchetypes[0][1] / Math.max(sortedArchetypes[1][1], 1)) * 100);

    return {
      primary,
      secondary,
      balance: Math.min(balance, 100)
    };
  }, []);

  // Assess sacred geometry resonance
  const assessSacredGeometryResonance = useCallback((context: AssessmentContext): ConsciousnessAssessmentResult['sacredGeometryResonance'] => {
    const { recentSessions, lunarPhase, timeOfDay } = context;

    // Determine primary sacred geometry based on consciousness level and timing
    const consciousnessLevel = context.recentSessions.reduce((sum, session) => 
      sum + (session.consciousness_level || 0), 0) / Math.max(context.recentSessions.length, 1);

    let primaryGeometry = 'flower-of-life';
    let resonance = 50;
    let activationLevel = 25;

    if (consciousnessLevel > 80) {
      primaryGeometry = 'merkaba';
      resonance = 90;
      activationLevel = 85;
    } else if (consciousnessLevel > 60) {
      primaryGeometry = 'metatron-cube';
      resonance = 75;
      activationLevel = 65;
    } else if (consciousnessLevel > 40) {
      primaryGeometry = 'tree-of-life';
      resonance = 60;
      activationLevel = 45;
    } else {
      primaryGeometry = 'seed-of-life';
      resonance = 40;
      activationLevel = 30;
    }

    // Adjust based on lunar phase
    if (lunarPhase === 'full') {
      resonance += 10;
      activationLevel += 10;
    } else if (lunarPhase === 'new') {
      resonance += 5;
      activationLevel += 5;
    }

    // Adjust based on time of day
    if (timeOfDay >= 5 && timeOfDay <= 7) { // Dawn
      resonance += 5;
      activationLevel += 5;
    }

    return {
      primary: primaryGeometry,
      resonance: Math.min(resonance, 100),
      activationLevel: Math.min(activationLevel, 100)
    };
  }, []);

  // Generate recommendations
  const generateRecommendations = useCallback((assessment: ConsciousnessAssessmentResult): string[] => {
    const recommendations: string[] = [];

    // Dimension-based recommendations
    if (assessment.dimensions.awareness < 50) {
      recommendations.push('Practice daily meditation to enhance awareness');
    }
    if (assessment.dimensions.compassion < 50) {
      recommendations.push('Engage in loving-kindness meditation');
    }
    if (assessment.dimensions.wisdom < 50) {
      recommendations.push('Explore advanced spiritual teachings');
    }
    if (assessment.dimensions.unity < 50) {
      recommendations.push('Participate in collective consciousness practices');
    }
    if (assessment.dimensions.transcendence < 50) {
      recommendations.push('Seek peak experiences through sacred practices');
    }

    // Chakra-based recommendations
    const chakras = assessment.chakraAlignment;
    if (chakras.root < 50) {
      recommendations.push('Practice grounding exercises and earth connection');
    }
    if (chakras.heart < 50) {
      recommendations.push('Open your heart through gratitude and love practices');
    }
    if (chakras.thirdEye < 50) {
      recommendations.push('Develop intuition through meditation and reflection');
    }
    if (chakras.crown < 50) {
      recommendations.push('Connect with divine consciousness through prayer or meditation');
    }

    // Archetype-based recommendations
    const archetype = assessment.archetypeAlignment.primary;
    switch (archetype) {
      case 'warrior':
        recommendations.push('Channel your strength into protecting and serving others');
        break;
      case 'healer':
        recommendations.push('Focus on self-healing before healing others');
        break;
      case 'sage':
        recommendations.push('Share your wisdom through teaching and guidance');
        break;
      case 'creator':
        recommendations.push('Express your divine creativity through art and innovation');
        break;
      case 'mystic':
        recommendations.push('Deepen your connection to the mystical realms');
        break;
      case 'guardian':
        recommendations.push('Protect sacred spaces and vulnerable beings');
        break;
    }

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }, []);

  // Determine next milestone
  const determineNextMilestone = useCallback((assessment: ConsciousnessAssessmentResult): string => {
    const overallLevel = assessment.overallLevel;

    if (overallLevel < 20) {
      return 'Complete your first meditation session';
    } else if (overallLevel < 40) {
      return 'Establish a daily practice routine';
    } else if (overallLevel < 60) {
      return 'Achieve consistent chakra alignment';
    } else if (overallLevel < 80) {
      return 'Master your primary archetype';
    } else if (overallLevel < 95) {
      return 'Transcend ego and achieve unity consciousness';
    } else {
      return 'Become a living embodiment of divine wisdom';
    }
  }, []);

  // Main assessment function
  const performAssessment = useCallback(async (userId: string): Promise<ConsciousnessAssessmentResult> => {
    setIsAssessing(true);

    try {
      const context = await gatherAssessmentContext(userId);
      
      const dimensions = assessConsciousnessDimensions(context);
      const chakraAlignment = assessChakraAlignment(context);
      const archetypeAlignment = assessArchetypeAlignment(context);
      const sacredGeometryResonance = assessSacredGeometryResonance(context);

      const overallLevel = Math.round(
        (dimensions.awareness + dimensions.compassion + dimensions.wisdom + 
         dimensions.unity + dimensions.transcendence) / 5
      );

      const assessment: ConsciousnessAssessmentResult = {
        overallLevel,
        dimensions,
        chakraAlignment,
        archetypeAlignment,
        sacredGeometryResonance,
        recommendations: [],
        nextMilestone: '',
        evolutionPath: []
      };

      assessment.recommendations = generateRecommendations(assessment);
      assessment.nextMilestone = determineNextMilestone(assessment);
      assessment.evolutionPath = generateEvolutionPath(assessment);

      setCurrentAssessment(assessment);
      setAssessmentHistory(prev => [assessment, ...prev.slice(0, 9)]); // Keep last 10 assessments

      // Store assessment in database
      await supabase
        .from('consciousness_evolution')
        .upsert({
          user_id: userId,
          dimension: 'overall',
          level_assessment: overallLevel,
          evidence: {
            dimensions,
            chakraAlignment,
            archetypeAlignment,
            sacredGeometryResonance
          },
          growth_trajectory: {
            trend: assessmentHistory.length > 0 ? 
              (overallLevel - assessmentHistory[0].overallLevel) : 0,
            velocity: assessmentHistory.length > 1 ?
              (overallLevel - assessmentHistory[1].overallLevel) : 0
          },
          milestones: assessment.recommendations,
          chakra_alignment: chakraAlignment,
          frequency_resonance: sacredGeometryResonance.resonance
        });

      return assessment;
    } catch (error) {
      console.error('Consciousness assessment failed:', error);
      throw error;
    } finally {
      setIsAssessing(false);
    }
  }, [gatherAssessmentContext, assessConsciousnessDimensions, assessChakraAlignment, assessArchetypeAlignment, assessSacredGeometryResonance, generateRecommendations, determineNextMilestone, assessmentHistory]);

  // Generate evolution path
  const generateEvolutionPath = useCallback((assessment: ConsciousnessAssessmentResult): string[] => {
    const path: string[] = [];
    const level = assessment.overallLevel;

    if (level < 30) {
      path.push('Foundation Building', 'Basic Practices', 'Awareness Development');
    } else if (level < 50) {
      path.push('Skill Development', 'Consistency Building', 'Pattern Recognition');
    } else if (level < 70) {
      path.push('Integration', 'Mastery Development', 'Service Orientation');
    } else if (level < 90) {
      path.push('Transcendence', 'Unity Consciousness', 'Divine Connection');
    } else {
      path.push('Enlightenment', 'Divine Embodiment', 'Universal Service');
    }

    return path;
  }, []);

  // Auto-assess every hour
  useEffect(() => {
    const interval = setInterval(() => {
      // This would be called with actual user ID in real implementation
      // performAssessment(userId);
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    currentAssessment,
    assessmentHistory,
    evolution,
    isAssessing,
    performAssessment,
    getLunarPhase,
    getSeason
  };
};
