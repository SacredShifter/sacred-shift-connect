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
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      throw new Error(`Content plan not found: ${planError?.message || 'Plan does not exist'}`)
    }

    console.log('Retrieved plan:', { 
      id: plan.id, 
      outline: plan.outline, 
      script_md: plan.script_md?.length || 0 
    })

    // Extract content blocks from outline or create default structure
    let contentBlocks = []
    if (plan.outline && Array.isArray(plan.outline)) {
      contentBlocks = plan.outline
    } else if (plan.outline && plan.outline.sections) {
      contentBlocks = plan.outline.sections
    } else if (plan.script_md) {
      // If no outline, create blocks from script
      const scriptSections = plan.script_md.split('\n\n').filter(section => section.trim())
      contentBlocks = scriptSections.map((section, index) => ({
        id: `section-${index}`,
        type: 'text',
        content: section.trim()
      }))
    } else {
      // Fallback: create a single block
      contentBlocks = [{
        id: 'default-block',
        type: 'text',
        content: plan.intent || 'Default content block'
      }]
    }

    console.log(`Processed ${contentBlocks.length} content blocks from plan`)

    // Generate Edit Decision List (EDL) from content blocks
    const edl = {
      version: "1.0",
      preset: preset,
      totalDuration: 0,
      tracks: [
        {
          type: "video",
          clips: contentBlocks.map((block: any, index: number) => ({
            id: block.id || `block-${index}`,
            type: block.type || 'text',
            startTime: index * 5000, // 5 seconds per block
            duration: 5000,
            content: block.content || block.text || 'Content block',
            transitions: {
              in: index === 0 ? "fade" : "cut",
              out: index === contentBlocks.length - 1 ? "fade" : "cut"
            }
          }))
        },
        {
          type: "audio",
          clips: []
        }
      ],
      metadata: {
        createdAt: new Date().toISOString(),
        planTitle: plan.intent || 'Video Plan',
        blockCount: contentBlocks.length,
        planId: plan.id
      }
    }

    // Calculate total duration
    edl.totalDuration = contentBlocks.length * 5000

    console.log('Generated EDL:', JSON.stringify(edl, null, 2))

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

    console.log(`Created render job ${renderJob.id} with EDL containing ${contentBlocks.length} blocks`)

    const startTime = Date.now()

    // Simulate video rendering process
    console.log(`Rendering video for plan: ${plan.intent || 'Unknown Plan'}`)
    console.log(`Processing ${contentBlocks.length} content blocks with preset ${preset}`)
    
    // In a real implementation, this would:
    // 1. Parse the EDL to understand the editing timeline
    // 2. Generate video segments from content blocks according to EDL
    // 3. Combine audio, video, and transitions as specified in EDL
    // 4. Apply the selected preset (aspect ratio, duration, etc.)
    // 5. Upload to storage
    
    // For now, simulate processing time based on content complexity
    const processingTime = Math.max(3000, contentBlocks.length * 1000)
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
            blockCount: contentBlocks.length,
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
        blocksProcessed: contentBlocks.length
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