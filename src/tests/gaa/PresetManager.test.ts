import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PresetManager } from '@/utils/gaa/PresetManager';
import { sacredStorage } from '@/lib/offline-storage';
// Import the mocked version of the presets
import { COSMIC_STRUCTURE_PRESETS as mockPresets } from '@/utils/gaa/CosmicStructurePresets';

// Mock the storage module
vi.mock('@/lib/offline-storage', () => ({
  sacredStorage: {
    initialize: vi.fn().mockResolvedValue(undefined),
    getAll: vi.fn(),
    store: vi.fn(),
  },
}));

// Mock the presets module factory
vi.mock('@/utils/gaa/CosmicStructurePresets', () => {
    const actualMockPresets = [
        {
            id: 'preset-1',
            name: 'Test Preset 1',
            evidence: { confidence: 'confirmed', discoveryDate: '2023-01-01', telescope: 'test-scope', validators: [] },
            triLaw: { scientificValidity: true, safetyCompliance: true, accessibilityScore: 80, lastVerified: '2024-01-01' },
            visualization: { animationSpeed: 1, color: '', opacity: 1, particleDensity: 1 },
            helixParams: {},
            audioProfile: { baseFrequency: 440, harmonicComplexity: 0.5, spatialSpread: 0.5, dynamicRange: 0.5 }
        },
        {
            id: 'preset-2',
            name: 'Test Preset 2',
            evidence: { confidence: 'confirmed', discoveryDate: '2023-01-01', telescope: 'test-scope', validators: [] },
            triLaw: { scientificValidity: true, safetyCompliance: true, accessibilityScore: 95, lastVerified: '2024-01-01' },
            visualization: { animationSpeed: 1, color: '', opacity: 1, particleDensity: 1 },
            helixParams: {},
            audioProfile: { baseFrequency: 440, harmonicComplexity: 0.5, spatialSpread: 0.5, dynamicRange: 0.5 }
        },
        {
            id: 'preset-3',
            name: 'Unsafe Preset',
            evidence: { confidence: 'confirmed', discoveryDate: '2023-01-01', telescope: 'test-scope', validators: [] },
            triLaw: { scientificValidity: true, safetyCompliance: false, accessibilityScore: 90, lastVerified: '2024-01-01' },
            visualization: { animationSpeed: 1, color: '', opacity: 1, particleDensity: 1 },
            helixParams: {},
            audioProfile: { baseFrequency: 440, harmonicComplexity: 0.5, spatialSpread: 0.5, dynamicRange: 0.5 }
        },
    ];
    return {
        COSMIC_STRUCTURE_PRESETS: actualMockPresets,
    };
});


describe('PresetManager', () => {
  let presetManager: PresetManager;

  beforeEach(() => {
    vi.clearAllMocks();
    presetManager = new PresetManager();
  });

  it('should initialize and fetch presets when cache is empty', async () => {
    // Arrange
    (sacredStorage.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    // Act
    await presetManager.initialize('test-user');

    // Assert
    expect(sacredStorage.initialize).toHaveBeenCalledWith('test-user');
    expect(sacredStorage.getAll).toHaveBeenCalledWith('presets');
    expect(sacredStorage.store).toHaveBeenCalledTimes(mockPresets.length);
    expect(sacredStorage.store).toHaveBeenCalledWith('presets', mockPresets[0], true);
  });

  it('should initialize from cache when presets are available', async () => {
    // Arrange
    (sacredStorage.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockPresets);

    // Act
    await presetManager.initialize('test-user');

    // Assert
    expect(sacredStorage.initialize).toHaveBeenCalledWith('test-user');
    expect(sacredStorage.getAll).toHaveBeenCalledWith('presets');
    expect(sacredStorage.store).not.toHaveBeenCalled();

    // Verify it uses cached data
    const accessible = presetManager.getAccessiblePresets();
    expect(accessible.length).toBe(2); // preset-3 is unsafe
  });

  it('should load a preset successfully after initialization', async () => {
    // Arrange
    (sacredStorage.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockPresets);
    await presetManager.initialize('test-user');

    // Act
    const result = await presetManager.loadPreset('preset-1');

    // Assert
    expect(result.success).toBe(true);
    expect(result.preset?.id).toBe('preset-1');
  });

  it('should return an error if trying to load a preset before initialization', async () => {
    // Act
    const result = await presetManager.loadPreset('preset-1');

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain('not initialized');
  });

  it('should return an empty array from getAccessiblePresets before initialization', () => {
    // Act
    const result = presetManager.getAccessiblePresets();

    // Assert
    expect(result).toEqual([]);
  });
});
