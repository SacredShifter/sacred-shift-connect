/**
 * Death XIII - Deep Archetype Card
 * Death represents transformation, endings, and rebirth
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TarotTradition, PolarityProtocol } from '@/types/gaa-polarity';
import { Skull, Flower, RefreshCw, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeathXIIIProps {
  tradition: TarotTradition;
  polarity: PolarityProtocol;
  isActive: boolean;
  onActivate: () => void;
}

export const DeathXIII: React.FC<DeathXIIIProps> = ({
  tradition,
  polarity,
  isActive,
  onActivate
}) => {
  const [transformationCycle, setTransformationCycle] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setTransformationCycle(prev => (prev + 0.05) % (Math.PI * 4));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const getTraditionStyle = () => {
    switch (tradition) {
      case 'marseille':
        return { 
          bg: 'from-gray-800/20 to-green-900/20', 
          accent: 'text-green-300',
          border: 'border-green-500/30'
        };
      case 'rws':
        return { 
          bg: 'from-black/20 to-white/10', 
          accent: 'text-gray-300',
          border: 'border-gray-500/30'
        };
      case 'thoth':
        return { 
          bg: 'from-indigo-900/20 to-green-900/20', 
          accent: 'text-teal-300',
          border: 'border-teal-500/30'
        };
      case 'etteilla':
        return { 
          bg: 'from-purple-900/20 to-gray-800/20', 
          accent: 'text-violet-300',
          border: 'border-violet-500/30'
        };
    }
  };

  const style = getTraditionStyle();
  const isRebirth = Math.sin(transformationCycle) > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
      onClick={onActivate}
    >
      <Card className={`${style.border} ${isActive ? 'ring-2 ring-primary' : ''} transition-all duration-300`}>
        <CardContent className={`p-6 bg-gradient-to-br ${style.bg} relative overflow-hidden`}>
          {/* Death/Rebirth Symbol */}
          <motion.div
            animate={{ 
              rotate: transformationCycle * 20,
              scale: 1 + Math.sin(transformationCycle) * 0.1
            }}
            className="absolute top-4 right-4"
          >
            {isRebirth ? (
              <Sun className={`w-8 h-8 ${style.accent}`} />
            ) : (
              <Skull className={`w-8 h-8 ${style.accent}`} />
            )}
          </motion.div>

          {/* Card Header */}
          <div className="space-y-2 mb-4">
            <Badge variant="outline" className={style.accent}>
              XIII - Death
            </Badge>
            <h3 className="text-lg font-semibold">
              {isRebirth ? 'Rebirth Rising' : 'Sacred Endings'}
            </h3>
          </div>

          {/* Tradition-specific imagery */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Transformation</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Flower className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">New Growth</span>
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: transformationCycle * 10 }}
              >
                <RefreshCw className={`w-4 h-4 ${style.accent}`} />
              </motion.div>
              <span className="text-sm">Eternal Cycle</span>
            </div>
          </div>

          {/* Transformation wave effect */}
          {isActive && (
            <motion.div
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                x: [-20, 20, -20]
              }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 pointer-events-none"
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};