import { BioSignals, GaaOutputs, GaaPreset, GaaCoreFrame, ShadowEngineState } from "@/types/gaa";

export class ShadowEngine {
  private t = 0;
  private last: GaaOutputs = {
    fHz: 220, amp: 0, fcHz: 800, azimuth: 0, elevation: 0,
    darkPhaseActive: false, weights: { dark: 0.7, light: 0.3 }
  };

  constructor(private preset: GaaPreset) {}

  setPreset(p: GaaPreset) { this.preset = p; }

  step(dt: number, core: GaaCoreFrame, bio: BioSignals): GaaOutputs {
    this.t += dt;

    // ---- weights baseline ----
    const pol = this.preset.polarity;
    const hrvBias = bio.hrv ?? 0.5;
    const eegBias = bio.eegBandRatio ?? 0.5;
    const shadowBias = pol.shadowMode ? 1 : 0.5 * (hrvBias + (1 - eegBias));
    const wDarkBase = pol.polarityEnabled ? pol.darkWeight : 0.0;
    let wDark = wDarkBase + 0.4 * shadowBias * (1 - wDarkBase);
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
    const kSub = 0.5; // subharmonic ratio
    let fD = kSub * fL;
    let AD = core.A0 * (1 - (AL / (core.A0 + 1e-6))) * this.preset.polarity.manifestDarkPhase.intensity;
    AD = clamp(AD, 0, 1);
    let fcD = Math.max(40, (core.fc0*core.fc0) / Math.max(100, fcL));

    // ---- Dark energy drift ----
    if (pol.darkEnergyEnabled) {
      const { driftRate, depth } = pol.darkEnergy;
      const drift = Math.exp(depth * driftRate * this.t);
      fL *= drift; fD *= drift;
      fcL *= (1 + 0.2*depth*Math.sin(0.1*this.t));
      fcD *= (1 + 0.2*depth*Math.cos(0.07*this.t));
    }

    // ---- Manifest-in-dark gate ----
    let darkPhaseActive = false;
    const mdp = pol.manifestDarkPhase;
    if (this.t < mdp.duration) {
      darkPhaseActive = true;
      const x = this.t / Math.max(0.001, mdp.duration);
      const fade = (mdp.curve === "exp") ? (x*x) : x;
      wLight = wLight * fade;
      wDark  = clamp(1 - fade + wDark*fade, 0, 1);
      AD *= (1 + mdp.intensity*(1 - fade));
    }

    const fHz  = wLight*fL + wDark*fD;
    const amp  = clamp(AL*wLight + AD*wDark, 0, 0.9);
    const fcHz = clamp(wLight*fcL + wDark*fcD, 40, 16000);

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