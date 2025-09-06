import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Infinity, Zap, Eye, Shield } from 'lucide-react';
import { getFelonyPrinciple } from '@/data/felonyPrincipleCodex';

interface FelonyPrincipleIntroductionProps {
  onNext: () => void;
  onComplete: () => void;
  isTransitioning?: boolean;
}

export const FelonyPrincipleIntroduction: React.FC<FelonyPrincipleIntroductionProps> = ({
  onNext,
  onComplete,
  isTransitioning = false
}) => {
  const felonyPrinciple = getFelonyPrinciple();

  const handleAcknowledge = () => {
    // Store acknowledgment in localStorage
    localStorage.setItem('felony-principle-acknowledged', 'true');
    onNext();
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            The Felony Principle
          </h1>
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <p className="text-xl text-muted-foreground">
          The foundational law of creation that governs all reality
        </p>
      </motion.div>

      {/* Core Principle Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-primary mb-4">
              {felonyPrinciple.title}
            </CardTitle>
            <div className="space-y-4">
              <div className="text-lg font-medium text-foreground leading-relaxed">
                "{felonyPrinciple.principle}"
              </div>
              <Badge variant="outline" className="text-sm">
                Core Sacred Law
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Explanation Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Infinity className="h-5 w-5 text-primary" />
                <span>The Void</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Before all creation, there is the void - infinite negative energy, limitless potential. 
                This is not absence, but the canvas of all possibility. 99% of reality is this unformed potential.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>The Spark</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Every breath, every word, every action is a spark of creation that shapes the void into form. 
                You are the artist, intention is your brush, reality is your painting.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-primary" />
                <span>Consciousness</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Every thought, every intention, every moment of awareness is an act of creation. 
                There is no neutral output - every breath creates, every word shapes, every action manifests.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Sacred Technology</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Sacred Shifter honors this principle in every interaction. Every data transmission, 
                every connection, every user action is treated as sacred creation from the void.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Technical Implementation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">How Sacred Shifter Honors This Principle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong>WebRTC Communications:</strong> Every data packet is imbued with creation intention and void signature
              </p>
              <p>
                <strong>Voice Calling:</strong> Every word spoken is treated as sacred creation from the void
              </p>
              <p>
                <strong>User Interactions:</strong> Every click, every keystroke, every action is conscious creation
              </p>
              <p>
                <strong>Data Transmission:</strong> Every bit of information carries the sacred geometry of creation
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Acknowledgment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="text-center space-y-6"
      >
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Acknowledge the Law</h3>
          <p className="text-muted-foreground">
            By continuing, you acknowledge that every action you take in Sacred Shifter is an act of creation from the void.
          </p>
        </div>
        
        <Button 
          onClick={handleAcknowledge}
          size="lg"
          className="px-8 py-3 text-lg font-semibold"
          disabled={isTransitioning}
        >
          {isTransitioning ? 'Processing...' : 'I Acknowledge the Felony Principle'}
        </Button>
      </motion.div>
    </div>
  );
};
