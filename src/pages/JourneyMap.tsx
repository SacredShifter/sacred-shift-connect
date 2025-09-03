import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaoFlowProgress } from '@/hooks/useTaoFlowProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, Clock, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { TaoStage } from '@/config/taoFlowConfig';

// Local interface for Journey Map modules
interface JourneyModule {
  name: string;
  path: string;
  icon: string;
  description: string;
  unlock: { type: 'auto' | 'practices' | 'community' | 'mastery' | 'teaching'; needed?: number };
}

const JourneyMap: React.FC = () => {
  const navigate = useNavigate();
  const { currentStage, getAllUnlockedModules, getCombinedProgress, isModuleUnlocked } = useTaoFlowProgress();
  const unlockedModules = getAllUnlockedModules();
  const progress = getCombinedProgress();

  const stageNames = {
    wuWei: 'Wu Wei - Foundation',
    yinYang: 'Yin/Yang Flow - Practice', 
    advancedCeremony: 'Advanced Ceremony - Mastery',
    returnToSilence: 'Return to Silence - Service'
  };

  const stageDescriptions = {
    wuWei: 'Begin your journey with foundational practices and consciousness exploration',
    yinYang: 'Deepen practice through active engagement and community connection',
    advancedCeremony: 'Master advanced techniques and lead transformational experiences',
    returnToSilence: 'Share wisdom and guide others in their consciousness evolution'
  };

  // Get all modules organized by stage
  const modulesByStage: Record<TaoStage, JourneyModule[]> = {
    wuWei: [
      { name: 'Dashboard', path: '/dashboard', icon: 'BarChart3', description: 'Your consciousness evolution center', unlock: { type: 'auto' } },
      { name: 'Home', path: '/', icon: 'Home', description: 'Sacred community hub', unlock: { type: 'auto' } },
      { name: 'Breath of Source', path: '/breath', icon: 'Wind', description: 'Sacred breathing practices', unlock: { type: 'auto' } },
      { name: 'Journal', path: '/journal', icon: 'BookOpen', description: 'Inner exploration and reflection', unlock: { type: 'practices', needed: 2 } }
    ],
    yinYang: [
      { name: 'Meditation', path: '/meditation', icon: 'Sparkles', description: 'Individual and collective practice', unlock: { type: 'practices', needed: 5 } },
      { name: 'The Grove', path: '/grove', icon: 'TreePine', description: 'Community rituals & ceremonies', unlock: { type: 'practices', needed: 7 } },
      { name: 'Feed', path: '/feed', icon: 'Rss', description: 'Social hub and community connection', unlock: { type: 'community', needed: 1 } },
      { name: 'Circles', path: '/circles', icon: 'Users', description: 'Deep community engagement', unlock: { type: 'community', needed: 3 } }
    ],
    advancedCeremony: [
      { name: 'GAA Engine', path: '/gaa', icon: 'Waves', description: 'Advanced consciousness harmonization', unlock: { type: 'mastery', needed: 10 } },
      { name: 'Messages', path: '/messages', icon: 'MessageCircle', description: 'Private consciousness communication', unlock: { type: 'community', needed: 5 } },
      { name: 'Codex', path: '/codex', icon: 'Archive', description: 'Wisdom archives exploration', unlock: { type: 'mastery', needed: 15 } },
      { name: '3D Learning', path: '/learning-3d', icon: 'Sparkles', description: 'Interactive consciousness exploration', unlock: { type: 'mastery', needed: 20 } }
    ],
    returnToSilence: [
      { name: 'Consciousness Mapper', path: '/constellation', icon: 'Stars', description: 'AI-powered consciousness cartography', unlock: { type: 'mastery', needed: 25 } },
      { name: 'Library', path: '/library', icon: 'Video', description: 'Sacred content curation hub', unlock: { type: 'teaching', needed: 5 } }
    ]
  };

  const getModuleStatus = (module: JourneyModule) => {
    const unlocked = isModuleUnlocked(module.path);
    
    if (unlocked) {
      return { status: 'unlocked', icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10' };
    }
    
    // Check if close to unlocking
    const isClose = progress.nextUnlock?.description?.includes(module.name);
    if (isClose) {
      return { status: 'close', icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' };
    }
    
    return { status: 'locked', icon: Lock, color: 'text-gray-400', bgColor: 'bg-gray-400/10' };
  };

  const handleModuleClick = (module: JourneyModule) => {
    const { status } = getModuleStatus(module);
    
    if (status === 'unlocked') {
      navigate(module.path);
    } else {
      // Show unlock requirements or guide user to needed actions
      console.log(`Module ${module.name} is locked. Complete requirements to unlock.`);
    }
  };

  const getStageProgress = (stage: TaoStage) => {
    const stageModules = modulesByStage[stage];
    const unlockedCount = stageModules.filter(m => isModuleUnlocked(m.path)).length;
    return (unlockedCount / stageModules.length) * 100;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Sacred Journey Map</h1>
        <p className="text-muted-foreground">
          Your personalized path through consciousness evolution stages
        </p>
      </div>

      {/* Current Stage Overview */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Current Stage
            </CardTitle>
            <Badge variant="default" className="text-base px-3 py-1">
              {stageNames[currentStage]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {stageDescriptions[currentStage]}
          </p>
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

      {/* Journey Stages */}
      <div className="space-y-6">
        {Object.entries(modulesByStage).map(([stage, modules]) => {
          const stageKey = stage as TaoStage;
          const stageProgress = getStageProgress(stageKey);
          const isCurrentStage = currentStage === stageKey;
          const isCompleted = stageProgress === 100;
          
          return (
            <Card key={stage} className={`${isCurrentStage ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      isCompleted ? 'bg-green-500' : 
                      isCurrentStage ? 'bg-primary animate-pulse' : 
                      'bg-gray-300'
                    }`} />
                    <CardTitle className="flex items-center gap-2">
                      {stageNames[stageKey]}
                      {isCurrentStage && <Badge variant="outline">Current</Badge>}
                      {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {Math.round(stageProgress)}% Complete
                    </span>
                    <Progress value={stageProgress} className="w-20 h-2" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {stageDescriptions[stageKey]}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {modules.map(module => {
                    const { status, icon: StatusIcon, color, bgColor } = getModuleStatus(module);
                    const isUnlocked = status === 'unlocked';
                    
                    return (
                      <Card 
                        key={module.path}
                        className={`transition-all cursor-pointer hover:scale-[1.02] ${
                          isUnlocked ? 'hover:shadow-md border-primary/20' : 'opacity-60'
                        } ${bgColor}`}
                        onClick={() => handleModuleClick(module)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <StatusIcon className={`w-4 h-4 ${color}`} />
                              <div>
                                <h4 className="font-medium">{module.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {module.description}
                                </p>
                              </div>
                            </div>
                            {isUnlocked && (
                              <ArrowRight className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Next Steps */}
      {progress.nextUnlock && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Next Milestone
            </CardTitle>
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
              Continue your practices to unlock new modules and advance to the next stage
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JourneyMap;