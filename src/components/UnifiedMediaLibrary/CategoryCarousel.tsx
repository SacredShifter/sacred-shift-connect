import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaCard } from './MediaCard';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

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
  iconName,
  sacredGeometry
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 320; // Width of one card plus gap
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(
          container.scrollWidth - container.clientWidth,
          scrollPosition + scrollAmount
        );

    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
    
    // Update arrow visibility
    setShowLeftArrow(newPosition > 0);
    setShowRightArrow(newPosition < container.scrollWidth - container.clientWidth);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const position = container.scrollLeft;
    setScrollPosition(position);
    setShowLeftArrow(position > 0);
    setShowRightArrow(position < container.scrollWidth - container.clientWidth - 10);
  };

  if (!items.length) return null;

  // Get Lucide icon component
  const IconComponent = iconName && (LucideIcons as any)[iconName] 
    ? (LucideIcons as any)[iconName] 
    : null;

  return (
    <div className="group relative">
      {/* Header */}
      {title && (
        <div className="flex items-center gap-4 mb-6">
          {/* Sacred Geometry Accent */}
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ 
              background: `linear-gradient(45deg, ${colorScheme}20, ${colorScheme}10)`,
              border: `1px solid ${colorScheme}30`
            }}
          >
            {IconComponent ? (
              <IconComponent 
                className="w-6 h-6" 
                style={{ color: colorScheme }}
              />
            ) : (
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: colorScheme }}
              />
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            {description && (
              <p className="text-muted-foreground text-sm mt-1">{description}</p>
            )}
          </div>
        </div>
      )}

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showLeftArrow ? 1 : 0 }}
          className={cn(
            "absolute left-0 top-0 h-full z-10 flex items-center transition-opacity duration-300",
            showLeftArrow ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          <div className="bg-gradient-to-r from-background via-background/90 to-transparent h-full w-16 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('left')}
              className="ml-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 border border-border/20"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Right Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showRightArrow ? 1 : 0 }}
          className={cn(
            "absolute right-0 top-0 h-full z-10 flex items-center transition-opacity duration-300",
            showRightArrow ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          <div className="bg-gradient-to-l from-background via-background/90 to-transparent h-full w-16 flex items-center justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('right')}
              className="mr-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 border border-border/20"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Cards Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
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
      </div>

      {/* Sacred Geometry Background Pattern */}
      <div 
        className="absolute -top-8 -right-8 w-24 h-24 opacity-5 pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, ${colorScheme}, transparent, ${colorScheme})`,
          clipPath: sacredGeometry === 'mandala' 
            ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
            : 'circle(50%)'
        }}
      />
    </div>
  );
};