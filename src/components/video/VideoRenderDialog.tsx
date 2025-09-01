import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Video, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useVideoRender } from '@/hooks/useVideoRender';

interface VideoRenderDialogProps {
  planId: string;
  planTitle: string;
  trigger?: React.ReactNode;
  onRenderComplete?: (renderJobId: string) => void;
}

const presetOptions = [
  { value: 'long_16x9', label: 'Long Form (16:9)', description: 'YouTube landscape format' },
  { value: 'short_9x16', label: 'Short Form (9:16)', description: 'YouTube Shorts / TikTok format' },
  { value: 'square_1x1', label: 'Square (1:1)', description: 'Instagram / social media format' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'failed': return 'destructive';
    case 'processing': return 'warning';
    default: return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="w-4 h-4" />;
    case 'failed': return <XCircle className="w-4 h-4" />;
    case 'processing': return <Loader2 className="w-4 h-4 animate-spin" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export const VideoRenderDialog = ({ 
  planId, 
  planTitle, 
  trigger,
  onRenderComplete 
}: VideoRenderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('long_16x9');
  const { isRendering, renderJobs, startRender, fetchRenderJobs } = useVideoRender();

  const handleStartRender = async () => {
    try {
      const renderJobId = await startRender(planId, { preset: selectedPreset as any });
      onRenderComplete?.(renderJobId);
      
      // Poll for updates
      const pollInterval = setInterval(async () => {
        const jobs = await fetchRenderJobs(planId);
        const currentJob = jobs.find(job => job.id === renderJobId);
        
        if (currentJob && (currentJob.status === 'completed' || currentJob.status === 'failed')) {
          clearInterval(pollInterval);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Render failed:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      fetchRenderJobs(planId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Video className="w-4 h-4 mr-2" />
            Render Video
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Render Video: {planTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Render Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Render Configuration</CardTitle>
              <CardDescription>
                Choose the video format and settings for your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preset">Video Format</Label>
                <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select video format" />
                  </SelectTrigger>
                  <SelectContent>
                    {presetOptions.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{preset.label}</span>
                          <span className="text-sm text-muted-foreground">{preset.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleStartRender} 
                disabled={isRendering}
                className="w-full"
              >
                {isRendering ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Starting Render...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Render
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Render History */}
          {renderJobs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Render History</CardTitle>
                <CardDescription>
                  Previous and current render jobs for this content plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {renderJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <div className="font-medium capitalize">{job.preset.replace('_', ' ')}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(job.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(job.status) as any}>
                        {job.status}
                      </Badge>
                  {job.render_time_ms && (
                    <span className="text-sm text-muted-foreground">
                      {Math.round(job.render_time_ms / 1000)}s
                    </span>
                  )}
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