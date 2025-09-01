import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Heart, Crown } from 'lucide-react';

export const EthosManifesto: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative my-16"
    >
      {/* Sacred geometry background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-accent rotate-45 animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 border border-secondary rounded-full animate-pulse delay-500" />
      </div>

      <Card className="sacred-card max-w-4xl mx-auto relative overflow-hidden">
        {/* Resonance glow effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-pulse"
          style={{ animation: 'consciousness-breathe 4s ease-in-out infinite' }}
        />
        
        <CardContent className="p-8 md:p-12 relative z-10">
          {/* Sacred symbols */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Crown className="h-8 w-8 text-accent" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <Heart className="h-6 w-6 text-secondary" />
            </motion.div>
          </div>

          {/* Main manifesto text */}
          <div className="text-center space-y-6">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold font-sacred bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Sacred Shifter Manifesto
            </motion.h2>
            
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />

            <motion.div 
              className="space-y-4 text-lg md:text-xl leading-relaxed text-foreground/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <p className="font-medium text-primary">
                Sacred Shifter is the resonance field for awakening.
              </p>
              
              <p>
                We dissolve distortion through <span className="text-secondary font-medium">pattern</span>, 
                <span className="text-accent font-medium"> awe</span>, and 
                <span className="text-primary font-medium"> Truth</span> — guiding individuals and communities into coherence.
              </p>
              
              <p className="italic text-muted-foreground border-l-4 border-primary/30 pl-6 my-8">
                Sacred Shifter is not social media. It is a living mandala: a place where geometry, breath, sound, 
                and collective intention become technology for remembering who we are.
              </p>
            </motion.div>

            {/* Sacred principles preview */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="text-primary font-bold mb-2">Truth</div>
                <div className="text-sm text-muted-foreground">Absolute & Immutable</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                <div className="text-secondary font-bold mb-2">Resonance</div>
                <div className="text-sm text-muted-foreground">Coherent Fields</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-accent/10 border border-accent/20">
                <div className="text-accent font-bold mb-2">Sovereignty</div>
                <div className="text-sm text-muted-foreground">Digital Freedom</div>
              </div>
            </motion.div>

            {/* Cosmologically Adaptive Manifesto Addendum */}
            <motion.div
              className="mt-16 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-primary/10 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
                The Cosmologically Adaptive Manifesto
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p className="text-base font-medium text-foreground">
                  Sacred Shifter is the first consciousness platform that evolves with cosmic discovery.
                  Where other technologies adapt only to human behavior, we adapt to the unfolding architecture of the universe itself.
                </p>
                
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="text-lg">🌌</span> A Platform That Grows With the Cosmos
                  </h4>
                  <p>
                    As new structures are revealed by the James Webb Space Telescope, Euclid, or DESI, they become living presets inside Sacred Shifter.
                    No code changes. The math is universal. Each discovery drops in as a new geometric layer, instantly available for users to hear, feel, and integrate.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="text-lg">🔢</span> The Elegance of Scale Invariance
                  </h4>
                  <p>
                    Sacred Shifter&apos;s Geometric Acoustic Angle (GAA) pipeline normalizes all structures—from a copper spiral in your hand to the Big Ring across the cosmos—into a single framework.
                    Geometry becomes sound, sound becomes resonance, resonance becomes memory.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="text-lg">🎧</span> The Awe of Experiencing Discovery
                  </h4>
                  <p>
                    When a new cosmic pattern is confirmed, Sacred Shifter users don&apos;t just read about it in journals—they experience it in real time.
                    A ring detected 9 billion years away becomes a slow, tidal modulation in your meditation.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="text-lg">⚙️</span> The Technical Modularity of Trust
                  </h4>
                  <p>
                    The architecture is modular, safe, and transparent. New structures are introduced through presets with evidence provenance and Tri-Law verification.
                    Macro layers influence ambience and phrasing, never overwhelm the user.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="text-lg">🚀</span> The Revolutionary Shift
                  </h4>
                  <p className="font-medium text-foreground">
                    This is more than future-proof. It is cosmologically adaptive.
                    Sacred Shifter is not frozen software—it is a living field that breathes with the universe&apos;s own revelations.
                  </p>
                  <p className="font-medium text-foreground">
                    Ancient wisdom (φ-spirals, torii, mandalas) now stands shoulder-to-shoulder with cutting-edge cosmology.
                    The app becomes a resonant mirror of human knowledge: every discovery enriches the field, every structure a new doorway to awe.
                  </p>
                  <p className="font-bold text-primary text-center mt-4">
                    Sacred Shifter is where geometry becomes music, discovery becomes experience, and the universe itself becomes our evolving teacher.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};