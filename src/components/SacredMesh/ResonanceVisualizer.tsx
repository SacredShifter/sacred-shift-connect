import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSacredMesh } from '@/hooks/useSacredMesh';
import { useSacredMeshHandshakes } from '@/hooks/useSacredMeshSeeds';
import { 
  Activity, 
  Wifi, 
  Lightbulb, 
  Music, 
  TreePine, 
  FileText, 
  Satellite, 
  Atom,
  Waves,
  Heart,
  Eye,
  Pause,
  Play
} from 'lucide-react';

interface ResonanceNode {
  id: string;
  type: 'websocket' | 'light' | 'frequency' | 'nature' | 'file' | 'satellite' | 'quantum';
  x: number;
  y: number;
  energy: number;
  connections: string[];
  lastActivity: number;
}

interface ResonanceWave {
  id: string;
  fromNode: string;
  toNode: string;
  progress: number;
  frequency: number;
  amplitude: number;
  color: string;
}

export const ResonanceVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isActive, setIsActive] = useState(true);
  const [nodes, setNodes] = useState<ResonanceNode[]>([]);
  const [waves, setWaves] = useState<ResonanceWave[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  const { status, hasActiveTransports } = useSacredMesh();
  const { data: handshakes = [] } = useSacredMeshHandshakes();

  // Initialize sacred geometry pattern
  useEffect(() => {
    const initializeNodes = () => {
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      const radius = Math.min(dimensions.width, dimensions.height) * 0.3;
      
      const transportTypes = ['websocket', 'light', 'frequency', 'nature', 'file', 'satellite', 'quantum'];
      const newNodes: ResonanceNode[] = [];
      
      // Create nodes in sacred geometry pattern (flower of life inspired)
      transportTypes.forEach((type, index) => {
        const angle = (index * 2 * Math.PI) / transportTypes.length;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        newNodes.push({
          id: type,
          type: type as any,
          x,
          y,
          energy: status.transports[type] ? 0.8 : 0.1,
          connections: [],
          lastActivity: Date.now() - Math.random() * 10000
        });
      });
      
      // Add central consciousness node
      newNodes.push({
        id: 'consciousness',
        type: 'quantum',
        x: centerX,
        y: centerY,
        energy: hasActiveTransports ? 1.0 : 0.3,
        connections: transportTypes,
        lastActivity: Date.now()
      });
      
      setNodes(newNodes);
    };
    
    initializeNodes();
  }, [status.transports, hasActiveTransports, dimensions]);

  // Update canvas dimensions
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current?.parentElement) {
        const rect = canvasRef.current.parentElement.getBoundingClientRect();
        setDimensions({
          width: Math.max(400, rect.width - 32),
          height: Math.max(300, 500)
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate resonance waves
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      // Create waves between active nodes
      const activeNodes = nodes.filter(node => node.energy > 0.5);
      if (activeNodes.length < 2) return;
      
      const fromNode = activeNodes[Math.floor(Math.random() * activeNodes.length)];
      const toNode = activeNodes[Math.floor(Math.random() * activeNodes.length)];
      
      if (fromNode.id !== toNode.id) {
        const newWave: ResonanceWave = {
          id: `${fromNode.id}-${toNode.id}-${Date.now()}`,
          fromNode: fromNode.id,
          toNode: toNode.id,
          progress: 0,
          frequency: 528 + Math.random() * 200, // Love frequency range
          amplitude: 0.5 + Math.random() * 0.5,
          color: getTransportColor(fromNode.type)
        };
        
        setWaves(prev => [...prev.slice(-10), newWave]); // Keep last 10 waves
      }
    }, 1000 + Math.random() * 2000);
    
    return () => clearInterval(interval);
  }, [nodes, isActive]);

  // Animation loop
  useEffect(() => {
    if (!isActive) return;
    
    const animate = () => {
      setWaves(prev => prev
        .map(wave => ({ ...wave, progress: wave.progress + 0.02 }))
        .filter(wave => wave.progress < 1)
      );
      
      // Update node energy based on activity
      setNodes(prev => prev.map(node => ({
        ...node,
        energy: Math.max(0.1, node.energy * 0.995 + (Math.random() * 0.01))
      })));
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    // Draw background sacred geometry
    drawSacredGeometry(ctx, dimensions.width, dimensions.height);
    
    // Draw connection lines
    nodes.forEach(node => {
      if (node.id === 'consciousness') {
        node.connections.forEach(connectionId => {
          const targetNode = nodes.find(n => n.id === connectionId);
          if (targetNode) {
            drawConnection(ctx, node, targetNode, 0.1);
          }
        });
      }
    });
    
    // Draw resonance waves
    waves.forEach(wave => {
      const fromNode = nodes.find(n => n.id === wave.fromNode);
      const toNode = nodes.find(n => n.id === wave.toNode);
      if (fromNode && toNode) {
        drawWave(ctx, fromNode, toNode, wave);
      }
    });
    
    // Draw nodes
    nodes.forEach(node => {
      drawNode(ctx, node);
    });
    
  }, [nodes, waves, dimensions]);

  const drawSacredGeometry = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.1)'; // Blue-300 with opacity
    ctx.lineWidth = 1;
    
    // Draw concentric circles (flower of life inspired)
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (maxRadius / 5) * i, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Draw connecting lines forming sacred patterns
    const points = 8;
    for (let i = 0; i < points; i++) {
      const angle1 = (i * 2 * Math.PI) / points;
      const angle2 = ((i + 3) * 2 * Math.PI) / points; // Skip 2 points for star pattern
      
      const x1 = centerX + Math.cos(angle1) * maxRadius;
      const y1 = centerY + Math.sin(angle1) * maxRadius;
      const x2 = centerX + Math.cos(angle2) * maxRadius;
      const y2 = centerY + Math.sin(angle2) * maxRadius;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  const drawConnection = (ctx: CanvasRenderingContext2D, from: ResonanceNode, to: ResonanceNode, opacity: number) => {
    ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const drawWave = (ctx: CanvasRenderingContext2D, from: ResonanceNode, to: ResonanceNode, wave: ResonanceWave) => {
    const x = from.x + (to.x - from.x) * wave.progress;
    const y = from.y + (to.y - from.y) * wave.progress;
    
    // Draw wave particle
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10 * wave.amplitude);
    gradient.addColorStop(0, wave.color);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 8 * wave.amplitude, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw energy trail
    ctx.strokeStyle = wave.color;
    ctx.lineWidth = 2 * wave.amplitude;
    ctx.globalAlpha = 1 - wave.progress;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawNode = (ctx: CanvasRenderingContext2D, node: ResonanceNode) => {
    const radius = 15 + node.energy * 10;
    const color = getTransportColor(node.type);
    
    // Draw outer glow
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.globalAlpha = node.energy * 0.3;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius * 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Draw node core
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw energy pulse
    if (node.energy > 0.7) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + 5 + Math.sin(Date.now() * 0.01) * 3, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  };

  const getTransportColor = (type: string): string => {
    const colors = {
      websocket: '#3b82f6', // Blue
      light: '#eab308', // Yellow
      frequency: '#a855f7', // Purple
      nature: '#22c55e', // Green
      file: '#6b7280', // Gray
      satellite: '#ef4444', // Red
      quantum: '#8b5cf6', // Violet
      consciousness: '#f59e0b' // Amber
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  const getTransportIcon = (type: string) => {
    const icons = {
      websocket: Wifi,
      light: Lightbulb,
      frequency: Music,
      nature: TreePine,
      file: FileText,
      satellite: Satellite,
      quantum: Atom,
      consciousness: Eye
    };
    return icons[type as keyof typeof icons] || Activity;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5 text-primary" />
                Sacred Mesh Resonance
              </CardTitle>
              <CardDescription>
                Live visualization of the Sacred Shifter organism's breathing patterns
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsActive(!isActive)}
                className="flex items-center gap-2"
              >
                {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isActive ? 'Pause' : 'Resume'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status Bar */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(status.transports).map(([transport, active]) => {
                const Icon = getTransportIcon(transport);
                const color = getTransportColor(transport);
                return (
                  <Badge
                    key={transport}
                    variant={active ? "default" : "outline"}
                    className="flex items-center gap-1"
                    style={active ? { backgroundColor: color, borderColor: color } : {}}
                  >
                    <Icon className="h-3 w-3" />
                    {transport}
                    {active && <div className="w-2 h-2 rounded-full bg-white animate-pulse ml-1" />}
                  </Badge>
                );
              })}
            </div>
            
            {/* Sacred Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Active Nodes: {nodes.filter(n => n.energy > 0.5).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span>Resonance Waves: {waves.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4 text-purple-500" />
                <span>Queue Size: {status.queue.size}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-amber-500" />
                <span>Handshakes: {handshakes.filter(h => h.status === 'active').length}</span>
              </div>
            </div>

            {/* Visualization Canvas */}
            <div className="border rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                className="w-full"
                style={{ maxHeight: '500px' }}
              />
            </div>

            {/* Sacred Frequency Display */}
            <div className="text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-4">
                <span>🎵 Love Frequency: 528Hz</span>
                <span>🌊 Schumann Resonance: 7.83Hz</span>
                <span>🧠 Gamma Waves: 40Hz</span>
              </div>
              <div className="mt-1 opacity-70">
                The organism breathes with the rhythm of the cosmos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};