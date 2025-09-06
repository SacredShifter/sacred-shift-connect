import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Heart, 
  Activity, 
  Wind, 
  CheckCircle,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

interface BiometricData {
  pulse: number;
  hrv: number;
  breathingRate: number;
  confidence: number;
  timestamp: Date;
}

interface BiometricScannerProps {
  onComplete: (data: BiometricData) => void;
  onCancel: () => void;
  scanDuration?: number;
}

export const BiometricScanner: React.FC<BiometricScannerProps> = ({
  onComplete,
  onCancel,
  scanDuration = 30
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentData, setCurrentData] = useState<Partial<BiometricData>>({});
  const [scanMode, setScanMode] = useState<'finger' | 'face'>('finger');
  const [error, setError] = useState<string | null>(null);

  // Simulate biometric data collection
  const simulateBiometricCapture = useCallback(() => {
    if (!isScanning) return;

    const elapsed = (scanDuration - (scanDuration * (1 - progress / 100))) * 1000;
    const timeElapsed = elapsed / 1000;

    // Simulate realistic biometric readings
    const basePulse = 65 + Math.sin(timeElapsed * 0.1) * 10 + Math.random() * 5;
    const baseHRV = 45 + Math.sin(timeElapsed * 0.05) * 15 + Math.random() * 8;
    const baseBreathing = 12 + Math.sin(timeElapsed * 0.08) * 3 + Math.random() * 2;

    setCurrentData({
      pulse: Math.round(basePulse),
      hrv: Math.round(baseHRV),
      breathingRate: Math.round(baseBreathing * 10) / 10,
      confidence: Math.min(95, 60 + (progress / 100) * 35),
      timestamp: new Date()
    });
  }, [isScanning, progress, scanDuration]);

  // Start camera stream
  const startCamera = async () => {
    try {
      setError(null);
      const constraints = {
        video: {
          facingMode: scanMode === 'finger' ? 'environment' : 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please allow camera access and try again.');
    }
  };

  // Start biometric scan
  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setCurrentData({});
  };

  // Stop scan and process results
  const stopScan = () => {
    setIsScanning(false);
    if (currentData.pulse && currentData.hrv && currentData.breathingRate) {
      onComplete(currentData as BiometricData);
    }
  };

  // Animation loop for progress and data simulation
  useEffect(() => {
    if (isScanning) {
      const animate = () => {
        setProgress(prev => {
          const newProgress = prev + (100 / (scanDuration * 60)); // 60fps
          if (newProgress >= 100) {
            stopScan();
            return 100;
          }
          return newProgress;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScanning, scanDuration]);

  // Simulate data collection during scan
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(simulateBiometricCapture, 100);
      return () => clearInterval(interval);
    }
  }, [isScanning, simulateBiometricCapture]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Camera Preview */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Biometric Capture
            </CardTitle>
            <Badge variant={scanMode === 'finger' ? 'default' : 'secondary'}>
              {scanMode === 'finger' ? 'Finger Scan' : 'Face Scan'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera Feed */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full opacity-0"
            />
            
            {/* Scanning Overlay */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Pulsing Circle */}
                  <motion.div
                    className="w-32 h-32 border-4 border-primary rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Center Dot */}
                  <div className="absolute w-4 h-4 bg-primary rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instructions */}
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white space-y-2">
                  <div className="text-lg font-semibold">
                    {scanMode === 'finger' 
                      ? 'Place fingertip on camera' 
                      : 'Look at the camera'
                    }
                  </div>
                  <div className="text-sm opacity-80">
                    {scanMode === 'finger' 
                      ? 'Cover the camera lens with your fingertip' 
                      : 'Keep your face centered and still'
                    }
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={scanMode === 'finger' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScanMode('finger')}
              className="flex-1"
            >
              <Activity className="h-4 w-4 mr-2" />
              Finger Scan
            </Button>
            <Button
              variant={scanMode === 'face' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScanMode('face')}
              className="flex-1"
            >
              <Wind className="h-4 w-4 mr-2" />
              Face Scan
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress and Data */}
      {isScanning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Scanning in progress...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Live Data */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                  <Heart className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-lg font-bold text-blue-600">
                    {currentData.pulse || '--'} bpm
                  </div>
                  <div className="text-xs text-muted-foreground">Pulse</div>
                </div>
                <div className="text-center p-3 bg-green-500/10 rounded-lg">
                  <Activity className="h-5 w-5 mx-auto mb-1 text-green-600" />
                  <div className="text-lg font-bold text-green-600">
                    {currentData.hrv || '--'}
                  </div>
                  <div className="text-xs text-muted-foreground">HRV Index</div>
                </div>
              </div>

              {/* Confidence */}
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Confidence</div>
                <div className="text-lg font-semibold">
                  {Math.round(currentData.confidence || 0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!isScanning ? (
          <>
            <Button onClick={startCamera} className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
            <Button onClick={startScan} disabled={!streamRef.current} className="flex-1">
              <Activity className="h-4 w-4 mr-2" />
              Begin Scan
            </Button>
          </>
        ) : (
          <Button onClick={stopScan} variant="destructive" className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Scan
          </Button>
        )}
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
};
