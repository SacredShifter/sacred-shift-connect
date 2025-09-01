import { useMemo } from 'react';
import { TAROT_DECK } from '@/data/tarotDeck';
import { TarotCardData } from '@/modules/tarot/types';

export const useTarotDeck = () => {
  const deck = useMemo(() => TAROT_DECK, []);

  const getCardById = (id: number): TarotCardData | undefined => {
    return deck.find((card) => card.id === id);
  };

  const getCardsBySuit = (suit: TarotCardData['suit']) => {
    return deck.filter((card) => card.suit === suit);
  };

  const getCardsByArcana = (arcana: TarotCardData['arcana']) => {
    return deck.filter((card) => card.arcana === arcana);
  };

  const searchCards = (query: string) => {
    if (!query) {
      return deck;
    }
    const lowerCaseQuery = query.toLowerCase();
    return deck.filter(
      (card) =>
        card.title.toLowerCase().includes(lowerCaseQuery) ||
        card.archetype.toLowerCase().includes(lowerCaseQuery) ||
        card.keywords.some((keyword) => keyword.toLowerCase().includes(lowerCaseQuery))
    );
  };

  const getRandomCard = (): TarotCardData => {
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck[randomIndex];
  };

  return {
    deck,
    getCardById,
    getCardsBySuit,
    getCardsByArcana,
    searchCards,
    getRandomCard,
  };
};
