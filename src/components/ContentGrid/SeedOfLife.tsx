/**
 * Seed of Life Sacred Geometry Component
 * Represents the growth pattern and the beginning of creation
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Heart, 
  Brain, 
  Zap, 
  Star, 
  Circle,
  Triangle,
  Square,
  Pentagon,
  Hexagon
} from 'lucide-react';
import { ConsciousnessRecommendation } from '@/types/consciousness';

interface SeedOfLifeProps {
  content: ConsciousnessRecommendation[];
  onContentSelect?: (content: ConsciousnessRecommendation) => void;
  className?: string;
}

interface SacredNode {
  id: string;
  position: { x: number; y: number };
  content: ConsciousnessRecommendation;
  isActive: boolean;
  resonance: number;
  sacredGeometry: string;
  growthLevel: number; // 1-7 for the 7 circles of the Seed of Life
}

export const SeedOfLife: React.FC<SeedOfLifeProps> = ({
  content,
  onContentSelect,
  className = ""
}) => {
  const [nodes, setNodes] = useState<SacredNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [growthPhase, setGrowthPhase] = useState<'seed' | 'sprout' | 'bloom' | 'fruit'>('seed');
  const svgRef = useRef<SVGSVGElement>(null);

  // Seed of Life coordinates (7 circles in perfect geometric arrangement)
  const seedCoordinates = [
    // Central circle (Seed)
    { x: 0, y: 0, level: 1, name: 'Seed' },
    // First ring (6 circles around center)
    { x: 0, y: -100, level: 2, name: 'Sprout' },
    { x: 86.6, y: -50, level: 2, name: 'Sprout' },
    { x: 86.6, y: 50, level: 2, name: 'Sprout' },
    { x: 0, y: 100, level: 2, name: 'Sprout' },
    { x: -86.6, y: 50, level: 2, name: 'Sprout' },
    { x: -86.6, y: -50, level: 2, name: 'Sprout' }
  ];

  // Initialize nodes with content
  useEffect(() => {
    const newNodes: SacredNode[] = content.slice(0, 7).map((item, index) => {
      const coord = seedCoordinates[index] || { x: 0, y: 0, level: 1, name: 'Seed' };
      return {
        id: item.id,
        position: { x: coord.x, y: coord.y },
        content: item,
        isActive: index === 0, // Central seed is active by default
        resonance: item.resonanceScore,
        sacredGeometry: item.sacredGeometry || 'seed-of-life',
        growthLevel: coord.level
      };
    });
    setNodes(newNodes);
  }, [content]);

  // Animate growth phases
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        resonance: Math.min(100, node.resonance + Math.random() * 3)
      })));
    }, 150);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node && onContentSelect) {
      onContentSelect(node.content);
    }
  };

  const getNodeIcon = (content: ConsciousnessRecommendation) => {
    switch (content.type) {
      case 'meditation': return <Brain className="w-4 h-4" />;
      case 'content': return <Sparkles className="w-4 h-4" />;
      case 'practice': return <Zap className="w-4 h-4" />;
      case 'connection': return <Heart className="w-4 h-4" />;
      case 'wisdom': return <Star className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getNodeColor = (resonance: number, growthLevel: number) => {
    if (growthLevel === 1) return 'text-yellow-400'; // Seed - golden
    if (resonance > 80) return 'text-emerald-400'; // High resonance - green
    if (resonance > 60) return 'text-blue-400'; // Medium resonance - blue
    if (resonance > 40) return 'text-purple-400'; // Low resonance - purple
    return 'text-gray-400'; // Very low resonance - gray
  };

  const getGrowthPhaseColor = (phase: string) => {
    switch (phase) {
      case 'seed': return 'from-yellow-400 to-orange-400';
      case 'sprout': return 'from-green-400 to-emerald-400';
      case 'bloom': return 'from-pink-400 to-purple-400';
      case 'fruit': return 'from-red-400 to-orange-400';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getGrowthPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'seed': return <Circle className="w-4 h-4" />;
      case 'sprout': return <Triangle className="w-4 h-4" />;
      case 'bloom': return <Pentagon className="w-4 h-4" />;
      case 'fruit': return <Hexagon className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Growth Phase Selector */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex gap-2">
          {[
            { id: 'seed', label: 'Seed', icon: Circle },
            { id: 'sprout', label: 'Sprout', icon: Triangle },
            { id: 'bloom', label: 'Bloom', icon: Pentagon },
            { id: 'fruit', label: 'Fruit', icon: Hexagon }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={growthPhase === id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGrowthPhase(id as any)}
              className="flex items-center gap-1"
            >
              <Icon className="w-3 h-3" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Growth Animation Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant={isAnimating ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsAnimating(!isAnimating)}
          className="flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          {isAnimating ? 'Stop' : 'Grow'}
        </Button>
      </div>

      {/* Sacred Geometry Visualization */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="-150 -150 300 300"
          className="absolute inset-0"
        >
          {/* Sacred Geometry Lines */}
          <g>
            {/* Lines connecting the seed to sprouts */}
            {seedCoordinates.slice(1).map((coord, index) => (
              <line
                key={index}
                x1="0"
                y1="0"
                x2={coord.x}
                y2={coord.y}
                stroke="url(#growthGradient)"
                strokeWidth="2"
                opacity="0.4"
              />
            ))}
            
            {/* Growth rings */}
            <circle
              cx="0"
              cy="0"
              r="50"
              fill="none"
              stroke="url(#growthGradient)"
              strokeWidth="1"
              opacity="0.2"
            />
            <circle
              cx="0"
              cy="0"
              r="100"
              fill="none"
              stroke="url(#growthGradient)"
              strokeWidth="1"
              opacity="0.1"
            />
          </g>

          {/* Sacred Gradient Definitions */}
          <defs>
            <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="seedGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.6" />
            </radialGradient>
            <radialGradient id="sproutGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.5" />
            </radialGradient>
          </defs>

          {/* Sacred Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              {/* Growth Energy Field */}
              {isAnimating && (
                <motion.circle
                  cx={node.position.x}
                  cy={node.position.y}
                  r="15"
                  fill="none"
                  stroke="url(#growthGradient)"
                  strokeWidth="2"
                  opacity="0.4"
                  initial={{ r: 15, opacity: 0.4 }}
                  animate={{ 
                    r: [15, 25, 35, 45],
                    opacity: [0.4, 0.3, 0.2, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}

              {/* Node Circle */}
              <motion.circle
                cx={node.position.x}
                cy={node.position.y}
                r={node.growthLevel === 1 ? "18" : "12"}
                fill={node.growthLevel === 1 ? "url(#seedGradient)" : "url(#sproutGradient)"}
                stroke={node.isActive ? "#8B5CF6" : "#6B7280"}
                strokeWidth={node.isActive ? "3" : "2"}
                className="cursor-pointer"
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNodeClick(node.id)}
              />

              {/* Node Icon */}
              <foreignObject
                x={node.position.x - 8}
                y={node.position.y - 8}
                width="16"
                height="16"
                className="pointer-events-none"
              >
                <div className={`w-full h-full flex items-center justify-center ${getNodeColor(node.resonance, node.growthLevel)}`}>
                  {getNodeIcon(node.content)}
                </div>
              </foreignObject>

              {/* Growth Level Indicator */}
              <text
                x={node.position.x}
                y={node.position.y + 20}
                textAnchor="middle"
                className="text-xs fill-current text-muted-foreground"
                fontSize="8"
              >
                {node.growthLevel === 1 ? 'SEED' : 'SPROUT'}
              </text>

              {/* Resonance Score */}
              <text
                x={node.position.x}
                y={node.position.y + 30}
                textAnchor="middle"
                className="text-xs fill-current text-muted-foreground"
                fontSize="10"
              >
                {Math.round(node.resonance)}%
              </text>
            </g>
          ))}
        </svg>

        {/* Content Details Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 z-20"
            >
              <Card className="bg-background/95 backdrop-blur-sm border-primary/30">
                <CardContent className="p-4">
                  {(() => {
                    const node = nodes.find(n => n.id === selectedNode);
                    if (!node) return null;
                    
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getNodeIcon(node.content)}
                            <h3 className="font-medium">{node.content.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {node.content.type}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs bg-gradient-to-r ${getGrowthPhaseColor(node.growthLevel === 1 ? 'seed' : 'sprout')} text-white`}
                            >
                              {node.growthLevel === 1 ? 'SEED' : 'SPROUT'}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {node.content.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {node.content.resonanceScore}% resonance
                            </span>
                            <span className="flex items-center gap-1">
                              {getGrowthPhaseIcon(node.growthLevel === 1 ? 'seed' : 'sprout')}
                              Growth Level {node.growthLevel}
                            </span>
                          </div>
                          <span className="text-muted-foreground">
                            {node.content.duration}min
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
