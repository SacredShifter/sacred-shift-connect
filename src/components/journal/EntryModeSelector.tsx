import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export interface EntryMode {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  prompt: string;
}

interface EntryModeSelectorProps {
  modes: EntryMode[];
  selectedMode: string;
  onModeChange: (mode: string) => void;
}

export const EntryModeSelector: React.FC<EntryModeSelectorProps> = ({
  modes,
  selectedMode,
  onModeChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {modes.map((mode) => (
        <motion.div
          key={mode.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              selectedMode === mode.id 
                ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary shadow-lg shadow-primary/20' 
                : 'bg-card/50 hover:bg-card/70 border-border'
            }`}
            onClick={() => onModeChange(mode.id)}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-gradient-to-r ${mode.color}`}>
                <div className="text-white">
                  <mode.icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-medium mb-1">{mode.name}</h3>
              <p className="text-xs text-muted-foreground">{mode.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};