import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, BookOpen, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { CodexConstellation } from '@/components/Codex/CodexConstellation';
import { CodexList } from '@/components/Codex/CodexList';
import { CollectiveCodexConstellation } from '@/components/CollectiveAkashicConstellation/CollectiveCodexConstellation';
import { CollectiveCodexList } from '@/components/CollectiveCodex/CollectiveCodexList';
import { useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { SacredInitiationTest } from '@/components/SacredInitiationTest';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';
import { Button } from '@/components/ui/button';

export default function Codex() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);
  const { entries: collectiveEntries } = useRegistryOfResonance();

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Personal Sacred Codex
              </CardTitle>
              <CardDescription>
                Your personal collection of insights, revelations, and wisdom gathered on your journey. 
                Create, organize, and reflect on your spiritual discoveries in both visual constellation and list formats.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Constellation View</h3>
              <div className="min-h-[400px]">
                <CodexConstellation />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">List View</h3>
              <CodexList />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="collective" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Collective Sacred Codex
              </CardTitle>
              <CardDescription>
                Explore and contribute to the shared wisdom of the Sacred Shifter community. Create, edit, 
                and discover collective insights, teachings, and revelations.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Constellation View</h3>
              <div className="min-h-[400px]">
                <CollectiveCodexConstellation 
                  entries={collectiveEntries || []}
                  onEntryClick={(entry) => {
                    console.log('Collective entry clicked:', entry);
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">List View</h3>
              <CollectiveCodexList />
            </div>
          </div>
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