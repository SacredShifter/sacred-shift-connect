import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Volume2, 
  VolumeX, 
  Clock, 
  Sparkles,
  X,
  Loader2
} from 'lucide-react';

interface MeditationPractice {
  id: string;
  name: string;
  description: string;
  visualType: string;
  youtubePlaylistId?: string;
  defaultDuration: number;
  guidance: string;
  color: string;
}

interface PracticeSetupProps {
  practice: MeditationPractice;
  duration: number;
  audioPreloaded: boolean;
  visualPreloaded: boolean;
  onStart: () => void;
  onExit?: () => void;
  audioEnabled: boolean;
  onAudioToggle: (enabled: boolean) => void;
  audioVolume: number;
  onVolumeChange: (volume: number) => void;
}

export function PracticeSetup({
  practice,
  duration,
  audioPreloaded,
  visualPreloaded,
  onStart,
  onExit,
  audioEnabled,
  onAudioToggle,
  audioVolume,
  onVolumeChange
}: PracticeSetupProps) {
  const isReady = audioPreloaded && visualPreloaded;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-black/40 backdrop-blur-xl border-white/20 text-white overflow-hidden">
          <CardHeader className="text-center border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8" /> {/* Spacer */}
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${practice.color} flex items-center justify-center`}>
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              {onExit && (
                <Button variant="ghost" size="sm" onClick={onExit} className="text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            
            <CardTitle className="text-2xl font-light text-white">
              {practice.name}
            </CardTitle>
            <p className="text-white/70 mt-2">{practice.description}</p>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge variant="secondary" className="bg-white/10 text-white">
                <Clock className="h-3 w-3 mr-1" />
                {duration} minutes
              </Badge>
              {practice.youtubePlaylistId && (
                <Badge variant="secondary" className="bg-white/10 text-white">
                  🎵 Sacred Soundscape
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Practice Guidance */}
            <div className="text-center">
              <p className="text-white/80 italic">"{practice.guidance}"</p>
            </div>

            {/* Loading Status */}
            {!isReady && (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-white/60">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Preparing sacred space...</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Audio Resources</span>
                    <span className={audioPreloaded ? "text-green-400" : "text-white/40"}>
                      {audioPreloaded ? "✓ Ready" : "Loading..."}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Visual Elements</span>
                    <span className={visualPreloaded ? "text-green-400" : "text-white/40"}>
                      {visualPreloaded ? "✓ Ready" : "Loading..."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Controls */}
            {practice.youtubePlaylistId && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white/80">Audio Settings</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAudioToggle(!audioEnabled)}
                      className="text-white hover:bg-white/10"
                    >
                      {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm text-white/70">
                      {audioEnabled ? 'Audio Enabled' : 'Audio Disabled'}
                    </span>
                  </div>
                  
                  {audioEnabled && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/60">Volume:</span>
                      <Slider
                        value={[audioVolume]}
                        onValueChange={(value) => onVolumeChange(value[0])}
                        max={100}
                        min={0}
                        step={5}
                        className="w-24"
                      />
                      <span className="text-sm text-white/60 min-w-[3rem]">
                        {audioVolume}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preparation Reminders */}
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium text-white/80">Sacred Preparation</h4>
              <ul className="text-sm text-white/60 space-y-1">
                <li>• Find a comfortable, quiet space</li>
                <li>• Sit with spine naturally erect</li>
                <li>• Set intention for your practice</li>
                <li>• Allow yourself to fully receive</li>
              </ul>
            </div>

            {/* Start Button */}
            <div className="text-center pt-4">
              <motion.div
                whileHover={isReady ? { scale: 1.02 } : {}}
                whileTap={isReady ? { scale: 0.98 } : {}}
              >
                <Button
                  onClick={onStart}
                  disabled={!isReady}
                  className={`
                    px-12 py-4 text-lg font-medium rounded-full transition-all duration-300
                    ${isReady 
                      ? 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 text-white' 
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }
                  `}
                >
                  <Play className="h-5 w-5 mr-2" />
                  {isReady ? 'Begin Sacred Practice' : 'Preparing...'}
                </Button>
              </motion.div>
            </div>

            {/* Estimated Time */}
            {isReady && (
              <div className="text-center text-sm text-white/50">
                This session will guide you for {duration} minutes of sacred practice
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}