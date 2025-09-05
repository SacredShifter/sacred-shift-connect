/**
 * Comprehensive Monitoring and Analytics
 * Provides production-ready monitoring, performance tracking, and user analytics
 */

import { logger } from './logger';

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  init() {
    this.setupPerformanceObservers();
    this.setupErrorTracking();
    this.setupUserInteractionTracking();
  }

  private setupPerformanceObservers() {
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP - Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.set('lcp', lastEntry.startTime);
        logger.info('LCP measured', { 
          component: 'PerformanceMonitor',
          function: 'setupPerformanceObservers',
          metadata: { lcp: lastEntry.startTime }
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // FID - First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.set('fid', entry.processingStart - entry.startTime);
          logger.info('FID measured', { 
            component: 'PerformanceMonitor',
            function: 'setupPerformanceObservers',
            metadata: { fid: entry.processingStart - entry.startTime }
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // CLS - Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.set('cls', clsValue);
            logger.info('CLS measured', { 
              component: 'PerformanceMonitor',
              function: 'setupPerformanceObservers',
              metadata: { cls: clsValue }
            });
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  private setupErrorTracking() {
    // Global error handler
    window.addEventListener('error', (event) => {
      logger.error('Global error caught', {
        component: 'PerformanceMonitor',
        function: 'setupErrorTracking',
        metadata: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.stack
        }
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      logger.error('Unhandled promise rejection', {
        component: 'PerformanceMonitor',
        function: 'setupErrorTracking',
        metadata: {
          reason: event.reason,
          promise: event.promise
        }
      });
    });
  }

  private setupUserInteractionTracking() {
    // Track user interactions
    const trackInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target) {
        logger.debug('User interaction tracked', {
          component: 'PerformanceMonitor',
          function: 'setupUserInteractionTracking',
          metadata: {
            type: event.type,
            tagName: target.tagName,
            className: target.className,
            id: target.id
          }
        });
      }
    };

    // Track clicks, form submissions, and navigation
    document.addEventListener('click', trackInteraction);
    document.addEventListener('submit', trackInteraction);
    window.addEventListener('popstate', trackInteraction);
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// User analytics
export class UserAnalytics {
  private static instance: UserAnalytics;
  private sessionId: string;
  private userId?: string;
  private events: Array<{ event: string; data: any; timestamp: number }> = [];

  static getInstance(): UserAnalytics {
    if (!UserAnalytics.instance) {
      UserAnalytics.instance = new UserAnalytics();
    }
    return UserAnalytics.instance;
  }

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  track(event: string, data: any = {}) {
    const eventData = {
      event,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.events.push(eventData);

    logger.info('User event tracked', {
      component: 'UserAnalytics',
      function: 'track',
      metadata: eventData
    });

    // Send to analytics service (implement based on your analytics provider)
    this.sendToAnalytics(eventData);
  }

  private sendToAnalytics(eventData: any) {
    // Implement your analytics service integration here
    // Examples: Google Analytics, Mixpanel, Amplitude, etc.
    console.log('Analytics event:', eventData);
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }
}

// Resource monitoring
export class ResourceMonitor {
  private static instance: ResourceMonitor;
  private memoryUsage: number[] = [];
  private cpuUsage: number[] = [];

  static getInstance(): ResourceMonitor {
    if (!ResourceMonitor.instance) {
      ResourceMonitor.instance = new ResourceMonitor();
    }
    return ResourceMonitor.instance;
  }

  startMonitoring() {
    setInterval(() => {
      this.measureMemoryUsage();
      this.measureCPUUsage();
    }, 5000); // Check every 5 seconds
  }

  private measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize / 1024 / 1024; // MB
      this.memoryUsage.push(used);
      
      // Keep only last 100 measurements
      if (this.memoryUsage.length > 100) {
        this.memoryUsage.shift();
      }

      // Alert if memory usage is high
      if (used > 100) { // 100MB threshold
        logger.warn('High memory usage detected', {
          component: 'ResourceMonitor',
          function: 'measureMemoryUsage',
          metadata: { memoryUsage: used, threshold: 100 }
        });
      }
    }
  }

  private measureCPUUsage() {
    // Simple CPU usage estimation based on main thread blocking
    const start = performance.now();
    setTimeout(() => {
      const end = performance.now();
      const duration = end - start;
      const cpuUsage = Math.max(0, 100 - (duration / 10)); // Rough estimation
      this.cpuUsage.push(cpuUsage);
      
      // Keep only last 100 measurements
      if (this.cpuUsage.length > 100) {
        this.cpuUsage.shift();
      }
    }, 0);
  }

  getMemoryUsage() {
    return {
      current: this.memoryUsage[this.memoryUsage.length - 1] || 0,
      average: this.memoryUsage.reduce((a, b) => a + b, 0) / this.memoryUsage.length || 0,
      max: Math.max(...this.memoryUsage) || 0
    };
  }

  getCPUUsage() {
    return {
      current: this.cpuUsage[this.cpuUsage.length - 1] || 0,
      average: this.cpuUsage.reduce((a, b) => a + b, 0) / this.cpuUsage.length || 0,
      max: Math.max(...this.cpuUsage) || 0
    };
  }
}

// Business metrics
export class BusinessMetrics {
  private static instance: BusinessMetrics;
  private metrics: Map<string, number> = new Map();

  static getInstance(): BusinessMetrics {
    if (!BusinessMetrics.instance) {
      BusinessMetrics.instance = new BusinessMetrics();
    }
    return BusinessMetrics.instance;
  }

  trackUserJourney(step: string, data: any = {}) {
    const count = this.metrics.get(step) || 0;
    this.metrics.set(step, count + 1);

    logger.info('User journey step tracked', {
      component: 'BusinessMetrics',
      function: 'trackUserJourney',
      metadata: { step, data, count: count + 1 }
    });
  }

  trackFeatureUsage(feature: string) {
    const count = this.metrics.get(`feature_${feature}`) || 0;
    this.metrics.set(`feature_${feature}`, count + 1);

    logger.info('Feature usage tracked', {
      component: 'BusinessMetrics',
      function: 'trackFeatureUsage',
      metadata: { feature, count: count + 1 }
    });
  }

  trackError(error: string, context: any = {}) {
    const count = this.metrics.get(`error_${error}`) || 0;
    this.metrics.set(`error_${error}`, count + 1);

    logger.error('Error tracked', {
      component: 'BusinessMetrics',
      function: 'trackError',
      metadata: { error, context, count: count + 1 }
    });
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

// Initialize monitoring
export const initializeMonitoring = () => {
  const performanceMonitor = PerformanceMonitor.getInstance();
  const userAnalytics = UserAnalytics.getInstance();
  const resourceMonitor = ResourceMonitor.getInstance();
  const businessMetrics = BusinessMetrics.getInstance();

  performanceMonitor.init();
  resourceMonitor.startMonitoring();

  logger.info('Monitoring initialized', {
    component: 'Monitoring',
    function: 'initializeMonitoring',
    metadata: {
      performanceMonitoring: true,
      userAnalytics: true,
      resourceMonitoring: true,
      businessMetrics: true
    }
  });

  return {
    performanceMonitor,
    userAnalytics,
    resourceMonitor,
    businessMetrics
  };
};
