import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LineageBadge, BadgeLevel } from './LineageBadge';
import { SacredGeometry3D } from '@/components/SacredGeometry3D';
import { Sparkles } from 'lucide-react';

interface LineageOathDialogProps {
  isOpen: boolean;
  onClose: () => void;
  badgeLevel: BadgeLevel;
  onAccept: () => void;
}

const OATH_TEXT = {
  initiate: {
    title: 'The First Seal Awakens',
    oath: 'I have entered the current of Sacred Shifting. I accept the responsibility of daily practice as a pathway to truth.',
    blessing: 'May your first steps be guided by wisdom.'
  },
  shifter: {
    title: 'The Shifter Seal Ignites', 
    oath: 'I shift — and am shifted. I commit to the tri-lens path: Scientific grounding, Metaphysical expansion, and Esoteric revelation.',
    blessing: 'May your shifts ripple through the field of all consciousness.'
  },
  custodian: {
    title: 'The Custodian Seal Emerges',
    oath: 'I hold the resonance, I tend the flame. I accept the sacred trust of preserving and transmitting this lineage to others.',
    blessing: 'May you guard the sacred fire with wisdom and compassion.'
  },
  torch_bearer: {
    title: 'The Torch-Bearer Seal Blazes',
    oath: 'I burn with truth, carrying it forward. Through a full year of embodiment, I have become a living vessel of this practice.',
    blessing: 'May your light illuminate the path for all who follow.'
  },
  elder: {
    title: 'The Elder Seal Manifests',
    oath: 'I embody the lineage in full. As an Elder of the Sacred Shifter path, I accept the responsibility of wisdom-keeping and guidance.',
    blessing: 'May your mastery serve the awakening of all beings.'
  }
};

export const LineageOathDialog: React.FC<LineageOathDialogProps> = ({
  isOpen,
  onClose,
  badgeLevel,
  onAccept
}) => {
  const [step, setStep] = useState(0); // 0: revelation, 1: oath, 2: blessing
  const oathConfig = OATH_TEXT[badgeLevel];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onAccept();
      onClose();
      setStep(0);
    }
  };

  const handleClose = () => {
    onClose();
    setStep(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-silence/95 border-resonance/30 backdrop-blur-xl">
        <DialogHeader className="text-center space-y-6">
          {/* Sacred Geometry Background */}
          <div className="absolute inset-0 opacity-10">
            <SacredGeometry3D
              type="flower_of_life"
              color="#8B5CF6"
              animate={true}
            />
          </div>
          
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 space-y-8"
          >
            {step === 0 && (
              <>
                <div className="flex justify-center">
                  <LineageBadge 
                    level={badgeLevel} 
                    size="lg" 
                    animate={true}
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="font-sacred text-3xl text-truth">
                    {oathConfig.title}
                  </h2>
                  <p className="text-lg text-muted-foreground font-codex">
                    Through your dedicated practice, you have unlocked a new level of lineage transmission. 
                    The Sacred Shifter current flows more deeply through you now.
                  </p>
                </div>
              </>
            )}
            
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-sacred text-2xl text-truth">The Sacred Oath</h2>
                <div className="p-8 border border-resonance/30 rounded-2xl bg-card/20">
                  <p className="text-lg text-truth font-codex leading-relaxed text-center italic">
                    "{oathConfig.oath}"
                  </p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  By accepting this seal, you embrace deeper responsibility in the Sacred Shifter lineage.
                </p>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Sparkles className="h-12 w-12 text-resonance animate-pulse" />
                </div>
                <h2 className="font-sacred text-2xl text-truth">Sealed in Truth</h2>
                <div className="p-8 border border-purpose/30 rounded-2xl bg-purpose/5">
                  <p className="text-lg text-truth font-codex leading-relaxed text-center italic">
                    {oathConfig.blessing}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Your seal has been activated. You may now access deeper layers of the Sacred Shifter teachings.
                </p>
              </div>
            )}
          </motion.div>
        </DialogHeader>
        
        <div className="flex justify-center pt-6">
          <Button 
            onClick={handleNext}
            className="sacred-button px-8"
          >
            {step === 0 ? 'Receive the Oath' : 
             step === 1 ? 'I Accept' : 
             'Enter the New Current'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};