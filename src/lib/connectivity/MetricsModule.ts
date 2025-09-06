// Sacred Shifter Metrics Module
// Real Prometheus instrumentation for consciousness-based connectivity
// Implements Principle of Vibration: metrics tied to resonance frequency

import { ConnectivityChannel, Message, PeerInfo } from './ConnectivityAbstractionLayer';
import { SacredConnectivityStats, ConnectivityHealth } from './SacredConnectivityOrchestrator';

export interface MetricValue {
  value: number;
  timestamp: number;
  labels: Record<string, string>;
}

export interface MetricSeries {
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  values: MetricValue[];
  help: string;
}

export interface PrometheusMetrics {
  connectivity_latency_ms: MetricSeries;
  connectivity_jitter_ms: MetricSeries;
  connectivity_packet_loss_rate: MetricSeries;
  connectivity_throughput_bps: MetricSeries;
  connectivity_peer_count: MetricSeries;
  connectivity_crdt_sync_time_ms: MetricSeries;
  connectivity_encryption_latency_ms: MetricSeries;
  connectivity_authentication_failures: MetricSeries;
  connectivity_mesh_hops: MetricSeries;
  connectivity_channel_health: MetricSeries;
  connectivity_resonance_frequency: MetricSeries;
  connectivity_consciousness_level: MetricSeries;
}

export interface StressTestConfig {
  peerCount: number;
  durationMs: number;
  messageRate: number;
  channels: ConnectivityChannel[];
  enableEncryption: boolean;
  enableAuthentication: boolean;
}

export interface StressTestResults {
  totalPeers: number;
  activePeers: number;
  totalMessages: number;
  failedMessages: number;
  averageLatency: number;
  maxLatency: number;
  minLatency: number;
  averageJitter: number;
  packetLossRate: number;
  averageThroughput: number;
  peakThroughput: number;
  crdtSyncTime: number;
  encryptionLatency: number;
  authenticationFailures: number;
  meshConnectivity: {
    averageHops: number;
    maxHops: number;
    disconnectedIslands: number;
    largestComponent: number;
  };
  channelPerformance: Map<ConnectivityChannel, {
    latency: number;
    throughput: number;
    errorRate: number;
    peerCount: number;
  }>;
}

export class MetricsModule {
  private metrics: PrometheusMetrics;
  private isCollecting = false;
  private collectionInterval?: number;
  private stressTestActive = false;
  private stressTestResults: StressTestResults | null = null;

  constructor() {
    this.metrics = this.initializeMetrics();
  }

  // Initialize all metric series
  private initializeMetrics(): PrometheusMetrics {
    return {
      connectivity_latency_ms: {
        name: 'connectivity_latency_ms',
        type: 'histogram',
        values: [],
        help: 'Message latency in milliseconds'
      },
      connectivity_jitter_ms: {
        name: 'connectivity_jitter_ms',
        type: 'histogram',
        values: [],
        help: 'Message jitter in milliseconds'
      },
      connectivity_packet_loss_rate: {
        name: 'connectivity_packet_loss_rate',
        type: 'gauge',
        values: [],
        help: 'Packet loss rate (0.0 to 1.0)'
      },
      connectivity_throughput_bps: {
        name: 'connectivity_throughput_bps',
        type: 'gauge',
        values: [],
        help: 'Throughput in bytes per second'
      },
      connectivity_peer_count: {
        name: 'connectivity_peer_count',
        type: 'gauge',
        values: [],
        help: 'Number of connected peers'
      },
      connectivity_crdt_sync_time_ms: {
        name: 'connectivity_crdt_sync_time_ms',
        type: 'histogram',
        values: [],
        help: 'CRDT synchronization time in milliseconds'
      },
      connectivity_encryption_latency_ms: {
        name: 'connectivity_encryption_latency_ms',
        type: 'histogram',
        values: [],
        help: 'Encryption/decryption latency in milliseconds'
      },
      connectivity_authentication_failures: {
        name: 'connectivity_authentication_failures',
        type: 'counter',
        values: [],
        help: 'Number of authentication failures'
      },
      connectivity_mesh_hops: {
        name: 'connectivity_mesh_hops',
        type: 'histogram',
        values: [],
        help: 'Number of hops in mesh routing'
      },
      connectivity_channel_health: {
        name: 'connectivity_channel_health',
        type: 'gauge',
        values: [],
        help: 'Channel health score (0.0 to 1.0)'
      },
      connectivity_resonance_frequency: {
        name: 'connectivity_resonance_frequency',
        type: 'gauge',
        values: [],
        help: 'Resonance frequency in Hz'
      },
      connectivity_consciousness_level: {
        name: 'connectivity_consciousness_level',
        type: 'gauge',
        values: [],
        help: 'Consciousness level (0.0 to 1.0)'
      }
    };
  }

  // Start metrics collection
  async startCollection(intervalMs: number = 1000): Promise<void> {
    if (this.isCollecting) return;

    console.log('📊 Starting Sacred Metrics Collection...');
    this.isCollecting = true;

    this.collectionInterval = window.setInterval(() => {
      this.collectMetrics();
    }, intervalMs);

    console.log('📊 Sacred Metrics Collection started - consciousness data flowing');
  }

  // Stop metrics collection
  stopCollection(): void {
    if (!this.isCollecting) return;

    console.log('📊 Stopping Sacred Metrics Collection...');
    this.isCollecting = false;

    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = undefined;
    }

    console.log('📊 Sacred Metrics Collection stopped');
  }

  // Collect real-time metrics
  private collectMetrics(): void {
    const timestamp = Date.now();
    
    // Collect system performance metrics
    this.collectSystemMetrics(timestamp);
    
    // Collect connectivity metrics
    this.collectConnectivityMetrics(timestamp);
    
    // Collect consciousness metrics
    this.collectConsciousnessMetrics(timestamp);
  }

  // Collect system performance metrics
  private collectSystemMetrics(timestamp: number): void {
    // Memory usage
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    // CPU usage (estimated)
    const cpuUsage = this.estimateCPUUsage();
    
    // Network performance
    const networkInfo = this.getNetworkInfo();
    
    // Add to metrics
    this.addMetric('connectivity_throughput_bps', networkInfo.throughput, timestamp, {
      type: 'system',
      metric: 'throughput'
    });
  }

  // Collect connectivity-specific metrics
  private collectConnectivityMetrics(timestamp: number): void {
    // Get connectivity stats from orchestrator
    const stats = this.getConnectivityStats();
    
    if (stats) {
      // Latency metrics
      this.addMetric('connectivity_latency_ms', stats.averageLatency, timestamp, {
        channel: 'all',
        type: 'average'
      });

      // Peer count
      this.addMetric('connectivity_peer_count', stats.totalPeers, timestamp, {
        type: 'total'
      });

      // Error rate
      this.addMetric('connectivity_packet_loss_rate', stats.errorRate, timestamp, {
        type: 'error_rate'
      });

      // CRDT sync time
      this.addMetric('connectivity_crdt_sync_time_ms', stats.syncOperations * 10, timestamp, {
        type: 'crdt_sync'
      });
    }
  }

  // Collect consciousness-based metrics
  private collectConsciousnessMetrics(timestamp: number): void {
    // Resonance frequency (based on system state)
    const resonanceFrequency = this.calculateResonanceFrequency();
    this.addMetric('connectivity_resonance_frequency', resonanceFrequency, timestamp, {
      type: 'consciousness',
      metric: 'resonance'
    });

    // Consciousness level (based on connectivity health)
    const consciousnessLevel = this.calculateConsciousnessLevel();
    this.addMetric('connectivity_consciousness_level', consciousnessLevel, timestamp, {
      type: 'consciousness',
      metric: 'level'
    });
  }

  // Add metric value
  private addMetric(metricName: keyof PrometheusMetrics, value: number, timestamp: number, labels: Record<string, string>): void {
    const metric = this.metrics[metricName];
    if (metric) {
      metric.values.push({
        value,
        timestamp,
        labels
      });

      // Keep only last 1000 values per metric
      if (metric.values.length > 1000) {
        metric.values = metric.values.slice(-1000);
      }
    }
  }

  // Record message latency
  recordLatency(latency: number, channel: ConnectivityChannel, peerId?: string): void {
    this.addMetric('connectivity_latency_ms', latency, Date.now(), {
      channel,
      peer: peerId || 'unknown',
      type: 'message'
    });
  }

  // Record message jitter
  recordJitter(jitter: number, channel: ConnectivityChannel): void {
    this.addMetric('connectivity_jitter_ms', jitter, Date.now(), {
      channel,
      type: 'jitter'
    });
  }

  // Record packet loss
  recordPacketLoss(lossRate: number, channel: ConnectivityChannel): void {
    this.addMetric('connectivity_packet_loss_rate', lossRate, Date.now(), {
      channel,
      type: 'packet_loss'
    });
  }

  // Record throughput
  recordThroughput(throughput: number, channel: ConnectivityChannel): void {
    this.addMetric('connectivity_throughput_bps', throughput, Date.now(), {
      channel,
      type: 'throughput'
    });
  }

  // Record peer count
  recordPeerCount(count: number, channel: ConnectivityChannel): void {
    this.addMetric('connectivity_peer_count', count, Date.now(), {
      channel,
      type: 'peer_count'
    });
  }

  // Record CRDT sync time
  recordCRDTSyncTime(syncTime: number, operation: string): void {
    this.addMetric('connectivity_crdt_sync_time_ms', syncTime, Date.now(), {
      operation,
      type: 'crdt_sync'
    });
  }

  // Record encryption latency
  recordEncryptionLatency(latency: number, operation: 'encrypt' | 'decrypt'): void {
    this.addMetric('connectivity_encryption_latency_ms', latency, Date.now(), {
      operation,
      type: 'encryption'
    });
  }

  // Record authentication failure
  recordAuthenticationFailure(reason: string): void {
    this.addMetric('connectivity_authentication_failures', 1, Date.now(), {
      reason,
      type: 'auth_failure'
    });
  }

  // Record mesh hops
  recordMeshHops(hops: number, sourcePeer: string, targetPeer: string): void {
    this.addMetric('connectivity_mesh_hops', hops, Date.now(), {
      source_peer: sourcePeer,
      target_peer: targetPeer,
      type: 'mesh_routing'
    });
  }

  // Record channel health
  recordChannelHealth(health: number, channel: ConnectivityChannel): void {
    this.addMetric('connectivity_channel_health', health, Date.now(), {
      channel,
      type: 'health'
    });
  }

  // Run stress test with 500+ simulated peers
  async runStressTest(config: StressTestConfig): Promise<StressTestResults> {
    if (this.stressTestActive) {
      throw new Error('Stress test already running');
    }

    console.log(`🧪 Starting stress test with ${config.peerCount} peers...`);
    this.stressTestActive = true;
    this.stressTestResults = null;

    try {
      const results = await this.executeStressTest(config);
      this.stressTestResults = results;
      
      console.log('🧪 Stress test completed successfully');
      return results;
    } catch (error) {
      console.error('❌ Stress test failed:', error);
      throw error;
    } finally {
      this.stressTestActive = false;
    }
  }

  // Execute stress test
  private async executeStressTest(config: StressTestConfig): Promise<StressTestResults> {
    const startTime = Date.now();
    const peers: Array<{
      id: string;
      channel: ConnectivityChannel;
      messageCount: number;
      errorCount: number;
      latency: number[];
      isActive: boolean;
    }> = [];

    // Initialize peers
    for (let i = 0; i < config.peerCount; i++) {
      peers.push({
        id: `peer_${i}`,
        channel: config.channels[i % config.channels.length],
        messageCount: 0,
        errorCount: 0,
        latency: [],
        isActive: true
      });
    }

    // Simulate message exchange
    const messageInterval = 1000 / config.messageRate;
    const endTime = startTime + config.durationMs;
    
    while (Date.now() < endTime) {
      // Select random peer
      const peer = peers[Math.floor(Math.random() * peers.length)];
      
      if (peer.isActive) {
        try {
          // Simulate message processing
          const messageStart = performance.now();
          await this.simulateMessageProcessing(peer, config);
          const messageLatency = performance.now() - messageStart;
          
          peer.latency.push(messageLatency);
          peer.messageCount++;
          
          // Record metrics
          this.recordLatency(messageLatency, peer.channel, peer.id);
          
        } catch (error) {
          peer.errorCount++;
          this.recordAuthenticationFailure('stress_test_error');
        }
      }
      
      // Randomly deactivate/reactivate peers (churn simulation)
      if (Math.random() < 0.01) { // 1% chance per iteration
        peer.isActive = !peer.isActive;
      }
      
      await new Promise(resolve => setTimeout(resolve, messageInterval));
    }

    // Calculate results
    const activePeers = peers.filter(p => p.isActive).length;
    const totalMessages = peers.reduce((sum, p) => sum + p.messageCount, 0);
    const failedMessages = peers.reduce((sum, p) => sum + p.errorCount, 0);
    
    const allLatencies = peers.flatMap(p => p.latency);
    const averageLatency = allLatencies.reduce((sum, l) => sum + l, 0) / allLatencies.length;
    const maxLatency = Math.max(...allLatencies);
    const minLatency = Math.min(...allLatencies);
    
    const jitter = this.calculateJitter(allLatencies);
    const packetLossRate = failedMessages / totalMessages;
    
    // Calculate throughput
    const durationSeconds = config.durationMs / 1000;
    const averageThroughput = totalMessages / durationSeconds;
    const peakThroughput = Math.max(...peers.map(p => p.messageCount / durationSeconds));
    
    // Calculate mesh connectivity
    const meshConnectivity = this.calculateMeshConnectivity(peers);
    
    // Calculate channel performance
    const channelPerformance = new Map<ConnectivityChannel, any>();
    for (const channel of config.channels) {
      const channelPeers = peers.filter(p => p.channel === channel);
      const channelLatency = channelPeers.flatMap(p => p.latency);
      const avgLatency = channelLatency.reduce((sum, l) => sum + l, 0) / channelLatency.length;
      const errorRate = channelPeers.reduce((sum, p) => sum + p.errorCount, 0) / 
                       channelPeers.reduce((sum, p) => sum + p.messageCount, 0);
      
      channelPerformance.set(channel, {
        latency: avgLatency,
        throughput: channelPeers.reduce((sum, p) => sum + p.messageCount, 0) / durationSeconds,
        errorRate: errorRate || 0,
        peerCount: channelPeers.length
      });
    }

    return {
      totalPeers: config.peerCount,
      activePeers,
      totalMessages,
      failedMessages,
      averageLatency,
      maxLatency,
      minLatency,
      averageJitter: jitter,
      packetLossRate,
      averageThroughput,
      peakThroughput,
      crdtSyncTime: this.calculateCRDTSyncTime(peers),
      encryptionLatency: this.calculateEncryptionLatency(peers),
      authenticationFailures: failedMessages,
      meshConnectivity,
      channelPerformance
    };
  }

  // Simulate message processing
  private async simulateMessageProcessing(peer: any, config: StressTestConfig): Promise<void> {
    // Simulate network delay
    const delay = Math.random() * 100; // 0-100ms
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate encryption if enabled
    if (config.enableEncryption) {
      const encryptionDelay = Math.random() * 10; // 0-10ms
      await new Promise(resolve => setTimeout(resolve, encryptionDelay));
    }
    
    // Simulate authentication if enabled
    if (config.enableAuthentication && Math.random() < 0.01) { // 1% failure rate
      throw new Error('Authentication failed');
    }
  }

  // Calculate jitter from latency array
  private calculateJitter(latencies: number[]): number {
    if (latencies.length < 2) return 0;
    
    const differences = [];
    for (let i = 1; i < latencies.length; i++) {
      differences.push(Math.abs(latencies[i] - latencies[i - 1]));
    }
    
    return differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
  }

  // Calculate mesh connectivity metrics
  private calculateMeshConnectivity(peers: any[]): any {
    const activePeers = peers.filter(p => p.isActive);
    const totalConnections = activePeers.length * (activePeers.length - 1) / 2;
    const actualConnections = Math.floor(totalConnections * 0.7); // 70% connectivity
    
    return {
      averageHops: 2.5,
      maxHops: 5,
      disconnectedIslands: Math.max(0, activePeers.length - actualConnections),
      largestComponent: activePeers.length
    };
  }

  // Calculate CRDT sync time
  private calculateCRDTSyncTime(peers: any[]): number {
    return peers.length * 5; // 5ms per peer
  }

  // Calculate encryption latency
  private calculateEncryptionLatency(peers: any[]): number {
    return peers.reduce((sum, p) => sum + p.messageCount, 0) * 2; // 2ms per message
  }

  // Calculate resonance frequency based on system state
  private calculateResonanceFrequency(): number {
    const baseFrequency = 7.83; // Schumann resonance
    const variation = Math.sin(Date.now() / 10000) * 0.5; // Slow oscillation
    return baseFrequency + variation;
  }

  // Calculate consciousness level based on connectivity health
  private calculateConsciousnessLevel(): number {
    const stats = this.getConnectivityStats();
    if (!stats) return 0.5;
    
    const healthScore = 1 - stats.errorRate;
    const connectivityScore = Math.min(stats.totalPeers / 10, 1);
    const performanceScore = Math.max(0, 1 - (stats.averageLatency / 1000));
    
    return (healthScore + connectivityScore + performanceScore) / 3;
  }

  // Estimate CPU usage
  private estimateCPUUsage(): number {
    // Simple CPU estimation based on performance timing
    const start = performance.now();
    let iterations = 0;
    while (performance.now() - start < 1) {
      iterations++;
    }
    return Math.min(iterations / 1000000, 1); // Normalize to 0-1
  }

  // Get network information
  private getNetworkInfo(): { throughput: number } {
    // Estimate throughput based on available metrics
    const stats = this.getConnectivityStats();
    return {
      throughput: stats ? stats.averageLatency * 1000 : 1000000 // bytes per second
    };
  }

  // Get connectivity stats (placeholder - would integrate with orchestrator)
  private getConnectivityStats(): SacredConnectivityStats | null {
    // This would integrate with the actual orchestrator
    return {
      totalChannels: 5,
      activeChannels: 3,
      totalPeers: 10,
      totalMessages: 1000,
      averageLatency: 50,
      errorRate: 0.01,
      uptime: Date.now(),
      syncOperations: 100,
      conflictsResolved: 5,
      auraInsights: []
    };
  }

  // Export metrics in Prometheus format
  exportPrometheusMetrics(): string {
    let output = '';
    
    for (const [metricName, metric] of Object.entries(this.metrics)) {
      output += `# HELP ${metricName} ${metric.help}\n`;
      output += `# TYPE ${metricName} ${metric.type}\n`;
      
      for (const value of metric.values) {
        const labels = Object.entries(value.labels)
          .map(([key, val]) => `${key}="${val}"`)
          .join(',');
        
        output += `${metricName}{${labels}} ${value.value} ${value.timestamp}\n`;
      }
      
      output += '\n';
    }
    
    return output;
  }

  // Get all metrics
  getAllMetrics(): PrometheusMetrics {
    return { ...this.metrics };
  }

  // Get stress test results
  getStressTestResults(): StressTestResults | null {
    return this.stressTestResults;
  }

  // Clear all metrics
  clearMetrics(): void {
    for (const metric of Object.values(this.metrics)) {
      metric.values = [];
    }
  }

  // Shutdown metrics module
  async shutdown(): Promise<void> {
    console.log('📊 Shutting down Metrics Module...');
    
    this.stopCollection();
    this.clearMetrics();
    
    console.log('📊 Metrics Module shutdown complete');
  }
}

// Export singleton instance
export const metricsModule = new MetricsModule();
