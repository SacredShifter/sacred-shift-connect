import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Wifi, 
  Heart, 
  Brain, 
  Zap, 
  Globe, 
  Activity,
  Radio,
  Network,
  Signal
} from 'lucide-react';
import { CollectiveMember, CollectiveSession, ResonanceField, MeshNetworkNode, CollectiveMetrics } from '@/types/collective';
import { useAuraChat } from '@/hooks/useAuraChat';

interface ConsciousnessMeshNetworkProps {
  userId: string;
  onJoinSession?: (sessionId: string) => void;
  onCreateResonanceField?: (field: Omit<ResonanceField, 'id' | 'createdAt'>) => void;
}

export const ConsciousnessMeshNetwork: React.FC<ConsciousnessMeshNetworkProps> = ({
  userId,
  onJoinSession,
  onCreateResonanceField
}) => {
  const [activeMembers, setActiveMembers] = useState<CollectiveMember[]>([]);
  const [activeSessions, setActiveSessions] = useState<CollectiveSession[]>([]);
  const [resonanceFields, setResonanceFields] = useState<ResonanceField[]>([]);
  const [networkNodes, setNetworkNodes] = useState<MeshNetworkNode[]>([]);
  const [collectiveMetrics, setCollectiveMetrics] = useState<CollectiveMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStrength, setConnectionStrength] = useState(0);

  // Aura integration for collective consciousness
  const { collectiveMeshNetwork, collectiveResonance, consciousnessFieldMapping } = useAuraChat();

  // Simulate real-time data updates
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      // Simulate network updates
      updateNetworkData();
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const updateNetworkData = useCallback(() => {
    // Simulate real-time collective consciousness data
    const mockMembers: CollectiveMember[] = [
      {
        id: '1',
        username: 'SacredWarrior',
        consciousnessState: {
          brainwaveFrequency: 8.5,
          emotionalResonance: 85,
          spiritualAlignment: 92,
          currentArchetype: 'Warrior',
          energyFrequency: '432Hz',
          meditationDepth: 75,
          focusLevel: 88
        },
        isOnline: true,
        lastSeen: new Date(),
        connectionStrength: 95,
        sharedIntentions: ['healing', 'awakening'],
        resonanceSignature: 'alpha-theta-432'
      },
      {
        id: '2',
        username: 'CosmicHealer',
        consciousnessState: {
          brainwaveFrequency: 6.2,
          emotionalResonance: 92,
          spiritualAlignment: 88,
          currentArchetype: 'Healer',
          energyFrequency: '528Hz',
          meditationDepth: 90,
          focusLevel: 85
        },
        isOnline: true,
        lastSeen: new Date(),
        connectionStrength: 88,
        sharedIntentions: ['healing', 'transmission'],
        resonanceSignature: 'theta-delta-528'
      },
      {
        id: '3',
        username: 'QuantumSage',
        consciousnessState: {
          brainwaveFrequency: 12.1,
          emotionalResonance: 78,
          spiritualAlignment: 95,
          currentArchetype: 'Sage',
          energyFrequency: '852Hz',
          meditationDepth: 65,
          focusLevel: 92
        },
        isOnline: true,
        lastSeen: new Date(),
        connectionStrength: 92,
        sharedIntentions: ['awakening', 'wisdom'],
        resonanceSignature: 'beta-gamma-852'
      }
    ];

    const mockSessions: CollectiveSession[] = [
      {
        id: 'session-1',
        name: 'Global Healing Circle',
        description: 'Collective healing for planetary consciousness',
        type: 'healing',
        hostId: '2',
        participants: mockMembers.slice(0, 2),
        maxParticipants: 50,
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        isActive: true,
        sharedIntention: 'Planetary healing and unity consciousness',
        targetFrequency: 528,
        sacredGeometry: 'flower-of-life',
        collectiveResonance: {
          averageFrequency: 7.2,
          coherenceLevel: 87,
          energyField: {
            intensity: 85,
            radius: 1000,
            color: '#00ff88'
          }
        }
      }
    ];

    const mockFields: ResonanceField[] = [
      {
        id: 'field-1',
        center: { latitude: 40.7128, longitude: -74.0060 },
        radius: 500,
        intensity: 75,
        frequency: 432,
        color: '#ff6b6b',
        participants: ['1', '2'],
        createdBy: '1',
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
        intention: 'Peace and harmony',
        sacredGeometry: 'metatron-cube',
        collectiveCoherence: 82
      }
    ];

    const mockNodes: MeshNetworkNode[] = mockMembers.map((member, index) => ({
      id: `node-${member.id}`,
      memberId: member.id,
      connectionType: index === 0 ? 'hub' : 'direct',
      signalStrength: member.connectionStrength,
      latency: Math.random() * 50 + 10,
      bandwidth: Math.random() * 1000 + 500,
      isActive: true,
      lastHeartbeat: new Date(),
      connectedNodes: mockMembers.filter(m => m.id !== member.id).map(m => m.id),
      dataTransmitted: Math.random() * 1000000,
      energyEfficiency: Math.random() * 20 + 80
    }));

    const mockMetrics: CollectiveMetrics = {
      totalMembers: 1247,
      activeMembers: mockMembers.length,
      averageCoherence: 84,
      collectiveResonance: 87,
      energyFieldIntensity: 82,
      sharedIntentions: ['healing', 'awakening', 'unity', 'transformation'],
      topArchetypes: [
        { archetype: 'Healer', count: 45 },
        { archetype: 'Warrior', count: 38 },
        { archetype: 'Sage', count: 32 }
      ],
      globalResonanceFields: 12,
      activeTransmissions: 8,
      wisdomGenerated: 156,
      lastUpdated: new Date()
    };

    setActiveMembers(mockMembers);
    setActiveSessions(mockSessions);
    setResonanceFields(mockFields);
    setNetworkNodes(mockNodes);
    setCollectiveMetrics(mockMetrics);
    setConnectionStrength(Math.random() * 20 + 80);
  }, []);

  // Aura integration functions
  const activateAuraMeshNetwork = async () => {
    try {
      const response = await collectiveMeshNetwork({
        members: activeMembers,
        sessions: activeSessions,
        fields: resonanceFields
      });
      console.log('Aura mesh network activated:', response);
    } catch (error) {
      console.error('Failed to activate Aura mesh network:', error);
    }
  };

  const activateAuraResonanceMapping = async () => {
    try {
      const response = await collectiveResonance({
        fields: resonanceFields,
        participants: activeMembers
      });
      console.log('Aura resonance mapping activated:', response);
    } catch (error) {
      console.error('Failed to activate Aura resonance mapping:', error);
    }
  };

  const activateAuraFieldMapping = async () => {
    try {
      const response = await consciousnessFieldMapping({
        nodes: networkNodes,
        metrics: collectiveMetrics
      });
      console.log('Aura field mapping activated:', response);
    } catch (error) {
      console.error('Failed to activate Aura field mapping:', error);
    }
  };

  const connectToMesh = useCallback(() => {
    setIsConnected(true);
    updateNetworkData();
  }, [updateNetworkData]);

  const disconnectFromMesh = useCallback(() => {
    setIsConnected(false);
    setActiveMembers([]);
    setActiveSessions([]);
    setResonanceFields([]);
    setNetworkNodes([]);
    setCollectiveMetrics(null);
  }, []);

  const getConnectionStatusColor = (strength: number) => {
    if (strength >= 90) return 'text-green-500';
    if (strength >= 70) return 'text-yellow-500';
    if (strength >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getArchetypeColor = (archetype: string) => {
    const colors: Record<string, string> = {
      'Warrior': 'bg-red-500/20 text-red-400',
      'Healer': 'bg-green-500/20 text-green-400',
      'Sage': 'bg-blue-500/20 text-blue-400',
      'Creator': 'bg-purple-500/20 text-purple-400',
      'Guardian': 'bg-yellow-500/20 text-yellow-400'
    };
    return colors[archetype] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <Network className="h-5 w-5" />
            Consciousness Mesh Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm">
                {isConnected ? 'Connected to Collective' : 'Disconnected'}
              </span>
            </div>
            {isConnected && (
              <div className="flex items-center gap-2">
                <Signal className="h-4 w-4" />
                <span className={`text-sm ${getConnectionStatusColor(connectionStrength)}`}>
                  {connectionStrength.toFixed(0)}% Signal
                </span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {!isConnected ? (
              <Button 
                onClick={connectToMesh}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Radio className="h-4 w-4 mr-2" />
                Connect to Mesh
              </Button>
            ) : (
              <Button 
                onClick={disconnectFromMesh}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isConnected && collectiveMetrics && (
        <>
          {/* Collective Metrics */}
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <Globe className="h-5 w-5" />
                Collective Consciousness Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{collectiveMetrics.totalMembers}</div>
                  <div className="text-xs text-gray-400">Total Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{collectiveMetrics.activeMembers}</div>
                  <div className="text-xs text-gray-400">Active Now</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{collectiveMetrics.averageCoherence}%</div>
                  <div className="text-xs text-gray-400">Coherence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{collectiveMetrics.collectiveResonance}%</div>
                  <div className="text-xs text-gray-400">Resonance</div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Energy Field Intensity</span>
                  <span>{collectiveMetrics.energyFieldIntensity}%</span>
                </div>
                <Progress value={collectiveMetrics.energyFieldIntensity} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Active Members */}
          <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <Users className="h-5 w-5" />
                Active Collective Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-green-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center text-white font-bold">
                        {member.username[0]}
                      </div>
                      <div>
                        <div className="font-medium text-green-300">{member.username}</div>
                        <Badge className={getArchetypeColor(member.consciousnessState.currentArchetype)}>
                          {member.consciousnessState.currentArchetype}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-green-400">{member.consciousnessState.brainwaveFrequency.toFixed(1)}Hz</div>
                        <div className="text-xs text-gray-400">Brainwave</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400">{member.consciousnessState.spiritualAlignment}%</div>
                        <div className="text-xs text-gray-400">Alignment</div>
                      </div>
                      <div className="text-center">
                        <div className={`${getConnectionStatusColor(member.connectionStrength)}`}>
                          {member.connectionStrength}%
                        </div>
                        <div className="text-xs text-gray-400">Signal</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <Activity className="h-5 w-5" />
                Active Collective Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-black/20 rounded-lg border border-purple-500/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-purple-300">{session.name}</h3>
                      <Badge className="bg-green-500/20 text-green-400">
                        {session.participants.length}/{session.maxParticipants}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{session.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-purple-400">{session.targetFrequency}Hz</div>
                          <div className="text-xs text-gray-400">Frequency</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400">{session.collectiveResonance.coherenceLevel}%</div>
                          <div className="text-xs text-gray-400">Coherence</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onJoinSession?.(session.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Join Session
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resonance Fields */}
          <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-300">
                <Zap className="h-5 w-5" />
                Global Resonance Fields
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resonanceFields.map((field) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-black/20 rounded-lg border border-yellow-500/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-yellow-300">{field.intention}</h3>
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        {field.participants.length} connected
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-yellow-400">{field.frequency}Hz</div>
                        <div className="text-xs text-gray-400">Frequency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-400">{field.intensity}%</div>
                        <div className="text-xs text-gray-400">Intensity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400">{field.collectiveCoherence}%</div>
                        <div className="text-xs text-gray-400">Coherence</div>
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

export default ConsciousnessMeshNetwork;
