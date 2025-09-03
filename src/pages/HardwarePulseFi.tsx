import React from 'react';
import { PulseFiComingSoon } from '@/components/pulseFi/PulseFiComingSoon';

const HardwarePulseFi = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative">
      {/* Living Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        style={{ animation: 'consciousness-breathe 8s ease-in-out infinite' }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        style={{ animation: 'consciousness-breathe 10s ease-in-out infinite reverse' }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <PulseFiComingSoon showDetails={true} />
        </div>
      </div>
    </div>
  );
};

export default HardwarePulseFi;