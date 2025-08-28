import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { ConstellationEntry } from '@/hooks/useConstellationData';

interface ConstellationNodeProps {
  entry: ConstellationEntry;
  isSelected: boolean;
  isHighlighted: boolean;
  showLawOfFragments: boolean;
  zoomLevel: 'far' | 'mid' | 'close';
  onClick: (entry: ConstellationEntry) => void;
  onHover: (entry: ConstellationEntry | null) => void;
}

export function ConstellationNode({
  entry,
  isSelected,
  isHighlighted,
  showLawOfFragments,
  zoomLevel,
  onClick,
  onHover
}: ConstellationNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const lawOfFragmentsRef = useRef<THREE.Mesh>(null);

  // Calculate node size based on type and zoom level
  const nodeSize = useMemo(() => {
    const baseSize = entry.isAnchor ? 0.8 : 0.4;
    const zoomMultiplier = {
      far: 0.5,
      mid: 1.0,
      close: 1.5
    }[zoomLevel];
    
    return baseSize * zoomMultiplier;
  }, [entry.isAnchor, zoomLevel]);

  // Color based on theme
  const nodeColor = useMemo(() => {
    const themeColors = {
      phoenix: '#FF6B35',
      dragon: '#C41E3A',
      butterfly: '#9B59B6',
      pyramid: '#F39C12',
      'sacred shifter': '#2ECC71',
      dream: '#3498DB',
      lesson: '#E67E22',
      download: '#1ABC9C',
      integration: '#9B59B6',
      fragment: '#95A5A6',
      vision: '#8E44AD',
      revelation: '#F1C40F',
      memory: '#34495E'
    };
    
    return themeColors[entry.theme as keyof typeof themeColors] || '#95A5A6';
  }, [entry.theme]);

  // Triangle geometry for the node
  const triangleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, nodeSize * 0.8, 0,      // Top vertex
      -nodeSize * 0.7, -nodeSize * 0.4, 0,  // Bottom left
      nodeSize * 0.7, -nodeSize * 0.4, 0    // Bottom right
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    return geometry;
  }, [nodeSize]);

  // Law of Fragments overlay geometry (smaller pyramid inside)
  const fragmentsGeometry = useMemo(() => {
    if (!showLawOfFragments) return null;
    
    const geometry = new THREE.BufferGeometry();
    const size = nodeSize * 0.3;
    const vertices = new Float32Array([
      0, size * 0.8, 0.01,      // Top vertex (slightly forward)
      -size * 0.7, -size * 0.4, 0.01,  // Bottom left
      size * 0.7, -size * 0.4, 0.01    // Bottom right
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    return geometry;
  }, [nodeSize, showLawOfFragments]);

  // Materials
  const mainMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: nodeColor,
      emissive: new THREE.Color(nodeColor).multiplyScalar(0.1),
      metalness: 0.3,
      roughness: 0.7,
      transparent: true,
      opacity: entry.isAnchor ? 0.9 : 0.7
    });
  }, [nodeColor, entry.isAnchor]);

  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: nodeColor,
      transparent: true,
      opacity: 0,
      side: THREE.BackSide
    });
  }, [nodeColor]);

  const fragmentsMaterial = useMemo(() => {
    if (!showLawOfFragments) return null;
    
    return new THREE.MeshBasicMaterial({
      color: nodeColor,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
  }, [nodeColor, showLawOfFragments]);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Gentle breathing animation for anchors
    if (entry.isAnchor) {
      const breathe = Math.sin(time * 0.5) * 0.05 + 1;
      meshRef.current.scale.setScalar(breathe);
    }
    
    // Pulse when selected
    if (isSelected) {
      const pulse = Math.sin(time * 3) * 0.1 + 1;
      meshRef.current.scale.multiplyScalar(pulse);
      
      // Glow effect
      glowMaterial.opacity = (Math.sin(time * 2) + 1) * 0.15;
      glowRef.current.scale.setScalar(1.2 + Math.sin(time * 2) * 0.1);
    } else if (isHighlighted) {
      // Subtle highlight
      glowMaterial.opacity = 0.1;
      glowRef.current.scale.setScalar(1.1);
    } else {
      glowMaterial.opacity = 0;
    }
    
    // Law of Fragments overlay rotation
    if (lawOfFragmentsRef.current && showLawOfFragments) {
      lawOfFragmentsRef.current.rotation.z = time * 0.2;
    }
    
    // Orbital motion for non-anchor fragments
    if (!entry.isAnchor && entry.position.clusterId) {
      const orbitSpeed = 0.1;
      const orbitRadius = 0.2;
      meshRef.current.position.x = 
        entry.position.x + Math.cos(time * orbitSpeed) * orbitRadius;
      meshRef.current.position.y = 
        entry.position.y + Math.sin(time * orbitSpeed) * orbitRadius;
    }
  });

  // Handle interaction
  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick(entry);
  };

  const handlePointerEnter = () => {
    document.body.style.cursor = 'pointer';
    onHover(entry);
  };

  const handlePointerLeave = () => {
    document.body.style.cursor = 'default';
    onHover(null);
  };

  return (
    <group 
      position={[entry.position.x, entry.position.y, entry.position.z]}
    >
      {/* Main triangle node */}
      <mesh
        ref={meshRef}
        geometry={triangleGeometry}
        material={mainMaterial}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      
      {/* Glow effect */}
      <mesh
        ref={glowRef}
        geometry={triangleGeometry}
        material={glowMaterial}
        scale={1.2}
      />
      
      {/* Law of Fragments overlay */}
      {showLawOfFragments && fragmentsGeometry && fragmentsMaterial && (
        <mesh
          ref={lawOfFragmentsRef}
          geometry={fragmentsGeometry}
          material={fragmentsMaterial}
        />
      )}
      
      {/* Label (visible on close zoom) */}
      {zoomLevel === 'close' && (
        <Text
          position={[0, -nodeSize - 0.3, 0]}
          fontSize={0.2}
          color={nodeColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          textAlign="center"
        >
          {entry.title}
        </Text>
      )}
      
      {/* Anchor symbol for special nodes */}
      {entry.isAnchor && zoomLevel !== 'far' && (
        <Text
          position={[0, 0, 0.02]}
          fontSize={nodeSize * 0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {getAnchorSymbol(entry.theme)}
        </Text>
      )}
    </group>
  );
}

function getAnchorSymbol(theme: string): string {
  const symbols = {
    phoenix: '🔥',
    dragon: '🐉',
    butterfly: '🦋',
    pyramid: '△',
    'sacred shifter': '✨'
  };
  
  return symbols[theme as keyof typeof symbols] || '◇';
}