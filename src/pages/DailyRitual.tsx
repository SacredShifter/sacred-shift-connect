import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';
import { TodaysPracticeInterface } from '@/components/DailyRitual/TodaysPracticeInterface';
import { StreamlinedPracticeCard } from '@/components/DailyRitual/StreamlinedPracticeCard';
import { StreakBadgeDisplay } from '@/components/DailyRitual/StreakBadgeDisplay';
import { ModeSelector } from '@/components/DailyRitual/ModeSelector';
import { 
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
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Daily Practices
              </h1>
              <p className="text-muted-foreground mt-1">
                Evidence-based consciousness evolution
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{state.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {state.currentFlow?.steps.filter(s => s.completed).length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {state.currentFlow?.steps.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Total Practices</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              All Practices
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
              <TodaysPracticeInterface />
            </motion.div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StreakBadgeDisplay />
            </motion.div>
          </TabsContent>

          {/* All Practices Tab */}
          <TabsContent value="all" className="space-y-8">
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
                  Science-backed daily rituals for safe consciousness evolution
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
                      <StreamlinedPracticeCard 
                        step={step} 
                        isToday={step.id === state.todaysStep?.id}
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