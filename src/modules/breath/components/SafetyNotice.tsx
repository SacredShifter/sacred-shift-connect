import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SafetyNoticeProps {
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: () => void;
}

export function SafetyNotice({ isOpen, onClose, onAcknowledge }: SafetyNoticeProps) {
  const [hasRead, setHasRead] = useState(false);
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  // Cleanup intersection observer on unmount
  useEffect(() => {
    return () => {
      // Clean up any remaining observers
      const elements = document.querySelectorAll('[data-scroll-detector]');
      elements.forEach((el: any) => {
        if (el._cleanup) {
          el._cleanup();
        }
      });
    };
  }, []);

  const contraindications = [
    'Heart disease or severe cardiovascular conditions',
    'Severe hypertension (high blood pressure)',
    'Epilepsy or seizure disorders',
    'Pregnancy (especially first trimester)',
    'Recent surgery or injuries',
    'Active panic disorder or severe anxiety',
    'Respiratory conditions (severe asthma, COPD)',
    'Recent psychedelic or psychiatric medication changes'
  ];

  const safetyGuidelines = [
    'Always breathe at your own pace - never force it',
    'Stop immediately if you feel dizzy, lightheaded, or tingling',
    'Sit or lie down in a comfortable, safe position',
    'Have water nearby and stay hydrated',
    'Never practice while driving or operating machinery',
    'If you feel overwhelmed, return to normal breathing',
    'Consider having a trusted person nearby for support',
    'Stop if you experience chest pain or vision changes'
  ];

  const handleAcknowledge = async () => {
    if (!hasRead) {
      toast.error('Please read the full safety notice by scrolling to the bottom');
      return;
    }

    setIsAcknowledging(true);
    
    try {
      // Save acknowledgment to localStorage for now (since table doesn't exist)
      localStorage.setItem('sacred_ventilation_safety_ack', new Date().toISOString());
      
      onAcknowledge();
      onClose();
      toast.success('Safety guidelines acknowledged');
    } catch (error) {
      console.error('Error saving acknowledgment:', error);
      toast.error('Failed to save acknowledgment. Please try again.');
    } finally {
      setIsAcknowledging(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            Sacred Ventilation - Safety Notice
          </DialogTitle>
          <DialogDescription>
            Please read this important safety information before beginning your practice.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-400 mb-2">
                  Intense Breathwork Practice
                </h4>
                <p className="text-sm text-muted-foreground">
                  Sacred Ventilation involves rapid, deep, continuous breathing that can produce 
                  intense physical and emotional effects. This practice is not suitable for everyone.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contraindications */}
          <div className="space-y-3">
            <h4 className="font-semibold text-red-400 flex items-center gap-2">
              <X className="h-4 w-4" />
              Do NOT practice if you have:
            </h4>
            <ul className="space-y-2">
              {contraindications.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <X className="h-3 w-3 text-red-500 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Safety guidelines */}
          <div className="space-y-3">
            <h4 className="font-semibold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Safety Guidelines:
            </h4>
            <ul className="space-y-2">
              {safetyGuidelines.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (contraindications.length + index) * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Expected effects */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">
              What to Expect
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              You may experience:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Tingling in hands, feet, or around the mouth</li>
              <li>• Feeling of energy or vibrations in the body</li>
              <li>• Emotional releases (crying, laughter, etc.)</li>
              <li>• Temporary dizziness or lightheadedness</li>
              <li>• Intense feelings or memories arising</li>
              <li>• Sense of expansion or altered consciousness</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              These are normal responses. If they become overwhelming, slow down or stop.
            </p>
          </div>

          {/* Emergency guidance */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-red-400 mb-2">
              When to Stop Immediately
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Severe dizziness or loss of balance</li>
              <li>• Chest pain or heart palpitations</li>
              <li>• Difficulty breathing normally after stopping</li>
              <li>• Vision changes or fainting</li>
              <li>• Severe emotional distress or panic</li>
              <li>• Any feeling that something is "wrong"</li>
            </ul>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hasRead ? 0 : 1 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              Please scroll to read all safety information
            </p>
          </motion.div>

          {/* Acknowledgment section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-start gap-3">
              <Checkbox
                id="safety-read"
                checked={hasRead}
                onCheckedChange={(checked) => setHasRead(checked === true)}
                className="mt-1"
              />
              <label
                htmlFor="safety-read"
                className="text-sm text-foreground leading-relaxed cursor-pointer"
              >
                I have read and understand all safety information above. I confirm that 
                I do not have any of the listed contraindications and will practice responsibly, 
                stopping immediately if I experience any concerning symptoms.
              </label>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleAcknowledge}
                disabled={!hasRead || isAcknowledging}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isAcknowledging ? 'Saving...' : 'I Understand & Agree'}
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll detection */}
        <div
          className="absolute bottom-0 left-0 w-1 h-1 opacity-0"
          data-scroll-detector
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting) {
                    setHasRead(true);
                  }
                },
                { threshold: 1.0 }
              );
              observer.observe(el);
              // Store cleanup function to call later
              (el as any)._cleanup = () => observer.disconnect();
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}