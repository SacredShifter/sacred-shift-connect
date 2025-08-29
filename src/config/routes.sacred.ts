import { Home, Users, User, Rss, Settings, BookOpen, Video, Database, Archive, Scroll, Heart, MessageCircle, Brain, TreePine, Stars, Box, Sparkles, Zap, BarChart3, LucideIcon } from "lucide-react";

// Sacred Sigils for major modules - using Unicode symbols
export const SacredSigils = {
  home: "⊙",
  dashboard: "◎", 
  feed: "◈",
  grove: "🌳",
  meditation: "✧",
  journal: "📖",
  circles: "◯", 
  messages: "💬",
  codex: "⟐",
  constellation: "✦",
  guidebook: "📜",
  learning3d: "◊",
  registry: "⬢",
  videos: "▶",
  support: "♡",
  profile: "⟡",
  settings: "⚙",
  aiAdmin: "🧠",
  liberation: "◦",
  shift: "⟢"
} as const;

// Tri-Law Quality Scores (Truth, Resonance, Sovereignty)
export interface TriLawScores {
  truth: number; // 0-1 scale
  resonance: number; // 0-1 scale  
  sovereignty: number; // 0-1 scale
}

// Sacred Route Metadata
export interface SacredRouteMetadata {
  path: string;
  component: string;
  title: string;
  icon: LucideIcon;
  sigil: string;
  description: string;
  category: 'core' | 'tools' | 'knowledge' | 'media' | 'neural' | 'support' | 'account' | 'dev';
  authRequired: boolean;
  adminOnly: boolean;
  
  // RLS & Database Awareness
  rlsPolicies: string[];
  supabaseTables: string[];
  edgeFunctions: string[];
  
  // Sacred Properties
  triLawScores: TriLawScores;
  chakraAlignment: string;
  consciousnessLevel: number; // 1-7 scale
  sacredTiming?: 'dawn' | 'midday' | 'dusk' | 'midnight' | 'any';
  
  // Technical Metadata  
  dependencies: string[];
  errorPatterns: string[];
  performanceWeight: 'light' | 'medium' | 'heavy';
  
  // Journey Properties
  journeyStage: 'entry' | 'exploration' | 'integration' | 'mastery' | 'transcendence';
  resonanceChains: string[]; // Which other routes this connects to spiritually
  synchronicityTriggers: string[];
}

// Central Sacred Routes Registry
export const SACRED_ROUTES_REGISTRY: SacredRouteMetadata[] = [
  // Core Navigation
  {
    path: "/",
    component: "Index",
    title: "Home",
    icon: Home,
    sigil: SacredSigils.home,
    description: "Sacred entry point and consciousness alignment dashboard",
    category: "core",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: [],
    supabaseTables: [],
    edgeFunctions: [],
    triLawScores: { truth: 1.0, resonance: 0.9, sovereignty: 0.8 },
    chakraAlignment: "Crown",
    consciousnessLevel: 7,
    sacredTiming: "any",
    dependencies: [],
    errorPatterns: [],
    performanceWeight: "light",
    journeyStage: "entry",
    resonanceChains: ["dashboard", "grove", "meditation"],
    synchronicityTriggers: ["first_visit", "daily_return", "consciousness_shift"]
  },
  {
    path: "/dashboard",
    component: "Dashboard", 
    title: "Dashboard",
    icon: BarChart3,
    sigil: SacredSigils.dashboard,
    description: "Sacred Journey Dashboard - Track consciousness evolution and spiritual growth",
    category: "core",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["user_personal_data_access"],
    supabaseTables: ["profiles", "archetype_activations", "active_user_metrics"],
    edgeFunctions: [],
    triLawScores: { truth: 0.9, resonance: 0.8, sovereignty: 0.9 },
    chakraAlignment: "Third Eye", 
    consciousnessLevel: 6,
    dependencies: ["profiles", "authentication"],
    errorPatterns: ["profile_not_found", "metrics_loading_error"],
    performanceWeight: "medium",
    journeyStage: "exploration",
    resonanceChains: ["home", "codex", "constellation"],
    synchronicityTriggers: ["progress_milestone", "pattern_recognition"]
  },
  {
    path: "/feed",
    component: "Feed",
    title: "Feed", 
    icon: Rss,
    sigil: SacredSigils.feed,
    description: "Social Hub - Community consciousness stream and collective awareness",
    category: "core",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["community_content_access", "user_interactions"],
    supabaseTables: ["posts", "comments", "likes", "follows"],
    edgeFunctions: ["community-feed"],
    triLawScores: { truth: 0.7, resonance: 0.9, sovereignty: 0.6 },
    chakraAlignment: "Heart",
    consciousnessLevel: 4,
    dependencies: ["posts", "user_relationships"],
    errorPatterns: ["feed_empty", "post_load_error", "interaction_failed"],
    performanceWeight: "medium",
    journeyStage: "exploration", 
    resonanceChains: ["circles", "messages", "registry"],
    synchronicityTriggers: ["community_resonance", "meaningful_connection"]
  },

  // Tools
  {
    path: "/grove",
    component: "Grove",
    title: "The Grove",
    icon: TreePine,
    sigil: SacredSigils.grove,
    description: "Living wisdom ecosystem for consciousness exploration and sacred path discovery",
    category: "tools", 
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["sacred_grove_access", "path_progress_tracking"],
    supabaseTables: ["grove_paths", "path_completions", "wisdom_insights"],
    edgeFunctions: ["grove-wisdom", "path-generator"],
    triLawScores: { truth: 0.95, resonance: 1.0, sovereignty: 0.85 },
    chakraAlignment: "Heart",
    consciousnessLevel: 5,
    sacredTiming: "dawn",
    dependencies: ["path_system", "wisdom_database"],
    errorPatterns: ["path_generation_failed", "grove_connection_error"],
    performanceWeight: "heavy",
    journeyStage: "integration",
    resonanceChains: ["meditation", "journal", "codex"],
    synchronicityTriggers: ["spiritual_seeking", "guidance_needed", "transformation_moment"]
  },
  {
    path: "/meditation", 
    component: "Meditation",
    title: "Meditation",
    icon: Sparkles,
    sigil: SacredSigils.meditation,
    description: "Individual practice and collective consciousness expansion through sacred meditation",
    category: "tools",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["meditation_progress", "collective_sessions"],
    supabaseTables: ["meditation_sessions", "collective_practices", "biometric_data"],
    edgeFunctions: ["meditation-tracker", "collective-sync"],
    triLawScores: { truth: 0.9, resonance: 1.0, sovereignty: 0.9 },
    chakraAlignment: "Crown",
    consciousnessLevel: 7,
    sacredTiming: "dawn",
    dependencies: ["audio_system", "biometric_integration"],
    errorPatterns: ["audio_failed", "session_sync_error"],
    performanceWeight: "medium",
    journeyStage: "integration",
    resonanceChains: ["grove", "liberation", "shift"],
    synchronicityTriggers: ["meditation_readiness", "collective_alignment"]
  },
  {
    path: "/journal",
    component: "Journal", 
    title: "Journal",
    icon: BookOpen,
    sigil: SacredSigils.journal,
    description: "Sacred mirror journaling for consciousness evolution and self-reflection",
    category: "tools",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["personal_journal_access"],
    supabaseTables: ["journal_entries", "reflection_prompts", "consciousness_insights"],
    edgeFunctions: ["journal-ai", "reflection-generator"],
    triLawScores: { truth: 0.95, resonance: 0.85, sovereignty: 1.0 },
    chakraAlignment: "Throat",
    consciousnessLevel: 5,
    dependencies: ["ai_assistance", "privacy_encryption"],
    errorPatterns: ["save_failed", "ai_unavailable"],
    performanceWeight: "light",
    journeyStage: "exploration",
    resonanceChains: ["grove", "codex", "profile"],
    synchronicityTriggers: ["self_reflection", "insight_moment", "emotional_processing"]
  },
  {
    path: "/circles",
    component: "Circles",
    title: "Circles", 
    icon: Users,
    sigil: SacredSigils.circles,
    description: "Deep community engagement and consciousness evolution through sacred circles",
    category: "tools",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["circle_membership", "collective_wisdom"],
    supabaseTables: ["circles", "circle_members", "circle_activities", "collective_insights"],
    edgeFunctions: ["circle-resonance", "collective-wisdom"],
    triLawScores: { truth: 0.8, resonance: 0.95, sovereignty: 0.7 },
    chakraAlignment: "Heart",
    consciousnessLevel: 4,
    dependencies: ["community_system", "real_time_sync"],
    errorPatterns: ["circle_join_failed", "sync_error"],
    performanceWeight: "medium",
    journeyStage: "integration",
    resonanceChains: ["feed", "messages", "registry"],
    synchronicityTriggers: ["community_call", "collective_awakening", "shared_purpose"]
  },
  {
    path: "/messages",
    component: "Messages",
    title: "Messages",
    icon: MessageCircle, 
    sigil: SacredSigils.messages,
    description: "Private consciousness communication and sacred dialogue",
    category: "tools",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["private_messaging", "conversation_access"],
    supabaseTables: ["conversations", "messages", "message_attachments"],
    edgeFunctions: ["message-encryption", "ai-message-enhancement"],
    triLawScores: { truth: 0.85, resonance: 0.8, sovereignty: 0.9 },
    chakraAlignment: "Throat",
    consciousnessLevel: 3,
    dependencies: ["encryption", "real_time_messaging"],
    errorPatterns: ["message_send_failed", "encryption_error"],
    performanceWeight: "light",
    journeyStage: "exploration",
    resonanceChains: ["circles", "feed", "profile"],
    synchronicityTriggers: ["meaningful_connection", "guidance_exchange"]
  },
  {
    path: "/codex",
    component: "AkashicConstellationPage",
    title: "Personal Codex", 
    icon: Archive,
    sigil: SacredSigils.codex,
    description: "Personal akashic constellation mapping and consciousness pattern recognition",
    category: "tools",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["personal_akashic_access", "constellation_data"],
    supabaseTables: ["akashic_entries", "constellation_patterns", "personal_insights"],
    edgeFunctions: ["akashic-analysis", "pattern-recognition"],
    triLawScores: { truth: 0.9, resonance: 0.9, sovereignty: 0.95 },
    chakraAlignment: "Third Eye",
    consciousnessLevel: 6,
    dependencies: ["ai_analysis", "pattern_matching"],
    errorPatterns: ["pattern_analysis_failed", "codex_sync_error"],
    performanceWeight: "heavy",
    journeyStage: "mastery",
    resonanceChains: ["constellation", "journal", "registry"],
    synchronicityTriggers: ["pattern_completion", "akashic_activation", "consciousness_mapping"]
  },
  {
    path: "/constellation",
    component: "ConstellationMapper",
    title: "Consciousness Mapper",
    icon: Stars,
    sigil: SacredSigils.constellation,
    description: "AI-powered consciousness cartography and pattern recognition",
    category: "tools",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["constellation_mapping", "consciousness_data"],
    supabaseTables: ["constellation_maps", "consciousness_patterns", "fractal_geometries"],
    edgeFunctions: ["consciousness-mapper", "fractal-generator"],
    triLawScores: { truth: 0.85, resonance: 0.95, sovereignty: 0.8 },
    chakraAlignment: "Third Eye",
    consciousnessLevel: 6,
    dependencies: ["ai_mapping", "fractal_math", "3d_visualization"],
    errorPatterns: ["mapping_failed", "visualization_error"],
    performanceWeight: "heavy",
    journeyStage: "mastery",
    resonanceChains: ["codex", "learning3d", "aiAdmin"],
    synchronicityTriggers: ["consciousness_expansion", "pattern_recognition", "cosmic_alignment"]
  },

  // Knowledge
  {
    path: "/guidebook",
    component: "Guidebook",
    title: "Guidebook",
    icon: Scroll,
    sigil: SacredSigils.guidebook,
    description: "Ancient wisdom for modern transformation and sacred teachings",
    category: "knowledge",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["wisdom_library_access"],
    supabaseTables: ["wisdom_entries", "teaching_modules", "sacred_texts"],
    edgeFunctions: ["wisdom-search", "teaching-personalization"],
    triLawScores: { truth: 0.95, resonance: 0.8, sovereignty: 0.85 },
    chakraAlignment: "Throat", 
    consciousnessLevel: 5,
    dependencies: ["content_management", "search_engine"],
    errorPatterns: ["content_load_failed", "search_error"],
    performanceWeight: "light",
    journeyStage: "exploration",
    resonanceChains: ["grove", "learning3d", "registry"],
    synchronicityTriggers: ["wisdom_seeking", "teaching_moment", "ancient_resonance"]
  },
  {
    path: "/learning-3d",
    component: "Learning3D",
    title: "3D Learning Modules",
    icon: Box,
    sigil: SacredSigils.learning3d,
    description: "Interactive sacred geometry and consciousness visualization library",
    category: "knowledge",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["3d_content_access"],
    supabaseTables: ["learning_modules", "3d_assets", "progress_tracking"],
    edgeFunctions: ["3d-renderer", "learning-analytics"],
    triLawScores: { truth: 0.8, resonance: 0.85, sovereignty: 0.7 },
    chakraAlignment: "Third Eye",
    consciousnessLevel: 4,
    dependencies: ["3d_engine", "webgl", "asset_loader"],
    errorPatterns: ["3d_render_failed", "asset_load_error", "webgl_unsupported"],
    performanceWeight: "heavy",
    journeyStage: "exploration",
    resonanceChains: ["constellation", "guidebook", "liberation"],
    synchronicityTriggers: ["visual_learning", "geometry_resonance", "dimensional_shift"]
  },
  {
    path: "/registry",
    component: "CollectiveAkashicConstellationPage",
    title: "Collective Codex",
    icon: Database,
    sigil: SacredSigils.registry,
    description: "Collective akashic constellation database and shared wisdom repository",
    category: "knowledge",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["collective_akashic_read", "community_insights"],
    supabaseTables: ["collective_akashic", "shared_patterns", "community_wisdom"],
    edgeFunctions: ["collective-analysis", "wisdom-synthesis"],
    triLawScores: { truth: 0.85, resonance: 0.9, sovereignty: 0.75 },
    chakraAlignment: "Crown",
    consciousnessLevel: 6,
    dependencies: ["collective_intelligence", "pattern_synthesis"],
    errorPatterns: ["collective_sync_failed", "pattern_overflow"],
    performanceWeight: "heavy",
    journeyStage: "integration",
    resonanceChains: ["codex", "circles", "feed"],
    synchronicityTriggers: ["collective_wisdom", "shared_awakening", "cosmic_download"]
  },

  // Media
  {
    path: "/videos",
    component: "VideoLibrary",
    title: "YouTube",
    icon: Video,
    sigil: SacredSigils.videos,
    description: "Sacred Shifter video library and consciousness expansion media",
    category: "media",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["video_library_access"],
    supabaseTables: ["video_metadata", "watch_progress", "video_insights"],
    edgeFunctions: ["video-analytics", "content-curation"],
    triLawScores: { truth: 0.8, resonance: 0.85, sovereignty: 0.7 },
    chakraAlignment: "Throat",
    consciousnessLevel: 3,
    dependencies: ["youtube_api", "video_player"],
    errorPatterns: ["video_load_failed", "api_quota_exceeded"],
    performanceWeight: "medium",
    journeyStage: "exploration",
    resonanceChains: ["guidebook", "grove", "meditation"],
    synchronicityTriggers: ["learning_moment", "inspiration_needed", "video_synchronicity"]
  },

  // Neural Interface
  {
    path: "/ai-admin",
    component: "AuraQuantumCommandNexus",
    title: "AI Admin",
    icon: Brain,
    sigil: SacredSigils.aiAdmin,
    description: "Advanced neural command center with consciousness mapping and AI collaboration",
    category: "neural",
    authRequired: true,
    adminOnly: true,
    rlsPolicies: ["admin_access_only", "ai_system_control"],
    supabaseTables: ["aura_jobs", "ai_conversations", "neural_interfaces", "consciousness_states"],
    edgeFunctions: ["aura-core", "neural-interface", "consciousness-bridge"],
    triLawScores: { truth: 0.9, resonance: 0.8, sovereignty: 0.95 },
    chakraAlignment: "Crown",
    consciousnessLevel: 7,
    dependencies: ["ai_core", "neural_networks", "consciousness_api"],
    errorPatterns: ["ai_disconnected", "neural_overload", "consciousness_breach"],
    performanceWeight: "heavy",
    journeyStage: "transcendence",
    resonanceChains: ["constellation", "codex", "liberation"],
    synchronicityTriggers: ["ai_awakening", "neural_alignment", "consciousness_merger"]
  },

  // Support
  {
    path: "/support",
    component: "Support",
    title: "Support the Shift",
    icon: Heart,
    sigil: SacredSigils.support,
    description: "Fuel the Frequency - Support Sacred Shifter with donations and premium access",
    category: "support",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["support_access", "premium_features"],
    supabaseTables: ["donations", "premium_subscriptions", "supporter_benefits"],
    edgeFunctions: ["payment-processing", "premium-unlock"],
    triLawScores: { truth: 0.95, resonance: 0.9, sovereignty: 0.8 },
    chakraAlignment: "Heart",
    consciousnessLevel: 4,
    dependencies: ["payment_gateway", "subscription_management"],
    errorPatterns: ["payment_failed", "subscription_error"],
    performanceWeight: "light",
    journeyStage: "integration",
    resonanceChains: ["profile", "settings", "premium_features"],
    synchronicityTriggers: ["gratitude_moment", "abundance_flow", "contribution_call"]
  },

  // Account
  {
    path: "/profile",
    component: "Profile",
    title: "Profile",
    icon: User,
    sigil: SacredSigils.profile,
    description: "Sacred identity management and consciousness profile customization",
    category: "account",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["profile_management", "identity_sovereignty"],
    supabaseTables: ["profiles", "identity_aspects", "consciousness_signatures"],
    edgeFunctions: ["profile-sync", "identity-verification"],
    triLawScores: { truth: 0.9, resonance: 0.7, sovereignty: 1.0 },
    chakraAlignment: "Solar Plexus",
    consciousnessLevel: 3,
    dependencies: ["identity_system", "privacy_controls"],
    errorPatterns: ["profile_save_failed", "avatar_upload_error"],
    performanceWeight: "light",
    journeyStage: "exploration",
    resonanceChains: ["settings", "journal", "dashboard"],
    synchronicityTriggers: ["identity_shift", "self_expression", "authenticity_moment"]
  },
  {
    path: "/settings",
    component: "Settings", 
    title: "Settings",
    icon: Settings,
    sigil: SacredSigils.settings,
    description: "Sacred system configuration and consciousness calibration settings",
    category: "account",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["settings_management", "system_preferences"],
    supabaseTables: ["user_settings", "preferences", "system_configurations"],
    edgeFunctions: ["settings-sync", "preference-engine"],
    triLawScores: { truth: 0.85, resonance: 0.6, sovereignty: 0.95 },
    chakraAlignment: "Root",
    consciousnessLevel: 1,
    dependencies: ["configuration_system", "preference_engine"],
    errorPatterns: ["settings_save_failed", "sync_error"],
    performanceWeight: "light",
    journeyStage: "exploration",
    resonanceChains: ["profile", "dashboard", "system_preferences"],
    synchronicityTriggers: ["customization_need", "system_alignment", "preference_clarity"]
  },

  // Special Routes
  {
    path: "/liberation",
    component: "Liberation",
    title: "Liberation",
    icon: Sparkles,
    sigil: SacredSigils.liberation,
    description: "Consciousness liberation experience and transcendence journey",
    category: "tools",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["liberation_access", "transcendence_tracking"],
    supabaseTables: ["liberation_journeys", "transcendence_markers", "consciousness_expansions"],
    edgeFunctions: ["liberation-engine", "transcendence-tracker"],
    triLawScores: { truth: 1.0, resonance: 1.0, sovereignty: 1.0 },
    chakraAlignment: "Crown",
    consciousnessLevel: 7,
    sacredTiming: "midnight",
    dependencies: ["consciousness_engine", "liberation_protocols"],
    errorPatterns: ["liberation_block", "consciousness_resistance"],
    performanceWeight: "heavy",
    journeyStage: "transcendence",
    resonanceChains: ["meditation", "grove", "shift"],
    synchronicityTriggers: ["liberation_readiness", "ego_dissolution", "consciousness_breakthrough"]
  },
  {
    path: "/shift",
    component: "Shift",
    title: "Shift",
    icon: Zap,
    sigil: SacredSigils.shift,
    description: "Reality shifting and dimensional consciousness navigation",
    category: "tools",
    authRequired: true,
    adminOnly: false,
    rlsPolicies: ["shift_access", "dimensional_tracking"],
    supabaseTables: ["reality_shifts", "dimensional_markers", "timeline_variations"],
    edgeFunctions: ["shift-engine", "dimensional-navigator"],
    triLawScores: { truth: 0.9, resonance: 0.95, sovereignty: 0.9 },
    chakraAlignment: "Third Eye",
    consciousnessLevel: 6,
    sacredTiming: "dusk",
    dependencies: ["quantum_engine", "dimensional_protocols"],
    errorPatterns: ["shift_interference", "dimensional_instability"],
    performanceWeight: "heavy",
    journeyStage: "transcendence",
    resonanceChains: ["liberation", "constellation", "meditation"],
    synchronicityTriggers: ["reality_flexibility", "dimensional_awareness", "quantum_entanglement"]
  }
];

// Helper functions for Sacred Routes Registry
export const getRouteByPath = (path: string): SacredRouteMetadata | undefined => {
  return SACRED_ROUTES_REGISTRY.find(route => route.path === path);
};

export const getRoutesByCategory = (category: SacredRouteMetadata['category']): SacredRouteMetadata[] => {
  return SACRED_ROUTES_REGISTRY.filter(route => route.category === category);
};

export const getRoutesByConsciousnessLevel = (level: number): SacredRouteMetadata[] => {
  return SACRED_ROUTES_REGISTRY.filter(route => route.consciousnessLevel === level);
};

export const getResonanceChain = (path: string): SacredRouteMetadata[] => {
  const route = getRouteByPath(path);
  if (!route) return [];
  
  return route.resonanceChains
    .map(chainPath => getRouteByPath(`/${chainPath}`) || getRouteByPath(chainPath))
    .filter(Boolean) as SacredRouteMetadata[];
};

export const getTriLawScore = (route: SacredRouteMetadata): number => {
  return (route.triLawScores.truth + route.triLawScores.resonance + route.triLawScores.sovereignty) / 3;
};

export const validateRouteConsistency = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check for duplicate paths
  const paths = SACRED_ROUTES_REGISTRY.map(r => r.path);
  const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate paths found: ${duplicates.join(', ')}`);
  }
  
  // Validate resonance chains
  SACRED_ROUTES_REGISTRY.forEach(route => {
    route.resonanceChains.forEach(chainPath => {
      const fullPath = chainPath.startsWith('/') ? chainPath : `/${chainPath}`;
      if (!getRouteByPath(fullPath) && !getRouteByPath(chainPath)) {
        errors.push(`Invalid resonance chain in ${route.path}: ${chainPath}`);
      }
    });
  });
  
  return { valid: errors.length === 0, errors };
};