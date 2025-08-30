import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSacredSeals, useCurrentSeal, useSacredProgress, useCheckSeals } from '@/hooks/useSacredInitiations';
import { LineageBadge, BadgeLevel } from '@/components/SacredRoutine/LineageBadge';
import { Sparkles, Crown, Shield, Gem, Star, Flame } from 'lucide-react';

export const SacredInitiationTest: React.FC = () => {
  const { data: seals, isLoading: sealsLoading } = useSacredSeals();
  const { data: currentSeal } = useCurrentSeal();
  const { data: progress, isLoading: progressLoading } = useSacredProgress();
  const { mutate: checkSeals, isPending: checking } = useCheckSeals();

  const handleCheckSeals = () => {
    checkSeals();
  };

  if (sealsLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Sparkles className="h-8 w-8 animate-spin text-resonance" />
        <span className="ml-2">Loading Sacred Lineage System...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-truth/30">
        <CardHeader>
          <CardTitle className="font-sacred text-2xl text-truth flex items-center gap-3">
            <Crown className="h-6 w-6 text-resonance" />
            Sacred Shifter Initiation System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Seal Display */}
          <div className="space-y-4">
            <h3 className="font-sacred text-lg text-truth">Current Sacred Seal</h3>
            {currentSeal ? (
              <div className="flex items-center gap-4 p-4 bg-resonance/10 rounded-lg">
                <LineageBadge 
                  level={currentSeal.seal.seal_name as BadgeLevel}
                  size="lg"
                  showLabel={true}
                />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Awarded: {new Date(currentSeal.awarded_at).toLocaleDateString()}
                  </p>
                  <Badge variant={currentSeal.ceremony_completed ? "default" : "secondary"}>
                    {currentSeal.ceremony_completed ? "Ceremony Complete" : "Ceremony Pending"}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 bg-muted/20 rounded-lg">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No seals earned yet. Begin your sacred journey!</p>
              </div>
            )}
          </div>

          {/* Sacred Progress */}
          <div className="space-y-4">
            <h3 className="font-sacred text-lg text-truth">Sacred Progress</h3>
            {progress ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center space-y-1">
                  <div className="text-2xl font-sacred text-truth">{progress.total_routines}</div>
                  <div className="text-xs text-muted-foreground">Total Routines</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-sacred text-resonance">{progress.current_streak}</div>
                  <div className="text-xs text-muted-foreground">Current Streak</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-sacred text-purpose">{progress.unique_module_types}</div>
                  <div className="text-xs text-muted-foreground">Module Types</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-sacred text-alignment">{progress.community_contributions}</div>
                  <div className="text-xs text-muted-foreground">Community</div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No progress data available</p>
            )}
          </div>

          {/* Check Seals Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleCheckSeals}
              disabled={checking}
              className="bg-resonance hover:bg-resonance/80"
            >
              {checking ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Checking Sacred Progress...
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Check for New Seals
                </>
              )}
            </Button>
          </div>

          {/* All Sacred Seals */}
          <div className="space-y-4">
            <h3 className="font-sacred text-lg text-truth">Sacred Lineage Seals</h3>
            <div className="grid gap-4">
              {seals?.map((seal) => (
                <div key={seal.id} className="flex items-center gap-4 p-4 border border-border/30 rounded-lg">
                  <LineageBadge 
                    level={seal.seal_name as BadgeLevel}
                    size="md"
                    showLabel={false}
                  />
                  <div className="flex-1">
                    <h4 className="font-sacred text-truth capitalize">{seal.seal_name} Seal</h4>
                    <p className="text-sm text-muted-foreground">{seal.description_text}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      Requires: {seal.minimum_routines} routines
                      {seal.requires_module_diversity && " • Module diversity"}
                      {seal.requires_community_contribution && " • Community contributions"}
                      {seal.requires_streak_days > 0 && ` • ${seal.requires_streak_days} day streak`}
                      {seal.requires_journal_entries > 0 && ` • ${seal.requires_journal_entries} journal entries`}
                      {seal.requires_circle_leadership && " • Circle leadership"}
                    </div>
                  </div>
                  <Badge variant="outline">
                    Order {seal.seal_order}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};