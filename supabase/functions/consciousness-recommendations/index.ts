import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ConsciousnessRecommendation {
  id: string;
  title: string;
  description: string;
  content_type: string;
  content_url: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  resonance_score: number;
  consciousness_benefits: string[];
  recommended_practices: string[];
  reason: string;
}

interface UserProfile {
  current_level: string;
  awareness: number;
  presence: number;
  compassion: number;
  wisdom: number;
  total_points: number;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      brainwave_state, 
      emotional_state, 
      user_archetype, 
      time_of_day, 
      lunar_phase, 
      spiritual_level, 
      learning_pattern 
    } = await req.json()

    if (!brainwave_state || !emotional_state) {
      return new Response(
        JSON.stringify({ error: 'Missing required consciousness data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user profile from database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user consciousness profile
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { data: profile } = await supabaseClient
      .from('consciousness_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'Consciousness profile not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate consciousness-based recommendations
    const recommendations = await generateConsciousnessRecommendations({
      brainwave_state,
      emotional_state,
      user_archetype: user_archetype || [],
      time_of_day,
      lunar_phase,
      spiritual_level: spiritual_level || 'beginner',
      learning_pattern: learning_pattern || 'visual',
      profile
    })

    return new Response(
      JSON.stringify(recommendations),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error generating consciousness recommendations:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function generateConsciousnessRecommendations(params: any): Promise<ConsciousnessRecommendation[]> {
  const { 
    brainwave_state, 
    emotional_state, 
    user_archetype, 
    time_of_day, 
    lunar_phase, 
    spiritual_level, 
    learning_pattern,
    profile 
  } = params

  // Sacred Shifter Recommendation Algorithm
  // Based on consciousness state, time, and user profile

  const recommendations: ConsciousnessRecommendation[] = []

  // Morning recommendations (6-12)
  if (time_of_day >= 6 && time_of_day < 12) {
    recommendations.push({
      id: 'morning-meditation',
      title: 'Sacred Morning Meditation',
      description: 'Begin your day with conscious intention and sacred geometry visualization',
      content_type: 'meditation',
      content_url: '/meditations/morning-sacred',
      thumbnail_url: '/images/morning-meditation.jpg',
      duration_seconds: 900, // 15 minutes
      resonance_score: 0.9,
      consciousness_benefits: [
        'Sets conscious intention for the day',
        'Activates morning energy patterns',
        'Aligns with solar consciousness'
      ],
      recommended_practices: [
        'Practice before 8 AM for maximum benefit',
        'Use sacred geometry visualization',
        'Set daily intentions'
      ],
      reason: 'Morning energy is optimal for consciousness expansion'
    })
  }

  // Afternoon recommendations (12-18)
  if (time_of_day >= 12 && time_of_day < 18) {
    recommendations.push({
      id: 'afternoon-learning',
      title: 'Consciousness Learning Session',
      description: 'Deep dive into spiritual teachings and consciousness expansion',
      content_type: 'learning',
      content_url: '/learning/consciousness-expansion',
      thumbnail_url: '/images/learning-session.jpg',
      duration_seconds: 1800, // 30 minutes
      resonance_score: 0.8,
      consciousness_benefits: [
        'Enhances learning capacity',
        'Strengthens neural pathways',
        'Builds spiritual knowledge'
      ],
      recommended_practices: [
        'Take notes on key insights',
        'Practice active listening',
        'Reflect on personal resonance'
      ],
      reason: 'Afternoon is optimal for learning and knowledge integration'
    })
  }

  // Evening recommendations (18-24)
  if (time_of_day >= 18 && time_of_day < 24) {
    recommendations.push({
      id: 'evening-reflection',
      title: 'Sacred Evening Reflection',
      description: 'Integrate the day\'s experiences through conscious reflection',
      content_type: 'reflection',
      content_url: '/reflections/evening-integration',
      thumbnail_url: '/images/evening-reflection.jpg',
      duration_seconds: 1200, // 20 minutes
      resonance_score: 0.85,
      consciousness_benefits: [
        'Integrates daily experiences',
        'Promotes deep reflection',
        'Prepares for restful sleep'
      ],
      recommended_practices: [
        'Journal your insights',
        'Practice gratitude',
        'Release the day with love'
      ],
      reason: 'Evening is perfect for integration and reflection'
    })
  }

  // Brainwave state specific recommendations
  if (brainwave_state === 'alpha') {
    recommendations.push({
      id: 'alpha-meditation',
      title: 'Alpha State Meditation',
      description: 'Deepen your alpha state for enhanced creativity and intuition',
      content_type: 'meditation',
      content_url: '/meditations/alpha-state',
      thumbnail_url: '/images/alpha-meditation.jpg',
      duration_seconds: 1500, // 25 minutes
      resonance_score: 0.9,
      consciousness_benefits: [
        'Enhances creativity',
        'Strengthens intuition',
        'Promotes flow state'
      ],
      recommended_practices: [
        'Maintain relaxed focus',
        'Use binaural beats',
        'Practice visualization'
      ],
      reason: 'Alpha state is optimal for creative and intuitive work'
    })
  }

  if (brainwave_state === 'theta') {
    recommendations.push({
      id: 'theta-healing',
      title: 'Theta Healing Session',
      description: 'Access deep healing and subconscious programming in theta state',
      content_type: 'healing',
      content_url: '/healing/theta-state',
      thumbnail_url: '/images/theta-healing.jpg',
      duration_seconds: 2100, // 35 minutes
      resonance_score: 0.95,
      consciousness_benefits: [
        'Deep subconscious healing',
        'Access to inner wisdom',
        'Transformation of limiting beliefs'
      ],
      recommended_practices: [
        'Create sacred space',
        'Use healing affirmations',
        'Practice deep breathing'
      ],
      reason: 'Theta state provides access to deep healing and transformation'
    })
  }

  // Emotional state specific recommendations
  if (emotional_state === 'peaceful') {
    recommendations.push({
      id: 'peaceful-wisdom',
      title: 'Wisdom Integration',
      description: 'Channel your peaceful state into wisdom and understanding',
      content_type: 'wisdom',
      content_url: '/wisdom/integration',
      thumbnail_url: '/images/wisdom-session.jpg',
      duration_seconds: 1800, // 30 minutes
      resonance_score: 0.9,
      consciousness_benefits: [
        'Deepens wisdom understanding',
        'Enhances spiritual insight',
        'Strengthens inner peace'
      ],
      recommended_practices: [
        'Study sacred texts',
        'Practice contemplation',
        'Share wisdom with others'
      ],
      reason: 'Peaceful state is ideal for wisdom integration and sharing'
    })
  }

  if (emotional_state === 'motivated') {
    recommendations.push({
      id: 'motivated-action',
      title: 'Conscious Action',
      description: 'Channel your motivation into conscious action and service',
      content_type: 'action',
      content_url: '/action/conscious-service',
      thumbnail_url: '/images/action-session.jpg',
      duration_seconds: 1200, // 20 minutes
      resonance_score: 0.8,
      consciousness_benefits: [
        'Channels energy constructively',
        'Promotes conscious action',
        'Builds momentum for growth'
      ],
      recommended_practices: [
        'Set clear intentions',
        'Take inspired action',
        'Serve others consciously'
      ],
      reason: 'Motivated state is perfect for conscious action and service'
    })
  }

  // Lunar phase specific recommendations
  if (lunar_phase === 'waxing') {
    recommendations.push({
      id: 'waxing-growth',
      title: 'Waxing Moon Growth',
      description: 'Harness the growing lunar energy for personal development',
      content_type: 'growth',
      content_url: '/growth/waxing-moon',
      thumbnail_url: '/images/lunar-growth.jpg',
      duration_seconds: 1500, // 25 minutes
      resonance_score: 0.85,
      consciousness_benefits: [
        'Accelerates personal growth',
        'Builds momentum for goals',
        'Enhances manifestation power'
      ],
      recommended_practices: [
        'Set growth intentions',
        'Visualize your goals',
        'Take inspired action'
      ],
      reason: 'Waxing moon energy supports growth and manifestation'
    })
  }

  if (lunar_phase === 'full') {
    recommendations.push({
      id: 'full-moon-illumination',
      title: 'Full Moon Illumination',
      description: 'Receive illumination and clarity under the full moon',
      content_type: 'illumination',
      content_url: '/illumination/full-moon',
      thumbnail_url: '/images/full-moon.jpg',
      duration_seconds: 1800, // 30 minutes
      resonance_score: 0.95,
      consciousness_benefits: [
        'Receives maximum illumination',
        'Gains deep clarity',
        'Accesses higher wisdom'
      ],
      recommended_practices: [
        'Practice under moonlight',
        'Meditate on clarity',
        'Receive divine guidance'
      ],
      reason: 'Full moon provides maximum illumination and clarity'
    })
  }

  // Spiritual level specific recommendations
  if (spiritual_level === 'beginner') {
    recommendations.push({
      id: 'beginner-foundation',
      title: 'Spiritual Foundation',
      description: 'Build a strong foundation for your spiritual journey',
      content_type: 'foundation',
      content_url: '/foundation/spiritual-basics',
      thumbnail_url: '/images/spiritual-foundation.jpg',
      duration_seconds: 1200, // 20 minutes
      resonance_score: 0.8,
      consciousness_benefits: [
        'Builds spiritual foundation',
        'Introduces core concepts',
        'Establishes daily practices'
      ],
      recommended_practices: [
        'Start with simple practices',
        'Focus on consistency',
        'Build gradually'
      ],
      reason: 'Strong foundation is essential for spiritual growth'
    })
  }

  if (spiritual_level === 'advanced') {
    recommendations.push({
      id: 'advanced-integration',
      title: 'Advanced Integration',
      description: 'Integrate advanced spiritual concepts and practices',
      content_type: 'integration',
      content_url: '/integration/advanced-concepts',
      thumbnail_url: '/images/advanced-integration.jpg',
      duration_seconds: 2400, // 40 minutes
      resonance_score: 0.9,
      consciousness_benefits: [
        'Deepens spiritual understanding',
        'Integrates advanced concepts',
        'Prepares for mastery'
      ],
      recommended_practices: [
        'Practice advanced techniques',
        'Teach others',
        'Serve as a guide'
      ],
      reason: 'Advanced practitioners need deeper integration and service'
    })
  }

  // Sort by resonance score and return top 5
  return recommendations
    .sort((a, b) => b.resonance_score - a.resonance_score)
    .slice(0, 5)
}
