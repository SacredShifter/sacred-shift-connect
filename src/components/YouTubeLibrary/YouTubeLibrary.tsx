import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Clock, Grid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useVideoMetadata } from '@/hooks/useVideoMetadata';
import { VideoGrid } from './VideoGrid';
import { SimpleVideoModal } from './SimpleVideoModal';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { listChannels } from '@/actions/listChannels';
import { listContent } from '@/actions/listContent';
import { ContentSource, ContentItem } from '@/hooks/useContentSources';
import { YouTubeVideo } from '@/types/youtube';
import { mapContentItemToYouTubeVideo } from '@/utils/videoMapping';
import { Skeleton } from '@/components/ui/skeleton';

export const YouTubeLibrary: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    metadata,
    loading: metadataLoading,
    toggleFavorite,
    toggleWatchLater,
  } = useVideoMetadata();

  const [sources, setSources] = useState<ContentSource[]>([]);
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Convert ContentItems to YouTubeVideos whenever videos change
  useEffect(() => {
    const mappedVideos = videos.map(mapContentItemToYouTubeVideo);
    setYoutubeVideos(mappedVideos);
  }, [videos]);

  const observer = useRef<IntersectionObserver>();
  const lastVideoElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextCursor) {
        loadMoreVideos();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, nextCursor]);

  useEffect(() => {
    setLoading(true);
    listChannels()
      .then(setSources)
      .catch(err => toast({ title: "Error fetching channels", description: err.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    setVideos([]);
    setNextCursor(undefined);
    listContent({ sourceId: selectedSource === 'all' ? undefined : selectedSource })
      .then(({ items, nextCursor }) => {
        setVideos(items);
        setNextCursor(nextCursor);
      })
      .catch(err => toast({ title: "Error fetching videos", description: err.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [selectedSource]);

  const loadMoreVideos = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    listContent({ sourceId: selectedSource === 'all' ? undefined : selectedSource, cursor: nextCursor })
      .then(({ items, nextCursor: newCursor }) => {
        setVideos(prev => [...prev, ...items]);
        setNextCursor(newCursor);
      })
      .catch(err => toast({ title: "Error fetching more videos", description: err.message, variant: "destructive" }))
      .finally(() => setIsLoadingMore(false));
  }, [nextCursor, isLoadingMore, selectedSource]);

  const handlePlayVideo = (video: ContentItem) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  const totalLoading = loading || metadataLoading;

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 space-y-6 md:space-y-8">
      {sources.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select a channel..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {sources.map(source => (
                <SelectItem key={source.id} value={source.id}>{source.source_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="all" className="flex items-center gap-2"><Grid className="h-4 w-4" />All Videos</TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2" disabled><Heart className="h-4 w-4" />Favorites</TabsTrigger>
            <TabsTrigger value="watchLater" className="flex items-center gap-2" disabled><Clock className="h-4 w-4" />Watch Later</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Sort by..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date Added</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="views">View Count</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!totalLoading && (
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-sm">{youtubeVideos.length} video{youtubeVideos.length !== 1 ? 's' : ''}</Badge>
        </div>
      )}

      <VideoGrid
        videos={youtubeVideos}
        loading={totalLoading}
        onPlay={(video) => {
          const contentItem = videos.find(item => item.external_id === video.id);
          if (contentItem) {
            handlePlayVideo(contentItem);
          }
        }}
        onWatchLater={toggleWatchLater}
        onFavorite={toggleFavorite}
        metadata={metadata}
        showCTAs={true}
      />
      {isLoadingMore && <div className="flex justify-center"><Skeleton className="w-16 h-16 rounded-full" /></div>}

      <SimpleVideoModal
        video={selectedVideo ? mapContentItemToYouTubeVideo(selectedVideo) : null}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
        onWatchLater={toggleWatchLater}
        onFavorite={toggleFavorite}
        userMetadata={selectedVideo ? metadata[selectedVideo.external_id] : undefined}
      />
    </div>
  );
};