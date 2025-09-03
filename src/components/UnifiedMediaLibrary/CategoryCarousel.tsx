import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaCard } from './MediaCard';
import { icons } from 'lucide-react';
import { MediaItem } from '../types';

interface CategoryCarouselProps {
  title: string;
  description?: string;
  items: MediaItem[];
  onPlayMedia: (media: MediaItem) => void;
  colorScheme?: string;
  iconName?: string;
  sacredGeometry?: string;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  title,
  description,
  items,
  onPlayMedia,
  colorScheme = '#8A2BE2',
  iconName = 'Play',
  sacredGeometry
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of one card + gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'right' ? scrollAmount : -scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Dynamic icon component
  const IconComponent = iconName && icons[iconName as keyof typeof icons] ? 
    icons[iconName as keyof typeof icons] : icons.Play;

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {IconComponent && (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: colorScheme + '20',
                color: colorScheme 
              }}
            >
              <IconComponent className="w-4 h-4" />
            </div>
          )}
          <div>
            <h2 
              className="text-2xl font-bold"
              style={{ color: colorScheme }}
            >
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground text-sm mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll('left')}
            className="rounded-full w-10 h-10 p-0 hover:bg-muted/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll('right')}
            className="rounded-full w-10 h-10 p-0 hover:bg-muted/50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <MediaCard
                media={item}
                onPlay={onPlayMedia}
                colorScheme={colorScheme}
              />
            </motion.div>
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};