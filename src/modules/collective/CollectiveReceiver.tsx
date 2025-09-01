export interface CollectiveField {
  resonance: number;    // 0..1 collective resonance strength
  polarity: number;     // -1..1 light/dark balance
  coherence: number;    // 0..1 phase synchronization
}

// Placeholder implementation
export const useCollectiveReceiver = () => {
  return {
    collectiveField: null as CollectiveField | null,
    isConnected: false
  };
};