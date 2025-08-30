import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Infinity } from 'lucide-react';

interface BridgeMoment {
  id: string;
  scientific: string;
  metaphysical: string;
  esoteric: string;
  trigger: string;
}

const BRIDGE_MOMENTS: BridgeMoment[] = [
  {
    id: 'breath-coherence',
    scientific: 'Your heart rate variability has increased, indicating improved nervous system regulation.',
    metaphysical: 'Feel the subtle calm spreading through your energy field. This is coherence.',
    esoteric: 'This is pranayama awakening - the sacred breath teaching found in ancient texts.',
    trigger: 'meditation_complete'
  },
  {
    id: 'journal-insight',
    scientific: 'Expressive writing activates the prefrontal cortex, improving emotional processing.',
    metaphysical: 'Notice the shift in your inner landscape as thoughts become clear.',
    esoteric: 'You are scribing in the Book of Self - the sacred practice of inner documentation.',
    trigger: 'journal_entry'
  },
  {
    id: 'circle-resonance',
    scientific: 'Group coherence increases oxytocin and synchronizes brainwaves across participants.',
    metaphysical: 'Feel how your individual field merges with the collective resonance.',
    esoteric: 'This is the sacred circle - the geometry of unity consciousness experienced by mystery schools.',
    trigger: 'circle_participation'
  },
  {
    id: 'constellation-mapping',
    scientific: 'Pattern recognition networks activate when mapping complex relationships.',
    metaphysical: 'Your consciousness is literally constellation-making - connecting the dots of awareness.',
    esoteric: 'You are reading the star map of your own becoming - as above, so below.',
    trigger: 'constellation_update'
  }
];

interface BridgeMomentNotificationProps {
  trigger?: string;
  className?: string;
}

export const BridgeMomentNotification: React.FC<BridgeMomentNotificationProps> = ({
  trigger,
  className
}) => {
  const [activeBridge, setActiveBridge] = useState<BridgeMoment | null>(null);
  const [currentLens, setCurrentLens] = useState<'scientific' | 'metaphysical' | 'esoteric'>('scientific');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      const bridgeMoment = BRIDGE_MOMENTS.find(bm => bm.trigger === trigger);
      if (bridgeMoment) {
        setActiveBridge(bridgeMoment);
        setIsVisible(true);
        
        // Auto-advance through lenses
        const lensSequence: Array<'scientific' | 'metaphysical' | 'esoteric'> = ['scientific', 'metaphysical', 'esoteric'];
        let currentIndex = 0;
        
        const interval = setInterval(() => {
          currentIndex = (currentIndex + 1) % lensSequence.length;
          setCurrentLens(lensSequence[currentIndex]);
          
          if (currentIndex === 0) {
            // Completed full cycle, hide after showing scientific again briefly
            setTimeout(() => {
              setIsVisible(false);
              setActiveBridge(null);
            }, 2000);
            clearInterval(interval);
          }
        }, 3000);

        return () => clearInterval(interval);
      }
    }
  }, [trigger]);

  const getCurrentText = () => {
    if (!activeBridge) return '';
    return activeBridge[currentLens];
  };

  const getLensColor = () => {
    switch (currentLens) {
      case 'scientific': return 'text-blue-400';
      case 'metaphysical': return 'text-purple-400';
      case 'esoteric': return 'text-amber-400';
      default: return 'text-primary';
    }
  };

  const getLensIcon = () => {
    switch (currentLens) {
      case 'scientific': return '🔬';
      case 'metaphysical': return '✨';
      case 'esoteric': return '👁️';
      default: return '🔬';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && activeBridge && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`fixed bottom-6 right-6 z-50 max-w-md ${className}`}
        >
          <Card className="bg-background/95 backdrop-blur-sm border-primary/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    key={currentLens}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl"
                  >
                    {getLensIcon()}
                  </motion.div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Infinity className="w-4 h-4 text-primary" />
                      Bridge Moment
                    </h4>
                    <p className={`text-sm capitalize ${getLensColor()}`}>
                      {currentLens} Lens
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsVisible(false);
                    setActiveBridge(null);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <motion.div
                key={currentLens}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-4"
              >
                <p className="text-muted-foreground leading-relaxed">
                  {getCurrentText()}
                </p>
              </motion.div>

              {/* Lens Progress Indicators */}
              <div className="flex gap-2 justify-center">
                {['scientific', 'metaphysical', 'esoteric'].map((lens, index) => (
                  <motion.div
                    key={lens}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      lens === currentLens ? 'bg-primary' : 'bg-muted'
                    }`}
                    animate={{
                      scale: lens === currentLens ? 1.2 : 1,
                      opacity: lens === currentLens ? 1 : 0.5
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};