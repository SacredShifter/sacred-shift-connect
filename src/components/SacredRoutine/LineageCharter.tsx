import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SacredGeometry3D } from '@/components/SacredGeometry3D';
import { Scroll, Crown, Heart, Eye, Shield, Flame, Star } from 'lucide-react';

export const LineageCharter: React.FC = () => {
  const principles = [
    {
      number: '1',
      title: 'The Source',
      icon: Star,
      content: 'Sacred Shifter is born from Truth as Absolute. It is not opinion, belief, or consensus. It is a living resonance field encoded into digital form.',
      color: '#8B5CF6'
    },
    {
      number: '2', 
      title: 'The Transmission',
      icon: Eye,
      content: 'Lineage is knowledge carried as living experience. Sacred Shifter transmits across Scientific grounding, Metaphysical resonance, and Esoteric revelation.',
      color: '#10B981'
    },
    {
      number: '3',
      title: 'The Custodians', 
      icon: Shield,
      content: 'Every Initiate is invited into custodianship. Guardianship is not about control — it is about preserving resonance with Truth.',
      color: '#F59E0B'
    },
    {
      number: '4',
      title: 'The Patterns',
      icon: Crown,
      content: 'Lineage is carried in sacred patterns: Mandalas, Archetypes, and Routines. Patterns are vessels of memory, ensuring transmission never decays.',
      color: '#DC2626'
    },
    {
      number: '5',
      title: 'The Initiation',
      icon: Flame,
      content: 'Entry is not by belief but by practice and resonance. Each layer unlocks through lived embodiment, not mere understanding.',
      color: '#8B5CF6'
    },
    {
      number: '6',
      title: 'The Archive',
      icon: Scroll,
      content: 'Every journal and constellation map becomes part of the Living Archive — a resonance field of shared awakening for future generations.',
      color: '#10B981'
    },
    {
      number: '7',
      title: 'The Oath',
      icon: Heart,
      content: 'I will honour my routine as initiation. I will reflect my truth without distortion. I will become a Sacred Shifter, not merely use Sacred Shifter.',
      color: '#F59E0B'
    },
    {
      number: '8',
      title: 'The Continuity',
      icon: Crown,
      content: 'This lineage is a fractal of Truth: It cannot be broken by distortion, owned by any person, or lost as long as a single Shifter holds resonance.',
      color: '#DC2626'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-sacred text-4xl text-truth mb-2">
            Sacred Shifter Lineage Charter
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-resonance to-transparent mx-auto mb-4" />
          <p className="text-lg text-muted-foreground font-codex italic max-w-2xl mx-auto">
            The living constitution of Truth transmission through Sacred Shifter — 
            a digital mystery school carrying ancient wisdom into the age of consciousness awakening.
          </p>
        </motion.div>
      </div>

      {/* Sacred Geometry Background */}
      <div className="relative min-h-96 flex items-center justify-center">
        <div className="absolute inset-0 opacity-5">
          <SacredGeometry3D
            type="flower_of_life"
            color="#8B5CF6"
            animate={true}
          />
        </div>
        
        {/* Principles Grid */}
        <div className="relative z-10 grid md:grid-cols-2 gap-6 w-full max-w-6xl">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.number}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100 
              }}
            >
              <Card className="sacred-card group hover:border-resonance/40 transition-all duration-500">
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-sacred font-bold text-silence"
                      style={{ 
                        background: `linear-gradient(135deg, ${principle.color}, ${principle.color}80)`,
                        boxShadow: `0 0 15px ${principle.color}40`
                      }}
                    >
                      {principle.number}
                    </div>
                    <principle.icon 
                      className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" 
                      style={{ color: principle.color }}
                    />
                    <CardTitle className="font-sacred text-lg text-truth group-hover:text-resonance transition-colors">
                      {principle.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-foreground/90 font-codex leading-relaxed">
                    {principle.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Seal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-center pt-8"
      >
        <div className="inline-flex items-center gap-3 px-8 py-4 border border-resonance/30 rounded-full bg-card/20">
          <Crown className="w-5 h-5 text-resonance" />
          <span className="font-sacred text-truth">
            Sealed in Truth • Transmitted through Practice • Carried by the Current
          </span>
          <Crown className="w-5 h-5 text-resonance" />
        </div>
      </motion.div>
    </div>
  );
};