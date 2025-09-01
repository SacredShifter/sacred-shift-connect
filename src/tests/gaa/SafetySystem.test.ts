import { describe, it, expect, vi } from 'vitest';
import { SafetySystem, SafetyAlert } from '@/utils/gaa/SafetySystem';

// Mock AnalyserNode for testing updateAudioMetrics
const createMockAnalyserNode = (peakValue: number): AnalyserNode => {
  const dataArray = new Uint8Array(1);
  dataArray[0] = peakValue * 255; // Convert normalized peak to byte value

  return {
    getByteFrequencyData: vi.fn((array: Uint8Array) => {
      array[0] = dataArray[0];
    }),
    frequencyBinCount: 1,
  } as unknown as AnalyserNode;
};

describe('SafetySystem', () => {
  it('should be instantiated without errors', () => {
    expect(() => new SafetySystem()).not.toThrow();
  });

  it('should initialize with a "safe" status', () => {
    const safetySystem = new SafetySystem();
    const status = safetySystem.getSafetyStatus();
    expect(status.level).toBe('safe');
    expect(status.activeAlerts).toHaveLength(0);
  });

  // Audio Safety Tests
  it('should trigger a critical audio alert for high peak levels', () => {
    const safetySystem = new SafetySystem();
    const mockAnalyser = createMockAnalyserNode(0.95); // 95% peak, threshold is 90%
    safetySystem.updateAudioMetrics(mockAnalyser, 1000);

    const status = safetySystem.getSafetyStatus();
    expect(status.level).toBe('critical');
    expect(status.activeAlerts[0].category).toBe('audio');
    expect(status.activeAlerts[0].type).toBe('critical');
  });

  it('should trigger a warning audio alert for high RMS levels', () => {
    const safetySystem = new SafetySystem();
    // To get high RMS, we need a different mock
    const mockAnalyser = {
        getByteFrequencyData: vi.fn((array: Uint8Array) => {
            for(let i=0; i<array.length; i++) array[i] = 200; // ~78% RMS
        }),
        frequencyBinCount: 128,
    } as unknown as AnalyserNode;

    safetySystem.updateAudioMetrics(mockAnalyser, 1000);

    const status = safetySystem.getSafetyStatus();
    expect(status.level).toBe('warning');
    expect(status.activeAlerts[0].category).toBe('audio');
    expect(status.activeAlerts[0].message).toContain('RMS level high');
  });

  // Visual Safety Tests
  it('should trigger a critical visual alert for high flash rate', () => {
    const safetySystem = new SafetySystem();
    safetySystem.updateVisualMetrics(4, 0.5, 0.5); // 4Hz flash rate, threshold is 3Hz

    const status = safetySystem.getSafetyStatus();
    expect(status.level).toBe('critical');
    expect(status.activeAlerts[0].category).toBe('visual');
    expect(status.activeAlerts[0].message).toContain('seizure risk');
  });

  // Breathing Safety Tests
  it('should trigger a critical breathing alert for very fast breathing', () => {
    const safetySystem = new SafetySystem();
    safetySystem.updateBreathingMetrics(35, 10, 0.8); // 35 BPM, threshold is 30

    const status = safetySystem.getSafetyStatus();
    expect(status.level).toBe('critical');
    expect(status.activeAlerts[0].category).toBe('breathing');
    expect(status.activeAlerts[0].message).toContain('too fast');
  });

  // Duration Safety Tests
  it('should trigger duration alerts', () => {
    vi.useFakeTimers();
    const safetySystem = new SafetySystem();
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
    const safetySystem = new SafetySystem();
    const alertCallback = vi.fn();
    safetySystem.onAlert(alertCallback);

    safetySystem.updateVisualMetrics(5, 0.5, 0.5);
    safetySystem.updateVisualMetrics(5, 0.5, 0.5);
    safetySystem.updateVisualMetrics(5, 0.5, 0.5);

    expect(alertCallback).toHaveBeenCalledTimes(1);
  });
});
