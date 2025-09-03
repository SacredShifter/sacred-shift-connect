import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Heart, Brain, Zap, Moon, Sun, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  consciousness_level: string;
  energy_frequency: string;
  archetype: string;
  timestamp: Date;
  resonance_score: number;
  content_type: string;
  lunar_phase: string;
  solar_position: string;
}

interface ResonanceTimelineProps {
  content: TimelineItem[];
  onItemSelect?: (item: TimelineItem) => void;
  viewMode?: 'spiral' | 'linear' | 'sacred-geometry';
}

const ResonanceTimeline: React.FC<ResonanceTimelineProps> = ({
  content,
  onItemSelect,
  viewMode = 'spiral'
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'new' | 'waxing' | 'full' | 'waning'>('waxing');

  // Sort content by timestamp
  const sortedContent = useMemo(() => {
    return [...content].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [content]);

  // Group content by consciousness phases
  const consciousnessPhases = useMemo(() => {
    const phases = {
      awakening: sortedContent.filter(item => item.consciousness_level === 'beginner'),
      expansion: sortedContent.filter(item => item.consciousness_level === 'intermediate'),
      transcendence: sortedContent.filter(item => item.consciousness_level === 'advanced')
    };
    return phases;
  }, [sortedContent]);

  // Calculate spiral positions for sacred geometry view
  const spiralPositions = useMemo(() => {
    return sortedContent.map((_, index) => {
      const angle = (index * 137.5) * (Math.PI / 180); // Golden angle
      const radius = Math.sqrt(index) * 50;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle,
        radius
      };
    });
  }, [sortedContent]);

  // Handle item selection
  const handleItemSelect = (item: TimelineItem) => {
    setSelectedItem(item.id);
    onItemSelect?.(item);
  };

  // Get consciousness phase color
  const getConsciousnessColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Get energy frequency color
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case '432Hz': return 'bg-amber-500';
      case '528Hz': return 'bg-emerald-500';
      case '639Hz': return 'bg-cyan-500';
      case '741Hz': return 'bg-indigo-500';
      case '852Hz': return 'bg-violet-500';
      default: return 'bg-gray-500';
    }
  };

  // Render spiral timeline view
  const renderSpiralView = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Sacred spiral background */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="spiral-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <path
          d={spiralPositions.map((pos, index) => 
            `${index === 0 ? 'M' : 'L'} ${400 + pos.x} ${300 + pos.y}`
          ).join(' ')}
          fill="none"
          stroke="url(#spiral-gradient)"
          strokeWidth="2"
          className="animate-pulse"
        />
      </svg>

      {/* Content nodes along the spiral */}
      {sortedContent.map((item, index) => {
        const position = spiralPositions[index];
        const isSelected = selectedItem === item.id;
        
        return (
          <motion.div
            key={item.id}
            className="absolute top-1/2 left-1/2 cursor-pointer group"
            style={{
              transform: `translate(${position.x - 25}px, ${position.y - 25}px)`
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
              rotate: 5
            }}
            onClick={() => handleItemSelect(item)}
          >
            {/* Timeline Node */}
            <Card className={`
              w-12 h-12 rounded-full border-2 transition-all duration-300
              ${isSelected ? 'ring-4 ring-primary/50 shadow-2xl' : 'hover:shadow-lg'}
              bg-background/90 backdrop-blur-sm
            `}>
              <CardContent className="p-0 h-full flex items-center justify-center">
                <div className={`
                  w-3 h-3 rounded-full ${getConsciousnessColor(item.consciousness_level)}
                  ${isSelected ? 'scale-150' : ''}
                  transition-transform duration-300
                `} />
              </CardContent>
            </Card>

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
                <div className="text-gray-400 text-xs mt-1">
                  {item.timestamp.toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );

  // Render linear timeline view
  const renderLinearView = () => (
    <div className="w-full h-full overflow-y-auto p-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary/30" />
        
        {/* Timeline items */}
        {sortedContent.map((item, index) => {
          const isSelected = selectedItem === item.id;
          const isLast = index === sortedContent.length - 1;
          
          return (
            <motion.div
              key={item.id}
              className="relative flex items-start gap-6 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Timeline marker */}
              <div className="relative z-10">
                <div className={`
                  w-4 h-4 rounded-full border-2 border-background
                  ${getConsciousnessColor(item.consciousness_level)}
                  ${isSelected ? 'ring-4 ring-primary/50 scale-125' : ''}
                  transition-all duration-300
                `} />
                {!isLast && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-primary/30" />
                )}
              </div>

              {/* Content card */}
              <motion.div
                className="flex-1"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className={`
                    cursor-pointer transition-all duration-300
                    ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}
                  `}
                  onClick={() => handleItemSelect(item)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge 
                        variant="secondary" 
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {item.resonance_score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {item.consciousness_level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.archetype}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.energy_frequency}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Moon className="w-3 h-3" />
                        {item.lunar_phase}
                      </div>
                      <div className="flex items-center gap-1">
                        <Sun className="w-3 h-3" />
                        {item.solar_position}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // Render consciousness phases view
  const renderConsciousnessPhases = () => (
    <div className="w-full h-full p-6 space-y-8">
      {Object.entries(consciousnessPhases).map(([phase, items]) => (
        <motion.div
          key={phase}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className={`
              w-3 h-3 rounded-full ${getConsciousnessColor(phase === 'awakening' ? 'beginner' : phase === 'expansion' ? 'intermediate' : 'advanced')}
            `} />
            <h3 className="text-xl font-semibold capitalize">{phase}</h3>
            <Badge variant="outline">{items.length} items</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleItemSelect(item)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-primary/10 text-primary"
                        >
                          {item.resonance_score}%
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`
                          w-2 h-2 rounded-full ${getFrequencyColor(item.energy_frequency)}
                        `} />
                        <span>{item.energy_frequency}</span>
                        <span className="text-muted-foreground">•</span>
                        <span>{item.archetype}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="w-full h-full">
      {/* View Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-background/50 backdrop-blur-sm border border-primary/20 rounded-lg p-1">
          {[
            { id: 'spiral', label: 'Sacred Spiral', icon: Sparkles },
            { id: 'linear', label: 'Linear Time', icon: Clock },
            { id: 'phases', label: 'Consciousness Phases', icon: Brain }
          ].map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.id}
                variant={viewMode === mode.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPhase(mode.id as any)}
                className="text-xs"
              >
                <Icon className="w-3 h-3 mr-1" />
                {mode.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="h-full">
        {viewMode === 'spiral' && renderSpiralView()}
        {viewMode === 'linear' && renderLinearView()}
        {viewMode === 'phases' && renderConsciousnessPhases()}
      </div>

      {/* Selected Item Details */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const item = sortedContent.find(c => c.id === selectedItem);
                if (!item) return null;

                return (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h2 className="text-2xl font-bold">{item.title}</h2>
                      <Badge 
                        variant="secondary" 
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {item.resonance_score}% Resonance
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground">{item.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Consciousness Level</div>
                        <Badge variant="outline">{item.consciousness_level}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Energy Frequency</div>
                        <Badge variant="outline">{item.energy_frequency}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Archetype</div>
                        <Badge variant="outline">{item.archetype}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Content Type</div>
                        <Badge variant="outline">{item.content_type}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.timestamp.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Moon className="w-4 h-4" />
                        {item.lunar_phase} Moon
                      </div>
                      <div className="flex items-center gap-1">
                        <Sun className="w-4 h-4" />
                        {item.solar_position}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResonanceTimeline;
