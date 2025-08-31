import { useEffect, useRef, useState } from "react";
import { BioSignals, GaaCoreFrame, GaaOutputs, GaaPreset, ShadowEngineState } from "@/types/gaa";
import { ShadowEngine } from "@/dsp/ShadowEngine";

export function useShadowEngine(preset: GaaPreset) {
  const engineRef = useRef<ShadowEngine>();
  const [state, setState] = useState<ShadowEngineState | null>(null);
  const [outputs, setOutputs] = useState<GaaOutputs | null>(null);

  // create / update engine instance
  useEffect(() => {
    if (!engineRef.current) engineRef.current = new ShadowEngine(preset);
    else engineRef.current.setPreset(preset);
  }, [preset]);

  // ticking (demo: 60fps with stubbed core/bio signals)
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    // Replace with your real GAA core & biosignals:
    const fakeCore: GaaCoreFrame = {
      ThN: 0.5, PhiN: 0.5, kN: 0.5, tN: 0.5,
      dThNdt: 0.02, az: 0, el: 0, f0: 220, A0: 0.3, fc0: 1000
    };
    const fakeBio: BioSignals = { breath: 0 };

    const loop = (now:number) => {
      const dt = (now - last)/1000;
      last = now;
      if (engineRef.current) {
        const out = engineRef.current.step(dt, fakeCore, fakeBio);
        setOutputs(out);
        setState(engineRef.current.snapshot());
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return { engine: engineRef, state, outputs };
}