import { logger } from '@/lib/logger';

interface SyncNode {
  id: string;
  lastSync: number;
  phase: number;
  frequency: number;
  latency: number;
  quality: number; // 0-1, connection quality
}

interface SyncMessage {
  type: 'phase_sync' | 'latency_probe' | 'coherence_update';
  nodeId: string;
  timestamp: number;
  phase?: number;
  frequency?: number;
  coherence?: number;
}

export class CollectiveSync {
  private nodes = new Map<string, SyncNode>();
  private localPhase = 0;
  private localFrequency = 1; // Hz
  private masterClock = 0;
  private syncInterval?: NodeJS.Timeout;
  
  // Latency compensation
  private latencyBuffer = new Map<string, number[]>();
  private maxLatencyHistory = 10;
  
  // Phase coherence algorithm
  private phaseHistory: number[] = [];
  private maxPhaseHistory = 50;
  private targetCoherence = 0.8;
  
  constructor(private onPhaseUpdate: (phase: number, coherence: number) => void) {}

  startSync(sendMessage: (msg: SyncMessage) => void): void {
    logger.info('🌐 Starting Collective Phase Synchronization');
    
    this.syncInterval = setInterval(() => {
      this.updateLocalPhase();
      this.calculateCoherence();
      this.broadcastSync(sendMessage);
      this.compensateLatency();
    }, 50); // 20Hz sync rate
  }

  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
    logger.info('🌐 Stopped Collective Synchronization');
  }

  handleSyncMessage(msg: SyncMessage, receiveTime: number): void {
    const sendTime = msg.timestamp;
    const roundTripLatency = receiveTime - sendTime;

    switch (msg.type) {
      case 'latency_probe':
        this.updateLatency(msg.nodeId, roundTripLatency);
        break;
        
      case 'phase_sync':
        if (msg.phase !== undefined && msg.frequency !== undefined) {
          this.updateNodePhase(msg.nodeId, msg.phase, msg.frequency, roundTripLatency);
        }
        break;
        
      case 'coherence_update':
        if (msg.coherence !== undefined) {
          this.updateCoherence(msg.nodeId, msg.coherence);
        }
        break;
    }
  }

  private updateLocalPhase(): void {
    const now = performance.now() / 1000;
    this.localPhase = (this.localPhase + this.localFrequency * 0.05) % (2 * Math.PI);
    this.phaseHistory.push(this.localPhase);
    
    if (this.phaseHistory.length > this.maxPhaseHistory) {
      this.phaseHistory.shift();
    }
  }

  private updateNodePhase(nodeId: string, phase: number, frequency: number, latency: number): void {
    const now = performance.now() / 1000;
    
    // Compensate for network latency
    const estimatedLatency = this.getEstimatedLatency(nodeId);
    const compensatedPhase = (phase + frequency * estimatedLatency / 1000) % (2 * Math.PI);
    
    const node: SyncNode = this.nodes.get(nodeId) || {
      id: nodeId,
      lastSync: 0,
      phase: compensatedPhase,
      frequency,
      latency: estimatedLatency,
      quality: 1
    };
    
    node.phase = compensatedPhase;
    node.frequency = frequency;
    node.lastSync = now;
    node.latency = estimatedLatency;
    
    // Update connection quality based on sync regularity
    const timeSinceLastSync = now - node.lastSync;
    node.quality = Math.max(0, 1 - timeSinceLastSync / 5); // Degrade over 5 seconds
    
    this.nodes.set(nodeId, node);
    
    // Apply phase correction using Kuramoto model
    this.applyPhaseCorrection();
  }

  private updateLatency(nodeId: string, latency: number): void {
    if (!this.latencyBuffer.has(nodeId)) {
      this.latencyBuffer.set(nodeId, []);
    }
    
    const buffer = this.latencyBuffer.get(nodeId)!;
    buffer.push(latency);
    
    if (buffer.length > this.maxLatencyHistory) {
      buffer.shift();
    }
  }

  private getEstimatedLatency(nodeId: string): number {
    const buffer = this.latencyBuffer.get(nodeId);
    if (!buffer || buffer.length === 0) return 100; // Default 100ms
    
    // Use median to avoid outliers
    const sorted = [...buffer].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private applyPhaseCorrection(): void {
    if (this.nodes.size === 0) return;
    
    // Kuramoto synchronization model
    let phaseSum = 0;
    let weightSum = 0;
    
    for (const [nodeId, node] of this.nodes) {
      const age = performance.now() / 1000 - node.lastSync;
      if (age > 2) continue; // Ignore stale nodes
      
      const weight = node.quality;
      phaseSum += Math.sin(node.phase - this.localPhase) * weight;
      weightSum += weight;
    }
    
    if (weightSum > 0) {
      const phaseDrift = phaseSum / weightSum;
      const coupling = 0.1; // Coupling strength
      const correction = coupling * phaseDrift;
      
      this.localPhase = (this.localPhase + correction) % (2 * Math.PI);
      
      logger.debug('🔄 Phase correction applied', {
        component: 'CollectiveSync',
        metadata: { 
          correction: correction.toFixed(4),
          nodes: this.nodes.size,
          coherence: this.calculateCurrentCoherence()
        }
      });
    }
  }

  private calculateCoherence(): void {
    const coherence = this.calculateCurrentCoherence();
    this.onPhaseUpdate(this.localPhase, coherence);
  }

  private calculateCurrentCoherence(): number {
    if (this.nodes.size === 0) return 1;
    
    // Calculate phase coherence using circular variance
    let sumCos = Math.cos(this.localPhase);
    let sumSin = Math.sin(this.localPhase);
    let count = 1;
    
    for (const [nodeId, node] of this.nodes) {
      const age = performance.now() / 1000 - node.lastSync;
      if (age > 2) continue;
      
      sumCos += Math.cos(node.phase) * node.quality;
      sumSin += Math.sin(node.phase) * node.quality;
      count += node.quality;
    }
    
    const meanCos = sumCos / count;
    const meanSin = sumSin / count;
    const R = Math.sqrt(meanCos * meanCos + meanSin * meanSin);
    
    return R; // Ranges from 0 (no coherence) to 1 (perfect coherence)
  }

  private updateCoherence(nodeId: string, coherence: number): void {
    const node = this.nodes.get(nodeId);
    if (node) {
      // Use coherence info to adjust sync parameters
      node.quality = Math.max(node.quality, coherence * 0.5);
    }
  }

  private compensateLatency(): void {
    // Predictive phase adjustment based on network conditions
    const avgLatency = this.getAverageLatency();
    const prediction = this.localFrequency * avgLatency / 1000;
    
    // Apply minimal compensation to avoid overcorrection
    this.localPhase = (this.localPhase + prediction * 0.1) % (2 * Math.PI);
  }

  private getAverageLatency(): number {
    let total = 0;
    let count = 0;
    
    for (const buffer of this.latencyBuffer.values()) {
      if (buffer.length > 0) {
        total += buffer[buffer.length - 1]; // Most recent latency
        count++;
      }
    }
    
    return count > 0 ? total / count : 100;
  }

  private broadcastSync(sendMessage: (msg: SyncMessage) => void): void {
    const now = performance.now();
    
    sendMessage({
      type: 'phase_sync',
      nodeId: 'local',
      timestamp: now,
      phase: this.localPhase,
      frequency: this.localFrequency
    });
    
    // Periodic latency probes
    if (Math.random() < 0.1) { // 10% chance each sync
      sendMessage({
        type: 'latency_probe',
        nodeId: 'local',
        timestamp: now
      });
    }
  }

  getPhase(): number {
    return this.localPhase;
  }

  setFrequency(frequency: number): void {
    this.localFrequency = Math.max(0.1, Math.min(10, frequency));
  }

  getNetworkStats() {
    return {
      connectedNodes: this.nodes.size,
      averageLatency: this.getAverageLatency(),
      coherence: this.calculateCurrentCoherence(),
      qualityNodes: Array.from(this.nodes.values()).filter(n => n.quality > 0.5).length
    };
  }
}