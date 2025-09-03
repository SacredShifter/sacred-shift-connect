/**
 * Tree of Life Sacred Geometry Component
 * Represents the hierarchical structure of consciousness and wisdom
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
  Hexagon,
  Crown,
  Eye,
  Flame
} from 'lucide-react';
import { ConsciousnessRecommendation } from '@/types/consciousness';

interface TreeOfLifeProps {
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
  sephirah: string; // Kabbalistic sephirah name
  sephirahNumber: number; // 1-10
  sephirahLevel: number; // 1-4 (from bottom to top)
}

export const TreeOfLife: React.FC<TreeOfLifeProps> = ({
  content,
  onContentSelect,
  className = ""
}) => {
  const [nodes, setNodes] = useState<SacredNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<'all' | '1' | '2' | '3' | '4'>('all');
  const svgRef = useRef<SVGSVGElement>(null);

  // Tree of Life coordinates (10 sephiroth in traditional Kabbalistic arrangement)
  const treeCoordinates = [
    // Level 4 (Crown) - Top
    { x: 0, y: -200, sephirah: 'Kether', number: 1, level: 4, meaning: 'Crown' },
    
    // Level 3 (Upper Triad)
    { x: -100, y: -100, sephirah: 'Chokmah', number: 2, level: 3, meaning: 'Wisdom' },
    { x: 100, y: -100, sephirah: 'Binah', number: 3, level: 3, meaning: 'Understanding' },
    
    // Level 2 (Middle Triad)
    { x: -150, y: 0, sephirah: 'Chesed', number: 4, level: 2, meaning: 'Mercy' },
    { x: 0, y: 0, sephirah: 'Tiphareth', number: 6, level: 2, meaning: 'Beauty' },
    { x: 150, y: 0, sephirah: 'Geburah', number: 5, level: 2, meaning: 'Severity' },
    
    // Level 1 (Lower Triad)
    { x: -100, y: 100, sephirah: 'Netzach', number: 7, level: 1, meaning: 'Victory' },
    { x: 100, y: 100, sephirah: 'Hod', number: 8, level: 1, meaning: 'Glory' },
    
    // Level 0 (Foundation & Kingdom)
    { x: 0, y: 150, sephirah: 'Yesod', number: 9, level: 0, meaning: 'Foundation' },
    { x: 0, y: 200, sephirah: 'Malkuth', number: 10, level: 0, meaning: 'Kingdom' }
  ];

  // Initialize nodes with content
  useEffect(() => {
    const newNodes: SacredNode[] = content.slice(0, 10).map((item, index) => {
      const coord = treeCoordinates[index] || { x: 0, y: 0, sephirah: 'Malkuth', number: 10, level: 0, meaning: 'Kingdom' };
      return {
        id: item.id,
        position: { x: coord.x, y: coord.y },
        content: item,
        isActive: index === 5, // Tiphareth (Beauty) is active by default
        resonance: item.resonanceScore,
        sacredGeometry: item.sacredGeometry || 'tree-of-life',
        sephirah: coord.sephirah,
        sephirahNumber: coord.number,
        sephirahLevel: coord.level
      };
    });
    setNodes(newNodes);
  }, [content]);

  // Animate energy flow
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        resonance: Math.min(100, node.resonance + Math.random() * 2)
      })));
    }, 200);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node && onContentSelect) {
      onContentSelect(node.content);
    }
  };

  const getNodeIcon = (content: ConsciousnessRecommendation, sephirah: string) => {
    // Special icons for specific sephiroth
    if (sephirah === 'Kether') return <Crown className="w-4 h-4" />;
    if (sephirah === 'Chokmah') return <Brain className="w-4 h-4" />;
    if (sephirah === 'Binah') return <Eye className="w-4 h-4" />;
    if (sephirah === 'Tiphareth') return <Star className="w-4 h-4" />;
    if (sephirah === 'Yesod') return <Flame className="w-4 h-4" />;
    
    // Default icons based on content type
    switch (content.type) {
      case 'meditation': return <Brain className="w-4 h-4" />;
      case 'content': return <Sparkles className="w-4 h-4" />;
      case 'practice': return <Zap className="w-4 h-4" />;
      case 'connection': return <Heart className="w-4 h-4" />;
      case 'wisdom': return <Star className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getNodeColor = (resonance: number, sephirahLevel: number) => {
    if (sephirahLevel === 4) return 'text-yellow-400'; // Crown - golden
    if (sephirahLevel === 3) return 'text-blue-400'; // Upper triad - blue
    if (sephirahLevel === 2) return 'text-green-400'; // Middle triad - green
    if (sephirahLevel === 1) return 'text-purple-400'; // Lower triad - purple
    if (sephirahLevel === 0) return 'text-red-400'; // Foundation - red
    
    if (resonance > 80) return 'text-emerald-400';
    if (resonance > 60) return 'text-blue-400';
    if (resonance > 40) return 'text-purple-400';
    return 'text-gray-400';
  };

  const getSephirothColor = (level: number) => {
    switch (level) {
      case 4: return 'from-yellow-400 to-orange-400'; // Crown
      case 3: return 'from-blue-400 to-indigo-400'; // Upper triad
      case 2: return 'from-green-400 to-emerald-400'; // Middle triad
      case 1: return 'from-purple-400 to-violet-400'; // Lower triad
      case 0: return 'from-red-400 to-pink-400'; // Foundation
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getLevelName = (level: number) => {
    switch (level) {
      case 4: return 'Crown';
      case 3: return 'Upper Triad';
      case 2: return 'Middle Triad';
      case 1: return 'Lower Triad';
      case 0: return 'Foundation';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Level Selector */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Levels' },
            { id: '4', label: 'Crown' },
            { id: '3', label: 'Upper' },
            { id: '2', label: 'Middle' },
            { id: '1', label: 'Lower' },
            { id: '0', label: 'Foundation' }
          ].map(({ id, label }) => (
            <Button
              key={id}
              variant={currentLevel === id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentLevel(id as any)}
              className="text-xs"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Energy Flow Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant={isAnimating ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsAnimating(!isAnimating)}
          className="flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          {isAnimating ? 'Stop' : 'Flow'}
        </Button>
      </div>

      {/* Sacred Geometry Visualization */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="-200 -250 400 500"
          className="absolute inset-0"
        >
          {/* Tree of Life Connections */}
          <g>
            {/* Vertical paths (Pillars) */}
            <line x1="0" y1="-200" x2="0" y2="200" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="-100" y1="-100" x2="-100" y2="100" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="100" y1="-100" x2="100" y2="100" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            
            {/* Horizontal paths */}
            <line x1="-100" y1="-100" x2="100" y2="-100" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="-150" y1="0" x2="150" y2="0" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="-100" y1="100" x2="100" y2="100" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            
            {/* Diagonal paths */}
            <line x1="0" y1="-200" x2="-100" y2="-100" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="0" y1="-200" x2="100" y2="-100" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="-100" y1="-100" x2="-150" y2="0" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="-100" y1="-100" x2="0" y2="0" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="100" y1="-100" x2="0" y2="0" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="100" y1="-100" x2="150" y2="0" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="-150" y1="0" x2="-100" y2="100" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="0" y1="0" x2="-100" y2="100" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="0" y1="0" x2="100" y2="100" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="150" y1="0" x2="100" y2="100" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="-100" y1="100" x2="0" y2="150" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="100" y1="100" x2="0" y2="150" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
            <line x1="0" y1="150" x2="0" y2="200" stroke="url(#treeGradient)" strokeWidth="2" opacity="0.3" />
          </g>

          {/* Sacred Gradient Definitions */}
          <defs>
            <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="25%" stopColor="#3B82F6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="sephirahGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.6" />
            </radialGradient>
          </defs>

          {/* Sacred Nodes (Sephiroth) */}
          {nodes
            .filter(node => currentLevel === 'all' || node.sephirahLevel.toString() === currentLevel)
            .map((node) => (
            <g key={node.id}>
              {/* Energy Flow */}
              {isAnimating && (
                <motion.circle
                  cx={node.position.x}
                  cy={node.position.y}
                  r="20"
                  fill="none"
                  stroke="url(#treeGradient)"
                  strokeWidth="2"
                  opacity="0.4"
                  initial={{ r: 20, opacity: 0.4 }}
                  animate={{ 
                    r: [20, 30, 40, 50],
                    opacity: [0.4, 0.3, 0.2, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}

              {/* Sephiroth Circle */}
              <motion.circle
                cx={node.position.x}
                cy={node.position.y}
                r={node.sephirahLevel === 4 ? "20" : "15"}
                fill={`url(#sephirahGradient)`}
                stroke={node.isActive ? "#8B5CF6" : "#6B7280"}
                strokeWidth={node.isActive ? "3" : "2"}
                className="cursor-pointer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNodeClick(node.id)}
              />

              {/* Sephiroth Icon */}
              <foreignObject
                x={node.position.x - 8}
                y={node.position.y - 8}
                width="16"
                height="16"
                className="pointer-events-none"
              >
                <div className={`w-full h-full flex items-center justify-center ${getNodeColor(node.resonance, node.sephirahLevel)}`}>
                  {getNodeIcon(node.content, node.sephirah)}
                </div>
              </foreignObject>

              {/* Sephiroth Number */}
              <text
                x={node.position.x}
                y={node.position.y + 25}
                textAnchor="middle"
                className="text-xs fill-current text-muted-foreground"
                fontSize="10"
              >
                {node.sephirahNumber}
              </text>

              {/* Sephiroth Name */}
              <text
                x={node.position.x}
                y={node.position.y + 35}
                textAnchor="middle"
                className="text-xs fill-current text-muted-foreground"
                fontSize="8"
              >
                {node.sephirah}
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
                            {getNodeIcon(node.content, node.sephirah)}
                            <h3 className="font-medium">{node.content.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {node.content.type}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs bg-gradient-to-r ${getSephirothColor(node.sephirahLevel)} text-white`}
                            >
                              {getLevelName(node.sephirahLevel)}
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
                              <Crown className="w-3 h-3" />
                              {node.sephirah} ({node.sephirahNumber})
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
