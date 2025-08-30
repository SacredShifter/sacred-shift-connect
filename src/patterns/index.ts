/**
 * Sacred Pattern Specifications
 * 
 * Every Sacred Shifter component that uses geometry or temporal patterns
 * must export a patternSpec that maps pattern → behavior → timing.
 */

export interface PatternSpec {
  type: 'geometry' | 'temporal' | 'hybrid';
  pattern: string;
  behavior_mapping: {
    visual: {
      geometry?: string;
      animation_duration_ms: number;
      easing: string;
      sacred_timing: boolean; // follows 4-8-8 breath cadence or phi ratios
    };
    audio?: {
      frequency_hz?: number;
      binaural_beats?: boolean;
      coherence_inducing: boolean;
    };
    haptic?: {
      pattern: 'breath' | 'heartbeat' | 'phi_pulse';
      intensity: number; // 0-1
    };
  };
  coherence_effects: {
    individual: string[];
    collective: string[];
    field_resonance: number; // expected phi-weighted contribution
  };
  accessibility: {
    reduced_motion_alternative: string;
    screen_reader_description: string;
    high_contrast_mode: boolean;
  };
}

// Sacred Geometry Pattern Specifications
export const SACRED_PATTERNS: Record<string, PatternSpec> = {
  seed_of_life: {
    type: 'geometry',
    pattern: 'seed_of_life',
    behavior_mapping: {
      visual: {
        geometry: '7 overlapping circles in hexagonal formation',
        animation_duration_ms: 4000, // 4s inhale phase
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        sacred_timing: true
      },
      audio: {
        frequency_hz: 432, // Sacred frequency
        binaural_beats: true,
        coherence_inducing: true
      }
    },
    coherence_effects: {
      individual: ['breath_regulation', 'heart_coherence', 'mental_clarity'],
      collective: ['group_sync', 'field_amplification'],
      field_resonance: 1.618 // phi ratio
    },
    accessibility: {
      reduced_motion_alternative: 'Static sacred circle with gentle pulsing',
      screen_reader_description: 'Seven sacred circles forming the seed of life pattern for breath regulation',
      high_contrast_mode: true
    }
  },

  flower_of_life: {
    type: 'geometry', 
    pattern: 'flower_of_life',
    behavior_mapping: {
      visual: {
        geometry: '19 overlapping circles in sacred formation',
        animation_duration_ms: 8000, // 8s hold phase  
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        sacred_timing: true
      }
    },
    coherence_effects: {
      individual: ['expanded_awareness', 'sacred_connection', 'unity_consciousness'],
      collective: ['collective_awakening', 'field_harmonization'], 
      field_resonance: 2.618 // phi^2
    },
    accessibility: {
      reduced_motion_alternative: 'Expanding circle with sacred proportions',
      screen_reader_description: 'Flower of life sacred geometry for expanded awareness',
      high_contrast_mode: true
    }
  },

  merkaba: {
    type: 'geometry',
    pattern: 'merkaba',
    behavior_mapping: {
      visual: {
        geometry: 'Two interlocking tetrahedra forming 3D star',
        animation_duration_ms: 8000, // 8s exhale phase
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
        sacred_timing: true
      },
      audio: {
        frequency_hz: 528, // Love frequency
        coherence_inducing: true
      }
    },
    coherence_effects: {
      individual: ['energy_activation', 'dimensional_awareness', 'light_body_connection'],
      collective: ['group_ascension', 'multi_dimensional_sync'],
      field_resonance: 3.618 // phi^2 + 1
    },
    accessibility: {
      reduced_motion_alternative: 'Rotating sacred star with depth indication',
      screen_reader_description: 'Three-dimensional merkaba star for energy activation',
      high_contrast_mode: true
    }
  },

  sri_yantra: {
    type: 'geometry',
    pattern: 'sri_yantra', 
    behavior_mapping: {
      visual: {
        geometry: '9 interlocking triangles within sacred circles',
        animation_duration_ms: 12000, // Extended sacred timing
        easing: 'cubic-bezier(0.23, 1, 0.320, 1)',
        sacred_timing: true
      }
    },
    coherence_effects: {
      individual: ['cosmic_connection', 'divine_feminine_masculine_balance', 'manifestation_power'],
      collective: ['cosmic_alignment', 'divine_field_activation'],
      field_resonance: 5.236 // phi^3
    },
    accessibility: {
      reduced_motion_alternative: 'Sacred triangular mandala with gentle energy indication',
      screen_reader_description: 'Sri Yantra sacred geometry for cosmic connection and balance',
      high_contrast_mode: true
    }
  }
};

// Temporal Pattern Specifications  
export const TEMPORAL_PATTERNS: Record<string, PatternSpec> = {
  breath_4_8_8: {
    type: 'temporal',
    pattern: 'breath_regulation',
    behavior_mapping: {
      visual: {
        animation_duration_ms: 20000, // Full cycle: 4s+8s+8s
        easing: 'steps(3, jump-none)', // Three distinct phases
        sacred_timing: true
      },
      haptic: {
        pattern: 'breath',
        intensity: 0.3
      }
    },
    coherence_effects: {
      individual: ['nervous_system_regulation', 'heart_coherence', 'vagal_tone'],
      collective: ['group_breathing_sync', 'collective_calm'],
      field_resonance: 1.333 // 4:3 sacred ratio
    },
    accessibility: {
      reduced_motion_alternative: 'Text-based breathing timer with audio cues',
      screen_reader_description: 'Four-seven-eight breathing pattern for nervous system regulation',
      high_contrast_mode: true
    }
  },

  phi_pulse: {
    type: 'temporal',
    pattern: 'golden_ratio_timing',
    behavior_mapping: {
      visual: {
        animation_duration_ms: 1618, // Phi in milliseconds
        easing: 'cubic-bezier(0.618, 0, 0.382, 1)', // Phi-based bezier
        sacred_timing: true
      },
      haptic: {
        pattern: 'phi_pulse',
        intensity: 0.618 // Phi intensity
      }
    },
    coherence_effects: {
      individual: ['natural_rhythm_sync', 'flow_state_induction', 'harmony_with_nature'],
      collective: ['universal_timing_sync', 'cosmic_rhythm_alignment'],
      field_resonance: 1.618 // Pure phi
    },
    accessibility: {
      reduced_motion_alternative: 'Gentle pulsing light following natural rhythms',
      screen_reader_description: 'Golden ratio timing pattern for natural rhythm synchronization',
      high_contrast_mode: true
    }
  }
};

// Pattern validation for components
export function validatePatternSpec(spec: PatternSpec): boolean {
  // Must have sacred timing
  if (!spec.behavior_mapping.visual.sacred_timing) {
    console.warn('Pattern spec missing sacred timing alignment');
    return false;
  }
  
  // Must include accessibility alternatives
  if (!spec.accessibility.reduced_motion_alternative || !spec.accessibility.screen_reader_description) {
    console.warn('Pattern spec missing accessibility alternatives');
    return false;
  }
  
  // Must contribute to field resonance
  if (spec.coherence_effects.field_resonance <= 0) {
    console.warn('Pattern spec must contribute positive field resonance');
    return false;
  }
  
  return true;
}

// Get pattern spec by name
export function getPatternSpec(patternName: string): PatternSpec | undefined {
  return SACRED_PATTERNS[patternName] || TEMPORAL_PATTERNS[patternName];
}

// Export all patterns
export const ALL_PATTERNS = { ...SACRED_PATTERNS, ...TEMPORAL_PATTERNS };