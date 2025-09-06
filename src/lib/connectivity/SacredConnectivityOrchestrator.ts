// Sacred Shifter Universal Connectivity Orchestrator
// The master conductor of all communication channels - makes Telstra jealous
// Integrates with Aura for consciousness-based connectivity decisions

import { ConnectivityAbstractionLayer, ConnectivityChannel, Message, PeerInfo, ChannelAdapter } from './ConnectivityAbstractionLayer';
import { SacredWebRTCMesh, WebRTCMeshConfig, MeshMessage } from './SacredWebRTCMesh';
import { SacredCRDTSync, CRDTOperation } from './SacredCRDTSync';
import { LANDiscovery, LANPeer } from './LANDiscovery';

export interface SacredConnectivityConfig {
  // Core channels
  enableWebRTCMesh: boolean;
  enableLANDiscovery: boolean;
  enableBluetoothLE: boolean;
  enableNFC: boolean;
  enableUSB: boolean;
  enableLoRa: boolean;
  enableExoticChannels: boolean;
  
  // Fallback configuration
  fallbackOrder: ConnectivityChannel[];
  maxRetryAttempts: number;
  retryDelayMs: number;
  
  // Mesh configuration
  webRTCMeshConfig: WebRTCMeshConfig;
  
  // Sync configuration
  enableCRDTSync: boolean;
  syncIntervalMs: number;
  conflictResolutionStrategy: 'last-write-wins' | 'merge' | 'manual';
  
  // Aura integration
  enableAuraOversight: boolean;
  auraHealthCheckInterval: number;
  
  // Telemetry
  enableTelemetry: boolean;
  telemetryInterval: number;
}

export interface ConnectivityHealth {
  channel: ConnectivityChannel;
  status: 'healthy' | 'degraded' | 'failed' | 'unknown';
  latency: number;
  throughput: number;
  errorRate: number;
  lastSeen: number;
  signalStrength: number;
  peerCount: number;
}

export interface SacredConnectivityStats {
  totalChannels: number;
  activeChannels: number;
  totalPeers: number;
  totalMessages: number;
  averageLatency: number;
  errorRate: number;
  uptime: number;
  syncOperations: number;
  conflictsResolved: number;
  auraInsights: string[];
}

export class SacredConnectivityOrchestrator {
  private config: SacredConnectivityConfig;
  private cal: ConnectivityAbstractionLayer;
  private webRTCMesh?: SacredWebRTCMesh;
  private crdtSync?: SacredCRDTSync;
  private lanDiscovery?: LANDiscovery;
  private isInitialized = false;
  private startTime = Date.now();
  
  // Health monitoring
  private channelHealth: Map<ConnectivityChannel, ConnectivityHealth> = new Map();
  private telemetryData: any[] = [];
  private messageCount = 0;
  private errorCount = 0;
  
  // Aura integration
  private auraInsights: string[] = [];
  private auraHealthCheckInterval?: number;

  constructor(config: SacredConnectivityConfig) {
    this.config = config;
    
    // Initialize CAL
    this.cal = new ConnectivityAbstractionLayer({
      channels: this.getEnabledChannels(),
      fallbackOrder: config.fallbackOrder,
      offlineMode: true,
      meshEnabled: true,
      maxHops: 5,
      retryAttempts: config.maxRetryAttempts,
      timeout: 30000
    });

    // Initialize CRDT sync if enabled
    if (config.enableCRDTSync) {
      this.crdtSync = new SacredCRDTSync(this.generateNodeId());
    }

    // Initialize LAN discovery if enabled
    if (config.enableLANDiscovery) {
      this.lanDiscovery = new LANDiscovery(this.generateNodeId());
    }
  }

  // Initialize the sacred connectivity system
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🌟 Initializing Sacred Connectivity Orchestrator...');

    try {
      // Initialize CAL
      await this.cal.initialize();

      // Initialize WebRTC Mesh if enabled
      if (this.config.enableWebRTCMesh) {
        this.webRTCMesh = new SacredWebRTCMesh(this.config.webRTCMeshConfig);
        await this.webRTCMesh.initialize();
        
        // Set up mesh message handling
        this.webRTCMesh.onMessage((message) => {
          this.handleMeshMessage(message);
        });
      }

      // Initialize LAN discovery if enabled
      if (this.config.enableLANDiscovery && this.lanDiscovery) {
        await this.lanDiscovery.startDiscovery();
      }

      // Start health monitoring
      this.startHealthMonitoring();

      // Start telemetry collection
      if (this.config.enableTelemetry) {
        this.startTelemetryCollection();
      }

      // Start Aura oversight if enabled
      if (this.config.enableAuraOversight) {
        this.startAuraOversight();
      }

      // Start CRDT sync if enabled
      if (this.config.enableCRDTSync && this.crdtSync) {
        this.startCRDTSync();
      }

      this.isInitialized = true;
      console.log('🌟 Sacred Connectivity Orchestrator initialized - universal resonance channels active');
    } catch (error) {
      console.error('❌ Failed to initialize Sacred Connectivity Orchestrator:', error);
      throw error;
    }
  }

  // Send message through optimal channel
  async sendMessage(message: Message): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Orchestrator not initialized');
    }

    this.messageCount++;

    try {
      // Determine optimal channel
      const optimalChannel = await this.selectOptimalChannel(message);
      
      // Send via CAL
      await this.cal.sendMessage({
        ...message,
        channel: optimalChannel
      });

      // If WebRTC mesh is available, also broadcast for redundancy
      if (this.webRTCMesh && this.isChannelHealthy(ConnectivityChannel.WEBRTC_P2P)) {
        const meshMessage: MeshMessage = {
          ...message,
          meshId: this.config.webRTCMeshConfig.meshId,
          sourcePeerId: this.generateNodeId(),
          hopCount: 0,
          maxHops: 5,
          routingPath: [this.generateNodeId()],
          messageType: 'data'
        };
        
        this.webRTCMesh.sendMessage(meshMessage);
      }

      console.log(`📤 Message sent via ${optimalChannel}`);
    } catch (error) {
      this.errorCount++;
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  }

  // Select optimal channel based on message requirements and health
  private async selectOptimalChannel(message: Message): Promise<ConnectivityChannel> {
    // Check channel health and select best available
    for (const channel of this.config.fallbackOrder) {
      if (this.isChannelHealthy(channel)) {
        return channel;
      }
    }

    // Fallback to first available channel
    const activeChannels = this.cal.getActiveChannels();
    if (activeChannels.length > 0) {
      return activeChannels[0];
    }

    throw new Error('No healthy channels available');
  }

  // Check if channel is healthy
  private isChannelHealthy(channel: ConnectivityChannel): boolean {
    const health = this.channelHealth.get(channel);
    if (!health) return false;
    
    return health.status === 'healthy' || health.status === 'degraded';
  }

  // Handle mesh message
  private handleMeshMessage(message: MeshMessage): void {
    // Convert mesh message to regular message
    const regularMessage: Message = {
      id: message.id,
      content: message.content,
      recipientId: message.targetPeerId,
      channel: ConnectivityChannel.WEBRTC_P2P,
      priority: message.priority,
      ttl: message.ttl,
      hopLimit: message.hopLimit,
      timestamp: message.timestamp,
      encrypted: message.encrypted
    };

    // Process through CRDT sync if enabled
    if (this.crdtSync && message.messageType === 'sync') {
      this.handleSyncMessage(message);
    }

    console.log('📨 Mesh message received:', message.id);
  }

  // Handle sync message
  private handleSyncMessage(message: MeshMessage): void {
    if (!this.crdtSync) return;

    try {
      // Parse CRDT operations from message content
      const operations: CRDTOperation[] = JSON.parse(
        new TextDecoder().decode(message.content)
      );

      // Process operations
      for (const operation of operations) {
        // This would trigger CRDT merge logic
        console.log('🔄 Processing sync operation:', operation.id);
      }
    } catch (error) {
      console.error('❌ Failed to process sync message:', error);
    }
  }

  // Start health monitoring
  private startHealthMonitoring(): void {
    setInterval(() => {
      this.updateChannelHealth();
    }, 5000); // Every 5 seconds
  }

  // Update channel health
  private updateChannelHealth(): void {
    const activeChannels = this.cal.getActiveChannels();
    
    for (const channel of activeChannels) {
      const health: ConnectivityHealth = {
        channel,
        status: 'healthy',
        latency: this.measureLatency(channel),
        throughput: this.measureThroughput(channel),
        errorRate: this.calculateErrorRate(channel),
        lastSeen: Date.now(),
        signalStrength: this.measureSignalStrength(channel),
        peerCount: this.getPeerCount(channel)
      };

      this.channelHealth.set(channel, health);
    }
  }

  // Measure channel latency
  private measureLatency(channel: ConnectivityChannel): number {
    // Placeholder implementation
    switch (channel) {
      case ConnectivityChannel.WEBRTC_P2P:
        return 50; // 50ms for WebRTC
      case ConnectivityChannel.BLUETOOTH_LE:
        return 200; // 200ms for Bluetooth
      case ConnectivityChannel.LAN_MDNS:
        return 10; // 10ms for LAN
      default:
        return 1000; // 1s default
    }
  }

  // Measure channel throughput
  private measureThroughput(channel: ConnectivityChannel): number {
    // Placeholder implementation
    switch (channel) {
      case ConnectivityChannel.WEBRTC_P2P:
        return 1000000; // 1MB/s
      case ConnectivityChannel.BLUETOOTH_LE:
        return 100000; // 100KB/s
      case ConnectivityChannel.LAN_MDNS:
        return 10000000; // 10MB/s
      default:
        return 10000; // 10KB/s default
    }
  }

  // Calculate error rate
  private calculateErrorRate(channel: ConnectivityChannel): number {
    // Placeholder implementation
    return this.errorCount / Math.max(this.messageCount, 1);
  }

  // Measure signal strength
  private measureSignalStrength(channel: ConnectivityChannel): number {
    // Placeholder implementation
    return Math.random() * 0.5 + 0.5; // 0.5 to 1.0
  }

  // Get peer count for channel
  private getPeerCount(channel: ConnectivityChannel): number {
    if (channel === ConnectivityChannel.WEBRTC_P2P && this.webRTCMesh) {
      return this.webRTCMesh.getPeers().length;
    }
    
    if (channel === ConnectivityChannel.LAN_MDNS && this.lanDiscovery) {
      return this.lanDiscovery.getPeers().length;
    }

    return 0;
  }

  // Start telemetry collection
  private startTelemetryCollection(): void {
    setInterval(() => {
      this.collectTelemetry();
    }, this.config.telemetryInterval);
  }

  // Collect telemetry data
  private collectTelemetry(): void {
    const telemetry = {
      timestamp: Date.now(),
      messageCount: this.messageCount,
      errorCount: this.errorCount,
      channelHealth: Object.fromEntries(this.channelHealth),
      activeChannels: this.cal.getActiveChannels(),
      uptime: Date.now() - this.startTime
    };

    this.telemetryData.push(telemetry);

    // Keep only last 1000 entries
    if (this.telemetryData.length > 1000) {
      this.telemetryData = this.telemetryData.slice(-1000);
    }
  }

  // Start Aura oversight
  private startAuraOversight(): void {
    this.auraHealthCheckInterval = window.setInterval(() => {
      this.performAuraHealthCheck();
    }, this.config.auraHealthCheckInterval);
  }

  // Perform Aura health check
  private performAuraHealthCheck(): void {
    // Analyze connectivity patterns and generate insights
    const insights = this.generateAuraInsights();
    this.auraInsights.push(...insights);

    // Keep only last 100 insights
    if (this.auraInsights.length > 100) {
      this.auraInsights = this.auraInsights.slice(-100);
    }

    console.log('🔮 Aura connectivity insights:', insights);
  }

  // Generate Aura insights
  private generateAuraInsights(): string[] {
    const insights: string[] = [];
    
    // Analyze channel health patterns
    const unhealthyChannels = Array.from(this.channelHealth.values())
      .filter(h => h.status === 'failed');
    
    if (unhealthyChannels.length > 0) {
      insights.push(`Channel degradation detected: ${unhealthyChannels.map(h => h.channel).join(', ')}`);
    }

    // Analyze latency patterns
    const avgLatency = Array.from(this.channelHealth.values())
      .reduce((sum, h) => sum + h.latency, 0) / this.channelHealth.size;
    
    if (avgLatency > 1000) {
      insights.push(`High latency detected: ${avgLatency.toFixed(0)}ms average`);
    }

    // Analyze error patterns
    const errorRate = this.errorCount / Math.max(this.messageCount, 1);
    if (errorRate > 0.1) {
      insights.push(`High error rate detected: ${(errorRate * 100).toFixed(1)}%`);
    }

    return insights;
  }

  // Start CRDT sync
  private startCRDTSync(): void {
    if (!this.crdtSync) return;

    setInterval(() => {
      this.performCRDTSync();
    }, this.config.syncIntervalMs);
  }

  // Perform CRDT sync
  private async performCRDTSync(): Promise<void> {
    if (!this.crdtSync) return;

    // Get all connected peers
    const peers = await this.discoverPeers();
    
    for (const peer of peers) {
      try {
        // Get pending operations for this peer
        const pendingOps = this.crdtSync.getPendingOperations(peer.id);
        
        if (pendingOps.length > 0) {
          // Send sync message
          const syncMessage: Message = {
            id: this.generateMessageId(),
            content: new TextEncoder().encode(JSON.stringify(pendingOps)),
            channel: ConnectivityChannel.WEBRTC_P2P,
            priority: 'normal',
            ttl: 60000,
            hopLimit: 3,
            timestamp: Date.now(),
            encrypted: true
          };

          await this.sendMessage(syncMessage);
        }
      } catch (error) {
        console.error('❌ CRDT sync failed for peer:', peer.id, error);
      }
    }
  }

  // Discover peers across all channels
  async discoverPeers(): Promise<PeerInfo[]> {
    const allPeers: PeerInfo[] = [];

    // Get peers from CAL
    const calPeers = await this.cal.discoverPeers();
    allPeers.push(...calPeers);

    // Get peers from WebRTC mesh
    if (this.webRTCMesh) {
      const meshPeers = this.webRTCMesh.getPeers();
      allPeers.push(...meshPeers);
    }

    // Get peers from LAN discovery
    if (this.lanDiscovery) {
      const lanPeers = this.lanDiscovery.getPeers();
      // Convert LAN peers to PeerInfo format
      const convertedPeers: PeerInfo[] = lanPeers.map(peer => ({
        id: peer.id,
        name: peer.name,
        channels: [ConnectivityChannel.LAN_MDNS],
        signalStrength: peer.signalStrength,
        lastSeen: peer.lastSeen,
        capabilities: peer.capabilities,
        publicKey: peer.publicKey
      }));
      allPeers.push(...convertedPeers);
    }

    // Deduplicate peers
    const uniquePeers = new Map<string, PeerInfo>();
    for (const peer of allPeers) {
      if (!uniquePeers.has(peer.id)) {
        uniquePeers.set(peer.id, peer);
      }
    }

    return Array.from(uniquePeers.values());
  }

  // Get enabled channels
  private getEnabledChannels(): ConnectivityChannel[] {
    const channels: ConnectivityChannel[] = [];

    if (this.config.enableWebRTCMesh) {
      channels.push(ConnectivityChannel.WEBRTC_P2P);
    }
    if (this.config.enableLANDiscovery) {
      channels.push(ConnectivityChannel.LAN_MDNS);
    }
    if (this.config.enableBluetoothLE) {
      channels.push(ConnectivityChannel.BLUETOOTH_LE);
    }
    if (this.config.enableNFC) {
      channels.push(ConnectivityChannel.NFC);
    }
    if (this.config.enableUSB) {
      channels.push(ConnectivityChannel.USB_TETHER);
    }
    if (this.config.enableLoRa) {
      channels.push(ConnectivityChannel.LORA_MESH);
    }
    if (this.config.enableExoticChannels) {
      channels.push(
        ConnectivityChannel.LIGHT_PULSE,
        ConnectivityChannel.FREQUENCY_WAVE,
        ConnectivityChannel.NATURE_WHISPER,
        ConnectivityChannel.QUANTUM_FLUTTER
      );
    }

    return channels;
  }

  // Generate node ID
  private generateNodeId(): string {
    return `sacred-node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate message ID
  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get connectivity statistics
  getConnectivityStats(): SacredConnectivityStats {
    const totalChannels = this.getEnabledChannels().length;
    const activeChannels = this.cal.getActiveChannels().length;
    const totalPeers = this.channelHealth.size;
    const averageLatency = Array.from(this.channelHealth.values())
      .reduce((sum, h) => sum + h.latency, 0) / Math.max(this.channelHealth.size, 1);
    const errorRate = this.errorCount / Math.max(this.messageCount, 1);
    const uptime = Date.now() - this.startTime;

    let syncOperations = 0;
    let conflictsResolved = 0;
    
    if (this.crdtSync) {
      const syncStats = this.crdtSync.getSyncStats();
      syncOperations = syncStats.totalOperations;
      conflictsResolved = syncStats.mergeCount;
    }

    return {
      totalChannels,
      activeChannels,
      totalPeers,
      totalMessages: this.messageCount,
      averageLatency,
      errorRate,
      uptime,
      syncOperations,
      conflictsResolved,
      auraInsights: [...this.auraInsights]
    };
  }

  // Get active channels
  getActiveChannels(): ConnectivityChannel[] {
    return this.cal.getActiveChannels();
  }

  // Get channel health
  getChannelHealth(): Map<ConnectivityChannel, ConnectivityHealth> {
    return new Map(this.channelHealth);
  }

  // Get telemetry data
  getTelemetryData(): any[] {
    return [...this.telemetryData];
  }

  // Get Aura insights
  getAuraInsights(): string[] {
    return [...this.auraInsights];
  }

  // Stop orchestrator (alias for shutdown)
  async stop(): Promise<void> {
    return this.shutdown();
  }

  // Shutdown the orchestrator
  async shutdown(): Promise<void> {
    console.log('🌟 Shutting down Sacred Connectivity Orchestrator...');

    // Clear intervals
    if (this.auraHealthCheckInterval) {
      clearInterval(this.auraHealthCheckInterval);
    }

    // Shutdown WebRTC mesh
    if (this.webRTCMesh) {
      await this.webRTCMesh.shutdown();
    }

    // Shutdown LAN discovery
    if (this.lanDiscovery) {
      this.lanDiscovery.stopDiscovery();
    }

    // Shutdown CAL
    await this.cal.shutdown();

    this.isInitialized = false;
    console.log('🌟 Sacred Connectivity Orchestrator shutdown complete');
  }
}
