// Sacred Shifter Connectivity Stress Testing Harness
// Tests mesh networking under various stress conditions

export interface StressTestConfig {
  maxUsers: number;
  messageRate: number; // messages per second
  testDuration: number; // milliseconds
  packetLossRate: number; // 0-1
  jitterMs: number; // milliseconds
  deviceChurnRate: number; // devices joining/leaving per second
  networkPartitionRate: number; // network splits per minute
  offlinePeriods: number[]; // offline durations in ms
}

export interface StressTestResult {
  testName: string;
  duration: number;
  totalMessages: number;
  successfulMessages: number;
  failedMessages: number;
  averageLatency: number;
  maxLatency: number;
  minLatency: number;
  packetLoss: number;
  deviceChurn: number;
  networkPartitions: number;
  errors: string[];
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    networkUsage: number;
  };
}

export interface MockDevice {
  id: string;
  name: string;
  channels: string[];
  isOnline: boolean;
  latency: number;
  packetLoss: number;
  lastSeen: number;
  messageCount: number;
  errorCount: number;
}

export class ConnectivityStressTest {
  private devices: Map<string, MockDevice> = new Map();
  private messageQueue: Array<{
    id: string;
    from: string;
    to: string;
    content: string;
    timestamp: number;
    attempts: number;
  }> = [];
  private results: StressTestResult[] = [];
  private isRunning = false;
  private testInterval?: number;
  private config: StressTestConfig;

  constructor(config: StressTestConfig) {
    this.config = config;
  }

  // Start stress test
  async startTest(testName: string): Promise<StressTestResult> {
    if (this.isRunning) {
      throw new Error('Test already running');
    }

    console.log(`🧪 Starting stress test: ${testName}`);
    this.isRunning = true;
    this.devices.clear();
    this.messageQueue = [];

    const startTime = Date.now();
    const endTime = startTime + this.config.testDuration;

    // Initialize mock devices
    await this.initializeDevices();

    // Start test loop
    this.testInterval = window.setInterval(() => {
      this.runTestCycle();
    }, 100); // 10Hz test cycle

    // Wait for test completion
    await new Promise(resolve => {
      setTimeout(() => {
        this.stopTest();
        resolve(undefined);
      }, this.config.testDuration);
    });

    // Generate results
    const result = this.generateResults(testName, startTime);
    this.results.push(result);

    console.log(`✅ Stress test completed: ${testName}`);
    return result;
  }

  // Stop stress test
  stopTest(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.testInterval) {
      clearInterval(this.testInterval);
      this.testInterval = undefined;
    }

    console.log('🛑 Stress test stopped');
  }

  // Initialize mock devices
  private async initializeDevices(): Promise<void> {
    for (let i = 0; i < this.config.maxUsers; i++) {
      const device: MockDevice = {
        id: `device-${i}`,
        name: `Sacred Shifter Device ${i}`,
        channels: ['websocket', 'webrtc', 'bluetooth'],
        isOnline: true,
        latency: Math.random() * 100 + 50, // 50-150ms
        packetLoss: this.config.packetLossRate,
        lastSeen: Date.now(),
        messageCount: 0,
        errorCount: 0
      };

      this.devices.set(device.id, device);
    }

    console.log(`👥 Initialized ${this.config.maxUsers} mock devices`);
  }

  // Run test cycle
  private runTestCycle(): void {
    if (!this.isRunning) return;

    // Simulate device churn
    this.simulateDeviceChurn();

    // Simulate network partitions
    this.simulateNetworkPartitions();

    // Generate messages
    this.generateMessages();

    // Process message queue
    this.processMessageQueue();

    // Update device states
    this.updateDeviceStates();
  }

  // Simulate device churn (devices joining/leaving)
  private simulateDeviceChurn(): void {
    if (Math.random() < this.config.deviceChurnRate / 10) { // Convert to per-cycle probability
      if (Math.random() < 0.5) {
        // Device joining
        this.addRandomDevice();
      } else {
        // Device leaving
        this.removeRandomDevice();
      }
    }
  }

  // Add random device
  private addRandomDevice(): void {
    const deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const device: MockDevice = {
      id: deviceId,
      name: `Sacred Shifter Device ${deviceId}`,
      channels: ['websocket', 'webrtc'],
      isOnline: true,
      latency: Math.random() * 100 + 50,
      packetLoss: this.config.packetLossRate,
      lastSeen: Date.now(),
      messageCount: 0,
      errorCount: 0
    };

    this.devices.set(deviceId, device);
    console.log(`➕ Device joined: ${device.name}`);
  }

  // Remove random device
  private removeRandomDevice(): void {
    const devices = Array.from(this.devices.values());
    if (devices.length > 1) { // Keep at least one device
      const device = devices[Math.floor(Math.random() * devices.length)];
      this.devices.delete(device.id);
      console.log(`➖ Device left: ${device.name}`);
    }
  }

  // Simulate network partitions
  private simulateNetworkPartitions(): void {
    if (Math.random() < this.config.networkPartitionRate / 600) { // Convert to per-cycle probability
      this.createNetworkPartition();
    }
  }

  // Create network partition
  private createNetworkPartition(): void {
    const devices = Array.from(this.devices.values());
    if (devices.length < 2) return;

    // Randomly partition devices into two groups
    const shuffled = devices.sort(() => Math.random() - 0.5);
    const partitionSize = Math.floor(shuffled.length / 2);
    
    // First group goes offline
    for (let i = 0; i < partitionSize; i++) {
      shuffled[i].isOnline = false;
    }

    // Second group stays online
    for (let i = partitionSize; i < shuffled.length; i++) {
      shuffled[i].isOnline = true;
    }

    console.log(`🔀 Network partition created: ${partitionSize} devices offline`);
  }

  // Generate messages
  private generateMessages(): void {
    const messagesPerCycle = this.config.messageRate / 10; // Convert to per-cycle rate
    
    for (let i = 0; i < messagesPerCycle; i++) {
      const fromDevice = this.getRandomOnlineDevice();
      const toDevice = this.getRandomOnlineDevice();
      
      if (fromDevice && toDevice && fromDevice.id !== toDevice.id) {
        const message = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          from: fromDevice.id,
          to: toDevice.id,
          content: `Test message ${Date.now()}`,
          timestamp: Date.now(),
          attempts: 0
        };

        this.messageQueue.push(message);
      }
    }
  }

  // Process message queue
  private processMessageQueue(): void {
    const now = Date.now();
    const maxAge = 5000; // 5 seconds

    // Process messages
    for (let i = this.messageQueue.length - 1; i >= 0; i--) {
      const message = this.messageQueue[i];
      
      // Remove old messages
      if (now - message.timestamp > maxAge) {
        this.messageQueue.splice(i, 1);
        continue;
      }

      // Try to deliver message
      if (this.attemptMessageDelivery(message)) {
        this.messageQueue.splice(i, 1);
      } else {
        message.attempts++;
        if (message.attempts > 3) {
          this.messageQueue.splice(i, 1);
        }
      }
    }
  }

  // Attempt message delivery
  private attemptMessageDelivery(message: any): boolean {
    const fromDevice = this.devices.get(message.from);
    const toDevice = this.devices.get(message.to);

    if (!fromDevice || !toDevice || !fromDevice.isOnline || !toDevice.isOnline) {
      return false;
    }

    // Simulate packet loss
    if (Math.random() < fromDevice.packetLoss) {
      fromDevice.errorCount++;
      return false;
    }

    // Simulate latency
    const latency = fromDevice.latency + toDevice.latency + (Math.random() * this.config.jitterMs);
    
    // Simulate delivery delay
    setTimeout(() => {
      toDevice.messageCount++;
      toDevice.lastSeen = Date.now();
    }, latency);

    return true;
  }

  // Update device states
  private updateDeviceStates(): void {
    const now = Date.now();
    const maxAge = 10000; // 10 seconds

    for (const device of this.devices.values()) {
      // Simulate devices going offline
      if (device.isOnline && now - device.lastSeen > maxAge) {
        device.isOnline = false;
        console.log(`📴 Device went offline: ${device.name}`);
      }

      // Simulate devices coming back online
      if (!device.isOnline && Math.random() < 0.1) { // 10% chance per cycle
        device.isOnline = true;
        device.lastSeen = now;
        console.log(`📶 Device came online: ${device.name}`);
      }
    }
  }

  // Get random online device
  private getRandomOnlineDevice(): MockDevice | null {
    const onlineDevices = Array.from(this.devices.values()).filter(d => d.isOnline);
    if (onlineDevices.length === 0) return null;
    return onlineDevices[Math.floor(Math.random() * onlineDevices.length)];
  }

  // Generate test results
  private generateResults(testName: string, startTime: number): StressTestResult {
    const duration = Date.now() - startTime;
    const devices = Array.from(this.devices.values());
    
    let totalMessages = 0;
    let successfulMessages = 0;
    let failedMessages = 0;
    let totalLatency = 0;
    let maxLatency = 0;
    let minLatency = Infinity;
    let totalErrors = 0;

    for (const device of devices) {
      totalMessages += device.messageCount;
      successfulMessages += device.messageCount;
      failedMessages += device.errorCount;
      totalErrors += device.errorCount;
    }

    const averageLatency = totalMessages > 0 ? totalLatency / totalMessages : 0;
    const packetLoss = totalMessages > 0 ? (failedMessages / (totalMessages + failedMessages)) * 100 : 0;

    // Calculate performance metrics
    const performance = this.calculatePerformance();

    return {
      testName,
      duration,
      totalMessages,
      successfulMessages,
      failedMessages,
      averageLatency,
      maxLatency: maxLatency === Infinity ? 0 : maxLatency,
      minLatency: minLatency === Infinity ? 0 : minLatency,
      packetLoss,
      deviceChurn: this.config.deviceChurnRate,
      networkPartitions: this.config.networkPartitionRate,
      errors: [],
      performance
    };
  }

  // Calculate performance metrics
  private calculatePerformance(): { cpuUsage: number; memoryUsage: number; networkUsage: number } {
    // Mock performance metrics (in real implementation, use performance API)
    return {
      cpuUsage: Math.random() * 100,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      networkUsage: Math.random() * 1000
    };
  }

  // Get all test results
  getResults(): StressTestResult[] {
    return [...this.results];
  }

  // Get latest result
  getLatestResult(): StressTestResult | null {
    return this.results.length > 0 ? this.results[this.results.length - 1] : null;
  }

  // Clear all results
  clearResults(): void {
    this.results = [];
  }

  // Get current test status
  getTestStatus(): {
    isRunning: boolean;
    deviceCount: number;
    messageQueueSize: number;
    onlineDevices: number;
  } {
    const devices = Array.from(this.devices.values());
    return {
      isRunning: this.isRunning,
      deviceCount: devices.length,
      messageQueueSize: this.messageQueue.length,
      onlineDevices: devices.filter(d => d.isOnline).length
    };
  }
}

// Predefined test configurations
export const STRESS_TEST_CONFIGS = {
  LIGHT_LOAD: {
    maxUsers: 10,
    messageRate: 1,
    testDuration: 30000,
    packetLossRate: 0.01,
    jitterMs: 10,
    deviceChurnRate: 0.1,
    networkPartitionRate: 0,
    offlinePeriods: []
  },
  
  MEDIUM_LOAD: {
    maxUsers: 50,
    messageRate: 5,
    testDuration: 60000,
    packetLossRate: 0.05,
    jitterMs: 25,
    deviceChurnRate: 0.5,
    networkPartitionRate: 1,
    offlinePeriods: [5000, 10000]
  },
  
  HEAVY_LOAD: {
    maxUsers: 100,
    messageRate: 10,
    testDuration: 120000,
    packetLossRate: 0.1,
    jitterMs: 50,
    deviceChurnRate: 1.0,
    networkPartitionRate: 2,
    offlinePeriods: [10000, 20000, 30000]
  },
  
  EXTREME_LOAD: {
    maxUsers: 500,
    messageRate: 50,
    testDuration: 300000,
    packetLossRate: 0.2,
    jitterMs: 100,
    deviceChurnRate: 2.0,
    networkPartitionRate: 5,
    offlinePeriods: [15000, 30000, 45000, 60000]
  }
};

// Test runner
export class StressTestRunner {
  private stressTest: ConnectivityStressTest;
  private results: StressTestResult[] = [];

  constructor() {
    this.stressTest = new ConnectivityStressTest(STRESS_TEST_CONFIGS.LIGHT_LOAD);
  }

  // Run all predefined tests
  async runAllTests(): Promise<StressTestResult[]> {
    console.log('🧪 Running all stress tests...');
    
    for (const [name, config] of Object.entries(STRESS_TEST_CONFIGS)) {
      console.log(`🧪 Running ${name} test...`);
      
      this.stressTest = new ConnectivityStressTest(config);
      const result = await this.stressTest.startTest(name);
      this.results.push(result);
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log('✅ All stress tests completed');
    return this.results;
  }

  // Run specific test
  async runTest(testName: string, config: StressTestConfig): Promise<StressTestResult> {
    console.log(`🧪 Running ${testName} test...`);
    
    this.stressTest = new ConnectivityStressTest(config);
    const result = await this.stressTest.startTest(testName);
    this.results.push(result);
    
    return result;
  }

  // Get all results
  getResults(): StressTestResult[] {
    return [...this.results];
  }

  // Generate test report
  generateReport(): string {
    let report = '# Sacred Shifter Connectivity Stress Test Report\n\n';
    
    for (const result of this.results) {
      report += `## ${result.testName}\n\n`;
      report += `- **Duration**: ${result.duration}ms\n`;
      report += `- **Total Messages**: ${result.totalMessages}\n`;
      report += `- **Success Rate**: ${((result.successfulMessages / result.totalMessages) * 100).toFixed(2)}%\n`;
      report += `- **Average Latency**: ${result.averageLatency.toFixed(2)}ms\n`;
      report += `- **Packet Loss**: ${result.packetLoss.toFixed(2)}%\n`;
      report += `- **Device Churn**: ${result.deviceChurn}/s\n`;
      report += `- **Network Partitions**: ${result.networkPartitions}/min\n\n`;
    }
    
    return report;
  }
}
