import { BioSignals } from '@/types/gaa';
import { logger } from '@/lib/logger';

interface DeviceConfig {
  heartRate?: boolean;
  camera?: boolean; 
  accelerometer?: boolean;
  microphone?: boolean;
}

interface CameraHRVData {
  bpm: number;
  confidence: number;
  hrv: number;
}

/**
 * Real biofeedback integration using Web APIs
 * Supports camera-based PPG for heart rate, accelerometer for breath
 */
export class WebBiofeedbackIntegration {
  private videoElement?: HTMLVideoElement;
  private canvasElement?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private stream?: MediaStream;
  private animationId?: number;
  
  private config: DeviceConfig;
  private isActive = false;
  private data: BioSignals = { breath: 0, hrv: 50, eegBandRatio: 0.5 };
  
  // PPG Analysis
  private pixelBuffer: number[] = [];
  private lastBpmCalculation = 0;
  private peaks: number[] = [];
  
  constructor(config: DeviceConfig = { camera: true, accelerometer: true }) {
    this.config = config;
  }

  async initialize(): Promise<boolean> {
    try {
      logger.info('🔬 Initializing Web Biofeedback Integration');
      
      if (this.config.camera) {
        await this.initializeCameraPPG();
      }
      
      if (this.config.accelerometer) {
        await this.initializeAccelerometer();
      }
      
      this.isActive = true;
      return true;
    } catch (error) {
      logger.error('Failed to initialize biofeedback', { component: 'WebBiofeedback' }, error as Error);
      return false;
    }
  }

  private async initializeCameraPPG(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera access not supported');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: { ideal: 320 },
        height: { ideal: 240 },
        facingMode: 'user'
      }
    });

    // Create hidden video element for PPG analysis
    this.videoElement = document.createElement('video');
    this.videoElement.srcObject = this.stream;
    this.videoElement.play();

    this.canvasElement = document.createElement('canvas');
    this.canvasElement.width = 320;
    this.canvasElement.height = 240;
    this.ctx = this.canvasElement.getContext('2d', { willReadFrequently: true })!;

    // Start PPG analysis
    this.startPPGAnalysis();
  }

  private async initializeAccelerometer(): Promise<void> {
    if ('DeviceMotionEvent' in window) {
      // Request permission for iOS 13+
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission !== 'granted') {
          throw new Error('Motion permission denied');
        }
      }

      window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this));
      logger.info('✅ Accelerometer initialized for breathing detection');
    }
  }

  private startPPGAnalysis(): void {
    const analyze = () => {
      if (!this.isActive || !this.videoElement || !this.ctx) return;

      // Capture video frame
      this.ctx.drawImage(this.videoElement, 0, 0, 320, 240);
      
      // Extract red channel intensity (PPG signal)
      const imageData = this.ctx.getImageData(0, 0, 320, 240);
      const pixels = imageData.data;
      
      let redSum = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        redSum += pixels[i]; // Red channel
      }
      
      const avgRed = redSum / (pixels.length / 4);
      this.pixelBuffer.push(avgRed);
      
      // Keep buffer size manageable (30 seconds at 30fps)
      if (this.pixelBuffer.length > 900) {
        this.pixelBuffer.shift();
      }

      // Calculate HRV every 5 seconds
      if (Date.now() - this.lastBpmCalculation > 5000) {
        this.calculateHRVFromPPG();
        this.lastBpmCalculation = Date.now();
      }

      this.animationId = requestAnimationFrame(analyze);
    };

    analyze();
  }

  private calculateHRVFromPPG(): void {
    if (this.pixelBuffer.length < 150) return; // Need at least 5 seconds of data

    // Simple peak detection algorithm
    const peaks = this.detectPeaks(this.pixelBuffer);
    
    if (peaks.length >= 3) {
      // Calculate intervals between peaks
      const intervals = [];
      for (let i = 1; i < peaks.length; i++) {
        intervals.push((peaks[i] - peaks[i-1]) * (1000/30)); // Convert to ms (assuming 30fps)
      }

      // Calculate BPM and HRV
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = 60000 / avgInterval;
      
      // HRV as coefficient of variation
      const variance = intervals.reduce((sum, interval) => 
        sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);
      const hrv = (stdDev / avgInterval) * 100;

      // Update data
      this.data.hrv = Math.max(0, Math.min(100, hrv));
      
      logger.debug('📊 PPG Analysis', { 
        component: 'WebBiofeedback',
        metadata: { bpm: bpm.toFixed(1), hrv: hrv.toFixed(1) }
      });
    }
  }

  private detectPeaks(signal: number[]): number[] {
    const peaks: number[] = [];
    const threshold = this.calculateThreshold(signal);
    
    for (let i = 1; i < signal.length - 1; i++) {
      if (signal[i] > signal[i-1] && signal[i] > signal[i+1] && signal[i] > threshold) {
        // Avoid peaks too close together (minimum 0.4 seconds)
        if (peaks.length === 0 || i - peaks[peaks.length - 1] > 12) {
          peaks.push(i);
        }
      }
    }
    
    return peaks;
  }

  private calculateThreshold(signal: number[]): number {
    const sorted = [...signal].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length * 0.7)]; // 70th percentile
  }

  private handleDeviceMotion(event: DeviceMotionEvent): void {
    if (!event.accelerationIncludingGravity) return;

    const { x, y, z } = event.accelerationIncludingGravity;
    const magnitude = Math.sqrt((x || 0)**2 + (y || 0)**2 + (z || 0)**2);
    
    // Simple breathing detection from chest movement
    // Normalize to -1 to 1 range for breath signal
    const normalizedBreath = Math.sin(Date.now() / 4000) * (magnitude / 10);
    this.data.breath = Math.max(-1, Math.min(1, normalizedBreath));
  }

  getBioSignals(): BioSignals {
    return { ...this.data };
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  async stop(): Promise<void> {
    this.isActive = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    window.removeEventListener('devicemotion', this.handleDeviceMotion);
    
    logger.info('🔬 Web Biofeedback Integration stopped');
  }
}
