import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface UIFragmentationProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isReassembling?: boolean;
  onComplete?: () => void;
}

export function UIFragmentation({ 
  containerRef, 
  isReassembling = false, 
  onComplete 
}: UIFragmentationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Capture UI as image data
    const captureUI = () => {
      try {
        // Create a temporary canvas to capture the current UI
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;
        
        tempCanvas.width = window.innerWidth;
        tempCanvas.height = window.innerHeight;
        
        // For now, create a simple gradient representing the UI
        // In a full implementation, this would capture the actual DOM
        const gradient = tempCtx.createLinearGradient(0, 0, 0, window.innerHeight);
        gradient.addColorStop(0, 'rgba(30, 30, 46, 0.8)');
        gradient.addColorStop(1, 'rgba(17, 24, 39, 0.9)');
        
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Add some UI-like elements
        tempCtx.fillStyle = 'rgba(79, 70, 229, 0.3)';
        tempCtx.fillRect(50, 50, window.innerWidth - 100, 100);
        tempCtx.fillRect(50, 200, 200, 300);
        tempCtx.fillRect(300, 250, window.innerWidth - 400, 200);
        
        return tempCanvas;
      } catch (error) {
        console.error('Failed to capture UI:', error);
        return null;
      }
    };
    
    const uiCanvas = captureUI();
    if (!uiCanvas) return;
    
    // Fragment animation
    const fragments: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      sourceX: number;
      sourceY: number;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }> = [];
    
    // Create fragments
    const fragmentSize = 20;
    for (let x = 0; x < window.innerWidth; x += fragmentSize) {
      for (let y = 0; y < window.innerHeight; y += fragmentSize) {
        fragments.push({
          x,
          y,
          width: Math.min(fragmentSize, window.innerWidth - x),
          height: Math.min(fragmentSize, window.innerHeight - y),
          sourceX: x,
          sourceY: y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          opacity: 1
        });
      }
    }
    
    let animationFrame: number;
    let startTime: number;
    const duration = isReassembling ? 2000 : 3000; // ms
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Animate fragments
      fragments.forEach(fragment => {
        ctx.save();
        
        if (isReassembling) {
          // Reassembling: move back to original position
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          fragment.x = fragment.sourceX + (fragment.sourceX - fragment.x) * easeProgress * 0.1;
          fragment.y = fragment.sourceY + (fragment.sourceY - fragment.y) * easeProgress * 0.1;
          fragment.opacity = progress;
          fragment.rotation *= (1 - easeProgress * 0.1);
        } else {
          // Fragmenting: drift away and fade out
          fragment.x += fragment.vx * progress * 5;
          fragment.y += fragment.vy * progress * 5;
          fragment.rotation += fragment.rotationSpeed * progress * 10;
          fragment.opacity = Math.max(0, 1 - progress * 1.5);
        }
        
        // Apply transformations
        ctx.globalAlpha = fragment.opacity;
        ctx.translate(fragment.x + fragment.width / 2, fragment.y + fragment.height / 2);
        ctx.rotate(fragment.rotation);
        ctx.translate(-fragment.width / 2, -fragment.height / 2);
        
        // Draw fragment
        try {
          ctx.drawImage(
            uiCanvas,
            fragment.sourceX, fragment.sourceY, fragment.width, fragment.height,
            0, 0, fragment.width, fragment.height
          );
        } catch (error) {
          // Fallback: draw colored rectangle
          ctx.fillStyle = `rgba(79, 70, 229, ${fragment.opacity * 0.3})`;
          ctx.fillRect(0, 0, fragment.width, fragment.height);
        }
        
        ctx.restore();
      });
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [containerRef, isReassembling, onComplete]);
  
  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ zIndex: 1000 }}
    />
  );
}