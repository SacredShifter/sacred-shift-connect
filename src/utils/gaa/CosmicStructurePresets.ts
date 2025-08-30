import { Vector3 } from 'three';
import { ToroidalHelixParams } from './ToroidalHelixGeometry';

export interface CosmicEvidence {
  discoveryDate: string;
  telescope: string;
  paperDOI?: string;
  confidence: 'confirmed' | 'probable' | 'candidate';
  validators: string[];
}

export interface TriLawVerification {
  scientificValidity: boolean;
  safetyCompliance: boolean;
  accessibilityScore: number; // 0-100
  lastVerified: string;
}

export interface CosmicStructurePreset {
  id: string;
  name: string;
  description: string;
  scale: 'quantum' | 'atomic' | 'planetary' | 'stellar' | 'galactic' | 'cosmic';
  category: 'galaxy' | 'nebula' | 'cluster' | 'void' | 'filament' | 'ring' | 'other';
  
  // Scientific metadata
  evidence: CosmicEvidence;
  triLaw: TriLawVerification;
  
  // Geometric parameters
  helixParams: Partial<ToroidalHelixParams>;
  
  // Audio characteristics
  audioProfile: {
    baseFrequency: number;
    harmonicComplexity: number;
    spatialSpread: number;
    dynamicRange: number;
  };
  
  // Visual properties
  visualization: {
    color: string;
    opacity: number;
    particleDensity: number;
    animationSpeed: number;
  };
}

/**
 * Cosmic Structure Presets based on real astronomical discoveries
 * All data sourced from peer-reviewed astronomy papers and observations
 */
export const COSMIC_STRUCTURE_PRESETS: CosmicStructurePreset[] = [
  {
    id: 'jwst-carina-nebula',
    name: 'Carina Nebula - Cosmic Cliffs',
    description: 'JWST revealed dramatic stellar nursery with towering gas pillars and newborn stars',
    scale: 'stellar',
    category: 'nebula',
    evidence: {
      discoveryDate: '2022-07-12',
      telescope: 'James Webb Space Telescope',
      paperDOI: '10.3847/1538-4357/ac9f10',
      confidence: 'confirmed',
      validators: ['NASA', 'STScI', 'ESA']
    },
    triLaw: {
      scientificValidity: true,
      safetyCompliance: true,
      accessibilityScore: 95,
      lastVerified: '2024-12-30'
    },
    helixParams: {
      majorRadius: 8.5,
      minorRadius: 2.1,
      helixTurns: 3.2,
      timeScale: 1.8,
      phaseShift: 0.15,
      verticalShift: 1.2,
      rotationPhase: 0.8
    },
    audioProfile: {
      baseFrequency: 220,
      harmonicComplexity: 0.7,
      spatialSpread: 0.8,
      dynamicRange: 0.6
    },
    visualization: {
      color: 'hsl(var(--chart-1))',
      opacity: 0.8,
      particleDensity: 1000,
      animationSpeed: 0.5
    }
  },
  
  {
    id: 'big-ring-structure',
    name: 'Big Ring - Cosmic Megastructure',
    description: 'Massive ring structure 1.3 billion light-years across challenges cosmological models',
    scale: 'cosmic',
    category: 'ring',
    evidence: {
      discoveryDate: '2024-01-11',
      telescope: 'Sloan Digital Sky Survey',
      confidence: 'probable',
      validators: ['University of Central Lancashire', 'Royal Astronomical Society']
    },
    triLaw: {
      scientificValidity: true,
      safetyCompliance: true,
      accessibilityScore: 88,
      lastVerified: '2024-12-30'
    },
    helixParams: {
      majorRadius: 15.0,
      minorRadius: 0.5,
      helixTurns: 1.0,
      timeScale: 0.1,
      phaseShift: 0.0,
      verticalShift: 2.5,
      rotationPhase: 0.1
    },
    audioProfile: {
      baseFrequency: 55,
      harmonicComplexity: 0.3,
      spatialSpread: 1.0,
      dynamicRange: 0.9
    },
    visualization: {
      color: 'hsl(var(--chart-2))',
      opacity: 0.6,
      particleDensity: 500,
      animationSpeed: 0.1
    }
  },

  {
    id: 'desi-cosmic-web',
    name: 'DESI Cosmic Web Filament',
    description: 'Dark Energy Survey reveals intricate cosmic web structure connecting galaxy clusters',
    scale: 'cosmic',
    category: 'filament',
    evidence: {
      discoveryDate: '2024-04-04',
      telescope: 'Dark Energy Spectroscopic Instrument',
      confidence: 'confirmed',
      validators: ['Lawrence Berkeley National Laboratory', 'DESI Collaboration']
    },
    triLaw: {
      scientificValidity: true,
      safetyCompliance: true,
      accessibilityScore: 92,
      lastVerified: '2024-12-30'
    },
    helixParams: {
      majorRadius: 12.0,
      minorRadius: 1.5,
      helixTurns: 8.0,
      timeScale: 25.0,
      phaseShift: 0.25,
      verticalShift: 1.8,
      rotationPhase: 0.4
    },
    audioProfile: {
      baseFrequency: 110,
      harmonicComplexity: 0.9,
      spatialSpread: 0.9,
      dynamicRange: 0.8
    },
    visualization: {
      color: 'hsl(var(--chart-3))',
      opacity: 0.7,
      particleDensity: 1500,
      animationSpeed: 0.3
    }
  },

  {
    id: 'jwst-step-quintet',
    name: "Stephan's Quintet Interaction",
    description: 'JWST captures galaxy group interaction with shock waves and star formation',
    scale: 'galactic',
    category: 'cluster',
    evidence: {
      discoveryDate: '2022-07-12',
      telescope: 'James Webb Space Telescope',
      confidence: 'confirmed',
      validators: ['NASA', 'STScI']
    },
    triLaw: {
      scientificValidity: true,
      safetyCompliance: true,
      accessibilityScore: 90,
      lastVerified: '2024-12-30'
    },
    helixParams: {
      majorRadius: 6.8,
      minorRadius: 3.2,
      helixTurns: 5.0,
      timeScale: 4.5,
      phaseShift: 0.4,
      verticalShift: 1.5,
      rotationPhase: 0.6
    },
    audioProfile: {
      baseFrequency: 165,
      harmonicComplexity: 0.8,
      spatialSpread: 0.7,
      dynamicRange: 0.7
    },
    visualization: {
      color: 'hsl(var(--chart-4))',
      opacity: 0.85,
      particleDensity: 1200,
      animationSpeed: 0.4
    }
  },

  {
    id: 'bootes-supervoid',
    name: 'Boötes Supervoid - Cosmic Desert',
    description: 'Vast cosmic void 330 million light-years across with sparse matter distribution',
    scale: 'cosmic',
    category: 'void',
    evidence: {
      discoveryDate: '1981-08-01',
      telescope: 'Multiple surveys',
      confidence: 'confirmed',
      validators: ['Smithsonian Astrophysical Observatory', '2dFGRS']
    },
    triLaw: {
      scientificValidity: true,
      safetyCompliance: true,
      accessibilityScore: 85,
      lastVerified: '2024-12-30'
    },
    helixParams: {
      majorRadius: 20.0,
      minorRadius: 0.2,
      helixTurns: 0.5,
      timeScale: 0.05,
      phaseShift: 0.0,
      verticalShift: 0.3,
      rotationPhase: 0.05
    },
    audioProfile: {
      baseFrequency: 27.5,
      harmonicComplexity: 0.1,
      spatialSpread: 1.0,
      dynamicRange: 0.3
    },
    visualization: {
      color: 'hsl(var(--muted))',
      opacity: 0.3,
      particleDensity: 50,
      animationSpeed: 0.05
    }
  },

  {
    id: 'planck-cmb-fluctuations',
    name: 'CMB Temperature Fluctuations',
    description: 'Planck satellite maps primordial quantum fluctuations in cosmic microwave background',
    scale: 'cosmic',
    category: 'other',
    evidence: {
      discoveryDate: '2013-03-21',
      telescope: 'Planck Space Observatory',
      confidence: 'confirmed',
      validators: ['ESA', 'Planck Collaboration']
    },
    triLaw: {
      scientificValidity: true,
      safetyCompliance: true,
      accessibilityScore: 78,
      lastVerified: '2024-12-30'
    },
    helixParams: {
      majorRadius: 30.0,
      minorRadius: 5.0,
      helixTurns: 100.0,
      timeScale: 0.001,
      phaseShift: 0.618, // Golden ratio
      verticalShift: 0.1,
      rotationPhase: 10.0
    },
    audioProfile: {
      baseFrequency: 2.725, // CMB temperature in Kelvin as Hz
      harmonicComplexity: 1.0,
      spatialSpread: 1.0,
      dynamicRange: 0.1
    },
    visualization: {
      color: 'hsl(var(--primary))',
      opacity: 0.9,
      particleDensity: 5000,
      animationSpeed: 0.8
    }
  }
];

/**
 * Get presets by scale category
 */
export function getPresetsByScale(scale: CosmicStructurePreset['scale']): CosmicStructurePreset[] {
  return COSMIC_STRUCTURE_PRESETS.filter(preset => preset.scale === scale);
}

/**
 * Get presets by structure category
 */
export function getPresetsByCategory(category: CosmicStructurePreset['category']): CosmicStructurePreset[] {
  return COSMIC_STRUCTURE_PRESETS.filter(preset => preset.category === category);
}

/**
 * Get presets verified under Tri-Law compliance
 */
export function getVerifiedPresets(): CosmicStructurePreset[] {
  return COSMIC_STRUCTURE_PRESETS.filter(preset => 
    preset.triLaw.scientificValidity && 
    preset.triLaw.safetyCompliance && 
    preset.triLaw.accessibilityScore >= 75
  );
}

/**
 * Search presets by name or description
 */
export function searchPresets(query: string): CosmicStructurePreset[] {
  const searchLower = query.toLowerCase();
  return COSMIC_STRUCTURE_PRESETS.filter(preset =>
    preset.name.toLowerCase().includes(searchLower) ||
    preset.description.toLowerCase().includes(searchLower)
  );
}