import { describe, it, expect, vi } from 'vitest';
import { MultiScaleLayerManager } from '@/utils/gaa/MultiScaleLayerManager';
import { GeometricOscillator, GeometricOscillatorConfig } from '@/utils/gaa/GeometricOscillator';

// Mock Tone.js to prevent audio context errors in a pure logic test
vi.mock('tone', () => ({
  Gain: vi.fn(() => ({ connect: vi.fn(), toDestination: vi.fn() })),
  Compressor: vi.fn(() => ({ connect: vi.fn(), toDestination: vi.fn() })),
  Panner3D: vi.fn(() => ({ connect: vi.fn() })),
  Oscillator: vi.fn(() => ({ connect: vi.fn(), start: vi.fn(), set: vi.fn(), frequency: {} })),
  Filter: vi.fn(() => ({ connect: vi.fn() })),
  AmplitudeEnvelope: vi.fn(() => ({ connect: vi.fn(), triggerAttack: vi.fn() })),
  Analyser: vi.fn(() => ({ connect: vi.fn(), toDestination: vi.fn() })),
  Destination: { connect: vi.fn() },
  start: vi.fn().mockResolvedValue(undefined),
}));

const MockAudioContext = vi.fn();

import { NormalizedGeometry } from '@/utils/gaa/GeometricOscillator';

describe('NaN Frequency Bug Reproduction', () => {
  it('should produce NaN when frequency is calculated with invalid geometry', () => {
    // 1. Create a "bad" geometry object with an invalid radius
    const badGeometry: NormalizedGeometry = {
      vertices: [[0,0,0]],
      faces: [[0,0,0]],
      normals: [[0,0,1]],
      center: [0,0,0],
      radius: Infinity, // This is the core of the bug
      sacredRatios: { phi: 1.618, pi: 3.141, sqrt2: 1.414 },
    };

    // 2. Create an oscillator
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const config: GeometricOscillatorConfig = {
      baseFrequency: 100,
      gainLevel: 1,
      profile: 'balanced',
      modulationDepth: 0.1,
    };
    const oscillator = new GeometricOscillator(audioContext, config);

    // 3. Calculate the frequency, which should result in NaN
    // @ts-expect-error - accessing private method for testing
    const freq = oscillator.calculateGeometricFrequency(badGeometry);

    // 4. Assert that the fix is working
    expect(freq).toBe(432);

    oscillator.destroy();
  });
});
