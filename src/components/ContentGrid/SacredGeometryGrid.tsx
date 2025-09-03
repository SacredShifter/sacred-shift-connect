import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowerOfLife, Sparkles, Zap, Heart, Brain, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  consciousness_level: string;
  energy_frequency: string;
  archetype: string;
  thumbnail_url?: string;
  resonance_score: number;
}

interface SacredGeometryGridProps {
  content: ContentItem[];
  layout?: 'flower-of-life' | 'metatron-cube' | 'seed-of-life' | 'tree-of-life';
  onContentSelect?: (content: ContentItem) => void;
}

const SacredGeometryGrid: React.FC<SacredGeometryGridProps> = ({ 
  content, 
  layout = 'flower-of-life',
  onContentSelect 
}) => {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const layouts = {
    'flower-of-life': FlowerOfLifeLayout,
    'metatron-cube': MetatronCubeLayout,
    'seed-of-life': SeedOfLifeLayout,
    'tree-of-life': TreeOfLifeLayout
  };

  const LayoutComponent = layouts[layout];

  const handleContentSelect = (content: ContentItem) => {
    setSelectedContent(content.id);
    onContentSelect?.(content);
  };

  return (
    <div className="w-full h-full relative">
      <LayoutComponent 
        content={content} 
        onContentSelect={handleContentSelect}
        selectedContent={selectedContent}
      />
    </div>
  );
};

// Flower of Life Layout - Perfect for content discovery
const FlowerOfLifeLayout: React.FC<{
  content: ContentItem[];
  onContentSelect: (content: ContentItem) => void;
  selectedContent: string | null;
}> = ({ content, onContentSelect, selectedContent }) => {
  const GOLDEN_RATIO = 1.618;
  const BASE_RADIUS = 120;

  const positions = useMemo(() => {
    if (content.length === 0) return [];
    
    // Central content
    const positions = [{ x: 0, y: 0, index: 0 }];
    
    // Surrounding content in flower pattern
    for (let i = 1; i < Math.min(content.length, 7); i++) {
      const angle = ((i - 1) * 60) * (Math.PI / 180);
      const radius = BASE_RADIUS * GOLDEN_RATIO;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      positions.push({ x, y, index: i });
    }
    
    return positions;
  }, [content.length]);

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Sacred Geometry Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          <defs>
            <pattern id="flower-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1"/>
              <circle cx="100" cy="100" r="100" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#flower-pattern)" />
        </svg>
      </div>

      {/* Content Nodes */}
      {positions.map(({ x, y, index }) => {
        const item = content[index];
        if (!item) return null;

        const isSelected = selectedContent === item.id;
        const isCentral = index === 0;

        return (
          <motion.div
            key={item.id}
            className={`absolute top-1/2 left-1/2 cursor-pointer group ${
              isCentral ? 'z-20' : 'z-10'
            }`}
            style={{
              transform: `translate(${x - 50}px, ${y - 50}px)`
            }}
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ 
              scale: isSelected ? 1.3 : 1, 
              opacity: 1, 
              rotate: 0 
            }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: isSelected ? 1.4 : 1.1,
              rotate: isCentral ? 0 : 5
            }}
            onClick={() => onContentSelect(item)}
          >
            {/* Content Card */}
            <Card className={`
              w-24 h-24 rounded-full border-2 transition-all duration-300
              ${isCentral 
                ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-2xl' 
                : 'bg-background/80 backdrop-blur-sm border-primary/30 hover:border-primary/60'
              }
              ${isSelected ? 'ring-4 ring-primary/50' : ''}
            `}>
              <CardContent className="p-2 h-full flex flex-col items-center justify-center text-center">
                <div className="text-xs font-medium leading-tight mb-1">
                  {item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title}
                </div>
                
                {!isCentral && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-primary/20 text-primary border-primary/30"
                  >
                    {item.resonance_score}%
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Resonance Waves for Central Content */}
            {isCentral && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}

            {/* Hover Info */}
            <motion.div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
            >
              <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-primary/30">
                <div className="font-medium">{item.title}</div>
                <div className="text-gray-300 text-xs mt-1">
                  {item.consciousness_level} • {item.archetype}
                </div>
                <div className="text-primary text-xs mt-1">
                  {item.energy_frequency}
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// Metatron's Cube Layout - Divine Order
const MetatronCubeLayout: React.FC<{
  content: ContentItem[];
  onContentSelect: (content: ContentItem) => void;
  selectedContent: string | null;
}> = ({ content, onContentSelect, selectedContent }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Metatron's Cube Layout</p>
        <p className="text-sm">Coming soon...</p>
      </div>
    </div>
  );
};

// Seed of Life Layout - Growth Pattern
const SeedOfLifeLayout: React.FC<{
  content: ContentItem[];
  onContentSelect: (content: ContentItem) => void;
  selectedContent: string | null;
}> = ({ content, onContentSelect, selectedContent }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Seed of Life Layout</p>
        <p className="text-sm">Coming soon...</p>
      </div>
    </div>
  );
};

// Tree of Life Layout - Hierarchical Wisdom
const TreeOfLifeLayout: React.FC<{
  content: ContentItem[];
  onContentSelect: (content: ContentItem) => void;
  selectedContent: string | null;
}> = ({ content, onContentSelect, selectedContent }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Tree of Life Layout</p>
        <p className="text-sm">Coming soon...</p>
      </div>
    </div>
  );
};

export default SacredGeometryGrid;
