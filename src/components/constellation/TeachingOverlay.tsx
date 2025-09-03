import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface TeachingOverlayProps {
  message: string;
  onComplete: () => void;
}

export const TeachingOverlay: React.FC<TeachingOverlayProps> = ({
  message,
  onComplete
}) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div className="sacred-card max-w-md text-center">
        <p className="text-truth font-sacred">{message}</p>
      </div>
    </motion.div>
  );
};