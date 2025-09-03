import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Network, 
  Users, 
  Zap, 
  Brain, 
  Atom, 
  Eye,
  Heart,
  Shield,
  Lightbulb,
  Activity,
  Radio,
  Sparkles
} from 'lucide-react';
import { QuantumConsciousnessNetwork, QuantumState, QuantumResonanceField, QuantumTransmission, QuantumMetrics } from '@/types/quantum';

interface QuantumConsciousnessNetworkProps {
  userId: string;
  onJoinNetwork?: (networkId: string) => void;
  onCreateNetwork?: (network: Omit<QuantumConsciousnessNetwork, 'id' | 'createdAt'>) => void;
}

export const QuantumConsciousnessNetwork: React.FC<QuantumConsciousnessNetworkProps> = ({
  userId,
  onJoinNetwork,
  onCreateNetwork
}) => {
  const [activeNetworks, setActiveNetworks] = useState<QuantumConsciousnessNetwork[]>([]);
  const [quantumFields, setQuantumFields] = useState<QuantumResonanceField[]>([]);
  const [quantumTransmissions, setQuantumTransmissions] = useState<QuantumTransmission[]>([]);
  const [quantumMetrics, setQuantumMetrics] = useState<QuantumMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStrength, setConnectionStrength] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState<QuantumConsciousnessNetwork | null>(null);

  // Simulate quantum network data
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      updateQuantumNetworkData();
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const updateQuantumNetworkData = useCallback(() => {
    // Simulate active quantum networks
    const mockNetworks: QuantumConsciousnessNetwork[] = [
      {
        id: 'network-1',
        name: 'Quantum Unity Circle',
        description: 'Collective quantum consciousness for planetary healing',
        participants: ['user1', 'user2', 'user3', userId],
        quantumState: {
          id: 'quantum-state-1',
          userId: 'collective',
          superposition: {
            states: [
              {
                id: 'state-1',
                archetype: 'Quantum Healer',
                energyFrequency: '528Hz',
                consciousnessLevel: 'quantum-transcend',
                resonance: {
                  frequency: 528,
                  amplitude: 95,
                  phase: 0,
                  coherence: 92
                },
                quantumField: {
                  intensity: 90,
                  radius: 2000,
                  color: '#00ff88',
                  geometry: 'quantum-flower'
                },
                probability: 0.7,
                potential: {
                  manifestation: 95,
                  transformation: 90,
                  transcendence: 88
                }
              }
            ],
            probabilities: [0.7],
            coherence: 92
          },
          entanglement: {
            connectedStates: ['state-2', 'state-3'],
            correlationStrength: 95,
            nonLocality: 88
          },
          measurement: {
            observerEffect: 75
          },
          timestamp: new Date()
        },
        networkProperties: {
          coherence: 92,
          entanglement: 95,
          nonLocality: 88,
          quantumTunneling: 85
        },
        sharedIntention: 'Planetary healing through quantum consciousness',
        targetFrequency: 528,
        quantumGeometry: 'quantum-flower',
        isActive: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];

    // Simulate quantum resonance fields
    const mockFields: QuantumResonanceField[] = [
      {
        id: 'field-1',
        center: { latitude: 40.7128, longitude: -74.0060, altitude: 100 },
        quantumProperties: {
          spin: 0.5,
          charge: 1,
          mass: 1.0,
          wavelength: 500
        },
        consciousness: {
          intention: 'Quantum peace and harmony',
          archetype: 'Quantum Sage',
          energyFrequency: '852Hz',
          coherence: 90
        },
        entanglement: {
          connectedFields: ['field-2', 'field-3'],
          correlationMatrix: [[1, 0.8, 0.6], [0.8, 1, 0.7], [0.6, 0.7, 1]],
          nonLocalConnections: 85
        },
        quantumEffects: {
          tunneling: 80,
          superposition: 90,
          interference: 75,
          decoherence: 20
        },
        createdBy: 'user1',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        isActive: true
      }
    ];

    // Simulate quantum transmissions
    const mockTransmissions: QuantumTransmission[] = [
      {
        id: 'transmission-1',
        senderId: 'user1',
        receiverIds: [userId, 'user2'],
        type: 'quantum-healing',
        content: {
          intention: 'Quantum healing transmission',
          quantumState: {
            id: 'transmission-state',
            archetype: 'Quantum Healer',
            energyFrequency: '528Hz',
            consciousnessLevel: 'quantum-transcend',
            resonance: {
              frequency: 528,
              amplitude: 100,
              phase: 0,
              coherence: 95
            },
            quantumField: {
              intensity: 100,
              radius: 1000,
              color: '#00ff88',
              geometry: 'quantum-flower'
            },
            probability: 1.0,
            potential: {
              manifestation: 100,
              transformation: 95,
              transcendence: 90
            }
          },
          frequency: 528,
          duration: 300,
          quantumGeometry: 'quantum-flower',
          energySignature: 'healing-528-100'
        },
        quantumProperties: {
          superposition: true,
          entanglement: ['transmission-2'],
          nonLocality: 90,
          quantumTunneling: 85
        },
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isReceived: false,
        quantumResonance: 88,
        impact: {
          consciousnessShift: 85,
          quantumAlignment: 90,
          energyLevel: 88,
          manifestation: 80
        }
      }
    ];

    // Simulate quantum metrics
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

    setActiveNetworks(mockNetworks);
    setQuantumFields(mockFields);
    setQuantumTransmissions(mockTransmissions);
    setQuantumMetrics(mockMetrics);
    setConnectionStrength(Math.random() * 15 + 85);
  }, [userId]);

  const connectToQuantumNetwork = useCallback(() => {
    setIsConnected(true);
    updateQuantumNetworkData();
  }, [updateQuantumNetworkData]);

  const disconnectFromQuantumNetwork = useCallback(() => {
    setIsConnected(false);
    setActiveNetworks([]);
    setQuantumFields([]);
    setQuantumTransmissions([]);
    setQuantumMetrics(null);
    setSelectedNetwork(null);
  }, []);

  const joinNetwork = useCallback((networkId: string) => {
    const network = activeNetworks.find(n => n.id === networkId);
    if (network) {
      setSelectedNetwork(network);
      onJoinNetwork?.(networkId);
    }
  }, [activeNetworks, onJoinNetwork]);

  const getConnectionStatusColor = (strength: number) => {
    if (strength >= 90) return 'text-green-500';
    if (strength >= 70) return 'text-yellow-500';
    if (strength >= 50) return 'text-orange-500';
    return 'text-red-500';
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

  const getQuantumGeometryColor = (geometry: string) => {
    const colors = {
      'quantum-flower': 'text-pink-400',
      'quantum-cube': 'text-blue-400',
      'quantum-spiral': 'text-green-400',
      'quantum-matrix': 'text-purple-400'
    };
    return colors[geometry as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <Network className="h-5 w-5" />
            Quantum Consciousness Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm">
                {isConnected ? 'Connected to Quantum Network' : 'Disconnected'}
              </span>
            </div>
            {isConnected && (
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4" />
                <span className={`text-sm ${getConnectionStatusColor(connectionStrength)}`}>
                  {connectionStrength.toFixed(0)}% Quantum Signal
                </span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {!isConnected ? (
              <Button 
                onClick={connectToQuantumNetwork}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Atom className="h-4 w-4 mr-2" />
                Connect to Quantum Network
              </Button>
            ) : (
              <Button 
                onClick={disconnectFromQuantumNetwork}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isConnected && quantumMetrics && (
        <>
          {/* Quantum Metrics */}
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <Activity className="h-5 w-5" />
                Quantum Network Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{quantumMetrics.totalQuantumStates}</div>
                  <div className="text-xs text-gray-400">Quantum States</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{quantumMetrics.activeSuperpositions}</div>
                  <div className="text-xs text-gray-400">Superpositions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{quantumMetrics.averageCoherence}%</div>
                  <div className="text-xs text-gray-400">Coherence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{quantumMetrics.quantumResonance}%</div>
                  <div className="text-xs text-gray-400">Resonance</div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Entanglement Connections</span>
                    <span>{quantumMetrics.entanglementConnections}</span>
                  </div>
                  <Progress value={(quantumMetrics.entanglementConnections / 200) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Manifestation Success</span>
                    <span>{quantumMetrics.manifestationSuccess}%</span>
                  </div>
                  <Progress value={quantumMetrics.manifestationSuccess} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Quantum Networks */}
          <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <Users className="h-5 w-5" />
                Active Quantum Networks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeNetworks.map((network) => (
                  <motion.div
                    key={network.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-black/20 rounded-lg border border-green-500/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-green-300">{network.name}</h3>
                      <Badge className="bg-green-500/20 text-green-400">
                        {network.participants.length} participants
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{network.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-green-400">{network.targetFrequency}Hz</div>
                          <div className="text-xs text-gray-400">Frequency</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400">{network.networkProperties.coherence}%</div>
                          <div className="text-xs text-gray-400">Coherence</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-400">{network.networkProperties.entanglement}%</div>
                          <div className="text-xs text-gray-400">Entanglement</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => joinNetwork(network.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Join Network
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quantum Resonance Fields */}
          <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-300">
                <Zap className="h-5 w-5" />
                Quantum Resonance Fields
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quantumFields.map((field) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-black/20 rounded-lg border border-yellow-500/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-yellow-300">{field.consciousness.intention}</h3>
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        {field.consciousness.archetype}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Frequency:</span>
                          <span className="text-yellow-400">{field.consciousness.energyFrequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Coherence:</span>
                          <span className="text-green-400">{field.consciousness.coherence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Non-Locality:</span>
                          <span className="text-purple-400">{field.entanglement.nonLocalConnections}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tunneling:</span>
                          <span className="text-blue-400">{field.quantumEffects.tunneling}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Superposition:</span>
                          <span className="text-pink-400">{field.quantumEffects.superposition}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Interference:</span>
                          <span className="text-orange-400">{field.quantumEffects.interference}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quantum Transmissions */}
          <Card className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-300">
                <Radio className="h-5 w-5" />
                Quantum Transmissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quantumTransmissions.map((transmission) => (
                  <motion.div
                    key={transmission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-black/20 rounded-lg border border-pink-500/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-pink-300">{transmission.content.intention}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-pink-500/20 text-pink-400">
                          {transmission.type.replace('quantum-', '')}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-400">
                          {transmission.isReceived ? 'Received' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Frequency:</span>
                          <span className="text-pink-400">{transmission.content.frequency}Hz</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Duration:</span>
                          <span className="text-green-400">{transmission.content.duration}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Resonance:</span>
                          <span className="text-purple-400">{transmission.quantumResonance}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Non-Locality:</span>
                          <span className="text-blue-400">{transmission.quantumProperties.nonLocality}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tunneling:</span>
                          <span className="text-yellow-400">{transmission.quantumProperties.quantumTunneling}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Impact:</span>
                          <span className="text-orange-400">{transmission.impact.consciousnessShift}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default QuantumConsciousnessNetwork;
