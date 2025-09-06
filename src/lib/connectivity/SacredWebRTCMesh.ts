// Sacred Shifter Universal Connectivity (SSUC) - WebRTC Mesh Implementation
// Real P2P data channels with NAT traversal and mesh routing
// This is what makes Telstra jealous - carrier-grade consciousness-based communications

import { ConnectivityChannel, Message, PeerInfo } from './ConnectivityAbstractionLayer';

export interface WebRTCMeshConfig {
  iceServers: RTCIceServer[];
  meshId: string;
  maxPeers: number;
  heartbeatInterval: number;
  connectionTimeout: number;
  enableMeshRouting: boolean;
  enableNATTraversal: boolean;
}

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

  constructor(config: WebRTCMeshConfig) {
    this.config = config;
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

  // Connect to signaling server for peer discovery
  private async connectToSignalingServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Use Supabase as signaling server
        const wsUrl = `${process.env.VITE_SUPABASE_URL?.replace('https', 'wss')}/realtime/v1/websocket?apikey=${process.env.VITE_SUPABASE_ANON_KEY}`;
        this.signalingServer = new WebSocket(wsUrl);

        this.signalingServer.onopen = () => {
          console.log('📡 Connected to signaling server');
          
          // Subscribe to mesh discovery channel
          this.signalingServer?.send(JSON.stringify({
            topic: 'sacred-mesh-discovery',
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
          console.error('❌ Signaling server error:', error);
          reject(error);
        };

        this.signalingServer.onclose = () => {
          console.log('📡 Signaling server disconnected');
          // Attempt reconnection
          setTimeout(() => this.connectToSignalingServer(), 5000);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Handle signaling server messages
  private handleSignalingMessage(message: any): void {
    if (message.event === 'phx_reply' && message.payload?.response?.peers) {
      // New peer discovered
      const peerInfo = message.payload.response;
      this.connectToPeer(peerInfo);
    } else if (message.event === 'peer_offer') {
      // Handle incoming peer connection offer
      this.handlePeerOffer(message.payload);
    } else if (message.event === 'peer_answer') {
      // Handle peer connection answer
      this.handlePeerAnswer(message.payload);
    } else if (message.event === 'peer_ice_candidate') {
      // Handle ICE candidate
      this.handleIceCandidate(message.payload);
    }
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

  // Send message through the mesh
  async sendMessage(message: MeshMessage): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Mesh not initialized');
    }

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

  // Send signaling message
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
