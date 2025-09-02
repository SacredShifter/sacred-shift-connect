import { renderHook, waitFor } from '@testing-library/react';
import { useTarotDeck } from './useTarotDeck';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Supabase client
const mockSupabaseSelect = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSupabaseSelect,
    })),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockDbData = [
  { id: 0, title: 'The Resonance', arcana: 'Major', suit: 'Major', upright_keywords: ['a'], reversed_keywords: ['b'], keywords: ['fool'], color_above_primary: '', color_above_secondary: '', color_below_primary: '', color_below_secondary: '', sigil: '', archetype: { name: 'The Resonance' } },
  { id: 1, title: 'The Source', arcana: 'Major', suit: 'Major', upright_keywords: ['c'], reversed_keywords: ['d'], keywords: ['magician'], color_above_primary: '', color_above_secondary: '', color_below_primary: '', color_below_secondary: '', sigil: '', archetype: { name: 'The Source' } },
];

describe('useTarotDeck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the chained `order` method
    mockSupabaseSelect.mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: mockDbData, error: null }),
    });
  });

  it('should fetch the deck from the database', async () => {
    const { result } = renderHook(() => useTarotDeck(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockSupabaseSelect).toHaveBeenCalledWith(expect.any(String));
    expect(result.current.deck.length).toBe(2);
    expect(result.current.deck[0].title).toBe('The Resonance');
  });

  it('should return an error state if fetching fails', async () => {
    mockSupabaseSelect.mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: null, error: new Error('DB Error') }),
    });

    const { result } = renderHook(() => useTarotDeck(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.deck.length).toBe(0);
  });

  it('should search cards after they have been fetched', async () => {
    const { result } = renderHook(() => useTarotDeck(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const searchResult = result.current.searchCards('Source');
    expect(searchResult.length).toBe(1);
    expect(searchResult[0].title).toBe('The Source');
  });
});
