import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Facebook, Instagram, Music, Twitter, Podcast } from 'lucide-react';
import { ContentPlatform } from './PetalLotus';

interface PetalGlyphProps {
  platform: ContentPlatform;
  isSelected: boolean;
  isActive: boolean;
  syncHealth: number;
  contentCount: number;
}

const PLATFORM_CONFIG = {
  youtube: { icon: Youtube, color: 'hsl(0, 100%, 50%)', name: 'YouTube' },
  facebook: { icon: Facebook, color: 'hsl(220, 46%, 48%)', name: 'Facebook' },
  instagram: { icon: Instagram, color: 'hsl(320, 100%, 50%)', name: 'Instagram' },
  tiktok: { icon: Music, color: 'hsl(0, 0%, 0%)', name: 'TikTok' },
  twitter: { icon: Twitter, color: 'hsl(203, 89%, 53%)', name: 'Twitter' },
  podcast: { icon: Podcast, color: 'hsl(280, 70%, 60%)', name: 'Podcast' },
};

export const PetalGlyph: React.FC<PetalGlyphProps> = ({
  platform,
  isSelected,
  isActive,
  syncHealth,
  contentCount
}) => {
  const config = PLATFORM_CONFIG[platform];
  const Icon = config.icon;

  return (
    <motion.div
      className={`
        relative w-20 h-20 rounded-full border-2 
        flex items-center justify-center
        ${isSelected 
          ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/50' 
          : isActive 
            ? 'bg-card hover:bg-accent border-border' 
            : 'bg-muted border-muted-foreground opacity-50'
        }
      `}
      whileHover={{ 
        boxShadow: `0 0 20px ${config.color}50`,
        scale: 1.05
      }}
    >
      {/* Platform Icon */}
      <Icon className="w-8 h-8" />

      {/* Health Indicator */}
      <div className="absolute -top-1 -right-1">
        <div className={`
          w-4 h-4 rounded-full border-2 border-background
          ${syncHealth > 0.8 ? 'bg-green-500' : syncHealth > 0.5 ? 'bg-yellow-500' : 'bg-red-500'}
        `} />
      </div>

      {/* Content Count */}
      <motion.div
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: isSelected ? 1 : 0.7, y: 0 }}
      >
        <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-full border">
          {contentCount}
        </div>
      </motion.div>

      {/* Selection Pulse */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Sync Animation */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/10"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.2, 0.5]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      )}
    </motion.div>
  );
};