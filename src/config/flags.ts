/**
 * Feature flags for GAA system components
 */
export const FLAGS = {
  tarotDeep5: true,
  cosmicVisV2: true,
  polarityCore: true,
  orchestra: true,
  embodiedBiofeedback: true,
  sessionMetrics: true,
  websocketConnectivity: true, // Enable sacred connectivity channels
  realtimeFeatures: true // Enable real-time consciousness synchronization
} as const;

export type FeatureFlag = keyof typeof FLAGS;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  return FLAGS[flag] ?? false;
};