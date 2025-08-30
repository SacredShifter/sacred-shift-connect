import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Infinity, 
  Sparkles, 
  Brain, 
  Heart, 
  Eye,
  X,
  ChevronRight
} from 'lucide-react';

interface BridgeMomentNotificationProps {
  isVisible?: boolean;
  onDismiss?: () => void;
  currentModule?: string;
}

export const BridgeMomentNotification: React.FC<BridgeMomentNotificationProps> = ({
  isVisible = false,
  onDismiss,
  currentModule = 'breath'
}) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="fixed bottom-6 right-6 z-50 max-w-md"
      >
        <Card className="bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-purple-500/10 border-violet-200/30 backdrop-blur-md shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Infinity className="w-5 h-5 text-violet-400" />
                <div>
                  <h3 className="font-semibold text-violet-300 text-sm">Bridge Moment</h3>
                  <p className="text-xs text-muted-foreground">Integration Activated</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onDismiss} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your practice creates bridges between worlds of understanding...
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};