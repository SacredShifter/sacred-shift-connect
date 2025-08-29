import React, { useEffect, useState } from 'react';
import { Heart, Sparkles, Eye, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageResonanceIndicatorProps {
  messageId: string;
  content: string;
  authorId: string;
  sigils?: string[];
  resonanceLevel: number; // 0-1
  resonanceType: 'heart' | 'mind' | 'soul' | 'energy';
  participantReactions?: {
    userId: string;
    type: 'resonance' | 'wisdom' | 'truth' | 'love';
    intensity: number;
  }[];
  onResonanceClick?: (type: string) => void;
  className?: string;
}

export const MessageResonanceIndicator: React.FC<MessageResonanceIndicatorProps> = ({
  messageId,
  content,
  authorId,
  sigils = [],
  resonanceLevel,
  resonanceType,
  participantReactions = [],
  onResonanceClick,
  className
}) => {
  const [animatingReaction, setAnimatingReaction] = useState<string | null>(null);
  const [showResonanceField, setShowResonanceField] = useState(false);

  useEffect(() => {
    // Show resonance field for high-resonance messages
    if (resonanceLevel > 0.7) {
      setShowResonanceField(true);
    }
  }, [resonanceLevel]);

  const getResonanceColor = (level: number) => {
    if (level >= 0.8) return 'hsl(var(--purpose))';
    if (level >= 0.6) return 'hsl(var(--resonance))';
    if (level >= 0.4) return 'hsl(var(--alignment))';
    return 'hsl(var(--primary))';
  };

  const getResonanceIcon = (type: string) => {
    switch (type) {
      case 'heart': return Heart;
      case 'mind': return Eye;
      case 'soul': return Sparkles;
      case 'energy': return Zap;
      default: return Heart;
    }
  };

  const handleResonanceClick = (reactionType: string) => {
    setAnimatingReaction(reactionType);
    onResonanceClick?.(reactionType);
    
    setTimeout(() => setAnimatingReaction(null), 600);
  };

  const ResonanceIcon = getResonanceIcon(resonanceType);
  
  const resonanceReactions = [
    { type: 'resonance', icon: '🌊', label: 'Resonance', color: 'hsl(var(--resonance))' },
    { type: 'wisdom', icon: '💎', label: 'Wisdom', color: 'hsl(var(--purpose))' },
    { type: 'truth', icon: '✨', label: 'Truth', color: 'hsl(var(--alignment))' },
    { type: 'love', icon: '💜', label: 'Love', color: 'hsl(var(--resonance))' }
  ];

  const getTotalReactions = (reactionType: string) => {
    return participantReactions.filter(r => r.type === reactionType).length;
  };

  return (
    <div className={cn("relative", className)}>
      
      {/* Resonance Field Background */}
      {showResonanceField && (
        <div 
          className="absolute inset-0 rounded-2xl opacity-20 animate-pulse -z-10"
          style={{
            background: `radial-gradient(circle, ${getResonanceColor(resonanceLevel)}40 0%, transparent 70%)`,
            animation: `pulse ${2 + Math.random()}s infinite`
          }}
        />
      )}

      {/* Main Resonance Indicator */}
      <div className="flex items-center justify-between">
        
        {/* Resonance Level & Type */}
        <div className="flex items-center gap-2">
          <div 
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-300",
              resonanceLevel > 0.6 && "shadow-[0_0_8px_currentColor]"
            )}
            style={{ 
              backgroundColor: getResonanceColor(resonanceLevel) + '20',
              color: getResonanceColor(resonanceLevel),
              borderColor: getResonanceColor(resonanceLevel) + '40',
              border: `1px solid ${getResonanceColor(resonanceLevel)}40`
            }}
          >
            <ResonanceIcon className="w-3 h-3" />
            <span className="font-medium">
              {Math.round(resonanceLevel * 100)}%
            </span>
          </div>

          {/* Sigil Resonance */}
          {sigils.length > 0 && (
            <div className="flex items-center gap-1">
              {sigils.map((sigil, index) => (
                <span 
                  key={index}
                  className="text-sm animate-pulse"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {sigil}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Resonance Reactions */}
        <div className="flex items-center gap-1">
          {resonanceReactions.map((reaction) => {
            const count = getTotalReactions(reaction.type);
            const isAnimating = animatingReaction === reaction.type;
            
            return (
              <button
                key={reaction.type}
                onClick={() => handleResonanceClick(reaction.type)}
                className={cn(
                  "relative flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200",
                  "hover:scale-110 active:scale-95",
                  count > 0 
                    ? "bg-primary/20 text-primary shadow-[0_0_6px_hsl(var(--primary)/0.3)]" 
                    : "hover:bg-primary/10",
                  isAnimating && "animate-bounce"
                )}
                title={`${reaction.label} (${count})`}
              >
                <span className="text-sm">{reaction.icon}</span>
                {count > 0 && (
                  <span className="text-xs font-medium">{count}</span>
                )}
                
                {/* Ripple effect */}
                {isAnimating && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resonance Wisdom */}
      {resonanceLevel > 0.8 && (
        <div className="mt-2 text-xs text-center text-muted-foreground italic">
          This message creates waves of sacred resonance
        </div>
      )}
    </div>
  );
};