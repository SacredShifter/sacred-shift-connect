import React, { useState, useEffect, useMemo } from 'react';
import { useTarotDeck } from '@/modules/tarot/hooks/useTarotDeck';
import { TarotCard } from './TarotCard';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export const TarotDeckBrowser = () => {
  const { deck, searchCards } = useTarotDeck();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredDeck = useMemo(() => {
    if (!debouncedSearchTerm) return deck;
    return searchCards(debouncedSearchTerm);
  }, [debouncedSearchTerm, deck, searchCards]);

  return (
    <div>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by name, archetype, or keyword..."
          className="max-w-md mx-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence>
          {filteredDeck.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <TarotCard card={card} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
