import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, X } from 'lucide-react';
import { EnhancedChakraData, ModuleBell } from '@/data/enhancedChakraData';
import { useSacredJournal } from '@/hooks/useSacredJournal';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  chakra: EnhancedChakraData;
  bell: ModuleBell;
}

const getReflectionPrompts = (chakra: EnhancedChakraData, bell: ModuleBell): string[] => {
  const basePrompts = {
    root: [
      'How do you feel grounded and safe in this moment?',
      'What gives you a sense of security and stability?',
      'How can you honor your physical vessel today?'
    ],
    sacral: [
      'What creative energy is flowing through you right now?',
      'How do you express your authentic emotions?',
      'What brings you joy and pleasure in healthy ways?'
    ],
    'solar-plexus': [
      'How do you honor your personal power today?',
      'What confidence do you feel building within you?',
      'How can you transform challenges into wisdom?'
    ],
    heart: [
      'How has love expanded your consciousness today?',
      'What forgiveness are you ready to offer yourself or others?',
      'How do you feel compassion flowing through you?'
    ],
    throat: [
      'What truth is seeking to be expressed through you?',
      'How do you communicate with authenticity and love?',
      'What creative expression wants to emerge?'
    ],
    'third-eye': [
      'What inner wisdom is available to you right now?',
      'How has your intuition guided you recently?',
      'What vision do you have for your spiritual journey?'
    ],
    crown: [
      'How do you feel connected to something greater than yourself?',
      'What divine wisdom has been revealed to you?',
      'How does transcendence show up in your daily life?'
    ]
  };

  return basePrompts[chakra.id as keyof typeof basePrompts] || basePrompts.heart;
};

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  isOpen,
  onClose,
  chakra,
  bell
}) => {
  const [reflection, setReflection] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const { createEntry } = useSacredJournal();
  
  const prompts = getReflectionPrompts(chakra, bell);

  const handleSaveReflection = async () => {
    if (!reflection.trim()) return;

    try {
      createEntry({
        title: `${bell.moduleName} - ${chakra.name} Reflection`,
        content: reflection,
        entry_mode: 'chakra_reflection',
        resonance_tags: ['chakra', 'bell_practice', chakra.id, bell.moduleId]
      });

      // Emit completion event
      window.dispatchEvent(new CustomEvent('bell-reflection-complete', {
        detail: { chakraId: chakra.id, moduleId: bell.moduleId, reflection }
      }));

      onClose();
      setReflection('');
      setSelectedPrompt(null);
    } catch (error) {
      console.error('Failed to save reflection:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-auto"
          >
            <Card className="bg-background/95 backdrop-blur border-primary/20">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="absolute right-2 top-2"
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: chakra.color }}
                  />
                  <div>
                    <CardTitle className="text-xl">{bell.moduleName}</CardTitle>
                    <CardDescription>
                      {chakra.name} • {bell.frequency}Hz ({bell.note})
                    </CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {chakra.theme}
                  </Badge>
                  <Badge variant="outline">{bell.frequency}Hz</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-2">Chakra Affirmation</p>
                  <p className="italic text-primary">{chakra.affirmation}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-primary" />
                    Choose a reflection prompt (or write freely below)
                  </h4>
                  <div className="grid gap-2">
                    {prompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPrompt(prompt)}
                        className={`p-3 text-left rounded-lg border transition-all ${
                          selectedPrompt === prompt 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <p className="text-sm">{prompt}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedPrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <p className="text-sm text-primary font-medium">Selected Prompt:</p>
                    <p className="text-sm mt-1">{selectedPrompt}</p>
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Sacred Reflection
                  </label>
                  <Textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Let your authentic voice emerge... What wisdom arose as the bell's sacred frequency resonated through your being?"
                    className="min-h-[120px] resize-none"
                    rows={6}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    Skip for Now
                  </Button>
                  <Button 
                    onClick={handleSaveReflection}
                    disabled={!reflection.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Save Sacred Reflection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};