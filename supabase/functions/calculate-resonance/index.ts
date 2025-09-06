import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContentData {
  title: string;
  description?: string;
  tags?: string[];
  duration?: number;
}

interface UserProfile {
  current_level: string;
  awareness: number;
  presence: number;
  compassion: number;
  wisdom: number;
}

interface ResonanceResult {
  resonance_score: number;
  consciousness_alignment: number;
  emotional_impact: number;
  learning_potential: number;
  spiritual_depth: number;
  ai_insights: {
    key_themes: string[];
    consciousness_benefits: string[];
    recommended_practices: string[];
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { content, user_profile } = await req.json()

    if (!content || !user_profile) {
      return new Response(
        JSON.stringify({ error: 'Missing required data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Calculate consciousness resonance based on Sacred Shifter principles
    const resonance = calculateConsciousnessResonance(content, user_profile)

    return new Response(
      JSON.stringify(resonance),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error calculating resonance:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function calculateConsciousnessResonance(content: ContentData, userProfile: UserProfile): ResonanceResult {
  // Sacred Shifter Resonance Algorithm
  // Based on the 7 Hermetic Principles and consciousness development levels

  const { title, description = '', tags = [], duration = 0 } = content
  const { current_level, awareness, presence, compassion, wisdom } = userProfile

  // Consciousness level multipliers (higher levels = more discerning)
  const levelMultipliers = {
    'initiate': 0.6,
    'seeker': 0.7,
    'student': 0.8,
    'adept': 0.9,
    'practitioner': 1.0,
    'teacher': 1.1,
    'master': 1.2,
    'guardian': 1.3,
    'sage': 1.4,
    'enlightened': 1.5,
    'transcendent': 1.6,
    'cosmic': 1.7
  }

  const levelMultiplier = levelMultipliers[current_level as keyof typeof levelMultipliers] || 0.6

  // 1. Content Analysis (Principle of Mentalism)
  const contentText = `${title} ${description} ${tags.join(' ')}`.toLowerCase()
  
  // Sacred keywords and their resonance values
  const sacredKeywords = {
    // High resonance (Divine Truth)
    'truth': 0.9, 'love': 0.9, 'wisdom': 0.9, 'consciousness': 0.9, 'awakening': 0.9,
    'enlightenment': 0.9, 'spiritual': 0.8, 'sacred': 0.8, 'divine': 0.8, 'transcendence': 0.8,
    'meditation': 0.8, 'mindfulness': 0.8, 'presence': 0.8, 'awareness': 0.8, 'compassion': 0.8,
    'healing': 0.7, 'growth': 0.7, 'transformation': 0.7, 'evolution': 0.7, 'resonance': 0.7,
    'frequency': 0.7, 'vibration': 0.7, 'energy': 0.6, 'light': 0.6, 'peace': 0.6,
    
    // Medium resonance (Practical Application)
    'learning': 0.5, 'teaching': 0.5, 'practice': 0.5, 'technique': 0.4, 'method': 0.4,
    'guide': 0.4, 'tutorial': 0.3, 'how': 0.3, 'tips': 0.3, 'advice': 0.3,
    
    // Low resonance (Distraction)
    'entertainment': 0.2, 'fun': 0.2, 'comedy': 0.1, 'joke': 0.1, 'drama': 0.1,
    'gossip': 0.1, 'news': 0.1, 'politics': 0.1, 'celebrity': 0.1, 'shopping': 0.1
  }

  // Calculate keyword resonance
  let keywordResonance = 0
  let keywordCount = 0
  for (const [keyword, value] of Object.entries(sacredKeywords)) {
    if (contentText.includes(keyword)) {
      keywordResonance += value
      keywordCount++
    }
  }
  const avgKeywordResonance = keywordCount > 0 ? keywordResonance / keywordCount : 0.3

  // 2. Duration Analysis (Principle of Rhythm)
  let durationResonance = 0.5
  if (duration > 0) {
    if (duration <= 300) { // 5 minutes or less - quick insights
      durationResonance = 0.6
    } else if (duration <= 900) { // 5-15 minutes - optimal learning
      durationResonance = 0.8
    } else if (duration <= 1800) { // 15-30 minutes - deep dive
      durationResonance = 0.9
    } else if (duration <= 3600) { // 30-60 minutes - comprehensive
      durationResonance = 0.7
    } else { // Over 1 hour - potentially overwhelming
      durationResonance = 0.4
    }
  }

  // 3. User Profile Alignment (Principle of Correspondence)
  const userAlignment = (awareness + presence + compassion + wisdom) / 400 // Normalize to 0-1
  const profileResonance = Math.min(1, userAlignment * levelMultiplier)

  // 4. Content Depth Analysis (Principle of Polarity)
  const hasDescription = description.length > 50
  const hasTags = tags.length > 0
  const contentDepth = (hasDescription ? 0.3 : 0) + (hasTags ? 0.2 : 0) + 0.5
  const depthResonance = Math.min(1, contentDepth)

  // 5. Sacred Geometry Alignment (Principle of Vibration)
  const sacredGeometryWords = ['circle', 'sphere', 'triangle', 'square', 'pentagon', 'hexagon', 'octagon', 'spiral', 'fractal', 'mandala', 'labyrinth']
  const hasSacredGeometry = sacredGeometryWords.some(word => contentText.includes(word))
  const geometryResonance = hasSacredGeometry ? 0.8 : 0.5

  // 6. Final Resonance Calculation
  const baseResonance = (
    avgKeywordResonance * 0.4 +
    durationResonance * 0.2 +
    profileResonance * 0.2 +
    depthResonance * 0.1 +
    geometryResonance * 0.1
  )

  // Apply consciousness level multiplier
  const finalResonance = Math.min(1, baseResonance * levelMultiplier)

  // Generate AI insights based on resonance
  const insights = generateAIInsights(content, finalResonance, userProfile)

  return {
    resonance_score: Math.round(finalResonance * 100) / 100,
    consciousness_alignment: Math.round(profileResonance * 100) / 100,
    emotional_impact: Math.round(avgKeywordResonance * 100) / 100,
    learning_potential: Math.round(durationResonance * 100) / 100,
    spiritual_depth: Math.round(depthResonance * 100) / 100,
    ai_insights: insights
  }
}

function generateAIInsights(content: ContentData, resonance: number, userProfile: UserProfile) {
  const { title, description = '', tags = [] } = content
  const { current_level } = userProfile

  // Key themes based on content analysis
  const keyThemes = []
  if (title.toLowerCase().includes('meditation') || description.toLowerCase().includes('meditation')) {
    keyThemes.push('Meditation & Mindfulness')
  }
  if (title.toLowerCase().includes('consciousness') || description.toLowerCase().includes('consciousness')) {
    keyThemes.push('Consciousness Expansion')
  }
  if (title.toLowerCase().includes('healing') || description.toLowerCase().includes('healing')) {
    keyThemes.push('Healing & Transformation')
  }
  if (title.toLowerCase().includes('wisdom') || description.toLowerCase().includes('wisdom')) {
    keyThemes.push('Ancient Wisdom')
  }
  if (title.toLowerCase().includes('energy') || description.toLowerCase().includes('energy')) {
    keyThemes.push('Energy Work')
  }

  // Consciousness benefits based on resonance level
  const consciousnessBenefits = []
  if (resonance > 0.8) {
    consciousnessBenefits.push('Deep consciousness expansion')
    consciousnessBenefits.push('Spiritual awakening acceleration')
    consciousnessBenefits.push('Enhanced intuition development')
  } else if (resonance > 0.6) {
    consciousnessBenefits.push('Consciousness growth support')
    consciousnessBenefits.push('Spiritual practice enhancement')
    consciousnessBenefits.push('Inner wisdom activation')
  } else if (resonance > 0.4) {
    consciousnessBenefits.push('Gentle consciousness expansion')
    consciousnessBenefits.push('Spiritual foundation building')
  } else {
    consciousnessBenefits.push('Basic spiritual awareness')
  }

  // Recommended practices based on user level and content
  const recommendedPractices = []
  if (current_level === 'initiate' || current_level === 'seeker') {
    recommendedPractices.push('Practice mindful consumption')
    recommendedPractices.push('Take notes on key insights')
    recommendedPractices.push('Reflect on personal resonance')
  } else if (current_level === 'student' || current_level === 'adept') {
    recommendedPractices.push('Integrate insights into daily practice')
    recommendedPractices.push('Share wisdom with others')
    recommendedPractices.push('Create personal annotations')
  } else {
    recommendedPractices.push('Teach and guide others')
    recommendedPractices.push('Create advanced practices')
    recommendedPractices.push('Mentor fellow seekers')
  }

  return {
    key_themes: keyThemes.length > 0 ? keyThemes : ['General Spiritual Content'],
    consciousness_benefits: consciousnessBenefits,
    recommended_practices: recommendedPractices
  }
}
