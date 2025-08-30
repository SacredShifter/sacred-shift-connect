import React, { useState } from 'react';
import { BreathingVisualizer } from '@/components/BreathingVisualizer';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export default function Breath() {
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);

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
        
        {/* Deeper Knowledge Toggle */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setShowDeeperKnowledge(!showDeeperKnowledge)}
            className="gap-2"
          >
            <BookOpen className="w-4 h-4" />
            {showDeeperKnowledge ? 'Hide' : 'Show'} Deeper Knowledge
            {showDeeperKnowledge ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
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