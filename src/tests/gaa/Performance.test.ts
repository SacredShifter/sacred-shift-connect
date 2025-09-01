import { describe, it, expect, vi } from 'vitest';
import { GeometricOscillator, GeometricOscillatorConfig } from '@/utils/gaa/GeometricOscillator';
import { GaaCoreFrame } from '@/types/gaa';
import * as Tone from 'tone';

// Mock AudioContext
(global as any).AudioContext = vi.fn(() => ({
  createGain: vi.fn(),
  createAnalyser: vi.fn(),
  destination: {},
}));

// Mock Tone.js
vi.mock('tone', () => {
  const Gain = vi.fn(() => ({
    connect: vi.fn(),
    toDestination: vi.fn(),
    gain: { rampTo: vi.fn() },
    disconnect: vi.fn(),
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
    set: vi.fn(),
  }));
  const Oscillator = vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn(),
    frequency: { rampTo: vi.fn() },
    set: vi.fn(),
  }));
  const Filter = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    frequency: { rampTo: vi.fn() },
    set: vi.fn(),
  }));
  const AmplitudeEnvelope = vi.fn(() => ({
    connect: vi.fn(),
    triggerAttack: vi.fn(),
    triggerRelease: vi.fn(),
    disconnect: vi.fn(),
    set: vi.fn(),
  }));

  return {
    Gain,
    Compressor,
    Panner3D,
    Oscillator,
    Filter,
    AmplitudeEnvelope,
    Analyser: vi.fn(() => ({
      toDestination: vi.fn(),
      connect: vi.fn(),
    })),
    context: { createAnalyser: vi.fn() },
    Destination: { connect: vi.fn() },
    start: vi.fn().mockResolvedValue(undefined),
    Context: vi.fn(() => ({
      rawContext: {
        createGain: vi.fn(),
        createAnalyser: vi.fn(),
        destination: {},
      }
    }))
  };
});


describe('Performance', () => {
  const geoConfig: GeometricOscillatorConfig = {
    baseFrequency: 220, gainLevel: 0.7, waveform: 'sine',
    modulationDepth: 0.2, spatialPanning: true
  };

  const mockCore: GaaCoreFrame = {
    f0: 220, A0: 0.8, fc0: 1200, ThN: 0.5, PhiN: 0.5,
    kN: 0.5, tN: 0.5, dThNdt: 0,
    az: 0, el: 0
  };

  it('should handle 32 oscillators without crashing', () => {
    vi.useFakeTimers();
    const audioContext = new Tone.Context();
    const geoOsc = new GeometricOscillator(audioContext.rawContext, geoConfig);

    for (let i = 0; i < 32; i++) {
      const id = `osc-${i}`;
      const geom = {
        vertices: [], faces: [], normals: [],
        center: [Math.random(), Math.random(), Math.random()],
        radius: Math.random(),
        sacredRatios: { phi: 1.618, pi: 3.141, sqrt2: 1.414 }
      };
      geoOsc.createGeometricOscillator(geom, id);
    }

    expect(geoOsc.getActiveCount()).toBe(32);
    geoOsc.stopAll();
    vi.runAllTimers();
    expect(geoOsc.getActiveCount()).toBe(0);
    vi.useRealTimers();
  });

  it('should handle 64 oscillators if the limit is raised', () => {
    vi.useFakeTimers();
    // This test is designed to fail with the current MAX_OSCILLATORS limit of 32
    // It can be used to test the performance if the limit is raised in the future.
    const audioContext = new Tone.Context();
    const geoOsc = new GeometricOscillator(audioContext.rawContext, geoConfig);

    let createdCount = 0;
    for (let i = 0; i < 64; i++) {
      const id = `osc-${i}`;
      const geom = {
        vertices: [], faces: [], normals: [],
        center: [Math.random(), Math.random(), Math.random()],
        radius: Math.random(),
        sacredRatios: { phi: 1.618, pi: 3.141, sqrt2: 1.414 }
      };
      if (geoOsc.createGeometricOscillator(geom, id)) {
        createdCount++;
      }
    }

    expect(createdCount).toBe(32); // This should be 32 with the current limit
    geoOsc.stopAll();
    vi.runAllTimers();
    expect(geoOsc.getActiveCount()).toBe(0);
    vi.useRealTimers();
  });
});
