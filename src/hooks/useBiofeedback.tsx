/**
 * Biofeedback Integration Hook
 * Real-time consciousness-responsive adaptation for GAA
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { BiofeedbackMetrics, BiofeedbackCalibration } from '@/types/gaa-polarity';

export interface BiofeedbackDevice {
  type: 'hrv' | 'eeg' | 'breath' | 'emg' | 'gsr';
  name: string;
  connected: boolean;
  calibrated: boolean;
  lastReading: Date | null;
}

export interface BiofeedbackConfig {
  enableHRV: boolean;
  enableEEG: boolean;
  enableBreathTracking: boolean;
  enableGSR: boolean;
  samplingRate: number; // Hz
  smoothingFactor: number; // 0-1
  calibrationDuration: number; // seconds
}

export interface BiofeedbackState {
  isActive: boolean;
  devices: BiofeedbackDevice[];
  currentMetrics: BiofeedbackMetrics | null;
  calibration: BiofeedbackCalibration | null;
  qualityScore: number; // 0-1, overall signal quality
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export const useBiofeedback = (config: BiofeedbackConfig) => {
  const [state, setState] = useState<BiofeedbackState>({
    isActive: false,
    devices: [],
    currentMetrics: null,
    calibration: null,
    qualityScore: 0,
    connectionStatus: 'disconnected'
  });

  // WebRTC or WebUSB connections for actual devices
  const deviceConnections = useRef<Map<string, any>>(new Map());
  const metricsBuffer = useRef<BiofeedbackMetrics[]>([]);
  const calibrationData = useRef<any>({});

  /**
   * Initialize biofeedback system
   */
  const initialize = useCallback(async (): Promise<boolean> => {
    console.log('🧠 Initializing biofeedback system...');
    
    setState(prev => ({ ...prev, connectionStatus: 'connecting' }));

    try {
      // Initialize available devices
      const availableDevices = await detectBiofeedbackDevices();
      
      setState(prev => ({
        ...prev,
        devices: availableDevices,
        connectionStatus: availableDevices.length > 0 ? 'connected' : 'disconnected'
      }));

      console.log(`✅ Found ${availableDevices.length} biofeedback devices`);
      return availableDevices.length > 0;

    } catch (error) {
      console.error('❌ Failed to initialize biofeedback:', error);
      setState(prev => ({ ...prev, connectionStatus: 'error' }));
      return false;
    }
  }, []);

  /**
   * Start biofeedback monitoring
   */
  const startMonitoring = useCallback(async (): Promise<void> => {
    if (state.connectionStatus !== 'connected') {
      throw new Error('No biofeedback devices connected');
    }

    console.log('🔍 Starting biofeedback monitoring...');

    setState(prev => ({ ...prev, isActive: true }));

    // Start monitoring each enabled device type
    if (config.enableHRV) {
      await startHRVMonitoring();
    }

    if (config.enableEEG) {
      await startEEGMonitoring();
    }

    if (config.enableBreathTracking) {
      await startBreathMonitoring();
    }

    if (config.enableGSR) {
      await startGSRMonitoring();
    }

    // Start processing loop
    startMetricsProcessing();

    console.log('✅ Biofeedback monitoring started');
  }, [state.connectionStatus, config]);

  /**
   * Stop biofeedback monitoring
   */
  const stopMonitoring = useCallback((): void => {
    console.log('🛑 Stopping biofeedback monitoring...');

    setState(prev => ({ ...prev, isActive: false }));

    // Stop all device connections
    deviceConnections.current.forEach((connection, deviceId) => {
      try {
        connection.close?.();
      } catch (error) {
        console.warn(`Warning: Failed to close device ${deviceId}:`, error);
      }
    });

    deviceConnections.current.clear();
    metricsBuffer.current = [];

    console.log('✅ Biofeedback monitoring stopped');
  }, []);

  /**
   * Calibrate biofeedback system for current user
   */
  const calibrate = useCallback(async (duration: number = 60): Promise<BiofeedbackCalibration> => {
    console.log(`🎯 Starting biofeedback calibration (${duration}s)...`);

    if (!state.isActive) {
      throw new Error('Biofeedback monitoring must be active for calibration');
    }

    const calibrationStart = Date.now();
    const calibrationMetrics: BiofeedbackMetrics[] = [];

    // Collect baseline data
    while (Date.now() - calibrationStart < duration * 1000) {
      if (state.currentMetrics) {
        calibrationMetrics.push(state.currentMetrics);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 / config.samplingRate));
    }

    // Calculate baseline values
    const calibration = calculateCalibrationBaseline(calibrationMetrics);
    
    setState(prev => ({ ...prev, calibration }));

    console.log('✅ Biofeedback calibration complete');
    return calibration;
  }, [state.isActive, state.currentMetrics, config.samplingRate]);

  /**
   * Get real-time polarity balance based on biofeedback
   */
  const getPolarityBalance = useCallback((): number => {
    if (!state.currentMetrics || !state.calibration) {
      return 0; // Neutral balance
    }

    const metrics = state.currentMetrics;
    const baseline = state.calibration;

    // HRV contributes to overall balance
    const hrvDeviation = (metrics.heartRateVariability.coherenceRatio - baseline.baselineHRV) / baseline.baselineHRV;
    
    // Brainwave balance affects polarity
    const alphaTheta = (metrics.brainwaveActivity.alpha + metrics.brainwaveActivity.theta) / 2;
    const betaGamma = (metrics.brainwaveActivity.beta + metrics.brainwaveActivity.gamma) / 2;
    const brainwaveBalance = (alphaTheta - betaGamma) / (alphaTheta + betaGamma + 0.001);

    // Autonomic balance
    const autonomicBalance = metrics.autonomicBalance.balance;

    // Combined polarity calculation
    const polarityBalance = Math.tanh(
      hrvDeviation * 0.4 +
      brainwaveBalance * 0.4 +
      (autonomicBalance - 0.5) * 0.2
    );

    return Math.max(-1, Math.min(1, polarityBalance));
  }, [state.currentMetrics, state.calibration]);

  /**
   * Get shadow work readiness level
   */
  const getShadowWorkReadiness = useCallback((): number => {
    if (!state.currentMetrics || !state.calibration) {
      return 0.5; // Moderate readiness
    }

    const metrics = state.currentMetrics;
    
    // High HRV coherence indicates readiness for deeper work
    const hrvReadiness = Math.min(1, metrics.heartRateVariability.coherenceRatio / 0.8);
    
    // Theta waves indicate deep states suitable for shadow work
    const thetaReadiness = Math.min(1, metrics.brainwaveActivity.theta / 0.6);
    
    // Balanced autonomic state
    const autonomicReadiness = 1 - Math.abs(metrics.autonomicBalance.balance - 0.5) * 2;
    
    // Breathing coherence
    const breathReadiness = metrics.breathingPattern.coherence;

    const readiness = (hrvReadiness + thetaReadiness + autonomicReadiness + breathReadiness) / 4;
    
    return Math.max(0, Math.min(1, readiness));
  }, [state.currentMetrics, state.calibration]);

  // Device Detection Functions
  const detectBiofeedbackDevices = async (): Promise<BiofeedbackDevice[]> => {
    const devices: BiofeedbackDevice[] = [];

    // Detect HRV devices (simulate for now)
    if (config.enableHRV) {
      devices.push({
        type: 'hrv',
        name: 'HRV Monitor',
        connected: await simulateDeviceDetection('hrv'),
        calibrated: false,
        lastReading: null
      });
    }

    // Detect EEG devices
    if (config.enableEEG) {
      devices.push({
        type: 'eeg',
        name: 'EEG Headset',
        connected: await simulateDeviceDetection('eeg'),
        calibrated: false,
        lastReading: null
      });
    }

    // Detect breath tracking
    if (config.enableBreathTracking) {
      devices.push({
        type: 'breath',
        name: 'Breath Sensor',
        connected: await simulateDeviceDetection('breath'),
        calibrated: false,
        lastReading: null
      });
    }

    return devices;
  };

  const simulateDeviceDetection = async (deviceType: string): Promise<boolean> => {
    // Simulate device detection with random success
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    return Math.random() > 0.3; // 70% success rate
  };

  // Device Monitoring Functions
  const startHRVMonitoring = async (): Promise<void> => {
    const connection = {
      type: 'hrv',
      data: generateMockHRVData(),
      close: () => console.log('HRV monitoring stopped')
    };
    
    deviceConnections.current.set('hrv', connection);
  };

  const startEEGMonitoring = async (): Promise<void> => {
    const connection = {
      type: 'eeg',
      data: generateMockEEGData(),
      close: () => console.log('EEG monitoring stopped')
    };
    
    deviceConnections.current.set('eeg', connection);
  };

  const startBreathMonitoring = async (): Promise<void> => {
    const connection = {
      type: 'breath',
      data: generateMockBreathData(),
      close: () => console.log('Breath monitoring stopped')
    };
    
    deviceConnections.current.set('breath', connection);
  };

  const startGSRMonitoring = async (): Promise<void> => {
    // GSR (Galvanic Skin Response) monitoring
    const connection = {
      type: 'gsr',
      data: generateMockGSRData(),
      close: () => console.log('GSR monitoring stopped')
    };
    
    deviceConnections.current.set('gsr', connection);
  };

  // Metrics Processing
  const startMetricsProcessing = (): void => {
    const processMetrics = () => {
      if (!state.isActive) return;

      try {
        const currentMetrics = compileBiofeedbackMetrics();
        
        // Apply smoothing
        const smoothedMetrics = applySmoothingFilter(currentMetrics);
        
        // Update state
        setState(prev => ({
          ...prev,
          currentMetrics: smoothedMetrics,
          qualityScore: calculateSignalQuality(smoothedMetrics)
        }));

        // Buffer for analysis
        metricsBuffer.current.push(smoothedMetrics);
        if (metricsBuffer.current.length > 1000) {
          metricsBuffer.current.shift(); // Keep last 1000 readings
        }

      } catch (error) {
        console.error('Error processing biofeedback metrics:', error);
      }

      // Continue processing
      setTimeout(processMetrics, 1000 / config.samplingRate);
    };

    processMetrics();
  };

  const compileBiofeedbackMetrics = (): BiofeedbackMetrics => {
    const timestamp = Date.now();

    // Get data from each connected device
    const hrvData = deviceConnections.current.get('hrv')?.data() || getDefaultHRVData();
    const eegData = deviceConnections.current.get('eeg')?.data() || getDefaultEEGData();
    const breathData = deviceConnections.current.get('breath')?.data() || getDefaultBreathData();
    const gsrData = deviceConnections.current.get('gsr')?.data() || getDefaultGSRData();

    return {
      heartRateVariability: { ...hrvData, timestamp },
      brainwaveActivity: { ...eegData, timestamp },
      breathingPattern: { ...breathData, timestamp },
      autonomicBalance: calculateAutonomicBalance(hrvData, gsrData, timestamp)
    };
  };

  const applySmoothingFilter = (metrics: BiofeedbackMetrics): BiofeedbackMetrics => {
    if (metricsBuffer.current.length === 0) return metrics;

    const lastMetrics = metricsBuffer.current[metricsBuffer.current.length - 1];
    const factor = config.smoothingFactor;

    return {
      heartRateVariability: {
        rmssd: metrics.heartRateVariability.rmssd * (1 - factor) + lastMetrics.heartRateVariability.rmssd * factor,
        pnn50: metrics.heartRateVariability.pnn50 * (1 - factor) + lastMetrics.heartRateVariability.pnn50 * factor,
        coherenceRatio: metrics.heartRateVariability.coherenceRatio * (1 - factor) + lastMetrics.heartRateVariability.coherenceRatio * factor,
        timestamp: metrics.heartRateVariability.timestamp
      },
      brainwaveActivity: {
        alpha: metrics.brainwaveActivity.alpha * (1 - factor) + lastMetrics.brainwaveActivity.alpha * factor,
        beta: metrics.brainwaveActivity.beta * (1 - factor) + lastMetrics.brainwaveActivity.beta * factor,
        theta: metrics.brainwaveActivity.theta * (1 - factor) + lastMetrics.brainwaveActivity.theta * factor,
        delta: metrics.brainwaveActivity.delta * (1 - factor) + lastMetrics.brainwaveActivity.delta * factor,
        gamma: metrics.brainwaveActivity.gamma * (1 - factor) + lastMetrics.brainwaveActivity.gamma * factor,
        coherence: metrics.brainwaveActivity.coherence * (1 - factor) + lastMetrics.brainwaveActivity.coherence * factor,
        timestamp: metrics.brainwaveActivity.timestamp
      },
      breathingPattern: {
        rate: metrics.breathingPattern.rate * (1 - factor) + lastMetrics.breathingPattern.rate * factor,
        depth: metrics.breathingPattern.depth * (1 - factor) + lastMetrics.breathingPattern.depth * factor,
        coherence: metrics.breathingPattern.coherence * (1 - factor) + lastMetrics.breathingPattern.coherence * factor,
        phase: metrics.breathingPattern.phase,
        timestamp: metrics.breathingPattern.timestamp
      },
      autonomicBalance: {
        sympathetic: metrics.autonomicBalance.sympathetic * (1 - factor) + lastMetrics.autonomicBalance.sympathetic * factor,
        parasympathetic: metrics.autonomicBalance.parasympathetic * (1 - factor) + lastMetrics.autonomicBalance.parasympathetic * factor,
        balance: metrics.autonomicBalance.balance * (1 - factor) + lastMetrics.autonomicBalance.balance * factor,
        timestamp: metrics.autonomicBalance.timestamp
      }
    };
  };

  const calculateSignalQuality = (metrics: BiofeedbackMetrics): number => {
    // Calculate overall signal quality based on various factors
    let qualityFactors = [];

    // HRV quality (consistency of readings)
    if (metricsBuffer.current.length > 10) {
      const recentHRV = metricsBuffer.current.slice(-10).map(m => m.heartRateVariability.coherenceRatio);
      const hrvVariability = calculateVariability(recentHRV);
      qualityFactors.push(1 - Math.min(1, hrvVariability / 0.5)); // Lower variability = higher quality
    }

    // EEG signal quality (coherence level)
    qualityFactors.push(metrics.brainwaveActivity.coherence);

    // Breathing pattern quality (consistency)
    qualityFactors.push(metrics.breathingPattern.coherence);

    return qualityFactors.length > 0 ? qualityFactors.reduce((a, b) => a + b) / qualityFactors.length : 0.5;
  };

  const calculateVariability = (values: number[]): number => {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  const calculateCalibrationBaseline = (metrics: BiofeedbackMetrics[]): BiofeedbackCalibration => {
    if (metrics.length === 0) {
      throw new Error('No calibration data available');
    }

    // Calculate baseline averages
    const avgHRV = metrics.reduce((sum, m) => sum + m.heartRateVariability.coherenceRatio, 0) / metrics.length;
    const avgBrainwaves = {
      alpha: metrics.reduce((sum, m) => sum + m.brainwaveActivity.alpha, 0) / metrics.length,
      beta: metrics.reduce((sum, m) => sum + m.brainwaveActivity.beta, 0) / metrics.length,
      theta: metrics.reduce((sum, m) => sum + m.brainwaveActivity.theta, 0) / metrics.length,
      delta: metrics.reduce((sum, m) => sum + m.brainwaveActivity.delta, 0) / metrics.length,
      gamma: metrics.reduce((sum, m) => sum + m.brainwaveActivity.gamma, 0) / metrics.length
    };
    const avgBreathing = {
      rate: metrics.reduce((sum, m) => sum + m.breathingPattern.rate, 0) / metrics.length,
      depth: metrics.reduce((sum, m) => sum + m.breathingPattern.depth, 0) / metrics.length,
      coherence: metrics.reduce((sum, m) => sum + m.breathingPattern.coherence, 0) / metrics.length
    };

    // Calculate polarity preference
    const polarityValues = metrics.map(m => {
      const alphaTheta = (m.brainwaveActivity.alpha + m.brainwaveActivity.theta) / 2;
      const betaGamma = (m.brainwaveActivity.beta + m.brainwaveActivity.gamma) / 2;
      return (alphaTheta - betaGamma) / (alphaTheta + betaGamma + 0.001);
    });
    const avgPolarityPreference = polarityValues.reduce((a, b) => a + b, 0) / polarityValues.length;

    // Calculate shadow work readiness baseline
    const shadowReadinessValues = metrics.map(m => {
      const thetaReadiness = Math.min(1, m.brainwaveActivity.theta / 0.6);
      const autonomicBalance = 1 - Math.abs(m.autonomicBalance.balance - 0.5) * 2;
      return (thetaReadiness + autonomicBalance + m.breathingPattern.coherence) / 3;
    });
    const avgShadowWorkReadiness = shadowReadinessValues.reduce((a, b) => a + b, 0) / shadowReadinessValues.length;

    return {
      userId: 'current_user', // Would be actual user ID
      baselineHRV: avgHRV,
      baselineBrainwaves: avgBrainwaves,
      baselineBreathing: avgBreathing,
      polarityPreference: avgPolarityPreference,
      shadowWorkReadiness: avgShadowWorkReadiness,
      calibrationDate: new Date(),
      deviceConfiguration: {
        samplingRate: config.samplingRate,
        enabledDevices: state.devices.filter(d => d.connected).map(d => d.type)
      }
    };
  };

  const calculateAutonomicBalance = (hrvData: any, gsrData: any, timestamp: number): any => {
    // Calculate sympathetic/parasympathetic balance
    const sympathetic = Math.max(0, Math.min(1, (100 - hrvData.rmssd) / 100 + gsrData.arousal * 0.3));
    const parasympathetic = 1 - sympathetic;
    const balance = parasympathetic; // 0 = full sympathetic, 1 = full parasympathetic

    return {
      sympathetic,
      parasympathetic,
      balance,
      timestamp
    };
  };

  // Mock Data Generators (for development/testing)
  const generateMockHRVData = () => () => ({
    rmssd: 30 + Math.random() * 40, // 30-70ms
    pnn50: Math.random() * 30, // 0-30%
    coherenceRatio: 0.3 + Math.random() * 0.7 // 0.3-1.0
  });

  const generateMockEEGData = () => () => ({
    alpha: 0.2 + Math.random() * 0.6, // 0.2-0.8
    beta: 0.1 + Math.random() * 0.4, // 0.1-0.5
    theta: 0.1 + Math.random() * 0.5, // 0.1-0.6
    delta: 0.05 + Math.random() * 0.3, // 0.05-0.35
    gamma: 0.05 + Math.random() * 0.2, // 0.05-0.25
    coherence: 0.4 + Math.random() * 0.6 // 0.4-1.0
  });

  const generateMockBreathData = () => () => {
    const phases = ['inhale', 'exhale', 'hold', 'pause'];
    return {
      rate: 12 + Math.random() * 8, // 12-20 breaths per minute
      depth: 0.4 + Math.random() * 0.6, // 0.4-1.0
      coherence: 0.3 + Math.random() * 0.7, // 0.3-1.0
      phase: phases[Math.floor(Math.random() * phases.length)]
    };
  };

  const generateMockGSRData = () => () => ({
    conductance: 5 + Math.random() * 15, // 5-20 microsiemens
    arousal: Math.random(), // 0-1
    baseline: 8 + Math.random() * 4 // 8-12 microsiemens
  });

  // Default data when devices are not connected
  const getDefaultHRVData = () => ({
    rmssd: 45,
    pnn50: 15,
    coherenceRatio: 0.5
  });

  const getDefaultEEGData = () => ({
    alpha: 0.4,
    beta: 0.3,
    theta: 0.3,
    delta: 0.2,
    gamma: 0.1,
    coherence: 0.5
  });

  const getDefaultBreathData = () => ({
    rate: 16,
    depth: 0.6,
    coherence: 0.5,
    phase: 'exhale' as const
  });

  const getDefaultGSRData = () => ({
    conductance: 10,
    arousal: 0.3,
    baseline: 10
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.isActive) {
        stopMonitoring();
      }
    };
  }, [state.isActive, stopMonitoring]);

  return {
    // State
    ...state,
    
    // Actions
    initialize,
    startMonitoring,
    stopMonitoring,
    calibrate,
    
    // Computed values
    polarityBalance: getPolarityBalance(),
    shadowWorkReadiness: getShadowWorkReadiness(),
    
    // Utilities
    getMetricsHistory: () => [...metricsBuffer.current],
    clearMetricsBuffer: () => { metricsBuffer.current = []; }
  };
};