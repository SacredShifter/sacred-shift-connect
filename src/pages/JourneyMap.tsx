import React from 'react';
import { useTaoFlowProgress } from '@/hooks/useTaoFlowProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const JourneyMap: React.FC = () => {
  const { currentStage, getAllUnlockedModules, getCombinedProgress } = useTaoFlowProgress();
  const unlockedModules = getAllUnlockedModules();
  const progress = getCombinedProgress();

  const stageNames = {
    wuWei: 'Wu Wei - Foundation',
    yinYang: 'Yin/Yang Flow - Practice',
    advancedCeremony: 'Advanced Ceremony - Mastery',
    returnToSilence: 'Return to Silence - Service'
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sacred Journey Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Current Stage:</span>
            <Badge variant="default">{stageNames[currentStage]}</Badge>
          </div>
          
          <div className="space-y-2">
            <span>Progress Overview:</span>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Unlocked Modules: {progress.unlockedModulesCount}</div>
              <div>Total Practices: {progress.totalPractices}</div>
              <div>Teaching Level: {progress.teachingLevel}</div>
              <div>Sessions: {progress.sessionsCompleted}</div>
            </div>
          </div>

          <div className="space-y-2">
            <span>Unlocked Modules:</span>
            <div className="flex flex-wrap gap-2">
              {unlockedModules.map(module => (
                <Badge key={module.path} variant="outline">
                  {module.name}
                </Badge>
              ))}
            </div>
          </div>

          {progress.nextUnlock && (
            <div className="space-y-2">
              <span>Next Milestone:</span>
              <div className="text-sm text-muted-foreground">
                {progress.nextUnlock.description}
              </div>
              <Progress value={(progress.nextUnlock.current / progress.nextUnlock.needed) * 100} />
              <div className="text-xs text-muted-foreground">
                {progress.nextUnlock.current} / {progress.nextUnlock.needed}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyMap;