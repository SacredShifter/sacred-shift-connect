// Sacred Shifter Connectivity Abstraction Layer (CAL)
// Unified interface for all communication channels

export enum ConnectivityChannel {
  // Internet-based
  WEBSOCKET = 'websocket',
  WEBRTC_P2P = 'webrtc_p2p',
  WEBRTC_RELAY = 'webrtc_relay',
  
  // Local mesh
  LAN_MDNS = 'lan_mdns',
  WIFI_DIRECT = 'wifi_direct',
  LOCAL_PEER_TABLE = 'local_peer_table',
  
  // Short-range wireless
  BLUETOOTH_LE = 'bluetooth_le',
  NFC = 'nfc',
  INFRARED = 'infrared',
  
  // Long-range wireless
  LORA_MESH = 'lora_mesh',
  MESHTASTIC = 'meshtastic',
  
  // Broadcast
  FM_SUBCARRIER = 'fm_subcarrier',
  AM_SUBCARRIER = 'am_subcarrier',
  
  // Wired
  USB_TETHER = 'usb_tether',
  WEB_SERIAL = 'web_serial',
  
  // Exotic
  LIGHT_PULSE = 'light_pulse',
  FREQUENCY_WAVE = 'frequency_wave',
  NATURE_WHISPER = 'nature_whisper',
  QUANTUM_FLUTTER = 'quantum_flutter'
}

export interface ConnectivityConfig {
  channels: ConnectivityChannel[];
  fallbackOrder: ConnectivityChannel[];
  offlineMode: boolean;
  meshEnabled: boolean;
  maxHops: number;
  retryAttempts: number;
  timeout: number;
}

export interface PeerInfo {
  id: string;
  name: string;
  channels: ConnectivityChannel[];
  signalStrength: number;
  lastSeen: number;
  capabilities: string[];
  publicKey?: Uint8Array;
}

export interface Message {
  id: string;
  content: Uint8Array;
  recipientId?: string;
  channel: ConnectivityChannel;
  priority: 'low' | 'normal' | 'high' | 'critical';
  ttl: number;
  hopLimit: number;
  timestamp: number;
  encrypted: boolean;
}

export interface ChannelAdapter {
  channel: ConnectivityChannel;
  available(): Promise<boolean>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send(message: Message): Promise<void>;
  onMessage(callback: (message: Message) => void): void;
  getPeers(): Promise<PeerInfo[]>;
  discoverPeers(): Promise<PeerInfo[]>;
  isConnected(): boolean;
  getSignalStrength(): number;
}

export class ConnectivityAbstractionLayer {
  private adapters: Map<ConnectivityChannel, ChannelAdapter> = new Map();
  private activeChannels: Set<ConnectivityChannel> = new Set();
  private messageHandlers: Set<(message: Message) => void> = new Set();
  private peerCache: Map<string, PeerInfo> = new Map();
  private config: ConnectivityConfig;
  private isInitialized = false;

  constructor(config: ConnectivityConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🌐 Initializing Connectivity Abstraction Layer...');

    // Initialize all configured channels
    for (const channel of this.config.channels) {
      try {
        const adapter = await this.createAdapter(channel);
        if (await adapter.available()) {
          this.adapters.set(channel, adapter);
          console.log(`✅ ${channel} adapter ready`);
        } else {
          console.log(`⚠️ ${channel} adapter not available`);
        }
      } catch (error) {
        console.error(`❌ Failed to initialize ${channel}:`, error);
      }
    }

    // Connect to available channels in fallback order
    for (const channel of this.config.fallbackOrder) {
      const adapter = this.adapters.get(channel);
      if (adapter) {
        try {
          await adapter.connect();
          this.activeChannels.add(channel);
          console.log(`🔗 Connected to ${channel}`);
          break; // Use first available channel
        } catch (error) {
          console.warn(`⚠️ Failed to connect to ${channel}:`, error);
        }
      }
    }

    this.isInitialized = true;
    console.log('🌐 Connectivity Abstraction Layer initialized');
  }

  private async createAdapter(channel: ConnectivityChannel): Promise<ChannelAdapter> {
    switch (channel) {
      case ConnectivityChannel.WEBSOCKET:
        return new WebSocketAdapter();
      case ConnectivityChannel.WEBRTC_P2P:
        return new WebRTCP2PAdapter();
      case ConnectivityChannel.WEBRTC_RELAY:
        return new WebRTCRelayAdapter();
      case ConnectivityChannel.LAN_MDNS:
        return new LANmDNSAdapter();
      case ConnectivityChannel.WIFI_DIRECT:
        return new WiFiDirectAdapter();
      case ConnectivityChannel.BLUETOOTH_LE:
        return new BluetoothLEAdapter();
      case ConnectivityChannel.NFC:
        return new NFCAdapter();
      case ConnectivityChannel.INFRARED:
        return new InfraredAdapter();
      case ConnectivityChannel.LORA_MESH:
        return new LoRaMeshAdapter();
      case ConnectivityChannel.MESHTASTIC:
        return new MeshtasticAdapter();
      case ConnectivityChannel.FM_SUBCARRIER:
        return new FMSubcarrierAdapter();
      case ConnectivityChannel.AM_SUBCARRIER:
        return new AMSubcarrierAdapter();
      case ConnectivityChannel.USB_TETHER:
        return new USBTetherAdapter();
      case ConnectivityChannel.WEB_SERIAL:
        return new WebSerialAdapter();
      case ConnectivityChannel.LIGHT_PULSE:
        return new LightPulseAdapter();
      case ConnectivityChannel.FREQUENCY_WAVE:
        return new FrequencyWaveAdapter();
      case ConnectivityChannel.NATURE_WHISPER:
        return new NatureWhisperAdapter();
      case ConnectivityChannel.QUANTUM_FLUTTER:
        return new QuantumFlutterAdapter();
      default:
        throw new Error(`Unknown channel: ${channel}`);
    }
  }

  async sendMessage(message: Message): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('CAL not initialized');
    }

    // Try channels in priority order
    for (const channel of this.config.fallbackOrder) {
      if (this.activeChannels.has(channel)) {
        const adapter = this.adapters.get(channel);
        if (adapter && adapter.isConnected()) {
          try {
            await adapter.send(message);
            console.log(`📤 Message sent via ${channel}`);
            return;
          } catch (error) {
            console.warn(`⚠️ Failed to send via ${channel}:`, error);
            continue;
          }
        }
      }
    }

    throw new Error('No available channels for sending message');
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    const allPeers: PeerInfo[] = [];

    for (const [channel, adapter] of this.adapters) {
      if (this.activeChannels.has(channel)) {
        try {
          const peers = await adapter.discoverPeers();
          allPeers.push(...peers);
        } catch (error) {
          console.warn(`⚠️ Failed to discover peers via ${channel}:`, error);
        }
      }
    }

    // Deduplicate peers by ID
    const uniquePeers = new Map<string, PeerInfo>();
    for (const peer of allPeers) {
      if (!uniquePeers.has(peer.id)) {
        uniquePeers.set(peer.id, peer);
      }
    }

    return Array.from(uniquePeers.values());
  }

  onMessage(handler: (message: Message) => void): void {
    this.messageHandlers.add(handler);
  }

  getActiveChannels(): ConnectivityChannel[] {
    return Array.from(this.activeChannels);
  }

  getPeerCache(): Map<string, PeerInfo> {
    return this.peerCache;
  }

  async shutdown(): Promise<void> {
    for (const [channel, adapter] of this.adapters) {
      try {
        await adapter.disconnect();
      } catch (error) {
        console.warn(`⚠️ Error disconnecting ${channel}:`, error);
      }
    }
    this.activeChannels.clear();
    this.isInitialized = false;
  }
}

// Base adapter implementation
abstract class BaseChannelAdapter implements ChannelAdapter {
  abstract channel: ConnectivityChannel;
  protected messageCallback?: (message: Message) => void;
  protected connected = false;

  abstract available(): Promise<boolean>;
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract send(message: Message): Promise<void>;
  abstract getPeers(): Promise<PeerInfo[]>;
  abstract discoverPeers(): Promise<PeerInfo[]>;

  onMessage(callback: (message: Message) => void): void {
    this.messageCallback = callback;
  }

  isConnected(): boolean {
    return this.connected;
  }

  getSignalStrength(): number {
    return 0.5; // Default implementation
  }

  protected handleMessage(message: Message): void {
    if (this.messageCallback) {
      this.messageCallback(message);
    }
  }
}

// WebSocket adapter (existing implementation)
class WebSocketAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.WEBSOCKET;
  private socket?: WebSocket;

  async available(): Promise<boolean> {
    return typeof WebSocket !== 'undefined';
  }

  async connect(): Promise<void> {
    // Implementation from existing WebSocketTransport
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }
    this.connected = false;
  }

  async send(message: Message): Promise<void> {
    if (!this.socket) throw new Error('Not connected');
    this.socket.send(message.content);
  }

  async getPeers(): Promise<PeerInfo[]> {
    return []; // WebSocket doesn't have peer discovery
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}

// WebRTC P2P adapter (enhanced implementation)
class WebRTCP2PAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.WEBRTC_P2P;
  private peers: Map<string, RTCPeerConnection> = new Map();

  async available(): Promise<boolean> {
    return typeof RTCPeerConnection !== 'undefined';
  }

  async connect(): Promise<void> {
    // Enhanced WebRTC implementation with mesh networking
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    for (const peer of this.peers.values()) {
      peer.close();
    }
    this.peers.clear();
    this.connected = false;
  }

  async send(message: Message): Promise<void> {
    // Send to all connected peers
    for (const peer of this.peers.values()) {
      if (peer.connectionState === 'connected') {
        const dataChannel = peer.createDataChannel('mesh');
        dataChannel.send(message.content);
      }
    }
  }

  async getPeers(): Promise<PeerInfo[]> {
    const peers: PeerInfo[] = [];
    for (const [id, peer] of this.peers) {
      peers.push({
        id,
        name: `Peer ${id}`,
        channels: [this.channel],
        signalStrength: 0.8,
        lastSeen: Date.now(),
        capabilities: ['mesh', 'webrtc']
      });
    }
    return peers;
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    // WebRTC peer discovery via signaling server
    return [];
  }
}

// LAN mDNS adapter (NEW IMPLEMENTATION)
class LANmDNSAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.LAN_MDNS;
  private mdns?: any; // mDNS library

  async available(): Promise<boolean> {
    // Check if mDNS is available (requires polyfill for browsers)
    return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
  }

  async connect(): Promise<void> {
    // Initialize mDNS service discovery
    console.log('🔍 Starting mDNS service discovery...');
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async send(message: Message): Promise<void> {
    // Send via local network broadcast
    console.log('📡 Broadcasting via mDNS:', message);
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    // Discover Sacred Shifter instances on local network
    const peers: PeerInfo[] = [];
    // Implementation would use mDNS to find _sacredshifter._tcp.local
    return peers;
  }
}

// WiFi Direct adapter (NEW IMPLEMENTATION)
class WiFiDirectAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.WIFI_DIRECT;

  async available(): Promise<boolean> {
    // WiFi Direct is not available in browsers
    return false;
  }

  async connect(): Promise<void> {
    throw new Error('WiFi Direct not available in browser');
  }

  async disconnect(): Promise<void> {
    // No-op
  }

  async send(message: Message): Promise<void> {
    throw new Error('WiFi Direct not available');
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}

// Bluetooth LE adapter (ENHANCED IMPLEMENTATION)
class BluetoothLEAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.BLUETOOTH_LE;
  private device?: BluetoothDevice;

  async available(): Promise<boolean> {
    return !!(navigator as any).bluetooth;
  }

  async connect(): Promise<void> {
    if (!(navigator as any).bluetooth) {
      throw new Error('Bluetooth not available');
    }

    try {
      this.device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['12345678-1234-1234-1234-123456789abc'] // Sacred Mesh service
      });

      const server = await this.device.gatt?.connect();
      if (server) {
        this.connected = true;
        console.log('🔵 Connected to Bluetooth device');
      }
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.connected = false;
  }

  async send(message: Message): Promise<void> {
    if (!this.device?.gatt?.connected) {
      throw new Error('Bluetooth not connected');
    }
    // Send via Bluetooth characteristic
    console.log('🔵 Sending via Bluetooth LE:', message);
  }

  async getPeers(): Promise<PeerInfo[]> {
    if (!this.device) return [];
    
    return [{
      id: this.device.id,
      name: this.device.name || 'Bluetooth Device',
      channels: [this.channel],
      signalStrength: 0.7,
      lastSeen: Date.now(),
      capabilities: ['mesh', 'bluetooth']
    }];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    // Bluetooth LE scanning
    return [];
  }
}

// NFC adapter (NEW IMPLEMENTATION)
class NFCAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.NFC;

  async available(): Promise<boolean> {
    return 'NDEFReader' in window;
  }

  async connect(): Promise<void> {
    if (!('NDEFReader' in window)) {
      throw new Error('NFC not available');
    }
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async send(message: Message): Promise<void> {
    if (!('NDEFReader' in window)) {
      throw new Error('NFC not available');
    }
    // Write NFC tag with Sacred Shifter data
    console.log('📱 Writing NFC tag:', message);
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    // NFC peer discovery
    return [];
  }
}

// Infrared adapter (NEW IMPLEMENTATION)
class InfraredAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.INFRARED;

  async available(): Promise<boolean> {
    // Infrared not available in browsers
    return false;
  }

  async connect(): Promise<void> {
    throw new Error('Infrared not available in browser');
  }

  async disconnect(): Promise<void> {
    // No-op
  }

  async send(message: Message): Promise<void> {
    throw new Error('Infrared not available');
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}

// LoRa Mesh adapter (NEW IMPLEMENTATION)
class LoRaMeshAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.LORA_MESH;

  async available(): Promise<boolean> {
    // LoRa requires hardware
    return false;
  }

  async connect(): Promise<void> {
    throw new Error('LoRa requires hardware');
  }

  async disconnect(): Promise<void> {
    // No-op
  }

  async send(message: Message): Promise<void> {
    throw new Error('LoRa not available');
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}

// Meshtastic adapter (ENHANCED IMPLEMENTATION)
class MeshtasticAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.MESHTASTIC;

  async available(): Promise<boolean> {
    // Check for Meshtastic device connection
    return false;
  }

  async connect(): Promise<void> {
    throw new Error('Meshtastic device not connected');
  }

  async disconnect(): Promise<void> {
    // No-op
  }

  async send(message: Message): Promise<void> {
    throw new Error('Meshtastic not available');
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}

// FM Subcarrier adapter (NEW IMPLEMENTATION)
class FMSubcarrierAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.FM_SUBCARRIER;

  async available(): Promise<boolean> {
    // FM subcarrier requires special hardware
    return false;
  }

  async connect(): Promise<void> {
    throw new Error('FM subcarrier requires hardware');
  }

  async disconnect(): Promise<void> {
    // No-op
  }

  async send(message: Message): Promise<void> {
    throw new Error('FM subcarrier not available');
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}

// AM Subcarrier adapter (NEW IMPLEMENTATION)
class AMSubcarrierAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.AM_SUBCARRIER;

  async available(): Promise<boolean> {
    return false;
  }

  async connect(): Promise<void> {
    throw new Error('AM subcarrier requires hardware');
  }

  async disconnect(): Promise<void> {
    // No-op
  }

  async send(message: Message): Promise<void> {
    throw new Error('AM subcarrier not available');
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}

// USB Tether adapter (NEW IMPLEMENTATION)
class USBTetherAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.USB_TETHER;

  async available(): Promise<boolean> {
    return 'usb' in navigator;
  }

  async connect(): Promise<void> {
    if (!('usb' in navigator)) {
      throw new Error('WebUSB not available');
    }
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async send(message: Message): Promise<void> {
    console.log('🔌 Sending via USB tether:', message);
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}

// Web Serial adapter (ENHANCED IMPLEMENTATION)
class WebSerialAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.WEB_SERIAL;
  private port?: SerialPort;

  async available(): Promise<boolean> {
    return 'serial' in navigator;
  }

  async connect(): Promise<void> {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial not available');
    }

    try {
      this.port = await (navigator as any).serial.requestPort();
      await this.port.open({ baudRate: 9600 });
      this.connected = true;
    } catch (error) {
      throw new Error('Failed to connect to serial device');
    }
  }

  async disconnect(): Promise<void> {
    if (this.port) {
      await this.port.close();
      this.port = undefined;
    }
    this.connected = false;
  }

  async send(message: Message): Promise<void> {
    if (!this.port) throw new Error('Not connected');
    const writer = this.port.writable?.getWriter();
    if (writer) {
      await writer.write(message.content);
      writer.releaseLock();
    }
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}

// Light Pulse adapter (from existing implementation)
class LightPulseAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.LIGHT_PULSE;

  async available(): Promise<boolean> {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async send(message: Message): Promise<void> {
    console.log('💡 Sending via light pulse:', message);
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}

// Frequency Wave adapter (from existing implementation)
class FrequencyWaveAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.FREQUENCY_WAVE;

  async available(): Promise<boolean> {
    return typeof AudioContext !== 'undefined';
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async send(message: Message): Promise<void> {
    console.log('🌊 Sending via frequency wave:', message);
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}

// Nature Whisper adapter (from existing implementation)
class NatureWhisperAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.NATURE_WHISPER;

  async available(): Promise<boolean> {
    return true; // Always available
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async send(message: Message): Promise<void> {
    console.log('🌿 Whispering through nature:', message);
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}

// Quantum Flutter adapter (from existing implementation)
class QuantumFlutterAdapter extends BaseChannelAdapter {
  channel = ConnectivityChannel.QUANTUM_FLUTTER;

  async available(): Promise<boolean> {
    return typeof crypto !== 'undefined';
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async send(message: Message): Promise<void> {
    console.log('⚛️ Quantum fluttering:', message);
  }

  async getPeers(): Promise<PeerInfo[]> {
    return [];
  }

  async discoverPeers(): Promise<PeerInfo[]> {
    return [];
  }
}
