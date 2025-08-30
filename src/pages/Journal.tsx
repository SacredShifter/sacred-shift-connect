import React, { useState } from 'react';
import { SacredJournalInterface } from '@/components/SacredJournalInterface';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const Journal = () => {
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);

  return (
    <div className="space-y-6">
      <SacredJournalInterface />
      
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
        <div className="container mx-auto px-4">
          <TeachingLayer
            content={ALL_MODULE_TEACHINGS.journal}
            moduleId="journal"
          />
        </div>
      )}
    </div>
  );
};

export default Journal;