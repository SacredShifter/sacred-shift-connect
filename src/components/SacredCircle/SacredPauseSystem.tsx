import React, { useState, useEffect } from 'react';
import { Pause, Play, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SacredPauseSystemProps {
  isActive: boolean;
  onInitiate: () => void;
  onResume: () => void;
  initiatedBy?: string;
  duration?: number; // in seconds
  participantCount?: number;
}

export const SacredPauseSystem: React.FC<SacredPauseSystemProps> = ({
  isActive,
  onInitiate,
  onResume,
  initiatedBy,
  duration = 60,
  participantCount = 1
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [pausePhase, setPausePhase] = useState<'settling' | 'silence' | 'integration'>('settling');

  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(duration);
      setPausePhase('settling');
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        // Update phases based on time
        if (newTime > duration * 0.8) {
          setPausePhase('settling');
        } else if (newTime > duration * 0.2) {
          setPausePhase('silence');
        } else if (newTime > 0) {
          setPausePhase('integration');
        } else {
          onResume();
          return duration;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, duration, onResume]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseMessage = () => {
    switch (pausePhase) {
      case 'settling': return 'Settling into sacred silence...';
      case 'silence': return 'Resting in collective presence...';
      case 'integration': return 'Preparing to return with wisdom...';
    }
  };

  const getPhaseIcon = () => {
    switch (pausePhase) {
      case 'settling': return '🌊';
      case 'silence': return '🤫';
      case 'integration': return '✨';
    }
  };

  if (!isActive) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onInitiate}
        className={cn(
          "h-8 px-3 rounded-full text-xs transition-all duration-300",
          "hover:bg-primary/10 hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
        )}
        title="Initiate Sacred Pause for the circle"
      >
        <Pause className="h-3 w-3 mr-1" />
        Sacred Pause
      </Button>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-background/95 to-background/80 border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.2)] backdrop-blur-sm">
      <div className="p-6 text-center space-y-6">
        
        {/* Sacred Pause Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Pause className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-sacred">Sacred Pause</h3>
          </div>
          {initiatedBy && (
            <p className="text-xs text-muted-foreground">
              Initiated by {initiatedBy} • {participantCount} souls in silence
            </p>
          )}
        </div>

        {/* Sacred Timer Visualization */}
        <div className="relative h-32 flex items-center justify-center">
          <div 
            className={cn(
              "w-24 h-24 rounded-full transition-all duration-1000 ease-in-out",
              "bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30",
              "shadow-[0_0_20px_hsl(var(--primary)/0.3)]",
              pausePhase === 'settling' && "animate-pulse",
              pausePhase === 'integration' && "scale-110"
            )}
            style={{
              background: `conic-gradient(
                hsl(var(--primary)) ${((duration - timeRemaining) / duration) * 360}deg,
                hsl(var(--primary) / 0.1) ${((duration - timeRemaining) / duration) * 360}deg
              )`
            }}
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl mb-1">{getPhaseIcon()}</div>
            <div className="text-lg font-mono text-primary">{formatTime(timeRemaining)}</div>
          </div>
        </div>

        {/* Phase Message */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {getPhaseMessage()}
          </p>
          
          {/* Collective Presence Indicators */}
          <div className="flex justify-center gap-1">
            {Array.from({ length: participantCount }).map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-2000",
                  "bg-primary/40 shadow-[0_0_4px_hsl(var(--primary)/0.4)]",
                  pausePhase === 'silence' && "animate-pulse"
                )}
                style={{
                  animationDelay: `${i * 200}ms`
                }}
              />
            ))}
          </div>
        </div>

        {/* Sacred Actions */}
        <div className="flex justify-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onResume}
            className="h-8 px-4 rounded-full text-xs hover:bg-primary/10"
          >
            <Play className="h-3 w-3 mr-1" />
            Gently Resume
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimeRemaining(prev => Math.min(prev + 30, 300))}
            className="h-8 px-4 rounded-full text-xs hover:bg-primary/10"
            disabled={timeRemaining >= 300}
          >
            <Clock className="h-3 w-3 mr-1" />
            Extend (+30s)
          </Button>
        </div>
      </div>
    </Card>
  );
};