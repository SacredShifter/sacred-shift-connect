import { describe, it, expect } from 'vitest';
import { ShadowEngine } from '@/dsp/ShadowEngine';
import { GaaPreset, GaaCoreFrame, BioSignals } from '@/types/gaa';

describe('ShadowEngine', () => {
  const mockPreset: GaaPreset = {
    polarity: {
      polarityEnabled: true,
      darkWeight: 0.5,
      shadowMode: false,
      darkEnergyEnabled: false,
      darkEnergy: {
        driftRate: 0,
        depth: 0,
      },
      manifestDarkPhase: {
        duration: 0,
        curve: 'linear',
        intensity: 0,
      },
    },
    params: {
        alpha: [1, 1, 1, 1],
        beta: [1, 1],
        gamma: [1, 1],
    },
  };

  const mockCoreFrame: GaaCoreFrame = {
    f0: 100,
    A0: 0.8,
    fc0: 1000,
    ThN: 0.5,
    PhiN: 0.5,
    kN: 0.5,
    tN: 0.5,
    dThNdt: 0,
    dPhiNdt: 0,
    az: 0,
    el: 0,
  };

  const mockBioSignals: BioSignals = {
    hrv: 0.6,
    eegBandRatio: 0.4,
  };

  it('should be instantiated without errors', () => {
    expect(() => new ShadowEngine(mockPreset)).not.toThrow();
  });

  it('should execute a step without errors and return the correct shape', () => {
    const engine = new ShadowEngine(mockPreset);
    let outputs;
    expect(() => {
      outputs = engine.step(0.016, mockCoreFrame, mockBioSignals);
    }).not.toThrow();

    expect(outputs).toBeDefined();
    expect(outputs).toHaveProperty('fHz');
    expect(outputs).toHaveProperty('amp');
    expect(outputs).toHaveProperty('fcHz');
    expect(outputs).toHaveProperty('darkPhaseActive');
    expect(outputs).toHaveProperty('weights');
    expect(outputs.weights).toHaveProperty('dark');
    expect(outputs.weights).toHaveProperty('light');
  });

  it('should produce deterministic output for the same inputs', () => {
    const engine1 = new ShadowEngine(mockPreset);
    const outputs1 = engine1.step(0.016, mockCoreFrame, mockBioSignals);

    const engine2 = new ShadowEngine(mockPreset);
    const outputs2 = engine2.step(0.016, mockCoreFrame, mockBioSignals);

    expect(outputs1).toEqual(outputs2);
  });

  it('should update weights based on bio-signals', () => {
    const engine = new ShadowEngine(mockPreset);
    const outputs1 = engine.step(0.016, mockCoreFrame, mockBioSignals);

    const bioSignalsWithMoreStress = { hrv: 0.3, eegBandRatio: 0.7 };
    const outputs2 = engine.step(0.016, mockCoreFrame, bioSignalsWithMoreStress);

    // Based on the formula, lower HRV and higher EEG Beta/Alpha ratio (represented by 1-eegBandRatio) should increase dark weight
    expect(outputs2.weights.dark).toBeGreaterThan(outputs1.weights.dark);
  });

  it('should return a snapshot of the current state', () => {
    const engine = new ShadowEngine(mockPreset);
    engine.step(0.016, mockCoreFrame, mockBioSignals);
    const snapshot = engine.snapshot();

    expect(snapshot).toHaveProperty('t');
    expect(snapshot).toHaveProperty('darkPhaseActive');
    expect(snapshot).toHaveProperty('weights');
    expect(snapshot).toHaveProperty('lastOutputs');
    expect(snapshot.t).toBeGreaterThan(0);
  });
});
