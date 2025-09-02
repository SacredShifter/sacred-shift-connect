import { renderHook, act } from '@testing-library/react';
import { useTarotJournal } from './useTarotJournal';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('useTarotJournal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully add a log by invoking the edge function', async () => {
    vi.mocked(supabase.functions.invoke).mockResolvedValue({ data: { success: true }, error: null });

    const { result } = renderHook(() => useTarotJournal());

    await act(async () => {
      await result.current.addLog({ card_id: 1, is_reversed: false, interpretation: 'Test' });
    });

    expect(supabase.functions.invoke).toHaveBeenCalledWith('log-tarot-pull', {
      body: { card_id: 1, is_reversed: false, interpretation: 'Test' },
    });
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Success',
      description: 'Your tarot pull has been logged to your Mirror Journal.',
    });
    expect(result.current.loading).toBe(false);
  });

  it('should show an error toast if the edge function invoke fails', async () => {
    const mockError = new Error('Edge function failed');
    vi.mocked(supabase.functions.invoke).mockResolvedValue({ data: null, error: mockError });

    const { result } = renderHook(() => useTarotJournal());

    await act(async () => {
      await result.current.addLog({ card_id: 1, is_reversed: true });
    });

    expect(mockToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Error saving log',
      description: mockError.message,
    });
    expect(result.current.loading).toBe(false);
  });

  it('should show an error toast for an authorization error', async () => {
    const mockError = { message: 'Authentication required' };
    vi.mocked(supabase.functions.invoke).mockResolvedValue({ data: null, error: mockError });

    const { result } = renderHook(() => useTarotJournal());

    await act(async () => {
      await result.current.addLog({ card_id: 1, is_reversed: false });
    });

    expect(mockToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Error saving log',
      description: 'Authentication required',
    });
  });
});
