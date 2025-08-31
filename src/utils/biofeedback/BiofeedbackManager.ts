import { SimpleBiofeedbackMetrics, BioSignals } from '@/types/gaa';

export interface BiofeedbackDevice {
  id: string;
  name: string;
  type: 'HRV' | 'EEG' | 'Breath' | 'Combined';
  connected: boolean;
  lastUpdate: number;
}

export interface BiofeedbackCalibration {
  baselineHRV: number;
  baselineBreathRate: number;
  eegAlphaBand: [number, number];
  eegBetaBand: [number, number];
  eegThetaBand: [number, number];
  eegDeltaBand: [number, number];
  calibrationTime: number;
}

export class BiofeedbackManager {
  private devices: Map<string, BiofeedbackDevice> = new Map();
  private calibration: BiofeedbackCalibration | null = null;
  private isStreaming = false;
  private streamingInterval: number | null = null;
  private listeners: Set<(metrics: SimpleBiofeedbackMetrics) => void> = new Set();
  
  // Real-time data buffers
  private hrvBuffer: number[] = [];
  private eegBuffer: { alpha: number[], beta: number[], theta: number[], delta: number[], gamma: number[] } = {
    alpha: [], beta: [], theta: [], delta: [], gamma: []
  };
  private breathBuffer: number[] = [];
  private breathDepthBuffer: number[] = [];
  
  // Buffer sizes for sliding window analysis
  private readonly BUFFER_SIZE = 100;
  private readonly HRV_WINDOW_SIZE = 30;

  constructor() {
    this.initializeWebSerial();
    this.initializeWebBluetooth();
    this.setupSimulatedData();
  }

  /**
   * Initialize Web Serial for direct device connection
   */
  private async initializeWebSerial(): Promise<void> {
    if ('serial' in navigator) {
      try {
        // Listen for device connections
        (navigator as any).serial.addEventListener('connect', (event: any) => {
          console.log('Serial device connected:', event);
          this.handleDeviceConnection(event.target);
        });

        (navigator as any).serial.addEventListener('disconnect', (event: any) => {
          console.log('Serial device disconnected:', event);
          this.handleDeviceDisconnection(event.target);
        });
      } catch (error) {
        console.warn('Web Serial not available:', error);
      }
    }
  }

  /**
   * Initialize Web Bluetooth for wireless devices
   */
  private async initializeWebBluetooth(): Promise<void> {
    if ('bluetooth' in navigator) {
      try {
        // Note: Actual connection happens on user interaction
        console.log('Web Bluetooth available');
      } catch (error) {
        console.warn('Web Bluetooth not available:', error);
      }
    }
  }

  /**
   * Setup simulated biofeedback data for demo purposes
   */
  private setupSimulatedData(): void {
    // Generate realistic HRV baseline
    for (let i = 0; i < this.HRV_WINDOW_SIZE; i++) {
      this.hrvBuffer.push(40 + Math.random() * 20); // 40-60ms range
    }

    // Generate EEG baseline
    for (let i = 0; i < 20; i++) {
      this.eegBuffer.alpha.push(8 + Math.random() * 5);   // 8-13 Hz
      this.eegBuffer.beta.push(15 + Math.random() * 15);  // 15-30 Hz
      this.eegBuffer.theta.push(4 + Math.random() * 4);   // 4-8 Hz
      this.eegBuffer.delta.push(0.5 + Math.random() * 3); // 0.5-4 Hz
      this.eegBuffer.gamma.push(30 + Math.random() * 70); // 30-100 Hz
    }

    // Generate breath baseline
    for (let i = 0; i < 30; i++) {
      this.breathBuffer.push(12 + Math.random() * 6); // 12-18 BPM
      this.breathDepthBuffer.push(0.7 + Math.random() * 0.3); // 0.7-1.0
    }
  }

  /**
   * Connect to a biofeedback device
   */
  async connectDevice(type: 'HRV' | 'EEG' | 'Breath' | 'Combined'): Promise<boolean> {
    try {
      if (type === 'HRV' || type === 'Combined') {
        return await this.connectHRVDevice();
      } else if (type === 'EEG') {
        return await this.connectEEGDevice();
      } else if (type === 'Breath') {
        return await this.connectBreathDevice();
      }
      return false;
    } catch (error) {
      console.error('Failed to connect device:', error);
      return false;
    }
  }

  /**
   * Connect HRV device (Heart Rate Variability)
   */
  private async connectHRVDevice(): Promise<boolean> {
    if ('bluetooth' in navigator) {
      try {
        const device = await (navigator.bluetooth as any).requestDevice({
          filters: [
            { services: ['heart_rate'] },
            { name: 'HeartMath' },
            { name: 'Polar' }
          ]
        });

        if (device) {
          const deviceInfo: BiofeedbackDevice = {
            id: `hrv_${device.id}`,
            name: device.name || 'HRV Device',
            type: 'HRV',
            connected: true,
            lastUpdate: Date.now()
          };

          this.devices.set(deviceInfo.id, deviceInfo);
          await this.startHRVStreaming(device);
          return true;
        }
      } catch (error) {
        console.warn('HRV device connection failed, using simulated data');
      }
    }

    // Fallback to simulated HRV device
    const simDeviceId = 'hrv_simulated';
    this.devices.set(simDeviceId, {
      id: simDeviceId,
      name: 'Simulated HRV',
      type: 'HRV',
      connected: true,
      lastUpdate: Date.now()
    });

    return true;
  }

  /**
   * Connect EEG device
   */
  private async connectEEGDevice(): Promise<boolean> {
    if ('bluetooth' in navigator) {
      try {
        const device = await (navigator.bluetooth as any).requestDevice({
          filters: [
            { name: 'Muse' },
            { name: 'OpenBCI' },
            { name: 'NeuroSky' }
          ]
        });

        if (device) {
          const deviceInfo: BiofeedbackDevice = {
            id: `eeg_${device.id}`,
            name: device.name || 'EEG Device',
            type: 'EEG',
            connected: true,
            lastUpdate: Date.now()
          };

          this.devices.set(deviceInfo.id, deviceInfo);
          await this.startEEGStreaming(device);
          return true;
        }
      } catch (error) {
        console.warn('EEG device connection failed, using simulated data');
      }
    }

    // Fallback to simulated EEG device
    const simDeviceId = 'eeg_simulated';
    this.devices.set(simDeviceId, {
      id: simDeviceId,
      name: 'Simulated EEG',
      type: 'EEG',
      connected: true,
      lastUpdate: Date.now()
    });

    return true;
  }

  /**
   * Connect breathing sensor
   */
  private async connectBreathDevice(): Promise<boolean> {
    // Fallback to simulated breathing device (could integrate with webcam-based detection)
    const simDeviceId = 'breath_simulated';
    this.devices.set(simDeviceId, {
      id: simDeviceId,
      name: 'Simulated Breath Sensor',
      type: 'Breath',
      connected: true,
      lastUpdate: Date.now()
    });

    return true;
  }

  /**
   * Start streaming biofeedback data
   */
  startStreaming(): void {
    if (this.isStreaming) return;

    this.isStreaming = true;
    this.streamingInterval = window.setInterval(() => {
      this.updateBiofeedbackData();
    }, 100); // 10Hz update rate
  }

  /**
   * Stop streaming biofeedback data
   */
  stopStreaming(): void {
    this.isStreaming = false;
    if (this.streamingInterval) {
      clearInterval(this.streamingInterval);
      this.streamingInterval = null;
    }
  }

  /**
   * Update biofeedback data (real-time processing)
   */
  private updateBiofeedbackData(): void {
    const now = Date.now();
    
    // Generate new data points (simulated with realistic patterns)
    this.generateRealisticHRV();
    this.generateRealisticEEG();
    this.generateRealisticBreathing();
    
    // Calculate current metrics
    const metrics = this.calculateMetrics();
    
    // Update device timestamps
    this.devices.forEach(device => {
      device.lastUpdate = now;
    });
    
    // Notify listeners
    this.listeners.forEach(callback => callback(metrics));
  }

  /**
   * Generate realistic HRV data with physiological patterns
   */
  private generateRealisticHRV(): void {
    const time = Date.now() / 1000;
    
    // Base HRV with circadian rhythm and breath coupling
    const circadianEffect = Math.sin(time * 0.001) * 5; // Slow circadian variation
    const breathEffect = Math.sin(time * 0.2) * 3; // Breath-related variation
    const stressEffect = Math.random() * 2 - 1; // Random stress variation
    
    const newHRV = 45 + circadianEffect + breathEffect + stressEffect;
    
    this.hrvBuffer.push(Math.max(20, Math.min(80, newHRV)));
    if (this.hrvBuffer.length > this.HRV_WINDOW_SIZE) {
      this.hrvBuffer.shift();
    }
  }

  /**
   * Generate realistic EEG data with brain state patterns
   */
  private generateRealisticEEG(): void {
    const time = Date.now() / 1000;
    
    // Simulate different brain states
    const relaxationState = (Math.sin(time * 0.1) + 1) / 2; // 0-1
    const focusState = (Math.cos(time * 0.15) + 1) / 2; // 0-1
    const drowsinessState = Math.max(0, Math.sin(time * 0.05)); // 0-1
    
    // Alpha (relaxed awareness) - increases with relaxation
    const alpha = 10 + relaxationState * 8 + Math.random() * 2;
    this.eegBuffer.alpha.push(alpha);
    
    // Beta (focused attention) - increases with focus
    const beta = 15 + focusState * 10 + Math.random() * 3;
    this.eegBuffer.beta.push(beta);
    
    // Theta (meditative) - increases with deep relaxation
    const theta = 4 + relaxationState * 4 + Math.random() * 1;
    this.eegBuffer.theta.push(theta);
    
    // Delta (deep sleep) - increases with drowsiness
    const delta = 1 + drowsinessState * 3 + Math.random() * 0.5;
    this.eegBuffer.delta.push(delta);
    
    // Gamma (high-level cognitive processing)
    const gamma = 35 + focusState * 15 + Math.random() * 10;
    this.eegBuffer.gamma.push(gamma);
    
    // Maintain buffer size
    Object.keys(this.eegBuffer).forEach(band => {
      const buffer = this.eegBuffer[band as keyof typeof this.eegBuffer];
      if (buffer.length > 20) buffer.shift();
    });
  }

  /**
   * Generate realistic breathing data
   */
  private generateRealisticBreathing(): void {
    const time = Date.now() / 1000;
    
    // Breathing rate with natural variation
    const baseRate = 14; // breaths per minute
    const variation = Math.sin(time * 0.3) * 2; // Natural variation
    const stressEffect = Math.random() * 1 - 0.5; // Stress-related changes
    
    const breathRate = baseRate + variation + stressEffect;
    this.breathBuffer.push(Math.max(8, Math.min(25, breathRate)));
    
    // Breathing depth with coherence patterns
    const coherencePhase = Math.sin(time * 0.8); // Coherent breathing pattern
    const depth = 0.8 + coherencePhase * 0.15 + Math.random() * 0.05;
    this.breathDepthBuffer.push(Math.max(0.3, Math.min(1.0, depth)));
    
    // Maintain buffer size
    if (this.breathBuffer.length > 30) this.breathBuffer.shift();
    if (this.breathDepthBuffer.length > 30) this.breathDepthBuffer.shift();
  }

  /**
   * Calculate current biofeedback metrics from buffered data
   */
  private calculateMetrics(): SimpleBiofeedbackMetrics {
    // Calculate HRV metrics
    const currentHRV = this.calculateCurrentHRV();
    
    // Calculate EEG metrics
    const eegMetrics = this.calculateEEGMetrics();
    
    // Calculate breathing metrics
    const breathMetrics = this.calculateBreathingMetrics();
    
    // Calculate autonomic balance
    const autonomicBalance = this.calculateAutonomicBalance(currentHRV, breathMetrics);
    
    return {
      heartRateVariability: currentHRV,
      brainwaveActivity: eegMetrics,
      breathingPattern: breathMetrics,
      autonomicBalance: autonomicBalance
    };
  }

  /**
   * Calculate current HRV from buffer
   */
  private calculateCurrentHRV(): number {
    if (this.hrvBuffer.length < 2) return 45;
    
    // Calculate RMSSD (Root Mean Square of Successive Differences)
    let sumSquaredDiffs = 0;
    for (let i = 1; i < this.hrvBuffer.length; i++) {
      const diff = this.hrvBuffer[i] - this.hrvBuffer[i - 1];
      sumSquaredDiffs += diff * diff;
    }
    
    return Math.sqrt(sumSquaredDiffs / (this.hrvBuffer.length - 1));
  }

  /**
   * Calculate EEG band metrics
   */
  private calculateEEGMetrics() {
    return {
      alpha: this.average(this.eegBuffer.alpha),
      beta: this.average(this.eegBuffer.beta),
      theta: this.average(this.eegBuffer.theta),
      delta: this.average(this.eegBuffer.delta),
      gamma: this.average(this.eegBuffer.gamma)
    };
  }

  /**
   * Calculate breathing pattern metrics
   */
  private calculateBreathingMetrics() {
    const rate = this.average(this.breathBuffer);
    const depth = this.average(this.breathDepthBuffer);
    
    // Calculate coherence (consistency of breathing pattern)
    const rateVariance = this.variance(this.breathBuffer);
    const coherence = Math.max(0, 1 - (rateVariance / 10)); // Normalize variance to coherence
    
    return {
      rate: rate,
      depth: depth,
      coherence: coherence
    };
  }

  /**
   * Calculate autonomic balance from HRV and breathing
   */
  private calculateAutonomicBalance(hrv: number, breath: any) {
    // Higher HRV generally indicates better parasympathetic activity
    const parasympatheticFromHRV = Math.min(1, hrv / 60);
    
    // Slower, deeper breathing indicates parasympathetic dominance
    const parasympatheticFromBreath = Math.min(1, (1 / breath.rate) * breath.coherence);
    
    const parasympathetic = (parasympatheticFromHRV + parasympatheticFromBreath) / 2;
    const sympathetic = 1 - parasympathetic;
    
    return {
      sympathetic: sympathetic,
      parasympathetic: parasympathetic
    };
  }

  /**
   * Get simplified bio signals for audio engine
   */
  getBioSignals(): BioSignals {
    const metrics = this.calculateMetrics();
    
    // Convert to normalized values for audio processing
    const breathNormalized = (Math.sin(Date.now() * 0.001 * metrics.breathingPattern.rate) + 1) / 2;
    const hrvNormalized = Math.min(1, metrics.heartRateVariability / 60);
    
    // EEG band ratio (theta+alpha)/(beta+gamma) for relaxation state
    const relaxationRatio = (metrics.brainwaveActivity.theta + metrics.brainwaveActivity.alpha) / 
                           (metrics.brainwaveActivity.beta + metrics.brainwaveActivity.gamma);
    
    return {
      breath: breathNormalized * 2 - 1, // Convert to -1 to 1 range
      hrv: hrvNormalized,
      eegBandRatio: Math.min(1, relaxationRatio / 2)
    };
  }

  /**
   * Add listener for biofeedback updates
   */
  addListener(callback: (metrics: SimpleBiofeedbackMetrics) => void): void {
    this.listeners.add(callback);
  }

  /**
   * Remove listener
   */
  removeListener(callback: (metrics: SimpleBiofeedbackMetrics) => void): void {
    this.listeners.delete(callback);
  }

  /**
   * Get connected devices
   */
  getDevices(): BiofeedbackDevice[] {
    return Array.from(this.devices.values());
  }

  /**
   * Disconnect all devices
   */
  disconnectAll(): void {
    this.stopStreaming();
    this.devices.clear();
  }

  // Utility functions
  private average(arr: number[]): number {
    return arr.length > 0 ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0;
  }

  private variance(arr: number[]): number {
    const avg = this.average(arr);
    const squaredDiffs = arr.map(val => (val - avg) ** 2);
    return this.average(squaredDiffs);
  }

  private async handleDeviceConnection(port: any): Promise<void> {
    // Handle serial device connection
    console.log('Handling serial device connection');
  }

  private handleDeviceDisconnection(port: any): void {
    // Handle serial device disconnection
    console.log('Handling serial device disconnection');
  }

  private async startHRVStreaming(device: any): Promise<void> {
    // Start streaming from real HRV device
    console.log('Starting HRV streaming from device:', device.name);
  }

  private async startEEGStreaming(device: any): Promise<void> {
    // Start streaming from real EEG device
    console.log('Starting EEG streaming from device:', device.name);
  }
}