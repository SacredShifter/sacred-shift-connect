import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { seed_id, user_id } = await req.json();

    if (!seed_id) {
      return new Response(
        JSON.stringify({ error: 'seed_id is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get the seed
    const { data: seed, error: seedError } = await supabaseClient
      .from('content_seeds')
      .select('*')
      .eq('id', seed_id)
      .single();

    if (seedError || !seed) {
      return new Response(
        JSON.stringify({ error: 'Seed not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Get taxonomy for context
    const { data: taxonomy } = await supabaseClient
      .from('taxonomy')
      .select('*')
      .eq('category', seed.primary_taxonomy);

    // Generate content plan using AI
    const contentPlan = await generateContentPlan(seed, taxonomy);

    // Create content plan record
    const { data: plan, error: planError } = await supabaseClient
      .from('content_plans')
      .insert({
        seed_id: seed_id,
        user_id: user_id,
        title: contentPlan.title,
        description: contentPlan.description,
        content_structure: contentPlan.structure,
        video_script: contentPlan.script,
        visual_directions: contentPlan.visuals,
        audio_directions: contentPlan.audio,
        target_duration: contentPlan.duration,
        sacred_elements: contentPlan.sacred_elements,
        chakra_focus: contentPlan.chakra_focus,
        energy_signature: contentPlan.energy_signature,
        status: 'generated'
      })
      .select()
      .single();

    if (planError) {
      console.error('Error creating content plan:', planError);
      return new Response(
        JSON.stringify({ error: 'Failed to create content plan' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Update seed status
    await supabaseClient
      .from('content_seeds')
      .update({ 
        status: 'planned',
        processed_at: new Date().toISOString()
      })
      .eq('id', seed_id);

    // Generate media assets in parallel
    await generateMediaAssets(supabaseClient, plan.id, contentPlan);

    return new Response(
      JSON.stringify({ 
        success: true, 
        plan_id: plan.id,
        content_plan: contentPlan
      }),
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error('Content planning error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

async function generateContentPlan(seed: any, taxonomy: any) {
  // AI-powered content planning based on seed characteristics
  const sacredElements = extractSacredElements(seed.content_text);
  const energySignature = calculateEnergySignature(seed);
  
  return {
    title: generateSacredTitle(seed),
    description: generateDescription(seed, sacredElements),
    structure: generateContentStructure(seed, taxonomy),
    script: generateVideoScript(seed, sacredElements),
    visuals: generateVisualDirections(seed, energySignature),
    audio: generateAudioDirections(seed),
    duration: calculateOptimalDuration(seed),
    sacred_elements: sacredElements,
    chakra_focus: determinePrimaryChakra(seed),
    energy_signature: energySignature
  };
}

function extractSacredElements(content: string): string[] {
  const sacredKeywords = [
    'sacred', 'divine', 'awakening', 'consciousness', 'transformation',
    'healing', 'wisdom', 'light', 'energy', 'spiritual', 'meditation',
    'chakra', 'aura', 'vibration', 'frequency', 'ascension', 'enlightenment'
  ];
  
  const elements = [];
  const lowerContent = content.toLowerCase();
  
  for (const keyword of sacredKeywords) {
    if (lowerContent.includes(keyword)) {
      elements.push(keyword);
    }
  }
  
  return elements;
}

function calculateEnergySignature(seed: any): any {
  const intensity = seed.emotional_intensity || 0.5;
  const wisdom = seed.wisdom_depth || 0.5;
  const transformative = seed.transformative_potential || 0.5;
  
  return {
    intensity_level: intensity,
    wisdom_depth: wisdom,
    transformative_power: transformative,
    frequency_hz: Math.round(432 + (intensity * 396)), // Sacred frequencies
    color_palette: generateColorPalette(intensity, wisdom),
    geometric_pattern: selectSacredGeometry(transformative)
  };
}

function generateSacredTitle(seed: any): string {
  const titleTemplates = [
    "Sacred Wisdom: {theme}",
    "Divine Insights on {theme}",
    "Awakening Through {theme}",
    "The Sacred Path of {theme}",
    "Consciousness & {theme}",
    "Transformative {theme} Journey"
  ];
  
  const theme = seed.primary_taxonomy || 'Spiritual Growth';
  const template = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
  return template.replace('{theme}', theme);
}

function generateDescription(seed: any, sacredElements: string[]): string {
  return `Join us on a transformative journey exploring ${seed.primary_taxonomy}. ` +
         `This sacred content integrates ${sacredElements.slice(0, 3).join(', ')} ` +
         `to guide you toward deeper understanding and spiritual awakening. ` +
         `Experience the divine wisdom that emerges from authentic spiritual practice.`;
}

function generateContentStructure(seed: any, taxonomy: any): any {
  return {
    opening: {
      duration: 30,
      type: "sacred_invocation",
      elements: ["breathing", "intention_setting", "energy_alignment"]
    },
    main_content: {
      duration: 300,
      sections: [
        {
          title: "Sacred Context",
          duration: 60,
          content_type: "wisdom_sharing"
        },
        {
          title: "Experiential Journey",
          duration: 180,
          content_type: "guided_experience"
        },
        {
          title: "Integration Wisdom",
          duration: 60,
          content_type: "practical_application"
        }
      ]
    },
    closing: {
      duration: 30,
      type: "sacred_blessing",
      elements: ["gratitude", "intention_sealing", "community_connection"]
    }
  };
}

function generateVideoScript(seed: any, sacredElements: string[]): string {
  return `
[OPENING - Sacred Invocation]
Welcome, beautiful souls, to this sacred space of transformation...

[MAIN CONTENT]
Today we explore the divine wisdom of ${seed.primary_taxonomy}...
${seed.content_text.substring(0, 200)}...

[EXPERIENTIAL SECTION]
Let us now journey together into the heart of this teaching...

[INTEGRATION]
As we close this sacred sharing, reflect on how this wisdom...

[CLOSING - Sacred Blessing]
May this wisdom serve your highest good and the awakening of all beings...
  `.trim();
}

function generateVisualDirections(seed: any, energySignature: any): any {
  return {
    color_scheme: energySignature.color_palette,
    sacred_geometry: energySignature.geometric_pattern,
    visual_flow: "organic_spiral",
    imagery_style: "ethereal_natural",
    text_overlays: [
      { text: seed.primary_taxonomy, timing: "0:05", style: "sacred_title" },
      { text: "Sacred Wisdom", timing: "0:15", style: "subtitle" }
    ],
    background_elements: ["flowing_light", "sacred_symbols", "natural_textures"]
  };
}

function generateAudioDirections(seed: any): any {
  return {
    music_style: "ambient_sacred",
    frequency_tuning: 432,
    voice_processing: "warm_presence",
    sound_effects: ["singing_bowls", "nature_sounds", "subtle_chimes"],
    volume_dynamics: "gentle_waves"
  };
}

function calculateOptimalDuration(seed: any): number {
  const baseTime = 360; // 6 minutes base
  const complexityFactor = (seed.wisdom_depth || 0.5) * 240; // Up to 4 minutes more
  return Math.round(baseTime + complexityFactor);
}

function determinePrimaryChakra(seed: any): string {
  const chakras = ['root', 'sacral', 'solar_plexus', 'heart', 'throat', 'third_eye', 'crown'];
  const content = seed.content_text.toLowerCase();
  
  if (content.includes('wisdom') || content.includes('insight')) return 'third_eye';
  if (content.includes('love') || content.includes('heart')) return 'heart';
  if (content.includes('truth') || content.includes('voice')) return 'throat';
  if (content.includes('power') || content.includes('confidence')) return 'solar_plexus';
  if (content.includes('creative') || content.includes('emotion')) return 'sacral';
  if (content.includes('ground') || content.includes('foundation')) return 'root';
  
  return 'crown'; // Default to crown for general spiritual content
}

function generateColorPalette(intensity: number, wisdom: number): string[] {
  const palettes = {
    high_intensity: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    balanced: ['#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'],
    deep_wisdom: ['#2C3E50', '#8E44AD', '#3498DB', '#1ABC9C']
  };
  
  if (intensity > 0.7) return palettes.high_intensity;
  if (wisdom > 0.7) return palettes.deep_wisdom;
  return palettes.balanced;
}

function selectSacredGeometry(transformative: number): string {
  const geometries = [
    'flower_of_life', 'metatrons_cube', 'sri_yantra', 
    'golden_spiral', 'merkaba', 'seed_of_life'
  ];
  
  const index = Math.floor(transformative * geometries.length);
  return geometries[Math.min(index, geometries.length - 1)];
}

async function generateMediaAssets(supabase: any, planId: string, contentPlan: any) {
  const assets = [
    {
      plan_id: planId,
      asset_type: 'thumbnail',
      generation_prompt: `Sacred spiritual thumbnail with ${contentPlan.energy_signature.geometric_pattern} and ${contentPlan.sacred_elements.join(', ')}`,
      status: 'queued',
      priority: 1
    },
    {
      plan_id: planId,
      asset_type: 'background_video',
      generation_prompt: `Flowing spiritual background with ${contentPlan.visuals.color_scheme.join(', ')} colors and ${contentPlan.visuals.background_elements.join(', ')}`,
      status: 'queued',
      priority: 2
    },
    {
      plan_id: planId,
      asset_type: 'audio_track',
      generation_prompt: `${contentPlan.audio.music_style} music at ${contentPlan.audio.frequency_tuning}Hz with ${contentPlan.audio.sound_effects.join(', ')}`,
      status: 'queued',
      priority: 3
    }
  ];

  for (const asset of assets) {
    await supabase.from('media_assets').insert(asset);
  }
}