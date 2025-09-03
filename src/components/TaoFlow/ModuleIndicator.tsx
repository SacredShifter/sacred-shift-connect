import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles, Clock, Key } from 'lucide-react';
import { TaoModule } from '@/config/taoFlowConfig';

interface ModuleIndicatorProps {
  module: TaoModule;
  isUnlocked: boolean;
  isNew?: boolean;
  isNearUnlock?: boolean;
  className?: string;
}

export const ModuleIndicator: React.FC<ModuleIndicatorProps> = ({
  module,
  isUnlocked,
  isNew = false,
  isNearUnlock = false,
  className = ''
}) => {
  const getIndicatorIcon = () => {
    if (!isUnlocked && module.reveal === 'ceremony') {
      return <Key className="w-3 h-3" />;
    }
    if (!isUnlocked) {
      return <Lock className="w-3 h-3" />;
    }
    if (isNew) {
      return <Sparkles className="w-3 h-3" />;
    }
    return null;
  };

  const getIndicatorVariant = () => {
    if (!isUnlocked && isNearUnlock) return 'outline';
    if (!isUnlocked) return 'secondary';
    if (isNew) return 'default';
    return 'outline';
  };

  const getIndicatorText = () => {
    if (!isUnlocked && module.reveal === 'ceremony') return 'Ceremony';
    if (!isUnlocked && isNearUnlock) return 'Soon';
    if (!isUnlocked) return 'Locked';
    if (isNew) return 'New';
    return 'Available';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Glow effect for new modules */}
      {isNew && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-sm"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Pulse for near unlock */}
      {isNearUnlock && !isUnlocked && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut"
          }}
        />
      )}

      <Badge 
        variant={getIndicatorVariant()}
        className={`relative z-10 flex items-center gap-1 ${
          isNew ? 'animate-pulse' : ''
        } ${
          !isUnlocked ? 'opacity-60' : ''
        }`}
      >
        {getIndicatorIcon()}
        <span className="text-xs">{getIndicatorText()}</span>
      </Badge>

      {/* New indicator dot */}
      {isNew && (
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full z-20"
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1,
          }}
        />
      )}
    </div>
  );
};