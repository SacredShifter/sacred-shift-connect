import React, { useState } from 'react';
import { SacredJournalInterface } from '@/components/SacredJournalInterface';
import { KarmaJournal } from '@/components/karma/KarmaJournal';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Sparkles, Heart, Scroll } from 'lucide-react';

const Journal = () => {
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sacred" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="sacred" className="flex items-center gap-2">
            <Scroll className="w-4 h-4" />
            Sacred Journal
          </TabsTrigger>
          <TabsTrigger value="karma" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Karma Journal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sacred">
          <SacredJournalInterface />
        </TabsContent>
        
        <TabsContent value="karma">
          <KarmaJournal userId={user.id} />
        </TabsContent>
      </Tabs>
      
      {/* Deeper Knowledge Toggle */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-6 max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={() => setShowDeeperKnowledge(!showDeeperKnowledge)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 text-xl gap-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
            size="lg"
          >
            <Sparkles className="w-6 h-6" />
            {showDeeperKnowledge ? 'Hide' : 'Unlock'} Sacred Wisdom
            <BookOpen className="w-6 h-6" />
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Explore the deeper understanding of journaling as a sacred practice for consciousness evolution
          </p>
        </div>
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