// Law of Transfer Feature Flags
// Controls the visibility and functionality of the Law of Transfer feature pack

export const flags = {
  LAW_OF_TRANSFER: import.meta.env.VITE_FEATURE_LAW_OF_TRANSFER === 'true'
} as const;

export type FeatureFlags = typeof flags;
