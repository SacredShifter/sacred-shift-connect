import React, { useState } from 'react';
import { Heart, Eye, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SacredMessageVesselProps {
  message: {
    id: string;
    content: string;
    author?: {
      name?: string;
      avatar?: string;
    };
    created_at: string;
    chakra_tag?: string;
    frequency?: number;
    tone?: string;
    image_url?: string;
    has_image?: boolean;
    metadata?: {
      selectedSigils?: string[];
      messageMode?: 'sacred' | 'quantum' | 'classic';
    };
  };
  isOwn?: boolean;
  onReaction?: (messageId: string, reaction: string) => void;
}

export const SacredMessageVessel: React.FC<SacredMessageVesselProps> = ({
  message,
  isOwn = false,
  onReaction
}) => {
  const [showReactions, setShowReactions] = useState(false);
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getChakraColor = (chakraTag?: string) => {
    const colors = {
      root: 'hsl(var(--destructive))',
      sacral: 'hsl(30 100% 50%)',
      solar: 'hsl(var(--pulse))',
      heart: 'hsl(var(--resonance))',
      throat: 'hsl(var(--alignment))',
      third_eye: 'hsl(var(--primary))',
      crown: 'hsl(var(--purpose))',
    };
    return colors[chakraTag as keyof typeof colors] || 'hsl(var(--primary))';
  };

  const getModeIcon = (mode?: string) => {
    switch (mode) {
      case 'sacred': return Heart;
      case 'quantum': return Eye;
      default: return Sparkles;
    }
  };

  const vesselStyle = isOwn 
    ? "ml-12 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30" 
    : "mr-12 bg-gradient-to-br from-card/40 to-card/20 border-border/30";

  const ModeIcon = getModeIcon(message.metadata?.messageMode);

  return (
    <div className={cn("flex gap-3 mb-6", isOwn && "flex-row-reverse")}>
      {/* Avatar */}
      {!isOwn && (
        <Avatar className="h-8 w-8 border-2 border-primary/20">
          <AvatarImage src={message.author?.avatar} />
          <AvatarFallback 
            className="text-xs font-medium bg-gradient-to-br from-primary/30 to-primary/10"
          >
            {getInitials(message.author?.name || 'Sacred Soul')}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Vessel */}
      <div 
        className={cn(
          "sacred-card relative group cursor-pointer",
          "border rounded-3xl backdrop-blur-sm transition-all duration-500",
          "hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)]",
          vesselStyle
        )}
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}
      >
        {/* Sacred Sigils */}
        {message.metadata?.selectedSigils && message.metadata.selectedSigils.length > 0 && (
          <div className="flex gap-1 mb-2">
            {message.metadata.selectedSigils.map((sigil, index) => (
              <span 
                key={index}
                className="text-lg filter drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)] animate-pulse"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {sigil}
              </span>
            ))}
          </div>
        )}

        {/* Message Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-primary">
            {message.author?.name || 'Sacred Soul'}
          </span>
          
          {/* Mode Indicator */}
          <ModeIcon className="h-3 w-3 text-primary/60" />
          
          {/* Chakra Badge */}
          {message.chakra_tag && (
            <Badge 
              variant="outline" 
              className="text-xs px-2 py-0.5 border-0"
              style={{ 
                backgroundColor: `${getChakraColor(message.chakra_tag)}20`,
                color: getChakraColor(message.chakra_tag)
              }}
            >
              {message.chakra_tag}
            </Badge>
          )}
          
          <span className="text-xs text-muted-foreground ml-auto">
            {formatTime(message.created_at)}
          </span>
        </div>

        {/* Message Content */}
        <div className="space-y-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          
          {/* Image Display */}
          {message.has_image && message.image_url && (
            <div className="rounded-2xl overflow-hidden">
              <img 
                src={message.image_url} 
                alt="Shared vision"
                className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.image_url, '_blank')}
              />
            </div>
          )}
        </div>

        {/* Sacred Geometry Accent */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 opacity-20 group-hover:opacity-40 transition-opacity">
          <div className="w-full h-full border-2 border-primary rounded-full animate-spin-slow" />
          <div className="absolute inset-1 border border-primary rounded-full animate-pulse" />
        </div>

        {/* Reaction Overlay */}
        {showReactions && onReaction && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/95 border border-border/50 rounded-full px-3 py-1 flex gap-2 backdrop-blur-sm">
            {['💜', '🙏', '✨', '🌟'].map((reaction) => (
              <button
                key={reaction}
                onClick={() => onReaction(message.id, reaction)}
                className="hover:scale-125 transition-transform duration-200"
              >
                {reaction}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};