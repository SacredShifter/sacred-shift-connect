import { describe, it, expect, vi } from 'vitest';
import { MultiScaleLayerManager } from '@/utils/gaa/MultiScaleLayerManager';
import { GeometricNormalizer } from '@/utils/gaa/GeometricNormalizer';

// Mock GeometricNormalizer since its implementation is not part of this test
vi.mock('@/utils/gaa/GeometricNormalizer', () => {
  return {
    GeometricNormalizer: vi.fn().mockImplementation(() => {
      return {
        normalize: vi.fn((geom) => ({ ...geom, normalized: true })),
      };
    }),
  };
});

describe('MultiScaleLayerManager', () => {
  it('should be instantiated without errors', () => {
    expect(() => new MultiScaleLayerManager()).not.toThrow();
  });

  it('should initialize with a default hierarchy of layers', () => {
    const manager = new MultiScaleLayerManager();
    const state = manager.getState();
    expect(state.layers).toBeDefined();
    expect(Object.keys(state.layers)).toEqual([
      'atomic',
      'molecular',
      'cellular',
      'tissue',
      'organ',
      'organism',
    ]);
    expect(state.layers.cellular.active).toBe(true);
  });

  it('should generate composite geometry without errors', () => {
    const manager = new MultiScaleLayerManager();
    let geometries;
    expect(() => {
      geometries = manager.generateCompositeGeometry(12);
    }).not.toThrow();

    expect(geometries).toBeInstanceOf(Array);
    expect(geometries.length).toBeGreaterThan(0);
    // @ts-expect-error - check for mock property
    expect(geometries[0].normalized).toBe(true);
  });

  it('should generate geometry with vertices', () => {
    const manager = new MultiScaleLayerManager();
    const geometries = manager.generateCompositeGeometry(12);

    expect(geometries[0].vertices).toBeInstanceOf(Array);
    expect(geometries[0].vertices.length).toBeGreaterThan(0);
    expect(geometries[0].vertices[0].length).toBe(3);
  });

  it('should update breath phase over time', () => {
    const manager = new MultiScaleLayerManager();
    const initialState = manager.getState();
    manager.updateBreathPhase(0.1);
    const updatedState = manager.getState();
    expect(updatedState.breathPhase).not.toEqual(initialState.breathPhase);
  });

  it('should toggle a layer on and off', () => {
    const manager = new MultiScaleLayerManager();
    const initialWeight = manager.getState().layers.organism.weight;

    manager.toggleLayer('organism');
    const stateAfterOff = manager.getState();
    expect(stateAfterOff.layers.organism.active).toBe(false);

    manager.toggleLayer('organism');
    const stateAfterOn = manager.getState();
    expect(stateAfterOn.layers.organism.active).toBe(true);
  });

  it('should not generate geometry for inactive layers', () => {
    const manager = new MultiScaleLayerManager();
    // Deactivate all but one layer
    manager.toggleLayer('atomic');
    manager.toggleLayer('molecular');
    manager.toggleLayer('cellular');
    manager.toggleLayer('tissue');
    manager.toggleLayer('organ');

    const geometries = manager.generateCompositeGeometry(20);
    // Only the 'organism' layer should produce geometry
    expect(geometries.length).toBe(1);
  });

  it('should produce a consistent geometric output for snapshot testing', () => {
    const manager = new MultiScaleLayerManager();
    // Mock performance.now() to ensure deterministic output for the snapshot
    vi.spyOn(performance, 'now').mockReturnValue(1000);

    const geometries = manager.generateCompositeGeometry(12);
    expect(geometries).toMatchSnapshot();
  });

  describe('Individual Layer Geometry Snapshots', () => {
    const layerIds: (keyof LayerHierarchy)[] = ['atomic', 'molecular', 'cellular', 'tissue', 'organ', 'organism'];

    layerIds.forEach(layerId => {
      it(`should generate a consistent snapshot for the ${layerId} layer`, () => {
        const manager = new MultiScaleLayerManager();
        vi.spyOn(performance, 'now').mockReturnValue(1000);

        // Deactivate all layers except the one being tested
        layerIds.forEach(id => {
          if (id !== layerId) {
            manager.toggleLayer(id);
          }
        });

        const geometry = manager.generateCompositeGeometry(20);
        expect(geometry).toMatchSnapshot();
      });
    });
  });
});
