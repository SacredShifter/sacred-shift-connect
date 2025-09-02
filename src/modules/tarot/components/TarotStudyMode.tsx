import React, { useState, useEffect } from 'react';
import { useTarotDeck } from '@/modules/tarot/hooks/useTarotDeck';
import { TarotCard } from './TarotCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookPlus, Repeat } from 'lucide-react';
import { TarotCardData } from '../types';
import { useTarotJournal } from '../hooks/useTarotJournal';
import { Textarea } from '@/components/ui/textarea';

export const TarotStudyMode = () => {
  const { getRandomCard } = useTarotDeck();
  const [selectedCard, setSelectedCard] = useState<TarotCardData | null>(null);
  const [interpretation, setInterpretation] = useState('');
  const { addLog, loading } = useTarotJournal();

  useEffect(() => {
    setSelectedCard(getRandomCard());
  }, [getRandomCard]);

  const handleNewCard = () => {
    setSelectedCard(getRandomCard());
    setInterpretation(''); // Reset interpretation for new card
  };

  const handleLog = () => {
    if (selectedCard) {
      addLog({
        card_id: selectedCard.id,
        is_reversed: false, // In study mode, we log the primary card form
        interpretation,
      });
    }
  };

  if (!selectedCard) {
    return <div>Loading study card...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-shrink-0 flex flex-col items-center gap-4">
        <TarotCard card={selectedCard} />
        <Button onClick={handleNewCard}>
          <Repeat className="mr-2 h-4 w-4" />
          Draw Another Card
        </Button>
      </div>
      <div className="flex-grow">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif">{selectedCard.title}</CardTitle>
            <CardDescription>{selectedCard.archetype}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg text-primary mb-2">As Above (Upright)</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {selectedCard.upright.map((meaning) => (
                    <li key={meaning}>{meaning}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg text-destructive mb-2">So Below (Reversed)</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {selectedCard.reversed.map((meaning) => (
                    <li key={meaning}>{meaning}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                    {selectedCard.keywords.map(keyword => (
                        <span key={keyword} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{keyword}</span>
                    ))}
                </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Your Interpretation</h3>
              <Textarea
                placeholder="Log your reflections on this card..."
                value={interpretation}
                onChange={(e) => setInterpretation(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleLog} disabled={loading} className="w-full">
              <BookPlus className="mr-2 h-4 w-4" />
              {loading ? 'Logging...' : 'Log to Mirror Journal'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
