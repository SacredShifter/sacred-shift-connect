import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  source_platform?: string;
  source_url?: string;
  external_url?: string;
  category_name?: string;
  featured_priority: number;
  energy_level: number;
  consciousness_level: string;
  genre_tags: string[];
  mood_tags: string[];
  teaching_notes?: string;
  created_at: string;
  content_type?: string;
  author_name?: string;
  author_url?: string;
}

interface MediaCardProps {
  media: MediaItem;
  onPlay: (media: MediaItem) => void;
  colorScheme?: string;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  onPlay,
  colorScheme = '#8A2BE2'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="w-72 bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <div className="relative aspect-video overflow-hidden bg-muted/20">
        <img
          src={media.thumbnail_url}
          alt={media.title}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <motion.div
          className="absolute inset-0 bg-black/60 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={() => onPlay(media)}
            className="rounded-full w-16 h-16 p-0 bg-primary hover:bg-primary/90 shadow-2xl"
          >
            <Play className="w-6 h-6 ml-1" />
          </Button>
        </motion.div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
          {media.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {media.description}
        </p>
      </div>
    </motion.div>
  );
};