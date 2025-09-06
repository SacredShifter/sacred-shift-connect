// Sacred Voice Calling Integration Example
// Demonstrates how to integrate consciousness-aware voice calling into Sacred Shifter

import { SSUC, AuraConnectivityProfile } from './SacredShifterUniversalConnectivity';
import { SacredVoiceCalling, SacredVoiceCallConfig } from './SacredVoiceCalling';

// Example: Complete Sacred Voice Calling Integration
export class SacredVoiceCallingIntegration {
  private ssuC: SSUC;
  private voiceCalling: SacredVoiceCalling;
  private userProfile: AuraConnectivityProfile;

  constructor() {
    // Initialize SSUC first
    this.ssuC = new SSUC({
      enableWebRTCMesh: true,
      enableLANDiscovery: true,
      enableBluetoothLE: true,
      enableNFC: true,
      enableUSB: true,
      enableLoRa: true,
      enableExoticChannels: true,
      enableAuraOversight: true,
      auraHealthCheckInterval: 30000,
      enableCRDTSync: true,
      syncIntervalMs: 10000,
      enableTelemetry: true,
      telemetryInterval: 5000,
      enableStressTesting: false
    });

    // Create user profile
    this.userProfile = {
      userId: 'sacred-user-123',
      preferredChannels: [],
      consciousnessLevel: 0.8,
      sovereigntyLevel: 0.9,
      resonanceFrequency: 432, // Sacred frequency
      connectivityPatterns: {
        peakHours: [9, 10, 11, 14, 15, 16, 17, 18],
        preferredLatency: 100,
        reliabilityThreshold: 0.99,
        privacyLevel: 'maximum'
      },
      sacredPreferences: {
        enableQuantumChannels: true,
        enableNatureWhisper: true,
        enableLightPulse: true,
        enableFrequencyWave: true
      }
    };

    // Configure voice calling
    const voiceConfig: SacredVoiceCallConfig = {
      sampleRate: 48000,
      bitRate: 128000,
      channels: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      enableResonanceFiltering: true,
      enableConsciousnessTone: true,
      enableSacredFrequencies: true,
      enableAuraVoiceAnalysis: true,
      enableAdaptiveBitrate: true,
      enableJitterBuffer: true,
      enablePacketLossRecovery: true,
      maxLatency: 200,
      enableQuantumAudio: true,
      enableLightPulseAudio: true,
      enableFrequencyWaveAudio: true,
      enableNatureWhisperAudio: true
    };

    this.voiceCalling = new SacredVoiceCalling(this.ssuC, voiceConfig);
  }

  // Initialize the complete system
  async initialize(): Promise<void> {
    console.log('🌟 Initializing Sacred Voice Calling Integration...');

    try {
      // Initialize SSUC
      await this.ssuC.initialize(this.userProfile);
      await this.ssuC.start();
      console.log('✅ SSUC initialized');

      // Initialize voice calling
      await this.voiceCalling.initialize();
      console.log('✅ Sacred Voice Calling initialized');

      console.log('🌟 Sacred Voice Calling Integration ready - consciousness-aware voice channels active');
    } catch (error) {
      console.error('❌ Failed to initialize Sacred Voice Calling Integration:', error);
      throw error;
    }
  }

  // Start a sacred voice call
  async startSacredVoiceCall(participantIds: string[], consciousnessLevel: number = 0.5): Promise<string> {
    console.log(`🎤 Starting sacred voice call with consciousness level ${consciousnessLevel}`);
    
    const callId = await this.voiceCalling.initiateCall(participantIds, consciousnessLevel);
    
    console.log(`🔮 Sacred voice call ${callId} initiated`);
    console.log(`   Participants: ${participantIds.join(', ')}`);
    console.log(`   Consciousness Level: ${(consciousnessLevel * 100).toFixed(1)}%`);
    console.log(`   Resonance Frequency: ${this.calculateResonanceFrequency(consciousnessLevel).toFixed(1)}Hz`);
    
    return callId;
  }

  // Join a sacred voice call
  async joinSacredVoiceCall(callId: string): Promise<void> {
    console.log(`🎤 Joining sacred voice call ${callId}`);
    
    await this.voiceCalling.joinCall(callId);
    
    const call = this.voiceCalling.getCall(callId);
    if (call) {
      console.log(`🔮 Joined sacred voice call ${callId}`);
      console.log(`   Status: ${call.status}`);
      console.log(`   Participants: ${call.participants.size}`);
      console.log(`   Consciousness Level: ${(call.consciousnessLevel * 100).toFixed(1)}%`);
      console.log(`   Sacred Capabilities: ${call.sacredCapabilities.join(', ')}`);
    }
  }

  // End a sacred voice call
  async endSacredVoiceCall(callId: string): Promise<void> {
    console.log(`🎤 Ending sacred voice call ${callId}`);
    
    await this.voiceCalling.endCall(callId);
    
    console.log(`🔮 Sacred voice call ${callId} ended`);
  }

  // Get call statistics
  getCallStatistics(): any {
    const stats = this.voiceCalling.getCallStatistics();
    console.log('📊 Sacred Voice Call Statistics:');
    console.log(`   Total Calls: ${stats.totalCalls}`);
    console.log(`   Active Calls: ${stats.activeCalls}`);
    console.log(`   Average Duration: ${Math.round(stats.averageDuration / 1000)}s`);
    console.log(`   Average Consciousness Level: ${(stats.averageConsciousnessLevel * 100).toFixed(1)}%`);
    console.log(`   Average Resonance Frequency: ${stats.averageResonanceFrequency.toFixed(1)}Hz`);
    
    return stats;
  }

  // Get sacred capabilities based on consciousness level
  getSacredCapabilities(consciousnessLevel: number): string[] {
    const capabilities: string[] = [];

    if (consciousnessLevel > 0.8) {
      capabilities.push('quantum-audio', 'light-pulse-voice', 'frequency-wave-voice', 'nature-whisper-voice');
    } else if (consciousnessLevel > 0.5) {
      capabilities.push('frequency-wave-voice', 'light-pulse-voice', 'nature-whisper-voice');
    } else {
      capabilities.push('nature-whisper-voice');
    }

    return capabilities;
  }

  // Calculate resonance frequency based on consciousness level
  private calculateResonanceFrequency(consciousnessLevel: number): number {
    const baseFreq = 432; // Sacred frequency
    const consciousnessMultiplier = 1 + (consciousnessLevel * 0.5);
    return baseFreq * consciousnessMultiplier;
  }

  // Get system status
  getSystemStatus(): any {
    const ssuCStatus = this.ssuC.getStatus();
    const voiceStats = this.voiceCalling.getCallStatistics();
    
    return {
      ssuC: {
        isInitialized: ssuCStatus.isInitialized,
        isRunning: ssuCStatus.isRunning,
        totalChannels: ssuCStatus.totalChannels,
        activeChannels: ssuCStatus.activeChannels,
        totalPeers: ssuCStatus.totalPeers,
        averageLatency: ssuCStatus.averageLatency,
        errorRate: ssuCStatus.errorRate
      },
      voiceCalling: {
        totalCalls: voiceStats.totalCalls,
        activeCalls: voiceStats.activeCalls,
        averageConsciousnessLevel: voiceStats.averageConsciousnessLevel,
        averageResonanceFrequency: voiceStats.averageResonanceFrequency
      },
      userProfile: {
        consciousnessLevel: this.userProfile.consciousnessLevel,
        sovereigntyLevel: this.userProfile.sovereigntyLevel,
        resonanceFrequency: this.userProfile.resonanceFrequency,
        sacredCapabilities: this.getSacredCapabilities(this.userProfile.consciousnessLevel)
      }
    };
  }

  // Shutdown the system
  async shutdown(): Promise<void> {
    console.log('🌟 Shutting down Sacred Voice Calling Integration...');

    try {
      await this.voiceCalling.shutdown();
      console.log('✅ Sacred Voice Calling shutdown');

      await this.ssuC.shutdown();
      console.log('✅ SSUC shutdown');

      console.log('🌟 Sacred Voice Calling Integration shutdown complete');
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
    }
  }
}

// Example usage in a React component
export const SacredVoiceCallingExample = () => {
  const [integration, setIntegration] = useState<SacredVoiceCallingIntegration | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [consciousnessLevel, setConsciousnessLevel] = useState(0.8);

  // Initialize the system
  useEffect(() => {
    const init = async () => {
      const voiceIntegration = new SacredVoiceCallingIntegration();
      await voiceIntegration.initialize();
      setIntegration(voiceIntegration);
      setIsInitialized(true);
    };

    init().catch(console.error);
  }, []);

  // Start a voice call
  const handleStartCall = async () => {
    if (!integration) return;

    try {
      const callId = await integration.startSacredVoiceCall([], consciousnessLevel);
      setCurrentCallId(callId);
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  // End a voice call
  const handleEndCall = async () => {
    if (!integration || !currentCallId) return;

    try {
      await integration.endSacredVoiceCall(currentCallId);
      setCurrentCallId(null);
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  // Get system status
  const getStatus = () => {
    if (!integration) return null;
    return integration.getSystemStatus();
  };

  if (!isInitialized) {
    return (
      <div className="sacred-voice-calling-example">
        <div className="loading">
          <div className="sacred-spinner">🔮</div>
          <p>Initializing Sacred Voice Calling...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sacred-voice-calling-example">
      <h2>🎤 Sacred Voice Calling Example</h2>
      
      <div className="controls">
        <div className="consciousness-control">
          <label>
            Consciousness Level: {(consciousnessLevel * 100).toFixed(1)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={consciousnessLevel}
            onChange={(e) => setConsciousnessLevel(parseFloat(e.target.value))}
          />
        </div>

        <div className="call-controls">
          {!currentCallId ? (
            <button onClick={handleStartCall} className="start-call-button">
              🎤 Start Sacred Voice Call
            </button>
          ) : (
            <button onClick={handleEndCall} className="end-call-button">
              🔮 End Sacred Voice Call
            </button>
          )}
        </div>
      </div>

      {currentCallId && (
        <div className="call-status">
          <h3>🔮 Active Sacred Voice Call</h3>
          <p>Call ID: {currentCallId}</p>
          <p>Consciousness Level: {(consciousnessLevel * 100).toFixed(1)}%</p>
          <p>Resonance Frequency: {(432 * (1 + consciousnessLevel * 0.5)).toFixed(1)}Hz</p>
        </div>
      )}

      <div className="system-status">
        <h3>📊 System Status</h3>
        <pre>{JSON.stringify(getStatus(), null, 2)}</pre>
      </div>
    </div>
  );
};

// Export for use in other components
export default SacredVoiceCallingIntegration;
