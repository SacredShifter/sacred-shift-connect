import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCompleteMicroPractice, type MicroPractice } from '@/hooks/useShadowPath';
import { Timer, Sparkles, Wind, Eye, Heart } from 'lucide-react';

interface MicroPracticeCardProps {
  practice: MicroPractice;
}

const practiceTypeIcons = {
  breath: Wind,
  journal: Eye,
  visual: Sparkles,
  movement: Heart
};

const practiceTypeColors = {
  breath: 'text-blue-500',
  journal: 'text-purple-500', 
  visual: 'text-yellow-500',
  movement: 'text-green-500'
};

export const MicroPracticeCard: React.FC<MicroPracticeCardProps> = ({ practice }) => {
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  
  const { mutate: completePractice, isPending } = useCompleteMicroPractice();

  const handleComplete = () => {
    completePractice(
      { practiceId: practice.id, notes: notes.trim() || undefined },
      {
        onSuccess: () => {
          setNotes('');
          setShowNotes(false);
        }
      }
    );
  };

  const Icon = practiceTypeIcons[practice.practice_type];
  const iconColor = practiceTypeColors[practice.practice_type];

  return (
    <Card className="border-truth/20 hover:border-resonance/40 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            <span className="text-truth text-base">{practice.practice_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{practice.estimated_seconds}s</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{practice.description}</p>
        
        <div className="bg-truth/5 p-3 rounded-lg">
          <p className="text-sm text-truth font-medium mb-1">Instructions:</p>
          <p className="text-sm text-muted-foreground">{practice.instructions}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {practice.practice_type}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Micro-Practice
          </Badge>
        </div>

        {showNotes && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-truth">Optional reflection:</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did this feel? What did you notice?"
              className="min-h-[60px]"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleComplete}
            disabled={isPending}
            className="flex-1 bg-resonance hover:bg-resonance/80"
          >
            {isPending ? 'Completing...' : 'Complete Practice'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setShowNotes(!showNotes)}
            className="px-3"
          >
            {showNotes ? 'Hide' : 'Add'} Notes
          </Button>
        </div>
        
        <div className="text-xs text-center text-muted-foreground bg-resonance/5 p-2 rounded">
          🌱 <strong>Gentle Path:</strong> Even the smallest practice creates sacred momentum
        </div>
      </CardContent>
    </Card>
  );
};