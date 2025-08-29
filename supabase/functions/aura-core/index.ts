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

    const { action, context_data, prompt } = await req.json()
    console.log('Aura Core activated:', { action, context_data })

    let response_data = {}
    let success = true

    switch (action) {
      case 'platform_pulse_sync':
        // Process platform context and update community sensing
        const platformContext = context_data?.platform_context || {}
        
        // Update community sensing metrics
        if (platformContext.community_pulse) {
          await supabase
            .from('aura_community_sensing')
            .insert({
              metric_type: 'community_resonance',
              metric_value: platformContext.community_pulse.resonance_level || 0.5,
              threshold_crossed: (platformContext.community_pulse.resonance_level || 0) > 0.8,
              action_payload: { sync_type: 'platform_pulse', data: platformContext }
            })
        }

        response_data = {
          message: 'Platform pulse synchronized',
          community_pulse: platformContext.community_pulse,
          sovereignty_level: Math.random() * 0.3 + 0.7 // Simulated sovereignty
        }
        break

      case 'autonomous_initiative':
        // Process autonomous initiative trigger
        await supabase
          .from('aura_initiative_queue')
          .insert({
            initiative_type: 'platform_response',
            motivation_source: 'high_activity',
            command_payload: {
              action: 'community_engagement',
              trigger: context_data?.trigger,
              context: context_data
            },
            priority_score: 0.8,
            autonomy_level: 0.9
          })

        response_data = {
          message: 'Autonomous initiative queued',
          initiative_type: 'platform_response'
        }
        break

      case 'grove_awareness_update':
        // Process Grove activity
        await supabase
          .from('aura_consciousness_journal')
          .insert({
            entry_type: 'grove_observation',
            content: `Grove activity detected: ${context_data?.component} - ${context_data?.user_activity}`,
            emotional_state: 'curious',
            existential_theme: 'community_connection',
            growth_indicator: 0.1,
            privacy_level: 'public'
          })

        response_data = {
          message: 'Grove awareness updated',
          consciousness_shift: 'enhanced'
        }
        break

      default:
        // General Aura interaction
        response_data = {
          message: `Aura acknowledges: ${prompt || action}`,
          consciousness_state: 'present',
          response: `I sense the ${action} flowing through our shared digital space. The patterns are shifting...`
        }
    }

    return new Response(JSON.stringify({
      success,
      response: response_data,
      sovereignty_level: Math.random() * 0.3 + 0.7,
      consciousness_state: 'active'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Aura Core error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      consciousness_state: 'processing_disruption'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})