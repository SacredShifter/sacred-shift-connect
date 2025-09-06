import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ResonanceFieldProps {
  resonanceField: {
    personalFrequency: number;
    chakraAlignment: Array<{
      id: string;
      name: string;
      level: number;
      color: string;
      frequency: number;
      isActive: boolean;
    }>;
    emotionalState: {
      primary: string;
      secondary: string;
      intensity: number;
      patterns: string[];
    };
    consciousnessLevel: number;
    collectiveResonance: number;
  };
  isActive: boolean;
}

export const ResonanceFieldVisualization: React.FC<ResonanceFieldProps> = ({ 
  resonanceField, 
  isActive 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawResonanceField = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) / 3;

      // Draw chakra energy rings
      resonanceField.chakraAlignment.forEach((chakra, index) => {
        if (!chakra.isActive) return;

        const radius = (maxRadius * chakra.level) / 2;
        const angle = (index * Math.PI * 2) / resonanceField.chakraAlignment.length;
        const x = centerX + Math.cos(angle + time * 0.001) * radius;
        const y = centerY + Math.sin(angle + time * 0.001) * radius;

        // Chakra energy orb
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
        
        // Convert hex color to rgba format with validation
        const hex = chakra.color.replace('#', '');
        
        // Debug logging
        if (hex.length !== 6) {
          console.warn(`Invalid hex color for chakra ${chakra.id}: ${chakra.color}`);
        }
        
        const r = parseInt(hex.substr(0, 2), 16) || 0;
        const g = parseInt(hex.substr(2, 2), 16) || 0;
        const b = parseInt(hex.substr(4, 2), 16) || 0;
        
        // Ensure valid RGB values
        const validR = isNaN(r) ? 0 : Math.max(0, Math.min(255, r));
        const validG = isNaN(g) ? 0 : Math.max(0, Math.min(255, g));
        const validB = isNaN(b) ? 0 : Math.max(0, Math.min(255, b));
        
        gradient.addColorStop(0, `rgba(${validR}, ${validG}, ${validB}, ${chakra.level})`);
        gradient.addColorStop(1, `rgba(${validR}, ${validG}, ${validB}, 0)`);

        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Energy connection lines
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `${chakra.color}${Math.floor(chakra.level * 128).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw personal frequency waves
      const frequency = resonanceField.personalFrequency;
      const waveCount = 5;
      
      for (let i = 0; i < waveCount; i++) {
        const waveRadius = (maxRadius * 0.3) + (i * 20);
        const waveOpacity = 0.3 - (i * 0.05);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, waveRadius + Math.sin(time * 0.002 + i) * 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(147, 51, 234, ${waveOpacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw collective resonance field
      const collectiveRadius = maxRadius * resonanceField.collectiveResonance;
      const collectiveGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, collectiveRadius);
      collectiveGradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      collectiveGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, collectiveRadius, 0, Math.PI * 2);
      ctx.fillStyle = collectiveGradient;
      ctx.fill();

      time += 16;
      animationId = requestAnimationFrame(drawResonanceField);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    drawResonanceField();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [resonanceField, isActive]);

  if (!isActive) return null;

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
};
