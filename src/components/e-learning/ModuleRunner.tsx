/**
 * E-Learning Module Runner - Enhanced with accessibility features
 */
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AccessibilityAudit } from './AccessibilityAudit';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Settings,
  Eye,
  Ear,
  Type,
  Accessibility
} from 'lucide-react';

interface ModuleContent {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'text' | 'interactive';
  content: string;
  duration?: number;
  transcript?: string;
  alternatives?: {
    audioDescription?: string;
    signLanguage?: string;
    easyRead?: string;
  };
}

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  audioDescriptions: boolean;
  captions: boolean;
  signLanguage: boolean;
  slowMotion: boolean;
  pauseOnFocus: boolean;
}

interface ModuleRunnerProps {
  moduleId: string;
  onComplete?: () => void;
}

export const ModuleRunner: React.FC<ModuleRunnerProps> = ({
  moduleId,
  onComplete
}) => {
  const [currentContent, setCurrentContent] = useState<ModuleContent | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    audioDescriptions: false,
    captions: true,
    signLanguage: false,
    slowMotion: false,
    pauseOnFocus: true
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  useEffect(() => {
    loadModuleContent();
    
    // Load user accessibility preferences
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setAccessibilitySettings(JSON.parse(savedSettings));
    }
  }, [moduleId]);

  useEffect(() => {
    // Save accessibility settings
    localStorage.setItem('accessibility-settings', JSON.stringify(accessibilitySettings));
    
    // Apply accessibility settings to DOM
    applyAccessibilitySettings();
  }, [accessibilitySettings]);

  const loadModuleContent = async () => {
    // Mock module content - in real implementation, fetch from API
    const mockContent: ModuleContent = {
      id: moduleId,
      title: 'Sacred Geometry Fundamentals',
      type: 'video',
      content: '/videos/sacred-geometry-intro.mp4',
      duration: 300, // 5 minutes
      transcript: 'Welcome to Sacred Geometry Fundamentals. In this module, we will explore the divine patterns that underlie all of creation...',
      alternatives: {
        audioDescription: 'A visual journey through geometric patterns begins with a golden spiral emerging from a simple square...',
        easyRead: 'Sacred shapes are special patterns. These patterns are everywhere in nature. We will learn about these shapes.'
      }
    };

    setCurrentContent(mockContent);
  };

  const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    
    // High contrast mode
    if (accessibilitySettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text mode
    if (accessibilitySettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Reduced motion
    if (accessibilitySettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  };

  const togglePlay = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    if (mediaRef.current) {
      mediaRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (mediaRef.current) {
      mediaRef.current.currentTime -= 10;
    }
  };

  const toggleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current && currentContent?.duration) {
      const currentProgress = (mediaRef.current.currentTime / currentContent.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const toggleAccessibilitySetting = (setting: keyof AccessibilitySettings) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  if (!currentContent) {
    return <div>Loading module...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Accessibility Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Accessibility Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant={accessibilitySettings.highContrast ? "default" : "outline"}
              size="sm"
              onClick={() => toggleAccessibilitySetting('highContrast')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              High Contrast
            </Button>
            
            <Button
              variant={accessibilitySettings.largeText ? "default" : "outline"}
              size="sm"
              onClick={() => toggleAccessibilitySetting('largeText')}
              className="flex items-center gap-2"
            >
              <Type className="h-4 w-4" />
              Large Text
            </Button>
            
            <Button
              variant={accessibilitySettings.captions ? "default" : "outline"}
              size="sm"
              onClick={() => toggleAccessibilitySetting('captions')}
              className="flex items-center gap-2"
            >
              <Ear className="h-4 w-4" />
              Captions
            </Button>
            
            <Button
              variant={accessibilitySettings.audioDescriptions ? "default" : "outline"}
              size="sm"
              onClick={() => toggleAccessibilitySetting('audioDescriptions')}
              className="flex items-center gap-2"
            >
              <Volume2 className="h-4 w-4" />
              Audio Descriptions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{currentContent.title}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAudit(!showAudit)}
              >
                <Settings className="h-4 w-4" />
                Audit
              </Button>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>

        <CardContent>
          <div ref={contentRef} className="space-y-4">
            {currentContent.type === 'video' && (
              <div className="relative">
                <video
                  ref={mediaRef as React.RefObject<HTMLVideoElement>}
                  src={currentContent.content}
                  className="w-full rounded-lg"
                  onTimeUpdate={handleTimeUpdate}
                  crossOrigin="anonymous"
                >
                  {accessibilitySettings.captions && (
                    <track
                      kind="captions"
                      src="/captions/sacred-geometry-en.vtt"
                      srcLang="en"
                      default
                    />
                  )}
                  {accessibilitySettings.audioDescriptions && (
                    <track
                      kind="descriptions"
                      src="/descriptions/sacred-geometry-en.vtt"
                      srcLang="en"
                    />
                  )}
                </video>

                {/* Custom Media Controls */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Button variant="outline" size="icon" onClick={skipBackward}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button size="icon" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button variant="outline" size="icon" onClick={skipForward}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            {/* Transcript */}
            {currentContent.transcript && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm ${accessibilitySettings.largeText ? 'text-base' : ''}`}>
                    {currentContent.transcript}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Alternative Formats */}
            {currentContent.alternatives && (
              <div className="space-y-4">
                {accessibilitySettings.audioDescriptions && currentContent.alternatives.audioDescription && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Audio Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {currentContent.alternatives.audioDescription}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {currentContent.alternatives.easyRead && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Easy Read Version</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        {currentContent.alternatives.easyRead}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Audit */}
      {showAudit && <AccessibilityAudit />}

      {/* Completion */}
      {progress >= 95 && (
        <Card>
          <CardContent className="text-center py-6">
            <Badge variant="default" className="mb-4">Module Complete!</Badge>
            <p className="text-sm text-muted-foreground mb-4">
              Congratulations on completing this learning module.
            </p>
            <Button onClick={onComplete}>
              Continue to Next Module
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};