import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Atom, 
  Eye, 
  Sparkles, 
  Lock,
  Unlock
} from 'lucide-react';
import { useTeachingProgress } from '@/hooks/useTeachingProgress';

export const TeachingProgressIndicator: React.FC = () => {
  const { getUnlockedTiers, getProgressToNextUnlock, getEngagementStats } = useTeachingProgress();
  
  const unlockedTiers = getUnlockedTiers();
  const nextUnlock = getProgressToNextUnlock();
  const stats = getEngagementStats();

  const tiers = [
    {
      id: 'scientific',
      label: 'Scientific',
      icon: <Atom className="w-4 h-4" />,
      unlocked: unlockedTiers.scientific,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'metaphysical',
      label: 'Metaphysical',
      icon: <Eye className="w-4 h-4" />,
      unlocked: unlockedTiers.metaphysical,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'esoteric',
      label: 'Esoteric',
      icon: <Sparkles className="w-4 h-4" />,
      unlocked: unlockedTiers.esoteric,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  if (!nextUnlock) {
    return (
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Unlock className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold text-primary">All Teachings Unlocked</p>
                <p className="text-sm text-muted-foreground">
                  {stats.totalSessions} sessions completed • {stats.engagedModules} modules explored
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {tiers.map((tier) => (
                <Badge key={tier.id} variant="secondary" className="gap-1">
                  {tier.icon}
                  <span className="hidden sm:inline">{tier.label}</span>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = (nextUnlock.current / nextUnlock.needed) * 100;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-sm">Teaching Progress</span>
            </div>
            <div className="flex gap-1">
              {tiers.map((tier) => (
                <Badge 
                  key={tier.id} 
                  variant={tier.unlocked ? "default" : "outline"}
                  className="gap-1"
                >
                  {tier.unlocked ? tier.icon : <Lock className="w-3 h-3" />}
                  <span className="hidden sm:inline text-xs">{tier.label}</span>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{nextUnlock.description}</span>
              <span className="font-semibold">{nextUnlock.current}/{nextUnlock.needed}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};