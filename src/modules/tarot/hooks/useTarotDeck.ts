import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TarotCardData } from '@/modules/tarot/types';

// Function to fetch and transform card data
const fetchTarotDeck = async (): Promise<TarotCardData[]> => {
  const { data, error } = await supabase
    .from('tarot_cards')
    .select(`
      id,
      title,
      arcana,
      suit,
      upright_keywords,
      reversed_keywords,
      keywords,
      color_above_primary,
      color_above_secondary,
      color_below_primary,
      color_below_secondary,
      sigil,
      archetype:tarot_archetypes (name)
    `)
    .order('id');

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the frontend's TarotCardData interface
  return data.map((card: any) => ({
    id: card.id,
    title: card.title,
    arcana: card.arcana,
    suit: card.suit,
    archetype: card.archetype.name,
    upright: card.upright_keywords,
    reversed: card.reversed_keywords,
    keywords: card.keywords,
    colors: {
      above: [card.color_above_primary, card.color_above_secondary],
      below: [card.color_below_primary, card.color_below_secondary],
    },
    sigil: card.sigil,
  }));
};


export const useTarotDeck = () => {
  const { data: deck = [], isLoading, isError } = useQuery<TarotCardData[]>({
    queryKey: ['tarotDeck'],
    queryFn: fetchTarotDeck,
  });

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

  const getRandomCard = (): TarotCardData | undefined => {
    if (deck.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck[randomIndex];
  };

  return {
    deck,
    isLoading,
    isError,
    getCardById,
    getCardsBySuit,
    getCardsByArcana,
    searchCards,
    getRandomCard,
  };
};
