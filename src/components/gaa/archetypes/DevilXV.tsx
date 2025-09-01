/**
 * Devil XV - Deep Archetype Card
 * The Devil represents bondage, temptation, and shadow integration
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TarotTradition, PolarityProtocol } from '@/types/gaa-polarity';
import { Flame, Link, Eye, Mountain } from 'lucide-react';
import { motion } from 'framer-motion';

interface DevilXVProps {
  tradition: TarotTradition;
  polarity: PolarityProtocol;
  isActive: boolean;
  onActivate: () => void;
}

export const DevilXV: React.FC<DevilXVProps> = ({
  tradition,
  polarity,
  isActive,
  onActivate
}) => {
  const [shadowPulse, setShadowPulse] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setShadowPulse(prev => (prev + 0.08) % (Math.PI * 2));
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const getTraditionStyle = () => {
    switch (tradition) {
      case 'marseille':
        return { 
          bg: 'from-gray-900/30 to-black/20', 
          accent: 'text-red-400',
          border: 'border-red-600/40'
        };
      case 'rws':
        return { 
          bg: 'from-red-900/30 to-black/20', 
          accent: 'text-orange-400',
          border: 'border-orange-600/40'
        };
      case 'thoth':
        return { 
          bg: 'from-purple-900/30 to-black/20', 
          accent: 'text-purple-400',
          border: 'border-purple-600/40'
        };
      case 'etteilla':
        return { 
          bg: 'from-indigo-900/30 to-black/20', 
          accent: 'text-indigo-400',
          border: 'border-indigo-600/40'
        };
    }
  };

  const style = getTraditionStyle();
  const shadowIntensity = Math.sin(shadowPulse) * 0.3 + 0.7;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
      onClick={onActivate}
    >
      <Card className={`${style.border} ${isActive ? 'ring-2 ring-primary' : ''} transition-all duration-300`}>
        <CardContent className={`p-6 bg-gradient-to-br ${style.bg} relative overflow-hidden`}>
          {/* Devil Symbol */}
          <motion.div
            animate={{ 
              opacity: shadowIntensity,
              rotate: Math.sin(shadowPulse) * 5
            }}
            className="absolute top-4 right-4"
          >
            <Mountain className={`w-8 h-8 ${style.accent}`} />
          </motion.div>

          {/* Card Header */}
          <div className="space-y-2 mb-4">
            <Badge variant="outline" className={style.accent}>
              XV - The Devil
            </Badge>
            <h3 className="text-lg font-semibold">Shadow Integration</h3>
          </div>

          {/* Tradition-specific imagery */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Link className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Breaking Bondage</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Shadow Work</span>
            </div>

            <div className="flex items-center gap-2">
              <Flame className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Primal Power</span>
            </div>
          </div>

          {/* Shadow pulse effect */}
          {isActive && (
            <motion.div
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.02, 1]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-purple-900/10 pointer-events-none"
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};