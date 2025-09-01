/**
 * Moon XVIII - Deep Archetype Card
 * The Moon represents illusion, intuition, and the unconscious realm
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TarotTradition, PolarityProtocol } from '@/types/gaa-polarity';
import { Moon, Waves, Eye, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface MoonXVIIIProps {
  tradition: TarotTradition;
  polarity: PolarityProtocol;
  isActive: boolean;
  onActivate: () => void;
}

export const MoonXVIII: React.FC<MoonXVIIIProps> = ({
  tradition,
  polarity,
  isActive,
  onActivate
}) => {
  const [dreamPhase, setDreamPhase] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setDreamPhase(prev => (prev + 0.1) % (Math.PI * 2));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const getTraditionStyle = () => {
    switch (tradition) {
      case 'marseille':
        return { 
          bg: 'from-blue-900/20 to-purple-900/20', 
          accent: 'text-blue-300',
          border: 'border-blue-500/30'
        };
      case 'rws':
        return { 
          bg: 'from-indigo-900/20 to-violet-900/20', 
          accent: 'text-indigo-300',
          border: 'border-indigo-500/30'
        };
      case 'thoth':
        return { 
          bg: 'from-purple-900/20 to-pink-900/20', 
          accent: 'text-purple-300',
          border: 'border-purple-500/30'
        };
      case 'etteilla':
        return { 
          bg: 'from-cyan-900/20 to-blue-900/20', 
          accent: 'text-cyan-300',
          border: 'border-cyan-500/30'
        };
    }
  };

  const style = getTraditionStyle();
  const moonGlow = Math.sin(dreamPhase) * 0.5 + 0.5;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
      onClick={onActivate}
    >
      <Card className={`${style.border} ${isActive ? 'ring-2 ring-primary' : ''} transition-all duration-300`}>
        <CardContent className={`p-6 bg-gradient-to-br ${style.bg} relative overflow-hidden`}>
          {/* Moon Symbol */}
          <motion.div
            animate={{ 
              opacity: moonGlow,
              scale: 1 + moonGlow * 0.1
            }}
            className="absolute top-4 right-4"
          >
            <Moon className={`w-8 h-8 ${style.accent}`} />
          </motion.div>

          {/* Card Header */}
          <div className="space-y-2 mb-4">
            <Badge variant="outline" className={style.accent}>
              XVIII - The Moon
            </Badge>
            <h3 className="text-lg font-semibold">Lunar Mysteries</h3>
          </div>

          {/* Tradition-specific imagery */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Waves className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Unconscious Depths</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Psychic Vision</span>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Dream Realms</span>
            </div>
          </div>

          {/* Shadow resonance indicator */}
          {isActive && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 pointer-events-none"
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};