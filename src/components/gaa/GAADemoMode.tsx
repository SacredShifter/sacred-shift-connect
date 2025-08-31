/**
 * GAA Demo Mode - Automatic cycling through archetypes for presentations
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Star,
  Moon,
  Sun,
  Zap,
  BookOpen,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotTradition } from '@/types/gaa-polarity';

interface GAADemoModeProps {
  isActive: boolean;
  onToggle: () => void;
  onArchetypeChange: (archetypeId: string) => void;
  onTraditionChange: (tradition: TarotTradition) => void;
  className?: string;
}

const DEMO_SEQUENCE = [
  { id: 'sun', name: 'Sun XIX', duration: 45, icon: Sun, description: 'Joy & illumination' },
  { id: 'moon', name: 'Moon XVIII', duration: 60, icon: Moon, description: 'Shadow integration' },
  { id: 'tower', name: 'Tower XVI', duration: 30, icon: Zap, description: 'Breakthrough energy' },
  { id: 'devil', name: 'Devil XV', duration: 40, icon: Shield, description: 'Breaking chains' },
  { id: 'death', name: 'Death XIII', duration: 50, icon: BookOpen, description: 'Transformation' }
];

const TRADITIONS: TarotTradition[] = ['rws', 'marseille', 'thoth', 'etteilla'];

export const GAADemoMode: React.FC<GAADemoModeProps> = ({
  isActive,
  onToggle,
  onArchetypeChange,
  onTraditionChange,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [traditionIndex, setTraditionIndex] = useState(0);

  const currentArchetype = DEMO_SEQUENCE[currentIndex];

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (currentArchetype.duration * 10); // Update every 100ms
        const newProgress = prev + increment;

        if (newProgress >= 100) {
          // Move to next archetype
          const nextIndex = (currentIndex + 1) % DEMO_SEQUENCE.length;
          const nextTradition = (traditionIndex + 1) % TRADITIONS.length;
          
          setCurrentIndex(nextIndex);
          setTraditionIndex(nextTradition);
          onArchetypeChange(DEMO_SEQUENCE[nextIndex].id);
          onTraditionChange(TRADITIONS[nextTradition]);
          
          return 0;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, currentIndex, traditionIndex, currentArchetype.duration, onArchetypeChange, onTraditionChange]);

  const handleSkip = () => {
    const nextIndex = (currentIndex + 1) % DEMO_SEQUENCE.length;
    const nextTradition = (traditionIndex + 1) % TRADITIONS.length;
    
    setCurrentIndex(nextIndex);
    setTraditionIndex(nextTradition);
    setProgress(0);
    onArchetypeChange(DEMO_SEQUENCE[nextIndex].id);
    onTraditionChange(TRADITIONS[nextTradition]);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setTraditionIndex(0);
    setProgress(0);
    onArchetypeChange(DEMO_SEQUENCE[0].id);
    onTraditionChange(TRADITIONS[0]);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          Demo Mode
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={isActive ? 'secondary' : 'default'}
            size="sm"
            onClick={onToggle}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 mr-1" />
                Pause Demo
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                Start Demo
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkip}
            disabled={!isActive}
          >
            <SkipForward className="w-4 h-4 mr-1" />
            Skip
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Current Archetype Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <currentArchetype.icon className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <h4 className="font-semibold">{currentArchetype.name}</h4>
                <p className="text-sm text-muted-foreground">{currentArchetype.description}</p>
              </div>
              <Badge variant="outline" className="bg-background/50">
                {TRADITIONS[traditionIndex].toUpperCase()}
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Duration: {currentArchetype.duration}s</span>
                <span>
                  {currentIndex + 1} of {DEMO_SEQUENCE.length}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Demo Sequence Overview */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Demo Sequence</h5>
          <div className="grid grid-cols-5 gap-2">
            {DEMO_SEQUENCE.map((archetype, index) => (
              <motion.div
                key={archetype.id}
                className={`p-2 rounded border text-center transition-all ${
                  index === currentIndex 
                    ? 'bg-primary/20 border-primary' 
                    : index < currentIndex 
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-muted/20 border-muted'
                }`}
                animate={{ 
                  scale: index === currentIndex ? 1.05 : 1,
                }}
              >
                <archetype.icon className={`w-4 h-4 mx-auto mb-1 ${
                  index === currentIndex ? 'text-primary' :
                  index < currentIndex ? 'text-green-500' : 'text-muted-foreground'
                }`} />
                <div className="text-xs font-mono">{archetype.duration}s</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Demo Info */}
        <div className="p-3 bg-muted/20 rounded text-xs text-muted-foreground">
          <p>
            <strong>Demo Mode:</strong> Automatically cycles through all 5 Deep5 archetypes with shortened 
            phases, rotating between Tarot traditions. Perfect for presentations and exploring the full GAA experience.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};