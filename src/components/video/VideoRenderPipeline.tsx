import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { VideoRenderDialog } from './VideoRenderDialog';
import { YouTubePublishDialog } from './YouTubePublishDialog';
import { useVideoRender } from '@/hooks/useVideoRender';
import { useYouTubePublish } from '@/hooks/useYouTubePublish';
import { 
  Video, 
  Youtube, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  TrendingUp,
  Eye,
  ThumbsUp
} from 'lucide-react';

interface VideoRenderPipelineProps {
  planId: string;
  planTitle: string;
}

export const VideoRenderPipeline = ({ planId, planTitle }: VideoRenderPipelineProps) => {
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const { renderJobs, fetchRenderJobs } = useVideoRender();
  const { publishJobs, fetchPublishJobs, getResonanceMetrics } = useYouTubePublish();

  useEffect(() => {
    fetchRenderJobs(planId);
    
    // Set up polling for active jobs
    const interval = setInterval(() => {
      const hasActiveJobs = renderJobs.some(job => 
        job.status === 'processing' || job.status === 'queued'
      ) || publishJobs.some(job => 
        !job.published_at && !job.publish_error
      );

      if (hasActiveJobs) {
        fetchRenderJobs(planId);
        // Fetch publish jobs for all completed renders
        renderJobs
          .filter(job => job.status === 'completed')
          .forEach(job => fetchPublishJobs(job.id));
      }
    }, 3000);

    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [planId, renderJobs.length, publishJobs.length]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing': return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const completedRenders = renderJobs.filter(job => job.status === 'completed');
  const latestRender = renderJobs[0];

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5" />
            <span>Video Render Pipeline</span>
          </CardTitle>
          <CardDescription>
            Render videos and publish to YouTube for "{planTitle}"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <VideoRenderDialog
              planId={planId}
              planTitle={planTitle}
              trigger={
                <Button variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Start New Render
                </Button>
              }
            />
            
            {latestRender?.status === 'completed' && (
              <YouTubePublishDialog
                renderJobId={latestRender.id}
                trigger={
                  <Button variant="outline">
                    <Youtube className="w-4 h-4 mr-2" />
                    Publish to YouTube
                  </Button>
                }
              />
            )}
          </div>

          {/* Pipeline Status */}
          {latestRender && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Latest Pipeline Status</span>
                <Badge variant="outline">
                  {latestRender.status === 'completed' ? 'Ready for Publish' : 'In Progress'}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(latestRender.status)}
                  <span className="text-sm">Video Render</span>
                  <Badge variant={latestRender.status === 'completed' ? 'default' : 'secondary'}>
                    {latestRender.status}
                  </Badge>
                </div>
                
                {latestRender.status === 'completed' && (
                  <>
                    <Separator />
                    <div className="flex items-center space-x-2">
                      <Youtube className="w-4 h-4" />
                      <span className="text-sm">YouTube Publish</span>
                      <Badge variant="outline">Ready</Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Renders */}
      {renderJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Render History</CardTitle>
            <CardDescription>
              Recent video renders for this content plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {renderJobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(job.status)}
                  <div>
                    <div className="font-medium capitalize">
                      {job.preset.replace('_', ' ')} Format
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(job.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                  {job.render_time_ms && (
                    <span className="text-sm text-muted-foreground">
                      {Math.round(job.render_time_ms / 1000)}s
                    </span>
                  )}
                  {job.status === 'completed' && (
                    <YouTubePublishDialog
                      renderJobId={job.id}
                      trigger={
                        <Button size="sm" variant="outline">
                          <Youtube className="w-3 h-3 mr-1" />
                          Publish
                        </Button>
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Published Videos */}
      {publishJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Youtube className="w-5 h-5" />
              <span>Published Videos</span>
            </CardTitle>
            <CardDescription>
              Videos published to YouTube from this content plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {publishJobs.map((job) => (
              <div key={job.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Youtube className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Published {job.published_at ? new Date(job.published_at).toLocaleString() : 'In progress'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={job.published_at ? 'default' : 'secondary'}>
                      {job.published_at ? 'completed' : job.publish_error ? 'failed' : 'processing'}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {job.privacy_status || job.visibility}
                    </Badge>
                  </div>
                </div>
                
                {job.youtube_video_id && job.published_at && (
                  <div className="flex items-center space-x-4 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://youtube.com/watch?v=${job.youtube_video_id}`, '_blank')}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Video
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://studio.youtube.com/video/${job.youtube_video_id}/analytics`, '_blank')}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Analytics
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {renderJobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Videos Rendered Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by rendering your first video from this content plan
            </p>
            <VideoRenderDialog
              planId={planId}
              planTitle={planTitle}
              trigger={
                <Button>
                  <Video className="w-4 h-4 mr-2" />
                  Render Your First Video
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};