import React from 'react';
import { PageLayout } from '@/components/ui/page-layout';
import { EthosManifesto } from '@/components/Sacred/EthosManifesto';
import { EthosCharter } from '@/components/Sacred/EthosCharter';
import { motion } from 'framer-motion';

export default function Ethos() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative">
      {/* Living Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        style={{ animation: 'consciousness-breathe 6s ease-in-out infinite' }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        style={{ animation: 'consciousness-breathe 8s ease-in-out infinite reverse' }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-12 space-y-16">
        {/* Manifesto Section */}
        <EthosManifesto />
        
        {/* Charter Section */}
        <EthosCharter />
        
        {/* Sacred Geometry Footer */}
        <motion.div 
          className="flex justify-center pt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className="flex items-center gap-8 text-muted-foreground/30">
            <div className="w-16 h-16 border border-current rounded-full animate-pulse" />
            <div className="w-12 h-12 border border-current rotate-45 animate-pulse delay-500" />
            <div className="w-20 h-20 border border-current rounded-full animate-pulse delay-1000" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}