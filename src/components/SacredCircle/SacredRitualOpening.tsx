import React, { useState, useEffect } from 'react';
import { Heart, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SacredRitualOpeningProps {
  circleName: string;
  onComplete: (intention: string, selectedSigil: string) => void;
  participantCount?: number;
}

export const SacredRitualOpening: React.FC<SacredRitualOpeningProps> = ({
  circleName,
  onComplete,
  participantCount = 1
}) => {
  const [phase, setPhase] = useState<'breath' | 'intention' | 'sigil'>('breath');
  const [breathCount, setBreathCount] = useState(0);
  const [intention, setIntention] = useState('');
  const [selectedSigil, setSelectedSigil] = useState('');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');

  const sacredSigils = [
    { symbol: '☽', name: 'Intuitive Wisdom', color: 'hsl(var(--primary))' },
    { symbol: '☀', name: 'Divine Light', color: 'hsl(var(--pulse))' },
    { symbol: '🔯', name: 'Sacred Union', color: 'hsl(var(--resonance))' },
    { symbol: '☯', name: 'Perfect Balance', color: 'hsl(var(--alignment))' },
    { symbol: '🌟', name: 'Cosmic Connection', color: 'hsl(var(--purpose))' },
    { symbol: '💜', name: 'Heart Wisdom', color: 'hsl(var(--resonance))' },
    { symbol: '🧿', name: 'Protection & Clarity', color: 'hsl(var(--alignment))' },
    { symbol: '🔮', name: 'Mystical Sight', color: 'hsl(var(--primary))' }
  ];

  // Breathing rhythm: 4-4-4-4 pattern (inhale-hold-exhale-pause)
  useEffect(() => {
    if (phase !== 'breath') return;

    const breathingCycle = () => {
      const phases = ['inhale', 'hold', 'exhale', 'pause'] as const;
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        setBreathPhase(phases[currentIndex]);
        currentIndex = (currentIndex + 1) % phases.length;
        
        if (phases[currentIndex] === 'inhale') {
          setBreathCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
              clearInterval(interval);
              setTimeout(() => setPhase('intention'), 1000);
            }
            return newCount;
          });
        }
      }, 4000); // 4 seconds per phase

      return interval;
    };

    const interval = breathingCycle();
    return () => clearInterval(interval);
  }, [phase]);

  const handleComplete = () => {
    if (intention.trim() && selectedSigil) {
      onComplete(intention.trim(), selectedSigil);
    }
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe in deeply...';
      case 'hold': return 'Hold with awareness...';
      case 'exhale': return 'Release completely...';
      case 'pause': return 'Rest in stillness...';
    }
  };

  const getBreathScale = () => {
    switch (breathPhase) {
      case 'inhale': return 'scale-110';
      case 'hold': return 'scale-110';
      case 'exhale': return 'scale-90';
      case 'pause': return 'scale-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg p-8 bg-gradient-to-br from-background/90 to-background/60 border-primary/30 shadow-[0_0_40px_hsl(var(--primary)/0.2)]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-sacred mb-2">Sacred Opening</h2>
          <p className="text-muted-foreground">
            Welcome to <span className="text-primary font-medium">{circleName}</span>
          </p>
          {participantCount > 1 && (
            <p className="text-xs text-muted-foreground mt-1">
              {participantCount} souls gathering in sacred communion
            </p>
          )}
        </div>

        {/* Breathing Phase */}
        {phase === 'breath' && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <p className="text-lg font-medium">
                Let us align our breath and presence
              </p>
              <p className="text-sm text-muted-foreground">
                {getBreathInstruction()}
              </p>
            </div>

            {/* Breathing Visualization */}
            <div className="relative h-32 flex items-center justify-center">
              <div 
                className={cn(
                  "w-24 h-24 rounded-full transition-all duration-4000 ease-in-out",
                  "bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/40",
                  "shadow-[0_0_30px_hsl(var(--primary)/0.3)]",
                  getBreathScale()
                )}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">🌸</span>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    i <= breathCount 
                      ? "bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]" 
                      : "bg-muted"
                  )}
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              Breath {breathCount} of 3
            </p>
          </div>
        )}

        {/* Intention Phase */}
        {phase === 'intention' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Heart className="h-8 w-8 text-primary mx-auto" />
              <h3 className="text-xl font-medium">Set Your Sacred Intention</h3>
              <p className="text-sm text-muted-foreground">
                What do you wish to cultivate in this sacred space?
              </p>
            </div>

            <div className="space-y-4">
              <Input
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="I intend to..."
                className="sacred-input text-center"
                maxLength={100}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && intention.trim()) {
                    setPhase('sigil');
                  }
                }}
              />
              
              <div className="flex justify-center">
                <Button
                  onClick={() => setPhase('sigil')}
                  disabled={!intention.trim()}
                  className="sacred-button"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Sigil Selection Phase */}
        {phase === 'sigil' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="h-8 w-8 text-primary mx-auto" />
              <h3 className="text-xl font-medium">Choose Your Sacred Sigil</h3>
              <p className="text-sm text-muted-foreground">
                Select a symbol that resonates with your intention
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {sacredSigils.map((sigil) => (
                <button
                  key={sigil.symbol}
                  onClick={() => setSelectedSigil(sigil.symbol)}
                  className={cn(
                    "aspect-square rounded-2xl border-2 transition-all duration-300",
                    "flex flex-col items-center justify-center p-3 group",
                    selectedSigil === sigil.symbol
                      ? "border-primary bg-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.4)] scale-105"
                      : "border-border/30 hover:border-primary/50 hover:bg-primary/10 hover:scale-105"
                  )}
                  title={sigil.name}
                >
                  <span className="text-2xl mb-1">{sigil.symbol}</span>
                  <span className="text-xs text-center leading-tight opacity-70 group-hover:opacity-100">
                    {sigil.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleComplete}
                disabled={!selectedSigil}
                className="sacred-button"
              >
                Enter Sacred Circle
                <Users className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};