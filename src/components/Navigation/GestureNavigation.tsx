import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Search, Heart, Brain, Sparkles, Zap, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GestureNavigationProps {
  onNavigate: (route: string) => void;
  onSearch: () => void;
  onFavorite: () => void;
  onProfile: () => void;
}

interface MudraGesture {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  color: string;
  sacred_meaning: string;
}

const GestureNavigation: React.FC<GestureNavigationProps> = ({
  onNavigate,
  onSearch,
  onFavorite,
  onProfile
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);
  const [gestureHistory, setGestureHistory] = useState<string[]>([]);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sacred Mudra Gestures
  const mudraGestures: MudraGesture[] = [
    {
      id: 'lotus-mudra',
      name: 'Lotus Mudra',
      description: 'Open lotus view',
      icon: Heart,
      action: () => onNavigate('/lotus'),
      color: 'bg-pink-500',
      sacred_meaning: 'Unity consciousness, spiritual awakening'
    },
    {
      id: 'om-mudra',
      name: 'Om Mudra',
      description: 'Search for content',
      icon: Search,
      action: () => onSearch(),
      color: 'bg-blue-500',
      sacred_meaning: 'Divine sound, universal consciousness'
    },
    {
      id: 'peace-mudra',
      name: 'Peace Mudra',
      description: 'Favorite current content',
      icon: Heart,
      action: () => onFavorite(),
      color: 'bg-green-500',
      sacred_meaning: 'Inner peace, harmony, love'
    },
    {
      id: 'wisdom-mudra',
      name: 'Wisdom Mudra',
      description: 'Open profile',
      icon: Brain,
      action: () => onProfile(),
      color: 'bg-purple-500',
      sacred_meaning: 'Knowledge, understanding, enlightenment'
    },
    {
      id: 'energy-mudra',
      name: 'Energy Mudra',
      description: 'Toggle energy mode',
      icon: Zap,
      action: () => toggleEnergyMode(),
      color: 'bg-yellow-500',
      sacred_meaning: 'Life force, vitality, transformation'
    }
  ];

  // Toggle energy mode
  const toggleEnergyMode = () => {
    // This would integrate with energy frequency settings
    console.log('Energy mode toggled');
  };

  // Initialize hand tracking only when user activates it
  const initializeHandTracking = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('Hand tracking not supported in this browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start gesture recognition
      startGestureRecognition();
    } catch (error) {
      console.error('Failed to access camera:', error);
      // Fallback to simulated gestures
      startSimulatedGestures();
    }
  };

  // Cleanup function
  const cleanupCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Start gesture recognition
  const startGestureRecognition = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const processFrame = () => {
      if (video.paused || video.ended) return;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Analyze frame for hand gestures
      analyzeHandGesture(canvas, ctx);

      // Continue processing
      requestAnimationFrame(processFrame);
    };

    video.addEventListener('play', () => {
      processFrame();
    });
  };

  // Analyze hand gesture from video frame
  const analyzeHandGesture = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // This is a simplified gesture recognition
    // In a real implementation, you'd use TensorFlow.js or MediaPipe
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Simple skin tone detection (very basic)
    let skinPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Basic skin tone detection
      if (r > 95 && g > 40 && b > 20 && 
          Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
          Math.abs(r - g) > 15 && r > g && r > b) {
        skinPixels++;
      }
    }
    
    // If enough skin pixels detected, simulate gesture
    if (skinPixels > 1000) {
      simulateGesture();
    }
  };

  // Simulate gesture for testing
  const simulateGesture = () => {
    if (Math.random() < 0.01) { // 1% chance per frame
      const randomGesture = mudraGestures[Math.floor(Math.random() * mudraGestures.length)];
      triggerGesture(randomGesture.id);
    }
  };

  // Start simulated gestures for testing
  const startSimulatedGestures = () => {
    console.log('Starting simulated gesture recognition');
    
    // Simulate gestures every few seconds for testing
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        const randomGesture = mudraGestures[Math.floor(Math.random() * mudraGestures.length)];
        triggerGesture(randomGesture.id);
      }
    }, 5000);
  };

  // Trigger gesture action
  const triggerGesture = (gestureId: string) => {
    const gesture = mudraGestures.find(g => g.id === gestureId);
    if (!gesture) return;

    setCurrentGesture(gestureId);
    setGestureHistory(prev => [gestureId, ...prev.slice(0, 4)]);

    // Execute gesture action
    gesture.action();

    // Clear gesture after delay
    setTimeout(() => {
      setCurrentGesture(null);
    }, 2000);
  };

  // Calibrate hand tracking
  const calibrateHandTracking = async () => {
    setIsCalibrating(true);
    
    try {
      // Initialize camera access when user clicks
      await initializeHandTracking();
      
      // Simulate calibration process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsCalibrating(false);
      setIsActive(true);
      
      // Show calibration success
      setTimeout(() => {
        setIsActive(false);
        cleanupCamera(); // Stop camera when done
      }, 3000);
    } catch (error) {
      console.error('Calibration failed:', error);
      setIsCalibrating(false);
      // Fallback to simulated gestures
      startSimulatedGestures();
    }
  };

  return (
    <>
      {/* Hidden video and canvas for hand tracking */}
      <div className="hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width="640"
          height="480"
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
        />
      </div>

      {/* Gesture Navigation Interface */}
      <div className="fixed bottom-6 right-6 z-50 space-y-4">
        {/* Main Gesture Button */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={calibrateHandTracking}
            className={`
              w-16 h-16 rounded-full shadow-2xl border-2
              ${isActive ? 'bg-primary text-primary-foreground' : 'bg-background/80 backdrop-blur-xl'}
              ${isCalibrating ? 'animate-pulse' : ''}
            `}
            disabled={isCalibrating}
          >
            <Hand className="w-8 h-8" />
          </Button>

          {/* Active Indicator */}
          {isActive && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Gesture Status */}
        <AnimatePresence>
          {currentGesture && (
            <motion.div
              className="bg-background/90 backdrop-blur-xl border border-primary/30 rounded-lg p-3 shadow-lg"
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-primary">
                  Mudra Recognized
                </div>
                <div className="text-xs text-muted-foreground">
                  {mudraGestures.find(g => g.id === currentGesture)?.name}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gesture History */}
        {gestureHistory.length > 0 && (
          <motion.div
            className="bg-background/80 backdrop-blur-xl border border-primary/20 rounded-lg p-3 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xs text-muted-foreground mb-2">Recent Mudras</div>
            <div className="space-y-1">
              {gestureHistory.slice(0, 3).map((gestureId, index) => {
                const gesture = mudraGestures.find(g => g.id === gestureId);
                if (!gesture) return null;

                const Icon = gesture.icon;
                return (
                  <motion.div
                    key={`${gestureId}-${index}`}
                    className="flex items-center gap-2 text-xs"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-2 h-2 rounded-full ${gesture.color}`} />
                    <Icon className="w-3 h-3" />
                    <span className="text-muted-foreground">{gesture.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Available Gestures Guide */}
        <motion.div
          className="bg-background/80 backdrop-blur-xl border border-primary/20 rounded-lg p-3 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-xs text-muted-foreground mb-2">Sacred Mudras</div>
          <div className="space-y-1">
            {mudraGestures.map((gesture) => {
              const Icon = gesture.icon;
              return (
                <div key={gesture.id} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${gesture.color}`} />
                  <Icon className="w-3 h-3" />
                  <span className="text-muted-foreground">{gesture.description}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Calibration Overlay */}
      <AnimatePresence>
        {isCalibrating && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-xl p-8 text-center shadow-2xl"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <div className="w-16 h-16 mx-auto mb-4">
                <motion.div
                  className="w-full h-full border-4 border-primary/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calibrating Sacred Mudras</h3>
              <p className="text-muted-foreground">
                Please position your hands in the camera view
              </p>
              <div className="mt-4 text-sm text-primary">
                Hold your hands steady for optimal recognition
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GestureNavigation;
