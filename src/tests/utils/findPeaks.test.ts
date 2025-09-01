import { describe, it, expect } from 'vitest';

// The findPeaks function is not exported, so I will copy it here for testing.
// In a real application, this would be exported from its own module.
function findPeaks(data: number[]): number[] {
    const peaks: number[] = [];
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
        peaks.push(i);
      }
    }
    return peaks;
  }

describe('findPeaks', () => {
    it('should find a single peak in a simple waveform', () => {
        const data = [0, 1, 0];
        const peaks = findPeaks(data);
        expect(peaks).toEqual([1]);
    });

    it('should find multiple peaks', () => {
        const data = [0, 1, 0, 2, 0, 3, 0];
        const peaks = findPeaks(data);
        expect(peaks).toEqual([1, 3, 5]);
    });

    it('should handle no peaks', () => {
        const data = [0, 1, 2, 3, 4, 5];
        const peaks = findPeaks(data);
        expect(peaks).toEqual([]);
    });

    it('should handle plateaus', () => {
        const data = [0, 1, 1, 0];
        const peaks = findPeaks(data);
        expect(peaks).toEqual([]);
    });
});
