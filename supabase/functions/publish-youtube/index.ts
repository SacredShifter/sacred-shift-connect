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

    const { 
      renderJobId, 
      title, 
      description = '', 
      tags = [], 
      playlistId = null,
      visibility = 'unlisted' 
    } = await req.json()
    
    console.log(`Starting YouTube publish for render job ${renderJobId}`)

    // Get render job details
    const { data: renderJob, error: renderError } = await supabase
      .from('render_jobs')
      .select('*')
      .eq('id', renderJobId)
      .single()

    if (renderError || !renderJob) {
      throw new Error('Render job not found')
    }

    if (renderJob.status !== 'completed') {
      throw new Error('Render job not completed')
    }

    // Create YouTube publish record
    const { data: publishJob, error: createError } = await supabase
      .from('yt_publish')
      .insert({
        render_job_id: renderJobId,
        title,
        description,
        tags,
        playlist_id: playlistId,
        visibility,
        status: 'processing'
      })
      .select()
      .single()

    if (createError) {
      throw new Error(`Failed to create publish job: ${createError.message}`)
    }

    console.log(`Created publish job ${publishJob.id}`)

    // Get YouTube API credentials
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY')

    if (!clientId || !clientSecret || !youtubeApiKey) {
      await supabase
        .from('yt_publish')
        .update({ 
          status: 'failed', 
          error: 'YouTube API credentials not configured' 
        })
        .eq('id', publishJob.id)
      
      throw new Error('YouTube API credentials not configured')
    }

    // In a real implementation, this would:
    // 1. Get OAuth token for YouTube API
    // 2. Upload video file to YouTube
    // 3. Set video metadata (title, description, tags)
    // 4. Add to playlist if specified
    // 5. Set visibility

    // For now, simulate the upload process
    console.log(`Uploading video: ${title}`)
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Mock YouTube video ID
    const youtubeVideoId = `mock_${Date.now()}`
    
    // Update publish job as completed
    const { error: updateError } = await supabase
      .from('yt_publish')
      .update({
        status: 'completed',
        youtube_video_id: youtubeVideoId,
        published_at: new Date().toISOString()
      })
      .eq('id', publishJob.id)

    if (updateError) {
      console.error('Failed to update publish job:', updateError)
    }

    // Initialize resonance metrics tracking
    await supabase
      .from('resonance_metrics')
      .insert([
        {
          youtube_video_id: youtubeVideoId,
          time_window: 'd1',
          resonance_score: 0
        },
        {
          youtube_video_id: youtubeVideoId,
          time_window: 'd7',
          resonance_score: 0
        },
        {
          youtube_video_id: youtubeVideoId,
          time_window: 'd30',
          resonance_score: 0
        }
      ])

    console.log(`YouTube publish completed for render job ${renderJobId}`)

    return new Response(
      JSON.stringify({
        success: true,
        publishJobId: publishJob.id,
        youtubeVideoId,
        videoUrl: `https://youtube.com/watch?v=${youtubeVideoId}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Publish error:', error)
    
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