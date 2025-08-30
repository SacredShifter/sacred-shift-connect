/**
 * GAA Safety System - Comprehensive safety monitoring and enforcement
 * Implements medical guidelines and accessibility standards
 */

export interface SafetyMetrics {
  audioLevels: {
    peak: number;
    rms: number;
    frequency: number;
  };
  visualStimulation: {
    flashRate: number;
    brightness: number;
    contrast: number;
  };
  breathingGuidance: {
    currentRate: number; // BPM
    targetRate: number;
    coherence: number; // 0-1
  };
  sessionDuration: number; // minutes
}

export interface SafetyAlert {
  type: 'warning' | 'critical';
  category: 'audio' | 'visual' | 'breathing' | 'duration';
  message: string;
  action: 'reduce' | 'pause' | 'stop' | 'notify';
  timestamp: number;
}

export class SafetySystem {
  private metrics: SafetyMetrics;
  private alerts: SafetyAlert[] = [];
  private sessionStartTime: number;
  private isMonitoring: boolean = false;
  private alertCallbacks: ((alert: SafetyAlert) => void)[] = [];

  // Safety thresholds based on medical guidelines
  private readonly THRESHOLDS = {
    audio: {
      maxPeak: 0.9,      // 90% peak volume
      maxRMS: 0.7,       // 70% RMS
      maxFrequency: 20000, // 20kHz
      minFrequency: 20    // 20Hz
    },
    visual: {
      maxFlashRate: 3,   // 3Hz - epilepsy prevention
      maxBrightness: 0.8, // 80% max brightness
      maxContrast: 0.9   // 90% max contrast
    },
    breathing: {
      maxRate: 30,       // 30 BPM max
      minRate: 4,        // 4 BPM min
      targetRate: 6,     // 6 BPM optimal
      minCoherence: 0.3  // 30% minimum coherence
    },
    session: {
      recommendedMax: 30, // 30 minutes
      warningAt: 20,     // Warning at 20 minutes
      criticalAt: 45     // Critical at 45 minutes
    }
  };

  constructor() {
    this.sessionStartTime = Date.now();
    this.metrics = {
      audioLevels: { peak: 0, rms: 0, frequency: 440 },
      visualStimulation: { flashRate: 0, brightness: 0.5, contrast: 0.5 },
      breathingGuidance: { currentRate: 6, targetRate: 6, coherence: 0.5 },
      sessionDuration: 0
    };
  }

  /**
   * Start safety monitoring
   */
  startMonitoring(): void {
    this.isMonitoring = true;
    this.sessionStartTime = Date.now();
    
    // Start monitoring loop
    this.monitoringLoop();
  }

  /**
   * Stop safety monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  /**
   * Update audio metrics from Web Audio API
   */
  updateAudioMetrics(analyser: AnalyserNode, frequency: number): void {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Get frequency data
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate peak and RMS
    let peak = 0;
    let sum = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i] / 255; // Normalize to 0-1
      peak = Math.max(peak, value);
      sum += value * value;
    }
    
    const rms = Math.sqrt(sum / bufferLength);
    
    this.metrics.audioLevels = { peak, rms, frequency };
    
    // Check audio safety
    this.checkAudioSafety();
  }

  /**
   * Update visual metrics from animation system
   */
  updateVisualMetrics(flashRate: number, brightness: number, contrast: number): void {
    this.metrics.visualStimulation = { flashRate, brightness, contrast };
    this.checkVisualSafety();
  }

  /**
   * Update breathing metrics from GAA engine
   */
  updateBreathingMetrics(currentRate: number, targetRate: number, coherence: number): void {
    this.metrics.breathingGuidance = { currentRate, targetRate, coherence };
    this.checkBreathingSafety();
  }

  /**
   * Check audio safety thresholds
   */
  private checkAudioSafety(): void {
    const { peak, rms, frequency } = this.metrics.audioLevels;
    
    if (peak > this.THRESHOLDS.audio.maxPeak) {
      this.triggerAlert({
        type: 'critical',
        category: 'audio',
        message: `Audio peak level too high: ${(peak * 100).toFixed(1)}%`,
        action: 'reduce',
        timestamp: Date.now()
      });
    }
    
    if (rms > this.THRESHOLDS.audio.maxRMS) {
      this.triggerAlert({
        type: 'warning',
        category: 'audio',
        message: `Audio RMS level high: ${(rms * 100).toFixed(1)}%`,
        action: 'reduce',
        timestamp: Date.now()
      });
    }
    
    if (frequency > this.THRESHOLDS.audio.maxFrequency || frequency < this.THRESHOLDS.audio.minFrequency) {
      this.triggerAlert({
        type: 'warning',
        category: 'audio',
        message: `Audio frequency outside safe range: ${frequency.toFixed(0)}Hz`,
        action: 'reduce',
        timestamp: Date.now()
      });
    }
  }

  /**
   * Check visual safety thresholds
   */
  private checkVisualSafety(): void {
    const { flashRate, brightness, contrast } = this.metrics.visualStimulation;
    
    if (flashRate > this.THRESHOLDS.visual.maxFlashRate) {
      this.triggerAlert({
        type: 'critical',
        category: 'visual',
        message: `Flash rate too high: ${flashRate.toFixed(1)}Hz (seizure risk)`,
        action: 'stop',
        timestamp: Date.now()
      });
    }
    
    if (brightness > this.THRESHOLDS.visual.maxBrightness) {
      this.triggerAlert({
        type: 'warning',
        category: 'visual',
        message: `Brightness too high: ${(brightness * 100).toFixed(1)}%`,
        action: 'reduce',
        timestamp: Date.now()
      });
    }
    
    if (contrast > this.THRESHOLDS.visual.maxContrast) {
      this.triggerAlert({
        type: 'warning',
        category: 'visual',
        message: `Contrast too high: ${(contrast * 100).toFixed(1)}%`,
        action: 'reduce',
        timestamp: Date.now()
      });
    }
  }

  /**
   * Check breathing safety thresholds
   */
  private checkBreathingSafety(): void {
    const { currentRate, coherence } = this.metrics.breathingGuidance;
    
    if (currentRate > this.THRESHOLDS.breathing.maxRate) {
      this.triggerAlert({
        type: 'critical',
        category: 'breathing',
        message: `Breathing rate too fast: ${currentRate} BPM`,
        action: 'pause',
        timestamp: Date.now()
      });
    }
    
    if (currentRate < this.THRESHOLDS.breathing.minRate) {
      this.triggerAlert({
        type: 'warning',
        category: 'breathing',
        message: `Breathing rate too slow: ${currentRate} BPM`,
        action: 'notify',
        timestamp: Date.now()
      });
    }
    
    if (coherence < this.THRESHOLDS.breathing.minCoherence) {
      this.triggerAlert({
        type: 'warning',
        category: 'breathing',
        message: `Low breathing coherence: ${(coherence * 100).toFixed(1)}%`,
        action: 'notify',
        timestamp: Date.now()
      });
    }
  }

  /**
   * Check session duration
   */
  private checkSessionDuration(): void {
    const duration = (Date.now() - this.sessionStartTime) / (1000 * 60); // minutes
    this.metrics.sessionDuration = duration;
    
    if (duration > this.THRESHOLDS.session.criticalAt) {
      this.triggerAlert({
        type: 'critical',
        category: 'duration',
        message: `Session too long: ${duration.toFixed(1)} minutes`,
        action: 'stop',
        timestamp: Date.now()
      });
    } else if (duration > this.THRESHOLDS.session.warningAt) {
      this.triggerAlert({
        type: 'warning',
        category: 'duration',
        message: `Long session: ${duration.toFixed(1)} minutes`,
        action: 'notify',
        timestamp: Date.now()
      });
    }
  }

  /**
   * Trigger a safety alert
   */
  private triggerAlert(alert: SafetyAlert): void {
    // Prevent duplicate alerts within 5 seconds
    const recentAlert = this.alerts.find(a => 
      a.category === alert.category && 
      a.type === alert.type &&
      (Date.now() - a.timestamp) < 5000
    );
    
    if (!recentAlert) {
      this.alerts.push(alert);
      this.alertCallbacks.forEach(callback => callback(alert));
      
      // Keep only last 50 alerts
      if (this.alerts.length > 50) {
        this.alerts = this.alerts.slice(-50);
      }
    }
  }

  /**
   * Main monitoring loop
   */
  private monitoringLoop(): void {
    if (!this.isMonitoring) return;
    
    this.checkSessionDuration();
    
    // Continue monitoring
    setTimeout(() => this.monitoringLoop(), 1000);
  }

  /**
   * Register alert callback
   */
  onAlert(callback: (alert: SafetyAlert) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Get current safety status
   */
  getSafetyStatus(): {
    level: 'safe' | 'warning' | 'critical';
    activeAlerts: SafetyAlert[];
    metrics: SafetyMetrics;
  } {
    const criticalAlerts = this.alerts.filter(a => 
      a.type === 'critical' && (Date.now() - a.timestamp) < 30000
    );
    
    const warningAlerts = this.alerts.filter(a => 
      a.type === 'warning' && (Date.now() - a.timestamp) < 30000
    );
    
    let level: 'safe' | 'warning' | 'critical' = 'safe';
    if (criticalAlerts.length > 0) level = 'critical';
    else if (warningAlerts.length > 0) level = 'warning';
    
    return {
      level,
      activeAlerts: [...criticalAlerts, ...warningAlerts],
      metrics: this.metrics
    };
  }

  /**
   * Apply automatic safety corrections
   */
  applySafetyCorrections(): {
    audioReduction: number;
    visualReduction: number;
    pauseRequired: boolean;
  } {
    const status = this.getSafetyStatus();
    let audioReduction = 1.0;
    let visualReduction = 1.0;
    let pauseRequired = false;
    
    for (const alert of status.activeAlerts) {
      switch (alert.action) {
        case 'reduce':
          if (alert.category === 'audio') audioReduction *= 0.7;
          if (alert.category === 'visual') visualReduction *= 0.8;
          break;
        case 'pause':
        case 'stop':
          pauseRequired = true;
          break;
      }
    }
    
    return { audioReduction, visualReduction, pauseRequired };
  }
}
