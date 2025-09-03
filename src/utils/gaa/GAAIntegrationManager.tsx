/**
 * GAA Integration Manager - Centralized integration point for all GAA enhancements
 */
import { GeometricFrequencyFixer, GeometryData } from './GeometricFrequencyFixer';
import { PLLDriftCorrection, PLLState } from './PLLDriftCorrection';
import { CollectiveReceiverGrid, ParticipantGridState } from './CollectiveReceiverGrid';
import { BroadcastChannelFallback } from './BroadcastChannelFallback';
import { StressTestRunner, StressTestResult } from './StressTestRunner';
import { SafetySystemAuditor, ComplianceResult } from './SafetySystemAuditor';
import { TelemetryHooks } from './TelemetryHooks';
import { AudioStreamer } from '../audio/AudioStreamer';

export interface GAAEnhancedState {
  frequencyStability: number;
  collectiveCoherence: number;
  safetyCompliance: ComplianceResult;
  participantCount: number;
  systemLoad: {
    cpu: number;
    memory: number;
    audioLatency: number;
  };
}

export class GAAIntegrationManager {
  private frequencyFixer: GeometricFrequencyFixer;
  private pllCorrection: PLLDriftCorrection;
  private receiverGrid: CollectiveReceiverGrid;
  private broadcastFallback: BroadcastChannelFallback;
  private stressRunner: StressTestRunner;
  private safetyAuditor: SafetySystemAuditor;
  private telemetry: TelemetryHooks;
  private audioStreamer: AudioStreamer;

  private currentState: GAAEnhancedState;
  private updateCallbacks: Array<(state: GAAEnhancedState) => void> = [];

  constructor() {
    // Initialize all components
    this.pllCorrection = new PLLDriftCorrection();
    this.receiverGrid = new CollectiveReceiverGrid();
    this.broadcastFallback = new BroadcastChannelFallback('gaa-collective');
    this.stressRunner = new StressTestRunner();
    this.safetyAuditor = new SafetySystemAuditor();
    this.telemetry = new TelemetryHooks();
    this.audioStreamer = new AudioStreamer();

    // Initialize state
    this.currentState = {
      frequencyStability: 1.0,
      collectiveCoherence: 0.5,
      safetyCompliance: this.safetyAuditor.auditSafetyCompliance({}),
      participantCount: 0,
      systemLoad: {
        cpu: 0,
        memory: 0,
        audioLatency: 0
      }
    };

    this.initializeIntegrations();
  }

  private async initializeIntegrations(): Promise<void> {
    try {
      // Setup telemetry
      this.telemetry.initializeMetrics('gaa-enhanced');
      
      // Setup broadcast channel fallback
      this.broadcastFallback.onMessage((data) => {
        this.handleCollectiveUpdate(data);
      });

      // Setup PLL drift correction
      this.pllCorrection.onDriftDetected((correction) => {
        this.telemetry.recordMetric('pll_drift_correction', correction.magnitude);
      });

      // Setup receiver grid
      this.receiverGrid.onParticipantUpdate((participants) => {
        this.updateState({
          participantCount: participants.length,
          collectiveCoherence: this.calculateCollectiveCoherence(participants)
        });
      });

      console.log('🎵 GAA Integration Manager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize GAA Integration Manager:', error);
    }
  }

  /**
   * Process geometric data with NaN frequency protection
   */
  processGeometry(geometry: GeometryData): number {
    const frequency = GeometricFrequencyFixer.calculateGeometricFrequency(geometry);
    
    // Record telemetry
    this.telemetry.recordMetric('geometric_frequency', frequency);
    
    // Update frequency stability
    const stability = Number.isFinite(frequency) ? 1.0 : 0.0;
    this.updateState({ frequencyStability: stability });
    
    return frequency;
  }

  /**
   * Correct PLL drift for collective synchronization
   */
  correctPLLDrift(currentPLL: PLLState, targetFrequency: number): PLLState {
    const correctedPLL = this.pllCorrection.correctDrift(currentPLL, targetFrequency);
    
    // Record correction applied
    this.telemetry.recordMetric('pll_correction_applied', 1);
    
    return correctedPLL;
  }

  /**
   * Update collective state from remote participants
   */
  updateCollectiveState(participantId: string, state: Partial<ParticipantGridState>): void {
    this.receiverGrid.updateParticipant(participantId, state);
    
    // Broadcast to other participants via fallback channel
    this.broadcastFallback.broadcast({
      type: 'participant_update',
      participantId,
      state,
      timestamp: Date.now()
    });
  }

  /**
   * Run comprehensive stress test
   */
  async runStressTest(config?: {
    participantCount?: number;
    oscillatorCount?: number;
    duration?: number;
  }): Promise<StressTestResult> {
    console.log('🧪 Starting GAA stress test...');
    
    const result = await this.stressRunner.runComprehensiveTest({
      participantCount: config?.participantCount || 32,
      oscillatorCount: config?.oscillatorCount || 32,
      testDuration: config?.duration || 60000, // 1 minute
      enableMobileTest: true,
      enableDesktopTest: true
    });

    // Update system load metrics
    this.updateState({
      systemLoad: {
        cpu: result.performance.peakCPU,
        memory: result.performance.peakMemory,
        audioLatency: result.performance.averageLatency
      }
    });

    this.telemetry.recordEvent('stress_test_completed', {
      passed: result.passed,
      participantCount: result.participantCount,
      duration: result.testDuration
    });

    return result;
  }

  /**
   * Audit safety compliance
   */
  auditSafety(metrics?: any): ComplianceResult {
    const result = this.safetyAuditor.auditSafetyCompliance(metrics || {});
    
    this.updateState({ safetyCompliance: result });
    
    this.telemetry.recordEvent('safety_audit_completed', {
      compliant: result.compliant,
      level: result.level,
      violationCount: result.violations.length
    });

    return result;
  }

  /**
   * Start audio streaming for collective sessions
   */
  async startAudioStreaming(): Promise<void> {
    await this.audioStreamer.start();
    this.telemetry.recordEvent('audio_streaming_started');
  }

  /**
   * Stop audio streaming
   */
  stopAudioStreaming(): void {
    this.audioStreamer.stop();
    this.telemetry.recordEvent('audio_streaming_stopped');
  }

  /**
   * Get current enhanced state
   */
  getState(): GAAEnhancedState {
    return { ...this.currentState };
  }

  /**
   * Subscribe to state updates
   */
  onStateUpdate(callback: (state: GAAEnhancedState) => void): () => void {
    this.updateCallbacks.push(callback);
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get telemetry data for monitoring
   */
  getTelemetryData(): any {
    return this.telemetry.getMetrics();
  }

  /**
   * Emergency stop - halt all GAA operations
   */
  emergencyStop(): void {
    console.warn('🚨 GAA Emergency Stop Activated');
    
    this.stopAudioStreaming();
    this.receiverGrid.clearAllParticipants();
    this.broadcastFallback.broadcast({
      type: 'emergency_stop',
      timestamp: Date.now()
    });
    
    this.telemetry.recordEvent('emergency_stop_activated');
  }

  /**
   * Cleanup and shutdown
   */
  shutdown(): void {
    this.audioStreamer.cleanup();
    this.telemetry.flush();
    console.log('🎵 GAA Integration Manager shutdown complete');
  }

  // Private helper methods
  private updateState(partial: Partial<GAAEnhancedState>): void {
    this.currentState = { ...this.currentState, ...partial };
    this.updateCallbacks.forEach(callback => callback(this.currentState));
  }

  private handleCollectiveUpdate(data: any): void {
    if (data.type === 'participant_update') {
      this.receiverGrid.updateParticipant(data.participantId, data.state);
    } else if (data.type === 'emergency_stop') {
      this.emergencyStop();
    }
  }

  private calculateCollectiveCoherence(participants: ParticipantGridState[]): number {
    if (participants.length === 0) return 0;
    
    const avgPhase = participants.reduce((sum, p) => sum + (p.phase || 0), 0) / participants.length;
    const phaseVariance = participants.reduce((sum, p) => {
      const diff = (p.phase || 0) - avgPhase;
      return sum + (diff * diff);
    }, 0) / participants.length;
    
    return Math.max(0, 1 - Math.sqrt(phaseVariance));
  }
}