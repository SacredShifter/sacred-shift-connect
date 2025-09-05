/**
 * Sacred Shifter Sacred Seal Visualization
 * Interactive 3D visualization of sacred seals and their energy patterns
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Sparkles, 
  Eye, 
  Zap, 
  Heart,
  Star,
  Hexagon,
  Circle,
  Triangle,
  Square,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { SacredSeal } from '@/hooks/useSacredInitiations';

interface SacredSealVisualizationProps {
  seal: SacredSeal;
  isActive?: boolean;
  onActivate?: () => void;
  showControls?: boolean;
}

interface GeometryPattern {
  type: string;
  vertices: { x: number; y: number }[];
  connections: { from: number; to: number }[];
  color: string;
  animation: 'rotate' | 'pulse' | 'flow' | 'static';
  speed: number;
}

export const SacredSealVisualization: React.FC<SacredSealVisualizationProps> = ({
  seal,
  isActive = false,
  onActivate,
  showControls = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Generate geometry pattern based on seal
  const generateGeometryPattern = (seal: SacredSeal): GeometryPattern => {
    const basePatterns: { [key: string]: GeometryPattern } = {
      'flower-of-life': {
        type: 'flower-of-life',
        vertices: [
          { x: 0, y: 0 },
          { x: 50, y: 0 },
          { x: 25, y: -43.3 },
          { x: -25, y: -43.3 },
          { x: -50, y: 0 },
          { x: -25, y: 43.3 },
          { x: 25, y: 43.3 }
        ],
        connections: [
          { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
          { from: 0, to: 4 }, { from: 0, to: 5 }, { from: 0, to: 6 },
          { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
          { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 1 }
        ],
        color: seal.color_signature || '#8B5CF6',
        animation: 'rotate',
        speed: 0.5
      },
      'metatron-cube': {
        type: 'metatron-cube',
        vertices: [
          { x: 0, y: 0 }, { x: 30, y: 0 }, { x: 60, y: 0 },
          { x: 15, y: -26 }, { x: 45, y: -26 },
          { x: 0, y: -52 }, { x: 30, y: -52 }, { x: 60, y: -52 },
          { x: -15, y: -26 }, { x: -30, y: 0 }, { x: -45, y: -26 },
          { x: -30, y: -52 }, { x: -60, y: 0 }, { x: -60, y: -52 }
        ],
        connections: [
          { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 0, to: 3 },
          { from: 1, to: 3 }, { from: 1, to: 4 }, { from: 2, to: 4 },
          { from: 3, to: 5 }, { from: 4, to: 6 }, { from: 5, to: 6 },
          { from: 0, to: 8 }, { from: 8, to: 9 }, { from: 9, to: 10 },
          { from: 8, to: 10 }, { from: 9, to: 12 }, { from: 10, to: 11 },
          { from: 11, to: 12 }, { from: 12, to: 13 }
        ],
        color: seal.color_signature || '#3B82F6',
        animation: 'flow',
        speed: 0.3
      },
      'merkaba': {
        type: 'merkaba',
        vertices: [
          { x: 0, y: -40 }, { x: 35, y: 20 }, { x: -35, y: 20 },
          { x: 0, y: 40 }, { x: -35, y: -20 }, { x: 35, y: -20 }
        ],
        connections: [
          { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 4 },
          { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 5 },
          { from: 2, to: 3 }, { from: 2, to: 4 }, { from: 3, to: 4 },
          { from: 3, to: 5 }, { from: 4, to: 5 }, { from: 5, to: 0 }
        ],
        color: seal.color_signature || '#10B981',
        animation: 'pulse',
        speed: 0.8
      },
      'tree-of-life': {
        type: 'tree-of-life',
        vertices: [
          { x: 0, y: -50 }, { x: -30, y: -30 }, { x: 30, y: -30 },
          { x: -50, y: -10 }, { x: 0, y: -10 }, { x: 50, y: -10 },
          { x: -30, y: 10 }, { x: 30, y: 10 },
          { x: -20, y: 30 }, { x: 20, y: 30 }, { x: 0, y: 50 }
        ],
        connections: [
          { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 },
          { from: 1, to: 4 }, { from: 2, to: 4 }, { from: 2, to: 5 },
          { from: 3, to: 6 }, { from: 4, to: 6 }, { from: 4, to: 7 },
          { from: 5, to: 7 }, { from: 6, to: 8 }, { from: 6, to: 9 },
          { from: 7, to: 9 }, { from: 7, to: 10 }, { from: 8, to: 10 },
          { from: 9, to: 10 }
        ],
        color: seal.color_signature || '#F59E0B',
        animation: 'static',
        speed: 0.2
      }
    };

    return basePatterns[seal.geometry_type] || basePatterns['flower-of-life'];
  };

  const pattern = generateGeometryPattern(seal);

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      setRotation(prev => prev + pattern.speed);
      setPulseIntensity(prev => Math.sin(Date.now() * 0.003) * 0.5 + 0.5);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, pattern.speed]);

  // Draw geometry on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = isActive ? 1.2 : 1;
    const alpha = isActive ? 0.8 + pulseIntensity * 0.2 : 0.6;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = pattern.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = alpha;
    ctx.beginPath();

    pattern.connections.forEach(connection => {
      const from = pattern.vertices[connection.from];
      const to = pattern.vertices[connection.to];
      
      const fromX = centerX + from.x * scale;
      const fromY = centerY + from.y * scale;
      const toX = centerX + to.x * scale;
      const toY = centerY + to.y * scale;

      if (pattern.animation === 'rotate') {
        const angle = rotation * Math.PI / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        const rotatedFromX = centerX + (from.x * cos - from.y * sin) * scale;
        const rotatedFromY = centerY + (from.x * sin + from.y * cos) * scale;
        const rotatedToX = centerX + (to.x * cos - to.y * sin) * scale;
        const rotatedToY = centerY + (to.x * sin + to.y * cos) * scale;
        
        ctx.moveTo(rotatedFromX, rotatedFromY);
        ctx.lineTo(rotatedToX, rotatedToY);
      } else {
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
      }
    });

    ctx.stroke();

    // Draw vertices
    pattern.vertices.forEach((vertex, index) => {
      let x = centerX + vertex.x * scale;
      let y = centerY + vertex.y * scale;

      if (pattern.animation === 'rotate') {
        const angle = rotation * Math.PI / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        x = centerX + (vertex.x * cos - vertex.y * sin) * scale;
        y = centerY + (vertex.x * sin + vertex.y * cos) * scale;
      }

      ctx.fillStyle = pattern.color;
      ctx.globalAlpha = alpha + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, 4 + (pattern.animation === 'pulse' ? pulseIntensity * 2 : 0), 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw energy field if active
    if (isActive) {
      ctx.strokeStyle = pattern.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80 + pulseIntensity * 20, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }, [pattern, rotation, pulseIntensity, isActive]);

  const getGeometryIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'flower-of-life': <Hexagon className="w-5 h-5" />,
      'metatron-cube': <Square className="w-5 h-5" />,
      'merkaba': <Triangle className="w-5 h-5" />,
      'tree-of-life': <Circle className="w-5 h-5" />
    };
    return icons[type] || <Star className="w-5 h-5" />;
  };

  const getAnimationIcon = (animation: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'rotate': <RotateCcw className="w-4 h-4" />,
      'pulse': <Heart className="w-4 h-4" />,
      'flow': <Zap className="w-4 h-4" />,
      'static': <Eye className="w-4 h-4" />
    };
    return icons[animation] || <Sparkles className="w-4 h-4" />;
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/20 border-purple-500/30 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-white">
          {getGeometryIcon(pattern.type)}
          {seal.seal_name}
        </CardTitle>
        <Badge variant="outline" className="border-purple-400/50 text-purple-300 w-fit mx-auto">
          {pattern.type.replace('-', ' ')}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Canvas Visualization */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="w-full h-64 border border-purple-400/30 rounded-lg bg-black/20"
          />
          
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-32 h-32 border-2 border-gold-400/50 rounded-full animate-ping" />
            </motion.div>
          )}
        </div>

        {/* Seal Information */}
        <div className="space-y-3">
          <div className="text-center">
            <h4 className="font-semibold text-white mb-2">Sacred Oath</h4>
            <p className="text-sm text-purple-200 italic">
              "{seal.oath_text}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-purple-300">Order:</span>
              <span className="text-white ml-2">{seal.seal_order}</span>
            </div>
            <div>
              <span className="text-purple-300">Color:</span>
              <div className="inline-block w-4 h-4 rounded-full ml-2" style={{ backgroundColor: pattern.color }} />
            </div>
            <div>
              <span className="text-purple-300">Animation:</span>
              <span className="text-white ml-2 flex items-center gap-1">
                {getAnimationIcon(pattern.animation)}
                {pattern.animation}
              </span>
            </div>
            <div>
              <span className="text-purple-300">Frequency:</span>
              <span className="text-white ml-2">{pattern.speed}x</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex justify-center gap-2 pt-4 border-t border-purple-400/30">
            <Button
              onClick={() => setIsAnimating(!isAnimating)}
              variant="outline"
              size="sm"
              className="border-purple-400/50 text-purple-300"
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={() => setRotation(0)}
              variant="outline"
              size="sm"
              className="border-purple-400/50 text-purple-300"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="outline"
              size="sm"
              className="border-purple-400/50 text-purple-300"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        )}

        {/* Activation Button */}
        {onActivate && (
          <Button
            onClick={onActivate}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          >
            <Crown className="w-4 h-4 mr-2" />
            Activate Sacred Seal
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
