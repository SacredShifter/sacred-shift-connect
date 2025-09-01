import React, { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Sphere, shaderMaterial, Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// --- Aurora Shader ---
const AuroraMaterial = shaderMaterial(
  {
    aIntensity: 0.5,
    time: 0,
    color: new THREE.Color(0.2, 0.8, 0.5),
  },
  // vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float aIntensity;
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;

    // 2D Noise function
    float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      float strength = smoothstep(0.3, 0.7, vUv.y) - smoothstep(0.7, 1.0, vUv.y);
      float noiseVal = noise(vUv * 10.0 + time * 0.1) * 0.1;
      strength *= 1.0 - noise(vUv * 50.0 + time * 0.2) * 0.2;

      gl_FragColor = vec4(color, strength * aIntensity * 0.5);
    }
  `
);
extend({ AuroraMaterial });


// Define the types for the props
export interface Node {
  id: string;
  lat: number;
  lon: number;
  // Visual properties
  glowSize: number; // Represents oscillator count
  color: string; // Represents polarity
  pulseSpeed: number; // Represents coherence
}

export interface MeshLink {
  from: string; // Node ID
  to: string; // Node ID
}

interface EarthResonanceMapProps {
  nodes: Node[];
  links: MeshLink[];
  planetaryGlow: number; // Synced to breath, 0-1
  auroraIntensity: number; // For regional resonance, 0-1
}

// Simple function to convert lat/lon to a 3D position on a sphere
const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// --- Visualization Components ---

// Component for a single glowing node on the map
const NodePoint: React.FC<{ node: Node }> = ({ node }) => {
  const position = useMemo(() => latLonToVector3(node.lat, node.lon, 2.05), [node.lat, node.lon]);
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const pulse = (Math.sin(time * node.pulseSpeed) + 1) / 2; // 0-1 range
    ref.current.scale.setScalar(1 + pulse * 0.5 * node.glowSize);
  });

  return (
    <mesh position={position} ref={ref}>
      <sphereGeometry args={[0.02 * node.glowSize, 16, 16]} />
      <meshBasicMaterial color={node.color} transparent opacity={0.8} />
    </mesh>
  );
};

// Component for the light threads between nodes
const LinkLine: React.FC<{ startNode: Node; endNode: Node }> = ({ startNode, endNode }) => {
    const startPos = useMemo(() => latLonToVector3(startNode.lat, startNode.lon, 2.02), [startNode.lat, startNode.lon]);
    const endPos = useMemo(() => latLonToVector3(endNode.lat, endNode.lon, 2.02), [endNode.lat, endNode.lon]);

    const points = useMemo(() => {
        const v1 = startPos.clone();
        const v2 = endPos.clone();
        const arcHeight = v1.distanceTo(v2) * 0.3;
        const midPoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
        const midPointNorm = midPoint.clone().normalize().multiplyScalar(arcHeight);
        const controlPoint = midPoint.add(midPointNorm);
        const curve = new THREE.QuadraticBezierCurve3(v1, controlPoint, v2);
        return curve.getPoints(20);
    }, [startPos, endPos]);

    return (
        <Line points={points} color="#ffffff" transparent opacity={0.5} lineWidth={1} />
    );
};

const Aurora: React.FC<{ aIntensity: number }> = ({ aIntensity }) => {
    const ref = useRef<any>();
    useFrame(({ clock }) => (ref.current.time = clock.getElapsedTime()));
    return (
        <mesh rotation-x={-Math.PI / 2} position-y={1.5}>
            <ringGeometry args={[1.5, 2.2, 64, 8, 0, Math.PI * 2]} />
            {/* @ts-ignore */}
            <auroraMaterial ref={ref} aIntensity={aIntensity} transparent />
        </mesh>
    );
};


// --- Main Component ---

export const EarthResonanceMap: React.FC<EarthResonanceMapProps> = ({
  nodes,
  links,
  planetaryGlow,
  auroraIntensity,
}) => {
  const earthRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    // Subtle rotation of the Earth
    earthRef.current.rotation.y += 0.0005;
  });

  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);

  return (
    <group>
      {/* Earth model with texture */}
      <Sphere ref={earthRef} args={[2, 32, 32]}>
        <meshStandardMaterial map={useTexture('https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg')} />
      </Sphere>

      {/* Planetary Glow */}
      <Sphere args={[2.1 + planetaryGlow * 0.2, 32, 32]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1 * planetaryGlow} />
      </Sphere>

      {/* Render Nodes */}
      {nodes.map(node => (
        <NodePoint key={node.id} node={node} />
      ))}

      {/* Render Links */}
      {links.map((link, i) => {
        const startNode = nodeMap.get(link.from);
        const endNode = nodeMap.get(link.to);
        if(!startNode || !endNode) return null;
        return <LinkLine key={`${link.from}-${link.to}-${i}`} startNode={startNode} endNode={endNode} />
      })}

      {/* Aurora Effect */}
      <Aurora aIntensity={auroraIntensity} />
    </group>
  );
};
