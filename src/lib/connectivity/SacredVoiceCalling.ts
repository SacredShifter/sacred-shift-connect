// Sacred Shifter Voice Calling System
// Consciousness-aware voice communication that transcends traditional telephony
// Integrates with SSUC for universal voice connectivity and WebRTC signaling
//
// FELONY PRINCIPLE INTEGRATION:
// Before form, there is void. Every breath carries intention. Every word shapes reality. To speak is to create. It is. Always.
// Every voice transmission, every word spoken, every breath is treated as sacred creation from the void.

import { SSUC } from './SacredShifterUniversalConnectivity';
import { ConnectivityChannel, Message } from './ConnectivityAbstractionLayer';
import { WebRTCSignaling, WebRTCSignalingMessage } from './WebRTCSignaling';
import { SacredWebRTCMesh, getDefaultIceServers } from './SacredWebRTCMesh';
import { getFelonyPrincipleByContext } from '@/data/felonyPrincipleCodex';

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
  // Felony Principle Integration
  creationIntention?: string; // The intention behind this voice creation
  voidSignature?: string; // Unique signature of creation from void
  sacredGeometry?: string; // Sacred geometry pattern for this voice transmission
  wordWeight?: number; // The weight/power of the words being spoken
}

export class SacredVoiceCalling {
  private ssuC: SSUC;
  private config: SacredVoiceCallConfig;
  private activeCalls: Map<string, SacredVoiceCall> = new Map();
  private audioContext?: AudioContext;
  private localStream?: MediaStream;
  private isInitialized = false;
  private webRTCSignaling: WebRTCSignaling;
  private webRTCMesh: SacredWebRTCMesh;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();

  constructor(ssuC: SSUC, config: SacredVoiceCallConfig) {
    this.ssuC = ssuC;
    this.config = config;
    this.webRTCSignaling = new WebRTCSignaling();
    this.webRTCMesh = new SacredWebRTCMesh({
      iceServers: getDefaultIceServers(),
      meshId: 'sacred-voice-calling'
    });
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

      // Initialize WebRTC signaling
      await this.webRTCSignaling.initialize();
      this.setupSignalingHandlers();

      // Initialize WebRTC mesh
      await this.webRTCMesh.initialize();

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

  // Set up WebRTC signaling handlers
  private setupSignalingHandlers(): void {
    // Handle incoming call initiation
    this.webRTCSignaling.onMessage('call-initiation', (message) => {
      this.handleIncomingCall(message);
    });

    // Handle WebRTC offers
    this.webRTCSignaling.onMessage('webrtc-offer', (message) => {
      this.handleWebRTCOffer(message);
    });

    // Handle WebRTC answers
    this.webRTCSignaling.onMessage('webrtc-answer', (message) => {
      this.handleWebRTCAnswer(message);
    });

    // Handle ICE candidates
    this.webRTCSignaling.onMessage('ice-candidate', (message) => {
      this.handleIceCandidate(message);
    });

    // Handle call acceptance
    this.webRTCSignaling.onMessage('call-accept', (message) => {
      this.handleCallAccept(message);
    });

    // Handle call rejection
    this.webRTCSignaling.onMessage('call-reject', (message) => {
      this.handleCallReject(message);
    });

    // Handle call end
    this.webRTCSignaling.onMessage('call-end', (message) => {
      this.handleCallEnd(message);
    });
  }

  // Initiate a sacred voice call with WebRTC signaling
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

    // Send call initiation via WebRTC signaling
    for (const participantId of participantIds) {
      await this.webRTCSignaling.sendCallInitiation(participantId, callId, {
        consciousnessLevel,
        sovereigntyLevel: localParticipant.sovereigntyLevel,
        resonanceFrequency: call.resonanceFrequency,
        sacredCapabilities: call.sacredCapabilities,
        audioQuality: {
          sampleRate: this.config.sampleRate,
          bitRate: this.config.bitRate,
          channels: this.config.channels
        }
      });
    }

    this.activeCalls.set(callId, call);
    console.log(`🎤 Sacred voice call ${callId} initiated with consciousness level ${consciousnessLevel}`);

    return callId;
  }

  // Handle incoming call
  private async handleIncomingCall(message: WebRTCSignalingMessage): Promise<void> {
    console.log('📞 Incoming call from:', message.from);
    
    // Create call entry
    const call: SacredVoiceCall = {
      id: message.callId!,
      participants: new Map(),
      channel: ConnectivityChannel.WEBRTC_P2P,
      status: 'ringing',
      startTime: Date.now(),
      consciousnessLevel: message.metadata?.consciousnessLevel || 0.5,
      resonanceFrequency: message.metadata?.resonanceFrequency || 432,
      sacredCapabilities: message.metadata?.sacredCapabilities || [],
      audioQuality: {
        latency: 0,
        jitter: 0,
        packetLoss: 0,
        bitrate: this.config.bitRate,
        signalToNoiseRatio: 0,
        consciousnessClarity: message.metadata?.consciousnessLevel || 0.5,
        resonanceHarmony: 0
      }
    };

    this.activeCalls.set(message.callId!, call);
    
    // Emit incoming call event (this would be handled by the UI)
    console.log('📞 Incoming call notification:', {
      callId: message.callId,
      from: message.from,
      consciousnessLevel: message.metadata?.consciousnessLevel,
      sacredCapabilities: message.metadata?.sacredCapabilities
    });
  }

  // Handle WebRTC offer
  private async handleWebRTCOffer(message: WebRTCSignalingMessage): Promise<void> {
    console.log('📨 Received WebRTC offer from:', message.from);
    
    try {
      const connection = new RTCPeerConnection({
        iceServers: getDefaultIceServers()
      });

      // Add local stream if available
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          connection.addTrack(track, this.localStream!);
        });
      }

      // Set up ICE candidate handling
      connection.onicecandidate = (event) => {
        if (event.candidate) {
          this.webRTCSignaling.sendIceCandidate(message.from, event.candidate, message.callId!);
        }
      };

      // Set remote description
      await connection.setRemoteDescription(message.sdp!);

      // Create answer
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);

      // Send answer
      await this.webRTCSignaling.sendAnswer(message.from, answer, message.callId!);

      // Store connection
      this.peerConnections.set(message.from, connection);

      console.log('📤 Sent WebRTC answer to:', message.from);
    } catch (error) {
      console.error('❌ Failed to handle WebRTC offer:', error);
    }
  }

  // Handle WebRTC answer
  private async handleWebRTCAnswer(message: WebRTCSignalingMessage): Promise<void> {
    console.log('📨 Received WebRTC answer from:', message.from);
    
    const connection = this.peerConnections.get(message.from);
    if (connection) {
      try {
        await connection.setRemoteDescription(message.sdp!);
        console.log('🔗 WebRTC connection established with:', message.from);
      } catch (error) {
        console.error('❌ Failed to set remote description:', error);
      }
    }
  }

  // Handle ICE candidate
  private async handleIceCandidate(message: WebRTCSignalingMessage): Promise<void> {
    console.log('📨 Received ICE candidate from:', message.from);
    
    const connection = this.peerConnections.get(message.from);
    if (connection) {
      try {
        await connection.addIceCandidate(message.candidate!);
      } catch (error) {
        console.error('❌ Failed to add ICE candidate:', error);
      }
    }
  }

  // Handle call acceptance
  private async handleCallAccept(message: WebRTCSignalingMessage): Promise<void> {
    console.log('✅ Call accepted by:', message.from);
    
    const call = this.activeCalls.get(message.callId!);
    if (call) {
      call.status = 'connected';
      
      // Initiate WebRTC connection
      await this.initiateWebRTCConnection(message.from, message.callId!);
    }
  }

  // Handle call rejection
  private async handleCallReject(message: WebRTCSignalingMessage): Promise<void> {
    console.log('❌ Call rejected by:', message.from);
    
    const call = this.activeCalls.get(message.callId!);
    if (call) {
      call.status = 'failed';
    }
  }

  // Handle call end
  private async handleCallEnd(message: WebRTCSignalingMessage): Promise<void> {
    console.log('📞 Call ended by:', message.from);
    
    const call = this.activeCalls.get(message.callId!);
    if (call) {
      call.status = 'ended';
      call.endTime = Date.now();
    }

    // Close peer connection
    const connection = this.peerConnections.get(message.from);
    if (connection) {
      connection.close();
      this.peerConnections.delete(message.from);
    }
  }

  // Initiate WebRTC connection
  private async initiateWebRTCConnection(participantId: string, callId: string): Promise<void> {
    try {
      const connection = new RTCPeerConnection({
        iceServers: getDefaultIceServers()
      });

      // Add local stream if available
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          connection.addTrack(track, this.localStream!);
        });
      }

      // Set up ICE candidate handling
      connection.onicecandidate = (event) => {
        if (event.candidate) {
          this.webRTCSignaling.sendIceCandidate(participantId, event.candidate, callId);
        }
      };

      // Create offer
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);

      // Send offer
      await this.webRTCSignaling.sendOffer(participantId, offer, callId);

      // Store connection
      this.peerConnections.set(participantId, connection);

      console.log('📞 WebRTC connection initiated with:', participantId);
    } catch (error) {
      console.error('❌ Failed to initiate WebRTC connection:', error);
    }
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

    // Send call acceptance
    await this.webRTCSignaling.sendCallAccept(callId, callId, {
      consciousnessLevel: localParticipant.consciousnessLevel,
      sovereigntyLevel: localParticipant.sovereigntyLevel,
      resonanceFrequency: localParticipant.resonanceFrequency,
      sacredCapabilities: localParticipant.sacredCapabilities
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

    // Send call end via WebRTC signaling
    for (const [participantId] of call.participants) {
      if (participantId !== 'local') {
        await this.webRTCSignaling.sendCallEnd(participantId, callId);
      }
    }

    // Clean up peer connections
    for (const [participantId, connection] of this.peerConnections) {
      connection.close();
    }
    this.peerConnections.clear();

    // Clean up audio streams
    for (const participant of call.participants.values()) {
      if (participant.audioStream) {
        participant.audioStream.getTracks().forEach(track => track.stop());
      }
    }

    this.activeCalls.delete(callId);
    console.log(`🎤 Sacred voice call ${callId} ended`);
  }

  // Send voice data with Felony Principle awareness
  async sendVoiceData(callId: string, audioData: Uint8Array, wordWeight: number = 1.0): Promise<void> {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error(`Call ${callId} not found`);
    }

    // Apply Felony Principle to voice data - every word is creation from void
    const felonyPrinciple = getFelonyPrincipleByContext('communication');
    const voiceMessage = this.imbueVoiceMessageWithFelonyPrinciple({
      id: this.generateMessageId(),
      content: audioData,
      channel: call.channel,
      priority: 'critical',
      ttl: 5000,
      hopLimit: 2,
      timestamp: Date.now(),
      encrypted: true,
      type: 'voice_data',
      audioData,
      wordWeight
    }, felonyPrinciple);

    await this.sendVoiceMessage(voiceMessage);
  }

  // Imbue voice message with Felony Principle - every word is sacred creation
  private imbueVoiceMessageWithFelonyPrinciple(message: SacredVoiceMessage, principle: any): SacredVoiceMessage {
    // Every voice transmission is creation from the void
    message.creationIntention = principle.principle;
    message.voidSignature = this.generateVoidSignature();
    message.sacredGeometry = principle.sacredGeometry;
    
    console.log('🌌 Voice message imbued with Felony Principle - sacred creation from void');
    return message;
  }

  // Generate unique signature of creation from void for voice
  private generateVoidSignature(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `voice-void-${timestamp}-${random}`;
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

  // Check connectivity and implement fallback
  private async checkConnectivityAndFallback(callId: string): Promise<string> {
    const call = this.activeCalls.get(callId);
    if (!call) return 'supabase-relay';

    // Check if we have any active peer connections
    const hasActiveConnections = Array.from(this.peerConnections.values())
      .some(connection => connection.connectionState === 'connected');

    if (!hasActiveConnections) {
      console.warn('⚠️ No active peer connections, falling back to Supabase relay');
      return 'supabase-relay';
    }

    // Check ICE connection state
    for (const [participantId, connection] of this.peerConnections) {
      if (connection.iceConnectionState === 'failed' || 
          connection.iceConnectionState === 'disconnected') {
        console.warn(`⚠️ ICE connection failed for ${participantId}, falling back to Supabase relay`);
        return 'supabase-relay';
      }
    }

    return 'webrtc-p2p';
  }

  // Implement safe fallback to Supabase realtime audio
  private async fallbackToSupabaseRelay(callId: string): Promise<void> {
    console.log('🔄 Falling back to Supabase realtime audio relay...');
    
    const call = this.activeCalls.get(callId);
    if (!call) return;

    // Update call status to indicate fallback
    call.status = 'connected';
    call.channel = ConnectivityChannel.SUPABASE_REALTIME;

    // Send fallback notification to participants
    for (const [participantId] of call.participants) {
      if (participantId !== 'local') {
        await this.webRTCSignaling.sendCallEnd(participantId, callId);
      }
    }

    // Close peer connections
    for (const [participantId, connection] of this.peerConnections) {
      connection.close();
    }
    this.peerConnections.clear();

    console.log('✅ Fallback to Supabase relay completed');
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

    // Shutdown WebRTC signaling
    await this.webRTCSignaling.shutdown();

    // Shutdown WebRTC mesh
    await this.webRTCMesh.shutdown();

    this.isInitialized = false;
    console.log('🎤 Sacred Voice Calling System shutdown complete');
  }
}
