import { useState, useEffect, useRef, useCallback } from 'react';

const SIMULATED_BPM = 75;
const SAMPLES_PER_SECOND = 30;
const BUFFER_SIZE = SAMPLES_PER_SECOND * 5; // 5 seconds of data

/**
 * Simulates a phone-based PPG heart rate sensor.
 * In a real implementation, this would use the camera and flash to detect
 * subtle changes in finger color. Here, we generate a noisy sine wave
 * to mimic the blood pulse waveform.
 */
export const usePhonePulseSensor = () => {
  const [bpm, setBpm] = useState<number>(0);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [isSensing, setIsSensing] = useState<boolean>(false);
  const lastPeakTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const waveformBufferRef = useRef<number[]>([]);

  const processSignal = useCallback(() => {
    // 1. Generate a new sample for the simulated waveform
    const time = Date.now() / 1000;
    const pulseSignal = Math.sin(time * (SIMULATED_BPM / 60) * 2 * Math.PI);
    const noise = (Math.random() - 0.5) * 0.2;
    const newSample = pulseSignal + noise;

    // 2. Add to buffer
    const buffer = waveformBufferRef.current;
    buffer.push(newSample);
    if (buffer.length > BUFFER_SIZE) {
      buffer.shift();
    }
    setWaveform([...buffer]);

    // 3. Simple peak detection to estimate BPM
    // This is a naive implementation. A real one would use a more robust
    // algorithm like a sliding window filter and FFT.
    if (buffer.length > 2 && buffer[buffer.length-2] > buffer[buffer.length-3] && buffer[buffer.length-2] > newSample) {
        const peakTime = Date.now();
        if (lastPeakTimeRef.current > 0) {
            const timeSinceLastPeak = peakTime - lastPeakTimeRef.current; // in ms
            const estimatedBpm = 60000 / timeSinceLastPeak;

            // Apply a simple low-pass filter to smooth the BPM readings
            setBpm(prevBpm => (prevBpm * 0.9) + (estimatedBpm * 0.1));
        }
        lastPeakTimeRef.current = peakTime;
    }
  }, []);

  const startSensing = useCallback(() => {
    if (intervalRef.current) return;
    console.log('📷 Starting simulated phone pulse sensor...');
    setIsSensing(true);
    lastPeakTimeRef.current = 0; // Reset on start
    intervalRef.current = setInterval(processSignal, 1000 / SAMPLES_PER_SECOND);
  }, [processSignal]);

  const stopSensing = useCallback(() => {
    if (intervalRef.current) {
      console.log('📷 Stopping simulated phone pulse sensor...');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSensing(false);
    setBpm(0);
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => stopSensing();
  }, [stopSensing]);

  return {
    bpm,
    waveform,
    isSensing,
    startSensing,
    stopSensing,
  };
};
