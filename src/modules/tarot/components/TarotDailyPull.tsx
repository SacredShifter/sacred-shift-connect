import React, { useState } from 'react';
import { useTarotDeck } from '@/modules/tarot/hooks/useTarotDeck';
import { TarotCard } from './TarotCard';
import { Button } from '@/components/ui/button';
import { BookPlus, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { TarotCardData } from '../types';
import { useTarotJournal } from '../hooks/useTarotJournal';

export const TarotDailyPull = () => {
  const { getRandomCard } = useTarotDeck();
  const { addLog, loading } = useTarotJournal();
  const [drawnCard, setDrawnCard] = useState<TarotCardData | null>(null);
  const [isReversed, setIsReversed] = useState(false);

  const handleDrawCard = () => {
    const card = getRandomCard();
    const reversed = Math.random() < 0.5;
    setDrawnCard(card);
    setIsReversed(reversed);
  };

  const handleLog = () => {
    if (drawnCard) {
      addLog({
        card_id: drawnCard.id,
        is_reversed: isReversed,
        interpretation: 'Daily Pull', // Add a default note
      });
    }
  };

  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        {drawnCard ? (
          <motion.div
            key="card-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-6"
          >
            <TarotCard card={drawnCard} isReversed={isReversed} />
            <div className="flex gap-4">
              <Button onClick={handleDrawCard} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Draw Again
              </Button>
              <Button onClick={handleLog} disabled={loading}>
                <BookPlus className="mr-2 h-4 w-4" />
                {loading ? 'Logging...' : 'Log to Mirror Journal'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="draw-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 min-h-[550px] justify-center"
          >
            <h2 className="text-2xl font-serif text-muted-foreground">
              Pull a card for daily resonance.
            </h2>
            <Button onClick={handleDrawCard} size="lg">
              Draw a Card
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
