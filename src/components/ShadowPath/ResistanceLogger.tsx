import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLogResistance } from '@/hooks/useShadowPath';
import { Moon, Eye, Heart } from 'lucide-react';

export const ResistanceLogger: React.FC = () => {
  const [reason, setReason] = useState('');
  const [reflection, setReflection] = useState('');
  const [resistanceType, setResistanceType] = useState<'skip' | 'partial' | 'blocked'>('skip');
  
  const { mutate: logResistance, isPending } = useLogResistance();

  const handleSubmit = () => {
    if (!reason.trim() || !reflection.trim()) return;
    
    logResistance(
      { reason, reflection, resistanceType },
      {
        onSuccess: () => {
          setReason('');
          setReflection('');
          setResistanceType('skip');
        }
      }
    );
  };

  const resistanceTypeOptions = [
    { value: 'skip', label: 'Skipped Practice', icon: Moon },
    { value: 'partial', label: 'Partial Completion', icon: Eye },
    { value: 'blocked', label: 'Felt Blocked', icon: Heart }
  ];

  return (
    <Card className="border-truth/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-truth">
          <Moon className="h-5 w-5 text-resonance" />
          Shadow Work: Witness Your Resistance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Acknowledging resistance is sacred practice. Your awareness transforms shadow into wisdom.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-truth">Type of Resistance</label>
          <Select value={resistanceType} onValueChange={(value: any) => setResistanceType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {resistanceTypeOptions.map(({ value, label, icon: Icon }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-truth">What prevented your practice?</label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="I felt too tired... I got distracted by... Something felt too intense..."
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-truth">What does this resistance teach you?</label>
          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="This resistance shows me... I notice a pattern of... This feeling reminds me of..."
            className="min-h-[100px]"
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!reason.trim() || !reflection.trim() || isPending}
          className="w-full bg-resonance hover:bg-resonance/80"
        >
          {isPending ? 'Witnessing...' : 'Witness This Resistance'}
        </Button>
        
        <div className="text-xs text-center text-muted-foreground bg-truth/5 p-3 rounded-lg">
          💫 <strong>Shadow Path Wisdom:</strong> Resistance isn't failure - it's information. 
          Each acknowledgment deepens your self-awareness and moves you toward the Witness Seal.
        </div>
      </CardContent>
    </Card>
  );
};