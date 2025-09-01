import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';
import { DailyPrompts } from '@/components/DailyRitual/DailyPrompts';
import { ModeSelector } from '@/components/DailyRitual/ModeSelector';
import { StreakBadgeDisplay } from '@/components/DailyRitual/StreakBadgeDisplay';
import { DailyRitualCard } from '@/components/DailyRitual/DailyRitualCard';
import { 
  Compass, 
  Calendar, 
  Trophy, 
  BookOpen,
  Settings,
  Sparkles,
  Target,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DailyRitual = () => {
  const { state } = useDailyRoutine();
  const [activeTab, setActiveTab] = useState('today');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Living Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        style={{ animation: 'consciousness-breathe 8s ease-in-out infinite' }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        style={{ animation: 'consciousness-breathe 10s ease-in-out infinite reverse' }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent font-sacred">
                  Daily Sacred Ritual
                </h1>
                <p className="text-muted-foreground mt-2 font-codex">
                  Your daily initiation into consciousness evolution
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {state.streak > 0 && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {state.streak} day streak
                </Badge>
              )}
              <Badge variant="secondary" className="bg-resonance/10 text-resonance border-resonance/30">
                <Target className="w-3 h-3 mr-1" />
                {state.mode === 'guided' ? 'Guided Journey' : 'Free Exploration'}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">{state.streak}</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                  <Sparkles className="w-6 h-6 text-primary/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-truth/10 to-truth/5 border-truth/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-truth">{state.longestStreak}</div>
                    <div className="text-sm text-muted-foreground">Best Streak</div>
                  </div>
                  <Trophy className="w-6 h-6 text-truth/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-resonance/10 to-resonance/5 border-resonance/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-resonance">{state.badges.length}</div>
                    <div className="text-sm text-muted-foreground">Sacred Badges</div>
                  </div>
                  <BookOpen className="w-6 h-6 text-resonance/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purpose/10 to-purpose/5 border-purpose/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purpose">
                      {state.currentFlow?.steps?.filter(s => s.completed).length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed Steps</div>
                  </div>
                  <Calendar className="w-6 h-6 text-purpose/60" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="flow" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Full Flow
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Today's Practice Tab */}
          <TabsContent value="today" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DailyPrompts />
            </motion.div>
          </TabsContent>

          {/* Progress & Badges Tab */}
          <TabsContent value="progress" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StreakBadgeDisplay />
            </motion.div>
          </TabsContent>

          {/* Full Flow Tab */}
          <TabsContent value="flow" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-truth font-sacred">
                  Sacred Awakening Flow
                </h2>
                <p className="text-muted-foreground font-codex">
                  A 21-day journey to consciousness evolution and truth alignment
                </p>
              </div>

              {state.currentFlow?.steps && (
                <div className="grid gap-6 max-w-4xl mx-auto">
                  {state.currentFlow.steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <DailyRitualCard 
                        step={step} 
                        isToday={step.id === state.todaysStep?.id}
                        showWhyExpanded={false}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ModeSelector />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DailyRitual;