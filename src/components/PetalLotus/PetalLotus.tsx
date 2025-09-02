import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PetalGlyph } from './PetalGlyph';
import { CurationHub } from './CurationHub';
import { ContentSource } from '@/hooks/useContentSources';
import { listChannels } from '@/actions/listChannels';
import { AddSourceDialog } from '@/components/ContentManager/AddSourceDialog';
import { Plus, RefreshCw, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type ContentPlatform = 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitter' | 'podcast';

interface PetalLotusProps {
  className?: string;
}

const GOLDEN_RATIO = 1.618;

export const PetalLotus: React.FC<PetalLotusProps> = ({ className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSources = async () => {
      const channelData = await listChannels();
      setSources(channelData);
    };
    fetchSources();
  }, []);

  const petalPositions = useMemo(() => {
    return sources.map((_, index) => {
      const angle = (index * (360 / sources.length));
      const radius = 120 * GOLDEN_RATIO;
      return {
        x: Math.cos(angle * (Math.PI / 180)) * radius,
        y: Math.sin(angle * (Math.PI / 180)) * radius,
      };
    });
  }, [sources.length]);

  const hubActions = [
    {
      icon: Plus,
      label: 'Add Channel',
      onClick: () => setIsAddDialogOpen(true),
    },
    {
      icon: RefreshCw,
      label: 'Sync All',
      onClick: () => toast({ title: 'Sync All (Not Implemented)', description: 'This feature is coming soon.' }),
    },
    {
      icon: Filter,
      label: 'Filter',
      onClick: () => toast({ title: 'Filter (Not Implemented)', description: 'This feature is coming soon.' }),
    },
  ];

  return (
    <>
      <div className={`relative w-full h-96 flex items-center justify-center ${className}`}>
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Central Hub */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <CurationHub
              isExpanded={isExpanded}
              hasSelection={!!selectedSourceId}
              actions={hubActions}
            />
          </motion.div>

          {/* Platform Petals */}
          {sources.map((source, index) => {
            const position = petalPositions[index];
            const isSelected = selectedSourceId === source.id;
            
            return (
              <motion.div
                key={source.id}
                className="absolute top-1/2 left-1/2 cursor-pointer"
                style={{
                  transform: `translate(${position.x - 50}px, ${position.y - 50}px)`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isSelected ? 1.2 : 1,
                  opacity: 1
                }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  type: "spring"
                }}
                whileHover={{ scale: isSelected ? 1.3 : 1.1 }}
                onClick={() => setSelectedSourceId(isSelected ? undefined : source.id)}
              >
                <PetalGlyph
                  platform={source.source_type as ContentPlatform}
                  isSelected={isSelected}
                  isActive={source.sync_status === 'active'}
                  syncHealth={0.85} // Placeholder
                  contentCount={0} // Placeholder, to be replaced with real data
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      <AddSourceDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  );
};