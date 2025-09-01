import React, { useState, useEffect } from 'react';
import { Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CollectiveBreathingSyncProps {
  participants: number;
  onComplete: () => void;
  onSkip?: () => void;
}

export const CollectiveBreathingSync: React.FC<CollectiveBreathingSyncProps> = ({
  participants,
  onComplete,
  onSkip
}) => {
  const [phase, setPhase] = useState<'prepare' | 'breathing' | 'complete'>('prepare');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [participantSync, setParticipantSync] = useState<number>(0);

  useEffect(() => {
    if (phase !== 'breathing') return;

    const breathingCycle = () => {
      const phases = ['inhale', 'hold', 'exhale', 'pause'] as const;
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        setBreathPhase(phases[currentIndex]);
        currentIndex = (currentIndex + 1) % phases.length;
        
        if (phases[currentIndex] === 'inhale') {
          setCycleCount(prev => {
            const newCount = prev + 1;
            // Simulate participants joining sync
            setParticipantSync(Math.min(participants, newCount + 1));
            
            if (newCount >= 5) {
              clearInterval(interval);
              setTimeout(() => setPhase('complete'), 2000);
            }
            return newCount;
          });
        }
      }, 4000);

      return interval;
    };

    const interval = breathingCycle();
    return () => clearInterval(interval);
  }, [phase, participants]);

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe in together...';
      case 'hold': return 'Hold in unity...';
      case 'exhale': return 'Release as one...';
      case 'pause': return 'Rest in collective stillness...';
    }
  };

  const getBreathScale = () => {
    switch (breathPhase) {
      case 'inhale': return 'scale-125';
      case 'hold': return 'scale-125';
      case 'exhale': return 'scale-90';
      case 'pause': return 'scale-100';
    }
  };

  const handleStartSync = () => {
    setPhase('breathing');
    setParticipantSync(1);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg p-8 bg-gradient-to-br from-background/90 to-background/60 border-primary/30 shadow-[0_0_40px_hsl(var(--primary)/0.3)]">
        
        {/* Preparation Phase */}
        {phase === 'prepare' && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Heart className="h-12 w-12 text-primary mx-auto animate-pulse" />
              <h2 className="text-2xl font-sacred">Collective Breathing Sync</h2>
              <p className="text-muted-foreground">
                {participants} souls preparing to breathe as one sacred vessel
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Together we will:</p>
                <ul className="list-none space-y-1">
                  <li>✨ Synchronize our breath rhythms</li>
                  <li>🌊 Align our collective energy</li>
                  <li>💫 Create sacred coherence</li>
                </ul>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button onClick={handleStartSync} className="sacred-button">
                  Begin Sacred Sync
                  <Users className="ml-2 h-4 w-4" />
                </Button>
                {onSkip && (
                  <Button variant="ghost" onClick={onSkip} className="text-xs">
                    Continue without sync
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Breathing Phase */}
        {phase === 'breathing' && (
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Breathing Together</h3>
              <p className="text-sm text-muted-foreground">
                {getBreathInstruction()}
              </p>
            </div>

            {/* Sacred Breathing Visualization */}
            <div className="relative h-40 flex items-center justify-center">
              <div 
                className={cn(
                  "w-32 h-32 rounded-full transition-all duration-4000 ease-in-out",
                  "bg-gradient-to-br from-primary/40 to-primary/10 border-3 border-primary/50",
                  "shadow-[0_0_40px_hsl(var(--primary)/0.4)]",
                  getBreathScale()
                )}
              />
              
              {/* Collective particles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <span className="text-3xl animate-pulse">🌸</span>
                  {Array.from({ length: participantSync }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-ping"
                      style={{
                        top: `${Math.sin((i * 2 * Math.PI) / participantSync) * 20 + 20}px`,
                        left: `${Math.cos((i * 2 * Math.PI) / participantSync) * 20 + 20}px`,
                      }}
                    >
                      <div className="w-2 h-2 bg-primary/60 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sync Status */}
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      i < cycleCount 
                        ? "bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]" 
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Cycle {cycleCount} of 5</p>
                <p>{participantSync} of {participants} souls synchronized</p>
              </div>
            </div>
          </div>
        )}

        {/* Complete Phase */}
        {phase === 'complete' && (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center border-2 border-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-medium">Sacred Coherence Achieved</h3>
              <p className="text-sm text-muted-foreground">
                Your collective breath creates a unified field of consciousness
              </p>
            </div>

            <Button onClick={handleComplete} className="sacred-button">
              Enter Sacred Space
              <Heart className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};