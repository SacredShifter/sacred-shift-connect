import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SynchronicityMirror } from '@/components/synchronicity/SynchronicityMirror';

export const FloatingMirrorToggle = () => {
  const [isMirrorOpen, setIsMirrorOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          onClick={() => setIsMirrorOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 hover:bg-primary/30 shadow-lg"
        >
          <Eye className="h-5 w-5 text-primary" />
        </Button>
      </motion.div>

      <SynchronicityMirror
        isVisible={isMirrorOpen}
        onToggle={() => setIsMirrorOpen(false)}
        journalContent=""
      />
    </>
  );
};