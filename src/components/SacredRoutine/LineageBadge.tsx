import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { SacredGeometry3D } from '@/components/SacredGeometry3D';
import { Crown, Flame, Shield, Gem, Star } from 'lucide-react';

export type BadgeLevel = 'initiate' | 'shifter' | 'custodian' | 'torch_bearer' | 'elder';

interface LineageBadgeProps {
  level: BadgeLevel | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

const BADGE_CONFIG = {
  initiate: {
    name: 'Initiate Seal',
    geometry: 'seed_of_life' as const,
    color: '#60A5FA', // blue
    icon: Star,
    description: 'I have entered the current.'
  },
  shifter: {
    name: 'Shifter Seal', 
    geometry: 'flower_of_life' as const,
    color: '#8B5CF6', // violet
    icon: Gem,
    description: 'I shift — and am shifted.'
  },
  custodian: {
    name: 'Custodian Seal',
    geometry: 'flower_of_life' as const,
    color: '#10B981', // emerald
    icon: Shield,
    description: 'I hold the resonance, I tend the flame.'
  },
  torch_bearer: {
    name: 'Torch-Bearer Seal',
    geometry: 'phoenix_spiral' as const,
    color: '#F59E0B', // amber/gold
    icon: Flame,
    description: 'I burn with truth, carrying it forward.'
  },
  elder: {
    name: 'Elder Seal',
    geometry: 'metatrons_cube' as const,
    color: '#DC2626', // red/crimson
    icon: Crown,
    description: 'I embody the lineage in full.'
  }
};

const SIZE_CONFIG = {
  sm: {
    container: 'w-8 h-8',
    icon: 'w-4 h-4',
    text: 'text-xs'
  },
  md: {
    container: 'w-12 h-12',
    icon: 'w-6 h-6', 
    text: 'text-sm'
  },
  lg: {
    container: 'w-16 h-16',
    icon: 'w-8 h-8',
    text: 'text-base'
  }
};

export const LineageBadge: React.FC<LineageBadgeProps> = ({
  level,
  size = 'md',
  showLabel = false,
  animate = true,
  onClick
}) => {
  if (!level) return null;

  const config = BADGE_CONFIG[level];
  const sizeConfig = SIZE_CONFIG[size];
  const IconComponent = config.icon;

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`
          relative ${sizeConfig.container} 
          ${onClick ? 'cursor-pointer' : ''} 
          group
        `}
        whileHover={onClick ? { scale: 1.1 } : {}}
        whileTap={onClick ? { scale: 0.95 } : {}}
        onClick={onClick}
        initial={animate ? { scale: 0, rotate: -180 } : false}
        animate={animate ? { scale: 1, rotate: 0 } : false}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: 0.2 
        }}
      >
        {/* Sacred Geometry Background */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
          <SacredGeometry3D
            type={config.geometry}
            color={config.color}
            animate={animate}
          />
        </div>
        
        {/* Seal Glow Effect */}
        <div 
          className="absolute inset-0 rounded-full blur-sm group-hover:blur-md transition-all duration-300"
          style={{
            background: `radial-gradient(circle, ${config.color}40 0%, transparent 70%)`,
            boxShadow: `0 0 20px ${config.color}60`
          }}
        />
        
        {/* Icon */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <IconComponent 
            className={`${sizeConfig.icon} text-truth group-hover:text-white transition-colors`}
            style={{ filter: `drop-shadow(0 0 4px ${config.color})` }}
          />
        </div>
      </motion.div>
      
      {showLabel && (
        <div className="flex flex-col">
          <span className={`font-sacred font-medium text-truth ${sizeConfig.text}`}>
            {config.name}
          </span>
          {size === 'lg' && (
            <span className="text-xs text-muted-foreground font-codex italic">
              {config.description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};