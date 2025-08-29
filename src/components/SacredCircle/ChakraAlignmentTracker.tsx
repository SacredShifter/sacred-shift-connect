import React from 'react';
import { cn } from '@/lib/utils';

interface ChakraData {
  name: string;
  color: string;
  symbol: string;
  alignment: number; // 0-1
  active: boolean;
}

interface ChakraAlignmentTrackerProps {
  participantChakras: ChakraData[];
  collectiveAlignment: number;
  className?: string;
}

const defaultChakras: ChakraData[] = [
  { name: 'Crown', color: 'hsl(280, 70%, 70%)', symbol: '🟣', alignment: 0.7, active: true },
  { name: 'Third Eye', color: 'hsl(260, 80%, 65%)', symbol: '🔵', alignment: 0.8, active: true },
  { name: 'Throat', color: 'hsl(200, 90%, 60%)', symbol: '🔷', alignment: 0.6, active: false },
  { name: 'Heart', color: 'hsl(120, 70%, 55%)', symbol: '💚', alignment: 0.9, active: true },
  { name: 'Solar Plexus', color: 'hsl(50, 90%, 60%)', symbol: '🟡', alignment: 0.5, active: false },
  { name: 'Sacral', color: 'hsl(25, 85%, 60%)', symbol: '🟠', alignment: 0.7, active: true },
  { name: 'Root', color: 'hsl(0, 70%, 55%)', symbol: '🔴', alignment: 0.8, active: true }
];

export const ChakraAlignmentTracker: React.FC<ChakraAlignmentTrackerProps> = ({
  participantChakras = defaultChakras,
  collectiveAlignment,
  className
}) => {
  const getAlignmentText = (level: number) => {
    if (level >= 0.8) return 'Transcendent';
    if (level >= 0.6) return 'Harmonious';
    if (level >= 0.4) return 'Emerging';
    return 'Seeking';
  };

  const getAlignmentColor = (level: number) => {
    if (level >= 0.8) return 'hsl(var(--purpose))';
    if (level >= 0.6) return 'hsl(var(--resonance))';
    if (level >= 0.4) return 'hsl(var(--alignment))';
    return 'hsl(var(--primary))';
  };

  return (
    <div className={cn("space-y-4", className)}>
      
      {/* Collective Alignment Header */}
      <div className="text-center space-y-2">
        <h3 className="text-sm font-medium">Collective Chakra Alignment</h3>
        <div className="flex items-center justify-center gap-2">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: getAlignmentColor(collectiveAlignment) }}
          />
          <span className="text-xs text-muted-foreground">
            {getAlignmentText(collectiveAlignment)} ({Math.round(collectiveAlignment * 100)}%)
          </span>
        </div>
      </div>

      {/* Individual Chakras */}
      <div className="space-y-3">
        {participantChakras.map((chakra, index) => (
          <div key={chakra.name} className="flex items-center gap-3">
            
            {/* Chakra Symbol */}
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300",
                chakra.active 
                  ? "shadow-[0_0_12px_currentColor] scale-110" 
                  : "opacity-50 scale-95"
              )}
              style={{ 
                backgroundColor: chakra.color + (chakra.active ? '40' : '20'),
                borderColor: chakra.color,
                border: `1px solid ${chakra.color}60`
              }}
            >
              <span className="filter drop-shadow-sm">{chakra.symbol}</span>
            </div>

            {/* Chakra Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{chakra.name}</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(chakra.alignment * 100)}%
                </span>
              </div>
              
              {/* Alignment Bar */}
              <div className="mt-1 h-2 bg-background/50 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${chakra.alignment * 100}%`,
                    backgroundColor: chakra.color,
                    boxShadow: chakra.active ? `0 0 8px ${chakra.color}60` : 'none'
                  }}
                />
              </div>
            </div>

            {/* Activation Status */}
            <div className="w-2 h-2 rounded-full">
              {chakra.active && (
                <div 
                  className="w-full h-full rounded-full animate-pulse"
                  style={{ backgroundColor: chakra.color }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sacred Guidance */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-background/60 to-background/30 border border-primary/20">
        <div className="text-center space-y-1">
          <div className="text-xs text-muted-foreground">Sacred Guidance</div>
          <p className="text-xs leading-relaxed">
            {collectiveAlignment >= 0.8 ? (
              "The circle radiates in perfect harmony. Your chakras dance in unified consciousness."
            ) : collectiveAlignment >= 0.6 ? (
              "Beautiful alignment flows through the circle. Continue this sacred work together."
            ) : collectiveAlignment >= 0.4 ? (
              "The alignment is growing stronger. Breathe together and feel the connection deepen."
            ) : (
              "Sacred potential awaits. Open your hearts and let the collective energy guide you."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};