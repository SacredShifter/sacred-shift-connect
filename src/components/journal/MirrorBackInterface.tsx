import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, X, Copy, Heart } from 'lucide-react';

interface MirrorBackInterfaceProps {
  mirrorText: string;
  onClose: () => void;
}

export const MirrorBackInterface: React.FC<MirrorBackInterfaceProps> = ({
  mirrorText,
  onClose
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(mirrorText);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/30 shadow-2xl">
            <CardHeader className="text-center relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute right-2 top-2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
              
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>

              <CardTitle className="text-xl font-light">
                Mirror Back
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Your essence reflected
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 bg-background/50 rounded-lg border border-primary/20"
              >
                <p className="text-foreground italic text-center leading-relaxed">
                  "{mirrorText}"
                </p>
              </motion.div>

              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={onClose}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary"
                >
                  <Heart className="h-4 w-4" />
                  Integrate
                </Button>
              </div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, delay: 0.5 }}
                className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
              />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};