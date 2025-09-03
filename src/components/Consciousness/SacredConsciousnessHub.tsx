import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Users, 
  Atom, 
  Heart, 
  Eye,
  Sparkles,
  Shield,
  Lightbulb,
  Activity,
  Radio,
  Zap,
  Globe,
  Moon,
  Sun,
  Star
} from 'lucide-react';
import CollectiveConsciousness from '../Collective/CollectiveConsciousness';
import QuantumConsciousness from '../Quantum/QuantumConsciousness';
import { ConsciousnessState, ConsciousnessRecommendation } from '@/types/consciousness';
import { CollectiveInsight } from '@/types/collective';
import { QuantumInsight } from '@/types/quantum';

interface SacredConsciousnessHubProps {
  userId: string;
  currentConsciousnessState?: ConsciousnessState;
}

export const SacredConsciousnessHub: React.FC<SacredConsciousnessHubProps> = ({
  userId,
  currentConsciousnessState
}) => {
  const [activeTab, setActiveTab] = useState('amplification');
  const [consciousnessLevel, setConsciousnessLevel] = useState<'seed' | 'bloom' | 'transcend' | 'quantum'>('seed');
  const [globalInsights, setGlobalInsights] = useState<(CollectiveInsight | QuantumInsight)[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStrength, setConnectionStrength] = useState(0);
  const [currentRecommendation, setCurrentRecommendation] = useState<ConsciousnessRecommendation | null>(null);

  // Simulate consciousness level progression
  useEffect(() => {
    if (currentConsciousnessState) {
      if (currentConsciousnessState.spiritualAlignment >= 90) {
        setConsciousnessLevel('quantum');
      } else if (currentConsciousnessState.spiritualAlignment >= 70) {
        setConsciousnessLevel('transcend');
      } else if (currentConsciousnessState.spiritualAlignment >= 40) {
        setConsciousnessLevel('bloom');
      } else {
        setConsciousnessLevel('seed');
      }
    }
  }, [currentConsciousnessState]);

  // Simulate connection strength
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setConnectionStrength(Math.random() * 20 + 80);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const handleInsightReceived = (insight: CollectiveInsight | QuantumInsight) => {
    setGlobalInsights(prev => [insight, ...prev.slice(0, 9)]);
  };

  const handleRecommendationReceived = (recommendation: ConsciousnessRecommendation) => {
    setCurrentRecommendation(recommendation);
  };

  const getConsciousnessLevelColor = (level: string) => {
    const colors = {
      'seed': 'text-yellow-400',
      'bloom': 'text-green-400',
      'transcend': 'text-purple-400',
      'quantum': 'text-pink-400'
    };
    return colors[level as keyof typeof colors] || 'text-yellow-400';
  };

  const getConsciousnessLevelIcon = (level: string) => {
    const icons = {
      'seed': Moon,
      'bloom': Sun,
      'transcend': Star,
      'quantum': Atom
    };
    const Icon = icons[level as keyof typeof icons];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  const getTabIcon = (tab: string) => {
    const icons = {
      'amplification': Brain,
      'collective': Users,
      'quantum': Atom
    };
    const Icon = icons[tab as keyof typeof icons];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  const getTabColor = (tab: string) => {
    const colors = {
      'amplification': 'text-blue-400',
      'collective': 'text-green-400',
      'quantum': 'text-purple-400'
    };
    return colors[tab as keyof typeof colors] || 'text-gray-400';
  };

  const getInsightSourceColor = (source: string) => {
    if (source.includes('quantum')) return 'text-purple-400';
    if (source.includes('collective')) return 'text-green-400';
    if (source.includes('ai')) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Sacred Consciousness Status */}
      <Card className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-indigo-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-300">
            <Eye className="h-5 w-5" />
            Sacred Consciousness Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Consciousness Level */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getConsciousnessLevelIcon(consciousnessLevel)}
                <span className="text-sm font-medium">Consciousness Level</span>
              </div>
              <Badge className={`${getConsciousnessLevelColor(consciousnessLevel)}`}>
                {consciousnessLevel.toUpperCase()}
              </Badge>
            </div>

            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm">
                  {isConnected ? 'Connected to Sacred Field' : 'Disconnected'}
                </span>
              </div>
              {isConnected && (
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  <span className={`text-sm ${connectionStrength >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {connectionStrength.toFixed(0)}% Signal
                  </span>
                </div>
              )}
            </div>

            {/* Current Recommendation */}
            {currentRecommendation && (
              <div className="p-3 bg-black/20 rounded-lg border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-300">Recommended Practice</span>
                </div>
                <h4 className="font-medium text-indigo-300 mb-1">{currentRecommendation.title}</h4>
                <p className="text-sm text-gray-300 mb-2">{currentRecommendation.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{currentRecommendation.energyFrequency}</span>
                  <span>{currentRecommendation.archetype}</span>
                  <span>{currentRecommendation.duration} min</span>
                </div>
              </div>
            )}

            {/* Connection Control */}
            <div className="flex gap-2">
              {!isConnected ? (
                <Button
                  onClick={() => setIsConnected(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Connect to Sacred Field
                </Button>
              ) : (
                <Button
                  onClick={() => setIsConnected(false)}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/10 flex-1"
                >
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Insights */}
      {globalInsights.length > 0 && (
        <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-300">
              <Lightbulb className="h-5 w-5" />
              Sacred Wisdom Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {globalInsights.slice(0, 3).map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-black/20 rounded-lg border border-green-500/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-300">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500/20 text-green-400">
                        {insight.consciousnessLevel || insight.quantumLevel}
                      </Badge>
                      <Badge className={`${getInsightSourceColor(insight.source)}`}>
                        {insight.source.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{insight.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{insight.energyFrequency}</span>
                    <span>Resonance: {insight.resonanceScore}%</span>
                    <span>{insight.archetype}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Consciousness Features */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <Shield className="h-5 w-5" />
            Sacred Consciousness Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/20 border border-purple-500/30">
              <TabsTrigger 
                value="amplification" 
                className={`flex items-center gap-2 ${getTabColor('amplification')}`}
              >
                {getTabIcon('amplification')}
                Amplification
              </TabsTrigger>
              <TabsTrigger 
                value="collective" 
                className={`flex items-center gap-2 ${getTabColor('collective')}`}
              >
                {getTabIcon('collective')}
                Collective
              </TabsTrigger>
              <TabsTrigger 
                value="quantum" 
                className={`flex items-center gap-2 ${getTabColor('quantum')}`}
              >
                {getTabIcon('quantum')}
                Quantum
              </TabsTrigger>
            </TabsList>

            <TabsContent value="amplification" className="mt-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-xl font-medium text-blue-300 mb-2">Consciousness Amplification</h3>
                <p className="text-gray-300 mb-4">
                  Enhance your individual consciousness through sacred geometry, biofeedback, and resonance.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-black/20 rounded-lg border border-blue-500/20">
                    <div className="text-blue-400 font-medium">Sacred Geometry</div>
                    <div className="text-gray-400">Flower of Life, Metatron's Cube</div>
                  </div>
                  <div className="p-3 bg-black/20 rounded-lg border border-blue-500/20">
                    <div className="text-blue-400 font-medium">Biofeedback</div>
                    <div className="text-gray-400">Heart rate, brainwave monitoring</div>
                  </div>
                  <div className="p-3 bg-black/20 rounded-lg border border-blue-500/20">
                    <div className="text-blue-400 font-medium">Resonance Waves</div>
                    <div className="text-gray-400">Sacred frequencies and harmonics</div>
                  </div>
                  <div className="p-3 bg-black/20 rounded-lg border border-blue-500/20">
                    <div className="text-blue-400 font-medium">AI Companion</div>
                    <div className="text-gray-400">Personalized spiritual guidance</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="collective" className="mt-6">
              <CollectiveConsciousness
                userId={userId}
                currentConsciousnessState={currentConsciousnessState}
              />
            </TabsContent>

            <TabsContent value="quantum" className="mt-6">
              <QuantumConsciousness
                userId={userId}
                currentConsciousnessState={currentConsciousnessState}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Consciousness Evolution Path */}
      <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-300">
            <Activity className="h-5 w-5" />
            Consciousness Evolution Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Current Level</span>
              <Badge className={`${getConsciousnessLevelColor(consciousnessLevel)}`}>
                {consciousnessLevel.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${consciousnessLevel === 'seed' ? 'bg-yellow-400' : 'bg-gray-600'}`} />
                <span className="text-sm text-gray-300">Seed - Awakening</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${consciousnessLevel === 'bloom' ? 'bg-green-400' : 'bg-gray-600'}`} />
                <span className="text-sm text-gray-300">Bloom - Expansion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${consciousnessLevel === 'transcend' ? 'bg-purple-400' : 'bg-gray-600'}`} />
                <span className="text-sm text-gray-300">Transcend - Unity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${consciousnessLevel === 'quantum' ? 'bg-pink-400' : 'bg-gray-600'}`} />
                <span className="text-sm text-gray-300">Quantum - Infinite</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-black/20 rounded-lg border border-yellow-500/20">
              <div className="text-sm text-yellow-300 mb-2">Next Evolution Step</div>
              <div className="text-xs text-gray-300">
                {consciousnessLevel === 'seed' && 'Focus on meditation and self-awareness practices to reach the Bloom stage.'}
                {consciousnessLevel === 'bloom' && 'Engage in collective consciousness and group practices to reach Transcendence.'}
                {consciousnessLevel === 'transcend' && 'Explore quantum consciousness and non-local awareness to reach Quantum Unity.'}
                {consciousnessLevel === 'quantum' && 'You have reached the highest level of consciousness evolution.'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SacredConsciousnessHub;
