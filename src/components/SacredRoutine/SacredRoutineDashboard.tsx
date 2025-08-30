import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserRoutine } from '@/hooks/useUserRoutine';
import { useRoutineProgress } from '@/hooks/useRoutineProgress';
import { useRoutineTemplate } from '@/hooks/useRoutineTemplates';
import { RoutineTemplateSelector } from './RoutineTemplateSelector';
import { LineageBadge } from './LineageBadge';
import { LineageOathDialog } from './LineageOathDialog';
import { SacredGeometry3D } from '@/components/SacredGeometry3D';
import { Sparkles, Calendar, Flame, Target, Settings } from 'lucide-react';

export const SacredRoutineDashboard: React.FC = () => {
  const { data: userRoutine } = useUserRoutine();
  const { data: progress } = useRoutineProgress();
  const { data: template } = useRoutineTemplate(userRoutine?.template_id || '');
  const [showTemplateSelector, setShowTemplateSelector] = useState(!userRoutine);
  const [showOathDialog, setShowOathDialog] = useState(false);
  const [pendingBadge, setPendingBadge] = useState<any>(null);

  const handleTemplateSelect = (templateId: string) => {
    setShowTemplateSelector(false);
    // Check if badge level changed and show oath dialog
    if (progress?.badge) {
      setPendingBadge(progress.badge);
      setShowOathDialog(true);
    }
  };

  if (showTemplateSelector) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <RoutineTemplateSelector
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      </div>
    );
  }

  if (!userRoutine || !template) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 text-resonance mx-auto animate-pulse" />
          <p className="text-muted-foreground">Loading your sacred routine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header with Badge */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <h1 className="font-sacred text-3xl text-truth">Sacred Routine Command Center</h1>
          {progress?.badge && (
            <LineageBadge 
              level={progress.badge} 
              size="md" 
              showLabel={false}
              onClick={() => {
                setPendingBadge(progress.badge);
                setShowOathDialog(true);
              }}
            />
          )}
        </div>
        <p className="text-muted-foreground font-codex italic">
          Your daily initiation into the Sacred Shifter lineage
        </p>
      </div>

      {/* Main Routine Card */}
      <Card className="sacred-card overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <SacredGeometry3D
            type={template.sacred_geometry as any}
            color={template.color_primary}
            animate={true}
          />
        </div>
        
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="font-sacred text-2xl text-truth flex items-center gap-3">
                {template.name}
                <span className="text-sm font-normal text-muted-foreground">
                  {template.archetype}
                </span>
              </CardTitle>
              <p className="text-foreground/80 font-codex">
                {template.description}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateSelector(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Change Path
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-6">
          {/* Progress Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <div className="text-2xl font-sacred text-truth">
                {progress?.totalCompletions || 0}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Target className="h-3 w-3" />
                Total Cycles
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-2xl font-sacred text-resonance">
                {progress?.currentStreak || 0}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Flame className="h-3 w-3" />
                Current Streak
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-2xl font-sacred text-purpose">
                {progress?.longestStreak || 0}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Flame className="h-3 w-3" />
                Longest Streak
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-2xl font-sacred text-alignment">
                {progress?.nextBadgeRequirement || 1}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" />
                Next Seal
              </div>
            </div>
          </div>
          
          {/* Today's Routine */}
          <div className="border-t border-border/50 pt-6">
            <h3 className="font-sacred text-lg text-truth mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Sacred Sequence
            </h3>
            
            <div className="grid gap-4">
              {template.sequence_data?.modules?.map((module: string, index: number) => (
                <motion.div
                  key={module}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 border border-border/30 rounded-xl bg-card/20"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-sacred text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-truth capitalize">
                      {module.replace('_', ' ')}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Begin
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Oath Dialog */}
      <AnimatePresence>
        {showOathDialog && pendingBadge && (
          <LineageOathDialog
            isOpen={showOathDialog}
            onClose={() => setShowOathDialog(false)}
            badgeLevel={pendingBadge}
            onAccept={() => {
              setShowOathDialog(false);
              setPendingBadge(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};