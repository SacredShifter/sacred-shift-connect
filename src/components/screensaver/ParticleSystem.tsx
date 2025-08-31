import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type ScreensaverPhase = "idle" | "fragmenting" | "frequency" | "reassembling";

interface ParticleSystemProps {
  phase: ScreensaverPhase;
  particles: any[];
  setParticles: (particles: any[]) => void;
}

export function ParticleSystem({ phase, particles, setParticles }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  
  // Generate particle data
  const particleData = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Random positions across screen space
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 10;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Store original positions for reassembly
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
      
      // Random velocities for drift
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      
      // Sacred Shifter colors
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Gold/Yellow
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0.2;
      } else if (colorChoice < 0.66) {
        // Purple/Violet
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.2;
        colors[i * 3 + 2] = 1;
      } else {
        // Cyan/Blue
        colors[i * 3] = 0.2;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
      }
    }
    
    return {
      positions,
      colors,
      velocities,
      originalPositions,
      count
    };
  }, []);
  
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    
    const time = clock.getElapsedTime();
    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.attributes.position;
    const positions = positionAttribute.array as Float32Array;
    
    // Update particles based on phase
    for (let i = 0; i < particleData.count; i++) {
      const i3 = i * 3;
      
      switch (phase) {
        case "fragmenting":
          // Drift away from original positions
          positions[i3] += particleData.velocities[i3];
          positions[i3 + 1] += particleData.velocities[i3 + 1];
          positions[i3 + 2] += particleData.velocities[i3 + 2];
          break;
          
        case "frequency":
          // Create flowing patterns
          const flowTime = time * 0.5;
          const radius = 3 + Math.sin(time * 0.3) * 0.5;
          const angle = i * 0.01 + flowTime;
          
          positions[i3] = Math.cos(angle) * radius + Math.sin(flowTime + i * 0.1) * 0.5;
          positions[i3 + 1] = Math.sin(angle) * radius * 0.5 + Math.cos(flowTime * 0.7 + i * 0.05) * 0.3;
          positions[i3 + 2] = Math.sin(flowTime + i * 0.02) * 2;
          break;
          
        case "reassembling":
          // Return to original positions
          const reassemblySpeed = 0.05;
          positions[i3] += (particleData.originalPositions[i3] - positions[i3]) * reassemblySpeed;
          positions[i3 + 1] += (particleData.originalPositions[i3 + 1] - positions[i3 + 1]) * reassemblySpeed;
          positions[i3 + 2] += (particleData.originalPositions[i3 + 2] - positions[i3 + 2]) * reassemblySpeed;
          break;
      }
    }
    
    positionAttribute.needsUpdate = true;
    
    // Update material properties
    if (materialRef.current) {
      switch (phase) {
        case "fragmenting":
          materialRef.current.opacity = Math.max(0.1, 1 - (time * 0.3));
          materialRef.current.size = 0.02 + Math.sin(time * 2) * 0.01;
          break;
          
        case "frequency":
          materialRef.current.opacity = 0.8 + Math.sin(time * 1.5) * 0.2;
          materialRef.current.size = 0.03 + Math.sin(time * 3) * 0.02;
          break;
          
        case "reassembling":
          materialRef.current.opacity = Math.min(1, time * 0.5);
          materialRef.current.size = 0.02;
          break;
      }
    }
  });
  
  return (
    <points ref={pointsRef} geometry={useMemo(() => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(particleData.colors, 3));
      return geo;
    }, [particleData.positions, particleData.colors])}>
      <pointsMaterial
        ref={materialRef}
        size={0.02}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}