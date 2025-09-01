/**
 * Tower XVI - Deep Archetype Card  
 * The Tower represents destruction, revelation, and sudden change
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TarotTradition, PolarityProtocol } from '@/types/gaa-polarity';
import { Zap, Building, AlertTriangle, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface TowerXVIProps {
  tradition: TarotTradition;
  polarity: PolarityProtocol;
  isActive: boolean;
  onActivate: () => void;
}

export const TowerXVI: React.FC<TowerXVIProps> = ({
  tradition,
  polarity,
  isActive,
  onActivate
}) => {
  const [lightningStrike, setLightningStrike] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setLightningStrike(prev => Math.random());
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const getTraditionStyle = () => {
    switch (tradition) {
      case 'marseille':
        return { 
          bg: 'from-red-900/20 to-orange-900/20', 
          accent: 'text-red-300',
          border: 'border-red-500/30'
        };
      case 'rws':
        return { 
          bg: 'from-yellow-900/20 to-red-900/20', 
          accent: 'text-yellow-300',
          border: 'border-yellow-500/30'
        };
      case 'thoth':
        return { 
          bg: 'from-orange-900/20 to-red-900/20', 
          accent: 'text-orange-300',
          border: 'border-orange-500/30'
        };
      case 'etteilla':
        return { 
          bg: 'from-amber-900/20 to-yellow-900/20', 
          accent: 'text-amber-300',
          border: 'border-amber-500/30'
        };
    }
  };

  const style = getTraditionStyle();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
      onClick={onActivate}
    >
      <Card className={`${style.border} ${isActive ? 'ring-2 ring-primary' : ''} transition-all duration-300`}>
        <CardContent className={`p-6 bg-gradient-to-br ${style.bg} relative overflow-hidden`}>
          {/* Lightning Symbol */}
          <motion.div
            animate={{ 
              opacity: lightningStrike > 0.8 ? 1 : 0.3,
              scale: lightningStrike > 0.8 ? 1.2 : 1
            }}
            className="absolute top-4 right-4"
          >
            <Zap className={`w-8 h-8 ${style.accent}`} />
          </motion.div>

          {/* Card Header */}
          <div className="space-y-2 mb-4">
            <Badge variant="outline" className={style.accent}>
              XVI - The Tower
            </Badge>
            <h3 className="text-lg font-semibold">Divine Lightning</h3>
          </div>

          {/* Tradition-specific imagery */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Structure Dissolution</span>
            </div>
            
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Sudden Revelation</span>
            </div>

            <div className="flex items-center gap-2">
              <Flame className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Purifying Fire</span>
            </div>
          </div>

          {/* Lightning flash effect */}
          {isActive && lightningStrike > 0.8 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-yellow-400/20 pointer-events-none"
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};