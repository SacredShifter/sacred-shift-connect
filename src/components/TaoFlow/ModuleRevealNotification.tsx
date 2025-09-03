import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Lock, Unlock } from 'lucide-react';
import { TaoModule } from '@/config/taoFlowConfig';
import { useToast } from '@/hooks/use-toast';

interface ModuleRevealNotificationProps {
  newModule: TaoModule | null;
  isOpen: boolean;
  onClose: () => void;
  onExplore?: () => void;
}

export const ModuleRevealNotification: React.FC<ModuleRevealNotificationProps> = ({
  newModule,
  isOpen,
  onClose,
  onExplore
}) => {
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && newModule) {
      setShowConfetti(true);
      // Show toast notification as well
      toast({
        title: "New Module Unlocked!",
        description: `${newModule.name} is now available in your journey.`,
        duration: 5000,
      });
    }
  }, [isOpen, newModule, toast]);

  if (!newModule) return null;

  const handleExplore = () => {
    onExplore?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: showConfetti ? 360 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <Unlock className="w-5 h-5 text-primary" />
            </motion.div>
            Module Unlocked
          </DialogTitle>
          <DialogDescription>
            A new module has been unlocked and is ready for you to explore in your sacred journey.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Confetti Animation */}
          <AnimatePresence>
            {showConfetti && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary rounded-full"
                    initial={{
                      x: '50%',
                      y: '50%',
                      scale: 0,
                    }}
                    animate={{
                      x: `${50 + (Math.random() - 0.5) * 200}%`,
                      y: `${50 + (Math.random() - 0.5) * 200}%`,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Module Info */}
          <motion.div
            className="text-center space-y-3"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">{newModule.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                A new module has been unlocked in your sacred journey.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary">New Module</Badge>
              {newModule.reveal === 'ceremony' && (
                <Badge variant="outline">
                  <Lock className="w-3 h-3 mr-1" />
                  Ceremony Required
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex gap-2 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button variant="outline" onClick={onClose}>
              Continue Later
            </Button>
            <Button onClick={handleExplore} className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Explore Now
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};