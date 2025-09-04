import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, Grid3X3, List, Table } from 'lucide-react';
import { CodexConstellation } from './CodexConstellation';
import { CodexList } from './CodexList';

type ViewMode = 'constellation' | 'list' | 'table' | 'grid';

export const PersonalCodexView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('constellation');

  const renderContent = () => {
    switch (viewMode) {
      case 'constellation':
        return (
          <div className="min-h-[500px]">
            <CodexConstellation />
          </div>
        );
      case 'list':
      case 'table':
      case 'grid':
        return <CodexList />;
      default:
        return <CodexConstellation />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Personal Sacred Codex
          </CardTitle>
          <CardDescription>
            Your personal collection of insights, revelations, and wisdom gathered on your journey. 
            Create, organize, and reflect on your spiritual discoveries.
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
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          onClick={() => setViewMode('table')}
          size="sm"
          className="gap-2"
        >
          <Table className="h-4 w-4" />
          Table
        </Button>
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          onClick={() => setViewMode('grid')}
          size="sm"
          className="gap-2"
        >
          <Grid3X3 className="h-4 w-4" />
          Grid
        </Button>
      </div>

      {/* Content Area */}
      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  );
};