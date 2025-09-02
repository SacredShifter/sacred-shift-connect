import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the user's JWT from the auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Invalid authentication credentials' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse the request body
    const { card_id, is_reversed, interpretation, orientation, reflection } = await req.json();

    // The user's plan specified `orientation` and `reflection` for the `tarot_readings` table
    // I will use those columns. `orientation` can store 'upright' or 'reversed'.
    const readingData = {
      user_id: user.id,
      card_id: card_id,
      orientation: is_reversed ? 'reversed' : 'upright',
      reflection: interpretation,
    };

    // Insert the data into the tarot_readings table
    const { error: insertError } = await supabase
      .from('tarot_readings')
      .insert(readingData);

    if (insertError) {
      console.error('DB insert error:', insertError);
      throw new Error(insertError.message);
    }

    return new Response(JSON.stringify({ success: true, message: 'Tarot reading logged successfully.' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in log_tarot_pull function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
