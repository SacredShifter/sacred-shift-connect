import React, { useState } from 'react';
import { ConsciousnessConstellationMapper } from '@/components/ConsciousnessConstellationMapper';
import ProtectedRoute from '@/components/ProtectedRoute';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { BridgeMomentNotification } from '@/components/BridgeMomentNotification';

export default function ConstellationMapper() {
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);
  const [bridgeTrigger, setBridgeTrigger] = useState<string | undefined>();

  // Simulate bridge moment trigger when constellation is updated
  const handleConstellationUpdate = () => {
    setBridgeTrigger('constellation_update');
    setTimeout(() => setBridgeTrigger(undefined), 15000); // Clear after 15 seconds
  };

  return (
    <ProtectedRoute>
      <div className="h-full p-6 space-y-6">
        <div className="max-w-7xl mx-auto">
          <ConsciousnessConstellationMapper />
        </div>

        {/* Bridge Moment Notification */}
        <BridgeMomentNotification 
          isVisible={true} 
          currentModule="constellation"
          onDismiss={() => {}} 
        />

        {/* Deeper Knowledge Section */}
        <div className="text-center max-w-7xl mx-auto">
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
          <div className="max-w-7xl mx-auto">
            <TeachingLayer
              content={ALL_MODULE_TEACHINGS.constellation}
              moduleId="constellation"
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}