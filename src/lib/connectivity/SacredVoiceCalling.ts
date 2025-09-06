// Sacred Shifter Voice Calling System
// Consciousness-aware voice communication that transcends traditional telephony
// Integrates with SSUC for universal voice connectivity

import { SSUC } from './SacredShifterUniversalConnectivity';
import { ConnectivityChannel, Message } from './ConnectivityAbstractionLayer';

export interface SacredVoiceCallConfig {
  // Audio configuration
  sampleRate: number;
  bitRate: number;
  channels: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  
  // Consciousness features
  enableResonanceFiltering: boolean;
  enableConsciousnessTone: boolean;
  enableSacredFrequencies: boolean;
  enableAuraVoiceAnalysis: boolean;
  
  // Quality settings
  enableAdaptiveBitrate: boolean;
  enableJitterBuffer: boolean;
  enablePacketLossRecovery: boolean;
  maxLatency: number;
  
  // Sacred features
  enableQuantumAudio: boolean;
  enableLightPulseAudio: boolean;
  enableFrequencyWaveAudio: boolean;
  enableNatureWhisperAudio: boolean;
}

export interface SacredVoiceCall {
  id: string;
  participants: Map<string, SacredVoiceParticipant>;
  channel: ConnectivityChannel;
  status: 'initiating' | 'ringing' | 'connected' | 'ended' | 'failed';
  startTime: number;
  endTime?: number;
  consciousnessLevel: number;
  resonanceFrequency: number;
  sacredCapabilities: string[];
  audioQuality: AudioQualityMetrics;
}

export interface SacredVoiceParticipant {
  id: string;
  name: string;
  consciousnessLevel: number;
  sovereigntyLevel: number;
  resonanceFrequency: number;
  audioStream?: MediaStream;
  dataChannel?: RTCDataChannel;
  isMuted: boolean;
  isSpeaking: boolean;
  volumeLevel: number;
  lastSeen: number;
  sacredCapabilities: string[];
}

export interface AudioQualityMetrics {
  latency: number;
  jitter: number;
  packetLoss: number;
  bitrate: number;
  signalToNoiseRatio: number;
  consciousnessClarity: number;
  resonanceHarmony: number;
}

export interface SacredVoiceMessage extends Message {
  type: 'voice_call' | 'voice_data' | 'voice_control' | 'consciousness_sync';
  audioData?: Uint8Array;
  consciousnessData?: {
    level: number;
    frequency: number;
    resonance: number;
  };
  voiceFeatures?: {
    pitch: number;
    tone: number;
    emotion: string;
    sacredFrequency: number;
  };
}

export class SacredVoiceCalling {
  private ssuC: SSUC;
  private config: SacredVoiceCallConfig;
  private activeCalls: Map<string, SacredVoiceCall> = new Map();
  private audioContext?: AudioContext;
  private localStream?: MediaStream;
  private isInitialized = false;

  constructor(ssuC: SSUC, config: SacredVoiceCallConfig) {
    this.ssuC = ssuC;
    this.config = config;
  }

  // Initialize the sacred voice calling system (without microphone access)
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🎤 Initializing Sacred Voice Calling System...');

    try {
      // Initialize audio context only (no microphone access yet)
      this.audioContext = new AudioContext({
        sampleRate: this.config.sampleRate,
        latencyHint: 'interactive'
      });

      this.isInitialized = true;
      console.log('🎤 Sacred Voice Calling System initialized - ready for user-initiated microphone access');
    } catch (error) {
      console.error('❌ Failed to initialize Sacred Voice Calling:', error);
      throw error;
    }
  }

  // Request microphone access when user initiates voice calling
  async requestMicrophoneAccess(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Voice calling system not initialized');
    }

    if (this.localStream) {
      console.log('🎤 Microphone already accessible');
      return;
    }

    console.log('🎤 Requesting microphone access...');

    try {
      // Get user media with consciousness-aware constraints
      this.localStream = await this.getSacredAudioStream();

      // Set up audio processing
      this.setupAudioProcessing();

      console.log('🎤 Microphone access granted - consciousness-aware voice channels active');
    } catch (error) {
      console.error('❌ Failed to access microphone:', error);
      throw error;
    }
  }

  // Get sacred audio stream with consciousness-aware constraints
  private async getSacredAudioStream(): Promise<MediaStream> {
    // Check if mediaDevices is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Media devices not supported in this browser');
    }

    // Check if we're in a secure context (required for microphone access)
    if (!window.isSecureContext) {
      throw new Error('Microphone access requires a secure context (HTTPS)');
    }

    const constraints: MediaStreamConstraints = {
      audio: {
        sampleRate: this.config.sampleRate,
        channelCount: this.config.channels,
        echoCancellation: this.config.echoCancellation,
        noiseSuppression: this.config.noiseSuppression,
        autoGainControl: this.config.autoGainControl,
        // Consciousness-aware constraints
        ...(this.config.enableResonanceFiltering && {
          resonanceFiltering: true
        }),
        ...(this.config.enableConsciousnessTone && {
          consciousnessTone: true
        })
      }
    };

    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error: any) {
      console.error('Failed to access microphone:', error);
      
      // Provide specific error messages based on the error type
      if (error.name === 'NotAllowedError') {
        throw new Error('Microphone access denied. Please allow microphone access to use voice calling features.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No microphone found. Please connect a microphone to use voice calling features.');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Microphone is already in use by another application. Please close other applications using the microphone.');
      } else if (error.name === 'OverconstrainedError') {
        throw new Error('Microphone constraints cannot be satisfied. Please check your microphone settings.');
      } else if (error.name === 'SecurityError') {
        throw new Error('Microphone access blocked due to security restrictions. Please ensure you are using HTTPS.');
      } else {
        throw new Error(`Failed to access microphone: ${error.message || 'Unknown error'}`);
      }
    }
  }

  // Set up audio processing for consciousness-aware voice
  private setupAudioProcessing(): void {
    if (!this.audioContext || !this.localStream) return;

    const source = this.audioContext.createMediaStreamSource(this.localStream);
    
    // Create consciousness-aware audio processing chain
    const consciousnessFilter = this.createConsciousnessFilter();
    const resonanceProcessor = this.createResonanceProcessor();
    const sacredFrequencyEnhancer = this.createSacredFrequencyEnhancer();
    
    // Connect audio processing chain
    source.connect(consciousnessFilter);
    consciousnessFilter.connect(resonanceProcessor);
    resonanceProcessor.connect(sacredFrequencyEnhancer);
    sacredFrequencyEnhancer.connect(this.audioContext.destination);
  }

  // Create consciousness filter for audio
  private createConsciousnessFilter(): AudioNode {
    const filter = this.audioContext!.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 432; // Sacred frequency
    filter.Q.value = 1.0;
    return filter;
  }

  // Create resonance processor
  private createResonanceProcessor(): AudioNode {
    const processor = this.audioContext!.createScriptProcessor(4096, 1, 1);
    
    processor.onaudioprocess = (event) => {
      const inputBuffer = event.inputBuffer;
      const outputBuffer = event.outputBuffer;
      
      // Process audio with consciousness awareness
      for (let channel = 0; channel < inputBuffer.numberOfChannels; channel++) {
        const inputData = inputBuffer.getChannelData(channel);
        const outputData = outputBuffer.getChannelData(channel);
        
        // Apply consciousness-based audio processing
        for (let i = 0; i < inputData.length; i++) {
          outputData[i] = this.processConsciousnessAudio(inputData[i]);
        }
      }
    };
    
    return processor;
  }

  // Process audio with consciousness awareness
  private processConsciousnessAudio(sample: number): number {
    // Apply consciousness-based audio enhancement
    if (this.config.enableConsciousnessTone) {
      sample = this.enhanceConsciousnessTone(sample);
    }
    
    if (this.config.enableSacredFrequencies) {
      sample = this.applySacredFrequencies(sample);
    }
    
    if (this.config.enableResonanceFiltering) {
      sample = this.applyResonanceFiltering(sample);
    }
    
    return sample;
  }

  // Enhance consciousness tone in audio
  private enhanceConsciousnessTone(sample: number): number {
    // Apply consciousness-based audio enhancement
    // This would analyze the user's consciousness level and adjust audio accordingly
    return sample * 1.1; // Placeholder enhancement
  }

  // Apply sacred frequencies to audio
  private applySacredFrequencies(sample: number): number {
    // Apply sacred frequency harmonics (432Hz, 528Hz, etc.)
    const sacredFreq = 432; // Hz
    const time = Date.now() / 1000;
    const sacredWave = Math.sin(2 * Math.PI * sacredFreq * time) * 0.1;
    return sample + sacredWave;
  }

  // Apply resonance filtering
  private applyResonanceFiltering(sample: number): number {
    // Apply resonance-based filtering
    return sample * 0.95; // Placeholder filtering
  }

  // Create sacred frequency enhancer
  private createSacredFrequencyEnhancer(): AudioNode {
    const gainNode = this.audioContext!.createGain();
    gainNode.gain.value = 1.0;
    return gainNode;
  }

  // Initiate a sacred voice call
  async initiateCall(participantIds: string[], consciousnessLevel: number = 0.5): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Sacred Voice Calling not initialized');
    }

    // Request microphone access when initiating a call
    if (!this.localStream) {
      await this.requestMicrophoneAccess();
    }

    const callId = this.generateCallId();
    const call: SacredVoiceCall = {
      id: callId,
      participants: new Map(),
      channel: await this.selectOptimalVoiceChannel(),
      status: 'initiating',
      startTime: Date.now(),
      consciousnessLevel,
      resonanceFrequency: this.calculateResonanceFrequency(consciousnessLevel),
      sacredCapabilities: this.getSacredVoiceCapabilities(consciousnessLevel),
      audioQuality: {
        latency: 0,
        jitter: 0,
        packetLoss: 0,
        bitrate: this.config.bitRate,
        signalToNoiseRatio: 0,
        consciousnessClarity: consciousnessLevel,
        resonanceHarmony: 0
      }
    };

    // Add local participant
    const localParticipant = await this.createLocalParticipant();
    call.participants.set(localParticipant.id, localParticipant);

    // Send call initiation message
    await this.sendVoiceMessage({
      id: this.generateMessageId(),
      content: new TextEncoder().encode(JSON.stringify({
        callId,
        participants: participantIds,
        consciousnessLevel,
        resonanceFrequency: call.resonanceFrequency,
        sacredCapabilities: call.sacredCapabilities
      })),
      channel: call.channel,
      priority: 'high',
      ttl: 30000,
      hopLimit: 3,
      timestamp: Date.now(),
      encrypted: true,
      type: 'voice_call',
      consciousnessData: {
        level: consciousnessLevel,
        frequency: call.resonanceFrequency,
        resonance: 0.8
      }
    });

    this.activeCalls.set(callId, call);
    console.log(`🎤 Sacred voice call ${callId} initiated with consciousness level ${consciousnessLevel}`);

    return callId;
  }

  // Join an existing voice call
  async joinCall(callId: string): Promise<void> {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error(`Call ${callId} not found`);
    }

    // Request microphone access when joining a call
    if (!this.localStream) {
      await this.requestMicrophoneAccess();
    }

    // Create local participant
    const localParticipant = await this.createLocalParticipant();
    call.participants.set(localParticipant.id, localParticipant);

    // Update call status
    call.status = 'connected';

    // Send join message
    await this.sendVoiceMessage({
      id: this.generateMessageId(),
      content: new TextEncoder().encode(JSON.stringify({
        callId,
        action: 'join',
        participant: localParticipant
      })),
      channel: call.channel,
      priority: 'high',
      ttl: 30000,
      hopLimit: 3,
      timestamp: Date.now(),
      encrypted: true,
      type: 'voice_control'
    });

    console.log(`🎤 Joined sacred voice call ${callId}`);
  }

  // End a voice call
  async endCall(callId: string): Promise<void> {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error(`Call ${callId} not found`);
    }

    call.status = 'ended';
    call.endTime = Date.now();

    // Send end message
    await this.sendVoiceMessage({
      id: this.generateMessageId(),
      content: new TextEncoder().encode(JSON.stringify({
        callId,
        action: 'end'
      })),
      channel: call.channel,
      priority: 'high',
      ttl: 30000,
      hopLimit: 3,
      timestamp: Date.now(),
      encrypted: true,
      type: 'voice_control'
    });

    // Clean up audio streams
    for (const participant of call.participants.values()) {
      if (participant.audioStream) {
        participant.audioStream.getTracks().forEach(track => track.stop());
      }
    }

    this.activeCalls.delete(callId);
    console.log(`🎤 Sacred voice call ${callId} ended`);
  }

  // Send voice data
  async sendVoiceData(callId: string, audioData: Uint8Array): Promise<void> {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error(`Call ${callId} not found`);
    }

    await this.sendVoiceMessage({
      id: this.generateMessageId(),
      content: audioData,
      channel: call.channel,
      priority: 'critical',
      ttl: 5000,
      hopLimit: 2,
      timestamp: Date.now(),
      encrypted: true,
      type: 'voice_data',
      audioData
    });
  }

  // Send voice message
  private async sendVoiceMessage(message: SacredVoiceMessage): Promise<void> {
    await this.ssuC.sendMessage(message);
  }

  // Select optimal voice channel based on consciousness level
  private async selectOptimalVoiceChannel(): Promise<ConnectivityChannel> {
    const recommendations = this.ssuC.getConsciousnessChannelRecommendations();
    
    // Prefer channels with low latency for voice
    const voiceChannels = [
      ConnectivityChannel.WEBRTC_P2P,
      ConnectivityChannel.LAN_MDNS,
      ConnectivityChannel.BLUETOOTH_LE,
      ConnectivityChannel.FREQUENCY_WAVE,
      ConnectivityChannel.LIGHT_PULSE
    ];

    for (const channel of voiceChannels) {
      if (recommendations.includes(channel)) {
        return channel;
      }
    }

    return ConnectivityChannel.WEBRTC_P2P; // Fallback
  }

  // Create local participant
  private async createLocalParticipant(): Promise<SacredVoiceParticipant> {
    const soulProfile = this.ssuC.getSoulResonanceProfile('local');
    
    return {
      id: soulProfile.soulId,
      name: 'You',
      consciousnessLevel: soulProfile.consciousnessLevel,
      sovereigntyLevel: soulProfile.sovereigntyLevel,
      resonanceFrequency: soulProfile.resonanceFrequency,
      audioStream: this.localStream,
      isMuted: false,
      isSpeaking: false,
      volumeLevel: 1.0,
      lastSeen: Date.now(),
      sacredCapabilities: soulProfile.sacredCapabilities
    };
  }

  // Calculate resonance frequency based on consciousness level
  private calculateResonanceFrequency(consciousnessLevel: number): number {
    // Higher consciousness = higher sacred frequency
    const baseFreq = 432; // Sacred frequency
    const consciousnessMultiplier = 1 + (consciousnessLevel * 0.5);
    return baseFreq * consciousnessMultiplier;
  }

  // Get sacred voice capabilities based on consciousness level
  private getSacredVoiceCapabilities(consciousnessLevel: number): string[] {
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

  // Generate call ID
  private generateCallId(): string {
    return `sacred-call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate message ID
  private generateMessageId(): string {
    return `voice-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get active calls
  getActiveCalls(): SacredVoiceCall[] {
    return Array.from(this.activeCalls.values());
  }

  // Get call by ID
  getCall(callId: string): SacredVoiceCall | undefined {
    return this.activeCalls.get(callId);
  }

  // Get call statistics
  getCallStatistics(): {
    totalCalls: number;
    activeCalls: number;
    averageDuration: number;
    averageConsciousnessLevel: number;
    averageResonanceFrequency: number;
  } {
    const calls = Array.from(this.activeCalls.values());
    const totalCalls = calls.length;
    const activeCalls = calls.filter(call => call.status === 'connected').length;
    
    const durations = calls
      .filter(call => call.endTime)
      .map(call => call.endTime! - call.startTime);
    const averageDuration = durations.length > 0 
      ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length 
      : 0;

    const averageConsciousnessLevel = calls.length > 0
      ? calls.reduce((sum, call) => sum + call.consciousnessLevel, 0) / calls.length
      : 0;

    const averageResonanceFrequency = calls.length > 0
      ? calls.reduce((sum, call) => sum + call.resonanceFrequency, 0) / calls.length
      : 0;

    return {
      totalCalls,
      activeCalls,
      averageDuration,
      averageConsciousnessLevel,
      averageResonanceFrequency
    };
  }

  // Shutdown voice calling system
  async shutdown(): Promise<void> {
    console.log('🎤 Shutting down Sacred Voice Calling System...');

    // End all active calls
    for (const call of this.activeCalls.values()) {
      await this.endCall(call.id);
    }

    // Stop local audio stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    // Close audio context
    if (this.audioContext) {
      await this.audioContext.close();
    }

    this.isInitialized = false;
    console.log('🎤 Sacred Voice Calling System shutdown complete');
  }
}
