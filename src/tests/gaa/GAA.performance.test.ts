import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GeometricOscillator, GeometricOscillatorConfig } from '@/utils/gaa/GeometricOscillator';
import { SafetySystem } from '@/utils/gaa/SafetySystem';
import { MultiScaleLayerManager } from '@/utils/gaa/MultiScaleLayerManager';
import { ShadowEngine } from '@/dsp/ShadowEngine';
import { GaaBiofeedbackSimulator } from '@/utils/biofeedback/GaaBiofeedbackSimulator';

// Mock Web Audio API for testing
class MockAudioContext {
  createOscillator = vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 440 },
    type: 'sine'
  }));
  createGain = vi.fn(() => ({
    connect: vi.fn(),
    gain: { value: 1 }
  }));
  createAnalyser = vi.fn(() => ({
    connect: vi.fn(),
    getByteFrequencyData: vi.fn(),
    frequencyBinCount: 1024
  }));
  destination = {};
}

describe.skip('GAA Performance Tests', () => {
  let audioContext: MockAudioContext;
  let geometricOscillator: GeometricOscillator;
  let safetySystem: SafetySystem;
  let layerManager: MultiScaleLayerManager;
  let shadowEngine: ShadowEngine;
  let biofeedback: GaaBiofeedbackSimulator;

  beforeEach(() => {
    audioContext = new MockAudioContext();
    global.AudioContext = vi.fn(() => audioContext) as any;
    
    const config: GeometricOscillatorConfig = {
      baseFrequency: 220,
      gainLevel: 0.7,
      waveform: 'sine',
      modulationDepth: 0.2,
      spatialPanning: true
    };

    geometricOscillator = new GeometricOscillator(audioContext as any, config);
    safetySystem = new SafetySystem();
    layerManager = new MultiScaleLayerManager();
    shadowEngine = new ShadowEngine({
      label: 'Test',
      params: {
        R: 1, r: 0.5, n: 3, phi0: 0,
        omega: 1, eta: 0.1,
        kappaRef: 0.5, tauRef: 1,
        alpha: [0.1, 0.2, 0.3, 0.4],
        beta: [0.5, 0.6],
        gamma: [0.7, 0.8],
        Lmin: 0, Lmax: 1
      },
      polarity: {
        polarityEnabled: false,
        shadowMode: false,
        darkWeight: 0.7,
        lightWeight: 0.3,
        darkEnergyEnabled: false,
        darkEnergy: { driftRate: 0, depth: 0 },
        manifestDarkPhase: { duration: 0, intensity: 0, curve: "linear" }
      }
    });
    biofeedback = new GaaBiofeedbackSimulator();
  });

  afterEach(() => {
    biofeedback.stopSession();
  });

  describe('Oscillator Performance Limits', () => {
    it('should handle maximum oscillator count (32)', () => {
      const maxOscillators = 32;
      const geometries = Array(maxOscillators).fill(null).map((_, i) => ({
        vertices: [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
        faces: [[0, 1, 2]],
        normals: [[0, 0, 1], [0, 0, 1], [0, 0, 1]],
        center: [0, 0, 0] as [number, number, number],
        radius: 0.5,
        sacredRatios: { phi: 1.618, pi: Math.PI, sqrt2: 1.414 }
      }));

      // Create oscillators up to the limit
      geometries.forEach((geom, i) => {
        const id = `test-osc-${i}`;
        geometricOscillator.createGeometricOscillator(geom, id);
      });

      expect(geometricOscillator.getActiveCount()).toBe(maxOscillators);
      
      // Attempting to create more should not exceed the limit
      const extraGeom = geometries[0];
      geometricOscillator.createGeometricOscillator(extraGeom, 'extra-osc');
      expect(geometricOscillator.getActiveCount()).toBeLessThanOrEqual(maxOscillators);
    });

    it('should maintain performance under heavy load', () => {
      const startTime = performance.now();
      
      // Simulate heavy geometry generation
      for (let i = 0; i < 1000; i++) {
        layerManager.updateBreathPhase(0.016); // 60fps
        const geometries = layerManager.generateCompositeGeometry(8);
        
        geometries.forEach((geom, j) => {
          const coreFrame = {
            f0: 220, A0: 0.8, fc0: 1200,
            ThN: 0.5, PhiN: 0.5, kN: 0.5, tN: 0.5,
            dThNdt: 0, az: 0, el: 0
          };
          
          const bioSignals = { breath: 0, hrv: 0.5, eegBandRatio: 0.5 };
          shadowEngine.step(0.016, coreFrame, bioSignals);
        });
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete 1000 iterations in reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000);
    });

    it('should properly clean up oscillator resources', () => {
      const geometries = Array(10).fill(null).map((_, i) => ({
        vertices: [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
        faces: [[0, 1, 2]],
        normals: [[0, 0, 1], [0, 0, 1], [0, 0, 1]],
        center: [0, 0, 0] as [number, number, number],
        radius: 0.5,
        sacredRatios: { phi: 1.618, pi: Math.PI, sqrt2: 1.414 }
      }));

      // Create oscillators
      geometries.forEach((geom, i) => {
        geometricOscillator.createGeometricOscillator(geom, `test-${i}`);
      });

      expect(geometricOscillator.getActiveCount()).toBe(10);

      // Stop all oscillators
      geometricOscillator.stopAll();
      expect(geometricOscillator.getActiveCount()).toBe(0);
    });
  });

  describe('Safety System Performance', () => {
    it('should process safety checks efficiently', () => {
      safetySystem.startMonitoring();
      
      const startTime = performance.now();
      
      // Simulate 1000 safety checks
      for (let i = 0; i < 1000; i++) {
        safetySystem.updatePerformanceMetrics(Math.random(), Math.random() * 100);
        safetySystem.applySafetyCorrections();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Safety checks should be very fast (< 100ms for 1000 checks)
      expect(duration).toBeLessThan(100);
      
      safetySystem.stopMonitoring();
    });

    it('should maintain threshold accuracy under load', () => {
      safetySystem.startMonitoring();
      
      // Test with dangerous audio levels
      const mockAnalyser = {
        frequencyBinCount: 1024,
        getByteFrequencyData: vi.fn((array) => {
          // Simulate high audio levels (dangerous)
          array.fill(250); // Close to max (255)
        })
      } as any;
      
      safetySystem.updateAudioMetrics(mockAnalyser, 1000); // High frequency
      
      const corrections = safetySystem.applySafetyCorrections();
      expect(corrections.audioReduction).toBeLessThan(1.0);
      expect(corrections.pauseRequired).toBe(false); // Should reduce, not pause
      
      safetySystem.stopMonitoring();
    });
  });

  describe('Biofeedback Integration Performance', () => {
    it('should provide consistent biofeedback data', () => {
      biofeedback.startSession();
      
      const readings: any[] = [];
      
      // Collect readings over time
      for (let i = 0; i < 100; i++) {
        const bioSignals = biofeedback.getBioSignals();
        readings.push(bioSignals);
        
        // Verify data structure
        expect(bioSignals).toHaveProperty('breath');
        expect(bioSignals).toHaveProperty('hrv');
        expect(bioSignals).toHaveProperty('eegBandRatio');
        
        // Verify data ranges
        expect(bioSignals.breath).toBeGreaterThanOrEqual(-1);
        expect(bioSignals.breath).toBeLessThanOrEqual(1);
        expect(bioSignals.hrv).toBeGreaterThanOrEqual(0);
        expect(bioSignals.hrv).toBeLessThanOrEqual(100);
      }
      
      // Verify readings are changing (not static)
      const hrvValues = readings.map(r => r.hrv);
      const uniqueHrvValues = new Set(hrvValues);
      expect(uniqueHrvValues.size).toBeGreaterThan(1);
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory during oscillator lifecycle', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Create and destroy oscillators repeatedly
      for (let cycle = 0; cycle < 50; cycle++) {
        const geometries = Array(20).fill(null).map((_, i) => ({
          vertices: [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
          faces: [[0, 1, 2]],
          normals: [[0, 0, 1], [0, 0, 1], [0, 0, 1]],
          center: [0, 0, 0] as [number, number, number],
          radius: 0.5,
          sacredRatios: { phi: 1.618, pi: Math.PI, sqrt2: 1.414 }
        }));

        geometries.forEach((geom, i) => {
          geometricOscillator.createGeometricOscillator(geom, `cycle-${cycle}-${i}`);
        });

        geometricOscillator.stopAll();
      }
      
      // Force garbage collection if available
      if ((global as any).gc) {
        (global as any).gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Memory should not have grown significantly (allow 10MB growth)
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryGrowth = finalMemory - initialMemory;
        expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024); // 10MB
      }
    });
  });
});