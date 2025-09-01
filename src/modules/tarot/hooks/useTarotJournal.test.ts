import { renderHook, act } from '@testing-library/react';
import { useTarotJournal } from './useTarotJournal';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

const mockSupabaseInsert = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mockSupabaseInsert,
    })),
  },
}));

const mockUseAuth = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));


describe('useTarotJournal', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
  });

  it('should successfully add a log when user is authenticated', async () => {
    mockUseAuth.mockReturnValue({ user: { id: 'test-user-id' } });
    mockSupabaseInsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useTarotJournal());

    await act(async () => {
      await result.current.addLog({ card_id: 1, is_reversed: false, interpretation: 'Test' });
    });

    expect(mockSupabaseInsert).toHaveBeenCalledWith({
      user_id: 'test-user-id',
      card_id: 1,
      is_reversed: false,
      interpretation: 'Test',
    });
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Success',
      description: 'Your tarot pull has been logged to your Mirror Journal.',
    });
    expect(result.current.loading).toBe(false);
  });

  it('should show an auth error toast if user is not logged in', async () => {
    mockUseAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useTarotJournal());

    await act(async () => {
      await result.current.addLog({ card_id: 1, is_reversed: false });
    });

    expect(mockSupabaseInsert).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Authentication Error',
      description: 'You must be logged in to save a journal entry.',
    });
  });

  it('should show an error toast if supabase insert fails', async () => {
    mockUseAuth.mockReturnValue({ user: { id: 'test-user-id' } });
    const mockError = new Error('Supabase insert failed');
    mockSupabaseInsert.mockResolvedValue({ error: mockError });

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
});
