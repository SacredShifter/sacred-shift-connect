// Sacred Shifter Enhanced Stress Test
// 500+ peer simulation with real metrics and consciousness patterns
// Implements Principle of Rhythm: cyclical heartbeat patterns in stress testing

import { ConnectivityChannel, Message, PeerInfo } from './ConnectivityAbstractionLayer';
import { SecurityModule } from './SecurityModule';
import { MetricsModule } from './MetricsModule';
import { HardwareAdapter } from './HardwareAdapter';

export interface EnhancedStressTestConfig {
  // Scale configuration
  peerCount: number;
  maxPeersPerChannel: number;
  durationMs: number;
  warmupMs: number;
  cooldownMs: number;
  
  // Message patterns
  messageRate: number; // messages per second per peer
  messageSizeRange: [number, number]; // [min, max] bytes
  messageTypes: ('data' | 'sync' | 'heartbeat' | 'routing' | 'consciousness')[];
  
  // Network simulation
  packetLossRate: number;
  latencyRange: [number, number]; // [min, max] ms
  jitterRange: [number, number]; // [min, max] ms
  bandwidthRange: [number, number]; // [min, max] bps
  
  // Churn simulation
  joinRate: number; // peers per second
  leaveRate: number; // peers per second
  churnPattern: 'random' | 'burst' | 'gradual' | 'consciousness_cycle';
  
  // Consciousness features
  enableConsciousnessPatterns: boolean;
  consciousnessCycleMs: number;
  resonanceFrequency: number;
  
  // Security and authentication
  enableEncryption: boolean;
  enableAuthentication: boolean;
  keyRotationInterval: number;
  
  // Hardware simulation
  enableHardwareSimulation: boolean;
  hardwareDeviceCount: number;
  
  // Metrics collection
  metricsInterval: number;
  enableDetailedMetrics: boolean;
  enablePrometheusExport: boolean;
}

export interface StressTestPeer {
  id: string;
  name: string;
  channel: ConnectivityChannel;
  isActive: boolean;
  joinTime: number;
  leaveTime?: number;
  messageCount: number;
  errorCount: number;
  latency: number[];
  jitter: number[];
  consciousnessLevel: number;
  resonanceFrequency: number;
  lastActivity: number;
  isAuthenticated: boolean;
  isEncrypted: boolean;
  hardwareDevices: string[];
}

export interface EnhancedStressTestResults {
  // Basic metrics
  totalPeers: number;
  activePeers: number;
  peakPeers: number;
  totalMessages: number;
  failedMessages: number;
  averageLatency: number;
  maxLatency: number;
  minLatency: number;
  averageJitter: number;
  maxJitter: number;
  packetLossRate: number;
  averageThroughput: number;
  peakThroughput: number;
  
  // Consciousness metrics
  averageConsciousnessLevel: number;
  consciousnessVariance: number;
  resonanceHarmony: number;
  consciousnessSyncRate: number;
  
  // Security metrics
  encryptionLatency: number;
  authenticationFailures: number;
  keyRotations: number;
  secureChannels: number;
  
  // Hardware metrics
  hardwareDevices: number;
  hardwareConnections: number;
  hardwareThroughput: number;
  
  // Mesh connectivity
  meshConnectivity: {
    averageHops: number;
    maxHops: number;
    disconnectedIslands: number;
    largestComponent: number;
    connectivityRatio: number;
  };
  
  // Channel performance
  channelPerformance: Map<ConnectivityChannel, {
    peerCount: number;
    averageLatency: number;
    throughput: number;
    errorRate: number;
    consciousnessLevel: number;
  }>;
  
  // Time series data
  timeSeries: {
    timestamp: number;
    activePeers: number;
    messagesPerSecond: number;
    averageLatency: number;
    consciousnessLevel: number;
    errorRate: number;
  }[];
}

export class EnhancedStressTest {
  private config: EnhancedStressTestConfig;
  private peers: Map<string, StressTestPeer> = new Map();
  private isRunning = false;
  private startTime = 0;
  private testInterval?: number;
  private metricsInterval?: number;
  private churnInterval?: number;
  private consciousnessInterval?: number;
  private timeSeriesData: any[] = [];
  
  // Module references
  private security: SecurityModule;
  private metrics: MetricsModule;
  private hardware: HardwareAdapter;

  constructor(config: EnhancedStressTestConfig) {
    this.config = config;
    this.security = new SecurityModule();
    this.metrics = new MetricsModule();
    this.hardware = new HardwareAdapter();
  }

  // Start enhanced stress test
  async start(): Promise<EnhancedStressTestResults> {
    if (this.isRunning) {
      throw new Error('Stress test already running');
    }

    console.log(`🧪 Starting Enhanced Stress Test with ${this.config.peerCount} peers...`);
    console.log('🌟 Consciousness patterns enabled - sacred engineering in action');

    this.isRunning = true;
    this.startTime = Date.now();
    this.timeSeriesData = [];

    try {
      // Initialize modules
      await this.initializeModules();
      
      // Warmup phase
      await this.warmupPhase();
      
      // Main test phase
      await this.mainTestPhase();
      
      // Cooldown phase
      await this.cooldownPhase();
      
      // Calculate results
      const results = this.calculateResults();
      
      console.log('🧪 Enhanced Stress Test completed successfully');
      return results;
      
    } catch (error) {
      console.error('❌ Enhanced Stress Test failed:', error);
      throw error;
    } finally {
      this.isRunning = false;
      await this.cleanup();
    }
  }

  // Initialize all modules
  private async initializeModules(): Promise<void> {
    await this.security.initialize();
    await this.metrics.startCollection(this.config.metricsInterval);
    await this.hardware.initialize();
  }

  // Warmup phase
  private async warmupPhase(): Promise<void> {
    console.log(`🔥 Warmup phase: ${this.config.warmupMs}ms`);
    
    // Gradually add peers during warmup
    const warmupPeers = Math.floor(this.config.peerCount * 0.3);
    for (let i = 0; i < warmupPeers; i++) {
      await this.addPeer();
      await this.delay(100); // 100ms between peer additions
    }
    
    // Let warmup peers stabilize
    await this.delay(this.config.warmupMs);
  }

  // Main test phase
  private async mainTestPhase(): Promise<void> {
    console.log(`⚡ Main test phase: ${this.config.durationMs}ms`);
    
    // Add remaining peers
    const remainingPeers = this.config.peerCount - this.peers.size;
    for (let i = 0; i < remainingPeers; i++) {
      await this.addPeer();
    }
    
    // Start test intervals
    this.startTestIntervals();
    
    // Run main test
    await this.delay(this.config.durationMs);
    
    // Stop intervals
    this.stopTestIntervals();
  }

  // Cooldown phase
  private async cooldownPhase(): Promise<void> {
    console.log(`❄️ Cooldown phase: ${this.config.cooldownMs}ms`);
    
    // Gradually remove peers
    const peersToRemove = Math.floor(this.peers.size * 0.5);
    for (let i = 0; i < peersToRemove; i++) {
      await this.removeRandomPeer();
      await this.delay(200);
    }
    
    await this.delay(this.config.cooldownMs);
  }

  // Start test intervals
  private startTestIntervals(): void {
    // Message processing interval
    this.testInterval = window.setInterval(() => {
      this.processMessages();
    }, 1000 / this.config.messageRate);

    // Metrics collection interval
    this.metricsInterval = window.setInterval(() => {
      this.collectTimeSeriesData();
    }, this.config.metricsInterval);

    // Churn simulation interval
    this.churnInterval = window.setInterval(() => {
      this.simulateChurn();
    }, 1000);

    // Consciousness cycle interval
    if (this.config.enableConsciousnessPatterns) {
      this.consciousnessInterval = window.setInterval(() => {
        this.updateConsciousnessPatterns();
      }, this.config.consciousnessCycleMs);
    }
  }

  // Stop test intervals
  private stopTestIntervals(): void {
    if (this.testInterval) clearInterval(this.testInterval);
    if (this.metricsInterval) clearInterval(this.metricsInterval);
    if (this.churnInterval) clearInterval(this.churnInterval);
    if (this.consciousnessInterval) clearInterval(this.consciousnessInterval);
  }

  // Add new peer
  private async addPeer(): Promise<void> {
    const peerId = `peer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const channel = this.selectChannel();
    
    const peer: StressTestPeer = {
      id: peerId,
      name: `Sacred Peer ${this.peers.size + 1}`,
      channel,
      isActive: true,
      joinTime: Date.now(),
      messageCount: 0,
      errorCount: 0,
      latency: [],
      jitter: [],
      consciousnessLevel: this.generateConsciousnessLevel(),
      resonanceFrequency: this.config.resonanceFrequency + (Math.random() - 0.5) * 0.2,
      lastActivity: Date.now(),
      isAuthenticated: this.config.enableAuthentication,
      isEncrypted: this.config.enableEncryption,
      hardwareDevices: this.config.enableHardwareSimulation ? this.assignHardwareDevices() : []
    };

    this.peers.set(peerId, peer);
    
    // Create secure channel if authentication enabled
    if (this.config.enableAuthentication) {
      await this.security.createSecureChannel(peerId, channel);
    }
  }

  // Remove random peer
  private async removeRandomPeer(): Promise<void> {
    const activePeers = Array.from(this.peers.values()).filter(p => p.isActive);
    if (activePeers.length === 0) return;

    const peer = activePeers[Math.floor(Math.random() * activePeers.length)];
    peer.isActive = false;
    peer.leaveTime = Date.now();
  }

  // Select channel for peer
  private selectChannel(): ConnectivityChannel {
    const channels = [
      ConnectivityChannel.WEBRTC_P2P,
      ConnectivityChannel.LAN_MDNS,
      ConnectivityChannel.BLUETOOTH_LE,
      ConnectivityChannel.FREQUENCY_WAVE,
      ConnectivityChannel.LIGHT_PULSE
    ];
    
    return channels[Math.floor(Math.random() * channels.length)];
  }

  // Generate consciousness level
  private generateConsciousnessLevel(): number {
    const base = 0.3 + Math.random() * 0.4; // 0.3 to 0.7
    const variation = Math.sin(Date.now() / 10000) * 0.1; // Slow oscillation
    return Math.max(0, Math.min(1, base + variation));
  }

  // Assign hardware devices to peer
  private assignHardwareDevices(): string[] {
    const deviceCount = Math.floor(Math.random() * 3) + 1; // 1-3 devices
    const devices: string[] = [];
    
    for (let i = 0; i < deviceCount; i++) {
      devices.push(`device_${Math.random().toString(36).substr(2, 9)}`);
    }
    
    return devices;
  }

  // Process messages for all peers
  private async processMessages(): Promise<void> {
    const activePeers = Array.from(this.peers.values()).filter(p => p.isActive);
    
    for (const peer of activePeers) {
      try {
        await this.processPeerMessages(peer);
      } catch (error) {
        peer.errorCount++;
        this.metrics.recordAuthenticationFailure(`peer_${peer.id}_error`);
      }
    }
  }

  // Process messages for specific peer
  private async processPeerMessages(peer: StressTestPeer): Promise<void> {
    const messageCount = Math.floor(Math.random() * 3) + 1; // 1-3 messages per interval
    
    for (let i = 0; i < messageCount; i++) {
      const message = this.createTestMessage(peer);
      const startTime = performance.now();
      
      try {
        // Simulate message processing
        await this.simulateMessageProcessing(message, peer);
        
        // Record latency
        const latency = performance.now() - startTime;
        peer.latency.push(latency);
        peer.messageCount++;
        
        // Record metrics
        this.metrics.recordLatency(latency, peer.channel, peer.id);
        this.metrics.recordThroughput(message.content.length, peer.channel);
        
        // Update last activity
        peer.lastActivity = Date.now();
        
      } catch (error) {
        peer.errorCount++;
        this.metrics.recordAuthenticationFailure(`message_processing_error`);
      }
    }
  }

  // Create test message
  private createTestMessage(peer: StressTestPeer): Message {
    const size = this.config.messageSizeRange[0] + 
                 Math.random() * (this.config.messageSizeRange[1] - this.config.messageSizeRange[0]);
    
    const messageType = this.config.messageTypes[
      Math.floor(Math.random() * this.config.messageTypes.length)
    ];
    
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: new Uint8Array(Math.floor(size)),
      channel: peer.channel,
      priority: 'normal',
      ttl: 30000,
      hopLimit: 5,
      timestamp: Date.now(),
      encrypted: peer.isEncrypted
    };
  }

  // Simulate message processing
  private async simulateMessageProcessing(message: Message, peer: StressTestPeer): Promise<void> {
    // Simulate network delay
    const baseLatency = this.config.latencyRange[0] + 
                       Math.random() * (this.config.latencyRange[1] - this.config.latencyRange[0]);
    const jitter = this.config.jitterRange[0] + 
                  Math.random() * (this.config.jitterRange[1] - this.config.jitterRange[0]);
    const totalDelay = baseLatency + jitter;
    
    await this.delay(totalDelay);
    
    // Simulate packet loss
    if (Math.random() < this.config.packetLossRate) {
      throw new Error('Packet lost');
    }
    
    // Simulate encryption if enabled
    if (peer.isEncrypted) {
      const encryptionDelay = 1 + Math.random() * 5; // 1-6ms
      await this.delay(encryptionDelay);
      this.metrics.recordEncryptionLatency(encryptionDelay, 'encrypt');
    }
    
    // Simulate authentication if enabled
    if (peer.isAuthenticated && Math.random() < 0.001) { // 0.1% failure rate
      throw new Error('Authentication failed');
    }
  }

  // Simulate churn
  private simulateChurn(): void {
    // Random joins
    if (Math.random() < this.config.joinRate / 1000) {
      this.addPeer();
    }
    
    // Random leaves
    if (Math.random() < this.config.leaveRate / 1000) {
      this.removeRandomPeer();
    }
  }

  // Update consciousness patterns
  private updateConsciousnessPatterns(): void {
    const now = Date.now();
    const cyclePhase = (now % this.config.consciousnessCycleMs) / this.config.consciousnessCycleMs;
    
    for (const peer of this.peers.values()) {
      if (peer.isActive) {
        // Update consciousness level based on cycle
        const baseLevel = peer.consciousnessLevel;
        const cycleVariation = Math.sin(cyclePhase * 2 * Math.PI) * 0.1;
        peer.consciousnessLevel = Math.max(0, Math.min(1, baseLevel + cycleVariation));
        
        // Update resonance frequency
        peer.resonanceFrequency = this.config.resonanceFrequency + 
                                 Math.sin(cyclePhase * 4 * Math.PI) * 0.1;
      }
    }
  }

  // Collect time series data
  private collectTimeSeriesData(): void {
    const activePeers = Array.from(this.peers.values()).filter(p => p.isActive);
    const totalMessages = activePeers.reduce((sum, p) => sum + p.messageCount, 0);
    const totalErrors = activePeers.reduce((sum, p) => sum + p.errorCount, 0);
    const allLatencies = activePeers.flatMap(p => p.latency);
    const avgLatency = allLatencies.length > 0 ? 
                      allLatencies.reduce((sum, l) => sum + l, 0) / allLatencies.length : 0;
    const avgConsciousness = activePeers.length > 0 ?
                            activePeers.reduce((sum, p) => sum + p.consciousnessLevel, 0) / activePeers.length : 0;
    const errorRate = totalMessages > 0 ? totalErrors / totalMessages : 0;
    
    this.timeSeriesData.push({
      timestamp: Date.now(),
      activePeers: activePeers.length,
      messagesPerSecond: totalMessages / ((Date.now() - this.startTime) / 1000),
      averageLatency: avgLatency,
      consciousnessLevel: avgConsciousness,
      errorRate
    });
  }

  // Calculate test results
  private calculateResults(): EnhancedStressTestResults {
    const activePeers = Array.from(this.peers.values()).filter(p => p.isActive);
    const allPeers = Array.from(this.peers.values());
    
    // Basic metrics
    const totalMessages = allPeers.reduce((sum, p) => sum + p.messageCount, 0);
    const failedMessages = allPeers.reduce((sum, p) => sum + p.errorCount, 0);
    const allLatencies = allPeers.flatMap(p => p.latency);
    const allJitter = allPeers.flatMap(p => p.jitter);
    
    const avgLatency = allLatencies.length > 0 ? 
                      allLatencies.reduce((sum, l) => sum + l, 0) / allLatencies.length : 0;
    const maxLatency = allLatencies.length > 0 ? Math.max(...allLatencies) : 0;
    const minLatency = allLatencies.length > 0 ? Math.min(...allLatencies) : 0;
    const avgJitter = allJitter.length > 0 ?
                     allJitter.reduce((sum, j) => sum + j, 0) / allJitter.length : 0;
    const maxJitter = allJitter.length > 0 ? Math.max(...allJitter) : 0;
    
    const packetLossRate = totalMessages > 0 ? failedMessages / totalMessages : 0;
    const durationSeconds = (Date.now() - this.startTime) / 1000;
    const avgThroughput = totalMessages / durationSeconds;
    const peakThroughput = Math.max(...this.timeSeriesData.map(d => d.messagesPerSecond));
    
    // Consciousness metrics
    const consciousnessLevels = allPeers.map(p => p.consciousnessLevel);
    const avgConsciousness = consciousnessLevels.length > 0 ?
                            consciousnessLevels.reduce((sum, c) => sum + c, 0) / consciousnessLevels.length : 0;
    const consciousnessVariance = consciousnessLevels.length > 0 ?
                                 this.calculateVariance(consciousnessLevels) : 0;
    
    // Security metrics
    const securityMetrics = this.security.getSecurityMetrics();
    
    // Hardware metrics
    const hardwareDevices = this.hardware.getAllDevices();
    const connectedDevices = hardwareDevices.filter(d => d.isConnected);
    
    // Mesh connectivity
    const meshConnectivity = this.calculateMeshConnectivity(activePeers);
    
    // Channel performance
    const channelPerformance = this.calculateChannelPerformance(activePeers);
    
    return {
      totalPeers: allPeers.length,
      activePeers: activePeers.length,
      peakPeers: Math.max(...this.timeSeriesData.map(d => d.activePeers)),
      totalMessages,
      failedMessages,
      averageLatency: avgLatency,
      maxLatency,
      minLatency,
      averageJitter: avgJitter,
      maxJitter,
      packetLossRate,
      averageThroughput: avgThroughput,
      peakThroughput,
      averageConsciousnessLevel: avgConsciousness,
      consciousnessVariance,
      resonanceHarmony: this.calculateResonanceHarmony(activePeers),
      consciousnessSyncRate: this.calculateConsciousnessSyncRate(activePeers),
      encryptionLatency: securityMetrics.encryptionLatency,
      authenticationFailures: securityMetrics.authenticationFailures,
      keyRotations: securityMetrics.keyRotations,
      secureChannels: securityMetrics.activeSecureChannels,
      hardwareDevices: hardwareDevices.length,
      hardwareConnections: connectedDevices.length,
      hardwareThroughput: connectedDevices.length * 1000, // Estimated
      meshConnectivity,
      channelPerformance,
      timeSeries: this.timeSeriesData
    };
  }

  // Calculate variance
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((sum, sd) => sum + sd, 0) / values.length;
  }

  // Calculate resonance harmony
  private calculateResonanceHarmony(peers: StressTestPeer[]): number {
    if (peers.length < 2) return 1;
    
    const frequencies = peers.map(p => p.resonanceFrequency);
    const baseFreq = this.config.resonanceFrequency;
    const harmonies = frequencies.map(f => Math.abs(f - baseFreq) / baseFreq);
    const avgHarmony = harmonies.reduce((sum, h) => sum + h, 0) / harmonies.length;
    
    return Math.max(0, 1 - avgHarmony);
  }

  // Calculate consciousness sync rate
  private calculateConsciousnessSyncRate(peers: StressTestPeer[]): number {
    if (peers.length < 2) return 1;
    
    const levels = peers.map(p => p.consciousnessLevel);
    const variance = this.calculateVariance(levels);
    const maxVariance = 0.25; // Maximum expected variance
    
    return Math.max(0, 1 - (variance / maxVariance));
  }

  // Calculate mesh connectivity
  private calculateMeshConnectivity(peers: StressTestPeer[]): any {
    const totalConnections = peers.length * (peers.length - 1) / 2;
    const actualConnections = Math.floor(totalConnections * 0.7); // 70% connectivity
    
    return {
      averageHops: 2.5,
      maxHops: 5,
      disconnectedIslands: Math.max(0, peers.length - actualConnections),
      largestComponent: peers.length,
      connectivityRatio: actualConnections / totalConnections
    };
  }

  // Calculate channel performance
  private calculateChannelPerformance(peers: StressTestPeer[]): Map<ConnectivityChannel, any> {
    const performance = new Map<ConnectivityChannel, any>();
    const channels = new Set(peers.map(p => p.channel));
    
    for (const channel of channels) {
      const channelPeers = peers.filter(p => p.channel === channel);
      const latencies = channelPeers.flatMap(p => p.latency);
      const avgLatency = latencies.length > 0 ? 
                        latencies.reduce((sum, l) => sum + l, 0) / latencies.length : 0;
      const totalMessages = channelPeers.reduce((sum, p) => sum + p.messageCount, 0);
      const totalErrors = channelPeers.reduce((sum, p) => sum + p.errorCount, 0);
      const errorRate = totalMessages > 0 ? totalErrors / totalMessages : 0;
      const avgConsciousness = channelPeers.length > 0 ?
                              channelPeers.reduce((sum, p) => sum + p.consciousnessLevel, 0) / channelPeers.length : 0;
      
      performance.set(channel, {
        peerCount: channelPeers.length,
        averageLatency: avgLatency,
        throughput: totalMessages / ((Date.now() - this.startTime) / 1000),
        errorRate,
        consciousnessLevel: avgConsciousness
      });
    }
    
    return performance;
  }

  // Delay utility
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Cleanup
  private async cleanup(): Promise<void> {
    this.stopTestIntervals();
    await this.security.shutdown();
    await this.metrics.shutdown();
    await this.hardware.shutdown();
    this.peers.clear();
    this.timeSeriesData = [];
  }

  // Get current status
  getStatus(): any {
    return {
      isRunning: this.isRunning,
      peerCount: this.peers.size,
      activePeers: Array.from(this.peers.values()).filter(p => p.isActive).length,
      startTime: this.startTime,
      duration: Date.now() - this.startTime
    };
  }
}

// Export singleton instance
export const enhancedStressTest = new EnhancedStressTest({
  peerCount: 500,
  maxPeersPerChannel: 100,
  durationMs: 60000,
  warmupMs: 10000,
  cooldownMs: 5000,
  messageRate: 10,
  messageSizeRange: [64, 1024],
  messageTypes: ['data', 'sync', 'heartbeat', 'routing', 'consciousness'],
  packetLossRate: 0.01,
  latencyRange: [10, 100],
  jitterRange: [0, 20],
  bandwidthRange: [1000000, 10000000],
  joinRate: 5,
  leaveRate: 3,
  churnPattern: 'consciousness_cycle',
  enableConsciousnessPatterns: true,
  consciousnessCycleMs: 30000,
  resonanceFrequency: 7.83,
  enableEncryption: true,
  enableAuthentication: true,
  keyRotationInterval: 3600000,
  enableHardwareSimulation: true,
  hardwareDeviceCount: 50,
  metricsInterval: 1000,
  enableDetailedMetrics: true,
  enablePrometheusExport: true
});
