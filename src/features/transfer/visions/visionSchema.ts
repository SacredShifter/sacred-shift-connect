// Vision Schema
// Defines the phases and structure for vision morphology tracking

export const PHASES = ["circle", "stretched", "diamond", "diamond+core"] as const;
export type VisionPhase = typeof PHASES[number];

export const VISION_TAGS = [
  "transfer",
  "geometry", 
  "breath",
  "consciousness",
  "morphology",
  "sacred",
  "flow",
  "packets",
  "diamond",
  "circle",
  "core"
] as const;
export type VisionTag = typeof VISION_TAGS[number];

export interface VisionCaptureData {
  title: string;
  description: string;
  phaseFrom: VisionPhase;
  phaseTo: VisionPhase;
  hasInnerCore: boolean;
  fluidicMotion: boolean;
  notes?: string;
  tags: VisionTag[];
}

export const DEFAULT_VISION_CAPTURE: VisionCaptureData = {
  title: "",
  description: "",
  phaseFrom: "circle",
  phaseTo: "diamond",
  hasInnerCore: true,
  fluidicMotion: true,
  notes: "",
  tags: ["transfer", "geometry"]
};
