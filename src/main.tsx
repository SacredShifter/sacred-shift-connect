import './lib/polyfills';
import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/providers/AppProviders";
import { JusticePlatformProvider } from "@/contexts/JusticePlatformContext";
import { SentryErrorBoundary } from "@/components/SentryErrorBoundary";
import App from './App.tsx';
import './index.css';
import '@/lib/typeSuppressions';
import * as Sentry from "@sentry/react";

// Sentry Initialization - Optimized for rate limiting
if (!import.meta.env.DEV && import.meta.env.VITE_SENTRY_DSN && import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      // Replay is disabled for now to reduce noise
      // Sentry.replayIntegration(),
    ],
    // Turn off all sampling until the app is stable
    tracesSampleRate: 0,
    profilesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    
    // Filtering to reduce noise
    beforeSend(event) {
      // Drop info/log events as per instructions
      if (event.level === 'log' || event.level === 'info') return null;
      return event;
    },
    
         maxBreadcrumbs: 20,
  });
}

// Capacitor Mobile Support
import { Capacitor } from '@capacitor/core';

// Configure query client for mobile optimization
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Capacitor.isNativePlatform() ? 30000 : 10000, // Longer cache on mobile
      retry: Capacitor.isNativePlatform() ? 2 : 3, // Fewer retries on mobile
      networkMode: 'offlineFirst', // Mobile-friendly offline support
    },
    mutations: {
      retry: Capacitor.isNativePlatform() ? 1 : 2,
      networkMode: 'offlineFirst',
    }
  }
});

import { logger } from './lib/logger';
import { initializeMonitoring } from './lib/monitoring';

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  let beforeInstallPromptHandler: ((e: Event) => void) | null = null;
  let appInstalledHandler: (() => void) | null = null;

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      logger.info('Sacred Shifter PWA: Service Worker registered', { 
        component: 'pwa', 
        scope: registration.scope 
      });
      
      // Listen for PWA install prompt
      beforeInstallPromptHandler = (e: Event) => {
        logger.info('Sacred Shifter PWA: Install prompt available', { component: 'pwa' });
        // Store the event so it can be triggered later
        (window as any).deferredPrompt = e;
        
        // Show install button or UI element
        const installEvent = new CustomEvent('pwa-installable');
        window.dispatchEvent(installEvent);
      };
      
      // PWA installed
      appInstalledHandler = () => {
        logger.info('Sacred Shifter PWA: Successfully installed', { component: 'pwa' });
        (window as any).deferredPrompt = null;
      };
      
      window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
      window.addEventListener('appinstalled', appInstalledHandler);
      
    } catch (error) {
      logger.error('Sacred Shifter PWA: Service Worker registration failed', { 
        component: 'pwa', 
        error: error.message 
      });
    }
  };

  window.addEventListener('load', registerServiceWorker);

  // Cleanup function for PWA event listeners
  const cleanupPWA = () => {
    if (beforeInstallPromptHandler) {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    }
    if (appInstalledHandler) {
      window.removeEventListener('appinstalled', appInstalledHandler);
    }
  };

  // Store cleanup function globally for potential use
  (window as any).cleanupPWA = cleanupPWA;
}

// Initialize monitoring
const monitoring = initializeMonitoring();

// Initialize mobile-specific features
if (Capacitor.isNativePlatform()) {
  logger.info('Sacred Shifter Community - Running on native mobile platform', { component: 'main' });
  
  // Add mobile-specific initialization here
  document.addEventListener('deviceready', () => {
    logger.info('Mobile device ready - Sacred consciousness activated', { component: 'main' });
  });
  
  // Handle app state changes for consciousness preservation
  document.addEventListener('pause', () => {
    logger.info('App paused - Consciousness state preserved', { component: 'main' });
  });
  
  document.addEventListener('resume', () => {
    logger.info('App resumed - Consciousness state restored', { component: 'main' });
  });
}

// NUCLEAR OPTION: Completely disable HMR on client side
if (import.meta.hot) {
  import.meta.hot.dispose(() => {});
  import.meta.hot.accept(() => {});
}

// NUCLEAR VITE CLIENT KILLER: Block Vite's internal WebSocket client
if (typeof window !== 'undefined') {
  // Block Vite's internal WebSocket client
  (window as any).__VITE_HMR_DISABLE__ = true;
  (window as any).__VITE_DISABLE_HMR__ = true;
  
  // Override any Vite-related WebSocket attempts
  if ((window as any).__VITE_HMR_SOCKET__) {
    (window as any).__VITE_HMR_SOCKET__ = {
      readyState: 3,
      close: () => console.warn('🚨 Vite HMR socket blocked'),
      send: () => console.warn('🚨 Vite HMR socket blocked'),
      addEventListener: () => {},
      removeEventListener: () => {}
    };
  }
}

// Disable any WebSocket connections
if (typeof window !== 'undefined') {
  // Override WebSocket constructor
  const OriginalWebSocket = window.WebSocket;
  (window as any).WebSocket = function(url: string, protocols?: string | string[]) {
    console.warn('WebSocket connection blocked:', url);
    // Return a mock WebSocket that does nothing
    return {
      readyState: 3, // CLOSED
      url: url,
      protocol: protocols ? (Array.isArray(protocols) ? protocols[0] : protocols) : '',
      extensions: '',
      bufferedAmount: 0,
      onopen: null,
      onclose: null,
      onmessage: null,
      onerror: null,
      close: () => {},
      send: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    } as any;
  };
  
  // Also block fetch to WebSocket URLs
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.startsWith('ws://') || url.startsWith('wss://')) {
      console.warn('WebSocket fetch blocked:', url);
      return Promise.reject(new Error('WebSocket connections are disabled'));
    }
    return originalFetch(input, init);
  };
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SentryErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppProviders>
            <JusticePlatformProvider>
              <App />
              <Toaster />
            </JusticePlatformProvider>
          </AppProviders>
        </BrowserRouter>
      </QueryClientProvider>
    </SentryErrorBoundary>
  </StrictMode>,
);