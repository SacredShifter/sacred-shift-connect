import React from 'react';
import { useTaoFlowProgress } from '@/hooks/useTaoFlowProgress';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

interface TaoProgressBadgeProps {
  variant?: 'compact' | 'detailed';
}

export const TaoProgressBadge: React.FC<TaoProgressBadgeProps> = ({ variant = 'compact' }) => {
  const { currentStage, getCombinedProgress } = useTaoFlowProgress();
  const progress = getCombinedProgress();

  const stageNames = {
    wuWei: 'Wu Wei',
    yinYang: 'Yin/Yang',
    advancedCeremony: 'Advanced',
    returnToSilence: 'Silence'
  };

  const stageColors = {
    wuWei: 'default',
    yinYang: 'secondary',
    advancedCeremony: 'outline',
    returnToSilence: 'destructive'
  } as const;

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={stageColors[currentStage]}>
          {stageNames[currentStage]}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {progress.unlockedModulesCount} modules
        </span>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sacred Journey</span>
            <Badge variant={stageColors[currentStage]}>
              {stageNames[currentStage]}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Modules: {progress.unlockedModulesCount}</div>
            <div>Practices: {progress.totalPractices}</div>
          </div>

          {progress.nextUnlock && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                Next: {progress.nextUnlock.nextTier}
              </div>
              <Progress 
                value={(progress.nextUnlock.current / progress.nextUnlock.needed) * 100} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                {progress.nextUnlock.current} / {progress.nextUnlock.needed}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};