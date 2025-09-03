/**
 * GAA Stress Test Runner
 * Comprehensive testing for 32 oscillators under high concurrency
 */

import { GeometricOscillator, NormalizedGeometry, GeometricOscillatorConfig } from './GeometricOscillator';
import { CollectiveReceiverGrid, ParticipantGridState } from './CollectiveReceiverGrid';
import { PLLDriftCorrection } from './PLLDriftCorrection';
import * as Tone from 'tone';

export interface StressTestConfig {
  maxOscillators: number;
  testDurationMs: number;
  rampUpTimeMs: number;
  targetFPS: number;
  simulatedLatency: number;
  networkJitter: number;
  cpuLoadTarget: number;
}

export interface StressTestResults {
  success: boolean;
  maxOscillatorsReached: number;
  averageFPS: number;
  minFPS: number;
  maxCPUUsage: number;
  memoryUsageMB: number;
  networkStats: {
    averageLatency: number;
    maxLatency: number;
    packetLoss: number;
    jitter: number;
  };
  audioStats: {
    dropouts: number;
    crackling: number;
    latency: number;
    quality: number;
  };
  stabilityScore: number;
  errors: string[];
  recommendations: string[];
}

export class StressTestRunner {
  private config: StressTestConfig;
  private geometricOscillator: GeometricOscillator | null = null;
  private collectiveGrid: CollectiveReceiverGrid | null = null;
  private pllCorrection: PLLDriftCorrection | null = null;
  private isRunning = false;
  private testResults: Partial<StressTestResults> = {};
  private performanceMonitor: {
    fps: number[];
    cpuUsage: number[];
    memoryUsage: number[];
    timestamps: number[];
  } = {
    fps: [],
    cpuUsage: [],
    memoryUsage: [],
    timestamps: []
  };

  constructor(config: Partial<StressTestConfig> = {}) {
    this.config = {
      maxOscillators: 32,
      testDurationMs: 60000, // 1 minute
      rampUpTimeMs: 10000, // 10 seconds
      targetFPS: 60,
      simulatedLatency: 50,
      networkJitter: 10,
      cpuLoadTarget: 0.8,
      ...config
    };

    console.log('🧪 Stress Test Runner initialized', this.config);
  }

  /**
   * Run comprehensive stress test
   */
  async runStressTest(): Promise<StressTestResults> {
    if (this.isRunning) {
      throw new Error('Stress test already running');
    }

    console.log('🧪 Starting GAA stress test...');
    this.isRunning = true;
    this.resetResults();

    try {
      // Initialize audio context
      await Tone.start();
      
      // Phase 1: Basic oscillator stress test
      await this.runOscillatorStressTest();
      
      // Phase 2: Collective mode stress test
      await this.runCollectiveStressTest();
      
      // Phase 3: Network simulation stress test
      await this.runNetworkStressTest();
      
      // Phase 4: Memory and CPU stress test
      await this.runSystemStressTest();
      
      // Compile final results
      return this.compileFinalResults();
      
    } catch (error) {
      console.error('🧪 Stress test failed:', error);
      this.testResults.errors = this.testResults.errors || [];
      this.testResults.errors.push(error.message);
      return this.compileFinalResults();
    } finally {
      this.cleanup();
      this.isRunning = false;
    }
  }

  /**
   * Test basic oscillator performance with 32 oscillators
   */
  private async runOscillatorStressTest(): Promise<void> {
    console.log('🧪 Phase 1: Basic oscillator stress test');
    
    const audioContext = new AudioContext();
    const config: GeometricOscillatorConfig = {
      baseFrequency: 432,
      gainLevel: 0.1,
      profile: 'balanced',
      modulationDepth: 0.3
    };
    
    this.geometricOscillator = new GeometricOscillator(audioContext, config);
    
    const startTime = performance.now();
    const oscillatorIds: string[] = [];
    
    // Gradually ramp up oscillators
    const rampUpStep = Math.floor(this.config.rampUpTimeMs / this.config.maxOscillators);
    
    for (let i = 0; i < this.config.maxOscillators; i++) {
      const geometry = this.generateTestGeometry(i);
      const id = `stress-osc-${i}`;
      
      const success = this.geometricOscillator.createGeometricOscillator(geometry, id);
      if (success) {
        oscillatorIds.push(id);
        this.testResults.maxOscillatorsReached = i + 1;
      } else {
        console.warn(`🧪 Failed to create oscillator ${i}`);
        break;
      }
      
      // Monitor performance during ramp-up
      this.recordPerformanceMetrics();
      
      // Wait between oscillator creation
      await this.delay(rampUpStep);
    }
    
    // Run at full load for the remaining test duration
    const remainingTime = this.config.testDurationMs - (performance.now() - startTime);
    const monitoringInterval = setInterval(() => {
      this.recordPerformanceMetrics();
      this.updateOscillators(oscillatorIds);
    }, 16); // ~60 FPS monitoring
    
    await this.delay(Math.max(0, remainingTime));
    clearInterval(monitoringInterval);
    
    console.log(`🧪 Phase 1 complete: ${oscillatorIds.length} oscillators created`);
  }

  /**
   * Test collective mode with simulated participants
   */
  private async runCollectiveStressTest(): Promise<void> {
    console.log('🧪 Phase 2: Collective mode stress test');
    
    this.collectiveGrid = new CollectiveReceiverGrid();
    this.pllCorrection = new PLLDriftCorrection({
      targetFrequency: 1.0,
      loopGain: 0.1,
      dampingFactor: 0.7
    });
    
    // Simulate multiple participants
    const participantCount = 16;
    const participants: string[] = [];
    
    for (let i = 0; i < participantCount; i++) {
      const participantId = `participant-${i}`;
      participants.push(participantId);
      
      // Add participant to grid
      const state: Partial<ParticipantGridState> & { userId: string } = {
        userId: participantId,
        phase: Math.random() * 2 * Math.PI,
        frequency: 0.8 + Math.random() * 0.4, // 0.8-1.2 Hz
        amplitude: 0.3 + Math.random() * 0.4, // 0.3-0.7
        position: {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10,
          z: (Math.random() - 0.5) * 2
        },
        resonance: 0.5 + Math.random() * 0.5,
        polarity: Math.random(),
        coherence: 0.6 + Math.random() * 0.4,
        latency: this.config.simulatedLatency + (Math.random() - 0.5) * this.config.networkJitter
      };
      
      this.collectiveGrid?.updateParticipant(state);
      
      // Add to PLL
      if (state.phase !== undefined) {
        this.pllCorrection.addReferencePhase(
          participantId,
          state.phase,
          performance.now(),
          state.latency
        );
      }
    }
    
    // Run collective simulation
    const collectiveStartTime = performance.now();
    const collectiveInterval = setInterval(() => {
      // Update all participants with slight variations
      participants.forEach(participantId => {
        const existing = this.collectiveGrid?.getFieldState().participants.find(p => p.userId === participantId);
        if (existing) {
          const updatedState: Partial<ParticipantGridState> & { userId: string } = {
            userId: participantId,
            phase: existing.phase + 0.1 + (Math.random() - 0.5) * 0.05,
            frequency: existing.frequency + (Math.random() - 0.5) * 0.01,
            coherence: Math.max(0.1, Math.min(1.0, existing.coherence + (Math.random() - 0.5) * 0.1))
          };
          
          this.collectiveGrid?.updateParticipant(updatedState);
          
          if (updatedState.phase !== undefined) {
            this.pllCorrection?.addReferencePhase(
              participantId,
              updatedState.phase,
              performance.now(),
              existing.latency
            );
          }
        }
      });
      
      this.recordPerformanceMetrics();
    }, 50); // 20 Hz update rate
    
    await this.delay(this.config.testDurationMs / 4);
    clearInterval(collectiveInterval);
    
    console.log('🧪 Phase 2 complete: Collective mode tested');
  }

  /**
   * Test network simulation with high latency and jitter
   */
  private async runNetworkStressTest(): Promise<void> {
    console.log('🧪 Phase 3: Network stress test');
    
    // Simulate poor network conditions
    const highLatency = 200;
    const highJitter = 50;
    let packetLoss = 0;
    let totalPackets = 0;
    
    const networkInterval = setInterval(() => {
      totalPackets++;
      
      // Simulate packet loss
      if (Math.random() < 0.05) { // 5% packet loss
        packetLoss++;
        return;
      }
      
      // Simulate high latency message
      const latency = highLatency + (Math.random() - 0.5) * highJitter;
      
      setTimeout(() => {
        // Simulate receiving phase sync message with high latency
        if (this.pllCorrection) {
          const randomPhase = Math.random() * 2 * Math.PI;
          this.pllCorrection.addReferencePhase(
            `network-sim-${Math.floor(Math.random() * 8)}`,
            randomPhase,
            performance.now() - latency,
            latency
          );
        }
      }, latency);
      
      this.recordPerformanceMetrics();
    }, 100); // 10 Hz message rate
    
    await this.delay(this.config.testDurationMs / 4);
    clearInterval(networkInterval);
    
    // Calculate network stats
    this.testResults.networkStats = {
      averageLatency: highLatency,
      maxLatency: highLatency + highJitter / 2,
      packetLoss: totalPackets > 0 ? packetLoss / totalPackets : 0,
      jitter: highJitter
    };
    
    console.log('🧪 Phase 3 complete: Network stress tested');
  }

  /**
   * Test system resources under load
   */
  private async runSystemStressTest(): Promise<void> {
    console.log('🧪 Phase 4: System resource stress test');
    
    // Simulate high CPU load
    const cpuLoadInterval = setInterval(() => {
      const start = performance.now();
      
      // Perform intensive calculations
      for (let i = 0; i < 10000; i++) {
        Math.sin(Math.random() * Math.PI) * Math.cos(Math.random() * Math.PI);
      }
      
      // Create temporary objects to stress memory
      const tempArray = new Array(1000).fill(0).map(() => ({
        data: new Float32Array(64),
        timestamp: performance.now(),
        id: Math.random().toString(36)
      }));
      
      // Keep reference briefly then release
      setTimeout(() => {
        tempArray.length = 0;
      }, 100);
      
      this.recordPerformanceMetrics();
    }, 16);
    
    await this.delay(this.config.testDurationMs / 4);
    clearInterval(cpuLoadInterval);
    
    console.log('🧪 Phase 4 complete: System stress tested');
  }

  /**
   * Generate test geometry for oscillators
   */
  private generateTestGeometry(index: number): NormalizedGeometry {
    const vertices: number[][] = [];
    const faces: number[][] = [];
    const normals: number[][] = [];
    
    // Generate vertices for a basic polyhedron
    const vertexCount = 8 + (index % 16); // Vary complexity
    for (let i = 0; i < vertexCount; i++) {
      const angle = (i / vertexCount) * 2 * Math.PI;
      const radius = 0.5 + (index / this.config.maxOscillators) * 0.5;
      vertices.push([
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 0.2
      ]);
    }
    
    // Generate faces (simplified)
    for (let i = 0; i < vertexCount - 2; i++) {
      faces.push([0, i + 1, i + 2]);
    }
    
    // Generate normals
    faces.forEach(() => {
      normals.push([0, 0, 1]); // Simplified normal
    });
    
    return {
      vertices,
      faces,
      normals,
      center: [
        (index % 8 - 4) * 0.5,
        (Math.floor(index / 8) % 4 - 2) * 0.5,
        0
      ],
      radius: 0.3 + (index / this.config.maxOscillators) * 0.7,
      sacredRatios: {
        phi: 1.618033988749,
        pi: Math.PI,
        sqrt2: Math.sqrt(2)
      }
    };
  }

  /**
   * Update oscillators with slight parameter changes
   */
  private updateOscillators(oscillatorIds: string[]): void {
    oscillatorIds.forEach((id, index) => {
      if (this.geometricOscillator) {
        const geometry = this.generateTestGeometry(index);
        
        // Slight variations to stress the update system
        geometry.radius += (Math.random() - 0.5) * 0.1;
        geometry.center[0] += (Math.random() - 0.5) * 0.1;
        geometry.center[1] += (Math.random() - 0.5) * 0.1;
        
        this.geometricOscillator.updateGeometricOscillator(id, geometry);
      }
    });
  }

  /**
   * Record performance metrics
   */
  private recordPerformanceMetrics(): void {
    const now = performance.now();
    
    // Calculate FPS
    const lastTimestamp = this.performanceMonitor.timestamps[this.performanceMonitor.timestamps.length - 1] || now - 16;
    const fps = 1000 / (now - lastTimestamp);
    this.performanceMonitor.fps.push(fps);
    
    // Estimate CPU usage (simplified)
    const cpuUsage = Math.min(1, Math.max(0, (60 - fps) / 60 + Math.random() * 0.2));
    this.performanceMonitor.cpuUsage.push(cpuUsage);
    
    // Estimate memory usage (simplified)
    const memoryUsage = (performance as any).memory ? 
      (performance as any).memory.usedJSHeapSize / (1024 * 1024) : 
      50 + Math.random() * 100;
    this.performanceMonitor.memoryUsage.push(memoryUsage);
    
    this.performanceMonitor.timestamps.push(now);
    
    // Keep only recent metrics
    const maxMetrics = 1000;
    if (this.performanceMonitor.fps.length > maxMetrics) {
      this.performanceMonitor.fps.shift();
      this.performanceMonitor.cpuUsage.shift();
      this.performanceMonitor.memoryUsage.shift();
      this.performanceMonitor.timestamps.shift();
    }
  }

  /**
   * Compile final test results
   */
  private compileFinalResults(): StressTestResults {
    const fps = this.performanceMonitor.fps;
    const cpuUsage = this.performanceMonitor.cpuUsage;
    const memoryUsage = this.performanceMonitor.memoryUsage;
    
    const averageFPS = fps.length > 0 ? fps.reduce((a, b) => a + b, 0) / fps.length : 0;
    const minFPS = fps.length > 0 ? Math.min(...fps) : 0;
    const maxCPUUsage = cpuUsage.length > 0 ? Math.max(...cpuUsage) : 0;
    const avgMemoryUsage = memoryUsage.length > 0 ? memoryUsage.reduce((a, b) => a + b, 0) / memoryUsage.length : 0;
    
    // Calculate stability score
    const fpsStability = fps.length > 0 ? 1 - (Math.max(...fps) - Math.min(...fps)) / averageFPS : 0;
    const cpuStability = cpuUsage.length > 0 ? 1 - (Math.max(...cpuUsage) - Math.min(...cpuUsage)) : 0;
    const stabilityScore = (fpsStability + cpuStability) / 2;
    
    // Generate recommendations
    const recommendations: string[] = [];
    if (averageFPS < this.config.targetFPS * 0.8) {
      recommendations.push('Consider reducing oscillator count or lowering audio quality');
    }
    if (maxCPUUsage > 0.9) {
      recommendations.push('CPU usage too high - optimize audio processing');
    }
    if (avgMemoryUsage > 500) {
      recommendations.push('High memory usage detected - check for memory leaks');
    }
    if (stabilityScore < 0.7) {
      recommendations.push('System stability low - consider performance optimizations');
    }
    
    const success = averageFPS >= this.config.targetFPS * 0.8 && 
                   maxCPUUsage < 0.95 && 
                   stabilityScore > 0.6 &&
                   (this.testResults.maxOscillatorsReached || 0) >= this.config.maxOscillators * 0.8;
    
    return {
      success,
      maxOscillatorsReached: this.testResults.maxOscillatorsReached || 0,
      averageFPS,
      minFPS,
      maxCPUUsage,
      memoryUsageMB: avgMemoryUsage,
      networkStats: this.testResults.networkStats || {
        averageLatency: 0,
        maxLatency: 0,
        packetLoss: 0,
        jitter: 0
      },
      audioStats: {
        dropouts: 0, // Would be measured in real implementation
        crackling: 0, // Would be measured in real implementation
        latency: this.config.simulatedLatency,
        quality: stabilityScore
      },
      stabilityScore,
      errors: this.testResults.errors || [],
      recommendations
    };
  }

  /**
   * Reset test results
   */
  private resetResults(): void {
    this.testResults = {
      errors: [],
      maxOscillatorsReached: 0
    };
    
    this.performanceMonitor = {
      fps: [],
      cpuUsage: [],
      memoryUsage: [],
      timestamps: []
    };
  }

  /**
   * Cleanup test resources
   */
  private cleanup(): void {
    if (this.geometricOscillator) {
      this.geometricOscillator.destroy();
      this.geometricOscillator = null;
    }
    
    if (this.collectiveGrid) {
      this.collectiveGrid.destroy();
      this.collectiveGrid = null;
    }
    
    this.pllCorrection = null;
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if test is currently running
   */
  isTestRunning(): boolean {
    return this.isRunning;
  }
}
