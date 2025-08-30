import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PetalGlyph } from './PetalGlyph';
import { CurationHub } from './CurationHub';

export type ContentPlatform = 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitter' | 'podcast';

interface PetalLotusProps {
  selectedPlatform?: ContentPlatform;
  onPlatformSelect: (platform: ContentPlatform | undefined) => void;
  className?: string;
}

const PLATFORMS: ContentPlatform[] = [
  'youtube',
  'facebook', 
  'instagram',
  'tiktok',
  'twitter',
  'podcast'
];

const GOLDEN_RATIO = 1.618;

export const PetalLotus: React.FC<PetalLotusProps> = ({
  selectedPlatform,
  onPlatformSelect,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculatePetalPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total;
    const radius = 120 * GOLDEN_RATIO;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  return (
    <div className={`relative w-full h-96 flex items-center justify-center ${className}`}>
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Sacred Geometry Background */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            width="400"
            height="400"
            viewBox="-200 -200 400 400"
            className="w-full h-full opacity-20"
          >
            {/* Flower of Life pattern */}
            <defs>
              <pattern id="sacred-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="15" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sacred-grid)" />
          </svg>
        </div>

        {/* Central Hub */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            setIsExpanded(!isExpanded);
            onPlatformSelect(undefined);
          }}
        >
          <CurationHub 
            isExpanded={isExpanded}
            hasSelection={!!selectedPlatform}
          />
        </motion.div>

        {/* Platform Petals */}
        {PLATFORMS.map((platform, index) => {
          const position = calculatePetalPosition(index, PLATFORMS.length);
          const isSelected = selectedPlatform === platform;
          
          return (
            <motion.div
              key={platform}
              className="absolute top-1/2 left-1/2 cursor-pointer"
              style={{
                transform: `translate(${position.x - 50}px, ${position.y - 50}px)`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isSelected ? 1.2 : 1,
                opacity: 1 
              }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5,
                type: "spring"
              }}
              whileHover={{ scale: isSelected ? 1.3 : 1.1 }}
              onClick={() => onPlatformSelect(isSelected ? undefined : platform)}
            >
              <PetalGlyph
                platform={platform}
                isSelected={isSelected}
                isActive={true}
                syncHealth={0.85}
                contentCount={Math.floor(Math.random() * 100) + 20}
              />
            </motion.div>
          );
        })}

        {/* Connecting Lines */}
        <svg
          width="400"
          height="400"
          viewBox="-200 -200 400 400"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          {PLATFORMS.map((platform, index) => {
            const position = calculatePetalPosition(index, PLATFORMS.length);
            const isConnected = selectedPlatform === platform;
            
            return (
              <motion.line
                key={`connection-${platform}`}
                x1="0"
                y1="0"
                x2={position.x}
                y2={position.y}
                stroke="hsl(var(--primary))"
                strokeWidth={isConnected ? "2" : "1"}
                opacity={isConnected ? "0.6" : "0.2"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
              />
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
};