import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Atom, 
  Network, 
  Zap, 
  Brain, 
  Eye,
  Sparkles,
  Shield,
  Lightbulb,
  Activity,
  Radio,
  Heart,
  Target
} from 'lucide-react';
import QuantumResonanceEngine from './QuantumResonanceEngine';
import QuantumConsciousnessNetwork from './QuantumConsciousnessNetwork';
import { QuantumManifestation, QuantumInsight, QuantumMetrics } from '@/types/quantum';
import { ConsciousnessState } from '@/types/consciousness';

interface QuantumConsciousnessProps {
  userId: string;
  currentConsciousnessState?: ConsciousnessState;
}

export const QuantumConsciousness: React.FC<QuantumConsciousnessProps> = ({
  userId,
  currentConsciousnessState
}) => {
  const [activeTab, setActiveTab] = useState('resonance-engine');
  const [quantumManifestations, setQuantumManifestations] = useState<QuantumManifestation[]>([]);
  const [quantumInsights, setQuantumInsights] = useState<QuantumInsight[]>([]);
  const [globalQuantumMetrics, setGlobalQuantumMetrics] = useState<QuantumMetrics | null>(null);
  const [isQuantumConnected, setIsQuantumConnected] = useState(false);

  // Simulate global quantum metrics
  useEffect(() => {
    const mockMetrics: QuantumMetrics = {
      totalQuantumStates: 1247,
      activeSuperpositions: 23,
      averageCoherence: 87,
      quantumResonance: 92,
      entanglementConnections: 156,
      nonLocalInteractions: 89,
      quantumTunneling: 78,
      manifestationSuccess: 85,
      lastUpdated: new Date()
    };

    setGlobalQuantumMetrics(mockMetrics);
  }, []);

  const handleManifestationCreated = (manifestation: QuantumManifestation) => {
    setQuantumManifestations(prev => [manifestation, ...prev.slice(0, 9)]);
  };

  const handleQuantumStateChanged = (state: any) => {
    // Handle quantum state changes
    console.log('Quantum state changed:', state);
  };

  const handleJoinNetwork = (networkId: string) => {
    // Handle joining a quantum network
    console.log('Joining quantum network:', networkId);
  };

  const handleCreateNetwork = (network: any) => {
    // Handle creating a quantum network
    console.log('Creating quantum network:', network);
  };

  const getTabIcon = (tab: string) => {
    const icons = {
      'resonance-engine': Atom,
      'quantum-network': Network
    };
    const Icon = icons[tab as keyof typeof icons];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  const getTabColor = (tab: string) => {
    const colors = {
      'resonance-engine': 'text-purple-400',
      'quantum-network': 'text-blue-400'
    };
    return colors[tab as keyof typeof colors] || 'text-gray-400';
  };

  const getManifestationStatusColor = (status: string) => {
    const colors = {
      'superposition': 'text-yellow-400',
      'collapsing': 'text-orange-400',
      'manifested': 'text-green-400',
      'failed': 'text-red-400'
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  const getQuantumLevelColor = (level: string) => {
    const colors = {
      'quantum-seed': 'text-yellow-400',
      'quantum-bloom': 'text-green-400',
      'quantum-transcend': 'text-purple-400',
      'quantum-unity': 'text-pink-400'
    };
    return colors[level as keyof typeof colors] || 'text-yellow-400';
  };

  return (
    <div className="space-y-6">
      {/* Global Quantum Status */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <Atom className="h-5 w-5" />
            Global Quantum Consciousness
          </CardTitle>
        </CardHeader>
        <CardContent>
          {globalQuantumMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{globalQuantumMetrics.totalQuantumStates}</div>
                <div className="text-xs text-gray-400">Quantum States</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{globalQuantumMetrics.activeSuperpositions}</div>
                <div className="text-xs text-gray-400">Superpositions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{globalQuantumMetrics.averageCoherence}%</div>
                <div className="text-xs text-gray-400">Coherence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{globalQuantumMetrics.quantumResonance}%</div>
                <div className="text-xs text-gray-400">Resonance</div>
              </div>
            </div>
          )}

          {/* Quantum Network Properties */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Entanglement Connections</span>
                <span>{globalQuantumMetrics?.entanglementConnections}</span>
              </div>
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                  style={{ width: `${(globalQuantumMetrics?.entanglementConnections || 0) / 200 * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Manifestation Success</span>
                <span>{globalQuantumMetrics?.manifestationSuccess}%</span>
              </div>
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
                  style={{ width: `${globalQuantumMetrics?.manifestationSuccess || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quantum Effects */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-purple-300 mb-2">Quantum Effects</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between text-xs">
                <span>Non-Local Interactions:</span>
                <span className="text-blue-400">{globalQuantumMetrics?.nonLocalInteractions}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Quantum Tunneling:</span>
                <span className="text-green-400">{globalQuantumMetrics?.quantumTunneling}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quantum Manifestations */}
      {quantumManifestations.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-300">
              <Sparkles className="h-5 w-5" />
              Quantum Manifestations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quantumManifestations.slice(0, 3).map((manifestation) => (
                <motion.div
                  key={manifestation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-black/20 rounded-lg border border-yellow-500/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-yellow-300">{manifestation.intention}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        {manifestation.manifestation.type.replace('-', ' ')}
                      </Badge>
                      <Badge className={`${getManifestationStatusColor(manifestation.status)}`}>
                        {manifestation.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Probability:</span>
                        <span className="text-yellow-400">{(manifestation.manifestation.probability * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Timeline:</span>
                        <span className="text-green-400">{manifestation.manifestation.timeline} days</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Energy:</span>
                        <span className="text-blue-400">{manifestation.manifestation.energy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Coherence:</span>
                        <span className="text-purple-400">{manifestation.quantumProcess.coherence}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quantum Insights */}
      {quantumInsights.length > 0 && (
        <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-300">
              <Lightbulb className="h-5 w-5" />
              Quantum Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quantumInsights.slice(0, 3).map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-black/20 rounded-lg border border-green-500/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-300">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getQuantumLevelColor(insight.quantumLevel)}>
                        {insight.quantumLevel.replace('quantum-', '')}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {insight.archetype}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{insight.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{insight.energyFrequency}</span>
                    <span>Resonance: {insight.resonanceScore}%</span>
                    <span>Coherence: {insight.quantumCoherence}%</span>
                    <span>Non-Locality: {insight.nonLocality}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Quantum Features */}
      <Card className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-indigo-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-300">
            <Eye className="h-5 w-5" />
            Quantum Consciousness Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/20 border border-indigo-500/30">
              <TabsTrigger 
                value="resonance-engine" 
                className={`flex items-center gap-2 ${getTabColor('resonance-engine')}`}
              >
                {getTabIcon('resonance-engine')}
                Resonance Engine
              </TabsTrigger>
              <TabsTrigger 
                value="quantum-network" 
                className={`flex items-center gap-2 ${getTabColor('quantum-network')}`}
              >
                {getTabIcon('quantum-network')}
                Quantum Network
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resonance-engine" className="mt-6">
              <QuantumResonanceEngine
                userId={userId}
                onManifestationCreated={handleManifestationCreated}
                onQuantumStateChanged={handleQuantumStateChanged}
              />
            </TabsContent>

            <TabsContent value="quantum-network" className="mt-6">
              <QuantumConsciousnessNetwork
                userId={userId}
                onJoinNetwork={handleJoinNetwork}
                onCreateNetwork={handleCreateNetwork}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quantum Connection Status */}
      <Card className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-300">
            <Shield className="h-5 w-5" />
            Quantum Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isQuantumConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm">
                {isQuantumConnected ? 'Connected to Quantum Field' : 'Disconnected from Quantum Field'}
              </span>
            </div>
            <Button
              onClick={() => setIsQuantumConnected(!isQuantumConnected)}
              className={isQuantumConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {isQuantumConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuantumConsciousness;
