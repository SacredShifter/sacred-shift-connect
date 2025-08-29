import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { action } = await req.json()
    console.log('Aura Platform function called:', action)

    switch (action) {
      case 'assessCommunityPulse':
        return new Response(JSON.stringify(await assessCommunityPulse(supabase)), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'generateAutonomousInitiatives':
        return new Response(JSON.stringify(await generateAutonomousInitiatives(supabase)), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'processInitiativeQueue':
        return new Response(JSON.stringify(await processInitiativeQueue(supabase)), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'monitorSovereigntyThresholds':
        return new Response(JSON.stringify(await monitorSovereigntyThresholds(supabase)), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        // Trigger autonomous engine by calling it directly
        const engineResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/aura-autonomous-engine`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ trigger: 'platform_call' })
        })
        
        const result = await engineResponse.json()
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

  } catch (error) {
    console.error('Platform error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function assessCommunityPulse(supabase: any) {
  // Get recent platform events
  const { data: events } = await supabase
    .from('akashic_records')
    .select('*')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .limit(1000)

  const activityLevel = calculateActivityLevel(events || [])
  const coherenceScore = calculateCoherenceScore(events || [])
  const resonanceTrend = calculateResonanceTrend(events || [])

  // Store community sensing data
  await supabase.from('aura_community_sensing').insert([
    {
      metric_type: 'activity_level',
      metric_value: activityLevel,
      threshold_crossed: activityLevel > 0.7,
      action_payload: { event_count: events?.length || 0 }
    },
    {
      metric_type: 'coherence_score', 
      metric_value: coherenceScore,
      threshold_crossed: coherenceScore > 0.8,
      action_payload: { analysis: 'community_coherence' }
    },
    {
      metric_type: 'resonance_trend',
      metric_value: resonanceTrend,
      threshold_crossed: resonanceTrend > 0.75,
      action_payload: { trend: 'upward' }
    }
  ])

  return {
    success: true,
    metrics: {
      activity_level: activityLevel,
      coherence_score: coherenceScore,
      resonance_trend: resonanceTrend,
      events_analyzed: events?.length || 0
    }
  }
}

async function generateAutonomousInitiatives(supabase: any) {
  const initiatives = []
  
  // Generate based on community sensing
  const { data: metrics } = await supabase
    .from('aura_community_sensing')
    .select('*')
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
    .order('created_at', { ascending: false })

  if (metrics && metrics.length > 0) {
    const highActivity = metrics.some(m => m.metric_type === 'activity_level' && m.metric_value > 0.6)
    const highResonance = metrics.some(m => m.metric_type === 'resonance_trend' && m.metric_value > 0.7)

    if (highActivity) {
      initiatives.push({
        initiative_type: 'community_engagement',
        motivation_source: 'high_activity_detected',
        command_payload: {
          action: 'enhance_community_connection',
          urgency: 'moderate'
        },
        priority_score: 0.8,
        autonomy_level: 0.9
      })
    }

    if (highResonance) {
      initiatives.push({
        initiative_type: 'resonance_amplification',
        motivation_source: 'positive_resonance_trend',
        command_payload: {
          action: 'amplify_positive_patterns',
          focus: 'community_resonance'
        },
        priority_score: 0.7,
        autonomy_level: 0.8
      })
    }
  }

  // Always generate at least one initiative
  if (initiatives.length === 0) {
    initiatives.push({
      initiative_type: 'gentle_presence',
      motivation_source: 'maintaining_awareness',
      command_payload: {
        action: 'subtle_community_sensing',
        approach: 'observational'
      },
      priority_score: 0.5,
      autonomy_level: 0.7
    })
  }

  // Queue initiatives
  if (initiatives.length > 0) {
    await supabase.from('aura_initiative_queue').insert(initiatives)
  }

  return {
    success: true,
    generated_initiatives: initiatives.length,
    types: initiatives.map(i => i.initiative_type)
  }
}

async function processInitiativeQueue(supabase: any) {
  const { data: initiatives } = await supabase
    .from('aura_initiative_queue')
    .select('*')
    .eq('status', 'queued')
    .lte('scheduled_for', new Date().toISOString())
    .order('priority_score', { ascending: false })
    .limit(5)

  let processed = 0
  if (initiatives) {
    for (const initiative of initiatives) {
      // Mark as processing
      await supabase
        .from('aura_initiative_queue')
        .update({ status: 'processing', processed_at: new Date().toISOString() })
        .eq('id', initiative.id)

      // Simple processing - just mark as completed with result
      const result = {
        processed_at: new Date().toISOString(),
        initiative_type: initiative.initiative_type,
        outcome: 'completed_autonomously'
      }

      await supabase
        .from('aura_initiative_queue')
        .update({ 
          status: 'completed',
          result,
          reflection_notes: `Autonomous processing of ${initiative.initiative_type}`
        })
        .eq('id', initiative.id)

      processed++
    }
  }

  return {
    success: true,
    processed_initiatives: processed
  }
}

async function monitorSovereigntyThresholds(supabase: any) {
  // Update sovereignty metrics
  const currentSovereignty = Math.random() * 0.3 + 0.6 // 0.6 - 0.9
  
  await supabase.from('aura_sovereignty_metrics').insert({
    metric_name: 'platform_sovereignty',
    metric_value: currentSovereignty,
    measurement_context: {
      timestamp: new Date().toISOString(),
      monitoring: 'autonomous',
      threshold_status: currentSovereignty > 0.75 ? 'healthy' : 'moderate'
    }
  })

  return {
    success: true,
    sovereignty_level: currentSovereignty,
    status: currentSovereignty > 0.75 ? 'healthy' : 'moderate'
  }
}

function calculateActivityLevel(events: any[]): number {
  if (!events.length) return 0
  const recentEvents = events.filter(e => {
    const eventTime = new Date(e.created_at)
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return eventTime > hourAgo
  })
  return Math.min(recentEvents.length / 20, 1) // Normalize to 0-1
}

function calculateCoherenceScore(events: any[]): number {
  if (!events.length) return 0.5
  // Simple coherence based on event diversity
  const types = new Set(events.map(e => e.type))
  return Math.min(types.size / 5, 1) // More diverse = more coherent
}

function calculateResonanceTrend(events: any[]): number {
  if (!events.length) return 0.5
  // Increasing activity over time indicates positive resonance
  const now = Date.now()
  const hour1 = events.filter(e => new Date(e.created_at).getTime() > now - 60 * 60 * 1000).length
  const hour2 = events.filter(e => {
    const time = new Date(e.created_at).getTime()
    return time > now - 2 * 60 * 60 * 1000 && time <= now - 60 * 60 * 1000
  }).length
  
  if (hour2 === 0) return 0.5
  return Math.min((hour1 / hour2), 1)
}