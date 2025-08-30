import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SacredGeometry3D } from '@/components/SacredGeometry3D';
import { LineageBadge, BadgeLevel } from '@/components/SacredRoutine/LineageBadge';
import { UserInitiation, useCompleteCeremony } from '@/hooks/useSacredInitiations';
import { Sparkles, Crown, Flame, Shield, Gem, Star } from 'lucide-react';

interface SacredInitiationCeremonyProps {
  initiation: UserInitiation | null;
  open: boolean;
  onClose: () => void;
}

const CEREMONY_PHASES = {
  recognition: 'recognition',
  oath: 'oath', 
  blessing: 'blessing',
  integration: 'integration'
} as const;

type CeremonyPhase = keyof typeof CEREMONY_PHASES;

export const SacredInitiationCeremony: React.FC<SacredInitiationCeremonyProps> = ({
  initiation,
  open,
  onClose
}) => {
  const [currentPhase, setCurrentPhase] = useState<CeremonyPhase>('recognition');
  const { mutate: completeCeremony, isPending } = useCompleteCeremony();

  if (!initiation) return null;

  const seal = initiation.seal;
  const sealLevel = seal.seal_name as BadgeLevel;

  const handleOathAcceptance = () => {
    setCurrentPhase('blessing');
  };

  const handleBlessingReceived = () => {
    setCurrentPhase('integration');
  };

  const handleCeremonyComplete = () => {
    completeCeremony(initiation.id);
    onClose();
    setCurrentPhase('recognition'); // Reset for next time
  };

  const getGeometryFromType = (geometryType: string) => {
    switch (geometryType) {
      case 'seed_of_life': return 'seed_of_life';
      case 'flower_of_life': return 'flower_of_life';
      case 'phoenix_spiral': return 'phoenix_spiral';
      case 'metatrons_cube': return 'metatrons_cube';
      default: return 'flower_of_life';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl border-truth/30">
        <div className="relative p-6">
          {/* Sacred Geometry Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <SacredGeometry3D
              type={getGeometryFromType(seal.geometry_type) as any}
              color={seal.color_signature}
              animate={true}
            />
          </div>

          <div className="relative z-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex justify-center"
              >
                <LineageBadge 
                  level={sealLevel}
                  size="lg"
                  showLabel={false}
                  animate={true}
                />
              </motion.div>
              
              <motion.h1 
                className="font-sacred text-3xl text-truth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Sacred Initiation Ceremony
              </motion.h1>
              
              <motion.p 
                className="text-lg text-resonance font-codex"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {seal.seal_name.toUpperCase()} SEAL
              </motion.p>
            </div>

            <AnimatePresence mode="wait">
              {/* Recognition Phase */}
              {currentPhase === 'recognition' && (
                <motion.div
                  key="recognition"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <Card className="bg-truth/5 border-truth/20">
                    <CardContent className="p-6 text-center space-y-4">
                      <Sparkles className="h-12 w-12 text-resonance mx-auto" />
                      <h2 className="font-sacred text-xl text-truth">Sacred Recognition</h2>
                      <p className="text-muted-foreground font-codex leading-relaxed">
                        Through dedicated practice and authentic commitment to the Sacred Shifter path, 
                        you have demonstrated readiness for the <span className="text-resonance font-medium">{seal.seal_name}</span> initiation.
                      </p>
                      <div className="bg-resonance/10 rounded-lg p-4 space-y-2">
                        <p className="text-sm text-truth font-medium">Conditions Met:</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {Object.entries(initiation.conditions_snapshot).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="text-resonance">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button 
                        onClick={() => setCurrentPhase('oath')}
                        className="bg-resonance hover:bg-resonance/80"
                      >
                        Accept Sacred Recognition
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Oath Phase */}
              {currentPhase === 'oath' && (
                <motion.div
                  key="oath"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <Card className="bg-truth/5 border-truth/20">
                    <CardContent className="p-6 text-center space-y-6">
                      <Crown className="h-12 w-12 text-resonance mx-auto" />
                      <h2 className="font-sacred text-xl text-truth">Sacred Oath</h2>
                      <div className="bg-resonance/10 rounded-lg p-6">
                        <p className="text-lg font-codex italic text-truth leading-relaxed">
                          "{seal.oath_text}"
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Do you accept this sacred oath and commit to embodying its essence?
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentPhase('recognition')}
                        >
                          Reflect Further
                        </Button>
                        <Button 
                          onClick={handleOathAcceptance}
                          className="bg-resonance hover:bg-resonance/80"
                        >
                          I Accept This Sacred Oath
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Blessing Phase */}
              {currentPhase === 'blessing' && (
                <motion.div
                  key="blessing"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <Card className="bg-truth/5 border-truth/20">
                    <CardContent className="p-6 text-center space-y-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-16 w-16 text-resonance mx-auto" />
                      </motion.div>
                      <h2 className="font-sacred text-xl text-truth">Sacred Blessing</h2>
                      <div className="bg-resonance/10 rounded-lg p-6">
                        <p className="text-lg font-codex italic text-truth leading-relaxed">
                          {seal.blessing_text}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Let this blessing integrate into your being and guide your path forward.
                      </p>
                      <Button 
                        onClick={handleBlessingReceived}
                        className="bg-resonance hover:bg-resonance/80"
                      >
                        Receive Sacred Blessing
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Integration Phase */}
              {currentPhase === 'integration' && (
                <motion.div
                  key="integration"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <Card className="bg-truth/5 border-truth/20">
                    <CardContent className="p-6 text-center space-y-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
                      >
                        <LineageBadge 
                          level={sealLevel}
                          size="lg"
                          showLabel={true}
                          animate={true}
                        />
                      </motion.div>
                      
                      <h2 className="font-sacred text-xl text-truth">Sacred Integration</h2>
                      <p className="text-muted-foreground font-codex leading-relaxed">
                        The <span className="text-resonance">{seal.seal_name}</span> seal is now permanently 
                        integrated into your Sacred Shifter lineage. Your spiritual authority and 
                        access level within the mystery school have evolved.
                      </p>
                      
                      {seal.esoteric_unlock_level > 0 && (
                        <div className="bg-resonance/10 rounded-lg p-4">
                          <p className="text-sm text-truth font-medium">New Esoteric Access Unlocked</p>
                          <p className="text-xs text-muted-foreground">
                            Level {seal.esoteric_unlock_level} teachings and practices are now available
                          </p>
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleCeremonyComplete}
                        disabled={isPending}
                        className="bg-resonance hover:bg-resonance/80"
                      >
                        {isPending ? 'Integrating...' : 'Complete Sacred Ceremony'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};