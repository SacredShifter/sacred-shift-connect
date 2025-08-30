import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Compass,
  BookOpen,
  TreePine,
  Star,
  Users,
  Brain,
  Heart,
  Eye,
  Infinity,
  Circle,
  Triangle,
  Hexagon,
  Square
} from 'lucide-react';

interface NavigationNode {
  id: string;
  path: string;
  title: string;
  description: string;
  icon: React.ElementType;
  position: { x: number; y: number };
  radius: number;
  color: string;
  archetype: string;
  geometry: React.ElementType;
}

const NAVIGATION_NODES: NavigationNode[] = [
  {
    id: 'dashboard',
    path: '/',
    title: 'Sacred Center',
    description: 'The unified field of all practices',
    icon: Infinity,
    position: { x: 0, y: 0 },
    radius: 50,
    color: 'from-violet-500 to-indigo-500',
    archetype: 'The Unity',
    geometry: Circle
  },
  {
    id: 'breath',
    path: '/breath',
    title: 'Breath of Source',
    description: 'Sacred breath and life force cultivation',
    icon: Heart,
    position: { x: 100, y: -50 },
    radius: 40,
    color: 'from-green-500 to-emerald-500',
    archetype: 'The Healer',
    geometry: Circle
  },
  {
    id: 'journal',
    path: '/journal',
    title: 'Sacred Scribe',
    description: 'Inner wisdom documentation',
    icon: BookOpen,
    position: { x: 50, y: 87 },
    radius: 40,
    color: 'from-blue-500 to-cyan-500',
    archetype: 'The Scribe',
    geometry: Square
  },
  {
    id: 'circles',
    path: '/circles',
    title: 'Council of Hearts',
    description: 'Sacred community gathering',
    icon: Users,
    position: { x: -50, y: 87 },
    radius: 40,
    color: 'from-rose-500 to-pink-500',
    archetype: 'The Council',
    geometry: Hexagon
  },
  {
    id: 'constellation',
    path: '/constellation-mapper',
    title: 'Cosmic Mapper',
    description: 'Consciousness constellation mapping',
    icon: Star,
    position: { x: -100, y: -50 },
    radius: 40,
    color: 'from-purple-500 to-violet-500',
    archetype: 'The Navigator',
    geometry: Triangle
  },
  {
    id: 'codex',
    path: '/codex',
    title: 'Sacred Codex',
    description: 'Personal and collective wisdom',
    icon: Brain,
    position: { x: 0, y: -100 },
    radius: 35,
    color: 'from-amber-500 to-orange-500',
    archetype: 'The Keeper',
    geometry: Triangle
  },
  {
    id: 'grove',
    path: '/grove',
    title: 'Sacred Grove',
    description: 'Nature connection and grounding',
    icon: TreePine,
    position: { x: 87, y: 50 },
    radius: 35,
    color: 'from-green-600 to-teal-500',
    archetype: 'The Guardian',
    geometry: Circle
  },
  {
    id: 'wisdom',
    path: '/wisdom',
    title: 'Ancient Wisdom',
    description: 'Timeless teachings and practices',
    icon: Eye,
    position: { x: -87, y: 50 },
    radius: 35,
    color: 'from-yellow-500 to-amber-500',
    archetype: 'The Sage',
    geometry: Triangle
  }
];

interface SacredNavigationMandalaProps {
  className?: string;
  compact?: boolean;
}

export const SacredNavigationMandala: React.FC<SacredNavigationMandalaProps> = ({
  className = '',
  compact = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showArchetypes, setShowArchetypes] = useState(false);

  const centerX = 200;
  const centerY = 200;
  const scale = compact ? 0.6 : 1;

  const isActive = (path: string) => location.pathname === path;

  const handleNodeClick = (node: NavigationNode) => {
    navigate(node.path);
  };

  return (
    <Card className={`bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-200/20 backdrop-blur-sm ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-violet-400" />
            <div>
              <h3 className="text-lg font-sacred text-violet-300">Sacred Navigation</h3>
              <p className="text-sm text-muted-foreground">
                Navigate through the mandala of consciousness
              </p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="cursor-pointer bg-violet-500/10 text-violet-300 border-violet-400/30 hover:bg-violet-500/20"
            onClick={() => setShowArchetypes(!showArchetypes)}
          >
            {showArchetypes ? 'Hide' : 'Show'} Archetypes
          </Badge>
        </div>

        <div className="relative mx-auto" style={{ width: 400 * scale, height: 400 * scale }}>
          {/* Sacred Geometry Background */}
          <svg 
            className="absolute inset-0 opacity-20" 
            viewBox="0 0 400 400"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Flower of Life pattern */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle
                key={i}
                cx={centerX + Math.cos((i * Math.PI) / 3) * 60}
                cy={centerY + Math.sin((i * Math.PI) / 3) * 60}
                r="60"
                fill="none"
                stroke="rgba(139, 92, 246, 0.3)"
                strokeWidth="1"
              />
            ))}
            <circle
              cx={centerX}
              cy={centerY}
              r="60"
              fill="none"
              stroke="rgba(139, 92, 246, 0.4)"
              strokeWidth="2"
            />
          </svg>

          {/* Connection Lines */}
          <svg 
            className="absolute inset-0 opacity-30" 
            viewBox="0 0 400 400"
            style={{ width: '100%', height: '100%' }}
          >
            {NAVIGATION_NODES.slice(1).map((node) => (
              <motion.line
                key={`line-${node.id}`}
                x1={centerX}
                y1={centerY}
                x2={centerX + node.position.x * scale}
                y2={centerY + node.position.y * scale}
                stroke="rgba(139, 92, 246, 0.5)"
                strokeWidth={isActive(node.path) ? "3" : "1"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            ))}
          </svg>

          {/* Navigation Nodes */}
          {NAVIGATION_NODES.map((node, index) => {
            const Icon = node.icon;
            const Geometry = node.geometry;
            const x = centerX + node.position.x * scale;
            const y = centerY + node.position.y * scale;
            const active = isActive(node.path);
            const hovered = hoveredNode === node.id;

            return (
              <motion.div
                key={node.id}
                className="absolute cursor-pointer group"
                style={{
                  left: x - (node.radius * scale) / 2,
                  top: y - (node.radius * scale) / 2,
                  width: node.radius * scale,
                  height: node.radius * scale
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredNode(node.id)}
                onHoverEnd={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(node)}
              >
                {/* Sacred Geometry Background */}
                <div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${node.color}/20 border-2 transition-all duration-300 ${
                    active ? `border-white/80 shadow-lg shadow-${node.color.split('-')[1]}-500/50` : 
                    hovered ? 'border-white/60' : 'border-white/30'
                  }`}
                >
                  <Geometry className={`w-full h-full p-2 transition-colors ${
                    active ? 'text-white' : 'text-white/60'
                  }`} />
                </div>

                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className={`transition-all duration-300 ${
                    active ? 'w-6 h-6 text-white' : 
                    hovered ? 'w-5 h-5 text-white/90' : 'w-4 h-4 text-white/70'
                  }`} />
                </div>

                {/* Pulse effect for active node */}
                {active && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/50"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: 9999, ease: "easeInOut" }}
                  />
                )}

                {/* Tooltip */}
                {hovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10"
                  >
                    <div className="bg-background/95 backdrop-blur-sm rounded-lg p-3 border border-border/50 shadow-xl min-w-[200px]">
                      <h4 className="font-semibold text-sm">{node.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{node.description}</p>
                      {showArchetypes && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {node.archetype}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Center Sacred Symbol */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: 9999, ease: "linear" }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 border-2 border-white/40 flex items-center justify-center backdrop-blur-sm">
              <Infinity className="w-8 h-8 text-white/80" />
            </div>
          </motion.div>
        </div>

        {/* Current Path Indicator */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Current Path: <span className="text-violet-300 font-medium">
              {NAVIGATION_NODES.find(node => isActive(node.path))?.title || 'Sacred Center'}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
};