import { renderHook } from '@testing-library/react';
import { useTarotDeck } from './useTarotDeck';
import { describe, it, expect } from 'vitest';

describe('useTarotDeck', () => {
  it('should return the full deck of 78 cards', () => {
    const { result } = renderHook(() => useTarotDeck());
    expect(result.current.deck.length).toBe(78);
  });

  it('should get a card by its ID', () => {
    const { result } = renderHook(() => useTarotDeck());
    const card = result.current.getCardById(0);
    expect(card).toBeDefined();
    expect(card?.title).toBe('The Resonance');
  });

  it('should return undefined for a non-existent card ID', () => {
    const { result } = renderHook(() => useTarotDeck());
    const card = result.current.getCardById(999);
    expect(card).toBeUndefined();
  });

  it('should return a random card from the deck', () => {
    const { result } = renderHook(() => useTarotDeck());
    const randomCard = result.current.getRandomCard();
    expect(randomCard).toBeDefined();
    expect(result.current.deck).toContain(randomCard);
  });

  it('should search cards by title', () => {
    const { result } = renderHook(() => useTarotDeck());
    const searchResult = result.current.searchCards('Resonance');
    expect(searchResult.length).toBeGreaterThan(0);
    expect(searchResult[0].title).toBe('The Resonance');
  });

  it('should search cards by keyword', () => {
    const { result } = renderHook(() => useTarotDeck());
    const searchResult = result.current.searchCards('fool');
    expect(searchResult.length).toBe(1);
    expect(searchResult[0].title).toBe('The Resonance');
  });

  it('should return all cards for an empty search query', () => {
    const { result } = renderHook(() => useTarotDeck());
    const searchResult = result.current.searchCards('');
    expect(searchResult.length).toBe(78);
  });
});
