import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface KarmaReflection {
  id: string;
  content: string;
  mood_rating: number;
  energy_level: number;
  created_at: string;
  user_id: string;
}

interface KarmaJournalProps {
  userId: string;
}

export const KarmaJournal: React.FC<KarmaJournalProps> = ({ userId }) => {
  const [reflections, setReflections] = useState<KarmaReflection[]>([]);
  const [newReflection, setNewReflection] = useState('');
  const [moodRating, setMoodRating] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const saveReflection = () => {
    if (!newReflection.trim() || isLoading) return;

    const mockReflection: KarmaReflection = {
      id: Date.now().toString(),
      content: newReflection,
      mood_rating: moodRating,
      energy_level: energyLevel,
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    setReflections(prev => [mockReflection, ...prev]);
    setNewReflection('');
    setMoodRating(5);
    setEnergyLevel(5);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Karma Journal
          <Badge variant="secondary">{reflections.length} entries</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* New Entry Form */}
        <div className="space-y-4 p-4 bg-muted rounded">
          <Textarea
            value={newReflection}
            onChange={(e) => setNewReflection(e.target.value)}
            placeholder="Reflect on your day, experiences, or insights..."
            rows={3}
          />
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">Mood (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodRating}
                onChange={(e) => setMoodRating(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center">{moodRating}</div>
            </div>
            
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">Energy (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center">{energyLevel}</div>
            </div>
          </div>
          
          <Button onClick={saveReflection} disabled={isLoading || !newReflection.trim()}>
            Save Reflection
          </Button>
        </div>

        {/* Previous Reflections */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {reflections.map((reflection) => (
            <div key={reflection.id} className="p-3 border rounded">
              <div className="mb-2">{reflection.content}</div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Mood: {reflection.mood_rating}/10</span>
                <span>Energy: {reflection.energy_level}/10</span>
                <span>{new Date(reflection.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};