/**
 * GAA Information Panel - Comprehensive guide for users
 * Explains what GAA is, how to use it, and provides tutorials
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Info, 
  Play, 
  Shield, 
  Brain, 
  Heart, 
  Waves, 
  Volume2, 
  Users, 
  Star, 
  AlertTriangle,
  BookOpen,
  Zap,
  Moon,
  Sun,
  Target,
  Activity,
  Headphones,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GAAInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GAAInfoPanel: React.FC<GAAInfoPanelProps> = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const quickStartSteps = [
    {
      title: "1. Choose Your Path",
      description: "Select a Deep5 Archetype that resonates with your current state",
      icon: Star,
      details: "Each archetype offers unique frequencies and experiences. Start with The Sun XIX for balanced energy or The Moon XVIII for deeper shadow work."
    },
    {
      title: "2. Set Safety First",
      description: "Ensure your audio levels are comfortable and HPF is enabled for headphones",
      icon: Shield,
      details: "Always start at low volume. The Panic button instantly resets to light polarity if you feel overwhelmed."
    },
    {
      title: "3. Begin Your Session",
      description: "Press Start and allow the geometrically aligned frequencies to guide you",
      icon: Play,
      details: "Sessions typically run 10-30 minutes. Focus on your breath and let the frequencies facilitate your consciousness exploration."
    },
    {
      title: "4. Monitor & Adjust",
      description: "Use polarity controls and biofeedback to fine-tune your experience",
      icon: Activity,
      details: "Watch your HRV, breathing, and brainwave patterns. Adjust light/dark balance based on your comfort and intention."
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                  <Waves className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">GAA Engine Guide</h2>
                  <p className="text-muted-foreground">Geometrically Aligned Audio System</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 m-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
                  <TabsTrigger value="archetypes">Archetypes</TabsTrigger>
                  <TabsTrigger value="safety">Safety</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="p-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        What is GAA?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        GAA (Geometrically Aligned Audio) is an advanced consciousness harmonization technology that uses 
                        mathematically precise frequencies, sacred geometry, and biofeedback integration to facilitate 
                        deep states of awareness and transformation.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <Brain className="w-8 h-8 text-primary mb-3" />
                          <h4 className="font-semibold mb-2">Neural Entrainment</h4>
                          <p className="text-sm text-muted-foreground">
                            Synchronizes brainwave patterns using binaural beats and harmonic frequencies
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                          <Target className="w-8 h-8 text-accent mb-3" />
                          <h4 className="font-semibold mb-2">Sacred Geometry</h4>
                          <p className="text-sm text-muted-foreground">
                            Integrates mathematical ratios found in nature and ancient wisdom traditions
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                          <Heart className="w-8 h-8 text-secondary mb-3" />
                          <h4 className="font-semibold mb-2">Biofeedback</h4>
                          <p className="text-sm text-muted-foreground">
                            Adapts in real-time to your heart rate, breathing, and brainwave activity
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span><strong>Deep5 Archetypes:</strong> Five transformational states based on Tarot wisdom</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Waves className="w-4 h-4 text-blue-500" />
                          <span><strong>Cosmic Visualization:</strong> Real-time 3D representation of your consciousness state</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 text-green-500" />
                          <span><strong>Orchestra Sync:</strong> Collective consciousness sessions with others</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Activity className="w-4 h-4 text-purple-500" />
                          <span><strong>Session Metrics:</strong> Track your progress and biofeedback data</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Quick Start Tab */}
                <TabsContent value="quickstart" className="p-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Getting Started</CardTitle>
                      <p className="text-muted-foreground">Follow these steps for your first GAA session</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {quickStartSteps.map((step, index) => (
                          <div 
                            key={index}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              activeStep === index 
                                ? 'bg-primary/10 border-primary' 
                                : 'bg-muted/20 border-muted hover:bg-muted/30'
                            }`}
                            onClick={() => setActiveStep(index)}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-lg ${
                                activeStep === index ? 'bg-primary text-white' : 'bg-muted'
                              }`}>
                                <step.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{step.title}</h4>
                                <p className="text-muted-foreground text-sm mb-2">{step.description}</p>
                                {activeStep === index && (
                                  <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-sm bg-background/50 p-3 rounded border-l-2 border-primary"
                                  >
                                    {step.details}
                                  </motion.p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Archetypes Tab */}
                <TabsContent value="archetypes" className="p-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deep5 Archetypes</CardTitle>
                      <p className="text-muted-foreground">Each archetype offers unique transformational experiences</p>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="moon">
                          <AccordionTrigger className="flex items-center gap-3">
                            <Moon className="w-5 h-5" />
                            Moon XVIII - Shadow Integration
                          </AccordionTrigger>
                          <AccordionContent className="space-y-3">
                            <p className="text-muted-foreground">
                              Deep shadow work and subconscious exploration. Features Animal Body mode for non-verbal processing.
                            </p>
                            <div className="p-3 bg-muted/20 rounded">
                              <strong>Best for:</strong> Processing emotions, shadow work, deep introspection<br/>
                              <strong>Duration:</strong> Dark phases vary by tradition (90-150s)<br/>
                              <strong>Caution:</strong> Can be intense - use Panic button if overwhelmed
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="sun">
                          <AccordionTrigger className="flex items-center gap-3">
                            <Sun className="w-5 h-5" />
                            Sun XIX - Illumination & Joy
                          </AccordionTrigger>
                          <AccordionContent className="space-y-3">
                            <p className="text-muted-foreground">
                              Balanced light energy with brief honest dark phases. Consonant harmonies and uplifting frequencies.
                            </p>
                            <div className="p-3 bg-muted/20 rounded">
                              <strong>Best for:</strong> Beginners, positive energy, celebration<br/>
                              <strong>Duration:</strong> 20-30s dark honesty, then sustained light<br/>
                              <strong>Note:</strong> Most accessible archetype for new users
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="tower">
                          <AccordionTrigger className="flex items-center gap-3">
                            <Zap className="w-5 h-5" />
                            Tower XVI - Breakthrough & Liberation
                          </AccordionTrigger>
                          <AccordionContent className="space-y-3">
                            <p className="text-muted-foreground">
                              Sudden breakthrough moments with controlled intensity. Features safety limiters and quick rebuilds.
                            </p>
                            <div className="p-3 bg-muted/20 rounded">
                              <strong>Best for:</strong> Breaking patterns, breakthroughs, liberation<br/>
                              <strong>Duration:</strong> Strikes every 40-90s, rebuild in ≤600ms<br/>
                              <strong>Safety:</strong> Automatic limiters prevent audio clipping
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="devil">
                          <AccordionTrigger className="flex items-center gap-3">
                            <Shield className="w-5 h-5" />
                            Devil XV - Bondage & Freedom
                          </AccordionTrigger>
                          <AccordionContent className="space-y-3">
                            <p className="text-muted-foreground">
                              Explores patterns of bondage and liberation. Features phase traps with instant "Unchain" reset.
                            </p>
                            <div className="p-3 bg-muted/20 rounded">
                              <strong>Best for:</strong> Examining limiting beliefs, breaking chains<br/>
                              <strong>Duration:</strong> Phase trap locks for 20-40s<br/>
                              <strong>Freedom:</strong> "Unchain" button provides immediate release
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="death">
                          <AccordionTrigger className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5" />
                            Death XIII - Transformation & Renewal
                          </AccordionTrigger>
                          <AccordionContent className="space-y-3">
                            <p className="text-muted-foreground">
                              Deep transformation through reduction to essence, then regeneration. Features subtractive morphing.
                            </p>
                            <div className="p-3 bg-muted/20 rounded">
                              <strong>Best for:</strong> Major life transitions, letting go, renewal<br/>
                              <strong>Process:</strong> Reduces to single seed tone, then rebuilds<br/>
                              <strong>Metaphor:</strong> Death as transformation, not ending
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Safety Tab */}
                <TabsContent value="safety" className="p-6 space-y-6">
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      GAA involves deep consciousness work. Please read all safety information before beginning.
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Safety Protocols
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                          <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                            <Volume2 className="w-4 h-4" />
                            Audio Safety
                          </h4>
                          <ul className="text-sm space-y-1 text-green-600">
                            <li>• Start at low volume (20-30%)</li>
                            <li>• Use headphones with HPF enabled</li>
                            <li>• Master limiter prevents clipping</li>
                            <li>• Panic button available always</li>
                          </ul>
                        </div>

                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Biofeedback Safety
                          </h4>
                          <ul className="text-sm space-y-1 text-blue-600">
                            <li>• HRV monitoring with auto-alerts</li>
                            <li>• Light Bias activates if stressed</li>
                            <li>• Breathing guidance available</li>
                            <li>• EEG integration is gentle</li>
                          </ul>
                        </div>

                        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                          <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            Consciousness Safety
                          </h4>
                          <ul className="text-sm space-y-1 text-purple-600">
                            <li>• Shadow work done gradually</li>
                            <li>• Integration prompts included</li>
                            <li>• No forced experiences</li>
                            <li>• You remain in control</li>
                          </ul>
                        </div>

                        <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                          <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Orchestra Safety
                          </h4>
                          <ul className="text-sm space-y-1 text-orange-600">
                            <li>• Leave sessions anytime</li>
                            <li>• No personal data shared</li>
                            <li>• Phase sync is consensual</li>
                            <li>• Individual control maintained</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <h4 className="font-semibold text-destructive mb-2">Emergency Protocols</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Panic Button:</strong> Instantly resets to full light polarity</p>
                          <p><strong>Light Bias:</strong> Reduces dark energy for 120 seconds</p>
                          <p><strong>Stop Button:</strong> Immediately halts all audio generation</p>
                          <p><strong>Volume Control:</strong> Hardware volume always overrides</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value="advanced" className="p-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Features</CardTitle>
                      <p className="text-muted-foreground">Deep customization and technical details</p>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="polarity">
                          <AccordionTrigger>Polarity Protocol</AccordionTrigger>
                          <AccordionContent className="space-y-3">
                            <p className="text-muted-foreground">
                              The polarity system balances light and dark energies using mathematical precision.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-semibold mb-2">Light Channel</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• Harmonic resonance mode</li>
                                  <li>• Amplitude: 0.0-1.0</li>
                                  <li>• Phase: 0 radians default</li>
                                  <li>• Uplifting frequencies</li>
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-semibold mb-2">Dark Channel</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• Chaotic resonance mode</li>
                                  <li>• Amplitude: 0.0-1.0</li>
                                  <li>• Phase: π radians default</li>
                                  <li>• Shadow integration tones</li>
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="biofeedback">
                          <AccordionTrigger>Biofeedback Integration</AccordionTrigger>
                          <AccordionContent className="space-y-3">
                            <p className="text-muted-foreground">
                              Real-time physiological monitoring adapts the audio experience to your body's responses.
                            </p>
                            <div className="space-y-3">
                              <div className="p-3 bg-muted/20 rounded">
                                <strong>HRV (Heart Rate Variability):</strong> Monitors autonomic nervous system balance
                              </div>
                              <div className="p-3 bg-muted/20 rounded">
                                <strong>Breathing Rate:</strong> Guides frequency modulation and pacing
                              </div>
                              <div className="p-3 bg-muted/20 rounded">
                                <strong>EEG Alpha/Theta:</strong> Adjusts subharmonic depth for brainwave entrainment
                              </div>
                              <div className="p-3 bg-muted/20 rounded">
                                <strong>Skin Conductance:</strong> Indicates emotional arousal and stress levels
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="cosmic">
                          <AccordionTrigger>Cosmic Visualization</AccordionTrigger>
                          <AccordionContent className="space-y-3">
                            <p className="text-muted-foreground">
                              Real-time 3D representation of your consciousness state using sacred geometry.
                            </p>
                            <ul className="space-y-2">
                              <li><strong>Firmament Radius:</strong> Tracks maximum light energy</li>
                              <li><strong>Shadow Dome:</strong> Visualizes dark energy integration</li>
                              <li><strong>Geometric Structures:</strong> Appear based on session data</li>
                              <li><strong>Performance:</strong> ≥60fps desktop, ≥30fps mobile</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="metrics">
                          <AccordionTrigger>Session Metrics & Export</AccordionTrigger>
                          <AccordionContent className="space-y-3">
                            <p className="text-muted-foreground">
                              Comprehensive tracking and analysis of your GAA sessions.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-semibold mb-2">Live Metrics</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• Dark phase duration</li>
                                  <li>• Average polarity balance</li>
                                  <li>• Limiter activations</li>
                                  <li>• Frame rate (FPS)</li>
                                  <li>• Orchestra phase error</li>
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-semibold mb-2">Export Data</h5>
                                <ul className="text-sm space-y-1">
                                  <li>• JSON format</li>
                                  <li>• No personal data</li>
                                  <li>• Anonymous metrics only</li>
                                  <li>• Device class logged</li>
                                  <li>• Archetype & tradition ID</li>
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};