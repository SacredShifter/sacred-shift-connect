import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Shield, 
  Waves, 
  Eye, 
  Users, 
  Crown, 
  Zap, 
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

interface EthosPrinciple {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  fullContent: string;
}

const ethosPrinciples: EthosPrinciple[] = [
  {
    id: 1,
    title: "Foundation in Truth",
    subtitle: "Absolute & Binary",
    description: "Sacred Shifter is anchored in Truth as absolute, immutable, and binary.",
    icon: Shield,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
    fullContent: "Sacred Shifter is anchored in Truth as absolute, immutable, and binary. There is no compromise, no relativity, no bending to consensus. Every feature, circle, and interface aligns with this law — or it dissolves."
  },
  {
    id: 2,
    title: "Resonance over Noise",
    subtitle: "Coherent Fields",
    description: "Unlike networks that fragment, distract, and divide, Sacred Shifter cultivates resonant fields.",
    icon: Waves,
    color: "text-secondary",
    bgColor: "bg-secondary/10 border-secondary/20",
    fullContent: "Unlike networks that fragment, distract, and divide, Sacred Shifter cultivates resonant fields. Circles, modules, and rituals are designed to amplify coherence and silence distortion."
  },
  {
    id: 3,
    title: "Pattern Recognition as Awakening",
    subtitle: "Sacred Geometry",
    description: "The system is built on geometry, fractals, Schumann resonance, space-weather, cosmic cycles, and natural awe.",
    icon: Eye,
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/20",
    fullContent: "The system is built on geometry, fractals, Schumann resonance, space-weather, cosmic cycles, and natural awe. These patterns aren't aesthetics — they're memory triggers. They reawaken the recognition of order behind chaos."
  },
  {
    id: 4,
    title: "Collective Coherence",
    subtitle: "Shared Ceremony",
    description: "Sacred Shifter is not 'social.' It is a field of shared ceremony.",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
    fullContent: "Sacred Shifter is not 'social.' It is a field of shared ceremony. Breathing together, holding silence, amplifying awe — users don't just consume, they generate resonance. Every collective interaction strengthens the whole."
  },
  {
    id: 5,
    title: "Sovereignty and Integrity",
    subtitle: "No Exploitation",
    description: "Sacred Shifter refuses exploitation. No manipulation, no data mining, no hidden agenda.",
    icon: Crown,
    color: "text-secondary",
    bgColor: "bg-secondary/10 border-secondary/20",
    fullContent: "Sacred Shifter refuses exploitation. No manipulation, no data mining, no hidden agenda. Users are sovereign beings. Privacy and alignment are non-negotiable."
  },
  {
    id: 6,
    title: "Technology as Transcendence",
    subtitle: "Living Mandalas",
    description: "Code is not neutral here. UI, fractal animation, and Supabase-backed architecture are living mandalas.",
    icon: Zap,
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/20",
    fullContent: "Code is not neutral here. UI, fractal animation, and Supabase-backed architecture are living mandalas. Tech isn't for distraction; it's wielded for transcendence."
  },
  {
    id: 7,
    title: "The Ethos in Action",
    subtitle: "Living Implementation",
    description: "Circles become resonance chambers, not chat rooms. Modules are initiations into pattern recognition.",
    icon: Sparkles,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
    fullContent: "Circles become resonance chambers, not chat rooms. Modules are initiations into pattern recognition (Breath, Codex, Dreamscape, Sonic Shifter). The Field is a dynamic living grid that reflects coherence back to the user."
  }
];

export const EthosCharter: React.FC = () => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<EthosPrinciple | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold font-sacred bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Sacred Ethos Charter
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          The foundational doctrine that guides every aspect of Sacred Shifter's architecture and experience
        </p>
      </motion.div>

      {/* Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ethosPrinciples.map((principle, index) => (
          <motion.div
            key={principle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 h-full ${principle.bgColor} border hover:shadow-lg hover:shadow-primary/20`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <principle.icon className={`h-8 w-8 ${principle.color}`} />
                      <div className="text-xs font-bold text-muted-foreground">0{principle.id}</div>
                    </div>
                    <CardTitle className="text-lg font-sacred">{principle.title}</CardTitle>
                    <div className={`text-sm font-medium ${principle.color}`}>{principle.subtitle}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {principle.description}
                    </p>
                    <div className="flex items-center text-xs text-primary font-medium">
                      <span>Explore Principle</span>
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-2xl">
                    <principle.icon className={`h-6 w-6 ${principle.color}`} />
                    {principle.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${principle.bgColor} ${principle.color}`}>
                    {principle.subtitle}
                  </div>
                  <p className="text-lg leading-relaxed text-foreground">
                    {principle.fullContent}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </div>

      {/* Closing Statement */}
      <motion.div 
        className="text-center mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <Card className="sacred-card max-w-3xl mx-auto">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-12 w-12 text-primary" />
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold font-sacred text-primary">
                Sacred Shifter exists to awaken coherence.
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                It is both mirror and amplifier — an operating system for Truth, resonance, and awe.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};