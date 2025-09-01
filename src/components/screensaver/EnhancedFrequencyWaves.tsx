import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FrequencyWaveProps {
  isActive: boolean;
  breathPhase: number;
  dominantColor: [number, number, number];
  resonanceStrength: number;
}

export function EnhancedFrequencyWaves({ 
  isActive, 
  breathPhase, 
  dominantColor, 
  resonanceStrength 
}: FrequencyWaveProps) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleData = useMemo(() => {
    const count = 12000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    
    const sacredColors = [
      [0.6, 0.2, 1.0], // Violet
      [1.0, 0.8, 0.2], // Gold
      [0.2, 1.0, 0.8], // Aquamarine
      dominantColor     // Collective resonance color
    ];
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create flowing stream patterns
      const streamIndex = Math.floor(i / (count / 8)); // 8 streams
      const streamAngle = (streamIndex / 8) * Math.PI * 2;
      const streamRadius = 3 + Math.random() * 2;
      const streamHeight = (Math.random() - 0.5) * 8;
      
      // Spiral flow pattern
      const spiralProgress = (i % (count / 8)) / (count / 8);
      const spiralAngle = streamAngle + spiralProgress * Math.PI * 4;
      const spiralRadius = streamRadius * (1 + spiralProgress * 0.5);
      
      positions[i3] = Math.cos(spiralAngle) * spiralRadius;
      positions[i3 + 1] = streamHeight + spiralProgress * 2;
      positions[i3 + 2] = Math.sin(spiralAngle) * spiralRadius;
      
      // Flow velocities
      velocities[i3] = Math.cos(spiralAngle + Math.PI / 2) * 0.02;
      velocities[i3 + 1] = 0.01 + Math.random() * 0.01;
      velocities[i3 + 2] = Math.sin(spiralAngle + Math.PI / 2) * 0.02;
      
      // Phase for wave motion
      phases[i] = Math.random() * Math.PI * 2;
      
      // Color selection with gradient mixing
      const colorIndex = Math.floor(Math.random() * sacredColors.length);
      const baseColor = sacredColors[colorIndex];
      const colorVariation = 0.3;
      
      colors[i3] = baseColor[0] + (Math.random() - 0.5) * colorVariation;
      colors[i3 + 1] = baseColor[1] + (Math.random() - 0.5) * colorVariation;
      colors[i3 + 2] = baseColor[2] + (Math.random() - 0.5) * colorVariation;
    }
    
    return {
      positions,
      colors,
      velocities,
      phases,
      count
    };
  }, [dominantColor]);
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        breathPhase: { value: 0 },
        resonanceStrength: { value: 1.0 },
        dominantColor: { value: new THREE.Color(...dominantColor) }
      },
      vertexShader: `
        uniform float time;
        uniform float breathPhase;
        uniform float resonanceStrength;
        attribute float phase;
        varying vec3 vColor;
        varying float vIntensity;
        
        // Frequency wave function
        vec3 frequencyDisplacement(vec3 pos, float time, float phase) {
          float dist = length(pos.xz);
          float wave1 = sin(dist * 2.0 - time * 3.0 + phase) * 0.3;
          float wave2 = sin(dist * 4.0 - time * 2.0 + phase * 1.5) * 0.15;
          float wave3 = sin(dist * 8.0 - time * 4.0 + phase * 0.7) * 0.08;
          
          float totalWave = wave1 + wave2 + wave3;
          return vec3(0.0, totalWave, 0.0);
        }
        
        void main() {
          vColor = color;
          
          // Apply frequency waves
          vec3 displaced = position + frequencyDisplacement(position, time, phase);
          
          // Breathing effect
          displaced *= (1.0 + breathPhase * 0.2);
          
          // Flow motion
          displaced.x += sin(time * 0.5 + phase) * 0.1;
          displaced.z += cos(time * 0.7 + phase) * 0.1;
          
          // Resonance strength affects intensity
          vIntensity = 0.7 + resonanceStrength * 0.3 + sin(time * 2.0 + phase) * 0.2;
          
          vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
          gl_PointSize = (2.0 + resonanceStrength * 0.5) * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 dominantColor;
        varying vec3 vColor;
        varying float vIntensity;
        
        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;
          
          float glow = exp(-r * 4.0);
          
          // Mix particle color with dominant resonance color
          vec3 finalColor = mix(vColor, dominantColor, 0.3) * vIntensity;
          finalColor *= (1.0 + glow * 0.8);
          
          float alpha = glow * vIntensity * 0.8;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
  }, [dominantColor]);
  
  useFrame(({ clock }) => {
    if (!isActive || !particlesRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Update shader uniforms
    material.uniforms.time.value = time;
    material.uniforms.breathPhase.value = breathPhase;
    material.uniforms.resonanceStrength.value = resonanceStrength / 10; // Normalize to 0-1 range
    material.uniforms.dominantColor.value.setRGB(...dominantColor);
    
    // Update particle positions for continuous flow
    const geometry = particlesRef.current.geometry;
    const positions = geometry.attributes.position.array as Float32Array;
    const velocities = particleData.velocities;
    
    for (let i = 0; i < particleData.count; i++) {
      const i3 = i * 3;
      
      // Apply flow motion
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];
      
      // Wrap particles that flow too far
      if (positions[i3 + 1] > 6) {
        positions[i3 + 1] = -6;
      }
      
      const dist = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
      if (dist > 8) {
        const scale = 3 / dist;
        positions[i3] *= scale;
        positions[i3 + 2] *= scale;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef} material={material} geometry={useMemo(() => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(particleData.colors, 3));
      geo.setAttribute('phase', new THREE.BufferAttribute(particleData.phases, 1));
      return geo;
    }, [particleData.positions, particleData.colors, particleData.phases])} />
  );
}