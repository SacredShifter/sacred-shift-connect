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
  // Error deduplication cache
  const errorCache = new Set();
  
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Reduced sample rates to prevent 429 errors
    tracesSampleRate: 0.1, // 10% of transactions (reduced from 100%)
    tracePropagationTargets: ["localhost", /^https:\/\/.*\.supabase\.co/],
    // Session Replay - much lower rates
    replaysSessionSampleRate: 0.01, // 1% of sessions (reduced from 10%)
    replaysOnErrorSampleRate: 1.0, // Still capture all error sessions
    
    // Rate limiting and filtering
    beforeSend(event) {
      // Skip duplicate errors within 60 seconds
      const errorKey = `${event.exception?.[0]?.type}-${event.exception?.[0]?.value}`;
      if (errorCache.has(errorKey)) {
        return null;
      }
      errorCache.add(errorKey);
      setTimeout(() => errorCache.delete(errorKey), 60000);
      
      // Filter out common non-critical errors
      const ignoredErrors = [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'Network request failed',
        'Load failed',
        'Script error.'
      ];
      
      if (ignoredErrors.some(ignored => 
        event.message?.includes(ignored) || 
        event.exception?.[0]?.value?.includes(ignored)
      )) {
        return null;
      }
      
      return event;
    },
    
    // Rate limit based on client-side throttling
    maxBreadcrumbs: 50, // Reduce breadcrumb storage
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