import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Circle,
  Crown,
  Waves,
  BookOpen,
  Leaf,
  Eye,
  Users,
  Flame,
  Infinity
} from 'lucide-react';

interface SacredNavigationMandalaProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const modules = [
  { id: 'home', name: 'Sacred Center', path: '/', icon: Crown, x: 0, y: 0 },
  { id: 'breath', name: 'Breath', path: '/breath', icon: Waves, x: 80, y: 0 },
  { id: 'journal', name: 'Journal', path: '/journal', icon: BookOpen, x: 40, y: 69 },
  { id: 'grove', name: 'Grove', path: '/grove', icon: Leaf, x: -40, y: 69 },
  { id: 'meditation', name: 'Meditation', path: '/meditation', icon: Eye, x: -80, y: 0 },
  { id: 'circles', name: 'Circles', path: '/circles', icon: Users, x: -40, y: -69 },
  { id: 'liberation', name: 'Liberation', path: '/liberation', icon: Flame, x: 40, y: -69 }
];

export const SacredNavigationMandala: React.FC<SacredNavigationMandalaProps> = ({
  isOpen = false,
  onClose
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-96 h-96"
          onClick={(e) => e.stopPropagation()}
        >
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: module.x,
                  y: module.y
                }}
                transition={{ delay: index * 0.1 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => {
                  navigate(module.path);
                  onClose?.();
                }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/80 to-purple-600/80 backdrop-blur-sm border-2 border-white/20 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};