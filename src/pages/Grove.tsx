
import React, { useState } from 'react';
import { PageLayout } from '@/components/ui/page-layout';
import SacredGrove from '@/components/SacredGrove/SacredGrove';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const Grove = () => {
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);

  return (
    <PageLayout
      title="Sacred Grove"
      subtitle="A space for collective wisdom and sacred community."
    >
      <div className="space-y-6">
        <SacredGrove />
        
        {/* Deeper Knowledge Toggle */}
        <div className="text-center">
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
          <TeachingLayer
            content={ALL_MODULE_TEACHINGS.grove}
            moduleId="grove"
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Grove;
