/**
 * GAA Guidebook Section - Comprehensive documentation for GAA Engine
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Waves, 
  Moon, 
  Sun, 
  Zap, 
  BookOpen, 
  Shield, 
  Brain, 
  Users, 
  Eye, 
  Star,
  Play,
  Volume2,
  Heart,
  Activity,
  Info,
  AlertTriangle,
  CheckCircle,
  Globe,
  Target,
  BarChart3,
  Download,
  RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GAAGuidebookSectionProps {
  className?: string;
}

export const GAAGuidebookSection: React.FC<GAAGuidebookSectionProps> = ({ className = '' }) => {
  const [activeArchetype, setActiveArchetype] = useState<string | null>(null);

  const archetypes = [
    {
      id: 'moon',
      name: 'Moon XVIII',
      icon: Moon,
      theme: 'Shadow Integration & Deep Work',
      description: 'Explores the subconscious and integrates shadow aspects of the psyche',
      phases: 'Dark phases: 90-150s depending on tradition',
      features: ['Animal Body mode', 'Theta brainwave enhancement', 'Subconscious processing'],
      cautions: ['Can be intense', 'Use Panic button if overwhelmed', 'Gradual integration recommended'],
      bestFor: ['Shadow work', 'Emotional processing', 'Deep introspection', 'Dream work']
    },
    {
      id: 'tower',
      name: 'Tower XVI', 
      icon: Zap,
      theme: 'Breakthrough & Liberation',
      description: 'Facilitates sudden insights and breaks through limiting patterns',
      phases: 'Strikes every 40-90s with rebuild in ≤600ms',
      features: ['Controlled intensity bursts', 'Safety limiters', 'Pattern disruption'],
      cautions: ['Audio limiters engaged', 'No clipping protection', 'Gradual intensity increase'],
      bestFor: ['Breaking patterns', 'Creative breakthroughs', 'Liberation work', 'Stuck energy']
    },
    {
      id: 'devil',
      name: 'Devil XV',
      icon: Shield,
      theme: 'Bondage & Freedom',
      description: 'Explores patterns of limitation and facilitates conscious liberation',
      phases: 'Phase trap locks 20-40s with instant "Unchain" release',
      features: ['Phase trap mechanisms', 'Instant liberation protocol', 'Pattern recognition'],
      cautions: ['Unchain button always available', 'Consensual experience only', 'Freedom at all times'],
      bestFor: ['Examining beliefs', 'Breaking chains', 'Liberation work', 'Addiction patterns']
    },
    {
      id: 'death',
      name: 'Death XIII',
      icon: BookOpen,
      theme: 'Transformation & Renewal',
      description: 'Facilitates deep transformation through reduction to essence and renewal',
      phases: 'Subtractive morphing to single seed tone, then regeneration',
      features: ['Essence reduction', 'Regenerative rebuild', 'Transformation cycles'],
      cautions: ['Gentle process', 'Natural pacing', 'Integration focused'],
      bestFor: ['Major transitions', 'Letting go', 'Renewal work', 'Rebirth processes']
    },
    {
      id: 'sun',
      name: 'Sun XIX',
      icon: Sun,
      theme: 'Illumination & Joy',
      description: 'Balanced light energy with brief honest dark phases and uplifting harmonies',
      phases: '20-30s dark honesty, then sustained light with consonant harmonies',
      features: ['Balanced polarity', 'Consonant harmonies', 'Light-focused experience'],
      cautions: ['Beginner-friendly', 'Gentle introduction', 'Safe for exploration'],
      bestFor: ['Beginners', 'Positive energy', 'Celebration', 'Joy work', 'Light integration']
    }
  ];

  const safetyProtocols = [
    {
      category: 'Audio Safety',
      icon: Volume2,
      items: [
        'Master limiter prevents audio clipping and damage',
        'Start at low volume (20-30%) and gradually increase',
        'HPF (High-Pass Filter) enabled automatically for headphones',
        'Panic button instantly resets to light polarity',
        'Hardware volume controls always override software'
      ]
    },
    {
      category: 'Consciousness Safety',
      icon: Brain,
      items: [
        'Shadow work done gradually with integration prompts',
        'No forced experiences - you remain in complete control',
        'Light Bias button available for immediate comfort',
        'Integration phases included in all archetype sessions',
        'Demo mode available for safe exploration'
      ]
    },
    {
      category: 'Biofeedback Safety',
      icon: Heart,
      items: [
        'HRV monitoring with automatic alerts for stress',
        'Light Bias activates automatically if HRV drops critically',
        'Breathing guidance available throughout sessions',
        'EEG integration is gentle and non-invasive',
        'All bio-signals processed locally and ephemerally'
      ]
    },
    {
      category: 'Orchestra Safety',
      icon: Users,
      items: [
        'Leave collective sessions anytime without penalty',
        'No personal data shared with other participants',
        'Phase synchronization is consensual and voluntary',
        'Individual controls maintained in group sessions',
        'Privacy-first design with encrypted connections'
      ]
    }
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
            <Waves className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              GAA Engine Guide
            </h2>
            <p className="text-sm text-muted-foreground">Geometrically Aligned Audio System</p>
          </div>
        </div>
        
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Advanced consciousness harmonization technology that uses mathematically precise frequencies, 
          sacred geometry, and biofeedback integration to facilitate deep states of awareness and transformation.
        </p>
        
        <div className="flex justify-center gap-2">
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-500/30">
            Deep5 Protocol
          </Badge>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
            Biofeedback Integrated
          </Badge>
          <Badge variant="outline" className="bg-pink-500/10 text-pink-600 border-pink-500/30">
            Orchestra Compatible
          </Badge>
        </div>
      </motion.div>

      {/* Core Technology Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Core Technology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
              <Brain className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Neural Entrainment</h4>
              <p className="text-sm text-muted-foreground">
                Synchronizes brainwave patterns using binaural beats and harmonic frequencies for consciousness expansion.
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <Target className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Sacred Geometry</h4>
              <p className="text-sm text-muted-foreground">
                Integrates mathematical ratios found in nature and ancient wisdom traditions for harmonic alignment.
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-cyan-500/10 border border-pink-500/20">
              <Activity className="w-12 h-12 text-pink-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Biofeedback</h4>
              <p className="text-sm text-muted-foreground">
                Adapts in real-time to your heart rate, breathing, and brainwave activity for personalized experiences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deep5 Archetypes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Deep5 Archetypes
          </CardTitle>
          <p className="text-muted-foreground">
            Five transformational states based on Tarot wisdom, each offering unique frequencies and consciousness experiences.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {archetypes.map((archetype, index) => (
              <motion.div
                key={archetype.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all border-2 ${
                    activeArchetype === archetype.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => setActiveArchetype(
                    activeArchetype === archetype.id ? null : archetype.id
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <archetype.icon className="w-6 h-6 text-primary" />
                        <div>
                          <h4 className="font-semibold">{archetype.name}</h4>
                          <p className="text-sm text-muted-foreground">{archetype.theme}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activeArchetype === archetype.id ? 'Hide Details' : 'Show Details'}
                      </Badge>
                    </div>
                    
                    {activeArchetype === archetype.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 space-y-4"
                      >
                        <p className="text-sm">{archetype.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <strong className="text-primary">Phases:</strong>
                            <p className="mt-1 text-muted-foreground">{archetype.phases}</p>
                          </div>
                          
                          <div>
                            <strong className="text-primary">Best For:</strong>
                            <ul className="mt-1 space-y-0.5 text-muted-foreground">
                              {archetype.bestFor.map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <strong className="text-green-600">Features:</strong>
                            <ul className="mt-1 space-y-0.5 text-muted-foreground">
                              {archetype.features.map((item, i) => (
                                <li key={i} className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <strong className="text-amber-600">Safety Notes:</strong>
                            <ul className="mt-1 space-y-0.5 text-muted-foreground">
                              {archetype.cautions.map((item, i) => (
                                <li key={i} className="flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Protocols */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Comprehensive Safety Protocols
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              GAA involves deep consciousness work. Please read all safety protocols before beginning your journey.
            </AlertDescription>
          </Alert>
          
          <div className="grid md:grid-cols-2 gap-6">
            {safetyProtocols.map((protocol, index) => (
              <motion.div
                key={protocol.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border bg-muted/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <protocol.icon className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">{protocol.category}</h4>
                </div>
                <ul className="space-y-2">
                  {protocol.items.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Advanced Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="visualization" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="visualization">Cosmic Viz</TabsTrigger>
              <TabsTrigger value="biofeedback">Biofeedback</TabsTrigger>
              <TabsTrigger value="orchestra">Orchestra</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="visualization" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <strong>Firmament Sphere</strong>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Radius expands with light energy (Lmax). Represents consciousness expansion and illumination phases.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-4 h-4 text-purple-500" />
                    <strong>Shadow Dome</strong>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Opacity tracks dark weight integration. Shows shadow work and subconscious processing.
                  </p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-cyan-500" />
                  <strong>Performance</strong>
                </div>
                <p className="text-sm text-muted-foreground">
                  60+ FPS desktop, 30+ FPS mobile. Camera breath-coupled for immersive experience. Live geometric structures appear based on session data.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="biofeedback" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 rounded border-l-4 border-l-red-500 bg-red-500/5">
                    <strong className="text-red-600">HRV (Heart Rate Variability)</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monitors autonomic nervous system balance. Auto-activates Light Bias if stress detected.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded border-l-4 border-l-blue-500 bg-blue-500/5">
                    <strong className="text-blue-600">Breathing Rate</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Guides frequency modulation and session pacing. Breath-coupled camera movement.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 rounded border-l-4 border-l-purple-500 bg-purple-500/5">
                    <strong className="text-purple-600">EEG Alpha/Theta</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Adjusts subharmonic depth for brainwave entrainment. Gentle, non-invasive integration.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded border-l-4 border-l-green-500 bg-green-500/5">
                    <strong className="text-green-600">Skin Conductance</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Indicates emotional arousal and stress levels. Provides feedback for session adaptation.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="orchestra" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Collective Consciousness Sessions
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Real-time phase synchronization across multiple participants</li>
                    <li>• Group coherence tracking and collective resonance metrics</li>
                    <li>• Phase error monitoring (target: &lt;80ms for optimal sync)</li>
                    <li>• Individual controls maintained within group experience</li>
                    <li>• Privacy-first design with no personal data sharing</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Live Metrics
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Dark phase duration tracking</li>
                    <li>• Average polarity balance</li>
                    <li>• Audio limiter activations</li>
                    <li>• Frame rate performance (FPS)</li>
                    <li>• Orchestra phase error (if in group session)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Capabilities
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• JSON format session data</li>
                    <li>• No personal identifiable information</li>
                    <li>• Anonymous consciousness metrics only</li>
                    <li>• Device class and archetype tracking</li>
                    <li>• Tradition variant logging</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Getting Started with GAA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: 1, title: 'Choose Path', desc: 'Select an archetype that resonates', icon: Star },
                { step: 2, title: 'Safety First', desc: 'Check audio levels and comfort', icon: Shield },
                { step: 3, title: 'Begin Session', desc: 'Press Start and breathe consciously', icon: Play },
                { step: 4, title: 'Monitor & Adjust', desc: 'Use controls as needed', icon: BarChart3 }
              ].map((step, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-background/50 border">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    {step.step}
                  </div>
                  <step.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium text-sm">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong>Recommendation:</strong> Start with <strong>Sun XIX</strong> for your first GAA session. 
                It provides a balanced, gentle introduction to the technology with built-in safety protocols.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};