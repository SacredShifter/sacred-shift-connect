import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MeditationPrompt {
  beginning: string;
  midpoint: string;
  closing: string;
}

interface MeditationPromptsProps {
  isActive: boolean;
  sessionProgress: number; // 0-100
  prompts: MeditationPrompt;
  practiceColor?: string;
}

export const MeditationPrompts: React.FC<MeditationPromptsProps> = ({
  isActive,
  sessionProgress,
  prompts,
  practiceColor = 'from-primary to-secondary'
}) => {
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptPhase, setPromptPhase] = useState<'beginning' | 'midpoint' | 'closing' | null>(null);

  useEffect(() => {
    if (!isActive) {
      setShowPrompt(false);
      setCurrentPrompt('');
      setPromptPhase(null);
      return;
    }

    let phase: 'beginning' | 'midpoint' | 'closing' | null = null;
    let prompt = '';

    // Determine which phase we're in and show appropriate prompt
    if (sessionProgress >= 0 && sessionProgress <= 10 && promptPhase !== 'beginning') {
      phase = 'beginning';
      prompt = prompts.beginning;
    } else if (sessionProgress >= 40 && sessionProgress <= 60 && promptPhase !== 'midpoint') {
      phase = 'midpoint';
      prompt = prompts.midpoint;
    } else if (sessionProgress >= 85 && sessionProgress <= 95 && promptPhase !== 'closing') {
      phase = 'closing';
      prompt = prompts.closing;
    }

    if (phase && prompt && phase !== promptPhase) {
      setPromptPhase(phase);
      setCurrentPrompt(prompt);
      setShowPrompt(true);

      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => {
        setShowPrompt(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [isActive, sessionProgress, prompts, promptPhase]);

  return (
    <AnimatePresence>
      {showPrompt && currentPrompt && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-x-4 top-1/3 z-40 pointer-events-none"
        >
          <motion.div
            className={`mx-auto max-w-md bg-gradient-to-br ${practiceColor}/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center shadow-2xl`}
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(139, 92, 246, 0.3)",
                "0 0 30px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(139, 92, 246, 0.3)"
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-truth font-medium text-lg leading-relaxed"
            >
              {currentPrompt}
            </motion.p>
            
            {/* Subtle breathing indicator */}
            <motion.div
              className="w-2 h-2 bg-primary rounded-full mx-auto mt-4"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};