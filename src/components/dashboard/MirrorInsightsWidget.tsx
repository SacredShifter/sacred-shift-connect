import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSynchronicityMirror } from '@/hooks/useSynchronicityMirror';
import { Eye, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface MirrorInsightsWidgetProps {
  onOpenMirror: () => void;
}

export const MirrorInsightsWidget = ({ onOpenMirror }: MirrorInsightsWidgetProps) => {
  const { currentReading } = useSynchronicityMirror();

  // Mock data for sealed truths and resonance trends
  const sealedTruths = [
    { id: '1', text: 'Growth emerges through surrendering...', timestamp: '2 hours ago', resonance: 0.92 },
    { id: '2', text: 'Unity consciousness awakening...', timestamp: '1 day ago', resonance: 0.88 },
    { id: '3', text: 'Sacred patterns align with intention...', timestamp: '3 days ago', resonance: 0.85 }
  ];

  const sigils = ['∴', '◊', '⟡', '※', '◈', '⬟'];
  const currentResonance = currentReading?.resonance_score || 0.78;

  return (
    <Card className="bg-gradient-to-br from-background/80 to-background/40 border-primary/20 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Eye className="h-4 w-4 text-primary" />
          Mirror Insights
          <Badge variant="secondary" className="ml-auto text-xs">
            {Math.round(currentResonance * 100)}% resonance
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Resonance Trend */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Resonance Trend</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-1 rounded-full ${
                  i < Math.floor(currentResonance * 5) ? 'bg-primary' : 'bg-primary/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sealed Truths Feed */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Recent Sealed Truths
          </h4>
          <div className="space-y-2 max-h-24 overflow-y-auto">
            {sealedTruths.slice(0, 2).map((truth) => (
              <motion.div
                key={truth.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs p-2 rounded bg-secondary/30 border border-secondary/50"
              >
                <p className="text-muted-foreground line-clamp-1">{truth.text}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground/70">{truth.timestamp}</span>
                  <span className="text-xs text-primary">{Math.round(truth.resonance * 100)}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sigil Collection */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Sacred Patterns</h4>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {sigils.slice(0, 4).map((sigil, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-xs text-primary"
                >
                  {sigil}
                </motion.div>
              ))}
              <div className="w-6 h-6 rounded-full bg-secondary/30 border border-secondary/50 flex items-center justify-center text-xs text-muted-foreground">
                +{sigils.length - 4}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenMirror}
              className="h-7 px-2 text-xs hover:bg-primary/10"
            >
              <Zap className="h-3 w-3 mr-1" />
              Generate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};