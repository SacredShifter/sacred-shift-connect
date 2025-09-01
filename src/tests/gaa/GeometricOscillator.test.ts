import { describe, it, expect, vi } from 'vitest';
import { GeometricOscillator, GeometricOscillatorConfig, NormalizedGeometry } from '@/utils/gaa/GeometricOscillator';
import * as Tone from 'tone';

// Mock Tone.js
vi.mock('tone', () => {
  const Gain = vi.fn(() => ({
    connect: vi.fn(),
    toDestination: vi.fn(),
    gain: { rampTo: vi.fn() },
  }));
  const Compressor = vi.fn(() => ({
    connect: vi.fn(),
    toDestination: vi.fn(),
  }));
  const Panner3D = vi.fn(() => ({
    connect: vi.fn(),
    positionX: { rampTo: vi.fn() },
    positionY: { rampTo: vi.fn() },
    positionZ: { rampTo: vi.fn() },
    disconnect: vi.fn(),
  }));
  const Oscillator = vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn(),
    frequency: { rampTo: vi.fn() },
  }));
  const Filter = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    frequency: { rampTo: vi.fn() },
  }));
  const AmplitudeEnvelope = vi.fn(() => ({
    connect: vi.fn(),
    triggerAttack: vi.fn(),
    triggerRelease: vi.fn(),
    disconnect: vi.fn(),
  }));

  return {
    Gain,
    Compressor,
    Panner3D,
    Oscillator,
    Filter,
    AmplitudeEnvelope,
    context: { createAnalyser: vi.fn() },
    Destination: { connect: vi.fn() },
    start: vi.fn().mockResolvedValue(undefined),
  };
});

// Mock AudioContext
const MockAudioContext = vi.fn(() => ({
  createGain: vi.fn(),
  createAnalyser: vi.fn(),
  destination: {},
}));

describe('GeometricOscillator', () => {
  const defaultConfig: GeometricOscillatorConfig = {
    baseFrequency: 440,
    gainLevel: 0.8,
    waveform: 'sine',
    modulationDepth: 0.1,
    spatialPanning: true,
  };

  const mockGeometry: NormalizedGeometry = {
    vertices: [[0, 0, 0], [1, 1, 1]],
    faces: [[0, 1, 0]],
    normals: [[0, 0, 1]],
    center: [0.5, 0.5, 0.5],
    radius: 0.7,
    sacredRatios: { phi: 1.618, pi: 3.141, sqrt2: 1.414 },
  };

  it('should be instantiated without errors', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    expect(() => new GeometricOscillator(audioContext, defaultConfig)).not.toThrow();
  });

  it('should create an oscillator when createGeometricOscillator is called', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const oscillator = new GeometricOscillator(audioContext, defaultConfig);
    oscillator.createGeometricOscillator(mockGeometry, 'test-id');
    expect(oscillator.getActiveCount()).toBe(1);
  });

  it('should calculate geometric frequency within a valid range', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const geoOsc = new GeometricOscillator(audioContext, defaultConfig);
    // @ts-expect-error - accessing private method for testing
    const freq = geoOsc.calculateGeometricFrequency(mockGeometry);
    expect(freq).toBeGreaterThanOrEqual(20);
    expect(freq).toBeLessThanOrEqual(2000);
  });

  it('should stop an oscillator when stopOscillator is called', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const oscillator = new GeometricOscillator(audioContext, defaultConfig);
    oscillator.createGeometricOscillator(mockGeometry, 'test-id');
    expect(oscillator.getActiveCount()).toBe(1);

    // Use vi.useFakeTimers to control setTimeout
    vi.useFakeTimers();
    oscillator.stopOscillator('test-id');

    // Fast-forward time to trigger cleanup
    vi.runAllTimers();

    expect(oscillator.getActiveCount()).toBe(0);
    vi.useRealTimers();
  });

});
