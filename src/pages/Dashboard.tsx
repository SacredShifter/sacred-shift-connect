import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardMetrics } from '@/components/Dashboard/DashboardMetrics';
import { ActivityFeed } from '@/components/Dashboard/ActivityFeed';
import { ProgressRings } from '@/components/Dashboard/ProgressRings';
import { MoodTimeline } from '@/components/Dashboard/MoodTimeline';

const Dashboard = () => {
  const { user } = useAuth();

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
                Sacred Journey Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">Track your consciousness evolution and spiritual growth</p>
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

        {/* Top Action Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                  <h3 className="font-semibold text-accent mb-1">Next Practice</h3>
                  <p className="text-sm text-muted-foreground">Morning Meditation</p>
                </div>
                <Link to="/meditation">
                  <Button size="sm" className="bg-accent hover:bg-accent/90">
                    Start
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-secondary mb-1">Truth Spark</h3>
                  <p className="text-sm text-muted-foreground">Quick reflection</p>
                </div>
                <Link to="/journal">
                  <Button size="sm" variant="outline" className="border-secondary/30 text-secondary hover:bg-secondary/10">
                    <Plus className="w-3 h-3 mr-1" />
                    Seal to Journal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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

        {/* Community & Support Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span className="text-sm">7-Day Journey Streak</span>
                  </div>
                  <Badge variant="outline" className="text-xs">In Progress</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Community Pulse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Collective Meditations Today</span>
                  <span className="font-semibold">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sacred Circles Active</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Global Resonance</span>
                  <div className="flex items-center gap-2">
                    <Progress value={78} className="w-16 h-2" />
                    <span className="text-sm font-semibold">78%</span>
                  </div>
                </div>
                <Link to="/circles" className="block">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Join Community
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;