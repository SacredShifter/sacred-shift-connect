import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, User, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { SacredInitiationTest } from '@/components/SacredInitiationTest';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';
import { Button } from '@/components/ui/button';
import { PersonalCodexView } from '@/components/Codex/PersonalCodexView';
import { CollectiveCodexView } from '@/components/Codex/CollectiveCodexView';

export default function Codex() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Sacred Codex
        </h1>
        <p className="text-muted-foreground mt-2">
          Your personal repository of insights and the collective wisdom of the community
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Codex
          </TabsTrigger>
          <TabsTrigger value="collective" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Collective Codex
          </TabsTrigger>
          <TabsTrigger value="initiation" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Initiation Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <PersonalCodexView />
        </TabsContent>

        <TabsContent value="collective" className="space-y-6">
          <CollectiveCodexView />
        </TabsContent>

        <TabsContent value="initiation" className="space-y-6">
          <SacredInitiationTest />
        </TabsContent>
      </Tabs>

      {/* Deeper Knowledge Section */}
      <div className="text-center mt-8">
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
            content={ALL_MODULE_TEACHINGS.codex}
            moduleId="codex"
          />
        </div>
      )}
    </div>
  );
}