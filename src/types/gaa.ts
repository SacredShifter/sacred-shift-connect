export type ManifestDarkPhase = {
  duration: number;       // seconds
  intensity: number;      // 0..1
  curve: "linear" | "exp";
};

export type DarkEnergyParams = {
  driftRate: number;      // e.g., 0.0003
  depth: number;          // 0..1
};

export type GaaPolarity = {
  polarityEnabled: boolean;
  shadowMode: boolean;
  darkWeight: number;     // default 0.7
  lightWeight: number;    // default 0.3
  darkEnergyEnabled: boolean;
  darkEnergy: DarkEnergyParams;
  manifestDarkPhase: ManifestDarkPhase;
};

export type GaaParams = {
  // geometry
  R: number; r: number; n: number; phi0: number;
  omega: number; eta: number;                 // traversal & breath coupling
  kappaRef: number; tauRef: number;
  alpha: [number, number, number, number];    // freq sensitivities
  beta:  [number, number];                    // amp sensitivities
  gamma: [number, number];                    // filter sensitivities
  Lmin: number; Lmax: number;
};

export type EvidenceRef = {
  status: 'experimental'|'multi-source'|'peer-reviewed';
  refs: { title: string; doiOrUrl: string; summary: string }[];
};

export type GaaPreset = {
  id?: string;
  label: string;
  params: GaaParams;
  polarity: GaaPolarity;
  evidence?: EvidenceRef;
};

export type BioSignals = {
  breath: number;    // -1..1
  hrv?: number;      // 0..1 normalized
  eegBandRatio?: number; // 0..1
};

export type GaaCoreFrame = {
  // normalized core outputs from the geometric engine (NOT audio nodes)
  ThN: number; PhiN: number; kN: number; tN: number;
  dThNdt: number;             // normalized angular speed
  az: number; el: number;     // radians for spatialization
  f0: number; A0: number; fc0: number; // bases
};

export type GaaOutputs = {
  fHz: number;
  amp: number;       // 0..1
  fcHz: number;
  azimuth: number;
  elevation: number;
  darkPhaseActive: boolean;
  weights: { dark: number; light: number };
};

// 👇 This is what React components should receive (NOT the engine class)
export type ShadowEngineState = {
  t: number; // seconds elapsed
  darkPhaseActive: boolean;
  weights: { dark: number; light: number };
  lastOutputs: GaaOutputs;
};

// Simple biofeedback for UI display
export type SimpleBiofeedbackMetrics = {
  heartRateVariability: number;
  brainwaveActivity: {
    alpha: number;
    beta: number;
    theta: number;
    delta: number;
    gamma: number;
  };
  breathingPattern: {
    rate: number;
    depth: number;
    coherence: number;
  };
  autonomicBalance: {
    sympathetic: number;
    parasympathetic: number;
  };
};