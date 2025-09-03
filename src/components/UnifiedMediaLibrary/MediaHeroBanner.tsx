import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaItem } from '../types';

interface MediaHeroBannerProps {
  featuredContent: MediaItem[];
  onPlayMedia: (media: MediaItem) => void;
}

export const MediaHeroBanner: React.FC<MediaHeroBannerProps> = ({
  featuredContent,
  onPlayMedia
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate through featured content
  useEffect(() => {
    if (isHovered || featuredContent.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredContent.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isHovered, featuredContent.length]);

  if (!featuredContent.length) return null;

  const currentMedia = featuredContent[currentIndex];

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <motion.div
        key={currentMedia.id}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={currentMedia.thumbnail_url}
          alt={currentMedia.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <motion.div
              key={`content-${currentMedia.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {currentMedia.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 line-clamp-3">
                {currentMedia.description}
              </p>
              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  onClick={() => onPlayMedia(currentMedia)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Play Now
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};