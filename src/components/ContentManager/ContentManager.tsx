import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AddSourceDialog } from './AddSourceDialog';
import { useContentSources } from '@/hooks/useContentSources';
import { ContentPlatform } from '@/components/PetalLotus';

interface ContentManagerProps {
  selectedPlatform?: ContentPlatform;
}

export const ContentManager: React.FC<ContentManagerProps> = ({ selectedPlatform }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { sources, loading, toggleSource, syncSource } = useContentSources();

  const filteredSources = selectedPlatform 
    ? sources.filter(source => source.platform === selectedPlatform)
    : sources;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Content Sources</h2>
          <p className="text-muted-foreground">
            {selectedPlatform 
              ? `Manage your ${selectedPlatform} content sources`
              : 'Manage content sources from all platforms'
            }
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Source
        </Button>
      </div>

      {/* Sources Grid */}
      <div className="grid gap-4">
        {filteredSources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No content sources</h3>
            <p className="text-muted-foreground mb-4">
              {selectedPlatform 
                ? `Add your first ${selectedPlatform} content source to get started`
                : 'Add your first content source to get started'
              }
            </p>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Source
            </Button>
          </motion.div>
        ) : (
          filteredSources.map((source, index) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${!source.is_active ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <Badge variant={source.platform === 'youtube' ? 'destructive' : 'secondary'}>
                        {source.platform}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={source.is_active}
                        onCheckedChange={(checked) => toggleSource(source.id, checked)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => syncSource(source.id)}
                        disabled={!source.is_active}
                        className="gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Sync
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground truncate">
                      {source.source_url}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Sync: {source.sync_frequency}</span>
                      <span>
                        Last sync: {source.last_sync 
                          ? new Date(source.last_sync).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Source Dialog */}
      <AddSourceDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        defaultPlatform={selectedPlatform}
      />
    </div>
  );
};