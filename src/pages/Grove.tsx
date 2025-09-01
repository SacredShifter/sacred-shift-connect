
import React, { useState } from 'react';
import { PageLayout } from '@/components/ui/page-layout';
import SacredGrove from '@/components/SacredGrove/SacredGrove';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

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
          <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-6 max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setShowDeeperKnowledge(!showDeeperKnowledge)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 text-xl gap-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
              size="lg"
            >
              <Sparkles className="w-6 h-6" />
              {showDeeperKnowledge ? 'Hide' : 'Unlock'} Sacred Wisdom
              <BookOpen className="w-6 h-6" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Uncover the deeper mysteries of collective ritual and sacred community gathering
            </p>
          </div>
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
