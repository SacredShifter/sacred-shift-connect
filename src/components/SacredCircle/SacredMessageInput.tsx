import React, { useState, useRef } from 'react';
import { Send, Image, Sparkles, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SacredMessageInputProps {
  onSendMessage: (content: string, options: {
    messageMode: 'sacred' | 'quantum' | 'classic';
    selectedSigils: string[];
    attachedFiles: File[];
  }) => void;
  onSacredPause?: () => void;
  disabled?: boolean;
}

export const SacredMessageInput: React.FC<SacredMessageInputProps> = ({
  onSendMessage,
  onSacredPause,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [messageMode, setMessageMode] = useState<'sacred' | 'quantum' | 'classic'>('sacred');
  const [selectedSigils, setSelectedSigils] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showSigilSelector, setShowSigilSelector] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sacredSigils = [
    '☽', '☾', '☯', '🔯', '✡', '⚡', '🌟', '✨', '🔮', '💫', 
    '🧿', '☀', '🌙', '⭐', '🌠', '🔥', '💎', '🗿', '🌺', '🍀',
    '🦋', '🕊', '🌈', '🌀', '💜', '💙', '💚', '❤', '🤍', '🖤'
  ];

  const messageModes = [
    { 
      id: 'sacred' as const, 
      name: 'Sacred', 
      icon: Heart, 
      color: 'hsl(var(--resonance))',
      description: 'Heart-centered communion'
    },
    { 
      id: 'quantum' as const, 
      name: 'Quantum', 
      icon: Eye, 
      color: 'hsl(var(--primary))',
      description: 'Consciousness expansion'
    },
    { 
      id: 'classic' as const, 
      name: 'Classic', 
      icon: Sparkles, 
      color: 'hsl(var(--alignment))',
      description: 'Traditional sharing'
    }
  ];

  const handleSendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed && attachedFiles.length === 0) return;

    onSendMessage(trimmed, {
      messageMode,
      selectedSigils,
      attachedFiles
    });

    // Reset form
    setMessage('');
    setSelectedSigils([]);
    setAttachedFiles([]);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSigilSelect = (sigil: string) => {
    if (selectedSigils.includes(sigil)) {
      setSelectedSigils(selectedSigils.filter(s => s !== sigil));
    } else if (selectedSigils.length < 3) {
      setSelectedSigils([...selectedSigils, sigil]);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles(Array.from(files));
    }
  };

  const currentMode = messageModes.find(mode => mode.id === messageMode)!;
  const ModeIcon = currentMode.icon;

  return (
    <div className="border-t border-border/30 bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-sm">
      {/* Mode Selector */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-border/20">
        <span className="text-xs text-muted-foreground">Sacred Mode:</span>
        {messageModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = messageMode === mode.id;
          
          return (
            <Button
              key={mode.id}
              variant="ghost"
              size="sm"
              onClick={() => setMessageMode(mode.id)}
              className={cn(
                "h-8 px-3 rounded-full transition-all duration-300",
                isActive 
                  ? "bg-primary/20 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.3)]" 
                  : "hover:bg-primary/10"
              )}
              title={mode.description}
            >
              <Icon className="h-3 w-3 mr-1" />
              <span className="text-xs">{mode.name}</span>
            </Button>
          );
        })}
        
        {/* Sacred Pause Button */}
        {onSacredPause && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSacredPause}
            className="ml-auto h-8 px-3 rounded-full text-xs hover:bg-primary/10"
            title="Initiate Sacred Pause for the circle"
          >
            🤫 Sacred Pause
          </Button>
        )}
      </div>

      {/* Selected Sigils Display */}
      {selectedSigils.length > 0 && (
        <div className="px-6 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sacred Sigils:</span>
            {selectedSigils.map((sigil, index) => (
              <Badge 
                key={index}
                variant="outline"
                className="h-6 w-6 p-0 flex items-center justify-center cursor-pointer hover:bg-destructive/20"
                onClick={() => handleSigilSelect(sigil)}
              >
                {sigil}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Sigil Selector */}
      {showSigilSelector && (
        <div className="px-6 py-3 border-b border-border/20">
          <div className="grid grid-cols-10 gap-2">
            {sacredSigils.map((sigil) => (
              <button
                key={sigil}
                onClick={() => handleSigilSelect(sigil)}
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center text-lg transition-all duration-200",
                  selectedSigils.includes(sigil)
                    ? "bg-primary/30 shadow-[0_0_8px_hsl(var(--primary)/0.4)] scale-110"
                    : "hover:bg-primary/10 hover:scale-105"
                )}
                disabled={!selectedSigils.includes(sigil) && selectedSigils.length >= 3}
              >
                {sigil}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-end gap-3 p-6">
        <div className="flex-1 space-y-2">
          <div className="relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Share your ${currentMode.name.toLowerCase()} truth...`}
              disabled={disabled}
              className={cn(
                "sacred-input pr-12 min-h-[2.5rem] resize-none",
                "focus:shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
              )}
              style={{
                borderColor: currentMode.color + '40',
                boxShadow: `0 0 0 1px ${currentMode.color}20`
              }}
            />
            
            {/* Mode Indicator in Input */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <ModeIcon 
                className="h-4 w-4 opacity-50" 
                style={{ color: currentMode.color }}
              />
            </div>
          </div>

          {/* Attached Files Display */}
          {attachedFiles.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Attached:</span>
              {attachedFiles.map((file, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {file.name}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAttachedFiles([])}
                className="h-6 w-6 p-0 text-xs"
              >
                ×
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSigilSelector(!showSigilSelector)}
            className={cn(
              "h-10 w-10 p-0 rounded-full transition-all duration-300",
              showSigilSelector && "bg-primary/20 shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
            )}
            title="Select Sacred Sigils"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-10 w-10 p-0 rounded-full"
            title="Attach Image"
          >
            <Image className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={disabled || (!message.trim() && attachedFiles.length === 0)}
            className={cn(
              "h-10 w-10 p-0 rounded-full sacred-button",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            title="Send Message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};