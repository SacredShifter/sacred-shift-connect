import { useEffect, useRef, useState } from "react";
import { BioSignals, GaaCoreFrame, GaaOutputs, GaaPreset, ShadowEngineState } from "@/types/gaa";
import { ShadowEngine } from "@/dsp/ShadowEngine";
import { BiofeedbackManager } from "@/utils/biofeedback/BiofeedbackManager";
import { MultiScaleLayerManager } from "@/utils/gaa/MultiScaleLayerManager";

export function useShadowEngine(preset: GaaPreset) {
  const engineRef = useRef<ShadowEngine>();
  const biofeedbackRef = useRef<BiofeedbackManager>();
  const layerManagerRef = useRef<MultiScaleLayerManager>();
  const [state, setState] = useState<ShadowEngineState | null>(null);
  const [outputs, setOutputs] = useState<GaaOutputs | null>(null);

  // Initialize systems
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new ShadowEngine(preset);
      biofeedbackRef.current = new BiofeedbackManager();
      layerManagerRef.current = new MultiScaleLayerManager();
      
      // Start biofeedback streaming
      biofeedbackRef.current.startStreaming();
    } else {
      engineRef.current.setPreset(preset);
    }
  }, [preset]);

  // Real-time processing loop with integrated systems
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      if (engineRef.current && biofeedbackRef.current && layerManagerRef.current) {
        // Get real biofeedback data
        const bioSignals = biofeedbackRef.current.getBioSignals();
        
        // Update layer manager with breath coupling
        layerManagerRef.current.updateBreathPhase(dt);
        const layerState = layerManagerRef.current.getState();
        
        // Generate real GAA core frame from multi-scale geometry
        const geometries = layerManagerRef.current.generateCompositeGeometry(8);
        const primaryGeometry = geometries[0];
        
        if (primaryGeometry) {
          const gaaCore: GaaCoreFrame = {
            ThN: (layerState.breathPhase / (2 * Math.PI)) % 1,
            PhiN: primaryGeometry.sacredRatios.phi - Math.floor(primaryGeometry.sacredRatios.phi),
            kN: primaryGeometry.radius,
            tN: layerState.globalCoherence,
            dThNdt: layerState.layerSyncRatio * 0.1,
            az: primaryGeometry.center[0] * Math.PI,
            el: primaryGeometry.center[1] * Math.PI / 2,
            f0: 220 * Math.pow(primaryGeometry.sacredRatios.phi, primaryGeometry.radius - 0.5),
            A0: 0.3 * layerState.globalCoherence,
            fc0: 1000 * (1 + primaryGeometry.radius * 0.5)
          };
          
          // Step the shadow engine with real data
          const out = engineRef.current.step(dt, gaaCore, bioSignals);
          setOutputs(out);
          setState(engineRef.current.snapshot());
        }
      }
      
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    
    return () => {
      cancelAnimationFrame(raf);
      // Cleanup biofeedback streaming
      if (biofeedbackRef.current) {
        biofeedbackRef.current.stopStreaming();
      }
    };
  }, []);

  return { 
    engine: engineRef, 
    state, 
    outputs,
    biofeedbackManager: biofeedbackRef.current,
    layerManager: layerManagerRef.current
  };
}