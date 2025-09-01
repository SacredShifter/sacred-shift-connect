import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { planId, preset = 'long_16x9' } = await req.json()
    
    console.log(`Starting video render for plan ${planId} with preset ${preset}`)

    // Create render job
    const { data: renderJob, error: createError } = await supabase
      .from('render_jobs')
      .insert({
        plan_id: planId,
        preset: preset,
        status: 'processing'
      })
      .select()
      .single()

    if (createError) {
      throw new Error(`Failed to create render job: ${createError.message}`)
    }

    console.log(`Created render job ${renderJob.id}`)

    // Get content plan with related data
    const { data: plan, error: planError } = await supabase
      .from('content_plans')
      .select(`
        *,
        content_blocks(*)
      `)
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      await supabase
        .from('render_jobs')
        .update({ 
          status: 'failed', 
          error: 'Content plan not found',
          completed_at: new Date().toISOString()
        })
        .eq('id', renderJob.id)
      
      throw new Error('Content plan not found')
    }

    const startTime = Date.now()

    // Simulate video rendering process
    console.log(`Rendering video for plan: ${plan.title}`)
    
    // In a real implementation, this would:
    // 1. Generate video segments from content blocks
    // 2. Combine audio, video, and transitions
    // 3. Apply the selected preset (aspect ratio, duration, etc.)
    // 4. Upload to storage
    
    // For now, simulate processing time
    await new Promise(resolve => setTimeout(resolve, 5000))

    const processingTime = Date.now() - startTime
    const outputPath = `renders/${renderJob.id}/output.mp4`
    const thumbPath = `renders/${renderJob.id}/thumb.jpg`

    // Update render job as completed
    const { error: updateError } = await supabase
      .from('render_jobs')
      .update({
        status: 'completed',
        output_paths: [outputPath],
        completed_at: new Date().toISOString(),
        processing_time_ms: processingTime
      })
      .eq('id', renderJob.id)

    if (updateError) {
      console.error('Failed to update render job:', updateError)
    }

    // Create media assets records
    await supabase
      .from('media_assets')
      .insert([
        {
          plan_id: planId,
          type: 'video',
          storage_path: outputPath,
          duration_ms: 60000, // Mock 60 second video
          metadata: { preset, quality: 'HD' }
        },
        {
          plan_id: planId,
          type: 'thumb',
          storage_path: thumbPath,
          metadata: { width: 1280, height: 720 }
        }
      ])

    console.log(`Video render completed for plan ${planId}`)

    return new Response(
      JSON.stringify({
        success: true,
        renderJobId: renderJob.id,
        outputPath,
        processingTimeMs: processingTime
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Render error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})