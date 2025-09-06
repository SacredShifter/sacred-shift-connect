// Sacred Shifter mDNS Service Worker
// Provides mDNS-like discovery for local network peers

const CACHE_NAME = 'sacred-shifter-mdns-v1';
const SERVICE_TYPE = '_sacredshifter._tcp.local';
const DISCOVERY_INTERVAL = 5000; // 5 seconds

// Mock mDNS discovery (in real implementation, this would use WebRTC or WebSocket)
class MockmDNSDiscovery {
  constructor() {
    this.services = new Map();
    this.discoveryInterval = null;
  }

  startDiscovery() {
    console.log('🔍 Starting mock mDNS discovery...');
    
    // Simulate discovering services on local network
    this.discoveryInterval = setInterval(() => {
      this.simulateServiceDiscovery();
    }, DISCOVERY_INTERVAL);
  }

  stopDiscovery() {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
      this.discoveryInterval = null;
    }
  }

  simulateServiceDiscovery() {
    // Simulate discovering Sacred Shifter instances
    const mockServices = [
      {
        name: 'sacred-shifter-device-1',
        type: SERVICE_TYPE,
        port: 8080,
        txt: {
          id: 'device-1',
          name: 'Sacred Shifter Device 1',
          capabilities: 'mesh,webrtc,bluetooth',
          version: '1.0.0',
          publicKey: 'mock-public-key-1'
        },
        addresses: ['192.168.1.100']
      },
      {
        name: 'sacred-shifter-device-2',
        type: SERVICE_TYPE,
        port: 8080,
        txt: {
          id: 'device-2',
          name: 'Sacred Shifter Device 2',
          capabilities: 'mesh,webrtc',
          version: '1.0.0',
          publicKey: 'mock-public-key-2'
        },
        addresses: ['192.168.1.101']
      }
    ];

    // Randomly discover services
    if (Math.random() < 0.3) { // 30% chance per interval
      const service = mockServices[Math.floor(Math.random() * mockServices.length)];
      this.services.set(service.name, service);
      
      // Notify main thread
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'mdns_service_found',
            service: service
          });
        });
      });
    }
  }
}

const mdnsDiscovery = new MockmDNSDiscovery();

// Service Worker event listeners
self.addEventListener('install', (event) => {
  console.log('📡 mDNS Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('📡 mDNS Service Worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'discover_services':
      console.log('🔍 Discovery request received');
      mdnsDiscovery.startDiscovery();
      break;
      
    case 'stop_discovery':
      console.log('🛑 Stop discovery request received');
      mdnsDiscovery.stopDiscovery();
      break;
      
    default:
      console.log('📡 Unknown message type:', type);
  }
});

// Handle service worker updates
self.addEventListener('fetch', (event) => {
  // Handle mDNS-related requests
  if (event.request.url.includes('mdns')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
