import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting content orchestration cycle...');

    // Find sources that need syncing
    const { data: sources, error: sourcesError } = await supabase
      .from('content_sources')
      .select('*')
      .eq('sync_status', 'active')
      .or('next_sync_at.is.null,next_sync_at.lt.' + new Date().toISOString());

    if (sourcesError) {
      console.error('Error fetching sources:', sourcesError);
      throw sourcesError;
    }

    console.log(`Found ${sources?.length || 0} sources needing sync`);

    const results = [];

    // Process each source
    for (const source of sources || []) {
      try {
        console.log(`Syncing source: ${source.source_name}`);

        // Call the content-sync function for this source
        const { data: syncResult, error: syncError } = await supabase.functions.invoke('content-sync', {
          body: { sourceId: source.id }
        });

        if (syncError) {
          console.error(`Sync error for ${source.source_name}:`, syncError);
          results.push({
            source_id: source.id,
            source_name: source.source_name,
            success: false,
            error: syncError.message
          });
        } else {
          console.log(`Sync completed for ${source.source_name}:`, syncResult);
          results.push({
            source_id: source.id,
            source_name: source.source_name,
            success: syncResult.success,
            items_count: syncResult.itemsCount,
            error: syncResult.error
          });
        }
      } catch (error: any) {
        console.error(`Error processing source ${source.source_name}:`, error);
        results.push({
          source_id: source.id,
          source_name: source.source_name,
          success: false,
          error: error.message
        });
      }

      // Small delay between syncs to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Update orchestration log
    const orchestrationData = {
      phi_cycle_position: (Math.random() * 2 * Math.PI), // Golden ratio position
      global_sync_rhythm: '1 hour',
      last_orchestration_at: new Date().toISOString(),
      active_sources_count: sources?.length || 0,
      orchestration_health: results.length > 0 ? 
        results.filter(r => r.success).length / results.length : 1.0,
      metadata: {
        sync_results: results,
        total_items_synced: results.reduce((sum, r) => sum + (r.items_count || 0), 0)
      }
    };

    // Try to update existing orchestration record for current user
    // For system-wide orchestration, we'll use a system user ID
    const systemUserId = '00000000-0000-0000-0000-000000000000';
    
    const { error: orchestrationError } = await supabase
      .from('sync_orchestration')
      .upsert({
        user_id: systemUserId,
        ...orchestrationData
      }, {
        onConflict: 'user_id'
      });

    if (orchestrationError) {
      console.error('Error updating orchestration:', orchestrationError);
    }

    const successCount = results.filter(r => r.success).length;
    const totalItems = results.reduce((sum, r) => sum + (r.items_count || 0), 0);

    console.log(`Orchestration completed: ${successCount}/${results.length} sources synced, ${totalItems} total items`);

    return new Response(
      JSON.stringify({
        success: true,
        sources_processed: results.length,
        sources_successful: successCount,
        total_items_synced: totalItems,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Orchestration error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});