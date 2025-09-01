import React from 'react';
import { motion } from 'framer-motion';
import { TarotCardData } from '@/modules/tarot/types';
import { cn } from '@/lib/utils';
import { TarotSigil } from './TarotSigil';

interface TarotCardProps {
  card: TarotCardData;
  isReversed?: boolean;
  className?: string;
}

export const TarotCard = ({ card, isReversed = false, className }: TarotCardProps) => {
  return (
    <motion.div
      className={cn(
        'w-[280px] h-[480px] bg-gray-900 rounded-2xl border-4 border-yellow-400/80 p-3 flex flex-col shadow-2xl shadow-black/50 overflow-hidden',
        className
      )}
      initial={{ rotate: isReversed ? 180 : 0 }}
      animate={{ rotate: isReversed ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      style={{ perspective: '1000px' }}
    >
      {/* Main content container */}
      <div className="flex-1 flex flex-col w-full h-full bg-black/20 rounded-lg">
        {/* As Above - Top Half */}
        <div
          className="flex-1 rounded-t-md p-3 flex flex-col items-center justify-center text-center relative overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${card.colors.above[0]}, ${card.colors.above[1]})` }}
        >
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
          <h3 className="font-serif font-bold text-xl text-black/70 drop-shadow-sm">{card.title}</h3>
          <ul className="text-xs text-black/60 mt-2">
            {card.upright.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Sigil Slot */}
        <div className="flex-shrink-0 h-20 w-full flex items-center justify-center bg-gradient-to-r from-transparent via-yellow-900/50 to-transparent my-2">
          <div className="h-20 w-20 rounded-full border-2 border-yellow-300/50 bg-gray-900/50 backdrop-blur-sm">
            <TarotSigil sigilType={card.sigil} />
          </div>
        </div>

        {/* So Below - Bottom Half */}
        <div
          className="flex-1 rounded-b-md p-3 flex flex-col items-center justify-center text-center relative overflow-hidden"
          style={{ background: `linear-gradient(200deg, ${card.colors.below[0]}, ${card.colors.below[1]})` }}
        >
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
          <div style={{ transform: 'rotate(180deg)' }} className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="font-serif font-bold text-xl text-white/70 drop-shadow-sm">{card.title}</h3>
            <ul className="text-xs text-white/60 mt-2">
              {card.reversed.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
