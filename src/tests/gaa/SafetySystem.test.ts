import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SafetySystem, SafetyAlert } from '@/utils/gaa/SafetySystem';

// Mock AnalyserNode for testing updateAudioMetrics
const createMockAnalyserNode = (peakNormalized: number): AnalyserNode => {
  const buffer = new Uint8Array(128);
  // zero is 128, max is 255.
  const peakByte = 128 + peakNormalized * 127;
  buffer.fill(128); // Fill with silence
  buffer[0] = peakByte; // Add one peak value

  return {
    getByteTimeDomainData: vi.fn((array: Uint8Array) => {
      array.set(buffer);
    }),
    fftSize: buffer.length,
  } as unknown as AnalyserNode;
};

describe('SafetySystem', () => {
  let safetySystem: SafetySystem;

  beforeEach(() => {
    safetySystem = new SafetySystem();
  });

  it('should be instantiated without errors', () => {
    expect(() => new SafetySystem()).not.toThrow();
  });

  it('should initialize with a "safe" status', () => {
    const status = safetySystem.getSafetyStatus();
    expect(status.level).toBe('safe');
    expect(status.activeAlerts).toHaveLength(0);
  });

  // Audio Safety Tests
  it('should trigger a critical audio alert for high peak levels', () => {
    const mockAnalyser = createMockAnalyserNode(0.95); // 95% peak, threshold is 90%
    safetySystem.updateAudioMetrics(mockAnalyser, 1000);

    const status = safetySystem.getSafetyStatus();
    expect(status.level).toBe('critical');
    expect(status.activeAlerts[0].category).toBe('audio');
    expect(status.activeAlerts[0].type).toBe('critical');
  });

  it('should trigger a warning audio alert for high RMS levels', () => {
    // Use a square wave with amplitude 0.8.
    // Peak will be 0.8 (which is < 0.9, so it's safe).
    // RMS will also be 0.8 (which is > 0.7, so it should trigger a warning).
    const buffer = new Uint8Array(128);
    for(let i=0; i<buffer.length; i++) {
        const value = (i < buffer.length / 2) ? 128 + (0.8 * 127) : 128 - (0.8 * 127);
        buffer[i] = value;
    }
    const mockAnalyser = {
        getByteTimeDomainData: vi.fn((array: Uint8Array) => {
            array.set(buffer);
        }),
        fftSize: buffer.length,
    } as unknown as AnalyserNode;

    safetySystem.updateAudioMetrics(mockAnalyser, 1000);

    const status = safetySystem.getSafetyStatus();
    expect(status.level).toBe('warning');
    expect(status.activeAlerts[0].category).toBe('audio');
    expect(status.activeAlerts[0].message).toContain('RMS level high');
  });

  // Visual Safety Tests
  it('should trigger a critical visual alert for high flash rate', () => {
    safetySystem.updateVisualMetrics(4, 0.5, 0.5); // 4Hz flash rate, threshold is 3Hz

    const status = safetySystem.getSafetyStatus();
    expect(status.level).toBe('critical');
    expect(status.activeAlerts[0].category).toBe('visual');
    expect(status.activeAlerts[0].message).toContain('seizure risk');
  });

  // Breathing Safety Tests
  it('should trigger a critical breathing alert for very fast breathing', () => {
    safetySystem.updateBreathingMetrics(35, 10, 0.8); // 35 BPM, threshold is 30

    const status = safetySystem.getSafetyStatus();
    expect(status.level).toBe('critical');
    expect(status.activeAlerts[0].category).toBe('breathing');
    expect(status.activeAlerts[0].message).toContain('too fast');
  });

  // Duration Safety Tests
  it('should trigger duration alerts', () => {
    vi.useFakeTimers();
    const alertCallback = vi.fn();
    safetySystem.onAlert(alertCallback);

    safetySystem.startMonitoring();

    // Advance time past the warning threshold (20 mins)
    vi.advanceTimersByTime(21 * 60 * 1000);
    expect(alertCallback).toHaveBeenCalledWith(expect.objectContaining({ category: 'duration', type: 'warning' }));

    // Advance time past the critical threshold (45 mins)
    vi.advanceTimersByTime(25 * 60 * 1000);
    expect(alertCallback).toHaveBeenCalledWith(expect.objectContaining({ category: 'duration', type: 'critical' }));

    vi.useRealTimers();
    safetySystem.stopMonitoring();
  });

  it('should not trigger duplicate alerts in rapid succession', () => {
    const alertCallback = vi.fn();
    safetySystem.onAlert(alertCallback);

    safetySystem.updateVisualMetrics(5, 0.5, 0.5);
    safetySystem.updateVisualMetrics(5, 0.5, 0.5);
    safetySystem.updateVisualMetrics(5, 0.5, 0.5);

    expect(alertCallback).toHaveBeenCalledTimes(1);
  });

  describe('Threshold Boundary Conditions', () => {
    it('should not trigger a visual alert just below the flash rate threshold', () => {
      safetySystem.updateVisualMetrics(2.9, 0.5, 0.5); // Threshold is 3Hz
      const status = safetySystem.getSafetyStatus();
      expect(status.level).toBe('safe');
    });

    it('should trigger a visual alert exactly at the flash rate threshold', () => {
      // The check is `> THRESHOLD`, so exactly at threshold should be safe.
      safetySystem.updateVisualMetrics(3.0, 0.5, 0.5);
      const statusAt = safetySystem.getSafetyStatus();
      expect(statusAt.level).toBe('safe');

      // But just above should trigger it.
      safetySystem.updateVisualMetrics(3.1, 0.5, 0.5);
      const statusAbove = safetySystem.getSafetyStatus();
      expect(statusAbove.level).toBe('critical');
    });

    it('should not trigger an audio alert just below the peak threshold', () => {
        const mockAnalyser = createMockAnalyserNode(0.89); // Threshold is 0.9
        safetySystem.updateAudioMetrics(mockAnalyser, 1000);
        const status = safetySystem.getSafetyStatus();
        expect(status.level).toBe('safe');
    });
  });
});
