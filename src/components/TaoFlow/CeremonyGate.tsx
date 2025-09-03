import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Key, Heart, Star } from 'lucide-react';
import { TaoModule } from '@/config/taoFlowConfig';

interface CeremonyGateProps {
  module: TaoModule | null;
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  requirements?: {
    description: string;
    met: boolean;
  }[];
}

export const CeremonyGate: React.FC<CeremonyGateProps> = ({
  module,
  isOpen,
  onClose,
  onProceed,
  requirements = []
}) => {
  const [isReady, setIsReady] = useState(false);
  const [showPreparation, setShowPreparation] = useState(false);

  if (!module) return null;

  const allRequirementsMet = requirements.every(req => req.met);

  const handlePrepare = () => {
    setShowPreparation(true);
    // Simulate preparation time
    setTimeout(() => {
      setIsReady(true);
    }, 2000);
  };

  const ceremonialMessages = {
    wuWei: "Prepare to enter the realm of effortless action. This sacred space requires your full presence.",
    yinYang: "You approach the dance of opposites. Balance your inner forces before proceeding.",
    advancedCeremony: "The deeper mysteries await. Your journey has prepared you for this moment.",
    returnToSilence: "The final gate opens to eternal stillness. Are you ready to return home?"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <motion.div
              animate={{ 
                rotate: isReady ? 0 : [0, 5, -5, 0],
                scale: isReady ? 1.1 : 1
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 2 },
                scale: { duration: 0.3 }
              }}
            >
              {isReady ? <Key className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5" />}
            </motion.div>
            Sacred Ceremony Gate
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Module Info */}
          <div className="text-center space-y-3">
            <motion.div
              className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
              animate={{ 
                scale: isReady ? [1, 1.05, 1] : 1,
                backgroundColor: isReady ? ["rgba(var(--primary), 0.1)", "rgba(var(--primary), 0.2)", "rgba(var(--primary), 0.1)"] : "rgba(var(--primary), 0.1)"
              }}
              transition={{ 
                repeat: isReady ? Infinity : 0, 
                duration: 2 
              }}
            >
              <Star className={`w-8 h-8 ${isReady ? 'text-primary' : 'text-muted-foreground'}`} />
            </motion.div>
            
            <div>
              <h3 className="text-xl font-semibold">{module.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {ceremonialMessages.wuWei}
              </p>
            </div>

            <Badge variant={isReady ? "default" : "outline"}>
              {isReady ? "Ready for Ceremony" : "Preparation Required"}
            </Badge>
          </div>

          {/* Requirements */}
          {requirements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Sacred Prerequisites:</h4>
              {requirements.map((req, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 text-sm p-2 rounded ${
                    req.met ? 'text-primary bg-primary/5' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    req.met ? 'bg-primary' : 'bg-muted-foreground'
                  }`} />
                  {req.description}
                </div>
              ))}
            </div>
          )}

          {/* Preparation Phase */}
          {showPreparation && !isReady && (
            <motion.div
              className="text-center space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="mx-auto w-8 h-8"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Heart className="w-8 h-8 text-primary" />
              </motion.div>
              <p className="text-sm text-muted-foreground">
                Centering your intention... Preparing sacred space...
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={onClose}>
              Return Later
            </Button>
            
            {!showPreparation && allRequirementsMet && (
              <Button onClick={handlePrepare} className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Begin Preparation
              </Button>
            )}
            
            {isReady && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Button 
                  onClick={onProceed}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80"
                >
                  <Key className="w-4 h-4" />
                  Enter Sacred Space
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};