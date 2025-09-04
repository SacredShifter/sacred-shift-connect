import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Music, GraduationCap, Navigation } from 'lucide-react';
import { InstrumentMode } from './InstrumentChimeGarden';

interface InstrumentModeToggleProps {
  currentMode: InstrumentMode;
  onModeChange: (mode: InstrumentMode) => void;
  className?: string;
}

export const InstrumentModeToggle: React.FC<InstrumentModeToggleProps> = ({
  currentMode,
  onModeChange,
  className = ""
}) => {
  const modes: { 
    key: InstrumentMode; 
    label: string; 
    icon: React.ReactNode; 
    description: string;
    color: string;
  }[] = [
    {
      key: 'navigation',
      label: 'Navigate',
      icon: <Navigation className="w-4 h-4" />,
      description: 'Click bells to open modules',
      color: 'hsl(var(--primary))'
    },
    {
      key: 'learning',
      label: 'Learn',
      icon: <GraduationCap className="w-4 h-4" />,
      description: 'Progress-gated practice',
      color: 'hsl(var(--accent))'
    },
    {
      key: 'instrument',
      label: 'Play',
      icon: <Music className="w-4 h-4" />,
      description: 'Free musical expression',
      color: 'hsl(var(--secondary))'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className={`flex items-center space-x-2 ${className}`}
    >
      {/* Mode Toggle Buttons */}
      <div className="flex bg-background/20 backdrop-blur-sm rounded-xl p-1 border border-primary/20">
        {modes.map((mode, index) => (
          <Button
            key={mode.key}
            variant={currentMode === mode.key ? "default" : "ghost"}
            size="sm"
            onClick={() => onModeChange(mode.key)}
            className={`
              relative px-3 py-2 rounded-lg transition-all duration-300
              ${currentMode === mode.key 
                ? 'bg-primary/20 text-primary shadow-lg' 
                : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
              }
            `}
            style={{
              boxShadow: currentMode === mode.key 
                ? `0 0 20px ${mode.color}40` 
                : 'none'
            }}
          >
            <motion.div
              initial={false}
              animate={{
                scale: currentMode === mode.key ? 1.1 : 1,
                opacity: currentMode === mode.key ? 1 : 0.7
              }}
              transition={{ duration: 0.2 }}
            >
              {mode.icon}
            </motion.div>
            
            <span className="ml-2 font-medium">
              {mode.label}
            </span>
            
            {/* Active indicator */}
            {currentMode === mode.key && (
              <motion.div
                layoutId="activeMode"
                className="absolute inset-0 border-2 rounded-lg"
                style={{ borderColor: mode.color }}
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Button>
        ))}
      </div>

      {/* Current Mode Description */}
      <motion.div
        key={currentMode}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="hidden md:block bg-background/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/10"
      >
        <p className="text-sm text-muted-foreground">
          {modes.find(m => m.key === currentMode)?.description}
        </p>
      </motion.div>
    </motion.div>
  );
};