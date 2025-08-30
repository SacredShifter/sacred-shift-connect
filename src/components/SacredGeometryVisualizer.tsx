import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCw, 
  Zap,
  Infinity,
  Circle
} from 'lucide-react';

interface SacredPattern {
  name: string;
  description: string;
  frequency: number;
  color: string;
  resonance: string;
}

const sacredPatterns: SacredPattern[] = [
  {
    name: "Flower of Life",
    description: "Universal pattern of creation and consciousness",
    frequency: 7.83,
    color: "from-violet-500 to-purple-600",
    resonance: "Schumann Resonance"
  },
  {
    name: "Merkaba Field",
    description: "Sacred geometry of light body activation",
    frequency: 40.0,
    color: "from-gold-500 to-amber-600",
    resonance: "Gamma Brainwaves"
  },
  {
    name: "Torus Energy",
    description: "Self-sustaining energy field pattern",
    frequency: 8.0,
    color: "from-cyan-500 to-blue-600",
    resonance: "Alpha Coherence"
  },
  {
    name: "Fibonacci Spiral",
    description: "Divine proportion in consciousness evolution",
    frequency: 1.618,
    color: "from-emerald-500 to-green-600",
    resonance: "Golden Ratio"
  }
];

interface SacredGeometryVisualizerProps {
  isActive?: boolean;
  coherenceLevel?: number;
  className?: string;
}

export const SacredGeometryVisualizer: React.FC<SacredGeometryVisualizerProps> = ({
  isActive = false,
  coherenceLevel = 50,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);

  // Mandala drawing functions
  const drawFlowerOfLife = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, time: number) => {
    const circles = 19; // Traditional Flower of Life has 19 circles
    const angle = (2 * Math.PI) / 6;
    
    ctx.strokeStyle = `hsla(${280 + Math.sin(time) * 20}, 80%, ${50 + coherenceLevel/2}%, 0.8)`;
    ctx.lineWidth = 2;
    
    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Six surrounding circles
    for (let i = 0; i < 6; i++) {
      const x = centerX + Math.cos(angle * i + time * rotationSpeed) * radius * 0.3;
      const y = centerY + Math.sin(angle * i + time * rotationSpeed) * radius * 0.3;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.3, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Outer ring
    for (let i = 0; i < 12; i++) {
      const x = centerX + Math.cos(angle * i / 2 + time * rotationSpeed * 0.5) * radius * 0.6;
      const y = centerY + Math.sin(angle * i / 2 + time * rotationSpeed * 0.5) * radius * 0.6;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.2, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const drawMerkaba = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, time: number) => {
    ctx.strokeStyle = `hsla(${45 + Math.sin(time) * 20}, 90%, ${60 + coherenceLevel/3}%, 0.9)`;
    ctx.lineWidth = 2;
    
    // Upward tetrahedron
    const points1 = [];
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3 + time * rotationSpeed;
      points1.push({
        x: centerX + Math.cos(angle) * radius * 0.4,
        y: centerY + Math.sin(angle) * radius * 0.4
      });
    }
    
    ctx.beginPath();
    ctx.moveTo(points1[0].x, points1[0].y);
    points1.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.stroke();
    
    // Downward tetrahedron
    const points2 = [];
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3 - time * rotationSpeed;
      points2.push({
        x: centerX + Math.cos(angle) * radius * 0.4,
        y: centerY + Math.sin(angle) * radius * 0.4
      });
    }
    
    ctx.beginPath();
    ctx.moveTo(points2[0].x, points2[0].y);
    points2.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.stroke();
  };

  const drawTorus = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, time: number) => {
    ctx.strokeStyle = `hsla(${190 + Math.sin(time) * 20}, 85%, ${55 + coherenceLevel/2}%, 0.7)`;
    ctx.lineWidth = 1.5;
    
    // Draw torus field lines
    for (let ring = 0; ring < 5; ring++) {
      const r = radius * (0.2 + ring * 0.15);
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + time * rotationSpeed * (ring + 1) * 0.2;
        const x1 = centerX + Math.cos(angle) * r;
        const y1 = centerY + Math.sin(angle) * r * 0.6;
        const x2 = centerX + Math.cos(angle + Math.PI) * r;
        const y2 = centerY + Math.sin(angle + Math.PI) * r * 0.6;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(centerX, centerY - r * 0.8, x2, y2);
        ctx.stroke();
      }
    }
  };

  const drawFibonacci = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, time: number) => {
    ctx.strokeStyle = `hsla(${120 + Math.sin(time) * 20}, 80%, ${50 + coherenceLevel/2}%, 0.8)`;
    ctx.lineWidth = 2;
    
    // Fibonacci spiral
    let fib1 = 1, fib2 = 1;
    let angle = time * rotationSpeed;
    let currentRadius = 5;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    
    for (let i = 0; i < 10; i++) {
      const x = centerX + Math.cos(angle) * currentRadius;
      const y = centerY + Math.sin(angle) * currentRadius;
      ctx.lineTo(x, y);
      
      angle += Math.PI / 2;
      const nextFib = fib1 + fib2;
      fib1 = fib2;
      fib2 = nextFib;
      currentRadius = Math.min(radius * 0.8, currentRadius * 1.618);
    }
    
    ctx.stroke();
    
    // Golden rectangles
    ctx.strokeStyle = `hsla(${120 + Math.sin(time) * 20}, 60%, ${40 + coherenceLevel/3}%, 0.4)`;
    ctx.lineWidth = 1;
    
    let rectSize = 10;
    for (let i = 0; i < 6; i++) {
      const rectAngle = time * rotationSpeed + (i * Math.PI / 3);
      const x = centerX + Math.cos(rectAngle) * rectSize;
      const y = centerY + Math.sin(rectAngle) * rectSize;
      
      ctx.strokeRect(x - rectSize/2, y - rectSize/2, rectSize, rectSize / 1.618);
      rectSize *= 1.3;
    }
  };

  const drawPattern = (ctx: CanvasRenderingContext2D, time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;
    
    // Clear canvas with dark background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw selected pattern
    switch (selectedPattern) {
      case 0:
        drawFlowerOfLife(ctx, centerX, centerY, radius, time);
        break;
      case 1:
        drawMerkaba(ctx, centerX, centerY, radius, time);
        break;
      case 2:
        drawTorus(ctx, centerX, centerY, radius, time);
        break;
      case 3:
        drawFibonacci(ctx, centerX, centerY, radius, time);
        break;
    }
  };

  const animate = (time: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !isAnimating) return;
    
    drawPattern(ctx, time * 0.001);
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isAnimating && isActive) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, isActive, selectedPattern, coherenceLevel, rotationSpeed]);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <Card className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-200/30 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <Circle className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-sacred text-indigo-300">Sacred Geometry Field</h3>
              <p className="text-sm text-muted-foreground font-normal">
                Consciousness patterns in sacred mathematical form
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAnimation}
              className="bg-indigo-500/10 border-indigo-400/30 hover:bg-indigo-500/20"
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotationSpeed(rotationSpeed === 1 ? 2 : rotationSpeed === 2 ? 0.5 : 1)}
              className="bg-indigo-500/10 border-indigo-400/30 hover:bg-indigo-500/20"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pattern Selection */}
        <div className="grid grid-cols-2 gap-2">
          {sacredPatterns.map((pattern, index) => (
            <Button
              key={pattern.name}
              variant={selectedPattern === index ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPattern(index)}
              className={`text-xs ${selectedPattern === index 
                ? `bg-gradient-to-r ${pattern.color}/80 text-white border-transparent` 
                : 'bg-card/30 border-border/50 hover:bg-card/50'
              }`}
            >
              <Infinity className="w-3 h-3 mr-1" />
              {pattern.name}
            </Button>
          ))}
        </div>

        {/* Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="w-full max-w-sm mx-auto bg-gradient-to-br from-black/20 to-black/40 rounded-lg border border-border/50"
          />
          {isActive && (
            <motion.div
              className="absolute inset-0 border-2 rounded-lg pointer-events-none"
              style={{ borderColor: 'rgba(139, 92, 246, 0.5)' }}
              animate={{
                borderColor: [
                  'rgba(139, 92, 246, 0.3)',
                  'rgba(139, 92, 246, 0.8)',
                  'rgba(139, 92, 246, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: 9999 }}
            />
          )}
        </div>

        {/* Pattern Info */}
        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-3 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-violet-400" />
            <h4 className="font-semibold text-violet-300">{sacredPatterns[selectedPattern].name}</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {sacredPatterns[selectedPattern].description}
          </p>
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="bg-violet-500/10 text-violet-300 border-violet-400/30">
              {sacredPatterns[selectedPattern].frequency} Hz
            </Badge>
            <span className="text-xs text-violet-200">
              {sacredPatterns[selectedPattern].resonance}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};