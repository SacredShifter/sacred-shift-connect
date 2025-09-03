import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface MediaHeroBannerProps {
  featuredContent: MediaItem[];
  onPlayMedia: (media: MediaItem) => void;
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

export const MediaHeroBanner: React.FC<MediaHeroBannerProps> = ({
  featuredContent,
  onPlayMedia
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (featuredContent.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredContent.length);
        setIsTransitioning(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, [featuredContent.length]);

  if (!featuredContent.length) return null;

  const currentItem = featuredContent[currentIndex];

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${currentItem.thumbnail_url})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Featured Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                  
                  {/* Source Badge */}
                  <Badge 
                    className={cn(
                      "px-3 py-1 text-sm font-medium",
                      sourceColors[currentItem.source_platform] || "bg-muted"
                    )}
                  >
                    {sourceIcons[currentItem.source_platform] || '🎬'} {currentItem.source_platform.toUpperCase()}
                  </Badge>

                  {/* Category Badge */}
                  {currentItem.category_name && (
                    <Badge variant="outline" className="text-sm">
                      {currentItem.category_name}
                    </Badge>
                  )}
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
                >
                  {currentItem.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-lg text-muted-foreground leading-relaxed max-w-xl"
                >
                  {currentItem.description}
                </motion.p>

                {/* Metadata Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  {/* Consciousness Level */}
                  <Badge 
                    className={cn(
                      "text-xs",
                      consciousnessColors[currentItem.consciousness_level] || "bg-muted"
                    )}
                  >
                    {currentItem.consciousness_level}
                  </Badge>

                  {/* Energy Level */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Energy:</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            i < currentItem.energy_level ? "bg-primary" : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Duration Estimate */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>~{Math.floor(Math.random() * 45 + 5)} min</span>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex items-center gap-4"
                >
                  <Button
                    size="lg"
                    onClick={() => onPlayMedia(currentItem)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
                  >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Play Now
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-background/10 backdrop-blur-sm border-white/20 text-foreground hover:bg-background/20 px-6 py-3"
                  >
                    <Info className="w-5 h-5 mr-2" />
                    More Info
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      {featuredContent.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center gap-3">
            {featuredContent.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  currentIndex === index 
                    ? "bg-primary w-8" 
                    : "bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 right-8 z-20"
      >
        <div className="text-xs text-white/60 text-center">
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center mb-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-white/60 rounded-full mt-2"
            />
          </div>
          <span>Scroll</span>
        </div>
      </motion.div>
    </div>
  );
};