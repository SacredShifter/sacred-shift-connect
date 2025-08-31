/**
 * Cosmic Visualization Legend - Interactive controls and explanations
 */
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Circle, 
  Moon, 
  Sun, 
  HelpCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CosmicVisualizationLegendProps {
  firmamentVisible: boolean;
  shadowDomeVisible: boolean;
  onFirmamentToggle: () => void;
  onShadowDomeToggle: () => void;
  className?: string;
}

export const CosmicVisualizationLegend: React.FC<CosmicVisualizationLegendProps> = ({
  firmamentVisible,
  shadowDomeVisible,
  onFirmamentToggle,
  onShadowDomeToggle,
  className = ''
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Legend Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Visualization</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <HelpCircle className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show/hide cosmic visualization guide</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
          {/* Firmament Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={firmamentVisible ? 'default' : 'outline'}
                  size="sm"
                  onClick={onFirmamentToggle}
                  className="gap-1"
                >
                  {firmamentVisible ? (
                    <ToggleRight className="w-3 h-3" />
                  ) : (
                    <ToggleLeft className="w-3 h-3" />
                  )}
                  <Sun className="w-3 h-3" />
                  <span className="text-xs">Firmament</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle light energy visualization (firmament sphere)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Shadow Dome Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={shadowDomeVisible ? 'default' : 'outline'}
                  size="sm"
                  onClick={onShadowDomeToggle}
                  className="gap-1"
                >
                  {shadowDomeVisible ? (
                    <ToggleRight className="w-3 h-3" />
                  ) : (
                    <ToggleLeft className="w-3 h-3" />
                  )}
                  <Moon className="w-3 h-3" />
                  <span className="text-xs">Shadow</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle shadow integration visualization (shadow dome)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Visual Status Indicators */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            firmamentVisible ? 'bg-amber-500' : 'bg-gray-500'
          }`} />
          <span className={firmamentVisible ? 'text-foreground' : 'text-muted-foreground'}>
            Light Energy
          </span>
          {firmamentVisible && <Badge variant="outline" className="text-xs">ON</Badge>}
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            shadowDomeVisible ? 'bg-purple-500' : 'bg-gray-500'
          }`} />
          <span className={shadowDomeVisible ? 'text-foreground' : 'text-muted-foreground'}>
            Shadow Work
          </span>
          {shadowDomeVisible && <Badge variant="outline" className="text-xs">ON</Badge>}
        </div>
      </div>

      {/* Help Panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardContent className="p-3 space-y-3 text-xs">
                <div>
                  <h5 className="font-semibold flex items-center gap-2 mb-2">
                    <Circle className="w-4 h-4 text-primary" />
                    Cosmic Visualization Guide
                  </h5>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Sun className="w-4 h-4 text-amber-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Firmament Sphere</div>
                      <div className="text-muted-foreground">
                        Radius expands with light energy (Lmax). Represents consciousness expansion and illumination.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Moon className="w-4 h-4 text-purple-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Shadow Dome</div>
                      <div className="text-muted-foreground">
                        Opacity tracks dark weight integration. Shows shadow work and subconscious processing.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Circle className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Live Structures</div>
                      <div className="text-muted-foreground">
                        Geometric forms appear based on session data and cosmic alignments in real-time.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t text-muted-foreground">
                  <strong>Performance:</strong> 60+ FPS desktop, 30+ FPS mobile. Camera breath-coupled for immersive experience.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};