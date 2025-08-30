import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3, Color } from 'three';
import * as THREE from 'three';
import { NormalizedGeometry } from '@/utils/gaa/GeometricNormalizer';

interface GAAGeometryVisualizerProps {
  geometry: NormalizedGeometry[];
  breathPhase: number;
  isPlaying: boolean;
}

const GeometryPoints = ({ 
  geometry, 
  breathPhase, 
  isPlaying 
}: GAAGeometryVisualizerProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate positions and colors from geometry
  const { positions, colors, connections } = useMemo(() => {
    if (!geometry || geometry.length === 0) {
      return { positions: new Float32Array([]), colors: new Float32Array([]), connections: new Float32Array([]) };
    }

    const positions = new Float32Array(geometry.length * 3);
    const colors = new Float32Array(geometry.length * 3);
    const connections = new Float32Array((geometry.length - 1) * 6); // Lines between consecutive points

    geometry.forEach((geo, i) => {
      // Position based on normalized geometry
      const radius = 2 + geo.scale * 3;
      const theta = geo.angles.theta * Math.PI * 2;
      const phi = geo.angles.phi * Math.PI;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color based on curvature and torsion
      const hue = (geo.curvature + geo.torsion) * 180;
      const saturation = 0.8;
      const lightness = 0.4 + geo.scale * 0.4;
      
      const color = new Color().setHSL(hue / 360, saturation, lightness);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Create connections between consecutive points
      if (i < geometry.length - 1) {
        const nextIdx = i + 1;
        
        connections[i * 6] = positions[i * 3];
        connections[i * 6 + 1] = positions[i * 3 + 1];
        connections[i * 6 + 2] = positions[i * 3 + 2];
        
        connections[i * 6 + 3] = positions[nextIdx * 3];
        connections[i * 6 + 4] = positions[nextIdx * 3 + 1];
        connections[i * 6 + 5] = positions[nextIdx * 3 + 2];
      }
    });

    return { positions, colors, connections };
  }, [geometry]);

  useFrame((state) => {
    if (!isPlaying) return;

    if (pointsRef.current) {
      // Breathe effect - scale based on breath phase
      const scale = 1 + Math.sin(breathPhase) * 0.1;
      pointsRef.current.scale.setScalar(scale);
      
      // Slow rotation
      pointsRef.current.rotation.y += 0.005;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }

    if (linesRef.current) {
      // Sync with points
      const scale = 1 + Math.sin(breathPhase) * 0.1;
      linesRef.current.scale.setScalar(scale);
      linesRef.current.rotation.y += 0.005;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  if (positions.length === 0) {
    return null;
  }

  return (
    <>
      {/* Geometry Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            itemSize={3}
            count={positions.length / 3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={colors}
            itemSize={3}
            count={colors.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.8}
        />
      </points>

      {/* Connecting Lines */}
      {connections.length > 0 && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={connections}
              itemSize={3}
              count={connections.length / 3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.3}
          />
        </lineSegments>
      )}

      {/* Central Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
    </>
  );
};

export const GAAGeometryVisualizer: React.FC<GAAGeometryVisualizerProps> = ({
  geometry,
  breathPhase,
  isPlaying
}) => {
  return (
    <div className="w-full h-full bg-black/50 rounded-lg">
      <Canvas
        camera={{ position: [8, 8, 8], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        <GeometryPoints
          geometry={geometry}
          breathPhase={breathPhase}
          isPlaying={isPlaying}
        />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
};