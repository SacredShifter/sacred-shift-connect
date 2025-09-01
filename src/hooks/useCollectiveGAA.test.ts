import { renderHook, act } from '@testing-library/react';
import { useCollectiveGAA } from './useCollectiveGAA';
import * as Tone from 'tone';
import { vi, describe, it, expect } from 'vitest';

// Mock Tone.js Transport
const mockTransport = {
  bpm: {
    value: 120,
    rampTo: vi.fn(),
  },
};

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(),
      })),
      send: vi.fn(),
    })),
    removeChannel: vi.fn(),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: { serverTime: Date.now() } }),
    },
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
  },
}));

describe('useCollectiveGAA', () => {
  it('should adjust bpm to correct for clock drift', () => {
    const { result } = renderHook(() => useCollectiveGAA(mockTransport as any));

    act(() => {
      // Simulate a message from the leader with a timestamp that is 100ms in the past
      result.current.applyPLLDriftCorrection(Date.now() - 100);
    });

    expect(mockTransport.bpm.rampTo).toHaveBeenCalled();
    const newBpm = mockTransport.bpm.rampTo.mock.calls[0][0];
    expect(newBpm).toBeGreaterThan(120); // Should speed up to catch up
  });
});
