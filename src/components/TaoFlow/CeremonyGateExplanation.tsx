import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Key, Star, Heart } from 'lucide-react';

interface CeremonyGateExplanationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CeremonyGateExplanation: React.FC<CeremonyGateExplanationProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            What are Ceremony Gates?
          </DialogTitle>
          <DialogDescription>
            Understanding the sacred thresholds in your spiritual journey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Sacred Thresholds
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ceremony Gates are special entry points to advanced modules that require 
              intention, preparation, and commitment. Unlike regular modules that unlock 
              automatically through practice, these require a conscious choice to enter 
              sacred space.
            </p>
          </div>

          {/* How they work */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              How They Work
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <div>
                  <p className="text-sm font-medium">Prerequisites Met</p>
                  <p className="text-xs text-muted-foreground">
                    Complete the required practices and reach the necessary level
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <div>
                  <p className="text-sm font-medium">Preparation Phase</p>
                  <p className="text-xs text-muted-foreground">
                    Take a moment to set your intention and prepare mentally
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <div>
                  <p className="text-sm font-medium">Enter Sacred Space</p>
                  <p className="text-xs text-muted-foreground">
                    Cross the threshold with conscious awareness and commitment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why they exist */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Sacred Purpose
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Advanced teachings require more than just technique - they need reverence, 
              intention, and readiness. Ceremony Gates ensure you approach these deeper 
              practices with the proper mindset and commitment they deserve.
            </p>
          </div>

          {/* Examples */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Examples of Gated Modules:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Advanced energy work and transmission</li>
              <li>• Sacred geometry and ritual practices</li>
              <li>• Group facilitation and teaching protocols</li>
              <li>• Deep meditation and void practices</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Button onClick={onClose}>
              I Understand
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};