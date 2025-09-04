import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Eye, Sparkles, BookOpen, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSynchronicityMirror } from '@/hooks/useSynchronicityMirror';
import { useMirrorJournal } from '@/hooks/useMirrorJournal';
import { useToast } from '@/hooks/use-toast';

interface EnhancedTruthSparkProps {
  onOpenMirror: (content?: string) => void;
}

export const EnhancedTruthSpark = ({ onOpenMirror }: EnhancedTruthSparkProps) => {
  const { currentReading, loading } = useSynchronicityMirror();
  const { createEntry } = useMirrorJournal();
  const { toast } = useToast();
  const [showMirrorPrompt, setShowMirrorPrompt] = useState(false);
  const [reflection, setReflection] = useState('');
  const [showReflectionModal, setShowReflectionModal] = useState(false);

  // Get recent journal content - in production, this would come from actual journal entries
  const recentJournalEntry = "Today I felt a deep connection to the patterns emerging in my practice...";
  const currentResonance = currentReading?.resonance_score || 0.78;

  const handleSealToJournal = async () => {
    setShowMirrorPrompt(true);
  };

  const handleDirectSeal = async () => {
    try {
      await createEntry({
        title: `Truth Spark - ${new Date().toLocaleDateString()}`,
        content: recentJournalEntry,
        is_draft: false,
        mood_tag: 'enlightened',
        chakra_alignment: 'crown'
      });
      
      toast({
        title: "Truth Sealed",
        description: "Your insight has been preserved in the Mirror Journal",
      });
      
      setShowMirrorPrompt(false);
    } catch (error) {
      toast({
        title: "Sealing Failed",
        description: "Unable to save your truth. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReflectAndSeal = () => {
    setShowMirrorPrompt(false);
    setShowReflectionModal(true);
  };

  const handleReflectionSeal = async () => {
    try {
      await createEntry({
        title: `Truth Spark Reflection - ${new Date().toLocaleDateString()}`,
        content: `${recentJournalEntry}\n\n**Reflection:**\n${reflection}`,
        is_draft: false,
        mood_tag: 'reflective',
        chakra_alignment: 'third-eye'
      });
      
      toast({
        title: "Reflection Sealed",
        description: "Your truth and reflection have been preserved",
      });
      
      setShowReflectionModal(false);
      setReflection('');
    } catch (error) {
      toast({
        title: "Sealing Failed",
        description: "Unable to save your reflection. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLater = () => {
    // Store in localStorage for next session
    localStorage.setItem('truth-spark-snoozed', JSON.stringify({
      content: recentJournalEntry,
      timestamp: Date.now()
    }));
    
    toast({
      title: "Truth Snoozed",
      description: "We'll remind you to seal this truth next time",
    });
    
    setShowMirrorPrompt(false);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Zap className="h-4 w-4 text-primary" />
          Truth Spark
          {currentReading && (
            <Badge variant="secondary" className="ml-auto text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              {Math.round(currentResonance * 100)}%
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {recentJournalEntry.slice(0, 60)}...
        </div>

        {/* Current sigil if available */}
        {currentReading?.sigil_pattern && (
          <div className="flex items-center justify-center py-2">
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-lg text-primary font-mono"
            >
              {currentReading.sigil_pattern}
            </motion.div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSealToJournal}
            className="flex-1"
            disabled={loading}
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Seal to Journal
          </Button>
        </div>

        {!showMirrorPrompt && currentReading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenMirror()}
            className="w-full text-xs hover:bg-primary/10"
          >
            <Eye className="h-3 w-3 mr-1" />
            Open Mirror
          </Button>
        )}
      </CardContent>

      {/* Mirror Prompt Modal */}
      <AnimatePresence>
        {showMirrorPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 rounded-lg"
          >
            <div className="text-center space-y-3">
              <Sparkles className="h-6 w-6 text-primary mx-auto" />
              <div className="text-sm font-medium">Seal this Truth?</div>
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={handleDirectSeal}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Yes, Seal Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReflectAndSeal}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Reflect First
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLater}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Later
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reflection Modal */}
      <AnimatePresence>
        {showReflectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-background rounded-lg p-6 w-full max-w-md"
            >
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Reflect on Your Truth</h3>
                  <p className="text-sm text-muted-foreground">Add your deeper insights before sealing</p>
                </div>
                
                <Textarea
                  placeholder="What deeper meaning do you see in this truth? How does it connect to your journey?"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="min-h-[100px]"
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleReflectionSeal}
                    disabled={!reflection.trim() || loading}
                    className="flex-1"
                  >
                    Seal with Reflection
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowReflectionModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};