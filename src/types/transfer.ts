// Law of Transfer Types
// Defines the data structures for the Law of Transfer feature pack

export type Vision = {
  id: string;
  user_id: string;
  title?: string | null;
  description?: string | null;
  tags: string[];
  created_at: string;
};

export type VisionMorph = {
  id: string;
  vision_id: string;
  phase_from: string;
  phase_to: string;
  notes?: string | null;
  has_inner_core: boolean;
  fluidic_motion: boolean;
  created_at: string;
};

export type BreathSession = {
  id: string;
  user_id: string;
  started_at: string;
  duration_seconds?: number | null;
  packets_visualised: boolean;
  reflections?: string | null;
};

export type TransferEvent = {
  id: string;
  user_id?: string | null;
  kind: string;
  props: Record<string, unknown>;
  created_at: string;
};

export type CodexPrinciple = {
  id: string;
  slug: string;
  title: string;
  body_md: string;
  created_at: string;
  updated_at: string;
};

// Vision morph phases
export const PHASES = ["circle", "stretched", "diamond", "diamond+core"] as const;
export type VisionPhase = typeof PHASES[number];
