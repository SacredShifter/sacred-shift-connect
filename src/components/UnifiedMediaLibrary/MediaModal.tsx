import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Clock, Share2, Star, Zap, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  source_platform: string;
  source_url: string;
  category_name?: string;
  featured_priority: number;
  energy_level: number;
  consciousness_level: string;
  genre_tags: string[];
  mood_tags: string[];
  teaching_notes?: string;
}

interface MediaModalProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const sourceIcons: { [key: string]: string } = {
  'youtube': '📺',
  'tiktok': '🎵',
  'facebook': '📘',
  'instagram': '📷',
  'soundcloud': '🎵'
};

const sourceColors: { [key: string]: string } = {
  'youtube': 'bg-red-500/20 text-red-400',
  'tiktok': 'bg-pink-500/20 text-pink-400',
  'facebook': 'bg-blue-500/20 text-blue-400',
  'instagram': 'bg-purple-500/20 text-purple-400',
  'soundcloud': 'bg-orange-500/20 text-orange-400'
};

const consciousnessColors: { [key: string]: string } = {
  'beginner': 'bg-green-500/20 text-green-400',
  'intermediate': 'bg-yellow-500/20 text-yellow-400',
  'advanced': 'bg-orange-500/20 text-orange-400',
  'master': 'bg-purple-500/20 text-purple-400'
};

export const MediaModal: React.FC<MediaModalProps> = ({
  media,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  if (!media) return null;

  const handleWatchNow = () => {
    window.open(media.source_url, '_blank');
  };

  const getEmbedUrl = (url: string, platform: string): string => {
    switch (platform) {
      case 'youtube':
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
      default:
        return url;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-background/95 backdrop-blur-lg border border-border/20">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/20">
            <div className="flex items-center gap-4">
              <Badge 
                className={cn(
                  "px-3 py-1",
                  sourceColors[media.source_platform] || "bg-muted"
                )}
              >
                {sourceIcons[media.source_platform] || '🎬'} {media.source_platform.toUpperCase()}
              </Badge>
              
              {media.featured_priority > 0 && (
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
              
              {media.category_name && (
                <Badge variant="outline">{media.category_name}</Badge>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-background/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-full">
              {/* Video Player */}
              <div className="lg:col-span-2 space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                  {media.source_platform === 'youtube' ? (
                    <iframe
                      src={getEmbedUrl(media.source_url, media.source_platform)}
                      className="w-full h-full"
                      allowFullScreen
                      onLoad={() => setIsLoading(false)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                      <div className="text-center space-y-4">
                        <div className="text-6xl">{sourceIcons[media.source_platform] || '🎬'}</div>
                        <p className="text-muted-foreground">
                          This content is hosted on {media.source_platform}
                        </p>
                        <Button onClick={handleWatchNow} className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Watch on {media.source_platform}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                      />
                    </div>
                  )}
                </div>

                {/* Title and Description */}
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold text-foreground">{media.title}</h1>
                  <p className="text-muted-foreground leading-relaxed">{media.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2">
                    <Heart className="w-4 h-4" />
                    Add to Favorites
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Clock className="w-4 h-4" />
                    Watch Later
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="teachings">Teachings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    {/* Metadata */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Sacred Metadata</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Consciousness Level */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Consciousness Level</span>
                          <Badge 
                            className={cn(
                              "text-xs",
                              consciousnessColors[media.consciousness_level] || "bg-muted"
                            )}
                          >
                            {media.consciousness_level}
                          </Badge>
                        </div>
                        
                        {/* Energy Level */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Energy Level</span>
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <div className="flex gap-1">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    i < media.energy_level ? "bg-yellow-400" : "bg-muted"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {media.energy_level}/10
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tags */}
                    {(media.genre_tags?.length > 0 || media.mood_tags?.length > 0) && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {media.genre_tags?.length > 0 && (
                              <div>
                                <span className="text-xs text-muted-foreground block mb-2">Genres</span>
                                <div className="flex flex-wrap gap-1">
                                  {media.genre_tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {media.mood_tags?.length > 0 && (
                              <div>
                                <span className="text-xs text-muted-foreground block mb-2">Moods</span>
                                <div className="flex flex-wrap gap-1">
                                  {media.mood_tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="teachings" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Sacred Teachings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {media.teaching_notes ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-sm leading-relaxed whitespace-pre-line">
                              {media.teaching_notes}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <BookOpen className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">
                              No additional teachings available for this content.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};