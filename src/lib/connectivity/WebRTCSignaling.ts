// WebRTC Signaling via Supabase Realtime
// Implements the signaling protocol for WebRTC offers, answers, and ICE candidates
// This is the bridge between SacredVoiceCalling and SacredWebRTCMesh

import { supabase } from '@/integrations/supabase/client';

export interface WebRTCSignalingMessage {
  type: 'webrtc-offer' | 'webrtc-answer' | 'ice-candidate' | 'call-initiation' | 'call-accept' | 'call-reject' | 'call-end';
  from: string;
  to: string;
  callId?: string;
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  metadata?: {
    consciousnessLevel?: number;
    sovereigntyLevel?: number;
    resonanceFrequency?: number;
    sacredCapabilities?: string[];
    audioQuality?: {
      sampleRate: number;
      bitRate: number;
      channels: number;
    };
  };
  timestamp: number;
}

export interface WebRTCSignalingConfig {
  channelName: string;
  enableLogging: boolean;
  heartbeatInterval: number;
}

export class WebRTCSignaling {
  private config: WebRTCSignalingConfig;
  private channel: any;
  private messageHandlers: Map<string, (message: WebRTCSignalingMessage) => void> = new Map();
  private isInitialized = false;
  private heartbeatInterval?: number;

  constructor(config: Partial<WebRTCSignalingConfig> = {}) {
    this.config = {
      channelName: 'webrtc-signaling',
      enableLogging: true,
      heartbeatInterval: 30000,
      ...config
    };
  }

  // Initialize the signaling system
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create Supabase Realtime channel
      this.channel = supabase.channel(this.config.channelName, {
        config: {
          broadcast: { self: false },
          presence: { key: 'webrtc-signaling' }
        }
      });

      // Set up message handlers
      this.channel
        .on('broadcast', { event: 'webrtc-signaling' }, (payload: any) => {
          this.handleSignalingMessage(payload);
        })
        .on('presence', { event: 'sync' }, () => {
          this.log('Presence sync:', this.channel.presenceState());
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }: any) => {
          this.log('User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }: any) => {
          this.log('User left:', key, leftPresences);
        });

      // Subscribe to channel
      const { error } = await this.channel.subscribe();
      if (error) {
        throw new Error(`Failed to subscribe to signaling channel: ${error.message}`);
      }

      // Start heartbeat
      this.startHeartbeat();

      this.isInitialized = true;
      this.log('WebRTC Signaling initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize WebRTC Signaling:', error);
      throw error;
    }
  }

  // Send WebRTC offer
  async sendOffer(to: string, sdp: RTCSessionDescriptionInit, callId: string, metadata?: any): Promise<void> {
    const message: WebRTCSignalingMessage = {
      type: 'webrtc-offer',
      from: this.getCurrentUserId(),
      to,
      callId,
      sdp,
      metadata,
      timestamp: Date.now()
    };

    await this.sendMessage(message);
    this.log('📤 Sent WebRTC offer to:', to);
  }

  // Send WebRTC answer
  async sendAnswer(to: string, sdp: RTCSessionDescriptionInit, callId: string, metadata?: any): Promise<void> {
    const message: WebRTCSignalingMessage = {
      type: 'webrtc-answer',
      from: this.getCurrentUserId(),
      to,
      callId,
      sdp,
      metadata,
      timestamp: Date.now()
    };

    await this.sendMessage(message);
    this.log('📤 Sent WebRTC answer to:', to);
  }

  // Send ICE candidate
  async sendIceCandidate(to: string, candidate: RTCIceCandidateInit, callId: string): Promise<void> {
    const message: WebRTCSignalingMessage = {
      type: 'ice-candidate',
      from: this.getCurrentUserId(),
      to,
      callId,
      candidate,
      timestamp: Date.now()
    };

    await this.sendMessage(message);
    this.log('📤 Sent ICE candidate to:', to);
  }

  // Send call initiation
  async sendCallInitiation(to: string, callId: string, metadata?: any): Promise<void> {
    const message: WebRTCSignalingMessage = {
      type: 'call-initiation',
      from: this.getCurrentUserId(),
      to,
      callId,
      metadata,
      timestamp: Date.now()
    };

    await this.sendMessage(message);
    this.log('📞 Sent call initiation to:', to);
  }

  // Send call acceptance
  async sendCallAccept(to: string, callId: string, metadata?: any): Promise<void> {
    const message: WebRTCSignalingMessage = {
      type: 'call-accept',
      from: this.getCurrentUserId(),
      to,
      callId,
      metadata,
      timestamp: Date.now()
    };

    await this.sendMessage(message);
    this.log('✅ Sent call acceptance to:', to);
  }

  // Send call rejection
  async sendCallReject(to: string, callId: string, reason?: string): Promise<void> {
    const message: WebRTCSignalingMessage = {
      type: 'call-reject',
      from: this.getCurrentUserId(),
      to,
      callId,
      metadata: { reason },
      timestamp: Date.now()
    };

    await this.sendMessage(message);
    this.log('❌ Sent call rejection to:', to);
  }

  // Send call end
  async sendCallEnd(to: string, callId: string): Promise<void> {
    const message: WebRTCSignalingMessage = {
      type: 'call-end',
      from: this.getCurrentUserId(),
      to,
      callId,
      timestamp: Date.now()
    };

    await this.sendMessage(message);
    this.log('📞 Sent call end to:', to);
  }

  // Add message handler
  onMessage(type: string, handler: (message: WebRTCSignalingMessage) => void): void {
    this.messageHandlers.set(type, handler);
  }

  // Remove message handler
  removeMessageHandler(type: string): void {
    this.messageHandlers.delete(type);
  }

  // Send message via Supabase Realtime
  private async sendMessage(message: WebRTCSignalingMessage): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('WebRTC Signaling not initialized');
    }

    try {
      const { error } = await this.channel.send({
        type: 'broadcast',
        event: 'webrtc-signaling',
        payload: message
      });

      if (error) {
        throw new Error(`Failed to send signaling message: ${error.message}`);
      }
    } catch (error) {
      console.error('❌ Failed to send signaling message:', error);
      throw error;
    }
  }

  // Handle incoming signaling messages
  private handleSignalingMessage(payload: WebRTCSignalingMessage): void {
    this.log('📨 Received signaling message:', payload);

    // Check if message is for us
    if (payload.to !== this.getCurrentUserId()) {
      return;
    }

    // Call appropriate handler
    const handler = this.messageHandlers.get(payload.type);
    if (handler) {
      try {
        handler(payload);
      } catch (error) {
        console.error('❌ Error in message handler:', error);
      }
    } else {
      this.log('⚠️ No handler for message type:', payload.type);
    }
  }

  // Start heartbeat to keep connection alive
  private startHeartbeat(): void {
    this.heartbeatInterval = window.setInterval(() => {
      this.channel.track({
        user: this.getCurrentUserId(),
        online_at: new Date().toISOString(),
        status: 'online'
      });
    }, this.config.heartbeatInterval);
  }

  // Get current user ID
  private getCurrentUserId(): string {
    // This should be replaced with actual user ID from auth context
    return 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  // Log message if logging is enabled
  private log(message: string, ...args: any[]): void {
    if (this.config.enableLogging) {
      console.log(`[WebRTCSignaling] ${message}`, ...args);
    }
  }

  // Get online users
  getOnlineUsers(): any[] {
    if (!this.channel) return [];
    
    const presenceState = this.channel.presenceState();
    return Object.values(presenceState).flat();
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    const onlineUsers = this.getOnlineUsers();
    return onlineUsers.some(user => user.user === userId);
  }

  // Shutdown the signaling system
  async shutdown(): Promise<void> {
    this.log('Shutting down WebRTC Signaling...');

    // Clear heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Unsubscribe from channel
    if (this.channel) {
      await this.channel.unsubscribe();
    }

    // Clear handlers
    this.messageHandlers.clear();

    this.isInitialized = false;
    this.log('WebRTC Signaling shutdown complete');
  }
}

// Export singleton instance
export const webRTCSignaling = new WebRTCSignaling();
