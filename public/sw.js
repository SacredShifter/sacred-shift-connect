// Sacred Shifter Service Worker - Local-First PWA
const CACHE_NAME = 'sacred-shifter-v1.0.0';
const OFFLINE_CACHE = 'sacred-shifter-offline-v1.0.0';

// Core files to cache for offline functionality
const CORE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  // Core routes that should work offline
  '/auth',
  '/profile',
  '/settings',
  '/journal',
  '/practice/daily',
  '/meditation',
  '/breath'
];

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Sacred Shifter Service Worker');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching core files');
        return cache.addAll(CORE_FILES);
      }),
      caches.open(OFFLINE_CACHE).then((cache) => {
        console.log('[SW] Offline cache ready');
        // Pre-cache offline fallback page
        return cache.add('/offline.html');
      })
    ])
  );
  
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Sacred Shifter Service Worker');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch event - implement local-first strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(navigationHandler(request));
    return;
  }
  
  // Handle static assets with cache-first strategy
  event.respondWith(cacheFirstStrategy(request));
});

// Network-first strategy for API calls
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for:', request.url);
    
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline indicator for failed API calls
    return new Response(
      JSON.stringify({ 
        error: 'Offline mode active', 
        offline: true,
        message: 'This action will be synced when you\'re back online'
      }),
      {
        status: 503,
        statusText: 'Service Unavailable - Offline Mode',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch:', request.url);
    return new Response('Resource not available offline', { 
      status: 404,
      statusText: 'Not Found - Offline Mode'
    });
  }
}

// Navigation handler for SPA routing
async function navigationHandler(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('[SW] Navigation offline, serving cached app');
    
    // Serve cached index.html for offline navigation
    const cachedResponse = await cache.match('/') || await cache.match('/index.html');
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    return cache.match('/offline.html') || new Response(
      '<html><body><h1>Sacred Shifter - Offline Mode</h1><p>Please check your connection.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Background sync for local-first data
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sacred-data-sync') {
    event.waitUntil(syncPendingData());
  }
});

async function syncPendingData() {
  console.log('[SW] Syncing pending data...');
  
  // Get all pending sync items from IndexedDB
  const clients = await self.clients.matchAll();
  
  // Notify app to sync pending data
  clients.forEach(client => {
    client.postMessage({
      type: 'SYNC_REQUESTED',
      timestamp: Date.now()
    });
  });
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Sacred Shifter notification',
    icon: 'https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/SSfavicon.png',
    badge: 'https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/SSfavicon.png',
    tag: 'sacred-shifter',
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'open',
        title: 'Open Sacred Shifter'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Sacred Shifter', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        // Check if app is already open
        for (const client of clients) {
          if (client.url.includes('sacred-shifter') && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if app is not open
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
  }
});

console.log('[SW] Sacred Shifter Service Worker loaded - Local-First Mode Active');