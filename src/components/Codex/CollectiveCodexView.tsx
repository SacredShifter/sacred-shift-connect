import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Star, List } from 'lucide-react';
import { CollectiveCodexConstellation } from '@/components/CollectiveAkashicConstellation/CollectiveCodexConstellation';
import { CollectiveCodexList } from '@/components/CollectiveCodex/CollectiveCodexList';
import { useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';

type ViewMode = 'constellation' | 'list';

export const CollectiveCodexView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('constellation');
  const { entries: collectiveEntries } = useRegistryOfResonance();

  const renderContent = () => {
    switch (viewMode) {
      case 'constellation':
        return (
          <div className="min-h-[500px]">
            <CollectiveCodexConstellation 
              entries={collectiveEntries || []}
              onEntryClick={(entry) => {
                console.log('Collective entry clicked:', entry);
              }}
            />
          </div>
        );
      case 'list':
        return <CollectiveCodexList />;
      default:
        return (
          <CollectiveCodexConstellation 
            entries={collectiveEntries || []}
            onEntryClick={(entry) => {
              console.log('Collective entry clicked:', entry);
            }}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
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

      {/* View Mode Selector */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={viewMode === 'constellation' ? 'default' : 'outline'}
          onClick={() => setViewMode('constellation')}
          size="sm"
          className="gap-2"
        >
          <Star className="h-4 w-4" />
          Constellation
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          onClick={() => setViewMode('list')}
          size="sm"
          className="gap-2"
        >
          <List className="h-4 w-4" />
          List
        </Button>
      </div>

      {/* Content Area */}
      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  );
};