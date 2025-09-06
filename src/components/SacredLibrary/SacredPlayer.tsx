import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Heart, Bookmark, Share2, SkipBack, SkipForward } from 'lucide-react';
import { ContentItem } from '@/hooks/useContentSources';
import { ConsciousnessProfile } from '@/types/consciousness';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface SacredPlayerProps {
  content: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  userProfile: ConsciousnessProfile | null;
  onFavorite: (contentId: string) => void;
  onBookmark: (contentId: string) => void;
  onShare: (contentId: string) => void;
  onTrackConsumption: (contentId: string, durationMinutes: number, engagementScore: number) => void;
}

export const SacredPlayer: React.FC<SacredPlayerProps> = ({
  content,
  isOpen,
  onClose,
  userProfile,
  onFavorite,
  onBookmark,
  onShare,
  onTrackConsumption
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [engagementScore, setEngagementScore] = useState(0.5);
  const [breathingRhythm, setBreathingRhythm] = useState<'normal' | 'deep' | 'meditative'>('normal');
  const [energyFrequency, setEnergyFrequency] = useState('528Hz');
  const [sacredGeometry, setSacredGeometry] = useState<'lotus' | 'mandala' | 'spiral' | 'flower'>('lotus');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Breathing rhythm patterns
  const breathingPatterns = {
    normal: { inhale: 4, hold: 2, exhale: 4 },
    deep: { inhale: 6, hold: 3, exhale: 6 },
    meditative: { inhale: 8, hold: 4, exhale: 8 }
  };

  // Energy frequencies
  const frequencies = [
    { freq: '528Hz', name: 'Love Frequency', color: '#FF6B6B' },
    { freq: '432Hz', name: 'Nature\'s Frequency', color: '#4ECDC4' },
    { freq: '741Hz', name: 'Expression Frequency', color: '#45B7D1' },
    { freq: '852Hz', name: 'Intuition Frequency', color: '#96CEB4' }
  ];

  // Sacred geometry patterns
  const geometryPatterns = {
    lotus: { symbol: '🪷', name: 'Sacred Lotus', description: 'Purity and enlightenment' },
    mandala: { symbol: '🌀', name: 'Cosmic Mandala', description: 'Unity and wholeness' },
    spiral: { symbol: '🌊', name: 'Golden Spiral', description: 'Natural growth and evolution' },
    flower: { symbol: '🌸', name: 'Flower of Life', description: 'Sacred geometry and creation' }
  };

  useEffect(() => {
    if (content && isOpen) {
      setCurrentTime(0);
      setDuration(content.duration_seconds || 0);
      setIsPlaying(false);
    }
  }, [content, isOpen]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            setIsPlaying(false);
            // Track consumption when content ends
            if (content) {
              onTrackConsumption(content.id, duration / 60, engagementScore);
            }
            return duration;
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration, content, onTrackConsumption, engagementScore]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
    setShowControls(true);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
    setShowControls(true);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    setShowControls(true);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    setShowControls(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSacredGeometry = () => {
    const pattern = geometryPatterns[sacredGeometry];
    
    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="text-8xl opacity-20">{pattern.symbol}</div>
      </motion.div>
    );
  };

  const renderBreathingGuide = () => {
    const pattern = breathingPatterns[breathingRhythm];
    const cycleDuration = (pattern.inhale + pattern.hold + pattern.exhale) * 1000;
    const progress = (Date.now() % cycleDuration) / cycleDuration;
    
    let phase = 'inhale';
    let phaseProgress = 0;
    
    if (progress < pattern.inhale / (pattern.inhale + pattern.hold + pattern.exhale)) {
      phase = 'inhale';
      phaseProgress = progress / (pattern.inhale / (pattern.inhale + pattern.hold + pattern.exhale));
    } else if (progress < (pattern.inhale + pattern.hold) / (pattern.inhale + pattern.hold + pattern.exhale)) {
      phase = 'hold';
      phaseProgress = (progress - pattern.inhale / (pattern.inhale + pattern.hold + pattern.exhale)) / (pattern.hold / (pattern.inhale + pattern.hold + pattern.exhale));
    } else {
      phase = 'exhale';
      phaseProgress = (progress - (pattern.inhale + pattern.hold) / (pattern.inhale + pattern.hold + pattern.exhale)) / (pattern.exhale / (pattern.inhale + pattern.hold + pattern.exhale));
    }

    return (
      <motion.div
        className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white"
        animate={{
          scale: phase === 'inhale' ? [1, 1.2, 1] : phase === 'hold' ? [1, 1.1, 1] : [1, 0.8, 1]
        }}
        transition={{
          duration: phase === 'inhale' ? pattern.inhale : phase === 'hold' ? pattern.hold : pattern.exhale,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="text-sm font-medium capitalize">{phase}</div>
        <div className="text-xs text-gray-300">
          {pattern.inhale}s in • {pattern.hold}s hold • {pattern.exhale}s out
        </div>
      </motion.div>
    );
  };

  const renderEnergyVisualization = () => {
    const frequency = frequencies.find(f => f.freq === energyFrequency);
    
    return (
      <motion.div
        className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white"
        animate={{
          boxShadow: [
            `0 0 20px ${frequency?.color}40`,
            `0 0 40px ${frequency?.color}60`,
            `0 0 20px ${frequency?.color}40`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="text-sm font-medium">{frequency?.name}</div>
        <div className="text-xs text-gray-300">{energyFrequency}</div>
      </motion.div>
    );
  };

  if (!content || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Sacred Geometry Background */}
        {renderSacredGeometry()}
        
        {/* Breathing Guide */}
        {renderBreathingGuide()}
        
        {/* Energy Visualization */}
        {renderEnergyVisualization()}

        {/* Main Content Area */}
        <div className="relative w-full h-full flex flex-col">
          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center relative">
            <video
              ref={videoRef}
              className="max-w-full max-h-full"
              poster={content.thumbnail_url || undefined}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
            >
              <source src={content.content_url} type="video/mp4" />
            </video>
          </div>

          {/* Controls Overlay */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Top Controls */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="text-white hover:bg-white/20"
                    >
                      ✕
                    </Button>
                    <div className="text-white">
                      <h3 className="font-medium">{content.title}</h3>
                      <p className="text-sm text-gray-300">{content.author_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFavorite(content.id)}
                      className="text-white hover:bg-white/20"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onBookmark(content.id)}
                      className="text-white hover:bg-white/20"
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onShare(content.id)}
                      className="text-white hover:bg-white/20"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="px-4 pb-2">
                  <Slider
                    value={[currentTime]}
                    onValueChange={handleSeek}
                    max={duration}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayPause}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMute}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        max={1}
                        step={0.1}
                        className="w-20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sacred Settings Panel */}
          <motion.div
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h4 className="font-medium mb-3">Sacred Settings</h4>
            
            {/* Breathing Rhythm */}
            <div className="mb-3">
              <label className="text-xs text-gray-300 mb-1 block">Breathing Rhythm</label>
              <select
                value={breathingRhythm}
                onChange={(e) => setBreathingRhythm(e.target.value as any)}
                className="w-full bg-black/50 border border-gray-600 rounded px-2 py-1 text-sm"
              >
                <option value="normal">Normal (4-2-4)</option>
                <option value="deep">Deep (6-3-6)</option>
                <option value="meditative">Meditative (8-4-8)</option>
              </select>
            </div>

            {/* Energy Frequency */}
            <div className="mb-3">
              <label className="text-xs text-gray-300 mb-1 block">Energy Frequency</label>
              <select
                value={energyFrequency}
                onChange={(e) => setEnergyFrequency(e.target.value)}
                className="w-full bg-black/50 border border-gray-600 rounded px-2 py-1 text-sm"
              >
                {frequencies.map(freq => (
                  <option key={freq.freq} value={freq.freq}>{freq.name} ({freq.freq})</option>
                ))}
              </select>
            </div>

            {/* Sacred Geometry */}
            <div className="mb-3">
              <label className="text-xs text-gray-300 mb-1 block">Sacred Geometry</label>
              <select
                value={sacredGeometry}
                onChange={(e) => setSacredGeometry(e.target.value as any)}
                className="w-full bg-black/50 border border-gray-600 rounded px-2 py-1 text-sm"
              >
                {Object.entries(geometryPatterns).map(([key, pattern]) => (
                  <option key={key} value={key}>{pattern.symbol} {pattern.name}</option>
                ))}
              </select>
            </div>

            {/* Engagement Score */}
            <div className="mb-3">
              <label className="text-xs text-gray-300 mb-1 block">Engagement Level</label>
              <Slider
                value={[engagementScore]}
                onValueChange={(value) => setEngagementScore(value[0])}
                max={1}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">
                {Math.round(engagementScore * 100)}% Engaged
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
