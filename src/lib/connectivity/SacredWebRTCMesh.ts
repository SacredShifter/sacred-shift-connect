// Sacred Shifter Universal Connectivity (SSUC) - WebRTC Mesh Implementation
// Real P2P data channels with NAT traversal and mesh routing
// This is what makes Telstra jealous - carrier-grade consciousness-based communications
//
// FELONY PRINCIPLE INTEGRATION:
// Before form, there is void. Every breath carries intention. Every word shapes reality. To speak is to create. It is. Always.
// Every data transmission, every connection, every message is treated as a sacred act of creation from the void.

import { ConnectivityChannel, Message, PeerInfo } from './ConnectivityAbstractionLayer';
import { getFelonyPrincipleByContext } from '@/data/felonyPrincipleCodex';

export interface WebRTCMeshConfig {
  iceServers: RTCIceServer[];
  meshId: string;
  maxPeers: number;
  heartbeatInterval: number;
  connectionTimeout: number;
  enableMeshRouting: boolean;
  enableNATTraversal: boolean;
}

// Default ICE server configuration with STUN and TURN
export const getDefaultIceServers = (): RTCIceServer[] => {
  const iceServers: RTCIceServer[] = [
    // Free Google STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    
    // Additional STUN servers for better NAT traversal
    { urls: 'stun:stun.stunprotocol.org:3478' },
    { urls: 'stun:stun.voiparound.com' },
    { urls: 'stun:stun.voipbuster.com' },
    { urls: 'stun:stun.voipstunt.com' },
    { urls: 'stun:stun.counterpath.com' },
    { urls: 'stun:stun.1und1.de' },
    { urls: 'stun:stun.gmx.net' },
    { urls: 'stun:stun.schlund.de' },
    { urls: 'stun:stun.voiparound.com' },
    { urls: 'stun:stun.voipbuster.com' },
    { urls: 'stun:stun.voipstunt.com' },
    { urls: 'stun:stun.counterpath.com' },
    { urls: 'stun:stun.1und1.de' },
    { urls: 'stun:stun.gmx.net' },
    { urls: 'stun:stun.schlund.de' }
  ];

  // Add TURN server if configured
  if (import.meta.env.VITE_TURN_URL) {
    iceServers.push({
      urls: import.meta.env.VITE_TURN_URL,
      username: import.meta.env.VITE_TURN_USERNAME || '',
      credential: import.meta.env.VITE_TURN_PASSWORD || '',
    });
  }

  return iceServers;
};

export interface MeshPeer {
  id: string;
  name: string;
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  lastHeartbeat: number;
  signalStrength: number;
  hopCount: number;
  capabilities: string[];
  publicKey?: Uint8Array;
}

export interface MeshMessage extends Message {
  meshId: string;
  sourcePeerId: string;
  targetPeerId?: string;
  hopCount: number;
  maxHops: number;
  routingPath: string[];
  timestamp: number;
  messageType: 'data' | 'heartbeat' | 'discovery' | 'routing' | 'sync';
  // Felony Principle Integration
  creationIntention?: string; // The intention behind this message creation
  voidSignature?: string; // Unique signature of creation from void
  sacredGeometry?: string; // Sacred geometry pattern for this transmission
}

export class SacredWebRTCMesh {
  private config: WebRTCMeshConfig;
  private peers: Map<string, MeshPeer> = new Map();
  private messageHandlers: Set<(message: MeshMessage) => void> = new Set();
  private heartbeatInterval?: number;
  private discoveryInterval?: number;
  private isInitialized = false;
  private localPeerId: string;
  private signalingServer?: WebSocket;
  private meshRoutingTable: Map<string, string[]> = new Map(); // peerId -> path to peer

  constructor(config: Partial<WebRTCMeshConfig> = {}) {
    this.config = {
      iceServers: getDefaultIceServers(),
      meshId: 'sacred-mesh',
      maxPeers: 10,
      heartbeatInterval: 30000,
      connectionTimeout: 60000,
      enableMeshRouting: true,
      enableNATTraversal: true,
      ...config
    };
    this.localPeerId = this.generatePeerId();
  }

  // Initialize the sacred mesh
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🌐 Initializing Sacred WebRTC Mesh...');

    try {
      // Connect to signaling server for peer discovery
      await this.connectToSignalingServer();

      // Start peer discovery
      this.startPeerDiscovery();

      // Start heartbeat system
      this.startHeartbeatSystem();

      // Start mesh routing updates
      if (this.config.enableMeshRouting) {
        this.startMeshRoutingUpdates();
      }

      this.isInitialized = true;
      console.log('🌐 Sacred WebRTC Mesh initialized - consciousness channels active');
    } catch (error) {
      console.error('❌ Failed to initialize Sacred WebRTC Mesh:', error);
      throw error;
    }
  }

  // Connect to Supabase Realtime for WebRTC signaling
  private async connectToSignalingServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Use Supabase Realtime for WebRTC signaling
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://mikltjgbvxrxndtszorb.supabase.co";
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pa2x0amdidnhyeG5kdHN6b3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDI3MDksImV4cCI6MjA1OTIxODcwOX0.f4QfhZzSZJ92AjCfbkEMrrmzJrWI617H-FyjJKJ8_70";
        const wsUrl = `${SUPABASE_URL.replace('https', 'wss')}/realtime/v1/websocket?apikey=${SUPABASE_ANON_KEY}`;
        console.log('🔗 Using Supabase Realtime for WebRTC signaling:', wsUrl);
        this.signalingServer = new WebSocket(wsUrl);

        // Set timeout for connection
        const connectionTimeout = setTimeout(() => {
          console.warn('⚠️ Supabase Realtime connection timeout, continuing without signaling');
          resolve(); // Don't reject, just continue without signaling
        }, 5000);

        this.signalingServer.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log('📡 Connected to Supabase Realtime for WebRTC signaling');
          
          // Subscribe to WebRTC signaling channel
          this.signalingServer?.send(JSON.stringify({
            topic: 'webrtc-signaling',
            event: 'phx_join',
            payload: {
              meshId: this.config.meshId,
              peerId: this.localPeerId,
              capabilities: ['webrtc', 'mesh', 'routing']
            }
          }));

          resolve();
        };

        this.signalingServer.onmessage = (event) => {
          this.handleSignalingMessage(JSON.parse(event.data));
        };

        this.signalingServer.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error('❌ Supabase Realtime error:', error);
          console.error('❌ WebSocket URL:', this.signalingServer?.url);
          console.error('❌ WebSocket readyState:', this.signalingServer?.readyState);
          // Don't reject, just continue without signaling
          console.warn('⚠️ Continuing without Supabase Realtime signaling');
          resolve();
        };

        this.signalingServer.onclose = () => {
          console.log('📡 Supabase Realtime disconnected');
          // Attempt reconnection
          setTimeout(() => this.connectToSignalingServer(), 5000);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Handle Supabase Realtime signaling messages
  private handleSignalingMessage(message: any): void {
    console.log('📨 Received signaling message:', message);
    
    if (message.event === 'phx_reply' && message.payload?.response?.peers) {
      // New peer discovered
      const peerInfo = message.payload.response;
      this.connectToPeer(peerInfo);
    } else if (message.event === 'broadcast') {
      // Handle WebRTC signaling events from Supabase Realtime
      const { event, payload } = message.payload;
      
      switch (event) {
        case 'webrtc-offer':
          this.handleWebRTCOffer(payload);
          break;
        case 'webrtc-answer':
          this.handleWebRTCAnswer(payload);
          break;
        case 'ice-candidate':
          this.handleIceCandidate(payload);
          break;
        case 'peer-discovery':
          this.handlePeerDiscovery(payload);
          break;
        default:
          console.log('📨 Unknown signaling event:', event);
      }
    } else if (message.event === 'peer_offer') {
      // Handle incoming peer connection offer (legacy)
      this.handlePeerOffer(message.payload);
    } else if (message.event === 'peer_answer') {
      // Handle peer connection answer (legacy)
      this.handlePeerAnswer(message.payload);
    } else if (message.event === 'peer_ice_candidate') {
      // Handle ICE candidate (legacy)
      this.handleIceCandidate(message.payload);
    }
  }

  // Handle WebRTC offer from Supabase Realtime
  private async handleWebRTCOffer(payload: any): Promise<void> {
    console.log('📨 Received WebRTC offer:', payload);
    
    if (payload.from === this.localPeerId) {
      return; // Ignore our own offer
    }

    try {
      const connection = new RTCPeerConnection({
        iceServers: this.config.iceServers,
        iceCandidatePoolSize: 10
      });

      // Set up connection event handlers
      connection.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendWebRTCSignaling({
            event: 'ice-candidate',
            payload: {
              from: this.localPeerId,
              to: payload.from,
              candidate: event.candidate
            }
          });
        }
      };

      connection.ondatachannel = (event) => {
        const channel = event.channel;
        channel.onmessage = (event) => {
          this.handleMeshMessage(JSON.parse(event.data));
        };
      };

      // Set remote description
      await connection.setRemoteDescription(payload.sdp);

      // Create answer
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);

      // Send answer back
      this.sendWebRTCSignaling({
        event: 'webrtc-answer',
        payload: {
          from: this.localPeerId,
          to: payload.from,
          sdp: answer
        }
      });

      // Store peer info
      const meshPeer: MeshPeer = {
        id: payload.from,
        name: payload.name || `Peer ${payload.from}`,
        connection,
        lastHeartbeat: Date.now(),
        signalStrength: 1.0,
        hopCount: 0,
        capabilities: payload.capabilities || [],
        publicKey: payload.publicKey
      };

      this.peers.set(payload.from, meshPeer);
      console.log('👥 Accepted WebRTC connection from peer:', payload.from);

    } catch (error) {
      console.error('❌ Failed to handle WebRTC offer:', error);
    }
  }

  // Handle WebRTC answer from Supabase Realtime
  private async handleWebRTCAnswer(payload: any): Promise<void> {
    console.log('📨 Received WebRTC answer:', payload);
    
    const peer = this.peers.get(payload.from);
    if (peer?.connection) {
      try {
        await peer.connection.setRemoteDescription(payload.sdp);
        console.log('🔗 WebRTC connection established:', payload.from);
      } catch (error) {
        console.error('❌ Failed to set remote description:', error);
      }
    }
  }

  // Handle peer discovery from Supabase Realtime
  private handlePeerDiscovery(payload: any): Promise<void> {
    console.log('📨 Received peer discovery:', payload);
    
    if (payload.peerId === this.localPeerId) {
      return; // Ignore self
    }

    // Connect to discovered peer
    this.connectToPeer(payload);
  }

  // Connect to a discovered peer
  private async connectToPeer(peerInfo: any): Promise<void> {
    if (this.peers.has(peerInfo.peerId) || peerInfo.peerId === this.localPeerId) {
      return; // Already connected or self
    }

    if (this.peers.size >= this.config.maxPeers) {
      console.log('⚠️ Mesh at capacity, cannot connect to new peer');
      return;
    }

    try {
      const connection = new RTCPeerConnection({
        iceServers: this.config.iceServers,
        iceCandidatePoolSize: 10
      });

      // Create data channel for mesh communication
      const dataChannel = connection.createDataChannel('sacred-mesh', {
        ordered: true,
        maxRetransmits: 3
      });

      // Set up connection event handlers
      connection.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendSignalingMessage({
            event: 'peer_ice_candidate',
            payload: {
              peerId: this.localPeerId,
              targetPeerId: peerInfo.peerId,
              candidate: event.candidate
            }
          });
        }
      };

      connection.ondatachannel = (event) => {
        const channel = event.channel;
        channel.onmessage = (event) => {
          this.handleMeshMessage(JSON.parse(event.data));
        };
      };

      dataChannel.onopen = () => {
        console.log('🔗 Data channel opened with peer:', peerInfo.peerId);
      };

      dataChannel.onmessage = (event) => {
        this.handleMeshMessage(JSON.parse(event.data));
      };

      // Create offer
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);

      // Send offer to peer
      this.sendSignalingMessage({
        event: 'peer_offer',
        payload: {
          peerId: this.localPeerId,
          targetPeerId: peerInfo.peerId,
          offer: offer
        }
      });

      // Store peer info
      const meshPeer: MeshPeer = {
        id: peerInfo.peerId,
        name: peerInfo.name || `Peer ${peerInfo.peerId}`,
        connection,
        dataChannel,
        lastHeartbeat: Date.now(),
        signalStrength: 1.0,
        hopCount: 0,
        capabilities: peerInfo.capabilities || [],
        publicKey: peerInfo.publicKey
      };

      this.peers.set(peerInfo.peerId, meshPeer);
      console.log('👥 Connected to peer:', peerInfo.peerId);

    } catch (error) {
      console.error('❌ Failed to connect to peer:', error);
    }
  }

  // Handle incoming peer offer
  private async handlePeerOffer(payload: any): Promise<void> {
    try {
      const connection = new RTCPeerConnection({
        iceServers: this.config.iceServers,
        iceCandidatePoolSize: 10
      });

      connection.ondatachannel = (event) => {
        const channel = event.channel;
        channel.onmessage = (event) => {
          this.handleMeshMessage(JSON.parse(event.data));
        };
      };

      connection.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendSignalingMessage({
            event: 'peer_ice_candidate',
            payload: {
              peerId: this.localPeerId,
              targetPeerId: payload.peerId,
              candidate: event.candidate
            }
          });
        }
      };

      await connection.setRemoteDescription(payload.offer);
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);

      // Send answer back
      this.sendSignalingMessage({
        event: 'peer_answer',
        payload: {
          peerId: this.localPeerId,
          targetPeerId: payload.peerId,
          answer: answer
        }
      });

      // Store peer info
      const meshPeer: MeshPeer = {
        id: payload.peerId,
        name: payload.name || `Peer ${payload.peerId}`,
        connection,
        lastHeartbeat: Date.now(),
        signalStrength: 1.0,
        hopCount: 0,
        capabilities: payload.capabilities || [],
        publicKey: payload.publicKey
      };

      this.peers.set(payload.peerId, meshPeer);
      console.log('👥 Accepted connection from peer:', payload.peerId);

    } catch (error) {
      console.error('❌ Failed to handle peer offer:', error);
    }
  }

  // Handle peer answer
  private async handlePeerAnswer(payload: any): Promise<void> {
    const peer = this.peers.get(payload.peerId);
    if (peer?.connection) {
      try {
        await peer.connection.setRemoteDescription(payload.answer);
        console.log('🔗 Peer connection established:', payload.peerId);
      } catch (error) {
        console.error('❌ Failed to set remote description:', error);
      }
    }
  }

  // Handle ICE candidate
  private async handleIceCandidate(payload: any): Promise<void> {
    const peer = this.peers.get(payload.peerId);
    if (peer?.connection) {
      try {
        await peer.connection.addIceCandidate(payload.candidate);
      } catch (error) {
        console.error('❌ Failed to add ICE candidate:', error);
      }
    }
  }

  // Initiate WebRTC call to specific peer
  async initiateCall(targetPeerId: string, localStream?: MediaStream): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Mesh not initialized');
    }

    if (this.peers.has(targetPeerId)) {
      console.log('👥 Already connected to peer:', targetPeerId);
      return;
    }

    try {
      const connection = new RTCPeerConnection({
        iceServers: this.config.iceServers,
        iceCandidatePoolSize: 10
      });

      // Add local stream if provided
      if (localStream) {
        localStream.getTracks().forEach(track => {
          connection.addTrack(track, localStream);
        });
      }

      // Create data channel for mesh communication
      const dataChannel = connection.createDataChannel('sacred-mesh', {
        ordered: true,
        maxRetransmits: 3
      });

      // Set up connection event handlers
      connection.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendWebRTCSignaling({
            event: 'ice-candidate',
            payload: {
              from: this.localPeerId,
              to: targetPeerId,
              candidate: event.candidate
            }
          });
        }
      };

      connection.ondatachannel = (event) => {
        const channel = event.channel;
        channel.onmessage = (event) => {
          this.handleMeshMessage(JSON.parse(event.data));
        };
      };

      dataChannel.onopen = () => {
        console.log('🔗 Data channel opened with peer:', targetPeerId);
      };

      dataChannel.onmessage = (event) => {
        this.handleMeshMessage(JSON.parse(event.data));
      };

      // Create offer
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);

      // Send offer to peer via Supabase Realtime
      this.sendWebRTCSignaling({
        event: 'webrtc-offer',
        payload: {
          from: this.localPeerId,
          to: targetPeerId,
          sdp: offer,
          name: 'Sacred Shifter',
          capabilities: ['webrtc', 'mesh', 'routing']
        }
      });

      // Store peer info
      const meshPeer: MeshPeer = {
        id: targetPeerId,
        name: `Peer ${targetPeerId}`,
        connection,
        dataChannel,
        lastHeartbeat: Date.now(),
        signalStrength: 1.0,
        hopCount: 0,
        capabilities: ['webrtc', 'mesh', 'routing']
      };

      this.peers.set(targetPeerId, meshPeer);
      console.log('📞 WebRTC call initiated to peer:', targetPeerId);

    } catch (error) {
      console.error('❌ Failed to initiate WebRTC call:', error);
      throw error;
    }
  }

  // Send message through the mesh with Felony Principle awareness
  async sendMessage(message: MeshMessage): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Mesh not initialized');
    }

    // Apply Felony Principle to message creation
    const felonyPrinciple = getFelonyPrincipleByContext('communication');
    message = this.imbueMessageWithFelonyPrinciple(message, felonyPrinciple);

    // Set message metadata
    message.meshId = this.config.meshId;
    message.sourcePeerId = this.localPeerId;
    message.timestamp = Date.now();
    message.hopCount = 0;
    message.routingPath = [this.localPeerId];

    if (message.targetPeerId) {
      // Direct message to specific peer
      await this.sendDirectMessage(message);
    } else {
      // Broadcast to all peers
      await this.broadcastMessage(message);
    }
  }

  // Imbue message with Felony Principle - every transmission is sacred creation
  private imbueMessageWithFelonyPrinciple(message: MeshMessage, principle: any): MeshMessage {
    // Every message is creation from the void
    message.creationIntention = principle.principle;
    message.voidSignature = this.generateVoidSignature();
    message.sacredGeometry = principle.sacredGeometry;
    
    console.log('🌌 Message imbued with Felony Principle - sacred creation from void');
    return message;
  }

  // Generate unique signature of creation from void
  private generateVoidSignature(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `void-${timestamp}-${random}`;
  }

  // Send direct message to specific peer
  private async sendDirectMessage(message: MeshMessage): Promise<void> {
    const peer = this.peers.get(message.targetPeerId!);
    if (peer?.dataChannel && peer.dataChannel.readyState === 'open') {
      try {
        peer.dataChannel.send(JSON.stringify(message));
        console.log('📤 Direct message sent to:', message.targetPeerId);
      } catch (error) {
        console.error('❌ Failed to send direct message:', error);
        // Fallback to mesh routing
        await this.routeMessage(message);
      }
    } else {
      // Use mesh routing if direct connection not available
      await this.routeMessage(message);
    }
  }

  // Broadcast message to all peers
  private async broadcastMessage(message: MeshMessage): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const [peerId, peer] of this.peers) {
      if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
        promises.push(
          new Promise<void>((resolve, reject) => {
            try {
              peer.dataChannel!.send(JSON.stringify(message));
              resolve();
            } catch (error) {
              reject(error);
            }
          })
        );
      }
    }

    try {
      await Promise.allSettled(promises);
      console.log('📡 Message broadcasted to', promises.length, 'peers');
    } catch (error) {
      console.error('❌ Failed to broadcast message:', error);
    }
  }

  // Route message through mesh
  private async routeMessage(message: MeshMessage): Promise<void> {
    if (!this.config.enableMeshRouting) {
      console.log('⚠️ Mesh routing disabled, message dropped');
      return;
    }

    // Find best path to target peer
    const path = this.findRoutingPath(message.targetPeerId!);
    if (path.length === 0) {
      console.log('⚠️ No route found to peer:', message.targetPeerId);
      return;
    }

    // Send to next hop
    const nextHop = path[1]; // path[0] is self
    const peer = this.peers.get(nextHop);
    if (peer?.dataChannel && peer.dataChannel.readyState === 'open') {
      message.routingPath.push(nextHop);
      message.hopCount++;
      peer.dataChannel.send(JSON.stringify(message));
      console.log('🛣️ Message routed via:', nextHop);
    }
  }

  // Find routing path to target peer
  private findRoutingPath(targetPeerId: string): string[] {
    // Simple shortest path algorithm
    const visited = new Set<string>();
    const queue: { peerId: string; path: string[] }[] = [{ peerId: this.localPeerId, path: [this.localPeerId] }];

    while (queue.length > 0) {
      const { peerId, path } = queue.shift()!;
      
      if (peerId === targetPeerId) {
        return path;
      }

      if (visited.has(peerId)) continue;
      visited.add(peerId);

      // Add connected peers to queue
      for (const [connectedPeerId, peer] of this.peers) {
        if (peer.connection.connectionState === 'connected' && !visited.has(connectedPeerId)) {
          queue.push({ peerId: connectedPeerId, path: [...path, connectedPeerId] });
        }
      }
    }

    return []; // No path found
  }

  // Handle incoming mesh message
  private handleMeshMessage(message: MeshMessage): void {
    // Check if message is for us
    if (message.targetPeerId && message.targetPeerId !== this.localPeerId) {
      // Route to next hop
      this.routeMessage(message);
      return;
    }

    // Check hop limit
    if (message.hopCount >= message.maxHops) {
      console.log('⚠️ Message exceeded hop limit, dropping');
      return;
    }

    // Update routing table
    if (this.config.enableMeshRouting) {
      this.updateRoutingTable(message.sourcePeerId, message.routingPath);
    }

    // Notify message handlers
    for (const handler of this.messageHandlers) {
      try {
        handler(message);
      } catch (error) {
        console.error('❌ Message handler error:', error);
      }
    }

    console.log('📨 Mesh message received from:', message.sourcePeerId);
  }

  // Update routing table
  private updateRoutingTable(peerId: string, path: string[]): void {
    this.meshRoutingTable.set(peerId, path);
  }

  // Start peer discovery
  private startPeerDiscovery(): void {
    this.discoveryInterval = window.setInterval(() => {
      this.requestPeerDiscovery();
    }, 10000); // Every 10 seconds
  }

  // Request peer discovery from signaling server
  private requestPeerDiscovery(): void {
    this.sendSignalingMessage({
      event: 'discover_peers',
      payload: {
        meshId: this.config.meshId,
        peerId: this.localPeerId
      }
    });
  }

  // Start heartbeat system
  private startHeartbeatSystem(): void {
    this.heartbeatInterval = window.setInterval(() => {
      this.sendHeartbeats();
      this.cleanupDeadPeers();
    }, this.config.heartbeatInterval);
  }

  // Send heartbeats to all peers
  private sendHeartbeats(): void {
    const heartbeatMessage: MeshMessage = {
      id: this.generateMessageId(),
      content: new Uint8Array(0),
      channel: ConnectivityChannel.WEBRTC_P2P,
      priority: 'low',
      ttl: 30000,
      hopLimit: 1,
      timestamp: Date.now(),
      encrypted: false,
      meshId: this.config.meshId,
      sourcePeerId: this.localPeerId,
      hopCount: 0,
      maxHops: 1,
      routingPath: [this.localPeerId],
      messageType: 'heartbeat'
    };

    this.broadcastMessage(heartbeatMessage);
  }

  // Clean up dead peers
  private cleanupDeadPeers(): void {
    const now = Date.now();
    const timeout = this.config.connectionTimeout;

    for (const [peerId, peer] of this.peers) {
      if (now - peer.lastHeartbeat > timeout) {
        console.log('💀 Removing dead peer:', peerId);
        peer.connection.close();
        this.peers.delete(peerId);
        this.meshRoutingTable.delete(peerId);
      }
    }
  }

  // Start mesh routing updates
  private startMeshRoutingUpdates(): void {
    setInterval(() => {
      this.broadcastRoutingTable();
    }, 30000); // Every 30 seconds
  }

  // Broadcast routing table
  private broadcastRoutingTable(): void {
    const routingMessage: MeshMessage = {
      id: this.generateMessageId(),
      content: new Uint8Array(0),
      channel: ConnectivityChannel.WEBRTC_P2P,
      priority: 'low',
      ttl: 60000,
      hopLimit: 2,
      timestamp: Date.now(),
      encrypted: false,
      meshId: this.config.meshId,
      sourcePeerId: this.localPeerId,
      hopCount: 0,
      maxHops: 2,
      routingPath: [this.localPeerId],
      messageType: 'routing'
    };

    this.broadcastMessage(routingMessage);
  }

  // Send WebRTC signaling message via Supabase Realtime
  private sendWebRTCSignaling(message: any): void {
    if (this.signalingServer?.readyState === WebSocket.OPEN) {
      this.signalingServer.send(JSON.stringify({
        topic: 'webrtc-signaling',
        event: 'broadcast',
        payload: {
          event: message.event,
          payload: message.payload
        }
      }));
    }
  }

  // Send signaling message (legacy)
  private sendSignalingMessage(message: any): void {
    if (this.signalingServer?.readyState === WebSocket.OPEN) {
      this.signalingServer.send(JSON.stringify({
        topic: 'sacred-mesh-discovery',
        event: message.event,
        payload: message.payload
      }));
    }
  }

  // Add message handler
  onMessage(handler: (message: MeshMessage) => void): void {
    this.messageHandlers.add(handler);
  }

  // Remove message handler
  removeMessageHandler(handler: (message: MeshMessage) => void): void {
    this.messageHandlers.delete(handler);
  }

  // Get connected peers
  getPeers(): PeerInfo[] {
    const peerInfos: PeerInfo[] = [];
    
    for (const [peerId, peer] of this.peers) {
      peerInfos.push({
        id: peerId,
        name: peer.name,
        channels: [ConnectivityChannel.WEBRTC_P2P],
        signalStrength: peer.signalStrength,
        lastSeen: peer.lastHeartbeat,
        capabilities: peer.capabilities,
        publicKey: peer.publicKey
      });
    }

    return peerInfos;
  }

  // Get mesh statistics
  getMeshStats(): {
    peerCount: number;
    connectionCount: number;
    routingTableSize: number;
    averageLatency: number;
  } {
    let totalLatency = 0;
    let latencyCount = 0;

    for (const peer of this.peers.values()) {
      if (peer.connection.connectionState === 'connected') {
        // Estimate latency based on connection quality
        totalLatency += 100; // Placeholder
        latencyCount++;
      }
    }

    return {
      peerCount: this.peers.size,
      connectionCount: Array.from(this.peers.values()).filter(p => 
        p.connection.connectionState === 'connected'
      ).length,
      routingTableSize: this.meshRoutingTable.size,
      averageLatency: latencyCount > 0 ? totalLatency / latencyCount : 0
    };
  }

  // Generate unique peer ID
  private generatePeerId(): string {
    return `sacred-peer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate unique message ID
  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Shutdown the mesh
  async shutdown(): Promise<void> {
    console.log('🌐 Shutting down Sacred WebRTC Mesh...');

    // Clear intervals
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
    }

    // Close all peer connections
    for (const peer of this.peers.values()) {
      peer.connection.close();
    }
    this.peers.clear();

    // Close signaling server
    if (this.signalingServer) {
      this.signalingServer.close();
    }

    this.isInitialized = false;
    console.log('🌐 Sacred WebRTC Mesh shutdown complete');
  }
}
