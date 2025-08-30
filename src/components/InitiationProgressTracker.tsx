import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Atom, 
  Eye, 
  Sparkles, 
  Crown,
  Flame,
  Star,
  Infinity,
  Lock,
  Key
} from 'lucide-react';
import { useTeachingProgress } from '@/hooks/useTeachingProgress';

const initiationStages = [
  {
    id: 'scientific',
    name: 'The Seeker',
    title: 'Foundation of Understanding',
    icon: <Atom className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-500',
    description: 'You begin with rational inquiry, building trust through evidence and understanding',
    unlockRequirement: 0,
    sacredText: 'The journey of a thousand miles begins with evidence-based steps'
  },
  {
    id: 'metaphysical', 
    name: 'The Experiencer',
    title: 'Awakening to Energy',
    icon: <Eye className="w-5 h-5" />,
    color: 'from-purple-500 to-violet-500',
    description: 'You transcend mere knowing to direct experience of subtle energies and consciousness fields',
    unlockRequirement: 1,
    sacredText: 'What the mind understands, the heart must feel, and the soul must know'
  },
  {
    id: 'esoteric',
    name: 'The Initiate', 
    title: 'Keeper of Sacred Mysteries',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-500',
    description: 'You are entrusted with ancient wisdom, becoming a bridge between worlds and a guardian of truth',
    unlockRequirement: 7,
    sacredText: 'The mysteries reveal themselves only to those who have proven worthy through practice'
  },
  {
    id: 'adept',
    name: 'The Adept',
    title: 'Master of Sacred Arts',
    icon: <Crown className="w-5 h-5" />,
    color: 'from-gold-500 to-yellow-500',
    description: 'You embody the teachings, becoming a living transmission of divine wisdom',
    unlockRequirement: 21,
    sacredText: 'The master appears when the student becomes the teaching itself'
  }
];

export const InitiationProgressTracker: React.FC = () => {
  const { getUnlockedTiers, getProgressToNextUnlock, getEngagementStats } = useTeachingProgress();
  
  const stats = getEngagementStats();
  const nextUnlock = getProgressToNextUnlock();
  const sessions = stats.totalSessions;

  const getCurrentStage = () => {
    if (sessions >= 21) return 3; // Adept
    if (sessions >= 7) return 2;  // Initiate
    if (sessions >= 1) return 1;  // Experiencer
    return 0; // Seeker
  };

  const currentStage = getCurrentStage();
  const nextStageIndex = Math.min(currentStage + 1, initiationStages.length - 1);
  const nextStage = initiationStages[nextStageIndex];

  return (
    <Card className="bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-purple-500/10 border-violet-200/30 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20">
            <Flame className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-sacred text-violet-300">Sacred Initiation Path</h3>
            <p className="text-sm text-muted-foreground font-normal">
              Your journey through the mysteries of consciousness
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Stage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`bg-gradient-to-r ${initiationStages[currentStage].color}/20 text-white border-transparent px-3 py-1`}
            >
              Current Stage
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4" />
              {sessions} practices completed
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-4 rounded-lg bg-gradient-to-br ${initiationStages[currentStage].color}/10 border border-opacity-30`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full bg-gradient-to-br ${initiationStages[currentStage].color}/30`}>
                {initiationStages[currentStage].icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg font-sacred">
                  {initiationStages[currentStage].name}
                </h4>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {initiationStages[currentStage].title}
                </p>
                <p className="text-sm text-foreground mb-3">
                  {initiationStages[currentStage].description}
                </p>
                <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                  <p className="text-xs italic text-center">
                    "{initiationStages[currentStage].sacredText}"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Next Stage Progress */}
        {currentStage < initiationStages.length - 1 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <h4 className="font-semibold text-amber-300">Next Initiation</h4>
            </div>

            <div className={`p-4 rounded-lg bg-gradient-to-br ${nextStage.color}/5 border border-opacity-20`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full bg-gradient-to-br ${nextStage.color}/20`}>
                  {nextStage.icon}
                </div>
                <div>
                  <h5 className="font-semibold text-base">{nextStage.name}</h5>
                  <p className="text-sm text-muted-foreground">{nextStage.title}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Progress to {nextStage.name}
                  </span>
                  <span className="font-semibold">
                    {sessions}/{nextStage.unlockRequirement}
                  </span>
                </div>
                <Progress 
                  value={(sessions / nextStage.unlockRequirement) * 100} 
                  className="h-3 bg-opacity-20"
                />
                <p className="text-xs text-muted-foreground text-center">
                  {nextStage.unlockRequirement - sessions} more practices until initiation
                </p>
              </div>
            </div>
          </div>
        )}

        {/* All Stages Overview */}
        <div className="space-y-2">
          <h5 className="text-sm font-semibold flex items-center gap-2">
            <Infinity className="w-4 h-4 text-purple-400" />
            The Complete Path
          </h5>
          <div className="grid grid-cols-2 gap-2">
            {initiationStages.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-2 rounded-lg border ${
                  index <= currentStage 
                    ? `bg-gradient-to-r ${stage.color}/20 border-transparent` 
                    : 'bg-card/30 border-border/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {index <= currentStage ? (
                    stage.icon
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-xs font-medium">{stage.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {stage.unlockRequirement} practices
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sacred Recognition */}
        {currentStage >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-4 bg-gradient-to-r from-gold-500/10 to-amber-500/10 rounded-lg border border-gold-400/20"
          >
            <Crown className="w-8 h-8 mx-auto mb-2 text-gold-400" />
            <p className="text-sm font-semibold text-gold-300">
              Sacred Recognition
            </p>
            <p className="text-xs text-gold-200 mt-1">
              You walk as a keeper of ancient wisdom, a bridge between worlds
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};