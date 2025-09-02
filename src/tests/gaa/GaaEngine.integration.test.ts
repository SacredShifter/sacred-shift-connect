import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { MultiScaleLayerManager } from '@/utils/gaa/MultiScaleLayerManager';
import { GeometricOscillator, GeometricOscillatorConfig } from '@/utils/gaa/GeometricOscillator';

// Mock Tone.js to prevent audio context errors
vi.mock('tone', () => ({
  Gain: vi.fn(() => ({ connect: vi.fn(), toDestination: vi.fn(), gain: { rampTo: vi.fn() } })),
  Compressor: vi.fn(() => ({ connect: vi.fn(), toDestination: vi.fn() })),
  Panner3D: vi.fn(() => ({ connect: vi.fn(), set: vi.fn(), positionX: {}, positionY: {}, positionZ: {} })),
  Oscillator: vi.fn(() => ({ connect: vi.fn(), start: vi.fn(), stop: vi.fn(), set: vi.fn(), frequency: { rampTo: vi.fn() } })),
  Filter: vi.fn(() => ({ connect: vi.fn(), set: vi.fn(), frequency: { rampTo: vi.fn() } })),
  AmplitudeEnvelope: vi.fn(() => ({ connect: vi.fn(), triggerAttack: vi.fn(), triggerRelease: vi.fn(), set: vi.fn() })),
  Analyser: vi.fn(() => ({ connect: vi.fn(), toDestination: vi.fn() })),
  Destination: { connect: vi.fn() },
  start: vi.fn().mockResolvedValue(undefined),
  getContext: vi.fn(() => ({
    rawContext: new MockAudioContext(),
  })),
}));

const MockAudioContext = vi.fn();

describe('GAA Engine Integration Tests', () => {
  it('should handle invalid geometry from MultiScaleLayerManager and create a fallback oscillator', () => {
    // 1. Setup: Create instances of the manager and oscillator
    const layerManager = new MultiScaleLayerManager();
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const config: GeometricOscillatorConfig = {
      baseFrequency: 100,
      gainLevel: 1,
      profile: 'balanced',
      modulationDepth: 0.1,
    };
    const oscillator = new GeometricOscillator(audioContext, config);

    // 2. Action: Create a scenario that produces invalid geometry
    // Disable all layers to trigger the fallback in generateLayerGeometry
    const layerIds = Object.keys(layerManager.getState().layers) as any[];
    layerIds.forEach(id => layerManager.toggleLayer(id)); // All layers are now off

    const geometries = layerManager.generateCompositeGeometry();

    // Because all layers are off, generateCompositeGeometry returns an empty array.
    // The calling context (`useGAAEngine`) would not attempt to create an oscillator.
    // Let's test the next level of failure: what if it returns geometry with no faces?
    // The `generateLayerGeometry` now has a fallback for this. Let's force that path.

    // We will manually call the internal method to simulate a case where it produces bad data
    // despite the guards. This ensures the full pipeline is robust.
    // @ts-expect-error - testing private method
    const badGeometry = layerManager.generateLayerGeometry('atomic', { active: true, weight: 0.001, frequency: 1, phase: 0, resonance: 1 }, 1, 0);

    // Ensure our fallback logic in generateLayerGeometry works
    expect(badGeometry.faces.length).toBeGreaterThan(0);

    // 3. Verification: Attempt to create an oscillator with this (now safe) geometry
    const consoleWarnSpy = vi.spyOn(console, 'warn');
    const success = oscillator.createGeometricOscillator(badGeometry, 'test-osc');

    // It should succeed because the geometry is now valid (a fallback triangle)
    expect(success).toBe(true);
    expect(oscillator.getActiveCount()).toBe(1);

    // And no warnings about NaN frequency should have been logged by the oscillator
    expect(consoleWarnSpy).not.toHaveBeenCalledWith(expect.stringContaining('NaN frequency'));

    oscillator.destroy();
    consoleWarnSpy.mockRestore();
  });

  it('should run the GAA engine update loop without logging critical errors', async () => {
    const { renderHook, act } = await import('@testing-library/react');
    const { useGAAEngine } = await import('@/hooks/useGAAEngine');

    const errorSpy = vi.spyOn(console, 'error');
    const warnSpy = vi.spyOn(console, 'warn');

    const { result, waitForNextUpdate } = renderHook(() => useGAAEngine(null));

    await act(async () => {
        await result.current.initializeGAA();
        result.current.startGAA();
    });

    // Let the engine run for a few frames
    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
        result.current.stopGAA();
    });

    // Assert that no critical errors were logged
    expect(errorSpy).not.toHaveBeenCalledWith(expect.stringContaining('Failed to create oscillator'));
    expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('NaN frequency'));

    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
