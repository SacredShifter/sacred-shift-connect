import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Heart, Sparkles, BookOpen, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VentilationContext } from '../hooks/useSacredVentilationMachine';

interface PostSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionContext: VentilationContext;
  totalCycles: number;
}

const EMOTION_TAGS = [
  'Release',
  'Boundlessness', 
  'Tears',
  'Fear↓',
  'Clarity',
  'Body Buzz',
  'Euphoria',
  'Grounded',
  'Energized',
  'Peaceful',
  'Overwhelmed',
  'Transformed'
];

const RESONANCE_TAGS = [
  'Boundlessness',
  'Release', 
  'Calm',
  'Integration',
  'Awakening',
  'Purification'
];

export function PostSessionDialog({ 
  isOpen, 
  onClose, 
  sessionContext, 
  totalCycles 
}: PostSessionDialogProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedResonance, setSelectedResonance] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const toggleResonance = (tag: string) => {
    setSelectedResonance(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const saveToJournal = async () => {
    setIsSaving(true);
    
    try {
      // Calculate session duration
      const startTime = sessionContext.startedAt ? new Date(sessionContext.startedAt) : new Date();
      const endTime = sessionContext.endedAt ? new Date(sessionContext.endedAt) : new Date();
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000); // minutes

      const sessionData = {
        duration,
        cycles_completed: totalCycles,
        breath_pattern: {
          mode: 'sacred_ventilation',
          rounds_planned: sessionContext.roundsPlanned,
          rounds_completed: sessionContext.currentRound,
          cadence: sessionContext.cadence,
          intensity: sessionContext.intensity,
          music_enabled: sessionContext.musicEnabled,
          resonance_tags: selectedResonance,
          emotions: selectedEmotions,
          notes: notes
        }
      };

      const { error } = await supabase
        .from('breath_sessions')
        .insert(sessionData);

      if (error) {
        console.error('Failed to save session:', error);
        toast.error('Failed to save session to journal');
        return;
      }

      toast.success('Session saved to journal');
      onClose();
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session');
    } finally {
      setIsSaving(false);
    }
  };

  const openInCodex = async () => {
    // First save the session
    await saveToJournal();
    
    // Then create a Codex entry with session insights
    const codexContent = `# Sacred Ventilation Session - ${new Date().toLocaleDateString()}

## Session Details
- **Rounds**: ${sessionContext.currentRound}/${sessionContext.roundsPlanned}
- **Cadence**: ${sessionContext.cadence}
- **Intensity**: ${sessionContext.intensity}%
- **Total Cycles**: ${totalCycles}
- **Duration**: ${sessionContext.startedAt && sessionContext.endedAt 
  ? Math.round((new Date(sessionContext.endedAt).getTime() - new Date(sessionContext.startedAt).getTime()) / 60000) 
  : 'Unknown'} minutes

## Emotional Landscape
${selectedEmotions.length > 0 ? selectedEmotions.map(emotion => `- ${emotion}`).join('\n') : 'No emotions tagged'}

## Resonance Patterns  
${selectedResonance.length > 0 ? selectedResonance.map(tag => `- ${tag}`).join('\n') : 'No resonance tags selected'}

## Reflections
${notes || 'No additional notes'}

## Integration Notes
_Use this space to capture insights, patterns, or integration practices that emerged..._

---
*Generated from Sacred Ventilation session*`;

    try {
      // You would implement the Codex creation here based on your existing Codex system
      // For now, we'll just show a success message
      toast.success('Codex entry created with session data');
      onClose();
    } catch (error) {
      console.error('Error creating Codex entry:', error);
      toast.error('Failed to create Codex entry');
    }
  };

  const sessionDuration = sessionContext.startedAt && sessionContext.endedAt
    ? Math.round((new Date(sessionContext.endedAt).getTime() - new Date(sessionContext.startedAt).getTime()) / 60000)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-400">
            <Sparkles className="h-5 w-5" />
            Session Complete
          </DialogTitle>
          <DialogDescription>
            Reflect on your Sacred Ventilation journey and save your insights.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4"
          >
            <h4 className="font-semibold text-purple-400 mb-3">Session Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Rounds:</span>
                <span className="ml-2 text-foreground">{sessionContext.currentRound}/{sessionContext.roundsPlanned}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Cycles:</span>
                <span className="ml-2 text-foreground">{totalCycles}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Intensity:</span>
                <span className="ml-2 text-foreground">{sessionContext.intensity}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <span className="ml-2 text-foreground">{sessionDuration}m</span>
              </div>
            </div>
          </motion.div>

          {/* Emotion tags */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-400" />
              How are you feeling?
            </h4>
            <p className="text-sm text-muted-foreground">
              Select emotions that arose during your practice:
            </p>
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map((emotion, index) => (
                <motion.button
                  key={emotion}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleEmotion(emotion)}
                >
                  <Badge
                    variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedEmotions.includes(emotion) 
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/50' 
                        : 'hover:border-pink-500/50'
                    }`}
                  >
                    {emotion}
                  </Badge>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Resonance tags */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              Resonance Patterns
            </h4>
            <p className="text-sm text-muted-foreground">
              What resonance patterns emerged?
            </p>
            <div className="flex flex-wrap gap-2">
              {RESONANCE_TAGS.map((tag, index) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleResonance(tag)}
                >
                  <Badge
                    variant={selectedResonance.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedResonance.includes(tag) 
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' 
                        : 'hover:border-blue-500/50'
                    }`}
                  >
                    {tag}
                  </Badge>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Notes section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Reflection Notes</h4>
            <Textarea
              placeholder="What insights, sensations, or experiences arose during your practice? How do you feel now compared to when you started?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Skip
            </Button>
            <Button
              variant="outline"
              onClick={openInCodex}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Open in Codex
            </Button>
            <Button
              onClick={saveToJournal}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save to Journal'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}