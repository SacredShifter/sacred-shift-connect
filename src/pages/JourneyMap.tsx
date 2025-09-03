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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Sacred Journey Map</h1>
        <p className="text-muted-foreground">
          Track your progress through the stages of sacred development
        </p>
      </div>

      {/* Current Stage */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Current Stage
            </CardTitle>
            <Badge variant="default" className="text-base px-3 py-1">
              {stageNames[currentStage]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{progress.unlockedModulesCount}</div>
              <div className="text-sm text-muted-foreground">Unlocked Modules</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{progress.totalPractices}</div>
              <div className="text-sm text-muted-foreground">Total Practices</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{progress.teachingLevel}</div>
              <div className="text-sm text-muted-foreground">Teaching Level</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{progress.sessionsCompleted}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Available Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              These modules are currently unlocked and available for practice:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {unlockedModules.map(module => (
                <div 
                  key={module.path}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => window.location.href = module.path}
                >
                  <span className="text-sm font-medium">{module.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    Available
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Milestone */}
      {progress.nextUnlock && (
        <Card>
          <CardHeader>
            <CardTitle>Next Milestone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{progress.nextUnlock.description}</span>
                <span className="text-sm text-muted-foreground">
                  {progress.nextUnlock.current} / {progress.nextUnlock.needed}
                </span>
              </div>
              <Progress 
                value={(progress.nextUnlock.current / progress.nextUnlock.needed) * 100} 
                className="h-2"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Complete the required activities to unlock the next stage of your journey
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JourneyMap;