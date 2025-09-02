import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GeometricOscillator, GeometricOscillatorConfig, NormalizedGeometry } from '@/utils/gaa/GeometricOscillator';
import * as Tone from 'tone';

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
    profile: 'balanced',
    modulationDepth: 0.1,
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
    const oscillator = new GeometricOscillator(audioContext, defaultConfig);
    expect(oscillator).toBeInstanceOf(GeometricOscillator);
    oscillator.destroy();
  });

  it('should create an oscillator when createGeometricOscillator is called', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const oscillator = new GeometricOscillator(audioContext, defaultConfig);
    oscillator.createGeometricOscillator(mockGeometry, 'test-id');
    expect(oscillator.getActiveCount()).toBe(1);
    oscillator.destroy();
  });

  it('should calculate geometric frequency within a valid range', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const geoOsc = new GeometricOscillator(audioContext, defaultConfig);
    // @ts-expect-error - accessing private method for testing
    const freq = geoOsc.calculateGeometricFrequency(mockGeometry);
    expect(freq).toBeGreaterThanOrEqual(20);
    expect(freq).toBeLessThanOrEqual(20000); // Increased upper bound
    geoOsc.destroy();
  });

  it('should fallback to 432 Hz for invalid or out-of-range frequency', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const geoOsc = new GeometricOscillator(audioContext, defaultConfig);

    // Test with NaN radius
    const nanGeometry = { ...mockGeometry, radius: NaN };
    // @ts-expect-error
    const freq1 = geoOsc.calculateGeometricFrequency(nanGeometry);
    expect(freq1).toBe(432);

    // Test with frequency below range
    const lowFreqGeometry = { ...mockGeometry, radius: -1000 }; // Will calculate to < 20
    // @ts-expect-error
    const freq2 = geoOsc.calculateGeometricFrequency(lowFreqGeometry);
    expect(freq2).toBe(432);

    // Test with frequency above range
    const highFreqGeometry = { ...mockGeometry, radius: 1000 }; // Will calculate to > 20000
    // @ts-expect-error
    const freq3 = geoOsc.calculateGeometricFrequency(highFreqGeometry);
    expect(freq3).toBe(432);

    // Test with null geometry
    // @ts-expect-error
    const freq4 = geoOsc.calculateGeometricFrequency(null);
    expect(freq4).toBe(432);

    geoOsc.destroy();
  });

  it('should calculate a specific, predictable frequency', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const geoOsc = new GeometricOscillator(audioContext, { ...defaultConfig, baseFrequency: 100 });

    const specificGeometry: NormalizedGeometry = {
      vertices: Array(100).fill([0,0,0]), // 100 vertices
      faces: [], normals: [],
      center: [0, 0, 0], // No center magnitude
      radius: 0.5, // (radius - 0.5) * 2 = 0, so phi term is 1
      sacredRatios: { phi: 1.618, pi: 3.141, sqrt2: 1.414 },
    };

    // Manual calculation:
    // freq = baseFrequency * Math.pow(phi, (0.5 - 0.5) * 2) -> 100 * 1 = 100
    // complexity = 100 / 100 = 1
    // freq *= 1 + 1 * 0.5 -> 100 * 1.5 = 150
    // centerMagnitude = 0, so that term is 1
    // Final freq should be 150
    // @ts-expect-error - accessing private method for testing
    const freq = geoOsc.calculateGeometricFrequency(specificGeometry);
    expect(freq).toBeCloseTo(150);
    geoOsc.destroy();
  });

  it('should produce a lower frequency with a smaller radius', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const geoOsc = new GeometricOscillator(audioContext, defaultConfig);
    const geometry1 = { ...mockGeometry, radius: 0.2 };
    const geometry2 = { ...mockGeometry, radius: 0.8 };
    // @ts-expect-error - accessing private method for testing
    const freq1 = geoOsc.calculateGeometricFrequency(geometry1);
    // @ts-expect-error - accessing private method for testing
    const freq2 = geoOsc.calculateGeometricFrequency(geometry2);
    expect(freq1).toBeLessThan(freq2);
    geoOsc.destroy();
  });

  it('should produce a higher filter cutoff with more vertices', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const geoOsc = new GeometricOscillator(audioContext, defaultConfig);
    const geometry1 = { ...mockGeometry, vertices: Array(10).fill([0,0,0]) };
    const geometry2 = { ...mockGeometry, vertices: Array(100).fill([0,0,0]) };
    // @ts-expect-error - accessing private method for testing
    const fc1 = geoOsc.calculateFilterFrequency(geometry1);
    // @ts-expect-error - accessing private method for testing
    const fc2 = geoOsc.calculateFilterFrequency(geometry2);
    expect(fc2).toBeGreaterThan(fc1);
    geoOsc.destroy();
  });

  it('should recycle nodes back into the pool when an oscillator is stopped', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const oscillator = new GeometricOscillator(audioContext, defaultConfig);
    oscillator.stopMonitoring(); // Stop monitoring for this specific timer test
    vi.useFakeTimers();

    // @ts-expect-error - accessing private property for testing
    const initialPoolSize = oscillator.oscPool.length;

    oscillator.createGeometricOscillator(mockGeometry, 'test-id-1');
    // @ts-expect-error - accessing private property for testing
    expect(oscillator.oscPool.length).toBe(initialPoolSize - 1);

    oscillator.stopOscillator('test-id-1');
    vi.runAllTimers();

    // @ts-expect-error - accessing private property for testing
    expect(oscillator.oscPool.length).toBe(initialPoolSize);
    vi.useRealTimers();
    oscillator.destroy();
  });

  it('should stop an oscillator when stopOscillator is called', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const oscillator = new GeometricOscillator(audioContext, defaultConfig);
    oscillator.stopMonitoring(); // Stop monitoring for this specific timer test

    oscillator.createGeometricOscillator(mockGeometry, 'test-id');
    expect(oscillator.getActiveCount()).toBe(1);

    // Use vi.useFakeTimers to control setTimeout
    vi.useFakeTimers();
    oscillator.stopOscillator('test-id');

    // Fast-forward time to trigger cleanup
    vi.runAllTimers();

    expect(oscillator.getActiveCount()).toBe(0);
    vi.useRealTimers();
    oscillator.destroy();
  });

  it('should default to the "balanced" profile if none is provided', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const configWithoutProfile: Omit<GeometricOscillatorConfig, 'profile'> = {
        baseFrequency: 440,
        gainLevel: 0.8,
        modulationDepth: 0.1,
    };
    // @ts-ignore - Intentionally creating without profile to test default
    const oscillator = new GeometricOscillator(audioContext, configWithoutProfile);
    oscillator.createGeometricOscillator(mockGeometry, 'test-id');

    // @ts-ignore
    const lastOscillatorCall = (Tone.Oscillator as vi.Mock).mock.results.slice(-1)[0].value;
    expect(lastOscillatorCall.set).toHaveBeenCalledWith(expect.objectContaining({ type: 'triangle' }));
    oscillator.destroy();
  });

  it('should apply "high-quality" audio profile settings correctly', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const oscillator = new GeometricOscillator(audioContext, { ...defaultConfig, profile: 'high-quality' });
    oscillator.createGeometricOscillator(mockGeometry, 'test-id');

    // @ts-ignore
    const lastOscillatorCall = (Tone.Oscillator as vi.Mock).mock.results.slice(-1)[0].value;
    // @ts-ignore
    const lastFilterCall = (Tone.Filter as vi.Mock).mock.results.slice(-1)[0].value;
    // @ts-ignore
    const lastEnvelopeCall = (Tone.AmplitudeEnvelope as vi.Mock).mock.results.slice(-1)[0].value;

    expect(lastOscillatorCall.set).toHaveBeenCalledWith(expect.objectContaining({ type: 'sawtooth' }));
    expect(lastFilterCall.set).toHaveBeenCalledWith(expect.objectContaining({ rolloff: -24 }));
    expect(lastEnvelopeCall.set).toHaveBeenCalledWith(expect.objectContaining({ attack: 0.2, release: 0.8 }));
    oscillator.destroy();
  });

  it('should apply "low-latency" audio profile settings correctly', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const oscillator = new GeometricOscillator(audioContext, { ...defaultConfig, profile: 'low-latency' });
    oscillator.createGeometricOscillator(mockGeometry, 'test-id');

    // @ts-ignore
    const lastOscillatorCall = (Tone.Oscillator as vi.Mock).mock.results.slice(-1)[0].value;
    // @ts-ignore
    const lastFilterCall = (Tone.Filter as vi.Mock).mock.results.slice(-1)[0].value;
    // @ts-ignore
    const lastEnvelopeCall = (Tone.AmplitudeEnvelope as vi.Mock).mock.results.slice(-1)[0].value;

    expect(lastOscillatorCall.set).toHaveBeenCalledWith(expect.objectContaining({ type: 'sine' }));
    expect(lastFilterCall.set).toHaveBeenCalledWith(expect.objectContaining({ rolloff: -12 }));
    expect(lastEnvelopeCall.set).toHaveBeenCalledWith(expect.objectContaining({ attack: 0.05, release: 0.2 }));
    oscillator.destroy();
  });

  it('should switch profiles cleanly without leaking audio nodes', () => {
    const audioContext = new MockAudioContext() as unknown as AudioContext;
    const oscillator = new GeometricOscillator(audioContext, { ...defaultConfig, profile: 'high-quality' });
    oscillator.stopMonitoring(); // Stop monitoring for this specific timer test
    vi.useFakeTimers();

    // @ts-expect-error - Get pool size after pre-warming
    const prewarmedPoolSize = oscillator.oscPool.length;

    // --- Action 1: Create an oscillator ---
    oscillator.createGeometricOscillator(mockGeometry, 'test-id-1');
    expect(oscillator.getActiveCount()).toBe(1);
    // @ts-expect-error
    expect(oscillator.oscPool.length).toBe(prewarmedPoolSize - 1);

    // --- Action 2: Switch profile ---
    oscillator.setProfile('low-latency');
    vi.runAllTimers(); // Cleanup for 'test-id-1'
    expect(oscillator.getActiveCount()).toBe(0);
    // @ts-expect-error
    expect(oscillator.oscPool.length).toBe(prewarmedPoolSize); // Node returned

    // --- Action 3: Create another oscillator with the new profile ---
    oscillator.createGeometricOscillator(mockGeometry, 'test-id-2');
    expect(oscillator.getActiveCount()).toBe(1);
    // @ts-expect-error
    expect(oscillator.oscPool.length).toBe(prewarmedPoolSize - 1);

    // Assert new profile is used
    // @ts-ignore
    const lastOscillatorCall = (Tone.Oscillator as vi.Mock).mock.results.slice(-1)[0].value;
    expect(lastOscillatorCall.set).toHaveBeenCalledWith(expect.objectContaining({ type: 'sine' }));

    // --- Action 4: Stop the final oscillator ---
    oscillator.stopOscillator('test-id-2');
    vi.runAllTimers();
    expect(oscillator.getActiveCount()).toBe(0);

    // --- Final Assertion: Check for leaks ---
    // @ts-expect-error
    const finalPoolSize = oscillator.oscPool.length;
    expect(finalPoolSize).toBe(prewarmedPoolSize); // Final state should match initial state

    vi.useRealTimers();
    oscillator.destroy();
  });

  describe('Dynamic Load Balancing', () => {
    let performanceNow = 0;
    let rafCallback: FrameRequestCallback | null = null;

    beforeEach(() => {
        performanceNow = 0;
        rafCallback = null;
        vi.spyOn(performance, 'now').mockImplementation(() => performanceNow);
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
            rafCallback = cb;
            return 1; // return a mock handle
        });
        vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
            rafCallback = null;
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const runFrames = (count: number, frameDelta: number) => {
        for (let i = 0; i < count; i++) {
            performanceNow += frameDelta;
            if (rafCallback) {
                rafCallback(performanceNow);
            }
        }
    };

    it('should decrease oscillator limit under high CPU load', () => {
        const audioContext = new MockAudioContext() as unknown as AudioContext;
        const oscillator = new GeometricOscillator(audioContext, defaultConfig);

        // @ts-expect-error
        const initialLimit = oscillator._dynamicMaxOscillators;

        // Simulate 21 frames with a 50ms delta (20 FPS)
        runFrames(21, 50);

        // @ts-expect-error
        const newLimit = oscillator._dynamicMaxOscillators;
        expect(newLimit).toBeLessThan(initialLimit);

        oscillator.destroy();
    });

    it('should increase oscillator limit under low CPU load', () => {
        const audioContext = new MockAudioContext() as unknown as AudioContext;
        const oscillator = new GeometricOscillator(audioContext, defaultConfig);

        // First, simulate high load to lower the limit
        runFrames(21, 50);

        // @ts-expect-error
        const loweredLimit = oscillator._dynamicMaxOscillators;
        expect(loweredLimit).toBeLessThan(32);

        // Now, simulate healthy load (16ms delta, ~60 FPS)
        runFrames(21, 16);

        // @ts-expect-error
        const restoredLimit = oscillator._dynamicMaxOscillators;
        expect(restoredLimit).toBeGreaterThan(loweredLimit);

        oscillator.destroy();
    });

    it('should block oscillator creation when dynamic limit is reached', () => {
        const audioContext = new MockAudioContext() as unknown as AudioContext;
        const oscillator = new GeometricOscillator(audioContext, defaultConfig);

        // Manually set a low limit for testing
        // @ts-expect-error
        oscillator._dynamicMaxOscillators = 1;

        const result1 = oscillator.createGeometricOscillator(mockGeometry, 'test-1');
        expect(result1).toBe(true);
        expect(oscillator.getActiveCount()).toBe(1);

        const result2 = oscillator.createGeometricOscillator(mockGeometry, 'test-2');
        expect(result2).toBe(false);
        expect(oscillator.getActiveCount()).toBe(1);

        oscillator.destroy();
    });
  });
});
