import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  Heart, 
  Brain, 
  Waves, 
  Zap,
  Link2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GAAHardwareTeaserProps {
  onLearnMore?: () => void;
}

export const GAAHardwareTeaser: React.FC<GAAHardwareTeaserProps> = ({ onLearnMore }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-accent/30 bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-12 h-12 border border-primary/30 rounded-full animate-pulse" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border border-accent/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-6 h-6 border border-secondary/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-3 rounded-xl bg-accent/20">
                <Wifi className="w-6 h-6 text-accent" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-xl">Hardware Biofeedback</CardTitle>
                <p className="text-sm text-muted-foreground">Pulse-Fi Add-On Integration</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Coming Soon
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-primary mb-2">
              Unlock Hardware Biofeedback
            </h3>
            <p className="text-sm text-muted-foreground">
              Real-time physiological data directly into your GAA sessions
            </p>
          </div>

          {/* Integration Preview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-background/50">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-xs font-medium">Heart Rate</div>
              <div className="text-xs text-muted-foreground">Live BPM</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <Brain className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-xs font-medium">HRV Analysis</div>
              <div className="text-xs text-muted-foreground">Coherence</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <Waves className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-xs font-medium">Breath Rate</div>
              <div className="text-xs text-muted-foreground">Rhythm</div>
            </div>
          </div>

          {/* Connection Flow */}
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Wifi className="w-3 h-3" />
              Pulse-Fi
            </div>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Link2 className="w-3 h-3" />
              Wi-Fi
            </div>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="w-3 h-3" />
              GAA Engine
            </div>
          </div>

          {/* Features Preview */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Auto-adapt audio to your state</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-muted-foreground">Real-time coherence visualization</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-muted-foreground">Group resonance detection</span>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full border-accent/30 text-accent hover:bg-accent/10"
              onClick={onLearnMore}
            >
              Learn More About Pulse-Fi
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};