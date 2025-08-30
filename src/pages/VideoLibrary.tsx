import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Grid, Flower } from 'lucide-react';

import { YouTubeLibrary } from '@/components/YouTubeLibrary/YouTubeLibrary';
import { PetalLotus, ContentPlatform } from '@/components/PetalLotus';

const VideoLibrary: React.FC = () => {
  const [viewMode, setViewMode] = useState<'lotus' | 'grid'>('lotus');
  const [selectedPlatform, setSelectedPlatform] = useState<ContentPlatform | undefined>();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <img 
                src="https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png"
                alt="Sacred Shifter"
                className="h-16 w-auto filter invert brightness-0 contrast-100 opacity-90"
              />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Immerse yourself in our collection of transformative content. 
              Explore guided journeys, resonance science, and consciousness-expanding videos.
            </p>

            {/* View Mode Toggle */}
            <div className="flex justify-center gap-2 mb-8">
              <Button
                variant={viewMode === 'lotus' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('lotus')}
                className="gap-2"
              >
                <Flower className="w-4 h-4" />
                Lotus View
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="gap-2"
              >
                <Grid className="w-4 h-4" />
                Grid View
              </Button>
            </div>
          </motion.div>
          
          {viewMode === 'lotus' ? (
            <div className="space-y-8">
              <PetalLotus
                selectedPlatform={selectedPlatform}
                onPlatformSelect={setSelectedPlatform}
              />
              
              {selectedPlatform && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-muted-foreground"
                >
                  <p>Showing content from {selectedPlatform}</p>
                </motion.div>
              )}
              
              {(!selectedPlatform || selectedPlatform === 'youtube') && (
                <YouTubeLibrary />
              )}
            </div>
          ) : (
            <YouTubeLibrary />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VideoLibrary;