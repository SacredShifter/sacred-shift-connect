/**
 * Telemetry Hooks - Prometheus/Ethos logging for GAA collective mode metrics
 */

export interface GAATelemetryMetrics {
  // Performance metrics
  oscillatorCount: number;
  averageFPS: number;
  cpuUsage: number;
  memoryUsageMB: number;
  audioLatency: number;
  
  // Collective mode metrics
  participantCount: number;
  globalCoherence: number;
  fieldStrength: number;
  pllLockStatus: boolean;
  averageNetworkLatency: number;
  maxNetworkLatency: number;
  packetLoss: number;
  
  // Safety metrics
  safetyScore: number;
  criticalViolations: number;
  sessionDuration: number;
  
  // User experience metrics
  userEngagement: number;
  interactionRate: number;
  errorRate: number;
}

export interface TelemetryEvent {
  type: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  data: Record<string, any>;
  tags: Record<string, string>;
}

export class TelemetryHooks {
  private metricsBuffer: GAATelemetryMetrics[] = [];
  private eventsBuffer: TelemetryEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private isEnabled = true;
  private maxBufferSize = 1000;
  private flushIntervalMs = 30000; // 30 seconds
  
  // Prometheus-style metric collectors
  private counters = new Map<string, number>();
  private gauges = new Map<string, number>();
  private histograms = new Map<string, number[]>();
  private summaries = new Map<string, { sum: number; count: number; quantiles?: number[] }>();

  constructor() {
    this.startAutoFlush();
    console.log('📊 Telemetry Hooks initialized for GAA metrics');
  }

  /**
   * Record GAA metrics
   */
  recordMetrics(metrics: Partial<GAATelemetryMetrics>): void {
    if (!this.isEnabled) return;

    const fullMetrics: GAATelemetryMetrics = {
      oscillatorCount: 0,
      averageFPS: 60,
      cpuUsage: 0,
      memoryUsageMB: 0,
      audioLatency: 0,
      participantCount: 0,
      globalCoherence: 0,
      fieldStrength: 0,
      pllLockStatus: false,
      averageNetworkLatency: 0,
      maxNetworkLatency: 0,
      packetLoss: 0,
      safetyScore: 100,
      criticalViolations: 0,
      sessionDuration: 0,
      userEngagement: 0,
      interactionRate: 0,
      errorRate: 0,
      ...metrics
    };

    this.metricsBuffer.push(fullMetrics);
    
    // Update Prometheus-style metrics
    this.updatePrometheusMetrics(fullMetrics);
    
    // Auto-flush if buffer is full
    if (this.metricsBuffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  /**
   * Record telemetry event
   */
  recordEvent(type: string, data: Record<string, any>, tags: Record<string, string> = {}): void {
    if (!this.isEnabled) return;

    const event: TelemetryEvent = {
      type,
      timestamp: Date.now(),
      data,
      tags: {
        component: 'gaa',
        ...tags
      }
    };

    this.eventsBuffer.push(event);
    
    // Increment counter for event type
    this.incrementCounter(`gaa_events_total`, { event_type: type });
    
    console.log(`📊 Telemetry event: ${type}`, { data, tags });
  }

  /**
   * Record collective mode specific metrics
   */
  recordCollectiveMetrics(data: {
    participantJoined?: string;
    participantLeft?: string;
    phaseCoherence?: number;
    fieldStrength?: number;
    pllDriftCorrection?: number;
    networkLatency?: number;
    syncQuality?: number;
  }): void {
    if (data.participantJoined) {
      this.recordEvent('participant_joined', { userId: data.participantJoined }, { action: 'join' });
      this.incrementCounter('gaa_participants_joined_total');
    }

    if (data.participantLeft) {
      this.recordEvent('participant_left', { userId: data.participantLeft }, { action: 'leave' });
      this.incrementCounter('gaa_participants_left_total');
    }

    if (data.phaseCoherence !== undefined) {
      this.setGauge('gaa_phase_coherence', data.phaseCoherence);
      this.recordHistogram('gaa_coherence_distribution', data.phaseCoherence);
    }

    if (data.fieldStrength !== undefined) {
      this.setGauge('gaa_field_strength', data.fieldStrength);
    }

    if (data.pllDriftCorrection !== undefined) {
      this.recordHistogram('gaa_pll_drift_correction', Math.abs(data.pllDriftCorrection));
    }

    if (data.networkLatency !== undefined) {
      this.recordHistogram('gaa_network_latency_ms', data.networkLatency);
      this.updateSummary('gaa_network_latency_summary', data.networkLatency);
    }

    if (data.syncQuality !== undefined) {
      this.setGauge('gaa_sync_quality', data.syncQuality);
    }
  }

  /**
   * Record performance metrics
   */
  recordPerformanceMetrics(data: {
    fps?: number;
    cpuUsage?: number;
    memoryUsage?: number;
    oscillatorCount?: number;
    audioDropouts?: number;
    renderTime?: number;
  }): void {
    if (data.fps !== undefined) {
      this.setGauge('gaa_fps', data.fps);
      this.recordHistogram('gaa_fps_distribution', data.fps);
    }

    if (data.cpuUsage !== undefined) {
      this.setGauge('gaa_cpu_usage', data.cpuUsage);
    }

    if (data.memoryUsage !== undefined) {
      this.setGauge('gaa_memory_usage_mb', data.memoryUsage);
    }

    if (data.oscillatorCount !== undefined) {
      this.setGauge('gaa_oscillators_active', data.oscillatorCount);
    }

    if (data.audioDropouts !== undefined) {
      this.incrementCounter('gaa_audio_dropouts_total', {}, data.audioDropouts);
    }

    if (data.renderTime !== undefined) {
      this.recordHistogram('gaa_render_time_ms', data.renderTime);
    }
  }

  /**
   * Record safety metrics
   */
  recordSafetyMetrics(data: {
    safetyScore?: number;
    violations?: Array<{ type: string; severity: string }>;
    audioLevel?: number;
    flashRate?: number;
    sessionDuration?: number;
  }): void {
    if (data.safetyScore !== undefined) {
      this.setGauge('gaa_safety_score', data.safetyScore);
    }

    if (data.violations) {
      data.violations.forEach(violation => {
        this.incrementCounter('gaa_safety_violations_total', {
          violation_type: violation.type,
          severity: violation.severity
        });
      });
    }

    if (data.audioLevel !== undefined) {
      this.setGauge('gaa_audio_level_db', data.audioLevel);
      this.recordHistogram('gaa_audio_level_distribution', data.audioLevel);
    }

    if (data.flashRate !== undefined) {
      this.setGauge('gaa_flash_rate_hz', data.flashRate);
    }

    if (data.sessionDuration !== undefined) {
      this.setGauge('gaa_session_duration_minutes', data.sessionDuration);
    }
  }

  /**
   * Update Prometheus-style metrics from GAA metrics
   */
  private updatePrometheusMetrics(metrics: GAATelemetryMetrics): void {
    // Gauges
    this.setGauge('gaa_oscillators_active', metrics.oscillatorCount);
    this.setGauge('gaa_fps', metrics.averageFPS);
    this.setGauge('gaa_cpu_usage', metrics.cpuUsage);
    this.setGauge('gaa_memory_usage_mb', metrics.memoryUsageMB);
    this.setGauge('gaa_participants_count', metrics.participantCount);
    this.setGauge('gaa_phase_coherence', metrics.globalCoherence);
    this.setGauge('gaa_field_strength', metrics.fieldStrength);
    this.setGauge('gaa_pll_locked', metrics.pllLockStatus ? 1 : 0);
    this.setGauge('gaa_network_latency_avg_ms', metrics.averageNetworkLatency);
    this.setGauge('gaa_network_latency_max_ms', metrics.maxNetworkLatency);
    this.setGauge('gaa_packet_loss', metrics.packetLoss);
    this.setGauge('gaa_safety_score', metrics.safetyScore);
    this.setGauge('gaa_session_duration_minutes', metrics.sessionDuration);

    // Histograms
    this.recordHistogram('gaa_fps_distribution', metrics.averageFPS);
    this.recordHistogram('gaa_coherence_distribution', metrics.globalCoherence);
    this.recordHistogram('gaa_network_latency_distribution', metrics.averageNetworkLatency);

    // Summaries
    this.updateSummary('gaa_performance_summary', metrics.averageFPS);
    this.updateSummary('gaa_coherence_summary', metrics.globalCoherence);
  }

  /**
   * Increment counter metric
   */
  private incrementCounter(metricName: string, labels: Record<string, string> = {}, value: number = 1): void {
    const key = this.getMetricKey(metricName, labels);
    this.counters.set(key, (this.counters.get(key) || 0) + value);
  }

  /**
   * Set gauge metric
   */
  private setGauge(metricName: string, value: number, labels: Record<string, string> = {}): void {
    const key = this.getMetricKey(metricName, labels);
    this.gauges.set(key, value);
  }

  /**
   * Record histogram value
   */
  private recordHistogram(metricName: string, value: number, labels: Record<string, string> = {}): void {
    const key = this.getMetricKey(metricName, labels);
    if (!this.histograms.has(key)) {
      this.histograms.set(key, []);
    }
    
    const values = this.histograms.get(key)!;
    values.push(value);
    
    // Keep only last 1000 values
    if (values.length > 1000) {
      values.shift();
    }
  }

  /**
   * Update summary metric
   */
  private updateSummary(metricName: string, value: number, labels: Record<string, string> = {}): void {
    const key = this.getMetricKey(metricName, labels);
    const summary = this.summaries.get(key) || { sum: 0, count: 0 };
    
    summary.sum += value;
    summary.count += 1;
    
    this.summaries.set(key, summary);
  }

  /**
   * Generate metric key with labels
   */
  private getMetricKey(metricName: string, labels: Record<string, string>): string {
    const labelString = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=\"${v}\"`)
      .join(',');
    
    return labelString ? `${metricName}{${labelString}}` : metricName;
  }

  /**
   * Get current metrics in Prometheus format
   */
  getPrometheusMetrics(): string {
    const lines: string[] = [];
    
    // Counters
    for (const [key, value] of this.counters) {
      lines.push(`# TYPE ${key.split('{')[0]} counter`);
      lines.push(`${key} ${value}`);
    }
    
    // Gauges
    for (const [key, value] of this.gauges) {
      lines.push(`# TYPE ${key.split('{')[0]} gauge`);
      lines.push(`${key} ${value}`);
    }
    
    // Histograms (simplified)
    for (const [key, values] of this.histograms) {
      const metricName = key.split('{')[0];
      lines.push(`# TYPE ${metricName} histogram`);
      
      if (values.length > 0) {
        const sorted = [...values].sort((a, b) => a - b);
        const sum = values.reduce((a, b) => a + b, 0);
        const count = values.length;
        
        // Add bucket counters for common percentiles
        const buckets = [0.5, 0.75, 0.9, 0.95, 0.99];
        buckets.forEach(p => {
          const index = Math.floor(p * sorted.length);
          const value = sorted[index] || 0;
          lines.push(`${key.replace('}', ',le="' + value + '"}')} ${Math.floor(p * count)}`);
        });
        
        lines.push(`${key}_sum ${sum}`);
        lines.push(`${key}_count ${count}`);
      }
    }
    
    // Summaries
    for (const [key, summary] of this.summaries) {
      const metricName = key.split('{')[0];
      lines.push(`# TYPE ${metricName} summary`);
      lines.push(`${key}_sum ${summary.sum}`);
      lines.push(`${key}_count ${summary.count}`);
      
      if (summary.count > 0) {
        lines.push(`${key}{quantile="0.5"} ${summary.sum / summary.count}`);
      }
    }
    
    return lines.join('\n') + '\n';
  }

  /**
   * Get aggregated metrics summary
   */
  getMetricsSummary(): {
    performance: Record<string, number>;
    collective: Record<string, number>;
    safety: Record<string, number>;
    system: Record<string, number>;
  } {
    const latest = this.metricsBuffer[this.metricsBuffer.length - 1];
    
    if (!latest) {
      return {
        performance: {},
        collective: {},
        safety: {},
        system: {}
      };
    }

    return {
      performance: {
        fps: latest.averageFPS,
        oscillators: latest.oscillatorCount,
        audioLatency: latest.audioLatency,
        errorRate: latest.errorRate
      },
      collective: {
        participants: latest.participantCount,
        coherence: latest.globalCoherence,
        fieldStrength: latest.fieldStrength,
        networkLatency: latest.averageNetworkLatency,
        packetLoss: latest.packetLoss
      },
      safety: {
        score: latest.safetyScore,
        violations: latest.criticalViolations,
        sessionDuration: latest.sessionDuration
      },
      system: {
        cpu: latest.cpuUsage,
        memory: latest.memoryUsageMB,
        engagement: latest.userEngagement
      }
    };
  }

  /**
   * Start automatic flush to prevent buffer overflow
   */
  private startAutoFlush(): void {
    this.flushInterval = setInterval(() => {
      if (this.metricsBuffer.length > 0 || this.eventsBuffer.length > 0) {
        this.flush();
      }
    }, this.flushIntervalMs);
  }

  /**
   * Flush metrics and events (in production, this would send to Prometheus/logging service)
   */
  flush(): void {
    if (this.metricsBuffer.length === 0 && this.eventsBuffer.length === 0) return;

    console.log(`📊 Flushing ${this.metricsBuffer.length} metrics and ${this.eventsBuffer.length} events`);
    
    // In production, send to actual telemetry service
    this.sendToTelemetryService(this.metricsBuffer, this.eventsBuffer);
    
    // Clear buffers
    this.metricsBuffer = [];
    this.eventsBuffer = [];
  }

  /**
   * Send to telemetry service (placeholder)
   */
  private sendToTelemetryService(metrics: GAATelemetryMetrics[], events: TelemetryEvent[]): void {
    // In production, this would send to:
    // - Prometheus for metrics
    // - Elasticsearch/Loki for events
    // - Custom analytics service
    
    console.log('📊 Telemetry data sent:', {
      metricsCount: metrics.length,
      eventsCount: events.length,
      timeRange: {
        start: metrics[0]?.sessionDuration || 0,
        end: metrics[metrics.length - 1]?.sessionDuration || 0
      }
    });
  }

  /**
   * Enable/disable telemetry
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`📊 Telemetry ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get telemetry status
   */
  getStatus(): {
    enabled: boolean;
    metricsBuffered: number;
    eventsBuffered: number;
    countersCount: number;
    gaugesCount: number;
    histogramsCount: number;
    summariesCount: number;
  } {
    return {
      enabled: this.isEnabled,
      metricsBuffered: this.metricsBuffer.length,
      eventsBuffered: this.eventsBuffer.length,
      countersCount: this.counters.size,
      gaugesCount: this.gauges.size,
      histogramsCount: this.histograms.size,
      summariesCount: this.summaries.size
    };
  }

  /**
   * Destroy telemetry hooks and cleanup
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    // Final flush
    this.flush();
    
    // Clear all data
    this.metricsBuffer = [];
    this.eventsBuffer = [];
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.summaries.clear();
    
    console.log('📊 Telemetry Hooks destroyed');
  }
}
