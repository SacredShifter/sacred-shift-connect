import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CollectiveEnergyVisualizerProps {
  resonanceLevel: number;
  participantCount: number;
  energyQuality: 'harmonious' | 'discordant' | 'transcendent' | 'seeking';
  className?: string;
}

export const CollectiveEnergyVisualizer: React.FC<CollectiveEnergyVisualizerProps> = ({
  resonanceLevel,
  participantCount,
  energyQuality,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      time += 0.02;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.3;

      // Draw sacred geometry based on energy quality
      drawSacredGeometry(ctx, centerX, centerY, baseRadius, resonanceLevel, energyQuality, time, participantCount);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateCanvasSize();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resonanceLevel, participantCount, energyQuality]);

  const drawSacredGeometry = (
    ctx: CanvasRenderingContext2D,
    centerX: number, 
    centerY: number, 
    radius: number, 
    resonance: number,
    quality: string,
    time: number,
    participants: number
  ) => {
    // Base sacred circle
    ctx.save();
    
    // Energy color based on quality
    const colors = {
      harmonious: `hsl(280, 70%, ${50 + resonance * 30}%)`,     // Purple-blue
      transcendent: `hsl(300, 80%, ${60 + resonance * 20}%)`,   // Magenta
      seeking: `hsl(200, 60%, ${40 + resonance * 40}%)`,        // Blue
      discordant: `hsl(15, 70%, ${45 + resonance * 25}%)`       // Red-orange
    };

    const primaryColor = colors[quality as keyof typeof colors];
    
    // Draw pulsing sacred circle
    const pulseRadius = radius * (1 + Math.sin(time * 2) * 0.1 * resonance);
    
    // Outer glow
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius * 1.5);
    gradient.addColorStop(0, primaryColor.replace(')', ', 0.3)').replace('hsl', 'hsla'));
    gradient.addColorStop(0.7, primaryColor.replace(')', ', 0.1)').replace('hsl', 'hsla'));
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Main sacred circle
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw participant energy nodes
    for (let i = 0; i < participants; i++) {
      const angle = (i / participants) * Math.PI * 2 + time;
      const nodeRadius = pulseRadius * 0.8;
      const x = centerX + Math.cos(angle) * nodeRadius;
      const y = centerY + Math.sin(angle) * nodeRadius;
      
      // Node glow
      const nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
      nodeGradient.addColorStop(0, primaryColor);
      nodeGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = nodeGradient;
      ctx.beginPath();
      ctx.arc(x, y, 8 + Math.sin(time * 3 + i) * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sacred geometry patterns based on quality
    if (quality === 'transcendent') {
      drawFlowerOfLife(ctx, centerX, centerY, radius * 0.6, time, primaryColor);
    } else if (quality === 'harmonious') {
      drawSeedOfLife(ctx, centerX, centerY, radius * 0.5, time, primaryColor);
    } else if (quality === 'seeking') {
      drawSpiral(ctx, centerX, centerY, radius * 0.7, time, primaryColor);
    }

    // Center sacred symbol
    ctx.fillStyle = primaryColor;
    ctx.font = `${radius * 0.3}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText('🌸', centerX, centerY + radius * 0.1);

    ctx.restore();
  };

  const drawFlowerOfLife = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, time: number, color: string) => {
    ctx.strokeStyle = color.replace(')', ', 0.4)').replace('hsl', 'hsla');
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + time * 0.5;
      const x = centerX + Math.cos(angle) * radius * 0.5;
      const y = centerY + Math.sin(angle) * radius * 0.5;
      
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawSeedOfLife = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, time: number, color: string) => {
    ctx.strokeStyle = color.replace(')', ', 0.5)').replace('hsl', 'hsla');
    ctx.lineWidth = 1.5;
    
    // Central circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
    ctx.stroke();
    
    // Six surrounding circles
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + time * 0.3;
      const x = centerX + Math.cos(angle) * radius * 0.3;
      const y = centerY + Math.sin(angle) * radius * 0.3;
      
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawSpiral = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, time: number, color: string) => {
    ctx.strokeStyle = color.replace(')', ', 0.6)').replace('hsl', 'hsla');
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    for (let i = 0; i < 100; i++) {
      const angle = (i / 10) + time;
      const spiralRadius = (i / 100) * radius;
      const x = centerX + Math.cos(angle) * spiralRadius;
      const y = centerY + Math.sin(angle) * spiralRadius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Energy quality indicator */}
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: {
                harmonious: 'hsl(280, 70%, 60%)',
                transcendent: 'hsl(300, 80%, 70%)',
                seeking: 'hsl(200, 60%, 60%)',
                discordant: 'hsl(15, 70%, 55%)'
              }[energyQuality]
            }}
          />
          <span className="capitalize">{energyQuality}</span>
        </div>
      </div>
    </div>
  );
};