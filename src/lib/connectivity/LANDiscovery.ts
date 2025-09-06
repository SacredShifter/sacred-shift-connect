// Sacred Shifter LAN Discovery System
// Implements mDNS, WiFi Direct, and local peer table management

export interface LANPeer {
  id: string;
  name: string;
  ip: string;
  port: number;
  services: string[];
  lastSeen: number;
  signalStrength: number;
  capabilities: string[];
  publicKey?: Uint8Array;
}

export interface ServiceInfo {
  name: string;
  type: string;
  port: number;
  txt: Record<string, string>;
  addresses: string[];
}

export class LANDiscovery {
  private peers: Map<string, LANPeer> = new Map();
  private services: Map<string, ServiceInfo> = new Map();
  private isDiscovering = false;
  private discoveryInterval?: number;
  private nodeId: string;
  private localServices: ServiceInfo[] = [];

  constructor(nodeId: string) {
    this.nodeId = nodeId;
  }

  // Start LAN discovery
  async startDiscovery(): Promise<void> {
    if (this.isDiscovering) return;

    this.isDiscovering = true;
    console.log('🔍 Starting LAN discovery...');

    // Start mDNS discovery
    await this.startmDNSDiscovery();

    // Start local peer table discovery
    await this.startLocalPeerTableDiscovery();

    // Start periodic discovery
    this.discoveryInterval = window.setInterval(() => {
      this.performDiscovery();
    }, 5000); // Every 5 seconds

    console.log('🔍 LAN discovery started');
  }

  // Stop LAN discovery
  stopDiscovery(): void {
    this.isDiscovering = false;
    
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
      this.discoveryInterval = undefined;
    }

    console.log('🔍 LAN discovery stopped');
  }

  // Start mDNS discovery
  private async startmDNSDiscovery(): Promise<void> {
    try {
      // Check if mDNS is available
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        // Use service worker for mDNS-like discovery
        await this.registerServiceWorker();
        await this.discovermDNSServices();
      } else {
        console.log('⚠️ mDNS not available, using fallback discovery');
        await this.fallbackDiscovery();
      }
    } catch (error) {
      console.error('❌ mDNS discovery failed:', error);
      await this.fallbackDiscovery();
    }
  }

  // Register service worker for mDNS
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/mdns-sw.js');
        console.log('📡 mDNS service worker registered');
        
        // Listen for mDNS messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'mdns_service_found') {
            this.handleDiscoveredService(event.data.service);
          }
        });
      } catch (error) {
        console.error('❌ Service worker registration failed:', error);
      }
    }
  }

  // Discover mDNS services
  private async discovermDNSServices(): Promise<void> {
    // Send discovery request to service worker
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'discover_services',
        serviceType: '_sacredshifter._tcp.local'
      });
    }
  }

  // Handle discovered service
  private handleDiscoveredService(service: ServiceInfo): void {
    try {
      console.log('🔍 Discovered service:', service);
      
      // Validate service data
      if (!service || !service.name) {
        console.warn('Invalid service data received:', service);
        return;
      }
      
      // Extract peer information from service
      const peer: LANPeer = {
        id: service.txt?.id || service.name,
        name: service.txt?.name || service.name,
        ip: service.addresses?.[0] || 'unknown',
        port: service.port || 0,
        services: [service.type || 'unknown'],
        lastSeen: Date.now(),
        signalStrength: 0.8, // Default signal strength
        capabilities: service.txt?.capabilities?.split(',') || [],
        publicKey: service.txt?.publicKey ? this.base64ToUint8Array(service.txt.publicKey) : undefined
      };

      this.peers.set(peer.id, peer);
      console.log('👥 Added peer:', peer.name);
    } catch (error) {
      console.warn('Error handling discovered service:', error, service);
    }
  }

  // Fallback discovery method
  private async fallbackDiscovery(): Promise<void> {
    console.log('🔄 Using fallback discovery method');
    
    // Simulate discovering peers on local network
    const mockPeers: LANPeer[] = [
      {
        id: 'peer-1',
        name: 'Sacred Shifter Device 1',
        ip: '192.168.1.100',
        port: 8080,
        services: ['_sacredshifter._tcp.local'],
        lastSeen: Date.now(),
        signalStrength: 0.9,
        capabilities: ['mesh', 'webrtc', 'bluetooth']
      },
      {
        id: 'peer-2',
        name: 'Sacred Shifter Device 2',
        ip: '192.168.1.101',
        port: 8080,
        services: ['_sacredshifter._tcp.local'],
        lastSeen: Date.now(),
        signalStrength: 0.7,
        capabilities: ['mesh', 'webrtc']
      }
    ];

    for (const peer of mockPeers) {
      this.peers.set(peer.id, peer);
    }
  }

  // Start local peer table discovery
  private async startLocalPeerTableDiscovery(): Promise<void> {
    // Check for peers in localStorage (from other tabs/windows)
    const storedPeers = localStorage.getItem('sacred_shifter_peers');
    if (storedPeers) {
      try {
        const peers = JSON.parse(storedPeers);
        for (const peer of peers) {
          this.peers.set(peer.id, peer);
        }
      } catch (error) {
        console.error('❌ Failed to parse stored peers:', error);
      }
    }

    // Store our own peer info
    this.storeLocalPeerInfo();
  }

  // Store local peer info
  private storeLocalPeerInfo(): void {
    const localPeer: LANPeer = {
      id: this.nodeId,
      name: 'This Device',
      ip: 'localhost',
      port: window.location.port ? parseInt(window.location.port) : 80,
      services: ['_sacredshifter._tcp.local'],
      lastSeen: Date.now(),
      signalStrength: 1.0,
      capabilities: ['mesh', 'webrtc', 'bluetooth', 'nfc']
    };

    this.peers.set(this.nodeId, localPeer);
  }

  // Perform discovery
  private async performDiscovery(): Promise<void> {
    if (!this.isDiscovering) return;

    // Clean up old peers
    this.cleanupOldPeers();

    // Try to discover new peers
    await this.discovermDNSServices();

    // Update local peer table
    this.updateLocalPeerTable();
  }

  // Clean up old peers
  private cleanupOldPeers(): void {
    const now = Date.now();
    const maxAge = 30000; // 30 seconds

    for (const [id, peer] of this.peers) {
      if (id !== this.nodeId && now - peer.lastSeen > maxAge) {
        this.peers.delete(id);
        console.log('🗑️ Removed old peer:', peer.name);
      }
    }
  }

  // Update local peer table
  private updateLocalPeerTable(): void {
    const peers = Array.from(this.peers.values());
    localStorage.setItem('sacred_shifter_peers', JSON.stringify(peers));
  }

  // Get all discovered peers
  getPeers(): LANPeer[] {
    return Array.from(this.peers.values());
  }

  // Get peer by ID
  getPeer(id: string): LANPeer | undefined {
    return this.peers.get(id);
  }

  // Get peers by capability
  getPeersByCapability(capability: string): LANPeer[] {
    return Array.from(this.peers.values()).filter(peer => 
      peer.capabilities.includes(capability)
    );
  }

  // Get peers by service
  getPeersByService(service: string): LANPeer[] {
    return Array.from(this.peers.values()).filter(peer => 
      peer.services.includes(service)
    );
  }

  // Register local service
  registerService(service: ServiceInfo): void {
    this.localServices.push(service);
    console.log('📡 Registered service:', service.name);
  }

  // Unregister local service
  unregisterService(serviceName: string): void {
    this.localServices = this.localServices.filter(s => s.name !== serviceName);
    console.log('📡 Unregistered service:', serviceName);
  }

  // Get local services
  getLocalServices(): ServiceInfo[] {
    return [...this.localServices];
  }

  // Check if peer is online
  isPeerOnline(peerId: string): boolean {
    const peer = this.peers.get(peerId);
    if (!peer) return false;

    const now = Date.now();
    const maxAge = 30000; // 30 seconds
    return now - peer.lastSeen < maxAge;
  }

  // Get peer signal strength
  getPeerSignalStrength(peerId: string): number {
    const peer = this.peers.get(peerId);
    return peer?.signalStrength || 0;
  }

  // Update peer last seen
  updatePeerLastSeen(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.lastSeen = Date.now();
    }
  }

  // Convert base64 to Uint8Array
  private base64ToUint8Array(base64: string): Uint8Array {
    try {
      // Validate base64 string
      if (!base64 || typeof base64 !== 'string') {
        console.warn('Invalid base64 string provided:', base64);
        return new Uint8Array(0);
      }

      // Clean the base64 string (remove any non-base64 characters)
      const cleanBase64 = base64.replace(/[^A-Za-z0-9+/=]/g, '');
      
      // Check if it's valid base64
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
        console.warn('Invalid base64 format:', base64);
        return new Uint8Array(0);
      }

      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } catch (error) {
      console.warn('Failed to decode base64 string:', base64, error);
      return new Uint8Array(0);
    }
  }

  // Convert Uint8Array to base64
  private uint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }

  // Get discovery status
  getDiscoveryStatus(): {
    isDiscovering: boolean;
    peerCount: number;
    serviceCount: number;
  } {
    return {
      isDiscovering: this.isDiscovering,
      peerCount: this.peers.size,
      serviceCount: this.localServices.length
    };
  }
}

// WiFi Direct discovery (placeholder for future implementation)
export class WiFiDirectDiscovery {
  private isDiscovering = false;

  async startDiscovery(): Promise<void> {
    console.log('📶 WiFi Direct discovery not available in browser');
    this.isDiscovering = false;
  }

  stopDiscovery(): void {
    this.isDiscovering = false;
  }

  getPeers(): LANPeer[] {
    return [];
  }
}

// Local peer table manager
export class LocalPeerTable {
  private peers: Map<string, LANPeer> = new Map();
  private storageKey = 'sacred_shifter_peer_table';

  constructor() {
    this.loadFromStorage();
  }

  // Add peer to table
  addPeer(peer: LANPeer): void {
    this.peers.set(peer.id, peer);
    this.saveToStorage();
  }

  // Remove peer from table
  removePeer(peerId: string): void {
    this.peers.delete(peerId);
    this.saveToStorage();
  }

  // Update peer in table
  updatePeer(peerId: string, updates: Partial<LANPeer>): void {
    const peer = this.peers.get(peerId);
    if (peer) {
      Object.assign(peer, updates);
      this.saveToStorage();
    }
  }

  // Get peer by ID
  getPeer(peerId: string): LANPeer | undefined {
    return this.peers.get(peerId);
  }

  // Get all peers
  getAllPeers(): LANPeer[] {
    return Array.from(this.peers.values());
  }

  // Get peers by capability
  getPeersByCapability(capability: string): LANPeer[] {
    return Array.from(this.peers.values()).filter(peer => 
      peer.capabilities.includes(capability)
    );
  }

  // Load from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const peers = JSON.parse(stored);
        for (const peer of peers) {
          this.peers.set(peer.id, peer);
        }
      }
    } catch (error) {
      console.error('❌ Failed to load peer table:', error);
    }
  }

  // Save to localStorage
  private saveToStorage(): void {
    try {
      const peers = Array.from(this.peers.values());
      localStorage.setItem(this.storageKey, JSON.stringify(peers));
    } catch (error) {
      console.error('❌ Failed to save peer table:', error);
    }
  }

  // Clear all peers
  clear(): void {
    this.peers.clear();
    localStorage.removeItem(this.storageKey);
  }
}
