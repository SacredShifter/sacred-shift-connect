import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Upload, Youtube, ExternalLink, TrendingUp } from 'lucide-react';
import { useYouTubePublish } from '@/hooks/useYouTubePublish';
import { useVideoRender, type RenderJob } from '@/hooks/useVideoRender';

interface YouTubePublishDialogProps {
  renderJobId: string;
  trigger?: React.ReactNode;
}

export const YouTubePublishDialog = ({ renderJobId, trigger }: YouTubePublishDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'unlisted' | 'public'>('unlisted');
  const [renderJob, setRenderJob] = useState<RenderJob | null>(null);
  
  const { isPublishing, publishJobs, publishToYouTube, fetchPublishJobs } = useYouTubePublish();
  const { getRenderJob } = useVideoRender();

  useEffect(() => {
    if (open && renderJobId) {
      loadRenderJob();
      fetchPublishJobs(renderJobId);
    }
  }, [open, renderJobId]);

  const loadRenderJob = async () => {
    const job = await getRenderJob(renderJobId);
    setRenderJob(job);
  };

  const handlePublish = async () => {
    if (!renderJob) return;

    try {
      const result = await publishToYouTube(renderJobId, {
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        visibility
      });

      console.log('Published:', result);
      
      // Poll for updates
      const pollInterval = setInterval(async () => {
        const jobs = await fetchPublishJobs(renderJobId);
        const currentJob = jobs.find(job => job.id === result.publishJobId);
        
        if (currentJob && (currentJob.published_at || currentJob.publish_error)) {
          clearInterval(pollInterval);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Publish failed:', error);
    }
  };

  const canPublish = renderJob?.status === 'completed' && title.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Youtube className="w-4 h-4 mr-2" />
            Publish to YouTube
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publish to YouTube</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Render Job Status */}
          {renderJob && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Render Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium capitalize">{renderJob.preset.replace('_', ' ')}</div>
                    <div className="text-sm text-muted-foreground">
                      Created {new Date(renderJob.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant={renderJob.status === 'completed' ? 'default' : 'secondary'}>
                    {renderJob.status}
                  </Badge>
                </div>
                {renderJob.status !== 'completed' && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Video must be rendered before publishing to YouTube
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* YouTube Publish Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">YouTube Settings</CardTitle>
              <CardDescription>
                Configure your video details for YouTube upload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  disabled={!canPublish && renderJob?.status !== 'completed'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  rows={4}
                  disabled={!canPublish && renderJob?.status !== 'completed'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags separated by commas"
                  disabled={!canPublish && renderJob?.status !== 'completed'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="unlisted">Unlisted</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handlePublish} 
                disabled={!canPublish || isPublishing}
                className="w-full"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Publish to YouTube
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Publish History */}
          {publishJobs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publish History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {publishJobs.map((job) => (
                  <div key={job.id} className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Youtube className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{job.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(job.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                  <Badge variant={job.published_at ? 'default' : 'secondary'}>
                    {job.published_at ? 'completed' : job.publish_error ? 'failed' : 'processing'}
                  </Badge>
                        {job.youtube_video_id && job.published_at && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`https://youtube.com/watch?v=${job.youtube_video_id}`, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};