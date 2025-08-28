import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shield, Eye, Wand2 } from 'lucide-react';
import { useSynchronicityMirror } from '@/hooks/useSynchronicityMirror';
import { TruthSealingAnimation } from './TruthSealingAnimation';

interface SynchronicityMirrorProps {
  isVisible: boolean;
  onToggle: () => void;
  journalContent: string;
  intention?: string;
}

export const SynchronicityMirror: React.FC<SynchronicityMirrorProps> = ({
  isVisible,
  onToggle,
  journalContent,
  intention
}) => {
  const { loading, currentReading, teachingPrompts, generateMirrorReading, sealTruth } = useSynchronicityMirror();
  const [showSealing, setShowSealing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleGenerateReading = async () => {
    try {
      await generateMirrorReading(journalContent, intention);
    } catch (error) {
      console.error('Failed to generate reading:', error);
    }
  };

  const handleSealTruth = async () => {
    if (!currentReading) return;
    setShowSealing(true);
    
    try {
      await sealTruth(currentReading.id);
      setTimeout(() => {
        setShowSealing(false);
        onToggle();
      }, 3000);
    } catch (error) {
      console.error('Failed to seal truth:', error);
      setShowSealing(false);
    }
  };

  return (
    <>
      {/* Toggle Button - Remove since we moved it */}

      {/* Mirror Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            drag
            dragConstraints={{
              top: 0,
              left: 0,
              right: window.innerWidth - 400,
              bottom: window.innerHeight - 600
            }}
            dragElastic={0.1}
            dragMomentum={false}
            initial={{ x: window.innerWidth - 400, y: 100, opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ x: position.x, y: position.y }}
            onDragEnd={(_, info) => {
              setPosition({
                x: position.x + info.offset.x,
                y: position.y + info.offset.y
              });
            }}
            className="fixed w-96 h-96 bg-background/95 backdrop-blur-md border border-border rounded-lg z-40 overflow-hidden shadow-2xl"
          >
            <div className="h-full flex flex-col">
              {/* Draggable Header */}
              <div className="flex items-center justify-between p-4 bg-primary/5 border-b border-border cursor-move">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Synchronicity Mirror</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={onToggle} className="cursor-pointer">×</Button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {!currentReading ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Generate a synchronicity reading from your current journal entry
                    </p>
                    
                    <Button
                      onClick={handleGenerateReading}
                      disabled={loading || !journalContent.trim()}
                      className="w-full"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      {loading ? 'Generating Mirror...' : 'Generate Reading'}
                    </Button>

                    {teachingPrompts.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Guidance Available</h3>
                        {teachingPrompts.map((prompt) => (
                          <Card key={prompt.id} className="p-3">
                            <Badge variant="outline" className="mb-2">
                              {prompt.category}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {prompt.prompt_text}
                            </p>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Card className="p-4 border-primary/20">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">Mirror Reading</Badge>
                          <div className="flex items-center space-x-1">
                            <Sparkles className="h-3 w-3 text-primary" />
                            <span className="text-xs">
                              {Math.round(currentReading.resonance_score * 100)}% resonance
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm leading-relaxed">
                          {currentReading.mirror_text}
                        </p>

                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground font-mono">
                            Sigil: {currentReading.sigil_pattern}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Button
                      onClick={handleSealTruth}
                      className="w-full"
                      disabled={showSealing}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Seal This Truth
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleGenerateReading()}
                      className="w-full"
                      disabled={loading}
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate New Reading
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Truth Sealing Animation */}
      <TruthSealingAnimation isActive={showSealing} />
    </>
  );
};