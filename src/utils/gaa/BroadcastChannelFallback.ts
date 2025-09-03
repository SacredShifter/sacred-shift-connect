/**
 * Broadcast Channel Fallback System
 * Provides reliable peer-to-peer communication with WebRTC fallback
 */

export interface ChannelMessage {
  type: string;
  data: any;
  timestamp: number;
  senderId: string;
  messageId: string;
}

export interface PeerConnection {
  id: string;
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel | null;
  status: 'connecting' | 'connected' | 'disconnected' | 'failed';
  lastActivity: number;
  latency: number;
}

export class BroadcastChannelFallback {
  private channelName: string;
  private broadcastChannel: BroadcastChannel | null = null;
  private webrtcPeers: Map<string, PeerConnection> = new Map();
  private messageHandlers: Map<string, ((data: any, senderId: string) => void)[]> = new Map();
  private senderId: string;
  private connectionRetryInterval: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isDestroyed = false;

  // ICE servers for WebRTC
  private iceServers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ];

  constructor(channelName: string, senderId: string) {
    this.channelName = channelName;
    this.senderId = senderId;
    
    this.initializeBroadcastChannel();
    this.startHeartbeat();
    this.startConnectionRetryLoop();
    
    console.log(`📡 BroadcastChannelFallback initialized for ${channelName} (${senderId})`);
  }

  /**
   * Initialize BroadcastChannel (primary transport)
   */
  private initializeBroadcastChannel(): void {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        this.broadcastChannel = new BroadcastChannel(this.channelName);
        
        this.broadcastChannel.addEventListener('message', (event) => {
          this.handleMessage(event.data, 'broadcast');
        });
        
        console.log(`📡 BroadcastChannel '${this.channelName}' ready`);
      } else {
        console.warn('📡 BroadcastChannel not supported, using WebRTC only');
      }
    } catch (error) {
      console.error('📡 Failed to initialize BroadcastChannel:', error);
    }
  }

  /**
   * Send message to all connected peers
   */
  send(type: string, data: any): void {
    if (this.isDestroyed) return;

    const message: ChannelMessage = {
      type,
      data,
      timestamp: performance.now(),
      senderId: this.senderId,
      messageId: this.generateMessageId()
    };

    // Try BroadcastChannel first
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
        console.log(`📡 Sent via BroadcastChannel: ${type}`);
        return;
      } catch (error) {
        console.warn('📡 BroadcastChannel send failed, using WebRTC fallback:', error);
      }
    }

    // Fallback to WebRTC
    this.sendViaWebRTC(message);
  }

  /**
   * Send message via WebRTC data channels
   */
  private sendViaWebRTC(message: ChannelMessage): void {
    let sentCount = 0;
    
    for (const [peerId, peer] of this.webrtcPeers) {
      if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
        try {
          peer.dataChannel.send(JSON.stringify(message));
          sentCount++;
        } catch (error) {
          console.warn(`📡 Failed to send to peer ${peerId}:`, error);
          this.handlePeerDisconnection(peerId);
        }
      }
    }

    if (sentCount > 0) {
      console.log(`📡 Sent via WebRTC to ${sentCount} peers: ${message.type}`);
    } else {
      console.warn(`📡 No available peers to send message: ${message.type}`);
    }
  }

  /**
   * Subscribe to message type
   */
  on(messageType: string, handler: (data: any, senderId: string) => void): void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);
  }

  /**
   * Unsubscribe from message type
   */
  off(messageType: string, handler: (data: any, senderId: string) => void): void {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Connect to a specific peer via WebRTC
   */
  async connectToPeer(peerId: string, initiator: boolean = false): Promise<void> {
    if (this.webrtcPeers.has(peerId)) {
      console.log(`📡 Already connected to peer: ${peerId}`);
      return;
    }

    console.log(`📡 Connecting to peer: ${peerId} (initiator: ${initiator})`);
    
    const peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });
    
    const peer: PeerConnection = {
      id: peerId,
      connection: peerConnection,
      dataChannel: null,
      status: 'connecting',
      lastActivity: performance.now(),
      latency: 0
    };

    this.webrtcPeers.set(peerId, peer);

    // Set up data channel
    if (initiator) {
      peer.dataChannel = peerConnection.createDataChannel('broadcast-fallback', {
        ordered: true,
        maxRetransmits: 3
      });
      this.setupDataChannel(peer.dataChannel, peerId);
    } else {
      peerConnection.ondatachannel = (event) => {
        peer.dataChannel = event.channel;
        this.setupDataChannel(peer.dataChannel, peerId);
      };
    }

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;
      peer.status = state as any;
      
      console.log(`📡 Peer ${peerId} connection state: ${state}`);
      
      if (state === 'connected') {
        peer.lastActivity = performance.now();
      } else if (state === 'disconnected' || state === 'failed') {
        this.handlePeerDisconnection(peerId);
      }
    };

    // Handle ICE candidates (in a real implementation, these would be exchanged via signaling server)
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real implementation, send this candidate to the peer via signaling server
        console.log(`📡 ICE candidate for ${peerId}:`, event.candidate);
      }
    };

    try {
      if (initiator) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        // In a real implementation, send offer to peer via signaling server
        console.log(`📡 Created offer for ${peerId}`);
      }
    } catch (error) {
      console.error(`📡 Failed to setup WebRTC for peer ${peerId}:`, error);
      this.webrtcPeers.delete(peerId);
    }
  }

  /**
   * Setup data channel event handlers
   */
  private setupDataChannel(dataChannel: RTCDataChannel, peerId: string): void {
    dataChannel.onopen = () => {
      console.log(`📡 Data channel opened with peer: ${peerId}`);
      const peer = this.webrtcPeers.get(peerId);
      if (peer) {
        peer.status = 'connected';
        peer.lastActivity = performance.now();
      }
    };

    dataChannel.onclose = () => {
      console.log(`📡 Data channel closed with peer: ${peerId}`);
      this.handlePeerDisconnection(peerId);
    };

    dataChannel.onerror = (error) => {
      console.error(`📡 Data channel error with peer ${peerId}:`, error);
      this.handlePeerDisconnection(peerId);
    };

    dataChannel.onmessage = (event) => {
      try {
        const message: ChannelMessage = JSON.parse(event.data);
        this.handleMessage(message, 'webrtc', peerId);
      } catch (error) {
        console.error(`📡 Failed to parse message from peer ${peerId}:`, error);
      }
    };
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: ChannelMessage, transport: 'broadcast' | 'webrtc', peerId?: string): void {
    // Ignore our own messages
    if (message.senderId === this.senderId) return;

    // Update peer activity if from WebRTC
    if (transport === 'webrtc' && peerId) {
      const peer = this.webrtcPeers.get(peerId);
      if (peer) {
        peer.lastActivity = performance.now();
        
        // Calculate latency
        const now = performance.now();
        if (message.type === 'heartbeat' && message.data.timestamp) {
          peer.latency = now - message.data.timestamp;
        }
      }
    }

    // Handle heartbeat messages
    if (message.type === 'heartbeat') {
      this.handleHeartbeat(message, transport, peerId);
      return;
    }

    // Call registered handlers
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message.data, message.senderId);
        } catch (error) {
          console.error(`📡 Error in message handler for ${message.type}:`, error);
        }
      });
    }

    console.log(`📡 Received via ${transport}: ${message.type} from ${message.senderId}`);
  }

  /**
   * Handle heartbeat messages
   */
  private handleHeartbeat(message: ChannelMessage, transport: 'broadcast' | 'webrtc', peerId?: string): void {
    if (transport === 'webrtc' && peerId && message.data.type === 'ping') {
      // Respond to ping with pong
      const peer = this.webrtcPeers.get(peerId);
      if (peer && peer.dataChannel && peer.dataChannel.readyState === 'open') {
        const pongMessage: ChannelMessage = {
          type: 'heartbeat',
          data: { type: 'pong', originalTimestamp: message.data.timestamp },
          timestamp: performance.now(),
          senderId: this.senderId,
          messageId: this.generateMessageId()
        };
        
        try {
          peer.dataChannel.send(JSON.stringify(pongMessage));
        } catch (error) {
          console.warn(`📡 Failed to send pong to ${peerId}:`, error);
        }
      }
    }
  }

  /**
   * Handle peer disconnection
   */
  private handlePeerDisconnection(peerId: string): void {
    const peer = this.webrtcPeers.get(peerId);
    if (peer) {
      if (peer.connection) {
        peer.connection.close();
      }
      if (peer.dataChannel) {
        peer.dataChannel.close();
      }
      this.webrtcPeers.delete(peerId);
      console.log(`📡 Peer ${peerId} disconnected and cleaned up`);
    }
  }

  /**
   * Start heartbeat system
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 5000); // Every 5 seconds
  }

  /**
   * Send heartbeat to all WebRTC peers
   */
  private sendHeartbeat(): void {
    const now = performance.now();
    
    for (const [peerId, peer] of this.webrtcPeers) {
      if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
        const pingMessage: ChannelMessage = {
          type: 'heartbeat',
          data: { type: 'ping', timestamp: now },
          timestamp: now,
          senderId: this.senderId,
          messageId: this.generateMessageId()
        };
        
        try {
          peer.dataChannel.send(JSON.stringify(pingMessage));
        } catch (error) {
          console.warn(`📡 Failed to send heartbeat to ${peerId}:`, error);
          this.handlePeerDisconnection(peerId);
        }
      }
    }
  }

  /**
   * Start connection retry loop
   */
  private startConnectionRetryLoop(): void {
    this.connectionRetryInterval = setInterval(() => {
      this.cleanupStaleConnections();
    }, 10000); // Every 10 seconds
  }

  /**
   * Clean up stale connections
   */
  private cleanupStaleConnections(): void {
    const now = performance.now();
    const timeout = 30000; // 30 seconds

    for (const [peerId, peer] of this.webrtcPeers) {
      if (now - peer.lastActivity > timeout) {
        console.log(`📡 Cleaning up stale connection to ${peerId}`);
        this.handlePeerDisconnection(peerId);
      }
    }
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `${this.senderId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get connection statistics
   */
  getStats(): {
    broadcastChannelAvailable: boolean;
    webrtcPeerCount: number;
    connectedPeers: number;
    averageLatency: number;
    transport: 'broadcast' | 'webrtc' | 'mixed';
  } {
    const connectedPeers = Array.from(this.webrtcPeers.values()).filter(
      peer => peer.status === 'connected'
    );
    
    const averageLatency = connectedPeers.length > 0
      ? connectedPeers.reduce((sum, peer) => sum + peer.latency, 0) / connectedPeers.length
      : 0;

    let transport: 'broadcast' | 'webrtc' | 'mixed' = 'broadcast';
    if (!this.broadcastChannel && connectedPeers.length > 0) {
      transport = 'webrtc';
    } else if (this.broadcastChannel && connectedPeers.length > 0) {
      transport = 'mixed';
    }

    return {
      broadcastChannelAvailable: !!this.broadcastChannel,
      webrtcPeerCount: this.webrtcPeers.size,
      connectedPeers: connectedPeers.length,
      averageLatency,
      transport
    };
  }

  /**
   * Destroy the fallback system and cleanup resources
   */
  destroy(): void {
    this.isDestroyed = true;
    
    // Close BroadcastChannel
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }

    // Close all WebRTC connections
    for (const [peerId, peer] of this.webrtcPeers) {
      this.handlePeerDisconnection(peerId);
    }

    // Clear intervals
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.connectionRetryInterval) {
      clearInterval(this.connectionRetryInterval);
      this.connectionRetryInterval = null;
    }

    // Clear handlers
    this.messageHandlers.clear();

    console.log(`📡 BroadcastChannelFallback destroyed for ${this.channelName}`);
  }
}