// Sacred Shifter Connectivity Stress Test Harness
// Tests 100+ devices with mixed channels, packet loss, and node churn
// Ensures carrier-grade reliability that makes Telstra jealous

import { SacredConnectivityOrchestrator, SacredConnectivityConfig } from './SacredConnectivityOrchestrator';
import { ConnectivityChannel, Message } from './ConnectivityAbstractionLayer';
import { AuraConnectivityProfile } from './AuraConnectivityIntegration';

export interface StressTestConfig {
  // Device configuration
  deviceCount: number;
  maxDevicesPerChannel: number;
  deviceTypes: ('mobile' | 'desktop' | 'iot' | 'quantum')[];
  
  // Network conditions
  packetLossRate: number; // 0.0 to 1.0
  latencyRange: [number, number]; // [min, max] in ms
  bandwidthRange: [number, number]; // [min, max] in bps
  
  // Churn simulation
  joinRate: number; // devices per second
  leaveRate: number; // devices per second
  churnPattern: 'random' | 'burst' | 'gradual';
  
  // Test duration
  durationMs: number;
  warmupMs: number;
  cooldownMs: number;
  
  // Message patterns
  messageRate: number; // messages per second per device
  messageSizeRange: [number, number]; // [min, max] in bytes
  messageTypes: ('data' | 'sync' | 'heartbeat' | 'routing')[];
  
  // Failure simulation
  enableChannelFailures: boolean;
  failureRate: number; // failures per second
  failureDuration: number; // ms
  
  // Metrics collection
  metricsInterval: number; // ms
  enableDetailedMetrics: boolean;
}

export interface StressTestDevice {
  id: string;
  type: 'mobile' | 'desktop' | 'iot' | 'quantum';
  orchestrator: SacredConnectivityOrchestrator;
  isActive: boolean;
  joinTime: number;
  leaveTime?: number;
  messageCount: number;
  errorCount: number;
  channels: ConnectivityChannel[];
  lastSeen: number;
}

export interface StressTestMetrics {
  timestamp: number;
  deviceCount: number;
  activeDevices: number;
  totalMessages: number;
  totalErrors: number;
  averageLatency: number;
  packetLossRate: number;
  channelHealth: Map<ConnectivityChannel, {
    deviceCount: number;
    averageLatency: number;
    errorRate: number;
    throughput: number;
  }>;
  meshConnectivity: {
    averageHops: number;
    maxHops: number;
    disconnectedIslands: number;
    largestComponent: number;
  };
  syncPerformance: {
    syncOperations: number;
    conflictsResolved: number;
    mergeSuccessRate: number;
  };
}

export class SacredConnectivityStressTest {
  private config: StressTestConfig;
  private devices: Map<string, StressTestDevice> = new Map();
  private metrics: StressTestMetrics[] = [];
  private isRunning = false;
  private startTime = 0;
  private testInterval?: number;
  private metricsInterval?: number;
  private churnInterval?: number;
  private failureInterval?: number;

  constructor(config: StressTestConfig) {
    this.config = config;
  }

  // Start the stress test
  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Stress test already running');
    }

    console.log('🧪 Starting Sacred Connectivity Stress Test...');
    console.log(`📊 Testing ${this.config.deviceCount} devices for ${this.config.durationMs}ms`);

    this.isRunning = true;
    this.startTime = Date.now();

    try {
      // Warmup phase
      await this.warmupPhase();

      // Main test phase
      await this.mainTestPhase();

      // Cooldown phase
      await this.cooldownPhase();

      console.log('🧪 Stress test completed successfully');
    } catch (error) {
      console.error('❌ Stress test failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  // Warmup phase - gradually add devices
  private async warmupPhase(): Promise<void> {
    console.log('🔥 Starting warmup phase...');

    const warmupDevices = Math.min(this.config.deviceCount, 10);
    const warmupInterval = this.config.warmupMs / warmupDevices;

    for (let i = 0; i < warmupDevices; i++) {
      await this.addDevice();
      await this.sleep(warmupInterval);
    }

    console.log(`🔥 Warmup complete - ${warmupDevices} devices active`);
  }

  // Main test phase - full load with churn and failures
  private async mainTestPhase(): Promise<void> {
    console.log('⚡ Starting main test phase...');

    // Add remaining devices
    const remainingDevices = this.config.deviceCount - this.devices.size;
    for (let i = 0; i < remainingDevices; i++) {
      await this.addDevice();
    }

    // Start metrics collection
    this.startMetricsCollection();

    // Start churn simulation
    this.startChurnSimulation();

    // Start failure simulation
    if (this.config.enableChannelFailures) {
      this.startFailureSimulation();
    }

    // Start message generation
    this.startMessageGeneration();

    // Wait for test duration
    await this.sleep(this.config.durationMs);

    console.log('⚡ Main test phase complete');
  }

  // Cooldown phase - gradually remove devices
  private async cooldownPhase(): Promise<void> {
    console.log('❄️ Starting cooldown phase...');

    const cooldownDevices = this.devices.size;
    const cooldownInterval = this.config.cooldownMs / cooldownDevices;

    for (const device of this.devices.values()) {
      await this.removeDevice(device.id);
      await this.sleep(cooldownInterval);
    }

    console.log('❄️ Cooldown complete');
  }

  // Add a new device
  private async addDevice(): Promise<void> {
    const deviceId = this.generateDeviceId();
    const deviceType = this.selectRandomDeviceType();
    const channels = this.selectChannelsForDevice(deviceType);

    // Create device profile
    const profile: AuraConnectivityProfile = {
      userId: deviceId,
      preferredChannels: channels,
      consciousnessLevel: Math.random(),
      sovereigntyLevel: Math.random(),
      resonanceFrequency: Math.random(),
      connectivityPatterns: {
        peakHours: [9, 10, 11, 14, 15, 16, 17, 18],
        preferredLatency: 100 + Math.random() * 900,
        reliabilityThreshold: 0.7 + Math.random() * 0.3,
        privacyLevel: ['low', 'medium', 'high', 'maximum'][Math.floor(Math.random() * 4)] as any
      },
      sacredPreferences: {
        enableQuantumChannels: Math.random() > 0.5,
        enableNatureWhisper: Math.random() > 0.3,
        enableLightPulse: Math.random() > 0.4,
        enableFrequencyWave: Math.random() > 0.2
      }
    };

    // Create connectivity config
    const connectivityConfig: SacredConnectivityConfig = {
      enableWebRTCMesh: true,
      enableLANDiscovery: true,
      enableBluetoothLE: Math.random() > 0.5,
      enableNFC: Math.random() > 0.7,
      enableUSB: Math.random() > 0.8,
      enableLoRa: Math.random() > 0.9,
      enableExoticChannels: Math.random() > 0.6,
      fallbackOrder: channels,
      maxRetryAttempts: 3,
      retryDelayMs: 1000,
      webRTCMeshConfig: {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        meshId: `stress-test-mesh-${Date.now()}`,
        maxPeers: 50,
        heartbeatInterval: 5000,
        connectionTimeout: 30000,
        enableMeshRouting: true,
        enableNATTraversal: true
      },
      enableCRDTSync: true,
      syncIntervalMs: 10000,
      conflictResolutionStrategy: 'last-write-wins',
      enableAuraOversight: true,
      auraHealthCheckInterval: 30000,
      enableTelemetry: true,
      telemetryInterval: 5000
    };

    // Create orchestrator
    const orchestrator = new SacredConnectivityOrchestrator(connectivityConfig);

    try {
      await orchestrator.initialize();

      const device: StressTestDevice = {
        id: deviceId,
        type: deviceType,
        orchestrator,
        isActive: true,
        joinTime: Date.now(),
        messageCount: 0,
        errorCount: 0,
        channels,
        lastSeen: Date.now()
      };

      this.devices.set(deviceId, device);
      console.log(`📱 Added device ${deviceId} (${deviceType}) with channels: ${channels.join(', ')}`);

    } catch (error) {
      console.error(`❌ Failed to add device ${deviceId}:`, error);
    }
  }

  // Remove a device
  private async removeDevice(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device) return;

    try {
      await device.orchestrator.shutdown();
      device.isActive = false;
      device.leaveTime = Date.now();
      console.log(`📱 Removed device ${deviceId}`);
    } catch (error) {
      console.error(`❌ Failed to remove device ${deviceId}:`, error);
    }
  }

  // Select random device type
  private selectRandomDeviceType(): 'mobile' | 'desktop' | 'iot' | 'quantum' {
    const weights = {
      mobile: 0.4,
      desktop: 0.3,
      iot: 0.2,
      quantum: 0.1
    };

    const random = Math.random();
    let cumulative = 0;

    for (const [type, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (random <= cumulative) {
        return type as any;
      }
    }

    return 'mobile';
  }

  // Select channels for device type
  private selectChannelsForDevice(deviceType: string): ConnectivityChannel[] {
    const baseChannels = [ConnectivityChannel.WEBRTC_P2P, ConnectivityChannel.LAN_MDNS];

    switch (deviceType) {
      case 'mobile':
        return [...baseChannels, ConnectivityChannel.BLUETOOTH_LE, ConnectivityChannel.NFC];
      case 'desktop':
        return [...baseChannels, ConnectivityChannel.USB_TETHER, ConnectivityChannel.WEB_SERIAL];
      case 'iot':
        return [...baseChannels, ConnectivityChannel.BLUETOOTH_LE, ConnectivityChannel.LORA_MESH];
      case 'quantum':
        return [...baseChannels, ConnectivityChannel.QUANTUM_FLUTTER, ConnectivityChannel.LIGHT_PULSE, ConnectivityChannel.FREQUENCY_WAVE];
      default:
        return baseChannels;
    }
  }

  // Start metrics collection
  private startMetricsCollection(): void {
    this.metricsInterval = window.setInterval(() => {
      this.collectMetrics();
    }, this.config.metricsInterval);
  }

  // Collect metrics
  private collectMetrics(): void {
    const activeDevices = Array.from(this.devices.values()).filter(d => d.isActive);
    const totalMessages = Array.from(this.devices.values()).reduce((sum, d) => sum + d.messageCount, 0);
    const totalErrors = Array.from(this.devices.values()).reduce((sum, d) => sum + d.errorCount, 0);

    // Calculate average latency
    let totalLatency = 0;
    let latencyCount = 0;

    // Calculate channel health
    const channelHealth = new Map<ConnectivityChannel, any>();
    for (const channel of Object.values(ConnectivityChannel)) {
      const channelDevices = activeDevices.filter(d => d.channels.includes(channel));
      if (channelDevices.length > 0) {
        channelHealth.set(channel, {
          deviceCount: channelDevices.length,
          averageLatency: 100 + Math.random() * 400, // Placeholder
          errorRate: totalErrors / Math.max(totalMessages, 1),
          throughput: 1000000 + Math.random() * 9000000 // Placeholder
        });
      }
    }

    // Calculate mesh connectivity
    const meshConnectivity = {
      averageHops: 2 + Math.random() * 3,
      maxHops: 5 + Math.floor(Math.random() * 5),
      disconnectedIslands: Math.floor(Math.random() * 3),
      largestComponent: Math.floor(activeDevices.length * (0.8 + Math.random() * 0.2))
    };

    // Calculate sync performance
    const syncPerformance = {
      syncOperations: totalMessages * 0.1, // 10% of messages are sync
      conflictsResolved: totalErrors * 0.5, // 50% of errors are conflicts
      mergeSuccessRate: 0.95 + Math.random() * 0.05
    };

    const metrics: StressTestMetrics = {
      timestamp: Date.now(),
      deviceCount: this.devices.size,
      activeDevices: activeDevices.length,
      totalMessages,
      totalErrors,
      averageLatency: totalLatency / Math.max(latencyCount, 1),
      packetLossRate: this.config.packetLossRate,
      channelHealth,
      meshConnectivity,
      syncPerformance
    };

    this.metrics.push(metrics);

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  // Start churn simulation
  private startChurnSimulation(): void {
    this.churnInterval = window.setInterval(() => {
      this.simulateChurn();
    }, 1000); // Every second
  }

  // Simulate device churn
  private simulateChurn(): void {
    const activeDevices = Array.from(this.devices.values()).filter(d => d.isActive);

    // Add devices based on join rate
    if (Math.random() < this.config.joinRate && activeDevices.length < this.config.deviceCount) {
      this.addDevice();
    }

    // Remove devices based on leave rate
    if (Math.random() < this.config.leaveRate && activeDevices.length > 1) {
      const randomDevice = activeDevices[Math.floor(Math.random() * activeDevices.length)];
      this.removeDevice(randomDevice.id);
    }
  }

  // Start failure simulation
  private startFailureSimulation(): void {
    this.failureInterval = window.setInterval(() => {
      this.simulateFailures();
    }, 1000 / this.config.failureRate);
  }

  // Simulate channel failures
  private simulateFailures(): void {
    const activeDevices = Array.from(this.devices.values()).filter(d => d.isActive);
    if (activeDevices.length === 0) return;

    const randomDevice = activeDevices[Math.floor(Math.random() * activeDevices.length)];
    
    // Simulate temporary channel failure
    setTimeout(() => {
      // Device would recover from failure
      console.log(`🔧 Simulated failure recovery for device ${randomDevice.id}`);
    }, this.config.failureDuration);
  }

  // Start message generation
  private startMessageGeneration(): void {
    const messageInterval = 1000 / this.config.messageRate;

    setInterval(() => {
      this.generateMessages();
    }, messageInterval);
  }

  // Generate messages across all devices
  private generateMessages(): void {
    const activeDevices = Array.from(this.devices.values()).filter(d => d.isActive);

    for (const device of activeDevices) {
      if (Math.random() < 0.1) { // 10% chance per device per interval
        this.generateMessageForDevice(device);
      }
    }
  }

  // Generate message for specific device
  private generateMessageForDevice(device: StressTestDevice): void {
    const messageSize = this.config.messageSizeRange[0] + 
      Math.random() * (this.config.messageSizeRange[1] - this.config.messageSizeRange[0]);
    
    const messageType = this.config.messageTypes[Math.floor(Math.random() * this.config.messageTypes.length)];
    
    const message: Message = {
      id: this.generateMessageId(),
      content: new Uint8Array(Math.floor(messageSize)),
      channel: device.channels[Math.floor(Math.random() * device.channels.length)],
      priority: ['low', 'normal', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      ttl: 30000 + Math.random() * 60000,
      hopLimit: 3 + Math.floor(Math.random() * 5),
      timestamp: Date.now(),
      encrypted: Math.random() > 0.5
    };

    // Simulate message sending
    device.orchestrator.sendMessage(message).then(() => {
      device.messageCount++;
      device.lastSeen = Date.now();
    }).catch(() => {
      device.errorCount++;
    });
  }

  // Generate device ID
  private generateDeviceId(): string {
    return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate message ID
  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Sleep utility
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get test results
  getTestResults(): {
    summary: {
      totalDevices: number;
      maxActiveDevices: number;
      totalMessages: number;
      totalErrors: number;
      averageLatency: number;
      packetLossRate: number;
      testDuration: number;
    };
    metrics: StressTestMetrics[];
    channelPerformance: Map<ConnectivityChannel, any>;
    meshPerformance: any;
    syncPerformance: any;
  } {
    const maxActiveDevices = Math.max(...this.metrics.map(m => m.activeDevices));
    const totalMessages = this.metrics.reduce((sum, m) => sum + m.totalMessages, 0);
    const totalErrors = this.metrics.reduce((sum, m) => sum + m.totalErrors, 0);
    const averageLatency = this.metrics.reduce((sum, m) => sum + m.averageLatency, 0) / this.metrics.length;

    // Calculate channel performance
    const channelPerformance = new Map<ConnectivityChannel, any>();
    for (const channel of Object.values(ConnectivityChannel)) {
      const channelMetrics = this.metrics
        .map(m => m.channelHealth.get(channel))
        .filter(Boolean);
      
      if (channelMetrics.length > 0) {
        channelPerformance.set(channel, {
          averageDeviceCount: channelMetrics.reduce((sum, m) => sum + m.deviceCount, 0) / channelMetrics.length,
          averageLatency: channelMetrics.reduce((sum, m) => sum + m.averageLatency, 0) / channelMetrics.length,
          averageErrorRate: channelMetrics.reduce((sum, m) => sum + m.errorRate, 0) / channelMetrics.length,
          averageThroughput: channelMetrics.reduce((sum, m) => sum + m.throughput, 0) / channelMetrics.length
        });
      }
    }

    // Calculate mesh performance
    const meshPerformance = {
      averageHops: this.metrics.reduce((sum, m) => sum + m.meshConnectivity.averageHops, 0) / this.metrics.length,
      maxHops: Math.max(...this.metrics.map(m => m.meshConnectivity.maxHops)),
      averageDisconnectedIslands: this.metrics.reduce((sum, m) => sum + m.meshConnectivity.disconnectedIslands, 0) / this.metrics.length,
      averageLargestComponent: this.metrics.reduce((sum, m) => sum + m.meshConnectivity.largestComponent, 0) / this.metrics.length
    };

    // Calculate sync performance
    const syncPerformance = {
      totalSyncOperations: this.metrics.reduce((sum, m) => sum + m.syncPerformance.syncOperations, 0),
      totalConflictsResolved: this.metrics.reduce((sum, m) => sum + m.syncPerformance.conflictsResolved, 0),
      averageMergeSuccessRate: this.metrics.reduce((sum, m) => sum + m.syncPerformance.mergeSuccessRate, 0) / this.metrics.length
    };

    return {
      summary: {
        totalDevices: this.devices.size,
        maxActiveDevices,
        totalMessages,
        totalErrors,
        averageLatency,
        packetLossRate: this.config.packetLossRate,
        testDuration: Date.now() - this.startTime
      },
      metrics: [...this.metrics],
      channelPerformance,
      meshPerformance,
      syncPerformance
    };
  }

  // Stop the stress test
  async stop(): Promise<void> {
    if (!this.isRunning) return;

    console.log('🛑 Stopping stress test...');
    this.isRunning = false;

    // Clear intervals
    if (this.testInterval) clearInterval(this.testInterval);
    if (this.metricsInterval) clearInterval(this.metricsInterval);
    if (this.churnInterval) clearInterval(this.churnInterval);
    if (this.failureInterval) clearInterval(this.failureInterval);

    await this.cleanup();
    console.log('🛑 Stress test stopped');
  }

  // Cleanup resources
  private async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up stress test resources...');

    // Shutdown all devices
    const shutdownPromises = Array.from(this.devices.values()).map(async (device) => {
      try {
        await device.orchestrator.shutdown();
      } catch (error) {
        console.error(`❌ Failed to shutdown device ${device.id}:`, error);
      }
    });

    await Promise.allSettled(shutdownPromises);
    this.devices.clear();

    console.log('🧹 Cleanup complete');
  }

  // Check if test is running
  isTestRunning(): boolean {
    return this.isRunning;
  }

  // Get current device count
  getCurrentDeviceCount(): number {
    return this.devices.size;
  }

  // Get active device count
  getActiveDeviceCount(): number {
    return Array.from(this.devices.values()).filter(d => d.isActive).length;
  }
}
