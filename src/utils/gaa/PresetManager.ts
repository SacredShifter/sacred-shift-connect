import { CosmicStructurePreset, COSMIC_STRUCTURE_PRESETS, getVerifiedPresets } from './CosmicStructurePresets';
import { ToroidalHelixGeometry } from './ToroidalHelixGeometry';
import { GeometricOscillator, GeometricOscillatorConfig } from './GeometricOscillator';
import { sacredStorage } from '@/lib/offline-storage';

export interface PresetLoadResult {
  success: boolean;
  preset?: CosmicStructurePreset;
  geometry?: ToroidalHelixGeometry;
  message?: string;
  warnings?: string[];
}

export interface SafetyConstraints {
  maxFrequency: number;
  minFrequency: number;
  maxVolume: number;
  maxFlashRate: number; // Hz
  maxBreathRate: number; // BPM
  minBreathRate: number; // BPM
}

export interface AccessibilityOptions {
  hearingImpaired: boolean;
  visualImpaired: boolean;
  cognitiveSimplification: boolean;
  motorAccessibility: boolean;
  seizureProtection: boolean;
}

export class PresetManager {
  private _allPresets: CosmicStructurePreset[] = [];
  private activePreset: CosmicStructurePreset | null = null;
  private activeGeometry: ToroidalHelixGeometry | null = null;
  private safetyConstraints: SafetyConstraints;
  private accessibilityOptions: AccessibilityOptions;
  private isInitialized = false;

  constructor() {
    this.safetyConstraints = { maxFrequency: 20000, minFrequency: 20, maxVolume: 0.8, maxFlashRate: 3, maxBreathRate: 30, minBreathRate: 4 };
    this.accessibilityOptions = { hearingImpaired: false, visualImpaired: false, cognitiveSimplification: false, motorAccessibility: false, seizureProtection: true };
  }

  async initialize(userId: string): Promise<void> {
    if (this.isInitialized) return;

    await sacredStorage.initialize(userId);

    // 1. Try to load from cache first
    const cachedPresets = await sacredStorage.getAll('presets');
    if (cachedPresets && cachedPresets.length > 0) {
      this._allPresets = cachedPresets;
      console.log('[PresetManager] Loaded presets from cache.');
    } else {
      // 2. If cache is empty, fetch and populate
      console.log('[PresetManager] Cache empty, fetching presets...');
      await this._fetchAndCachePresets();
    }

    this.isInitialized = true;
  }

  private async _fetchAndCachePresets(): Promise<void> {
    // In the future, this would be a network request.
    // For now, we use the hardcoded presets.
    const presets = COSMIC_STRUCTURE_PRESETS;

    for (const preset of presets) {
      // Using 'true' to skip encryption for public, non-sensitive preset data.
      await sacredStorage.store('presets', preset, true);
    }

    this._allPresets = presets;
    console.log(`[PresetManager] Fetched and cached ${presets.length} presets.`);
  }

  /**
   * Load a cosmic structure preset with safety verification
   */
  async loadPreset(presetId: string): Promise<PresetLoadResult> {
    if (!this.isInitialized) {
        return { success: false, message: 'PresetManager not initialized.' };
    }

    const preset = this._allPresets.find(p => p.id === presetId);
    
    if (!preset) {
      return {
        success: false,
        message: `Preset with ID '${presetId}' not found`
      };
    }

    // Verify Tri-Law compliance
    const triLawResult = this.verifyTriLawCompliance(preset);
    if (!triLawResult.passed) {
      return {
        success: false,
        message: `Preset failed Tri-Law verification: ${triLawResult.reason}`,
        warnings: triLawResult.warnings
      };
    }

    // Apply safety constraints
    const safePreset = this.applySafetyConstraints(preset);
    
    // Create geometry with safe parameters
    const geometry = new ToroidalHelixGeometry(safePreset.helixParams);
    
    // Apply accessibility modifications
    const accessiblePreset = this.applyAccessibilityModifications(safePreset);

    this.activePreset = accessiblePreset;
    this.activeGeometry = geometry;

    return {
      success: true,
      preset: accessiblePreset,
      geometry,
      message: `Successfully loaded ${preset.name}`,
      warnings: triLawResult.warnings
    };
  }

  /**
   * Verify Tri-Law compliance: Scientific Validity, Safety, Accessibility
   */
  private verifyTriLawCompliance(preset: CosmicStructurePreset): { 
    passed: boolean; 
    reason?: string; 
    warnings: string[] 
  } {
    const warnings: string[] = [];

    // 1. Scientific Validity Check
    if (!preset.triLaw.scientificValidity) {
      return { 
        passed: false, 
        reason: 'Scientific validity not verified',
        warnings 
      };
    }

    // Check evidence confidence
    if (preset.evidence.confidence === 'candidate') {
      warnings.push('This structure is still a candidate - not fully confirmed');
    }

    // Check discovery recency (structures older than 50 years might need re-verification)
    const discoveryYear = new Date(preset.evidence.discoveryDate).getFullYear();
    const currentYear = new Date().getFullYear();
    if (currentYear - discoveryYear > 50) {
      warnings.push('This is a historical discovery - modern verification recommended');
    }

    // 2. Safety Compliance Check
    if (!preset.triLaw.safetyCompliance) {
      return { 
        passed: false, 
        reason: 'Safety compliance not verified',
        warnings 
      };
    }

    // Check if last verification is recent (within 1 year)
    const lastVerified = new Date(preset.triLaw.lastVerified);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (lastVerified < oneYearAgo) {
      warnings.push('Tri-Law verification is more than 1 year old');
    }

    // 3. Accessibility Score Check
    if (preset.triLaw.accessibilityScore < 75) {
      return { 
        passed: false, 
        reason: `Accessibility score too low: ${preset.triLaw.accessibilityScore}/100`,
        warnings 
      };
    }

    return { passed: true, warnings };
  }

  /**
   * Apply safety constraints to preset parameters
   */
  private applySafetyConstraints(preset: CosmicStructurePreset): CosmicStructurePreset {
    const safePreset = { ...preset };
    
    // Constrain audio frequencies
    safePreset.audioProfile = {
      ...preset.audioProfile,
      baseFrequency: Math.max(
        this.safetyConstraints.minFrequency,
        Math.min(this.safetyConstraints.maxFrequency, preset.audioProfile.baseFrequency)
      )
    };

    // Limit dynamic range to prevent sudden loud sounds
    safePreset.audioProfile.dynamicRange = Math.min(
      this.safetyConstraints.maxVolume,
      preset.audioProfile.dynamicRange
    );

    // Constrain animation speed to prevent seizures
    if (this.accessibilityOptions.seizureProtection) {
      safePreset.visualization.animationSpeed = Math.min(
        this.safetyConstraints.maxFlashRate,
        preset.visualization.animationSpeed
      );
    }

    return safePreset;
  }

  /**
   * Apply accessibility modifications based on user needs
   */
  private applyAccessibilityModifications(preset: CosmicStructurePreset): CosmicStructurePreset {
    const accessiblePreset = { ...preset };

    // Hearing impaired: Enhance visual feedback
    if (this.accessibilityOptions.hearingImpaired) {
      accessiblePreset.visualization.opacity = Math.min(1.0, preset.visualization.opacity + 0.2);
      accessiblePreset.visualization.particleDensity *= 1.5;
    }

    // Visual impaired: Enhance audio cues
    if (this.accessibilityOptions.visualImpaired) {
      accessiblePreset.audioProfile.harmonicComplexity = Math.min(1.0, preset.audioProfile.harmonicComplexity + 0.3);
      accessiblePreset.audioProfile.spatialSpread = Math.min(1.0, preset.audioProfile.spatialSpread + 0.2);
    }

    // Cognitive simplification: Reduce complexity
    if (this.accessibilityOptions.cognitiveSimplification) {
      accessiblePreset.helixParams.helixTurns = Math.min(3.0, preset.helixParams.helixTurns || 1.0);
      accessiblePreset.audioProfile.harmonicComplexity *= 0.7;
      accessiblePreset.visualization.particleDensity *= 0.6;
    }

    return accessiblePreset;
  }

  /**
   * Get all verified presets suitable for current accessibility settings
   */
  getAccessiblePresets(): CosmicStructurePreset[] {
    if (!this.isInitialized) {
        console.warn("PresetManager not initialized, returning empty array.");
        return [];
    }

    const verified = this._allPresets.filter(p =>
        p.triLaw.scientificValidity &&
        p.triLaw.safetyCompliance &&
        p.triLaw.accessibilityScore >= 75
    );
    
    // Filter based on accessibility requirements
    return verified.filter(preset => {
      if (this.accessibilityOptions.seizureProtection && preset.visualization.animationSpeed > this.safetyConstraints.maxFlashRate) {
        return false;
      }
      
      if (this.accessibilityOptions.cognitiveSimplification && preset.triLaw.accessibilityScore < 90) {
        return false;
      }

      return true;
    });
  }

  /**
   * Update safety constraints
   */
  updateSafetyConstraints(constraints: Partial<SafetyConstraints>): void {
    this.safetyConstraints = { ...this.safetyConstraints, ...constraints };
  }

  /**
   * Update accessibility options
   */
  updateAccessibilityOptions(options: Partial<AccessibilityOptions>): void {
    this.accessibilityOptions = { ...this.accessibilityOptions, ...options };
  }

  /**
   * Get current active preset
   */
  getActivePreset(): CosmicStructurePreset | null {
    return this.activePreset;
  }

  /**
   * Get current geometry
   */
  getActiveGeometry(): ToroidalHelixGeometry | null {
    return this.activeGeometry;
  }

  /**
   * Generate evidence badge for display
   */
  generateEvidenceBadge(preset: CosmicStructurePreset): {
    level: 'gold' | 'silver' | 'bronze';
    tooltip: string;
    verified: boolean;
  } {
    const confidence = preset.evidence.confidence;
    const accessibilityScore = preset.triLaw.accessibilityScore;
    const hasRecentVerification = new Date(preset.triLaw.lastVerified) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

    if (confidence === 'confirmed' && accessibilityScore >= 90 && hasRecentVerification) {
      return {
        level: 'gold',
        tooltip: `Confirmed discovery with high accessibility (${accessibilityScore}/100)`,
        verified: true
      };
    }

    if (confidence === 'confirmed' && accessibilityScore >= 75) {
      return {
        level: 'silver',
        tooltip: `Confirmed discovery with good accessibility (${accessibilityScore}/100)`,
        verified: true
      };
    }

    return {
      level: 'bronze',
      tooltip: `${confidence} discovery with basic accessibility (${accessibilityScore}/100)`,
      verified: preset.triLaw.scientificValidity && preset.triLaw.safetyCompliance
    };
  }

  /**
   * Export current session configuration
   */
  exportSession(): {
    presetId: string | null;
    timestamp: string;
    safetyConstraints: SafetyConstraints;
    accessibilityOptions: AccessibilityOptions;
  } {
    return {
      presetId: this.activePreset?.id || null,
      timestamp: new Date().toISOString(),
      safetyConstraints: this.safetyConstraints,
      accessibilityOptions: this.accessibilityOptions
    };
  }
}