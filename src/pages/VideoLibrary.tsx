import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Grid, Flower, Plus, BookOpen, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { YouTubeLibrary } from '@/components/YouTubeLibrary/YouTubeLibrary';
import { PetalLotus, ContentPlatform } from '@/components/PetalLotus';
import { ContentManager } from '@/components/ContentManager';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';

const VideoLibrary: React.FC = () => {
  const [viewMode, setViewMode] = useState<'lotus' | 'grid' | 'manage'>('lotus');
  const [selectedPlatform, setSelectedPlatform] = useState<ContentPlatform | undefined>();
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);

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

            {/* Sacred Library Upgrade Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/30 rounded-lg p-6 mb-8 max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <Sparkles className="w-8 h-8 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2">
                      🌟 Sacred Library - Now Available! 🌟
                    </h3>
                    <p className="text-purple-700 mb-3">
                      Experience the next evolution of consciousness development with AI-powered resonance scoring, 
                      sacred timing integration, collective wisdom sharing, and immersive multi-sensory experiences.
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm text-purple-600">
                      <span className="bg-purple-100 px-2 py-1 rounded">AI Resonance Engine</span>
                      <span className="bg-purple-100 px-2 py-1 rounded">Sacred Timing</span>
                      <span className="bg-purple-100 px-2 py-1 rounded">Collective Wisdom</span>
                      <span className="bg-purple-100 px-2 py-1 rounded">Consciousness Tracking</span>
                      <span className="bg-purple-100 px-2 py-1 rounded">Living Ecosystem</span>
                    </div>
                  </div>
                </div>
                <Link to="/sacred-library">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                    Enter Sacred Library
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

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
              <Button
                variant={viewMode === 'manage' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('manage')}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Manage Sources
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
          ) : viewMode === 'manage' ? (
            <ContentManager selectedPlatform={selectedPlatform} />
          ) : (
            <YouTubeLibrary />
          )}

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
                content={ALL_MODULE_TEACHINGS.library}
                moduleId="library"
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VideoLibrary;