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

    // Get content plan first to generate EDL
    const { data: plan, error: planError } = await supabase
      .from('content_plans')
      .select(`
        *,
        content_blocks(*)
      `)
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      throw new Error('Content plan not found')
    }

    // Generate Edit Decision List (EDL) from content blocks
    const edl = {
      version: "1.0",
      preset: preset,
      totalDuration: 0,
      tracks: [
        {
          type: "video",
          clips: plan.content_blocks?.map((block: any, index: number) => ({
            id: block.id,
            type: block.type,
            startTime: index * 5000, // 5 seconds per block
            duration: 5000,
            content: block.content,
            transitions: {
              in: index === 0 ? "fade" : "cut",
              out: index === plan.content_blocks.length - 1 ? "fade" : "cut"
            }
          })) || []
        },
        {
          type: "audio",
          clips: []
        }
      ],
      metadata: {
        createdAt: new Date().toISOString(),
        planTitle: plan.title,
        blockCount: plan.content_blocks?.length || 0
      }
    }

    // Calculate total duration
    edl.totalDuration = (plan.content_blocks?.length || 0) * 5000

    console.log('Generated EDL:', JSON.stringify(edl, null, 2))
    console.log('Plan data:', { id: planId, title: plan.title, blocksCount: plan.content_blocks?.length })

    // Validate EDL before insertion
    const edlString = JSON.stringify(edl)
    if (!edlString || edlString === 'null' || edlString === 'undefined') {
      throw new Error(`Invalid EDL generated: ${edlString}`)
    }

    // Create render job with EDL
    const { data: renderJob, error: createError } = await supabase
      .from('render_jobs')
      .insert({
        plan_id: planId,
        preset: preset,
        edl: edlString,
        status: 'processing'
      })
      .select()
      .single()

    if (createError) {
      throw new Error(`Failed to create render job: ${createError.message}`)
    }

    console.log(`Created render job ${renderJob.id} with EDL containing ${plan.content_blocks?.length || 0} blocks`)

    const startTime = Date.now()

    // Simulate video rendering process
    console.log(`Rendering video for plan: ${plan.title}`)
    console.log(`Processing ${plan.content_blocks?.length || 0} content blocks with preset ${preset}`)
    
    // In a real implementation, this would:
    // 1. Parse the EDL to understand the editing timeline
    // 2. Generate video segments from content blocks according to EDL
    // 3. Combine audio, video, and transitions as specified in EDL
    // 4. Apply the selected preset (aspect ratio, duration, etc.)
    // 5. Upload to storage
    
    // For now, simulate processing time based on content complexity
    const processingTime = Math.max(3000, (plan.content_blocks?.length || 1) * 1000)
    await new Promise(resolve => setTimeout(resolve, processingTime))

    const finalProcessingTime = Date.now() - startTime
    const outputPath = `renders/${renderJob.id}/output.mp4`
    const thumbPath = `renders/${renderJob.id}/thumb.jpg`

    // Update render job as completed
    const { error: updateError } = await supabase
      .from('render_jobs')
      .update({
        status: 'completed',
        output_paths: [outputPath],
        completed_at: new Date().toISOString(),
        render_time_ms: finalProcessingTime
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
          duration_ms: edl.totalDuration,
          metadata: { 
            preset, 
            quality: 'HD',
            blockCount: plan.content_blocks?.length || 0,
            edlVersion: edl.version
          }
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
        processingTimeMs: finalProcessingTime,
        edl: edl,
        blocksProcessed: plan.content_blocks?.length || 0
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