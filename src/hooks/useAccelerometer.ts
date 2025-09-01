import { useState, useEffect, useCallback } from 'react';

// This is a very simplified approach to motion-based HR estimation.
// A real implementation would require more sophisticated signal processing.
const SAMPLE_RATE = 10; // Hz
const BUFFER_SIZE = SAMPLE_RATE * 5; // 5 seconds of data

export const useAccelerometer = () => {
  const [bpm, setBpm] = useState<number>(0);
  const [isSensing, setIsSensing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dataBuffer = useRef<number[]>([]);
  const lastTimestamp = useRef<number>(0);

  const handleMotionEvent = useCallback((event: DeviceMotionEvent) => {
    if (!event.acceleration) {
      return;
    }

    const now = Date.now();
    if (now - lastTimestamp.current < 1000 / SAMPLE_RATE) {
      return; // Downsample
    }
    lastTimestamp.current = now;

    const { x, y, z } = event.acceleration;
    if (x === null || y === null || z === null) return;

    // Calculate the magnitude of the acceleration vector
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    dataBuffer.current.push(magnitude);

    if (dataBuffer.current.length > BUFFER_SIZE) {
      dataBuffer.current.shift();

      // Simple peak detection on the acceleration data
      // This is a naive way to estimate BPM from motion
      const peaks = findPeaks(dataBuffer.current);
      if (peaks.length > 1) {
        const timeBetweenPeaks = (peaks[1] - peaks[0]) / SAMPLE_RATE;
        const estimatedBpm = 60 / timeBetweenPeaks;

        if(estimatedBpm > 40 && estimatedBpm < 180) { // Plausible range for motion
             setBpm(prevBpm => (prevBpm * 0.9) + (estimatedBpm * 0.1));
        }
      }
    }
  }, []);

  const startSensing = useCallback(() => {
    if (typeof DeviceMotionEvent === 'undefined') {
      setError('Device motion events are not supported on this device.');
      return;
    }

    // Request permission for motion events on iOS 13+
    // @ts-ignore
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        // @ts-ignore
        DeviceMotionEvent.requestPermission().then(permissionState => {
            if (permissionState === 'granted') {
                window.addEventListener('devicemotion', handleMotionEvent);
                setIsSensing(true);
            } else {
                setError('Permission not granted for device motion.');
            }
        });
    } else {
        window.addEventListener('devicemotion', handleMotionEvent);
        setIsSensing(true);
    }
  }, [handleMotionEvent]);

  const stopSensing = useCallback(() => {
    window.removeEventListener('devicemotion', handleMotionEvent);
    setIsSensing(false);
    setBpm(0);
    dataBuffer.current = [];
  }, [handleMotionEvent]);

  useEffect(() => {
    return () => stopSensing();
  }, [stopSensing]);

  return { bpm, isSensing, error, startSensing, stopSensing };
};

// Helper function to find peaks in an array
function findPeaks(data: number[]): number[] {
  const peaks: number[] = [];
  for (let i = 1; i < data.length - 1; i++) {
    if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
      peaks.push(i);
    }
  }
  return peaks;
}
