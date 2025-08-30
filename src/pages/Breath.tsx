import React, { useState } from 'react';
import { BreathingVisualizer } from '@/components/BreathingVisualizer';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';
import { Button } from '@/components/ui/button';
import { BridgeMomentNotification } from '@/components/BridgeMomentNotification';
import { BookOpen, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function Breath() {
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);
  const [showBridgeNotification, setShowBridgeNotification] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Breath of Source
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sacred breathing practices for transformation, healing, and consciousness expansion.
          </p>
        </div>
        
        <BreathingVisualizer />
        
        {/* Bridge Moment Notification */}
        <BridgeMomentNotification 
          isVisible={showBridgeNotification} 
          currentModule="breath"
          onDismiss={() => setShowBridgeNotification(false)} 
        />
        
        {/* Deeper Knowledge Toggle */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 max-w-2xl mx-auto text-center">
            <Button
              variant="outline"
              onClick={() => setShowDeeperKnowledge(!showDeeperKnowledge)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 text-xl gap-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
              size="lg"
            >
              <Sparkles className="w-6 h-6" />
              {showDeeperKnowledge ? 'Hide' : 'Unlock'} Sacred Wisdom
              <BookOpen className="w-6 h-6" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Discover the deeper spiritual, metaphysical, and esoteric understanding of breathwork
            </p>
          </div>
        </div>

        {/* Teaching Layer */}
        {showDeeperKnowledge && (
          <div className="mt-6">
            <TeachingLayer
              content={ALL_MODULE_TEACHINGS.breath}
              moduleId="breath"
            />
          </div>
        )}
      </div>
    </div>
  );
}