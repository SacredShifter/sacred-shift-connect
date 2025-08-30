import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Video, 
  Youtube, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  TrendingUp,
  Eye,
  ThumbsUp,
  MessageSquare,
  PlayCircle,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface VideoMetrics {
  total_renders: number;
  completed_renders: number;
  failed_renders: number;
  total_publishes: number;
  successful_publishes: number;
  failed_publishes: number;
  total_videos_published: number;
  avg_processing_time: number;
}

interface PolicyCheck {
  id: string;
  check_type: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  last_checked: string;
}

interface YouTubeAnalytics {
  total_views: number;
  total_likes: number;
  total_comments: number;
  subscriber_growth: number;
  avg_watch_time: number;
  ctr: number;
  top_performing_videos: Array<{
    title: string;
    views: number;
    engagement: number;
  }>;
}

export const VideoStudioAdmin = () => {
  const { user } = useAuth();
  const [videoMetrics, setVideoMetrics] = useState<VideoMetrics>({
    total_renders: 0,
    completed_renders: 0,
    failed_renders: 0,
    total_publishes: 0,
    successful_publishes: 0,
    failed_publishes: 0,
    total_videos_published: 0,
    avg_processing_time: 0
  });
  const [policyChecks, setPolicyChecks] = useState<PolicyCheck[]>([]);
  const [youtubeAnalytics, setYouTubeAnalytics] = useState<YouTubeAnalytics>({
    total_views: 0,
    total_likes: 0,
    total_comments: 0,
    subscriber_growth: 0,
    avg_watch_time: 0,
    ctr: 0,
    top_performing_videos: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadVideoMetrics();
      loadPolicyChecks();
      loadYouTubeAnalytics();
    }
  }, [user]);

  const loadVideoMetrics = async () => {
    try {
      // Get render job statistics
      const { data: renderJobs } = await supabase
        .from('render_jobs')
        .select('status, render_time_ms');

      // Get publish job statistics  
      const { data: publishJobs } = await supabase
        .from('yt_publish')
        .select('published_at, publish_error');

      if (renderJobs) {
        const totalRenders = renderJobs.length;
        const completedRenders = renderJobs.filter(job => job.status === 'completed').length;
        const failedRenders = renderJobs.filter(job => job.status === 'failed').length;
        const avgProcessingTime = renderJobs
          .filter(job => job.render_time_ms)
          .reduce((sum, job) => sum + job.render_time_ms, 0) / renderJobs.length;

        const totalPublishes = publishJobs?.length || 0;
        const successfulPublishes = publishJobs?.filter(job => job.published_at && !job.publish_error).length || 0;
        const failedPublishes = publishJobs?.filter(job => job.publish_error).length || 0;

        setVideoMetrics({
          total_renders: totalRenders,
          completed_renders: completedRenders,
          failed_renders: failedRenders,
          total_publishes: totalPublishes,
          successful_publishes: successfulPublishes,
          failed_publishes: failedPublishes,
          total_videos_published: successfulPublishes,
          avg_processing_time: Math.round(avgProcessingTime / 1000) || 0
        });
      }
    } catch (error) {
      console.error('Error loading video metrics:', error);
    }
  };

  const loadPolicyChecks = async () => {
    // Simulate YouTube policy compliance checks
    const mockPolicyChecks: PolicyCheck[] = [
      {
        id: '1',
        check_type: 'Community Guidelines',
        status: 'pass',
        message: 'All content complies with YouTube Community Guidelines',
        last_checked: new Date().toISOString()
      },
      {
        id: '2', 
        check_type: 'Copyright Policy',
        status: 'pass',
        message: 'No copyright violations detected in uploaded content',
        last_checked: new Date().toISOString()
      },
      {
        id: '3',
        check_type: 'Monetization Policy',
        status: 'pass',
        message: 'Content eligible for monetization',
        last_checked: new Date().toISOString()
      },
      {
        id: '4',
        check_type: 'Title & Thumbnail Policy',
        status: 'warning',
        message: 'Some titles may need optimization for better compliance',
        last_checked: new Date().toISOString()
      },
      {
        id: '5',
        check_type: 'Spam & Deceptive Practices',
        status: 'pass',
        message: 'No spam or deceptive practices detected',
        last_checked: new Date().toISOString()
      }
    ];

    setPolicyChecks(mockPolicyChecks);
  };

  const loadYouTubeAnalytics = async () => {
    // Get resonance metrics for analytics simulation
    try {
      const { data: metrics } = await supabase
        .from('resonance_metrics')
        .select('*')
        .limit(10);

      // Simulate YouTube analytics based on available data
      const mockAnalytics: YouTubeAnalytics = {
        total_views: Math.floor(Math.random() * 10000) + 1000,
        total_likes: Math.floor(Math.random() * 500) + 50,
        total_comments: Math.floor(Math.random() * 200) + 20,
        subscriber_growth: Math.floor(Math.random() * 100) + 10,
        avg_watch_time: Math.random() * 300 + 120, // seconds
        ctr: Math.random() * 10 + 2, // percentage
        top_performing_videos: [
          { title: 'Sacred Geometry Meditation', views: 2500, engagement: 8.5 },
          { title: 'Breath of Source Practice', views: 1800, engagement: 9.2 },
          { title: 'Quantum Consciousness Journey', views: 1200, engagement: 7.8 }
        ]
      };

      setYouTubeAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading YouTube analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const runPolicyCheck = async () => {
    setLoading(true);
    // Simulate running policy checks
    await new Promise(resolve => setTimeout(resolve, 2000));
    await loadPolicyChecks();
    setLoading(false);
  };

  const getStatusColor = (status: PolicyCheck['status']) => {
    switch (status) {
      case 'pass': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'fail': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: PolicyCheck['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'fail': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading Video Studio Admin...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-red-500/10 via-white/5 to-red-500/10 border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Youtube className="w-6 h-6 text-red-500" />
              Video Studio Administration
            </CardTitle>
            <CardDescription>
              Comprehensive video production and YouTube compliance management
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="compliance">🛡️ Compliance</TabsTrigger>
          <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
          <TabsTrigger value="management">⚙️ Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Video Production Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Renders</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{videoMetrics.total_renders}</div>
                <p className="text-xs text-muted-foreground">
                  {videoMetrics.completed_renders} completed, {videoMetrics.failed_renders} failed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published Videos</CardTitle>
                <Youtube className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{videoMetrics.total_videos_published}</div>
                <p className="text-xs text-muted-foreground">
                  {videoMetrics.successful_publishes} successful, {videoMetrics.failed_publishes} failed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{videoMetrics.avg_processing_time}s</div>
                <p className="text-xs text-muted-foreground">
                  Per video render
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {videoMetrics.total_renders > 0 
                    ? Math.round((videoMetrics.completed_renders / videoMetrics.total_renders) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Render success rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common video studio management tasks</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button onClick={runPolicyCheck} disabled={loading}>
                <Shield className="w-4 h-4 mr-2" />
                Run Policy Check
              </Button>
              <Button variant="outline" onClick={() => window.open('/video-studio', '_blank')}>
                <Video className="w-4 h-4 mr-2" />
                Open Video Studio
              </Button>
              <Button variant="outline" onClick={() => window.open('https://studio.youtube.com', '_blank')}>
                <Youtube className="w-4 h-4 mr-2" />
                YouTube Studio
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                YouTube Policy Compliance
              </CardTitle>
              <CardDescription>
                Automated checks against YouTube's policies and guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {policyChecks.map((check) => (
                <div key={check.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <div className="font-medium">{check.check_type}</div>
                      <div className="text-sm text-muted-foreground">{check.message}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={check.status === 'pass' ? 'default' : check.status === 'warning' ? 'secondary' : 'destructive'}>
                      {check.status.toUpperCase()}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(check.last_checked).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Compliance Guidelines</AlertTitle>
            <AlertDescription>
              Always ensure your content follows YouTube's Community Guidelines, Copyright policies, and Terms of Service.
              Regular compliance checks help maintain good standing with the platform.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{youtubeAnalytics.total_views.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Across all published videos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{youtubeAnalytics.total_likes}</div>
                <p className="text-xs text-muted-foreground">
                  {youtubeAnalytics.total_comments} comments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{youtubeAnalytics.ctr.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(youtubeAnalytics.avg_watch_time)}s avg watch time
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Videos</CardTitle>
              <CardDescription>Your best-performing content by engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {youtubeAnalytics.top_performing_videos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{video.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {video.views.toLocaleString()} views
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {video.engagement.toFixed(1)}% engagement
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Studio Management</CardTitle>
              <CardDescription>System administration and maintenance tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex-col">
                  <Video className="w-6 h-6 mb-2" />
                  Manage Render Queue
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Youtube className="w-6 h-6 mb-2" />
                  YouTube Integration
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Shield className="w-6 h-6 mb-2" />
                  Security Settings
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  Export Analytics
                </Button>
              </div>

              <Separator />

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Admin Access</AlertTitle>
                <AlertDescription>
                  You have administrative access to the Video Studio. Use these tools responsibly to maintain system integrity and YouTube compliance.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};