/**
 * Metatron's Cube Sacred Geometry Component
 * Represents divine order and the blueprint of creation
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
  Hexagon,
  Triangle,
  Square,
  Pentagon
} from 'lucide-react';
import { ConsciousnessRecommendation } from '@/types/consciousness';

interface MetatronCubeProps {
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
}

export const MetatronCube: React.FC<MetatronCubeProps> = ({
  content,
  onContentSelect,
  className = ""
}) => {
  const [nodes, setNodes] = useState<SacredNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPattern, setCurrentPattern] = useState<'metatron' | 'flower' | 'seed' | 'tree'>('metatron');
  const svgRef = useRef<SVGSVGElement>(null);

  // Metatron's Cube sacred geometry coordinates
  const metatronCoordinates = [
    // Central circle
    { x: 0, y: 0, type: 'center' },
    // Inner ring (6 circles)
    { x: 0, y: -100, type: 'inner' },
    { x: 86.6, y: -50, type: 'inner' },
    { x: 86.6, y: 50, type: 'inner' },
    { x: 0, y: 100, type: 'inner' },
    { x: -86.6, y: 50, type: 'inner' },
    { x: -86.6, y: -50, type: 'inner' },
    // Outer ring (12 circles)
    { x: 0, y: -200, type: 'outer' },
    { x: 100, y: -173.2, type: 'outer' },
    { x: 173.2, y: -100, type: 'outer' },
    { x: 200, y: 0, type: 'outer' },
    { x: 173.2, y: 100, type: 'outer' },
    { x: 100, y: 173.2, type: 'outer' },
    { x: 0, y: 200, type: 'outer' },
    { x: -100, y: 173.2, type: 'outer' },
    { x: -173.2, y: 100, type: 'outer' },
    { x: -200, y: 0, type: 'outer' },
    { x: -173.2, y: -100, type: 'outer' },
    { x: -100, y: -173.2, type: 'outer' }
  ];

  // Initialize nodes with content
  useEffect(() => {
    const newNodes: SacredNode[] = content.slice(0, 19).map((item, index) => {
      const coord = metatronCoordinates[index] || { x: 0, y: 0, type: 'outer' };
      return {
        id: item.id,
        position: { x: coord.x, y: coord.y },
        content: item,
        isActive: index === 0, // Center node is active by default
        resonance: item.resonanceScore,
        sacredGeometry: item.sacredGeometry || 'metatron-cube'
      };
    });
    setNodes(newNodes);
  }, [content]);

  // Animate resonance waves
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        resonance: Math.min(100, node.resonance + Math.random() * 5)
      })));
    }, 100);

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

  const getNodeColor = (resonance: number, type: string) => {
    if (resonance > 80) return 'text-emerald-400';
    if (resonance > 60) return 'text-blue-400';
    if (resonance > 40) return 'text-purple-400';
    return 'text-gray-400';
  };

  const getSacredGeometryIcon = (pattern: string) => {
    switch (pattern) {
      case 'metatron-cube': return <Hexagon className="w-4 h-4" />;
      case 'flower-of-life': return <Circle className="w-4 h-4" />;
      case 'seed-of-life': return <Triangle className="w-4 h-4" />;
      case 'tree-of-life': return <Square className="w-4 h-4" />;
      default: return <Pentagon className="w-4 h-4" />;
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Sacred Geometry Pattern Selector */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex gap-2">
          {[
            { id: 'metatron', label: 'Metatron', icon: Hexagon },
            { id: 'flower', label: 'Flower', icon: Circle },
            { id: 'seed', label: 'Seed', icon: Triangle },
            { id: 'tree', label: 'Tree', icon: Square }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={currentPattern === id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPattern(id as any)}
              className="flex items-center gap-1"
            >
              <Icon className="w-3 h-3" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Resonance Animation Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant={isAnimating ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsAnimating(!isAnimating)}
          className="flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          {isAnimating ? 'Stop' : 'Animate'}
        </Button>
      </div>

      {/* Sacred Geometry Visualization */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="-250 -250 500 500"
          className="absolute inset-0"
        >
          {/* Sacred Geometry Lines */}
          {currentPattern === 'metatron' && (
            <>
              {/* Metatron's Cube connections */}
              {metatronCoordinates.map((coord, index) => (
                <g key={index}>
                  {/* Lines from center to inner ring */}
                  {coord.type === 'inner' && (
                    <line
                      x1="0"
                      y1="0"
                      x2={coord.x}
                      y2={coord.y}
                      stroke="url(#sacredGradient)"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  )}
                  {/* Lines from inner to outer ring */}
                  {coord.type === 'outer' && (
                    <line
                      x1={coord.x * 0.5}
                      y1={coord.y * 0.5}
                      x2={coord.x}
                      y2={coord.y}
                      stroke="url(#sacredGradient)"
                      strokeWidth="1"
                      opacity="0.2"
                    />
                  )}
                </g>
              ))}
            </>
          )}

          {/* Sacred Gradient Definition */}
          <defs>
            <linearGradient id="sacredGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {/* Sacred Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              {/* Resonance Wave */}
              {isAnimating && (
                <motion.circle
                  cx={node.position.x}
                  cy={node.position.y}
                  r="20"
                  fill="none"
                  stroke="url(#sacredGradient)"
                  strokeWidth="2"
                  opacity="0.3"
                  initial={{ r: 20, opacity: 0.3 }}
                  animate={{ 
                    r: [20, 40, 60, 80],
                    opacity: [0.3, 0.2, 0.1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}

              {/* Node Circle */}
              <motion.circle
                cx={node.position.x}
                cy={node.position.y}
                r="15"
                fill={node.isActive ? "url(#nodeGradient)" : "rgba(139, 92, 246, 0.3)"}
                stroke={node.isActive ? "#8B5CF6" : "#6B7280"}
                strokeWidth={node.isActive ? "2" : "1"}
                className="cursor-pointer"
                whileHover={{ scale: 1.2 }}
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
                <div className={`w-full h-full flex items-center justify-center ${getNodeColor(node.resonance, node.content.type)}`}>
                  {getNodeIcon(node.content)}
                </div>
              </foreignObject>

              {/* Resonance Score */}
              <text
                x={node.position.x}
                y={node.position.y + 25}
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
                          <Badge variant="outline" className="text-xs">
                            {node.content.type}
                          </Badge>
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
                              {getSacredGeometryIcon(node.sacredGeometry)}
                              {node.sacredGeometry}
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
