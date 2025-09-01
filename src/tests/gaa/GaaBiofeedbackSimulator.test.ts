import { describe, it, expect, vi } from 'vitest';
import { GaaBiofeedbackSimulator } from '@/utils/biofeedback/GaaBiofeedbackSimulator';

describe('GaaBiofeedbackSimulator', () => {
  it('should be instantiated without errors', () => {
    expect(() => new GaaBiofeedbackSimulator()).not.toThrow();
  });

  it('should start and stop the simulation', () => {
    vi.useFakeTimers();
    const simulator = new GaaBiofeedbackSimulator();

    expect(simulator.isRunning).toBe(false);

    simulator.startSession();
    expect(simulator.isRunning).toBe(true);

    const initialState = simulator.getFullState();
    // Advance time by more than one interval
    vi.advanceTimersByTime(1500);
    const stateAfterTime = simulator.getFullState();
    expect(stateAfterTime.heartRate).not.toEqual(initialState.heartRate);

    simulator.stopSession();
    expect(simulator.isRunning).toBe(false);

    vi.useRealTimers();
  });

  describe('BioSignals Calculation', () => {
    it('should return a valid BioSignals object', () => {
      const simulator = new GaaBiofeedbackSimulator();
      const signals = simulator.getBioSignals();

      expect(signals).toHaveProperty('hrv');
      expect(signals).toHaveProperty('eegBandRatio');
      expect(signals.hrv).toBeTypeOf('number');
      expect(signals.eegBandRatio).toBeTypeOf('number');
    });

    it('should handle the eegBandRatio calculation when alpha is zero', () => {
      const simulator = new GaaBiofeedbackSimulator();
      // @ts-expect-error - private property access for testing
      simulator.state.brainwaveAlpha = 0;
      // @ts-expect-error - private property access for testing
      simulator.state.brainwaveBeta = 0.5;

      const signals = simulator.getBioSignals();
      expect(signals.eegBandRatio).toBe(0);
    });

    it('should handle the eegBandRatio calculation when beta is zero', () => {
      const simulator = new GaaBiofeedbackSimulator();
      // @ts-expect-error - private property access for testing
      simulator.state.brainwaveAlpha = 0.5;
      // @ts-expect-error - private property access for testing
      simulator.state.brainwaveBeta = 0;

      const signals = simulator.getBioSignals();
      expect(signals.eegBandRatio).toBe(1);
    });

    it('should handle the eegBandRatio calculation when both are zero', () => {
      const simulator = new GaaBiofeedbackSimulator();
      // @ts-expect-error - private property access for testing
      simulator.state.brainwaveAlpha = 0;
      // @ts-expect-error - private property access for testing
      simulator.state.brainwaveBeta = 0;

      const signals = simulator.getBioSignals();
      // The epsilon value prevents division by zero
      expect(signals.eegBandRatio).toBe(0);
    });
  });
});
