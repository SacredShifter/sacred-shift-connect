import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, BookOpen, Sparkles } from 'lucide-react';
import { CodexConstellation } from '@/components/Codex/CodexConstellation';
import { CodexList } from '@/components/Codex/CodexList';
import { CollectiveCodexConstellation } from '@/components/CollectiveAkashicConstellation/CollectiveCodexConstellation';

export default function Codex() {
  const [activeTab, setActiveTab] = useState('personal');

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
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Codex
          </TabsTrigger>
          <TabsTrigger value="collective" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Collective Codex
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
                Explore the shared wisdom of the Sacred Shifter community. Discover insights, teachings, 
                and revelations contributed by fellow travelers on the path of awakening.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="min-h-[600px]">
            <CollectiveCodexConstellation 
              entries={[]}
              onEntryClick={() => {}}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}