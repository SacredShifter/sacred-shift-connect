import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Zap, Target, Info, Sparkles, TrendingUp, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfile } from '@/hooks/useProfile';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';

interface ResonanceChainProps {
  className?: string;
}

export const ResonanceChain: React.FC<ResonanceChainProps> = ({ className }) => {
  const { data: profile } = useProfile();
  const { state: dailyState } = useDailyRoutine();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Calculate resonance chain data from user profile
  const streakDays = profile?.streak_days || 0;
  const synchronicityScore = profile?.synchronicity_score || 0;
  const synchronicityChain = profile?.synchronicity_chain || [];
  const currentStage = profile?.current_stage || 'Entry';
  const consciousnessLevel = profile?.consciousness_level || 1;

  // Calculate resonance level based on multiple factors
  const calculateResonanceLevel = () => {
    const streakWeight = Math.min(streakDays * 2, 50); // Max 50 points from streak
    const synchronicityWeight = synchronicityScore * 0.3; // Max 30 points from synchronicity
    const stageWeight = {
      'Entry': 10,
      'Expansion': 25,
      'Integration': 40,
      'Crown': 60,
      'Beyond': 80
    }[currentStage] || 10;
    
    return Math.min(streakWeight + synchronicityWeight + stageWeight, 100);
  };

  const resonanceLevel = calculateResonanceLevel();
  const isResonanceHigh = resonanceLevel >= 70;
  const isResonanceMedium = resonanceLevel >= 40 && resonanceLevel < 70;

  // Get resonance status message
  const getResonanceStatus = () => {
    if (isResonanceHigh) {
      return {
        message: "Sacred Alignment Active",
        color: "text-emerald-500",
        icon: Sparkles
      };
    } else if (isResonanceMedium) {
      return {
        message: "Harmonic Flow Building",
        color: "text-blue-500",
        icon: TrendingUp
      };
    } else {
      return {
        message: "Foundation Strengthening",
        color: "text-amber-500",
        icon: Target
      };
    }
  };

  const resonanceStatus = getResonanceStatus();
  const StatusIcon = resonanceStatus.icon;

  return (
    <>
      <Card className={`bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-primary">Resonance Chain</h3>
                <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-primary/10">
                      <Info className="h-3 w-3 text-primary/60" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Resonance Chain Explained
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <p>
                        Your Resonance Chain tracks your spiritual momentum through Sacred Shifter. 
                        It combines your daily practice streak, synchronicity experiences, and consciousness evolution.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span><strong>Streak Days:</strong> {streakDays} consecutive days of practice</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-primary" />
                          <span><strong>Synchronicity Score:</strong> {synchronicityScore}/100</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span><strong>Current Stage:</strong> {currentStage}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Higher resonance creates deeper connections with the Sacred Shifter community 
                        and unlocks advanced consciousness features.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold">{streakDays}</span>
                <span className="text-sm text-muted-foreground">day streak</span>
                <Badge 
                  variant="secondary" 
                  className={`ml-2 ${isResonanceHigh ? 'bg-emerald-500/20 text-emerald-700' : 
                    isResonanceMedium ? 'bg-blue-500/20 text-blue-700' : 'bg-amber-500/20 text-amber-700'}`}
                >
                  {resonanceLevel}%
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <StatusIcon className={`h-4 w-4 ${resonanceStatus.color}`} />
                <span className={resonanceStatus.color}>{resonanceStatus.message}</span>
              </div>

              {/* Synchronicity Chain Preview */}
              {synchronicityChain.length > 0 && (
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Recent patterns:</span>
                  <div className="flex gap-1">
                    {synchronicityChain.slice(-3).map((pattern, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs text-primary"
                      >
                        {pattern}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <motion.div
              animate={{ 
                scale: isResonanceHigh ? [1, 1.1, 1] : 1,
                rotate: isResonanceHigh ? [0, 5, -5, 0] : 0
              }}
              transition={{ 
                duration: 2, 
                repeat: isResonanceHigh ? Infinity : 0,
                ease: "easeInOut" 
              }}
            >
              <Target className="w-8 h-8 text-primary/60" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
