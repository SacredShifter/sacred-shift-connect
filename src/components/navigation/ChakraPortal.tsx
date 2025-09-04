import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TaoModule } from '@/config/taoFlowConfig';
import { ChakraData } from '@/data/chakraData';

interface ChakraPortalProps {
  chakra: ChakraData & { 
    modules: TaoModule[];
    isUnlocked: boolean;
    isRecommended?: boolean;
  };
  modules: TaoModule[];
  isUnlocked: boolean;
  isRecommended?: boolean;
  delay: number;
}

export const ChakraPortal: React.FC<ChakraPortalProps> = ({ 
  chakra, 
  modules, 
  isUnlocked,
  isRecommended = false,
  delay 
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedModule, setSelectedModule] = useState<TaoModule | null>(null);

  const handlePortalClick = () => {
    // Always allow access - no restrictions!
    
    if (modules.length === 1) {
      // Single module - navigate directly
      navigate(modules[0].path);
      
      // Emit chakra bell event
      window.dispatchEvent(new CustomEvent('chakra-bell', {
        detail: { 
          chakraId: chakra.id,
          frequency: chakra.frequency,
          modulePath: modules[0].path,
          type: 'selection'
        }
      }));
    } else {
      // Multiple modules - show selection
      setSelectedModule(modules[0]); // For now, select first
    }
  };

  const handleModuleSelect = (module: TaoModule) => {
    navigate(module.path);
    
    // Emit chakra bell event
    window.dispatchEvent(new CustomEvent('chakra-bell', {
      detail: { 
        chakraId: chakra.id,
        frequency: chakra.frequency,
        modulePath: module.path,
        type: 'selection'
      }
    }));
    
    setSelectedModule(null);
  };

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
    
    if (hovering) {
      // Emit hover bell event
      window.dispatchEvent(new CustomEvent('chakra-bell', {
        detail: { 
          chakraId: chakra.id,
          frequency: chakra.frequency,
          modulePath: modules[0]?.path || chakra.name,
          type: 'hover'
        }
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay,
        duration: 0.6,
        ease: "easeOut"
      }}
      className="relative"
    >
      <Card 
        className={`
          relative overflow-hidden cursor-pointer transition-all duration-500
          border-primary/30 hover:border-primary/60 bg-card/10 hover:bg-card/20
          ${isRecommended ? 'ring-2 ring-primary/50 shadow-lg' : ''}
          ${isHovered ? 'shadow-xl' : 'shadow-md'}
        `}
        style={{
          boxShadow: isHovered 
            ? `0 0 30px hsl(${chakra.color.replace('hsl(', '').replace(')', '')} / 0.3)` 
            : undefined
        }}
        onMouseEnter={() => handleHover(true)}
        onMouseLeave={() => handleHover(false)}
        onClick={handlePortalClick}
      >
        {/* Chakra Portal Glow */}
        <div 
          className={`
            absolute inset-0 transition-opacity duration-500
            ${isHovered ? 'opacity-20' : 'opacity-0'}
          `}
          style={{
            background: `radial-gradient(circle at center, ${chakra.color} 0%, transparent 70%)`
          }}
        />

        {/* Breathing Animation */}
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-10 p-6"
        >
          {/* Chakra Symbol */}
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={isHovered ? {
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{
                duration: 2,
                ease: "easeInOut"
              }}
              className={`
                w-16 h-16 rounded-full flex items-center justify-center
                border-2 transition-colors duration-300
                border-primary/40 bg-primary/10
                ${isRecommended ? 'animate-pulse' : ''}
              `}
              style={{
                borderColor: chakra.color,
                backgroundColor: `${chakra.color}20`
              }}
            >
              <span className="text-2xl font-sacred">
                {chakra.id.charAt(0).toUpperCase()}
              </span>
            </motion.div>
          </div>

          {/* Chakra Info */}
          <div className="text-center space-y-2">
            <h3 className="font-sacred text-lg text-foreground">
              {chakra.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {chakra.sanskrit}
            </p>
            
            {/* Module Count */}
            {modules.length > 0 && (
              <p className="text-xs text-primary/70">
                {modules.length} {modules.length === 1 ? 'module' : 'modules'} available
                {isRecommended && <span className="text-primary font-medium"> • Recommended</span>}
              </p>
            )}
            
            {/* Frequency Info */}
            <p className="text-xs text-muted-foreground">
              {chakra.frequency} Hz
            </p>
          </div>
        </motion.div>

        {/* Portal Energy Rings */}
        <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-lg border"
                style={{ 
                  borderColor: `${chakra.color}40`,
                  margin: `${(i + 1) * 8}px`
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
      </Card>

      {/* Module Selection Modal */}
      {selectedModule && modules.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setSelectedModule(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-sm mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-sacred text-lg mb-4 text-center">
              Choose Your Path
            </h3>
            <div className="space-y-2">
              {modules.map((module) => (
                <Button
                  key={module.path}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleModuleSelect(module)}
                >
                  {module.name}
                </Button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};