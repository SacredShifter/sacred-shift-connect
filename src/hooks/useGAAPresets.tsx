/**
 * GAA Presets Hook - Enhanced for Polarity-Integrated System
 * Manages cosmic presets, polarity protocols, and database integration
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GAAPresetExtended, CosmicStructureData, PolarityProtocol } from '@/types/gaa-polarity';

export interface GAAPresetsState {
  presets: GAAPresetExtended[];
  cosmicPresets: GAAPresetExtended[];
  currentPreset: GAAPresetExtended | null;
  isLoading: boolean;
  error: string | null;
}

export interface PresetFilters {
  type?: 'manual' | 'cosmic' | 'ai_generated';
  polarityEnabled?: boolean;
  shadowModeEnabled?: boolean;
  collectiveCompatible?: boolean;
  cosmicSource?: 'jwst' | 'hubble' | 'ligo' | 'ai_discovery';
  tags?: string[];
  minConfidence?: number;
}

export const useGAAPresets = () => {
  const [state, setState] = useState<GAAPresetsState>({
    presets: [],
    cosmicPresets: [],
    currentPreset: null,
    isLoading: false,
    error: null
  });

  /**
   * Load all GAA presets from database
   */
  const loadPresets = useCallback(async (filters?: PresetFilters): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('📊 Loading GAA presets...', filters);

      // Load from database with simplified query to avoid type chaining issues
      const { data, error } = await supabase
        .from('gaa_presets')
        .select(`
          *,
          cosmic_structures(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Database presets not available, using defaults:', error);
        // Generate mock presets for development
        const mockPresets = generateMockPresets();
        setState(prev => ({
          ...prev,
          presets: mockPresets,
          cosmicPresets: mockPresets.filter(p => p.cosmicStructure),
          isLoading: false
        }));
        return;
      }

      // Transform database data to extended preset format
      const presets = data?.map(transformDatabasePreset) || [];
      const cosmicPresets = presets.filter(p => p.cosmicStructure);

      setState(prev => ({
        ...prev,
        presets,
        cosmicPresets,
        isLoading: false
      }));

      console.log(`✅ Loaded ${presets.length} GAA presets (${cosmicPresets.length} cosmic)`);

    } catch (error) {
      console.error('❌ Failed to load GAA presets:', error);
      
      // Fall back to mock presets
      const mockPresets = generateMockPresets();
      setState(prev => ({
        ...prev,
        presets: mockPresets,
        cosmicPresets: mockPresets.filter(p => p.cosmicStructure),
        error: error instanceof Error ? error.message : 'Failed to load presets',
        isLoading: false
      }));
    }
  }, []);

  /**
   * Create new GAA preset
   */
  const createPreset = useCallback(async (preset: Omit<GAAPresetExtended, 'id' | 'createdAt'>): Promise<GAAPresetExtended> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('🎯 Creating new GAA preset:', preset.name);

      // Prepare database record
      const dbRecord = transformPresetToDatabase(preset);

      const { data, error } = await supabase
        .from('gaa_presets')
        .insert([dbRecord])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newPreset = transformDatabasePreset(data);

      setState(prev => ({
        ...prev,
        presets: [newPreset, ...prev.presets],
        isLoading: false
      }));

      console.log('✅ Created GAA preset:', newPreset.id);
      return newPreset;

    } catch (error) {
      console.error('❌ Failed to create GAA preset:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create preset',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  /**
   * Update existing GAA preset
   */
  const updatePreset = useCallback(async (id: string, updates: Partial<GAAPresetExtended>): Promise<GAAPresetExtended> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('📝 Updating GAA preset:', id);

      const dbUpdates = transformPresetToDatabase(updates as any);

      const { data, error } = await supabase
        .from('gaa_presets')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedPreset = transformDatabasePreset(data);

      setState(prev => ({
        ...prev,
        presets: prev.presets.map(p => p.id === id ? updatedPreset : p),
        cosmicPresets: prev.cosmicPresets.map(p => p.id === id ? updatedPreset : p),
        currentPreset: prev.currentPreset?.id === id ? updatedPreset : prev.currentPreset,
        isLoading: false
      }));

      console.log('✅ Updated GAA preset:', id);
      return updatedPreset;

    } catch (error) {
      console.error('❌ Failed to update GAA preset:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update preset',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  /**
   * Delete GAA preset
   */
  const deletePreset = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('🗑️ Deleting GAA preset:', id);

      const { error } = await supabase
        .from('gaa_presets')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        presets: prev.presets.filter(p => p.id !== id),
        cosmicPresets: prev.cosmicPresets.filter(p => p.id !== id),
        currentPreset: prev.currentPreset?.id === id ? null : prev.currentPreset,
        isLoading: false
      }));

      console.log('✅ Deleted GAA preset:', id);

    } catch (error) {
      console.error('❌ Failed to delete GAA preset:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete preset',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  /**
   * Set current active preset
   */
  const setCurrentPreset = useCallback((preset: GAAPresetExtended | null): void => {
    setState(prev => ({ ...prev, currentPreset: preset }));
    
    if (preset) {
      console.log('🎵 Activated GAA preset:', preset.name);
    }
  }, []);

  /**
   * Generate preset from cosmic structure
   */
  const generateCosmicPreset = useCallback(async (cosmicStructure: CosmicStructureData): Promise<GAAPresetExtended> => {
    console.log('🌌 Generating cosmic preset from structure:', cosmicStructure.name);

    const preset: Omit<GAAPresetExtended, 'id' | 'createdAt'> = {
      name: `Cosmic: ${cosmicStructure.name}`,
      description: `Auto-generated from ${cosmicStructure.discoveryMetadata.source}: ${cosmicStructure.type}`,
      geometryType: 'cosmic_structure',
      parameters: {
        cosmicStructure: cosmicStructure.geometricSignature,
        physicalProperties: cosmicStructure.physicalProperties,
        coordinates: cosmicStructure.coordinates
      },

      // Polarity configuration based on cosmic properties
      polarityProtocol: cosmicStructure.audioMapping.polarityProfile,
      cosmicStructure,
      biofeedbackIntegration: true,
      shadowModeEnabled: cosmicStructure.type === 'blackhole' || cosmicStructure.type === 'gravitational_wave',
      collectiveCompatible: cosmicStructure.discoveryMetadata.confidence > 0.8,
      safetyProfile: generateCosmicSafetyProfile(cosmicStructure),

      // Metadata
      createdBy: 'cosmic_generator',
      tags: generateCosmicTags(cosmicStructure),
      evidenceProvenance: [
        `${cosmicStructure.discoveryMetadata.source} observation`,
        `Coordinates: RA ${cosmicStructure.coordinates.ra}°, Dec ${cosmicStructure.coordinates.dec}°`,
        `Confidence: ${(cosmicStructure.discoveryMetadata.confidence * 100).toFixed(1)}%`
      ],
      scientificBasis: `Generated from verified astronomical data with ${(cosmicStructure.discoveryMetadata.confidence * 100).toFixed(1)}% confidence. Geometric and acoustic parameters derived from physical properties.`
    };

    return await createPreset(preset);
  }, [createPreset]);

  /**
   * Search presets by query
   */
  const searchPresets = useCallback((query: string, filters?: PresetFilters): GAAPresetExtended[] => {
    const allPresets = [...state.presets];
    
    let filtered = allPresets;

    // Text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(preset =>
        preset.name.toLowerCase().includes(searchTerm) ||
        preset.description.toLowerCase().includes(searchTerm) ||
        preset.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        preset.scientificBasis.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters
    if (filters?.polarityEnabled !== undefined) {
      filtered = filtered.filter(p => !!p.polarityProtocol === filters.polarityEnabled);
    }

    if (filters?.shadowModeEnabled !== undefined) {
      filtered = filtered.filter(p => p.shadowModeEnabled === filters.shadowModeEnabled);
    }

    if (filters?.collectiveCompatible !== undefined) {
      filtered = filtered.filter(p => p.collectiveCompatible === filters.collectiveCompatible);
    }

    if (filters?.cosmicSource) {
      filtered = filtered.filter(p => 
        p.cosmicStructure?.discoveryMetadata.source === filters.cosmicSource
      );
    }

    if (filters?.tags && filters.tags.length > 0) {
      filtered = filtered.filter(p =>
        filters.tags!.some(tag => p.tags.includes(tag))
      );
    }

    if (filters?.minConfidence !== undefined) {
      filtered = filtered.filter(p =>
        (p.cosmicStructure?.discoveryMetadata.confidence || 1) >= filters.minConfidence!
      );
    }

    return filtered;
  }, [state.presets]);

  /**
   * Get preset categories for UI organization
   */
  const getPresetCategories = useCallback(() => {
    const categories = {
      cosmic: state.cosmicPresets,
      manual: state.presets.filter(p => !p.cosmicStructure),
      shadowWork: state.presets.filter(p => p.shadowModeEnabled),
      collective: state.presets.filter(p => p.collectiveCompatible),
      highConfidence: state.presets.filter(p => 
        (p.cosmicStructure?.discoveryMetadata.confidence || 1) > 0.8
      )
    };

    return categories;
  }, [state.presets, state.cosmicPresets]);

  // Auto-load presets on mount
  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  // Database transformation functions
  const transformDatabasePreset = (dbRecord: any): GAAPresetExtended => {
    return {
      id: dbRecord.id,
      name: dbRecord.name,
      description: dbRecord.description || '',
      geometryType: dbRecord.geometry_type || 'basic',
      parameters: dbRecord.parameters || {},

      // Polarity extensions
      polarityProtocol: dbRecord.polarity_protocol || getDefaultPolarityProtocol(),
      cosmicStructure: dbRecord.cosmic_structures ? transformCosmicStructure(dbRecord.cosmic_structures) : undefined,
      biofeedbackIntegration: dbRecord.biofeedback_integration || false,
      shadowModeEnabled: dbRecord.shadow_mode_enabled || false,
      collectiveCompatible: dbRecord.collective_compatible || false,
      safetyProfile: dbRecord.safety_profile || getDefaultSafetyProfile(),

      // Metadata
      createdBy: dbRecord.created_by || 'unknown',
      createdAt: new Date(dbRecord.created_at),
      tags: dbRecord.tags || [],
      evidenceProvenance: dbRecord.evidence_provenance || [],
      scientificBasis: dbRecord.scientific_basis || ''
    };
  };

  // Generate mock presets for development
  const generateMockPresets = (): GAAPresetExtended[] => {
    return [
      {
        id: 'mock-1',
        name: 'Sacred Tetrahedron',
        description: 'Basic tetrahedral geometry with harmonic resonance',
        geometryType: 'tetrahedron',
        parameters: { vertices: 4, harmonics: [220, 330, 440] },
        polarityProtocol: getDefaultPolarityProtocol(),
        biofeedbackIntegration: false,
        shadowModeEnabled: false,
        collectiveCompatible: true,
        safetyProfile: getDefaultSafetyProfile(),
        createdBy: 'system',
        createdAt: new Date(),
        tags: ['basic', 'sacred_geometry'],
        evidenceProvenance: ['Mathematical foundation'],
        scientificBasis: 'Sacred geometry principles'
      },
      {
        id: 'mock-2',
        name: 'Crab Nebula Resonance',
        description: 'Cosmic preset based on the Crab Nebula structure',
        geometryType: 'cosmic_structure',
        parameters: { cosmicType: 'nebula' },
        polarityProtocol: {
          ...getDefaultPolarityProtocol(),
          polarityBalance: 0.3
        },
        cosmicStructure: {
          id: 'crab-nebula',
          name: 'Crab Nebula',
          type: 'nebula',
          coordinates: { ra: 83.63, dec: 22.01, distance: 2000 },
          physicalProperties: { mass: 4.6, luminosity: 75000 },
          geometricSignature: {
            vertices: new Float32Array([0, 0, 0]),
            faces: new Uint32Array([]),
            normals: new Float32Array([0, 1, 0]),
            boundingBox: { min: [-1, -1, -1], max: [1, 1, 1] },
            centerOfMass: [0, 0, 0],
            symmetryGroup: 'C2v',
            fractalDimension: 2.3,
            sacredRatios: { phi: 1.618, pi: 3.14159, euler: 2.718, fibonacci: [1, 1, 2, 3, 5] }
          },
          audioMapping: {
            fundamentalFreq: 256,
            harmonicSeries: [256, 384, 512],
            polarityProfile: getDefaultPolarityProtocol(),
            temporalEvolution: {
              cosmicAge: 1000,
              evolutionRate: 0.01,
              timeDialationFactor: 1.0,
              quantumFluctuation: 0.1,
              causalityMode: 'forward'
            }
          },
          discoveryMetadata: {
            source: 'hubble',
            discoveryDate: new Date('1731-01-01'),
            confidence: 0.95,
            dataQuality: 0.9
          }
        },
        biofeedbackIntegration: true,
        shadowModeEnabled: false,
        collectiveCompatible: true,
        safetyProfile: getDefaultSafetyProfile(),
        createdBy: 'cosmic_generator',
        createdAt: new Date(),
        tags: ['cosmic', 'nebula', 'hubble'],
        evidenceProvenance: ['Hubble telescope data'],
        scientificBasis: 'Astronomical observations with 95% confidence'
      }
    ];
  };

  const transformPresetToDatabase = (preset: Partial<GAAPresetExtended>): any => {
    return {
      name: preset.name,
      description: preset.description,
      geometry_type: preset.geometryType,
      parameters: preset.parameters,
      polarity_protocol: preset.polarityProtocol,
      polarity_enabled: !!preset.polarityProtocol,
      shadow_mode_enabled: preset.shadowModeEnabled,
      collective_compatible: preset.collectiveCompatible,
      biofeedback_integration: preset.biofeedbackIntegration,
      safety_profile: preset.safetyProfile,
      created_by: preset.createdBy,
      tags: preset.tags,
      evidence_provenance: preset.evidenceProvenance,
      scientific_basis: preset.scientificBasis,
      cosmic_source: preset.cosmicStructure?.discoveryMetadata.source,
      confidence_score: preset.cosmicStructure?.discoveryMetadata.confidence || 1.0
    };
  };

  const transformCosmicStructure = (dbRecord: any): CosmicStructureData => {
    // Transform database cosmic structure to type-safe format
    return {
      id: dbRecord.id,
      name: dbRecord.name,
      type: dbRecord.structure_type,
      coordinates: dbRecord.coordinates,
      physicalProperties: dbRecord.physical_properties,
      geometricSignature: dbRecord.geometric_signature,
      audioMapping: dbRecord.audio_mapping,
      discoveryMetadata: dbRecord.discovery_metadata
    };
  };

  // Default configurations
  const getDefaultPolarityProtocol = (): PolarityProtocol => ({
    lightChannel: {
      enabled: true,
      amplitude: 0.7,
      phase: 0,
      subharmonicDepth: 0.2,
      texturalComplexity: 0.5,
      resonanceMode: 'constructive'
    },
    darkChannel: {
      enabled: false,
      amplitude: 0.3,
      phase: Math.PI,
      subharmonicDepth: 0.8,
      texturalComplexity: 0.7,
      resonanceMode: 'phase_cancel'
    },
    polarityBalance: 0,
    manifestInDark: false,
    crossPolarizationEnabled: true,
    darkEnergyDrift: {
      driftRate: 0.001,
      expansionFactor: 1.0,
      voidResonance: false,
      quantumFluctuation: 0.1,
      darkMatterDensity: 0.85
    }
  });

  const getDefaultSafetyProfile = (): any => ({
    infrasonicLimit: 20,
    ultrasonicLimit: 20000,
    maxAmplitude: 0.8,
    fatigueDetection: true,
    shadowModeRequiresConsent: false,
    emergencyStopEnabled: true,
    biofeedbackLimits: {
      maxHeartRate: 140,
      minHeartRateVariability: 20,
      maxStressIndicators: 0.8
    },
    temporalSafetyLimits: {
      maxSessionDuration: 45,
      cooldownPeriod: 10,
      maxDarkDominance: 0.9
    }
  });

  const generateCosmicSafetyProfile = (structure: CosmicStructureData): any => ({
    ...getDefaultSafetyProfile(),
    maxAmplitude: structure.type === 'blackhole' ? 0.6 : 0.8,
    shadowModeRequiresConsent: structure.type === 'blackhole' || structure.type === 'gravitational_wave',
    temporalSafetyLimits: {
      maxSessionDuration: structure.type === 'blackhole' ? 20 : 45,
      cooldownPeriod: structure.type === 'blackhole' ? 15 : 10,
      maxDarkDominance: structure.type === 'blackhole' ? 0.7 : 0.9
    }
  });

  const generateCosmicTags = (structure: CosmicStructureData): string[] => {
    const tags = [structure.type, structure.discoveryMetadata.source, 'cosmic'];
    
    if (structure.coordinates.distance && structure.coordinates.distance > 1e9) {
      tags.push('deep_space');
    }
    
    if (structure.discoveryMetadata.confidence > 0.9) {
      tags.push('high_confidence');
    }
    
    if (structure.type === 'blackhole' || structure.type === 'gravitational_wave') {
      tags.push('shadow_work');
    }
    
    return tags;
  };

  return {
    // State
    ...state,
    
    // Actions
    loadPresets,
    createPreset,
    updatePreset,
    deletePreset,
    setCurrentPreset,
    generateCosmicPreset,
    
    // Computed
    searchResults: searchPresets,
    categories: getPresetCategories(),
    
    // Utilities
    searchPresets,
    getPresetCategories
  };
};