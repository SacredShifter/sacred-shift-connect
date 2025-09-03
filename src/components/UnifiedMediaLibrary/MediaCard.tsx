import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Clock, Zap, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface MediaCardProps {
  media: MediaItem;
  onPlay: (media: MediaItem) => void;
  colorScheme?: string;
}

const sourceIcons: { [key: string]: string } = {
  'youtube': '📺',
  'tiktok': '🎵',
  'facebook': '📘',
  'instagram': '📷',
  'soundcloud': '🎵'
};

const sourceColors: { [key: string]: string } = {
  'youtube': 'bg-red-500/80 text-white',
  'tiktok': 'bg-pink-500/80 text-white',
  'facebook': 'bg-blue-500/80 text-white',
  'instagram': 'bg-purple-500/80 text-white',
  'soundcloud': 'bg-orange-500/80 text-white'
};

const consciousnessColors: { [key: string]: string } = {
  'beginner': 'ring-green-400/50 bg-green-500/10',
  'intermediate': 'ring-yellow-400/50 bg-yellow-500/10',
  'advanced': 'ring-orange-400/50 bg-orange-500/10',
  'master': 'ring-purple-400/50 bg-purple-500/10'
};

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  onPlay,
  colorScheme = '#8A2BE2'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(media);
  };

  return (
    <motion.div
      className="w-80 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative bg-card rounded-xl overflow-hidden shadow-lg border border-border/20 hover:shadow-2xl transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={media.thumbnail_url}
            alt={media.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Source Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              className={cn(
                "text-xs font-medium px-2 py-1",
                sourceColors[media.source_platform] || "bg-muted"
              )}
            >
              {sourceIcons[media.source_platform] || '🎬'} {media.source_platform.toUpperCase()}
            </Badge>
          </div>

          {/* Featured Star */}
          {media.featured_priority > 0 && (
            <div className="absolute top-3 right-3">
              <div className="bg-primary/90 text-primary-foreground p-1.5 rounded-full">
                <Star className="w-3 h-3 fill-current" />
              </div>
            </div>
          )}

          {/* Play Button Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              scale: isHovered ? 1 : 0.8 
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <Button
              size="lg"
              onClick={handlePlay}
              className="bg-white/90 hover:bg-white text-black rounded-full w-16 h-16 p-0"
            >
              <Play className="w-6 h-6 fill-current ml-1" />
            </Button>
          </motion.div>

          {/* Duration Estimate */}
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="bg-black/70 text-white text-xs">
              <Clock className="w-3 h-3 mr-1" />
              ~{Math.floor(Math.random() * 45 + 5)}m
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight">
            {media.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {media.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between">
            {/* Consciousness Level */}
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium ring-1",
              consciousnessColors[media.consciousness_level] || "ring-muted bg-muted/10"
            )}>
              {media.consciousness_level}
            </div>

            {/* Energy Level */}
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1 h-1 rounded-full",
                      i < Math.ceil(media.energy_level / 2) ? "bg-yellow-400" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          {(media.genre_tags?.length > 0 || media.mood_tags?.length > 0) && (
            <div className="flex flex-wrap gap-1">
              {[...media.genre_tags.slice(0, 2), ...media.mood_tags.slice(0, 1)].map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-2 py-0 h-5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Teaching Notes Indicator */}
          {media.teaching_notes && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="w-3 h-3" />
              <span>Includes deeper teachings</span>
            </div>
          )}
        </div>

        {/* Sacred Geometry Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          style={{
            background: `linear-gradient(45deg, transparent, ${colorScheme}20, transparent)`,
            border: `1px solid ${colorScheme}40`
          }}
        />
      </div>
    </motion.div>
  );
};