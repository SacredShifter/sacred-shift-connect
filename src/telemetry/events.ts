/**
 * Sacred Shifter Ethos-Compliant Telemetry System
 * 
 * All events require explicit consent and validate resonance principles.
 * Events are namespaced under 'ethos.*' to ensure sacred alignment.
 */

export type EthosEvent = 
  // Ceremony & Collective Coherence
  | { 
      name: 'ethos.ceremony_join'; 
      consent: true; 
      props: { 
        phase: 'breath' | 'silence' | 'intention' | 'witness' | 'eros' | 'butterfly' | 'justice';
        participants_count: number;
        session_id: string;
      } 
    }
  | { 
      name: 'ethos.ceremony_complete'; 
      consent: true; 
      props: { 
        phase: 'breath' | 'silence' | 'intention' | 'witness' | 'eros' | 'butterfly' | 'justice';
        duration_seconds: number;
        coherence_achieved: boolean;
      } 
    }
  
  // Resonance & Coherence Tracking
  | { 
      name: 'ethos.coherence_dwell'; 
      consent: true; 
      props: { 
        view: string;
        seconds: number; 
        heart_rate_sync?: boolean;
        breath_sync?: boolean;
      } 
    }
  | { 
      name: 'ethos.resonance_achieved'; 
      consent: true; 
      props: { 
        pattern_type: 'seed_of_life' | 'flower_of_life' | 'merkaba' | 'sri_yantra';
        coherence_level: number; // 0-1
        group_sync: boolean;
      } 
    }
  
  // Sovereignty & Privacy Actions
  | { 
      name: 'ethos.privacy_toggle'; 
      consent: true; 
      props: { 
        setting: string; 
        value: boolean;
        category: 'data' | 'telemetry' | 'ceremony' | 'field';
      } 
    }
  | { 
      name: 'ethos.consent_granted'; 
      consent: true; 
      props: { 
        consent_type: 'telemetry' | 'ceremony' | 'field_sync' | 'data_sharing';
        revocable: boolean;
      } 
    }
  | { 
      name: 'ethos.data_export_requested'; 
      consent: true; 
      props: { 
        export_type: 'full' | 'ceremony' | 'privacy' | 'telemetry';
      } 
    }
  
  // Sacred Technology & Transcendence
  | { 
      name: 'ethos.pattern_interaction'; 
      consent: true; 
      props: { 
        pattern_type: string;
        interaction_type: 'hover' | 'click' | 'breath_sync' | 'heart_sync';
        sacred_timing_matched: boolean; // animations match 4-8-8 cadence
      } 
    }
  | { 
      name: 'ethos.transcendence_moment'; 
      consent: true; 
      props: { 
        trigger: 'pattern_completion' | 'group_sync' | 'sacred_geometry' | 'silence';
        duration_ms: number;
        coherence_score: number;
      } 
    }
  
  // Accessibility & Inclusivity
  | { 
      name: 'ethos.accessibility_preference'; 
      consent: true; 
      props: { 
        preference: 'reduced_motion' | 'high_contrast' | 'screen_reader' | 'large_text';
        enabled: boolean;
      } 
    }
  | { 
      name: 'ethos.inclusive_flow_completed'; 
      consent: true; 
      props: { 
        flow_type: string;
        accessibility_mode: string;
        completion_time_ms: number;
      } 
    }
  
  // Noise Reduction & Flow
  | { 
      name: 'ethos.noise_reduced'; 
      consent: true; 
      props: { 
        noise_type: 'notification' | 'ui_element' | 'cognitive_load';
        reduction_amount: number; // delta from baseline
      } 
    }
  | { 
      name: 'ethos.flow_interruption'; 
      consent: true; 
      props: { 
        interruption_type: 'notification' | 'error' | 'context_switch';
        flow_context: string;
        recovery_time_ms: number;
      } 
    }
  
  // Field Integrity & Community
  | { 
      name: 'ethos.field_resonance_change'; 
      consent: true; 
      props: { 
        previous_level: number;
        new_level: number;
        trigger: 'ceremony' | 'community_action' | 'individual_practice';
      } 
    }
  | { 
      name: 'ethos.integrity_violation_detected'; 
      consent: true; 
      props: { 
        violation_type: 'manipulation' | 'dark_pattern' | 'exploitation';
        auto_blocked: boolean;
      } 
    };

// Consent management state
interface ConsentState {
  telemetry: boolean;
  ceremony: boolean;
  field_sync: boolean;
  data_sharing: boolean;
  granted_at?: number;
  revoked_at?: number;
}

class EthosAnalytics {
  private consentState: ConsentState = {
    telemetry: false,
    ceremony: false, 
    field_sync: false,
    data_sharing: false
  };
  
  private eventQueue: EthosEvent[] = [];
  
  constructor() {
    // Load consent state from localStorage
    this.loadConsentState();
  }
  
  /**
   * Track ethos-compliant event with mandatory consent check
   */
  track(event: EthosEvent): void {
    // Hard consent guard - no tracking without explicit consent
    if (!event.consent) {
      console.warn('Ethos Analytics: Event blocked - consent required', event.name);
      return;
    }
    
    // Verify consent for event category
    if (!this.hasConsentFor(event.name)) {
      console.warn('Ethos Analytics: Event blocked - category consent missing', event.name);
      this.queueEvent(event);
      return;
    }
    
    // Add sacred metadata
    const enhancedEvent = {
      ...event,
      timestamp: Date.now(),
      session_id: this.getSessionId(),
      field_coherence: this.getFieldCoherence(),
      sacred_timing: this.getSacredTiming()
    };
    
    // Send to analytics service (implementation depends on chosen provider)
    this.sendToAnalytics(enhancedEvent);
    
    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔱 Ethos Event:', enhancedEvent);
    }
  }
  
  /**
   * Grant consent for specific telemetry categories
   */
  grantConsent(categories: (keyof ConsentState)[]): void {
    categories.forEach(category => {
      (this.consentState as any)[category] = true;
    });
    
    this.consentState.granted_at = Date.now();
    this.saveConsentState();
    
    // Process queued events
    this.processQueuedEvents();
    
    // Track consent granting
    categories.forEach(category => {
      this.track({
        name: 'ethos.consent_granted',
        consent: true,
        props: {
          consent_type: category as any,
          revocable: true
        }
      });
    });
  }
  
  /**
   * Revoke consent - stops all tracking immediately
   */
  revokeConsent(categories?: (keyof ConsentState)[]): void {
    const categoriesToRevoke = categories || Object.keys(this.consentState) as (keyof ConsentState)[];
    
    categoriesToRevoke.forEach(category => {
      (this.consentState as any)[category] = false;
    });
    
    this.consentState.revoked_at = Date.now();
    this.saveConsentState();
    
    // Clear event queue
    this.eventQueue = [];
  }
  
  /**
   * Get current consent state
   */
  getConsentState(): ConsentState {
    return { ...this.consentState };
  }
  
  private hasConsentFor(eventName: string): boolean {
    if (eventName.startsWith('ethos.ceremony_')) return this.consentState.ceremony;
    if (eventName.startsWith('ethos.privacy_') || eventName.startsWith('ethos.consent_')) return this.consentState.telemetry;
    if (eventName.startsWith('ethos.field_')) return this.consentState.field_sync;
    return this.consentState.telemetry; // Default category
  }
  
  private queueEvent(event: EthosEvent): void {
    // Only queue if user hasn't explicitly revoked consent
    if (this.consentState.revoked_at) return;
    
    this.eventQueue.push(event);
    
    // Limit queue size to prevent memory issues
    if (this.eventQueue.length > 100) {
      this.eventQueue = this.eventQueue.slice(-50);
    }
  }
  
  private processQueuedEvents(): void {
    const eventsToProcess = [...this.eventQueue];
    this.eventQueue = [];
    
    eventsToProcess.forEach(event => {
      this.track(event);
    });
  }
  
  private sendToAnalytics(event: any): void {
    // Implementation depends on analytics provider
    // Could be Google Analytics, PostHog, etc.
    // Ensure all data is anonymous and respects privacy
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.name, {
        ...event.props,
        sacred_timing: event.sacred_timing,
        field_coherence: event.field_coherence
      });
    }
  }
  
  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server';
    
    let sessionId = sessionStorage.getItem('ethos_session_id');
    if (!sessionId) {
      sessionId = `ethos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('ethos_session_id', sessionId);
    }
    return sessionId;
  }
  
  private getFieldCoherence(): number {
    // Integration with field integrity system
    // Return current field coherence level (0-1)
    return 0.75; // Placeholder
  }
  
  private getSacredTiming(): boolean {
    // Check if current moment aligns with sacred timing patterns
    // e.g., phi ratio intervals, breath cycle alignment, etc.
    const now = Date.now();
    const PHI = 1.618033988749;
    return (now % 1000) / 1000 < (1 / PHI);
  }
  
  private loadConsentState(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('ethos_consent_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.consentState = {
          ...this.consentState,
          ...parsed,
          granted_at: parsed.granted_at ? parsed.granted_at : undefined,
          revoked_at: parsed.revoked_at ? parsed.revoked_at : undefined
        };
      }
    } catch (error) {
      console.warn('Failed to load consent state:', error);
    }
  }
  
  private saveConsentState(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('ethos_consent_state', JSON.stringify(this.consentState));
    } catch (error) {
      console.warn('Failed to save consent state:', error);
    }
  }
}

// Global analytics instance
export const ethosAnalytics = new EthosAnalytics();

// Convenience function for tracking
export const trackEthosEvent = (event: EthosEvent) => {
  ethosAnalytics.track(event);
};

// Consent management hooks for UI
export const useEthosConsent = () => {
  return {
    grantConsent: (categories: (keyof ConsentState)[]) => ethosAnalytics.grantConsent(categories),
    revokeConsent: (categories?: (keyof ConsentState)[]) => ethosAnalytics.revokeConsent(categories),
    getConsentState: () => ethosAnalytics.getConsentState()
  };
};