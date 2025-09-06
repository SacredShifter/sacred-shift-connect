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

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      logger.info('Sacred Shifter PWA: Service Worker registered', { 
        component: 'pwa', 
        scope: registration.scope 
      });
      
      // Listen for PWA install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        logger.info('Sacred Shifter PWA: Install prompt available', { component: 'pwa' });
        // Store the event so it can be triggered later
        (window as any).deferredPrompt = e;
        
        // Show install button or UI element
        const installEvent = new CustomEvent('pwa-installable');
        window.dispatchEvent(installEvent);
      });
      
      // PWA installed
      window.addEventListener('appinstalled', () => {
        logger.info('Sacred Shifter PWA: Successfully installed', { component: 'pwa' });
        (window as any).deferredPrompt = null;
      });
      
    } catch (error) {
      logger.error('Sacred Shifter PWA: Service Worker registration failed', { 
        component: 'pwa', 
        error: error.message 
      });
    }
  });
}

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

// HMR is now enabled for development

// WebSocket connections are now properly managed by the Sacred Connectivity Guardian
// Real-time consciousness synchronization channels are active

// Import and run connectivity test for development
if (import.meta.env.DEV) {
  import('./utils/connectivityTest').then(({ testConnectivity }) => {
    // Run connectivity test after a short delay to allow app to initialize
    setTimeout(() => {
      testConnectivity().then(success => {
        if (success) {
          console.log('🌟 Sacred Connectivity System: All channels operational');
        } else {
          console.warn('⚠️ Sacred Connectivity System: Some channels may be degraded');
        }
      });
    }, 2000);
  });
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