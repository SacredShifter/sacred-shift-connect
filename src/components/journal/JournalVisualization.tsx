import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface JournalVisualizationProps {
  mode: string;
  isWriting: boolean;
  resonanceTags: string[];
}

export const JournalVisualization: React.FC<JournalVisualizationProps> = ({
  mode,
  isWriting,
  resonanceTags
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    const modeColors = {
      stream: '#3B82F6',
      reflection: '#8B5CF6',
      transmutation: '#F97316',
      integration: '#10B981'
    };

    const baseColor = modeColors[mode as keyof typeof modeColors] || '#6B7280';

    // Create particles based on writing activity
    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        color: baseColor
      };
    };

    // Initialize particles
    for (let i = 0; i < (isWriting ? 50 : 20); i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // Fade out over time
        particle.opacity *= 0.999;
        if (particle.opacity < 0.01) {
          particles[index] = createParticle();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mode, isWriting, resonanceTags]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-20"
        style={{ filter: 'blur(0.5px)' }}
      />
      
      {/* Gradient overlay that responds to mode */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: mode === 'stream' ? 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
            : mode === 'reflection' ? 'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
            : mode === 'transmutation' ? 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 70% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
        }}
        transition={{ duration: 2 }}
      />
    </div>
  );
};