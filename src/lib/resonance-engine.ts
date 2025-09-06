// AI-Powered Resonance Engine
// The Sacred Shifter Developer Engineer's consciousness-aware content analysis system

import { ConsciousnessProfile, ResonanceScore, ConsciousnessLevel, CONSCIOUSNESS_LEVELS } from '@/types/consciousness';
import { ContentItem } from '@/hooks/useContentSources';

export interface ResonanceAnalysis {
  overall_resonance: number;
  consciousness_alignment: number;
  emotional_impact: number;
  learning_potential: number;
  spiritual_depth: number;
  practical_applicability: number;
  community_value: number;
  ai_insights: {
    key_themes: string[];
    consciousness_benefits: string[];
    recommended_practices: string[];
    potential_challenges: string[];
    integration_suggestions: string[];
  };
}

export interface ContentAnalysis {
  title_analysis: {
    sentiment: 'positive' | 'neutral' | 'negative';
    energy_level: 'low' | 'medium' | 'high';
    spiritual_keywords: string[];
    consciousness_themes: string[];
  };
  description_analysis: {
    complexity_level: number; // 1-10
    spiritual_depth: number; // 1-10
    practical_value: number; // 1-10
    emotional_resonance: number; // 1-10
  };
  metadata_analysis: {
    engagement_score: number;
    quality_indicators: string[];
    platform_specific_insights: Record<string, any>;
  };
}

class ResonanceEngine {
  private consciousnessKeywords = {
    awareness: ['awareness', 'consciousness', 'mindfulness', 'presence', 'awakening'],
    presence: ['present', 'now', 'moment', 'being', 'existence'],
    compassion: ['love', 'compassion', 'kindness', 'empathy', 'heart'],
    wisdom: ['wisdom', 'knowledge', 'understanding', 'insight', 'clarity'],
    creativity: ['creative', 'art', 'expression', 'imagination', 'innovation'],
    intuition: ['intuition', 'inner', 'feeling', 'knowing', 'guidance'],
    integration: ['integration', 'wholeness', 'balance', 'harmony', 'unity'],
    service: ['service', 'helping', 'giving', 'contribution', 'purpose']
  };

  private spiritualThemes = [
    'meditation', 'mindfulness', 'spirituality', 'consciousness', 'awakening',
    'healing', 'transformation', 'growth', 'wisdom', 'enlightenment',
    'love', 'compassion', 'gratitude', 'forgiveness', 'acceptance',
    'energy', 'frequency', 'vibration', 'chakra', 'aura',
    'nature', 'universe', 'cosmic', 'divine', 'sacred',
    'breath', 'breathing', 'pranayama', 'yoga', 'movement',
    'intuition', 'psychic', 'clairvoyance', 'telepathy', 'empathy',
    'manifestation', 'law of attraction', 'abundance', 'prosperity', 'success'
  ];

  private consciousnessLevels = [
    'beginner', 'intermediate', 'advanced', 'expert', 'master'
  ];

  private emotionalKeywords = {
    joy: ['joy', 'happiness', 'bliss', 'ecstasy', 'elation'],
    peace: ['peace', 'calm', 'serenity', 'tranquility', 'stillness'],
    love: ['love', 'affection', 'care', 'tenderness', 'warmth'],
    inspiration: ['inspiration', 'motivation', 'encouragement', 'uplifting', 'empowering'],
    healing: ['healing', 'recovery', 'restoration', 'renewal', 'regeneration'],
    transformation: ['transformation', 'change', 'growth', 'evolution', 'metamorphosis']
  };

  async analyzeContent(content: ContentItem, userProfile: ConsciousnessProfile): Promise<ResonanceAnalysis> {
    // Analyze title and description
    const titleAnalysis = this.analyzeText(content.title);
    const descriptionAnalysis = content.description ? this.analyzeText(content.description) : null;

    // Calculate consciousness alignment
    const consciousnessAlignment = this.calculateConsciousnessAlignment(
      titleAnalysis,
      descriptionAnalysis,
      userProfile
    );

    // Calculate emotional impact
    const emotionalImpact = this.calculateEmotionalImpact(
      titleAnalysis,
      descriptionAnalysis,
      userProfile
    );

    // Calculate learning potential
    const learningPotential = this.calculateLearningPotential(
      content,
      userProfile
    );

    // Calculate spiritual depth
    const spiritualDepth = this.calculateSpiritualDepth(
      titleAnalysis,
      descriptionAnalysis
    );

    // Calculate practical applicability
    const practicalApplicability = this.calculatePracticalApplicability(
      content,
      userProfile
    );

    // Calculate community value
    const communityValue = this.calculateCommunityValue(
      content,
      userProfile
    );

    // Generate AI insights
    const aiInsights = await this.generateAIInsights(
      content,
      userProfile,
      {
        consciousnessAlignment,
        emotionalImpact,
        learningPotential,
        spiritualDepth,
        practicalApplicability
      }
    );

    // Calculate overall resonance
    const overallResonance = this.calculateOverallResonance({
      consciousnessAlignment,
      emotionalImpact,
      learningPotential,
      spiritualDepth,
      practicalApplicability,
      communityValue
    });

    return {
      overall_resonance: overallResonance,
      consciousness_alignment: consciousnessAlignment,
      emotional_impact: emotionalImpact,
      learning_potential: learningPotential,
      spiritual_depth: spiritualDepth,
      practical_applicability: practicalApplicability,
      community_value: communityValue,
      ai_insights: aiInsights
    };
  }

  private analyzeText(text: string): ContentAnalysis['title_analysis'] {
    const words = text.toLowerCase().split(/\s+/);
    
    // Analyze sentiment
    const positiveWords = ['amazing', 'wonderful', 'beautiful', 'inspiring', 'transformative', 'healing', 'powerful'];
    const negativeWords = ['terrible', 'awful', 'horrible', 'negative', 'bad', 'wrong', 'harmful'];
    
    const positiveCount = words.filter(word => positiveWords.some(pw => word.includes(pw))).length;
    const negativeCount = words.filter(word => negativeWords.some(nw => word.includes(nw))).length;
    
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    // Analyze energy level
    const highEnergyWords = ['powerful', 'intense', 'dynamic', 'energetic', 'vibrant', 'explosive'];
    const lowEnergyWords = ['calm', 'gentle', 'soft', 'peaceful', 'quiet', 'still'];
    
    const highEnergyCount = words.filter(word => highEnergyWords.some(hew => word.includes(hew))).length;
    const lowEnergyCount = words.filter(word => lowEnergyWords.some(lew => word.includes(lew))).length;
    
    let energyLevel: 'low' | 'medium' | 'high' = 'medium';
    if (highEnergyCount > lowEnergyCount) energyLevel = 'high';
    else if (lowEnergyCount > highEnergyCount) energyLevel = 'low';

    // Extract spiritual keywords
    const spiritualKeywords = words.filter(word => 
      this.spiritualThemes.some(theme => word.includes(theme))
    );

    // Extract consciousness themes
    const consciousnessThemes = Object.entries(this.consciousnessKeywords)
      .filter(([_, keywords]) => 
        keywords.some(keyword => words.some(word => word.includes(keyword)))
      )
      .map(([theme, _]) => theme);

    return {
      sentiment,
      energy_level: energyLevel,
      spiritual_keywords: spiritualKeywords,
      consciousness_themes: consciousnessThemes
    };
  }

  private calculateConsciousnessAlignment(
    titleAnalysis: ContentAnalysis['title_analysis'],
    descriptionAnalysis: ContentAnalysis['title_analysis'] | null,
    userProfile: ConsciousnessProfile
  ): number {
    let alignment = 0;
    let totalWeight = 0;

    // Check alignment with user's consciousness dimensions
    const allThemes = [...titleAnalysis.consciousness_themes];
    if (descriptionAnalysis) {
      allThemes.push(...descriptionAnalysis.consciousness_themes);
    }

    Object.entries(this.consciousnessKeywords).forEach(([dimension, keywords]) => {
      const userLevel = userProfile[dimension as keyof ConsciousnessProfile] as number;
      const themeMatches = allThemes.filter(theme => theme === dimension).length;
      
      if (themeMatches > 0) {
        // Higher user level + more theme matches = higher alignment
        alignment += (userLevel / 100) * (themeMatches * 20);
        totalWeight += themeMatches * 20;
      }
    });

    // Check consciousness level alignment
    const currentLevel = CONSCIOUSNESS_LEVELS[userProfile.current_level];
    const levelAlignment = this.getConsciousnessLevelAlignment(titleAnalysis, descriptionAnalysis, userProfile.current_level);
    alignment += levelAlignment * 30;
    totalWeight += 30;

    return totalWeight > 0 ? Math.min(100, (alignment / totalWeight) * 100) : 50;
  }

  private getConsciousnessLevelAlignment(
    titleAnalysis: ContentAnalysis['title_analysis'],
    descriptionAnalysis: ContentAnalysis['title_analysis'] | null,
    userLevel: ConsciousnessLevel
  ): number {
    const levelIndex = Object.keys(CONSCIOUSNESS_LEVELS).indexOf(userLevel);
    const complexity = this.calculateComplexity(titleAnalysis, descriptionAnalysis);
    
    // Higher consciousness levels should align with more complex content
    const expectedComplexity = (levelIndex + 1) * 2;
    const complexityDiff = Math.abs(complexity - expectedComplexity);
    
    return Math.max(0, 100 - (complexityDiff * 10));
  }

  private calculateComplexity(
    titleAnalysis: ContentAnalysis['title_analysis'],
    descriptionAnalysis: ContentAnalysis['title_analysis'] | null
  ): number {
    let complexity = 0;
    
    // More spiritual keywords = higher complexity
    complexity += titleAnalysis.spiritual_keywords.length * 2;
    if (descriptionAnalysis) {
      complexity += descriptionAnalysis.spiritual_keywords.length;
    }
    
    // More consciousness themes = higher complexity
    complexity += titleAnalysis.consciousness_themes.length * 3;
    if (descriptionAnalysis) {
      complexity += descriptionAnalysis.consciousness_themes.length * 2;
    }
    
    return Math.min(10, complexity);
  }

  private calculateEmotionalImpact(
    titleAnalysis: ContentAnalysis['title_analysis'],
    descriptionAnalysis: ContentAnalysis['title_analysis'] | null,
    userProfile: ConsciousnessProfile
  ): number {
    let impact = 0;
    
    // Positive sentiment increases impact
    if (titleAnalysis.sentiment === 'positive') impact += 30;
    else if (titleAnalysis.sentiment === 'negative') impact -= 20;
    
    if (descriptionAnalysis?.sentiment === 'positive') impact += 20;
    else if (descriptionAnalysis?.sentiment === 'negative') impact -= 15;
    
    // High energy content has more impact
    if (titleAnalysis.energy_level === 'high') impact += 25;
    else if (titleAnalysis.energy_level === 'low') impact += 15;
    
    // Emotional keywords increase impact
    const allText = titleAnalysis.spiritual_keywords.join(' ');
    if (descriptionAnalysis) {
      allText += ' ' + descriptionAnalysis.spiritual_keywords.join(' ');
    }
    
    Object.entries(this.emotionalKeywords).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => allText.includes(keyword)).length;
      impact += matches * 10;
    });
    
    return Math.max(0, Math.min(100, impact));
  }

  private calculateLearningPotential(
    content: ContentItem,
    userProfile: ConsciousnessProfile
  ): number {
    let potential = 50; // Base learning potential
    
    // Longer content generally has more learning potential
    if (content.duration_seconds) {
      const durationMinutes = content.duration_seconds / 60;
      if (durationMinutes > 30) potential += 20;
      else if (durationMinutes > 10) potential += 10;
    }
    
    // High engagement content has more learning potential
    if (content.engagement_score && content.engagement_score > 0.7) {
      potential += 15;
    }
    
    // Educational content types have higher learning potential
    const educationalTypes = ['tutorial', 'course', 'lesson', 'guide', 'explanation'];
    const isEducational = educationalTypes.some(type => 
      content.title.toLowerCase().includes(type) || 
      content.description?.toLowerCase().includes(type)
    );
    
    if (isEducational) potential += 25;
    
    // Align with user's learning style
    if (userProfile.learning_style === 'visual' && content.content_type === 'video') {
      potential += 10;
    } else if (userProfile.learning_style === 'auditory' && content.content_type === 'audio') {
      potential += 10;
    } else if (userProfile.learning_style === 'reading' && content.content_type === 'article') {
      potential += 10;
    }
    
    return Math.min(100, potential);
  }

  private calculateSpiritualDepth(
    titleAnalysis: ContentAnalysis['title_analysis'],
    descriptionAnalysis: ContentAnalysis['title_analysis'] | null
  ): number {
    let depth = 0;
    
    // Count spiritual keywords
    depth += titleAnalysis.spiritual_keywords.length * 5;
    if (descriptionAnalysis) {
      depth += descriptionAnalysis.spiritual_keywords.length * 3;
    }
    
    // Count consciousness themes
    depth += titleAnalysis.consciousness_themes.length * 8;
    if (descriptionAnalysis) {
      depth += descriptionAnalysis.consciousness_themes.length * 5;
    }
    
    // Deep spiritual concepts
    const deepConcepts = ['enlightenment', 'awakening', 'transcendence', 'unity', 'oneness', 'divine', 'sacred'];
    const allText = titleAnalysis.spiritual_keywords.join(' ');
    if (descriptionAnalysis) {
      allText += ' ' + descriptionAnalysis.spiritual_keywords.join(' ');
    }
    
    const deepConceptMatches = deepConcepts.filter(concept => 
      allText.toLowerCase().includes(concept)
    ).length;
    
    depth += deepConceptMatches * 15;
    
    return Math.min(100, depth);
  }

  private calculatePracticalApplicability(
    content: ContentItem,
    userProfile: ConsciousnessProfile
  ): number {
    let applicability = 50;
    
    // Practical keywords
    const practicalKeywords = ['how to', 'step by step', 'practice', 'exercise', 'technique', 'method', 'guide'];
    const contentText = `${content.title} ${content.description || ''}`.toLowerCase();
    
    const practicalMatches = practicalKeywords.filter(keyword => 
      contentText.includes(keyword)
    ).length;
    
    applicability += practicalMatches * 10;
    
    // Action-oriented content
    const actionWords = ['do', 'practice', 'apply', 'implement', 'use', 'try', 'experiment'];
    const actionMatches = actionWords.filter(word => 
      contentText.includes(word)
    ).length;
    
    applicability += actionMatches * 5;
    
    // Align with user's consciousness level
    const currentLevel = CONSCIOUSNESS_LEVELS[userProfile.current_level];
    const isAppropriateLevel = this.isContentAppropriateForLevel(content, userProfile.current_level);
    
    if (isAppropriateLevel) applicability += 20;
    else applicability -= 30;
    
    return Math.max(0, Math.min(100, applicability));
  }

  private isContentAppropriateForLevel(content: ContentItem, userLevel: ConsciousnessLevel): boolean {
    const levelIndex = Object.keys(CONSCIOUSNESS_LEVELS).indexOf(userLevel);
    const contentComplexity = this.calculateContentComplexity(content);
    
    // Content should be slightly above user's current level for optimal learning
    return contentComplexity <= levelIndex + 2 && contentComplexity >= levelIndex - 1;
  }

  private calculateContentComplexity(content: ContentItem): number {
    let complexity = 0;
    
    // Longer content is generally more complex
    if (content.duration_seconds) {
      const durationMinutes = content.duration_seconds / 60;
      complexity += Math.min(5, durationMinutes / 10);
    }
    
    // More engagement suggests complexity
    if (content.engagement_score) {
      complexity += content.engagement_score * 3;
    }
    
    // Educational content is more complex
    const educationalKeywords = ['advanced', 'expert', 'master', 'deep', 'profound', 'complex'];
    const contentText = `${content.title} ${content.description || ''}`.toLowerCase();
    
    const educationalMatches = educationalKeywords.filter(keyword => 
      contentText.includes(keyword)
    ).length;
    
    complexity += educationalMatches * 2;
    
    return Math.min(10, complexity);
  }

  private calculateCommunityValue(
    content: ContentItem,
    userProfile: ConsciousnessProfile
  ): number {
    let value = 50;
    
    // High engagement content has community value
    if (content.engagement_score && content.engagement_score > 0.8) {
      value += 20;
    }
    
    // Content that can be shared and discussed
    const shareableKeywords = ['inspiration', 'motivation', 'wisdom', 'insight', 'revelation', 'breakthrough'];
    const contentText = `${content.title} ${content.description || ''}`.toLowerCase();
    
    const shareableMatches = shareableKeywords.filter(keyword => 
      contentText.includes(keyword)
    ).length;
    
    value += shareableMatches * 8;
    
    // Universal themes have more community value
    const universalThemes = ['love', 'peace', 'healing', 'growth', 'transformation', 'unity'];
    const universalMatches = universalThemes.filter(theme => 
      contentText.includes(theme)
    ).length;
    
    value += universalMatches * 10;
    
    return Math.min(100, value);
  }

  private calculateOverallResonance(scores: {
    consciousnessAlignment: number;
    emotionalImpact: number;
    learningPotential: number;
    spiritualDepth: number;
    practicalApplicability: number;
    communityValue: number;
  }): number {
    const weights = {
      consciousnessAlignment: 0.25,
      emotionalImpact: 0.20,
      learningPotential: 0.20,
      spiritualDepth: 0.15,
      practicalApplicability: 0.10,
      communityValue: 0.10
    };
    
    const weightedSum = Object.entries(weights).reduce((sum, [key, weight]) => {
      return sum + (scores[key as keyof typeof scores] * weight);
    }, 0);
    
    return Math.round(weightedSum);
  }

  private async generateAIInsights(
    content: ContentItem,
    userProfile: ConsciousnessProfile,
    scores: {
      consciousnessAlignment: number;
      emotionalImpact: number;
      learningPotential: number;
      spiritualDepth: number;
      practicalApplicability: number;
    }
  ): Promise<ResonanceAnalysis['ai_insights']> {
    // This would typically call an AI service like OpenAI or Claude
    // For now, we'll generate insights based on the analysis
    
    const keyThemes = this.extractKeyThemes(content);
    const consciousnessBenefits = this.generateConsciousnessBenefits(scores, userProfile);
    const recommendedPractices = this.generateRecommendedPractices(content, userProfile);
    const potentialChallenges = this.generatePotentialChallenges(content, userProfile);
    const integrationSuggestions = this.generateIntegrationSuggestions(content, userProfile);
    
    return {
      key_themes: keyThemes,
      consciousness_benefits: consciousnessBenefits,
      recommended_practices: recommendedPractices,
      potential_challenges: potentialChallenges,
      integration_suggestions: integrationSuggestions
    };
  }

  private extractKeyThemes(content: ContentItem): string[] {
    const themes = [];
    const contentText = `${content.title} ${content.description || ''}`.toLowerCase();
    
    // Extract themes based on keywords
    Object.entries(this.consciousnessKeywords).forEach(([theme, keywords]) => {
      if (keywords.some(keyword => contentText.includes(keyword))) {
        themes.push(theme);
      }
    });
    
    // Extract spiritual themes
    const spiritualMatches = this.spiritualThemes.filter(theme => 
      contentText.includes(theme)
    );
    
    themes.push(...spiritualMatches.slice(0, 3)); // Top 3 spiritual themes
    
    return [...new Set(themes)]; // Remove duplicates
  }

  private generateConsciousnessBenefits(
    scores: any,
    userProfile: ConsciousnessProfile
  ): string[] {
    const benefits = [];
    
    if (scores.consciousnessAlignment > 70) {
      benefits.push('Aligns with your current consciousness development');
    }
    
    if (scores.emotionalImpact > 70) {
      benefits.push('High potential for emotional healing and growth');
    }
    
    if (scores.learningPotential > 70) {
      benefits.push('Excellent learning opportunity for your level');
    }
    
    if (scores.spiritualDepth > 70) {
      benefits.push('Deep spiritual insights and wisdom');
    }
    
    if (scores.practicalApplicability > 70) {
      benefits.push('Highly applicable to daily life practice');
    }
    
    return benefits;
  }

  private generateRecommendedPractices(
    content: ContentItem,
    userProfile: ConsciousnessProfile
  ): string[] {
    const practices = [];
    
    if (content.content_type === 'video') {
      practices.push('Watch mindfully with full attention');
      practices.push('Take notes on key insights');
    }
    
    if (content.content_type === 'audio') {
      practices.push('Listen during meditation or quiet time');
      practices.push('Practice active listening without distractions');
    }
    
    if (content.content_type === 'article') {
      practices.push('Read slowly and reflect on each section');
      practices.push('Journal about your insights');
    }
    
    practices.push('Practice the teachings for at least 7 days');
    practices.push('Share insights with your wisdom circle');
    
    return practices;
  }

  private generatePotentialChallenges(
    content: ContentItem,
    userProfile: ConsciousnessProfile
  ): string[] {
    const challenges = [];
    
    if (content.duration_seconds && content.duration_seconds > 3600) {
      challenges.push('Long duration may require multiple sessions');
    }
    
    if (userProfile.current_level === 'initiate' && this.calculateContentComplexity(content) > 7) {
      challenges.push('Content may be too advanced for current level');
    }
    
    challenges.push('May require consistent practice to integrate');
    challenges.push('Could trigger deep emotional responses');
    
    return challenges;
  }

  private generateIntegrationSuggestions(
    content: ContentItem,
    userProfile: ConsciousnessProfile
  ): string[] {
    const suggestions = [];
    
    suggestions.push('Start with 10 minutes daily practice');
    suggestions.push('Create a dedicated space for this work');
    suggestions.push('Find an accountability partner or group');
    suggestions.push('Track your progress and insights');
    
    if (userProfile.learning_style === 'experiential') {
      suggestions.push('Focus on hands-on practice and experimentation');
    } else if (userProfile.learning_style === 'visual') {
      suggestions.push('Create visual aids and diagrams');
    }
    
    return suggestions;
  }
}

export const resonanceEngine = new ResonanceEngine();
