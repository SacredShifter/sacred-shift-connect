/**
 * Sun XIX - Deep Archetype Card  
 * The Sun represents joy, success, and enlightenment
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TarotTradition, PolarityProtocol } from '@/types/gaa-polarity';
import { Sun, Heart, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SunXIXProps {
  tradition: TarotTradition;
  polarity: PolarityProtocol;
  isActive: boolean;
  onActivate: () => void;
}

export const SunXIX: React.FC<SunXIXProps> = ({
  tradition,
  polarity,
  isActive,
  onActivate
}) => {
  const [solarRadiance, setSolarRadiance] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setSolarRadiance(prev => (prev + 0.1) % (Math.PI * 2));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const getTraditionStyle = () => {
    switch (tradition) {
      case 'marseille':
        return { 
          bg: 'from-yellow-400/20 to-orange-400/20', 
          accent: 'text-yellow-300',
          border: 'border-yellow-500/30'
        };
      case 'rws':
        return { 
          bg: 'from-orange-400/20 to-red-400/20', 
          accent: 'text-orange-300',
          border: 'border-orange-500/30'
        };
      case 'thoth':
        return { 
          bg: 'from-gold/20 to-yellow-400/20', 
          accent: 'text-amber-300',
          border: 'border-amber-500/30'
        };
      case 'etteilla':
        return { 
          bg: 'from-yellow-300/20 to-amber-400/20', 
          accent: 'text-yellow-400',
          border: 'border-yellow-400/30'
        };
    }
  };

  const style = getTraditionStyle();
  const sunBrightness = Math.sin(solarRadiance) * 0.3 + 0.7;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
      onClick={onActivate}
    >
      <Card className={`${style.border} ${isActive ? 'ring-2 ring-primary' : ''} transition-all duration-300`}>
        <CardContent className={`p-6 bg-gradient-to-br ${style.bg} relative overflow-hidden`}>
          {/* Sun Symbol */}
          <motion.div
            animate={{ 
              opacity: sunBrightness,
              scale: 1 + Math.sin(solarRadiance) * 0.15,
              rotate: solarRadiance * 20
            }}
            className="absolute top-4 right-4"
          >
            <Sun className={`w-8 h-8 ${style.accent}`} />
          </motion.div>

          {/* Card Header */}
          <div className="space-y-2 mb-4">
            <Badge variant="outline" className={style.accent}>
              XIX - The Sun
            </Badge>
            <h3 className="text-lg font-semibold">Solar Awakening</h3>
          </div>

          {/* Tradition-specific imagery */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Pure Joy</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Star className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Divine Light</span>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${style.accent}`} />
              <span className="text-sm">Enlightenment</span>
            </div>
          </div>

          {/* Solar rays effect */}
          {isActive && (
            <>
              <motion.div
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 pointer-events-none"
              />
              {/* Radiating rays */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0, 0.4, 0],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    delay: i * 0.2
                  }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `conic-gradient(from ${i * 45}deg, transparent 85%, ${style.accent.replace('text-', '')}20 90%, transparent 95%)`,
                  }}
                />
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};