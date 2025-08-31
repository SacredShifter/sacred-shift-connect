// Sacred Mesh Core - The living organism for nature communication

import { SacredMeshCrypto } from './crypto';
import { 
  SacredMeshMessage, 
  MeshConfig, 
  MeshStatus, 
  TransportType,
  TransportAdapter
} from './types';

export class SacredMesh {
  private crypto: SacredMeshCrypto;
  private config: MeshConfig;
  private adapters: Map<TransportType, TransportAdapter> = new Map();
  private isInitialized = false;
  private messageHandlers: Set<(message: SacredMeshMessage, senderId: string) => void> = new Set();

  constructor(config: Partial<MeshConfig> = {}) {
    this.config = {
      autoMode: true,
      maxHops: 5,
      defaultTtl: 3600,
      maxQueueSize: 100,
      retryInterval: 5000,
      enableLightAdapter: false,
      enableFrequencyAdapter: false,
      enableNatureAdapter: false,
      enableQuantumAdapter: false,
      meshId: crypto.randomUUID(),
      ...config
    };
    
    this.crypto = SacredMeshCrypto.getInstance();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🌟 Initializing Sacred Mesh...');
      
      // Initialize enabled adapters
      if (this.config.enableLightAdapter) {
        await this.initializeAdapter(TransportType.LIGHT);
      }
      
      if (this.config.enableFrequencyAdapter) {
        await this.initializeAdapter(TransportType.FREQUENCY);
      }
      
      if (this.config.enableNatureAdapter) {
        await this.initializeAdapter(TransportType.NATURE);
      }
      
      // Always enable file adapter as fallback
      await this.initializeAdapter(TransportType.FILE);
      
      this.isInitialized = true;
      console.log('🌟 Sacred Mesh initialized successfully');
    } catch (error) {
      console.error('🌟 Failed to initialize Sacred Mesh:', error);
      throw error;
    }
  }

  private async initializeAdapter(type: TransportType): Promise<void> {
    try {
      const adapter = await this.createAdapter(type);
      await adapter.initialize();
      this.adapters.set(type, adapter);
      console.log(`🌟 ${type} adapter initialized`);
    } catch (error) {
      console.warn(`🌟 Failed to initialize ${type} adapter:`, error);
    }
  }

  private async createAdapter(type: TransportType): Promise<TransportAdapter> {
    switch (type) {
      case TransportType.LIGHT:
        return new LightAdapter();
      case TransportType.FREQUENCY:
        return new FrequencyAdapter();
      case TransportType.NATURE:
        return new NatureAdapter();
      case TransportType.FILE:
        return new FileAdapter();
      default:
        throw new Error(`Unknown adapter type: ${type}`);
    }
  }

  async sendMessage(message: SacredMeshMessage, recipientId?: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Sacred Mesh not initialized');
    }

    const encryptedMessage = await this.crypto.encryptMessage(message, recipientId);
    
    // Try active adapters in order of preference
    const activeAdapters = Array.from(this.adapters.values()).filter(adapter => 
      adapter.isActive()
    );

    if (activeAdapters.length === 0) {
      throw new Error('No active transport adapters available');
    }

    // Send via the first available adapter
    try {
      await activeAdapters[0].send(encryptedMessage);
      console.log('🌟 Message sent via Sacred Mesh');
    } catch (error) {
      console.error('🌟 Failed to send message via Sacred Mesh:', error);
      throw error;
    }
  }

  onMessage(handler: (message: SacredMeshMessage, senderId: string) => void): void {
    this.messageHandlers.add(handler);
  }

  offMessage(handler: (message: SacredMeshMessage, senderId: string) => void): void {
    this.messageHandlers.delete(handler);
  }

  private handleIncomingMessage(message: SacredMeshMessage, senderId: string): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message, senderId);
      } catch (error) {
        console.error('🌟 Error in message handler:', error);
      }
    });
  }

  async getStatus(): Promise<MeshStatus> {
    const transports: Record<TransportType, boolean> = {
      [TransportType.WEBSOCKET]: false,
      [TransportType.MULTIPEER]: false,
      [TransportType.WIFI_AWARE]: false,
      [TransportType.BLUETOOTH_LE]: false,
      [TransportType.MESHTASTIC]: false,
      [TransportType.LIGHT]: false,
      [TransportType.FREQUENCY]: false,
      [TransportType.NATURE]: false,
      [TransportType.QUANTUM]: false,
      [TransportType.FILE]: false
    };

    this.adapters.forEach((adapter, type) => {
      transports[type] = adapter.isActive();
    });

    return {
      initialized: this.isInitialized,
      transports,
      activeConnections: Array.from(this.adapters.values()).filter(a => a.isActive()).length,
      queue: {
        size: 0,
        pending: 0
      },
      lastActivity: new Date()
    };
  }

  destroy(): void {
    this.adapters.forEach(adapter => adapter.destroy());
    this.adapters.clear();
    this.messageHandlers.clear();
    this.isInitialized = false;
  }
}

// Basic adapter implementations
class LightAdapter implements TransportAdapter {
  type: TransportType = TransportType.LIGHT;
  private active = false;

  async initialize(): Promise<void> {
    // Light-based communication would use screen/LED modulation
    this.active = true;
  }

  async send(message: SacredMeshMessage): Promise<void> {
    // Encode message as light patterns
    console.log('🌟 Sending via light patterns:', message.sigils.join(' '));
  }

  async receive(): Promise<SacredMeshMessage | null> {
    // Receive light patterns
    return null;
  }

  isActive(): boolean {
    return this.active;
  }

  destroy(): void {
    this.active = false;
  }
}

class FrequencyAdapter implements TransportAdapter {
  type: TransportType = TransportType.FREQUENCY;
  private active = false;

  async initialize(): Promise<void> {
    // Audio/subsonic frequency communication
    this.active = true;
  }

  async send(message: SacredMeshMessage): Promise<void> {
    // Encode as frequency patterns
    console.log('🌟 Sending via frequency patterns:', message.resonancePattern || 'default-pattern');
  }

  async receive(): Promise<SacredMeshMessage | null> {
    return null;
  }

  isActive(): boolean {
    return this.active;
  }

  destroy(): void {
    this.active = false;
  }
}

class NatureAdapter implements TransportAdapter {
  type: TransportType = TransportType.NATURE;
  private active = false;

  async initialize(): Promise<void> {
    // Biomimetic pattern communication
    this.active = true;
  }

  async send(message: SacredMeshMessage): Promise<void> {
    console.log('🌟 Sending via nature patterns:', message.intentionVector || 'default-vector');
  }

  async receive(): Promise<SacredMeshMessage | null> {
    return null;
  }

  isActive(): boolean {
    return this.active;
  }

  destroy(): void {
    this.active = false;
  }
}

class FileAdapter implements TransportAdapter {
  type: TransportType = TransportType.FILE;
  private active = false;

  async initialize(): Promise<void> {
    // File/QR code based communication
    this.active = true;
  }

  async send(message: SacredMeshMessage): Promise<void> {
    // Store in localStorage as fallback
    const messageKey = `sacred_mesh_${Date.now()}`;
    localStorage.setItem(messageKey, JSON.stringify(message));
    console.log('🌟 Message stored locally:', messageKey);
  }

  async receive(): Promise<SacredMeshMessage | null> {
    return null;
  }

  isActive(): boolean {
    return this.active;
  }

  destroy(): void {
    this.active = false;
  }
}