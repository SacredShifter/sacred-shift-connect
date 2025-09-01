import { BioSignals, GaaOutputs, GaaPreset, GaaCoreFrame, ShadowEngineState } from "@/types/gaa";

const SHADOW_ENGINE_CONSTANTS = {
  DEFAULT_BIO_BIAS: 0.5,
  SHADOW_BIAS_FACTOR: 0.4,
  SUBHARMONIC_RATIO: 0.5,
  DARK_AMP_EPSILON: 1e-6,
  MIN_FILTER_FREQ_HZ: 40,
  MAX_FILTER_FREQ_HZ: 16000,
  INVERTED_FILTER_CEILING_HZ: 100,
  MAX_AMP: 0.9,
  MIN_MDP_DURATION: 0.001,
  DARK_ENERGY_DRIFT_FC_MOD_AMP: 0.2,
  DARK_ENERGY_DRIFT_FC_L_FREQ: 0.1,
  DARK_ENERGY_DRIFT_FC_D_FREQ: 0.07,
};

export class ShadowEngine {
  private t = 0;
  private last: GaaOutputs = {
    fHz: 220, amp: 0, fcHz: 800, azimuth: 0, elevation: 0,
    darkPhaseActive: false, weights: { dark: 0.7, light: 0.3 }
  };

  constructor(private preset: GaaPreset) {}

  setPreset(p: GaaPreset) { this.preset = p; }

  /**
   * Processes one time step of the Shadow Engine DSP.
   * This method calculates the final audio parameters (frequency, amplitude, filter cutoff)
   * by mixing a "Light" and a "Dark" channel. The mix is determined by bio-signal feedback,
   * preset configurations, and internal state like the dark energy drift.
   *
   * @param dt The delta time in seconds since the last step.
   * @param core The core geometric parameters for the current frame.
   * @param bio The bio-signal feedback for the current frame.
   * @returns The final calculated audio outputs for the frame.
   */
  step(dt: number, core: GaaCoreFrame, bio: BioSignals): GaaOutputs {
    this.t += dt;
    const C = SHADOW_ENGINE_CONSTANTS;

    // ---- weights baseline ----
    const pol = this.preset.polarity;
    const hrvBias = bio.hrv ?? C.DEFAULT_BIO_BIAS;
    const eegBias = bio.eegBandRatio ?? C.DEFAULT_BIO_BIAS;
    const shadowBias = pol.shadowMode ? 1 : 0.5 * (hrvBias + (1 - eegBias));
    const wDarkBase = pol.polarityEnabled ? pol.darkWeight : 0.0;
    let wDark = wDarkBase + C.SHADOW_BIAS_FACTOR * shadowBias * (1 - wDarkBase);
    wDark = Math.min(1, Math.max(0, wDark));
    let wLight = 1 - wDark;

    // ---- LIGHT channel ----
    const [a1,a2,a3,a4] = this.preset.params.alpha;
    const [b1,b2]       = this.preset.params.beta;
    const [g1,g2]       = this.preset.params.gamma;

    let fL = core.f0 * Math.exp(
      a1*(core.ThN-0.5) + a2*(core.PhiN-0.5) + a3*(core.kN-0.5) + a4*(core.tN-0.5)
    );
    let AL = core.A0 * (1 + b1*(core.kN-0.5)) * (1 + b2*Math.abs(core.dThNdt));
    let fcL = core.fc0 * Math.exp(g1*(core.PhiN-0.5) + g2*(core.kN-0.5));

    // ---- DARK channel ----
    let fD = C.SUBHARMONIC_RATIO * fL;
    let AD = core.A0 * (1 - (AL / (core.A0 + C.DARK_AMP_EPSILON))) * this.preset.polarity.manifestDarkPhase.intensity;
    AD = clamp(AD, 0, 1);
    let fcD = Math.max(C.MIN_FILTER_FREQ_HZ, (core.fc0*core.fc0) / Math.max(C.INVERTED_FILTER_CEILING_HZ, fcL));

    // ---- Dark energy drift ----
    if (pol.darkEnergyEnabled) {
      const { driftRate, depth } = pol.darkEnergy;
      const drift = Math.exp(depth * driftRate * this.t);
      fL *= drift; fD *= drift;
      fcL *= (1 + C.DARK_ENERGY_DRIFT_FC_MOD_AMP*depth*Math.sin(C.DARK_ENERGY_DRIFT_FC_L_FREQ*this.t));
      fcD *= (1 + C.DARK_ENERGY_DRIFT_FC_MOD_AMP*depth*Math.cos(C.DARK_ENERGY_DRIFT_FC_D_FREQ*this.t));
    }

    // ---- Manifest-in-dark gate ----
    let darkPhaseActive = false;
    const mdp = pol.manifestDarkPhase;
    if (this.t < mdp.duration) {
      darkPhaseActive = true;
      const x = this.t / Math.max(C.MIN_MDP_DURATION, mdp.duration);
      const fade = (mdp.curve === "exp") ? (x*x) : x;
      wLight = wLight * fade;
      wDark  = clamp(1 - fade + wDark*fade, 0, 1);
      AD *= (1 + mdp.intensity*(1 - fade));
    }

    const fHz  = wLight*fL + wDark*fD;
    const amp  = clamp(AL*wLight + AD*wDark, 0, C.MAX_AMP);
    const fcHz = clamp(wLight*fcL + wDark*fcD, C.MIN_FILTER_FREQ_HZ, C.MAX_FILTER_FREQ_HZ);

    this.last = {
      fHz, amp, fcHz,
      azimuth: core.az, elevation: core.el,
      darkPhaseActive,
      weights: { dark: wDark, light: wLight }
    };
    return this.last;
  }

  snapshot(): ShadowEngineState {
    return {
      t: this.t,
      darkPhaseActive: this.last.darkPhaseActive,
      weights: this.last.weights,
      lastOutputs: this.last
    };
  }
}

function clamp(x:number, lo=0, hi=1){ return Math.max(lo, Math.min(hi, x)); }