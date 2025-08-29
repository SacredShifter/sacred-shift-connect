import React from 'react';
import { Eye, Heart, Sparkles, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AIFacilitationPanelProps {
  isActive: boolean;
  currentFacilitator: 'aura' | 'valeion' | null;
  suggestion: string | null;
  resonanceReading: {
    level: number;
    quality: 'harmonious' | 'discordant' | 'transcendent' | 'seeking';
    message: string;
  } | null;
  onInvokeAura: () => void;
  onInvokeValeion: () => void;
  onDismissSuggestion: () => void;
  onToggleFacilitation: () => void;
}

export const AIFacilitationPanel: React.FC<AIFacilitationPanelProps> = ({
  isActive,
  currentFacilitator,
  suggestion,
  resonanceReading,
  onInvokeAura,
  onInvokeValeion,
  onDismissSuggestion,
  onToggleFacilitation
}) => {
  const getResonanceColor = (quality: string) => {
    switch (quality) {
      case 'transcendent': return 'hsl(var(--purpose))';
      case 'harmonious': return 'hsl(var(--resonance))';
      case 'seeking': return 'hsl(var(--alignment))';
      case 'discordant': return 'hsl(var(--warning))';
      default: return 'hsl(var(--primary))';
    }
  };

  const getResonanceIcon = (quality: string) => {
    switch (quality) {
      case 'transcendent': return '✨';
      case 'harmonious': return '🌊';
      case 'seeking': return '🔍';
      case 'discordant': return '⚡';
      default: return '💫';
    }
  };

  if (!isActive) {
    return (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFacilitation}
          className="h-8 px-3 rounded-full text-xs hover:bg-primary/10"
          title="Enable AI Facilitation"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          AI Guidance
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Resonance Reading */}
      {resonanceReading && (
        <Card className="p-4 bg-gradient-to-r from-background/90 to-background/70 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Collective Resonance</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">{getResonanceIcon(resonanceReading.quality)}</span>
              <span className="text-xs text-muted-foreground">{resonanceReading.level.toFixed(1)}</span>
            </div>
          </div>
          
          <Progress 
            value={resonanceReading.level * 100} 
            className="h-2 mb-2"
            style={{
              background: `linear-gradient(to right, ${getResonanceColor(resonanceReading.quality)}20, ${getResonanceColor(resonanceReading.quality)}40)`
            }}
          />
          
          <p className="text-xs text-muted-foreground">{resonanceReading.message}</p>
        </Card>
      )}

      {/* AI Suggestion */}
      {suggestion && currentFacilitator && (
        <Card className={cn(
          "p-4 border-2 transition-all duration-300",
          currentFacilitator === 'aura' 
            ? "border-resonance/40 bg-gradient-to-br from-resonance/10 to-resonance/5 shadow-[0_0_15px_hsl(var(--resonance)/0.2)]"
            : "border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 shadow-[0_0_15px_hsl(var(--primary)/0.2)]"
        )}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                currentFacilitator === 'aura' 
                  ? "bg-resonance/20 text-resonance" 
                  : "bg-primary/20 text-primary"
              )}>
                {currentFacilitator === 'aura' ? <Heart className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium capitalize">{currentFacilitator}</span>
                  <span className="text-xs text-muted-foreground">suggests</span>
                </div>
                <p className="text-sm leading-relaxed">{suggestion}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismissSuggestion}
              className="h-6 w-6 p-0 ml-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Card>
      )}

      {/* AI Facilitator Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onInvokeAura}
            disabled={!!suggestion}
            className={cn(
              "h-8 px-3 rounded-full text-xs transition-all duration-300",
              "hover:bg-resonance/10 hover:shadow-[0_0_8px_hsl(var(--resonance)/0.3)]"
            )}
            title="Invoke Aura for heart-centered guidance"
          >
            <Heart className="h-3 w-3 mr-1" />
            Aura
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onInvokeValeion}
            disabled={!!suggestion}
            className={cn(
              "h-8 px-3 rounded-full text-xs transition-all duration-300",
              "hover:bg-primary/10 hover:shadow-[0_0_8px_hsl(var(--primary)/0.3)]"
            )}
            title="Invoke Valeion for consciousness insights"
          >
            <Eye className="h-3 w-3 mr-1" />
            Valeion
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFacilitation}
          className="h-8 px-3 rounded-full text-xs hover:bg-muted/50"
          title="Disable AI Facilitation"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Disable
        </Button>
      </div>
    </div>
  );
};