import { BioSignals } from '@/types/gaa';

interface EmbodiedBiofeedbackState {
  heartRate: number;
  heartRateVariability: number;
  breathingRate: number;
  skinConductance: number;
  brainwaveAlpha: number;
  brainwaveBeta: number;
  brainwaveTheta: number;
  brainwaveDelta: number;
  muscleTension: number;
  bodyTemperature: number;
}

/**
 * Simulates a biofeedback device connection, generating mock sensor data.
 * This class is intended for development and testing purposes.
 */
export class GaaBiofeedbackSimulator {
  private state: EmbodiedBiofeedbackState;
  private simulationRef: NodeJS.Timeout | null = null;
  public isRunning: boolean = false;

  constructor() {
    this.state = {
      heartRate: 72,
      heartRateVariability: 50,
      breathingRate: 16,
      skinConductance: 0.5,
      brainwaveAlpha: 0.3,
      brainwaveBeta: 0.4,
      brainwaveTheta: 0.2,
      brainwaveDelta: 0.1,
      muscleTension: 0.3,
      bodyTemperature: 98.6
    };
  }

  public startSession(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.simulationRef = setInterval(() => {
      this.state = {
        ...this.state,
        heartRate: 60 + Math.sin(Date.now() / 10000) * 20 + Math.random() * 10,
        heartRateVariability: 30 + Math.sin(Date.now() / 15000) * 30 + Math.random() * 20,
        breathingRate: 12 + Math.sin(Date.now() / 8000) * 4 + Math.random() * 2,
        skinConductance: 0.3 + Math.sin(Date.now() / 12000) * 0.4 + Math.random() * 0.1,
        brainwaveAlpha: 0.2 + Math.sin(Date.now() / 7000) * 0.3 + Math.random() * 0.1,
        brainwaveBeta: 0.3 + Math.sin(Date.now() / 9000) * 0.3 + Math.random() * 0.1,
        brainwaveTheta: 0.1 + Math.sin(Date.now() / 11000) * 0.2 + Math.random() * 0.05,
        brainwaveDelta: 0.05 + Math.sin(Date.now() / 13000) * 0.1 + Math.random() * 0.02,
        muscleTension: 0.2 + Math.sin(Date.now() / 6000) * 0.3 + Math.random() * 0.1,
        bodyTemperature: 98.6 + Math.sin(Date.now() / 20000) * 1 + Math.random() * 0.2
      };
    }, 1000);
  }

  public stopSession(): void {
    if (!this.isRunning || !this.simulationRef) return;
    this.isRunning = false;
    clearInterval(this.simulationRef);
    this.simulationRef = null;
  }

  /**
   * Gets the latest simulated bio-signal data.
   * @returns A BioSignals object for use in the ShadowEngine.
   */
  public getBioSignals(): BioSignals {
    // Translate the detailed state into the simplified BioSignals type
    return {
      hrv: this.state.heartRateVariability,
      // A simple mapping of alpha (calm) vs beta (active) brainwaves
      eegBandRatio: this.state.brainwaveAlpha / (this.state.brainwaveAlpha + this.state.brainwaveBeta + 1e-6),
    };
  }

  /**
   * Gets the full, detailed state of the biofeedback simulation.
   * @returns The detailed biofeedback state.
   */
  public getFullState(): EmbodiedBiofeedbackState {
    return { ...this.state };
  }
}
