import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, Zap, Heart } from 'lucide-react';
import { TaoStage } from '@/config/taoFlowConfig';
import { useToast } from '@/hooks/use-toast';

interface MilestoneCelebrationProps {
  newStage: TaoStage | null;
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
}

const stageInfo = {
  wuWei: {
    title: 'Wu Wei Achieved',
    subtitle: 'The Art of Effortless Action',
    icon: Heart,
    color: 'from-blue-400 to-purple-600',
    message: 'You have learned to flow with the natural order. The path of least resistance opens before you.',
    unlocks: ['Advanced breath practices', 'Energy cultivation techniques', 'Deeper meditation states']
  },
  yinYang: {
    title: 'Yin/Yang Balance',
    subtitle: 'Master of Duality',
    icon: Zap,
    color: 'from-purple-400 to-pink-600',
    message: 'You understand the dance of opposites. Light and shadow, action and rest, giving and receiving.',
    unlocks: ['Polarity practices', 'Advanced healing techniques', 'Sacred geometry work']
  },
  advancedCeremony: {
    title: 'Sacred Mysteries',
    subtitle: 'Guardian of Ancient Wisdom',
    icon: Crown,
    color: 'from-amber-400 to-orange-600',
    message: 'The deeper teachings reveal themselves. You are ready for the advanced ceremonial practices.',
    unlocks: ['Ceremonial protocols', 'Group facilitation', 'Advanced energy work']
  },
  returnToSilence: {
    title: 'Return to Silence',
    subtitle: 'Master of the Void',
    icon: Star,
    color: 'from-indigo-400 to-blue-600',
    message: 'In the beginning was silence. In the end is silence. You have come full circle.',
    unlocks: ['Pure presence practices', 'Void meditation', 'Transmission abilities']
  }
};

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  newStage,
  isOpen,
  onClose,
  onContinue
}) => {
  const { toast } = useToast();
  const [showFireworks, setShowFireworks] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (isOpen && newStage) {
      // Show toast notification
      toast({
        title: "🎉 Sacred Milestone Achieved!",
        description: `You have reached the ${stageInfo[newStage].title} stage.`,
        duration: 8000,
      });
      
      // Animation sequence
      setAnimationPhase(0);
      const timer1 = setTimeout(() => setShowFireworks(true), 500);
      const timer2 = setTimeout(() => setAnimationPhase(1), 1000);
      const timer3 = setTimeout(() => setAnimationPhase(2), 2000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen, newStage, toast]);

  if (!newStage) return null;

  const stage = stageInfo[newStage];
  const IconComponent = stage.icon;

  const handleContinue = () => {
    onContinue?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-0 bg-gradient-to-br from-background to-background/95">
        <div className="relative overflow-hidden">
          {/* Background Fireworks */}
          <AnimatePresence>
            {showFireworks && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary rounded-full"
                    initial={{
                      x: '50%',
                      y: '50%',
                      scale: 0,
                    }}
                    animate={{
                      x: `${20 + Math.random() * 60}%`,
                      y: `${20 + Math.random() * 60}%`,
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          <div className="relative z-10 space-y-8 p-8">
            {/* Header */}
            <motion.div
              className="text-center space-y-4"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <motion.div
                className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-r ${stage.color} flex items-center justify-center`}
                animate={{ 
                  rotate: animationPhase >= 1 ? 360 : 0,
                  scale: animationPhase >= 2 ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  rotate: { duration: 1 },
                  scale: { repeat: Infinity, duration: 2 }
                }}
              >
                <IconComponent className="w-12 h-12 text-white" />
              </motion.div>
              
              <div>
                <h2 className="text-3xl font-bold">{stage.title}</h2>
                <p className="text-lg text-muted-foreground">{stage.subtitle}</p>
              </div>
              
              <Badge variant="default" className="text-base px-4 py-1">
                Sacred Milestone Achieved
              </Badge>
            </motion.div>

            {/* Message */}
            <motion.div
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-lg leading-relaxed text-muted-foreground">
                {stage.message}
              </p>
            </motion.div>

            {/* Unlocks */}
            <motion.div
              className="space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <h3 className="text-center font-semibold">Newly Unlocked:</h3>
              <div className="grid gap-2">
                {stage.unlocks.map((unlock, index) => (
                  <motion.div
                    key={unlock}
                    className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-sm">{unlock}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex justify-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <Button variant="outline" onClick={onClose}>
                Reflect in Silence
              </Button>
              <Button 
                onClick={handleContinue} 
                className={`bg-gradient-to-r ${stage.color} text-white border-0`}
              >
                Continue Journey
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};