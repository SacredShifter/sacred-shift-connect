import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Heart, 
  Target, 
  Zap,
  Star,
  Clock,
  Trophy,
  Activity,
  ChevronRight,
  Plus,
  User,
  Settings as SettingsIcon,
  BarChart3,
  Waves
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardMetrics } from '@/components/Dashboard/DashboardMetrics';
import { ActivityFeed } from '@/components/Dashboard/ActivityFeed';
import { ProgressRings } from '@/components/Dashboard/ProgressRings';
import { MoodTimeline } from '@/components/Dashboard/MoodTimeline';
import { ProfileDashboard } from '@/components/Profile/ProfileDashboard';
import { ProfileSetupFlow } from '@/components/Profile/ProfileSetupFlow';
import { useProfile } from '@/hooks/useProfile';
import Settings from '@/pages/Settings';
import { MirrorInsightsWidget } from '@/components/dashboard/MirrorInsightsWidget';
import { EnhancedTruthSpark } from '@/components/dashboard/EnhancedTruthSpark';
import { FloatingMirrorToggle } from '@/components/dashboard/FloatingMirrorToggle';
import { SynchronicityMirror } from '@/components/synchronicity/SynchronicityMirror';
import { DailyResonanceWeather } from '@/components/dashboard/DailyResonanceWeather';
import { CommunityMirrorPulse } from '@/components/dashboard/CommunityMirrorPulse';
import { GlowWrapper } from '@/components/dashboard/GlowWrapper';
import { GAAControlPanel } from '@/components/dashboard/GAAControlPanel';
import { GAAQuickAccess } from '@/components/dashboard/GAAQuickAccess';
import { GAADashboard } from '@/components/gaa/GAADashboard';
import { GAAAudioErrorBoundary } from '@/components/gaa/GAAAudioErrorBoundary';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { state: dailyState } = useDailyRoutine();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [isMirrorOpen, setIsMirrorOpen] = useState(false);
  const [mirrorContent, setMirrorContent] = useState('');

  const handleProfileEdit = () => {
    setShowProfileSetup(true);
  };

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
  };

  const handleOpenMirror = (content?: string) => {
    if (content) setMirrorContent(content);
    setIsMirrorOpen(true);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background/95 to-primary/5">
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Sacred Command Center
              </h1>
              <p className="text-muted-foreground mt-2">Your unified consciousness evolution hub</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Star className="w-3 h-3 mr-1" />
                100% Free
              </Badge>
              <Link to="/support">
                <Button variant="outline" size="sm" className="border-accent/30 text-accent hover:bg-accent/10">
                  <Heart className="w-4 h-4 mr-2" />
                  Support the Shift
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Setup Modal */}
        {showProfileSetup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <ProfileSetupFlow
                existingProfile={profile}
                mode={profile ? 'edit' : 'create'}
                onComplete={handleProfileSetupComplete}
              />
            </div>
          </div>
        )}

        {/* Tabbed Interface */}
        <Tabs defaultValue="journey" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="journey" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Journey
            </TabsTrigger>
            <TabsTrigger value="gaa" className="flex items-center gap-2">
              <Waves className="w-4 h-4" />
              GAA Engine
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Journey Tab Content */}
          <TabsContent value="journey" className="space-y-8">
            {/* Top Action Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Resonance Chain</h3>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-2xl font-bold">5</span>
                        <span className="text-sm text-muted-foreground">day streak</span>
                      </div>
                    </div>
                    <Target className="w-8 h-8 text-primary/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-accent mb-1">Today's Practice</h3>
                      <p className="text-sm text-muted-foreground">
                        {dailyState.todaysStep?.title || 'Sacred Ritual Available'}
                      </p>
                    </div>
                    <Link to="/daily-ritual">
                      <Button size="sm" className="bg-accent hover:bg-accent/90">
                        Begin
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <GlowWrapper elementId="truth-spark">
                <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20 rounded-lg">
                  <EnhancedTruthSpark onOpenMirror={handleOpenMirror} />
                </div>
              </GlowWrapper>

              <DailyResonanceWeather />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Today's Journey & Quick Actions */}
              <div className="lg:col-span-1 space-y-6">
                {/* Today's Journey */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Today's Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link to="/meditation" className="block">
                      <div className="p-4 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 hover:border-teal-500/40 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-teal-500">
                              <Heart className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium">Meditation</h4>
                              <p className="text-sm text-muted-foreground">Expand consciousness</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-teal-500" />
                        </div>
                      </div>
                    </Link>

                    <Link to="/grove" className="block">
                      <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500">
                              <Activity className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium">Breath of Source</h4>
                              <p className="text-sm text-muted-foreground">Sacred breathing</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-emerald-500" />
                        </div>
                      </div>
                    </Link>

                    <Link to="/journal" className="block">
                      <div className="p-4 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-500">
                              <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium">Mirror Journal</h4>
                              <p className="text-sm text-muted-foreground">Inner reflection</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-violet-500" />
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                {/* Progress Rings */}
                <ProgressRings />
              </div>

              {/* Center Column - Metrics & Activity */}
              <div className="lg:col-span-2 space-y-6">
                {/* Dashboard Metrics */}
                <DashboardMetrics />
                
                {/* Activity Feed */}
                <ActivityFeed />
                
                {/* Mood Timeline */}
                <MoodTimeline />
              </div>
            </div>

            {/* GAA Engine Section - Consolidated */}
            <div className="mb-8">
              <GlowWrapper elementId="gaa-engine">
                <GAAQuickAccess />
              </GlowWrapper>
            </div>

            {/* Community & Support Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlowWrapper elementId="sacred-achievements">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      Sacred Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-sm">First Meditation Complete</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm">Mirror Mystic</span>
                        </div>
                        <Badge variant="outline" className="text-xs">2/5</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </GlowWrapper>

              <GlowWrapper elementId="mirror-insights">
                <MirrorInsightsWidget onOpenMirror={handleOpenMirror} />
              </GlowWrapper>

              <GlowWrapper elementId="community-pulse">
                <CommunityMirrorPulse />
              </GlowWrapper>
            </div>
          </TabsContent>

          {/* GAA Engine Tab Content */}
          <TabsContent value="gaa" className="space-y-8">
            <GAAAudioErrorBoundary>
              <GAADashboard />
            </GAAAudioErrorBoundary>
          </TabsContent>

          {/* Profile Tab Content */}
          <TabsContent value="profile">
            {profileLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Loading your sacred profile...</p>
                </div>
              </div>
            ) : profile ? (
              <ProfileDashboard 
                profile={profile} 
                onEdit={handleProfileEdit}
              />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No Profile Found</h3>
                <p className="text-muted-foreground mb-4">Create your sacred profile to begin your journey</p>
                <Button onClick={handleProfileEdit}>
                  Create Profile
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab Content */}
          <TabsContent value="settings">
            <div className="max-w-4xl mx-auto">
              <Settings />
            </div>
          </TabsContent>
        </Tabs>

        {/* Floating Mirror Toggle */}
        <FloatingMirrorToggle />

        {/* Synchronicity Mirror */}
        <SynchronicityMirror
          isVisible={isMirrorOpen}
          onToggle={() => setIsMirrorOpen(false)}
          journalContent={mirrorContent}
        />
      </div>
    </div>
  );
};

export default Dashboard;