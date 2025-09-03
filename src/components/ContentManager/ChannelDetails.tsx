import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChannelThumbnail } from '@/components/ui/ImageWithFallback';
import {
  Play,
  Pause,
  RefreshCw,
  Settings,
  Trash2,
  ExternalLink,
  Users,
  Video,
  Eye,
  Calendar,
  BarChart3
} from 'lucide-react';
import { ContentSource } from '@/hooks/useContentSources';
import { useToast } from '@/hooks/use-toast';

interface ChannelDetailsProps {
  source: ContentSource;
  onToggle: (id: string, active: boolean) => Promise<void>;
  onSync: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ChannelDetails: React.FC<ChannelDetailsProps> = ({
  source,
  onToggle,
  onSync,
  onDelete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async (active: boolean) => {
    setIsLoading(true);
    try {
      await onToggle(source.id, active);
    } catch (error) {
      toast({
        title: "Error updating channel",
        description: "Failed to update channel status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await onSync(source.id);
    } catch (error) {
      toast({
        title: "Error syncing channel",
        description: "Failed to start content sync",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this channel? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      await onDelete(source.id);
      toast({
        title: "Channel deleted",
        description: "Channel has been removed from your library"
      });
    } catch (error) {
      toast({
        title: "Error deleting channel",
        description: "Failed to delete channel",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'paused': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'syncing': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'error': return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const getLastSyncText = (lastSync: string | null) => {
    if (!lastSync) return 'Never';

    const lastSyncDate = new Date(lastSync);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return lastSyncDate.toLocaleDateString();
  };

  const metadata = source.sync_metadata as any; // Assuming metadata might contain channelInfo/Stats
  const channelInfo = metadata?.channelInfo;
  const channelStats = metadata?.channelStats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ChannelThumbnail
                  src={channelInfo?.thumbnailUrl}
                  channelName={source.source_name}
                  size="sm"
                  className="flex-shrink-0"
                />
                {source.source_name}
                <Badge variant="outline" className={getStatusColor(source.sync_status || 'inactive')}>
                  {source.sync_status || 'inactive'}
                </Badge>
              </CardTitle>
              {channelInfo?.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {channelInfo.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(source.source_url || '', '_blank')}
                disabled={!source.source_url}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isLoading || source.sync_status === 'syncing'}
              >
                <RefreshCw className={`w-4 h-4 ${source.sync_status === 'syncing' ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Channel Statistics */}
          {channelStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Video className="w-4 h-4" />
                  <span className="text-xs">Videos</span>
                </div>
                <div className="text-lg font-semibold">{channelStats.totalVideos}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">Views</span>
                </div>
                <div className="text-lg font-semibold">
                  {channelStats.totalViews > 1000000
                    ? `${(channelStats.totalViews / 1000000).toFixed(1)}M`
                    : channelStats.totalViews > 1000
                    ? `${(channelStats.totalViews / 1000).toFixed(1)}K`
                    : channelStats.totalViews
                  }
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs">Avg Views</span>
                </div>
                <div className="text-lg font-semibold">
                  {channelStats.averageViewsPerVideo > 1000000
                    ? `${(channelStats.averageViewsPerVideo / 1000000).toFixed(1)}M`
                    : channelStats.averageViewsPerVideo > 1000
                    ? `${(channelStats.averageViewsPerVideo / 1000).toFixed(1)}K`
                    : Math.round(channelStats.averageViewsPerVideo)
                  }
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Frequency</span>
                </div>
                <div className="text-lg font-semibold">{channelStats.uploadFrequency}</div>
              </div>
            </div>
          )}

          {/* Sync Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Last Sync</Label>
              <p className="font-medium">{getLastSyncText(source.last_sync_at)}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Next Sync</Label>
              <p className="font-medium">
                {source.next_sync_at
                  ? new Date(source.next_sync_at).toLocaleString()
                  : 'Not scheduled'
                }
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Sync Frequency</Label>
              <p className="font-medium">
                {source.sync_frequency_hours
                  ? `Every ${source.sync_frequency_hours} hours`
                  : 'Not set'
                }
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Channel ID</Label>
              <p className="font-mono text-xs bg-muted p-1 rounded">
                {source.external_id}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                id={`sync-${source.id}`}
                checked={source.sync_status === 'active'}
                onCheckedChange={handleToggle}
                disabled={isLoading}
              />
              <Label htmlFor={`sync-${source.id}`}>
                {source.sync_status === 'active' ? 'Active' : 'Paused'}
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* TODO: Open settings modal */}}
                disabled={isLoading}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
