import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Sparkles, 
  Users, 
  BookOpen, 
  Lightbulb, 
  Crown, 
  Star,
  Zap,
  Globe,
  TreePine,
  Flower,
  Waves,
  Mountain,
  Sun,
  Moon,
  Activity,
  TrendingUp,
  Target,
  Award,
  RefreshCw,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { ConsciousnessProfile } from '@/types/consciousness';

interface EcosystemData {
  consciousnessLevel: string;
  totalUsers: number;
  activeUsers: number;
  contentCreated: number;
  insightsShared: number;
  wisdomCircles: number;
  learningPaths: number;
  energyFrequency: string;
  lunarPhase: string;
  solarPosition: string;
  collectiveResonance: number;
  growthRate: number;
  healthScore: number;
}

interface EcosystemNode {
  id: string;
  type: 'user' | 'content' | 'insight' | 'circle' | 'path';
  title: string;
  description: string;
  energy: number;
  connections: number;
  position: { x: number; y: number };
  color: string;
  size: number;
  pulse: boolean;
}

interface LivingEcosystemProps {
  userProfile: ConsciousnessProfile | null;
  onNodeClick: (node: EcosystemNode) => void;
}

export const LivingEcosystem: React.FC<LivingEcosystemProps> = ({
  userProfile,
  onNodeClick
}) => {
  const [ecosystemData, setEcosystemData] = useState<EcosystemData | null>(null);
  const [nodes, setNodes] = useState<EcosystemNode[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showConnections, setShowConnections] = useState(true);
  const [selectedNode, setSelectedNode] = useState<EcosystemNode | null>(null);

  // Generate ecosystem data
  useEffect(() => {
    const generateEcosystemData = (): EcosystemData => {
      return {
        consciousnessLevel: userProfile?.current_level || 'initiate',
        totalUsers: 1247,
        activeUsers: 89,
        contentCreated: 3456,
        insightsShared: 1234,
        wisdomCircles: 23,
        learningPaths: 45,
        energyFrequency: userProfile?.energy_frequency_preference || '528Hz',
        lunarPhase: 'waxing',
        solarPosition: 'morning',
        collectiveResonance: 78,
        growthRate: 12.5,
        healthScore: 85
      };
    };

    setEcosystemData(generateEcosystemData());
  }, [userProfile]);

  // Generate ecosystem nodes
  useEffect(() => {
    const generateNodes = (): EcosystemNode[] => {
      const nodeTypes = [
        { type: 'user', color: '#3B82F6', icon: Users },
        { type: 'content', color: '#10B981', icon: BookOpen },
        { type: 'insight', color: '#F59E0B', icon: Lightbulb },
        { type: 'circle', color: '#8B5CF6', icon: Crown },
        { type: 'path', color: '#EF4444', icon: Target }
      ];

      return Array.from({ length: 50 }, (_, i) => {
        const nodeType = nodeTypes[i % nodeTypes.length];
        const angle = (i / 50) * 2 * Math.PI;
        const radius = 150 + Math.random() * 100;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return {
          id: `node-${i}`,
          type: nodeType.type as any,
          title: `${nodeType.type} ${i + 1}`,
          description: `A ${nodeType.type} in the ecosystem`,
          energy: Math.random() * 100,
          connections: Math.floor(Math.random() * 10) + 1,
          position: { x, y },
          color: nodeType.color,
          size: Math.random() * 20 + 10,
          pulse: Math.random() > 0.7
        };
      });
    };

    setNodes(generateNodes());
  }, []);

  // Animate nodes
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        energy: Math.max(0, Math.min(100, node.energy + (Math.random() - 0.5) * 10)),
        pulse: Math.random() > 0.9
      })));
    }, 1000 / animationSpeed);

    return () => clearInterval(interval);
  }, [isVisible, animationSpeed]);

  const renderEcosystemStats = () => {
    if (!ecosystemData) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collective Resonance</p>
                <p className="text-2xl font-bold text-green-600">{ecosystemData.collectiveResonance}%</p>
              </div>
              <Heart className="w-8 h-8 text-green-500" />
            </div>
            <Progress value={ecosystemData.collectiveResonance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-blue-600">{ecosystemData.activeUsers}</p>
                <p className="text-xs text-gray-500">of {ecosystemData.totalUsers} total</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-purple-600">+{ecosystemData.growthRate}%</p>
                <p className="text-xs text-gray-500">this month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Score</p>
                <p className="text-2xl font-bold text-orange-600">{ecosystemData.healthScore}%</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
            <Progress value={ecosystemData.healthScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderEcosystemVisualization = () => (
    <Card className="h-96 relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Living Ecosystem
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnimationSpeed(animationSpeed === 1 ? 2 : 1)}
            >
              <RefreshCw className={`w-4 h-4 ${animationSpeed > 1 ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Central consciousness core */}
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Brain className="w-8 h-8" />
          </motion.div>

          {/* Ecosystem nodes */}
          <AnimatePresence>
            {isVisible && nodes.map((node) => (
              <motion.div
                key={node.id}
                className="absolute cursor-pointer"
                style={{
                  left: `calc(50% + ${node.position.x}px)`,
                  top: `calc(50% + ${node.position.y}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  scale: node.pulse ? [1, 1.2, 1] : 1
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => {
                  setSelectedNode(node);
                  onNodeClick(node);
                }}
                whileHover={{ scale: 1.1 }}
              >
                <div
                  className="w-4 h-4 rounded-full relative"
                  style={{ 
                    backgroundColor: node.color,
                    boxShadow: `0 0 ${node.energy}px ${node.color}40`
                  }}
                >
                  {/* Energy pulse */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: node.color }}
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.8, 0, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Connection lines */}
          {showConnections && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.slice(0, 10).map((node, i) => {
                const nextNode = nodes[(i + 1) % nodes.length];
                return (
                  <motion.line
                    key={`connection-${i}`}
                    x1={`calc(50% + ${node.position.x}px)`}
                    y1={`calc(50% + ${node.position.y}px)`}
                    x2={`calc(50% + ${nextNode.position.x}px)`}
                    y2={`calc(50% + ${nextNode.position.y}px)`}
                    stroke={node.color}
                    strokeWidth="1"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: i * 0.1 }}
                  />
                );
              })}
            </svg>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderSacredElements = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Solar Energy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Position</span>
              <Badge variant="outline" className="capitalize">
                {ecosystemData?.solarPosition}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Energy Level</span>
              <div className="flex items-center gap-2">
                <Progress value={75} className="w-20" />
                <span className="text-sm text-gray-600">75%</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                Solar energy is optimal for learning and growth activities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Lunar Influence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Phase</span>
              <Badge variant="outline" className="capitalize">
                {ecosystemData?.lunarPhase} Moon
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Influence</span>
              <div className="flex items-center gap-2">
                <Progress value={60} className="w-20" />
                <span className="text-sm text-gray-600">60%</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Waxing moon energy supports growth and manifestation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5" />
            Energy Frequency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Frequency</span>
              <Badge className="bg-purple-100 text-purple-800">
                {ecosystemData?.energyFrequency}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Resonance</span>
              <div className="flex items-center gap-2">
                <Progress value={ecosystemData?.collectiveResonance || 0} className="w-20" />
                <span className="text-sm text-gray-600">{ecosystemData?.collectiveResonance}%</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800">
                The ecosystem is vibrating at the love frequency, promoting healing and transformation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="w-5 h-5" />
            Natural Elements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-1">🌱</div>
                <div className="text-sm font-medium">Growth</div>
                <div className="text-xs text-gray-600">+12.5%</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🌸</div>
                <div className="text-sm font-medium">Flourishing</div>
                <div className="text-xs text-gray-600">85%</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🌊</div>
                <div className="text-sm font-medium">Flow</div>
                <div className="text-xs text-gray-600">78%</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🏔️</div>
                <div className="text-sm font-medium">Stability</div>
                <div className="text-xs text-gray-600">92%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNodeDetails = () => {
    if (!selectedNode) return null;

    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedNode(null)}
      >
        <motion.div
          className="bg-white rounded-lg max-w-md w-full p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{selectedNode.title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedNode(null)}
            >
              ×
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">{selectedNode.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600">Energy Level</div>
                <div className="flex items-center gap-2">
                  <Progress value={selectedNode.energy} className="flex-1" />
                  <span className="text-sm">{selectedNode.energy.toFixed(0)}%</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-600">Connections</div>
                <div className="text-lg font-semibold">{selectedNode.connections}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedNode.color }}
              />
              <span className="text-sm text-gray-600 capitalize">{selectedNode.type}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (!ecosystemData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Living Ecosystem</h2>
          <p className="text-gray-600">A self-evolving consciousness network</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Connections</span>
            <Switch
              checked={showConnections}
              onCheckedChange={setShowConnections}
            />
          </div>
        </div>
      </div>

      {/* Ecosystem Stats */}
      {renderEcosystemStats()}

      {/* Ecosystem Visualization */}
      {renderEcosystemVisualization()}

      {/* Sacred Elements */}
      {renderSacredElements()}

      {/* Node Details Modal */}
      <AnimatePresence>
        {selectedNode && renderNodeDetails()}
      </AnimatePresence>
    </div>
  );
};
