import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  Heart, 
  Save, 
  X, 
  Sparkles,
  Clock
} from 'lucide-react';
import { useMirrorJournal } from '@/hooks/useMirrorJournal';
import { useToast } from '@/hooks/use-toast';

interface PostMeditationReflectionProps {
  isVisible: boolean;
  onClose: () => void;
  practiceName: string;
  practiceType: string;
  sessionDuration: number; // in minutes
  reflectionPrompt: string;
  className?: string;
}

export const PostMeditationReflection: React.FC<PostMeditationReflectionProps> = ({
  isVisible,
  onClose,
  practiceName,
  practiceType,
  sessionDuration,
  reflectionPrompt,
  className = ''
}) => {
  const [reflection, setReflection] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { createEntry } = useMirrorJournal();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!reflection.trim()) {
      toast({
        title: "Empty Reflection",
        description: "Please share your insights before saving.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      await createEntry({
        title: `${practiceName} Reflection`,
        content: `${reflectionPrompt}\n\n${reflection}`,
        mood_tag: getSessionMoodTag(practiceType),
        chakra_alignment: getSessionChakraAlignment(practiceType),
        is_draft: false
      });

      toast({
        title: "Reflection Saved ✨",
        description: "Your insights have been added to your Mirror Journal",
      });

      setReflection('');
      onClose();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save reflection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    setReflection('');
    onClose();
  };

  // Map practice types to appropriate mood tags and chakra alignments
  const getSessionMoodTag = (type: string): string => {
    const moodMap: Record<string, string> = {
      'breathing': 'Peaceful',
      'loving-kindness': 'Awakening',
      'chakra': 'Energized',
      'mindfulness': 'Reflective',
      'body-scan': 'Grounded'
    };
    return moodMap[type] || 'Reflective';
  };

  const getSessionChakraAlignment = (type: string): string => {
    const chakraMap: Record<string, string> = {
      'breathing': 'Heart',
      'loving-kindness': 'Heart',
      'chakra': 'Crown',
      'mindfulness': 'Third Eye',
      'body-scan': 'Root'
    };
    return chakraMap[type] || 'Heart';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`w-full max-w-lg ${className}`}
          >
            <Card className="bg-background/95 backdrop-blur-md border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg font-sacred">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Sacred Reflection
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {practiceName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {sessionDuration} min
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSkip}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Reflection Prompt */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-primary font-medium text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Reflection Prompt
                  </p>
                  <p className="text-foreground">{reflectionPrompt}</p>
                </div>

                {/* Reflection Input */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Share your insights, sensations, realizations, or any shifts you noticed..."
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={6}
                    className="bg-background/60 border-border/50 focus:border-primary/50 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be saved to your Mirror Journal with automatic tagging
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !reflection.trim()}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save to Journal'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    disabled={isSaving}
                  >
                    Skip
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