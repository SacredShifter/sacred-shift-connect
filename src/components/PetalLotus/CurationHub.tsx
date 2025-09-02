import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, RefreshCw, Filter } from 'lucide-react';

interface CurationHubAction {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

interface CurationHubProps {
  isExpanded: boolean;
  hasSelection: boolean;
  actions: CurationHubAction[];
}

export const CurationHub: React.FC<CurationHubProps> = ({
  isExpanded,
  hasSelection,
  actions,
}) => {
  return (
    <motion.div
      className={`
        relative rounded-full border-2 flex items-center justify-center
        ${hasSelection 
          ? 'w-16 h-16 bg-primary/20 border-primary' 
          : 'w-24 h-24 bg-gradient-to-br from-primary/30 to-secondary/30 border-primary/50'
        }
      `}
      animate={{
        scale: isExpanded ? 1.2 : 1,
        boxShadow: isExpanded 
          ? "0 0 30px hsl(var(--primary) / 0.5)" 
          : "0 0 15px hsl(var(--primary) / 0.2)"
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Central Sacred Symbol */}
      <motion.div
        animate={{ rotate: isExpanded ? 360 : 0 }}
        transition={{ duration: 2, ease: "linear", repeat: isExpanded ? Infinity : 0 }}
      >
        <Sparkles className={`${hasSelection ? 'w-6 h-6' : 'w-8 h-8'} text-primary`} />
      </motion.div>

      {/* Orbital Icons */}
      {isExpanded && (
        <>
          {actions.map((action, index) => {
            const angle = (index * (360 / actions.length)) - 90; // Start from top
            const radius = 60;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <motion.div
                key={action.label}
                className="absolute w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center cursor-pointer hover:bg-accent"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  x,
                  y
                }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.3
                }}
                whileHover={{ scale: 1.1 }}
                onClick={action.onClick}
                aria-label={action.label}
              >
                <action.icon className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            );
          })}
        </>
      )}

      {/* Pulsing Rings */}
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/30"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          delay: 0
        }}
      />
      
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/20"
        animate={{ 
          scale: [1, 1.8, 1],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          delay: 0.5
        }}
      />
    </motion.div>
  );
};