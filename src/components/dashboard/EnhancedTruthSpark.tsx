import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Eye, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSynchronicityMirror } from '@/hooks/useSynchronicityMirror';
import { useMirrorJournal } from '@/hooks/useMirrorJournal';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface EnhancedTruthSparkProps {
  onOpenMirror: (content?: string) => void;
}

export const EnhancedTruthSpark = ({ onOpenMirror }: EnhancedTruthSparkProps) => {
  const { currentReading, loading } = useSynchronicityMirror();
  const { entries, createEntry } = useMirrorJournal();
  const { toast } = useToast();
  const [showMirrorPrompt, setShowMirrorPrompt] = useState(false);

  // Get recent journal content from actual entries
  const recentJournalEntry = entries.length > 0 
    ? entries[0].content 
    : "Today I felt a deep connection to the patterns emerging in my practice...";
  const currentResonance = currentReading?.resonance_score || 0.78;

  const handleSealToJournal = async () => {
    try {
      // Create a new journal entry with the current truth spark content
      await createEntry({
        title: 'Truth Spark Insight',
        content: recentJournalEntry,
        mood_tag: 'truth_spark',
        chakra_alignment: 'heart',
        is_draft: false
      });

      toast({
        title: "Truth Sealed",
        description: "Your insight has been preserved in your journal",
      });

      // Optionally open the mirror for deeper reflection
      setShowMirrorPrompt(true);
    } catch (error) {
      console.error('Failed to seal truth to journal:', error);
      toast({
        title: "Error",
        description: "Failed to save to journal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleYesReflect = () => {
    // Generate mirror reading and open it
    onOpenMirror(recentJournalEntry);
    setShowMirrorPrompt(false);
  };

  const handleLater = () => {
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
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Seal to Journal
          </Button>
          
          <Link to="/journal">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              Open Journal
            </Button>
          </Link>
          
          {showMirrorPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 rounded-lg"
            >
              <div className="text-center space-y-3">
                <div className="text-sm font-medium">Generate Mirror Reading?</div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleYesReflect}
                    disabled={loading}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Yes, Reflect
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLater}
                  >
                    Later
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
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
    </Card>
  );
};