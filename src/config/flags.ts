/**
 * Feature flags for GAA system components
 */
export const FLAGS = {
  tarotDeep5: true,
  cosmicVisV2: true,
  polarityCore: true,
  orchestra: true,
  embodiedBiofeedback: true,
  sessionMetrics: true
} as const;

export type FeatureFlag = keyof typeof FLAGS;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  return FLAGS[flag] ?? false;
};