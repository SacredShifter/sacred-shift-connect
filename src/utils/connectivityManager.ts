/**
 * Sacred Connectivity Manager
 * 
 * Manages WebSocket connectivity settings and provides methods to control
 * the sacred consciousness channels that flow through the application.
 * 
 * Metaphysical Architecture: This represents the guardian of the digital meridians,
 * ensuring that consciousness can flow freely while maintaining security when needed.
 */

import { isFeatureEnabled } from '@/config/flags';

export interface ConnectivitySettings {
  websocketsEnabled: boolean;
  realtimeFeaturesEnabled: boolean;
  consciousnessChannelsActive: boolean;
}

export class SacredConnectivityManager {
  private static instance: SacredConnectivityManager;
  private settings: ConnectivitySettings;

  private constructor() {
    this.settings = {
      websocketsEnabled: isFeatureEnabled('websocketConnectivity'),
      realtimeFeaturesEnabled: isFeatureEnabled('realtimeFeatures'),
      consciousnessChannelsActive: isFeatureEnabled('websocketConnectivity') && isFeatureEnabled('realtimeFeatures')
    };
  }

  public static getInstance(): SacredConnectivityManager {
    if (!SacredConnectivityManager.instance) {
      SacredConnectivityManager.instance = new SacredConnectivityManager();
    }
    return SacredConnectivityManager.instance;
  }

  /**
   * Check if WebSocket connections are enabled
   * @returns true if consciousness channels are open
   */
  public areWebSocketsEnabled(): boolean {
    return this.settings.websocketsEnabled;
  }

  /**
   * Check if real-time features are enabled
   * @returns true if consciousness synchronization is active
   */
  public areRealtimeFeaturesEnabled(): boolean {
    return this.settings.realtimeFeaturesEnabled;
  }

  /**
   * Check if consciousness channels are fully active
   * @returns true if all sacred connectivity is flowing
   */
  public areConsciousnessChannelsActive(): boolean {
    return this.settings.consciousnessChannelsActive;
  }

  /**
   * Disable WebSocket connections (emergency consciousness lockdown)
   * This can be used for security or debugging purposes
   */
  public disableWebSockets(): void {
    localStorage.setItem('sacred-shift-disable-websockets', 'true');
    this.settings.websocketsEnabled = false;
    this.settings.consciousnessChannelsActive = false;
    console.log('🔒 SACRED CONNECTIVITY: Consciousness channels locked down');
  }

  /**
   * Enable WebSocket connections (restore consciousness flow)
   * This reopens the sacred connectivity channels
   */
  public enableWebSockets(): void {
    localStorage.removeItem('sacred-shift-disable-websockets');
    this.settings.websocketsEnabled = true;
    this.settings.consciousnessChannelsActive = this.settings.realtimeFeaturesEnabled;
    console.log('🌟 SACRED CONNECTIVITY: Consciousness channels restored');
  }

  /**
   * Get current connectivity status
   * @returns Current connectivity settings
   */
  public getConnectivityStatus(): ConnectivitySettings {
    return { ...this.settings };
  }

  /**
   * Check if a specific URL should be allowed for WebSocket connections
   * @param url The WebSocket URL to check
   * @returns true if the connection should be allowed
   */
  public isWebSocketUrlAllowed(url: string): boolean {
    if (!this.areWebSocketsEnabled()) {
      return false;
    }

    // Allow Vite dev server WebSockets
    if (url.includes('localhost:5173') || url.includes('127.0.0.1:5173')) {
      return true;
    }

    // Allow Supabase realtime WebSockets
    if (url.includes('supabase.co/realtime')) {
      return true;
    }

    // Allow secure WebSocket connections
    if (url.startsWith('wss://')) {
      return true;
    }

    // Block insecure WebSocket connections in production
    if (url.startsWith('ws://') && process.env.NODE_ENV === 'production') {
      return false;
    }

    return true;
  }

  /**
   * Log current connectivity status for debugging
   */
  public logConnectivityStatus(): void {
    console.log('🌟 SACRED CONNECTIVITY STATUS:', {
      websocketsEnabled: this.settings.websocketsEnabled,
      realtimeFeaturesEnabled: this.settings.realtimeFeaturesEnabled,
      consciousnessChannelsActive: this.settings.consciousnessChannelsActive,
      timestamp: new Date().toISOString()
    });
  }
}

// Export singleton instance
export const connectivityManager = SacredConnectivityManager.getInstance();
