import { useState, useEffect, useRef, useCallback } from 'react';

const SAMPLES_PER_SECOND = 30;
const BUFFER_SECONDS = 5;
const BUFFER_SIZE = SAMPLES_PER_SECOND * BUFFER_SECONDS;

export type SignalQuality = 'good' | 'weak' | 'no_signal';

export const usePhonePulseSensor = () => {
  const [bpm, setBpm] = useState<number>(0);
  const [signalQuality, setSignalQuality] = useState<SignalQuality>('no_signal');
  const [isSensing, setIsSensing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const waveformBufferRef = useRef<number[]>([]);
  const lastPeakTimeRef = useRef<number>(0);
  const bpmHistoryRef = useRef<number[]>([]);
  const noSignalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const processSignal = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context) {
        setError("Could not get 2D context from canvas");
        return;
    }

    // Draw the video frame to the canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data from the center of the canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let r = 0, g = 0, b = 0;

    // Average the color of all pixels (simple approach)
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }
    const pixelCount = data.length / 4;
    // We are interested in the red channel, as it's most sensitive to blood flow changes
    const redIntensity = r / pixelCount;

    // Add to buffer
    const buffer = waveformBufferRef.current;
    buffer.push(redIntensity);
    if (buffer.length > BUFFER_SIZE) {
      buffer.shift();
    }

    // Naive peak detection (same as the simulation, but on real data)
    if (buffer.length > 2 && buffer[buffer.length-2] > buffer[buffer.length-3] && buffer[buffer.length-2] > buffer[buffer.length-1]) {
        const peakTime = Date.now();
        if (lastPeakTimeRef.current > 0) {
            const timeSinceLastPeak = peakTime - lastPeakTimeRef.current;
            if (timeSinceLastPeak > 400 && timeSinceLastPeak < 2000) { // 30-150 BPM range
                const estimatedBpm = 60000 / timeSinceLastPeak;
                setBpm(prevBpm => (prevBpm * 0.9) + (estimatedBpm * 0.1)); // Smooth the reading

                // Update signal quality based on BPM variance
                const history = bpmHistoryRef.current;
                history.push(estimatedBpm);
                if (history.length > 10) history.shift();

                if (history.length > 5) {
                    const mean = history.reduce((a, b) => a + b, 0) / history.length;
                    const variance = history.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / history.length;
                    setSignalQuality(variance < 5 ? 'good' : 'weak');
                }
            }
        }
        lastPeakTimeRef.current = peakTime;
        // Reset no-signal timer
        if (noSignalTimeoutRef.current) clearTimeout(noSignalTimeoutRef.current);
        noSignalTimeoutRef.current = setTimeout(() => setSignalQuality('no_signal'), 2000);
    }
  }, []);


  const startSensing = useCallback(async () => {
    if (isSensing) return;

    try {
        setError(null);
        setIsSensing(true);
        console.log('📷 Starting phone pulse sensor...');

        // Create video and canvas elements if they don't exist
        if (!videoRef.current) videoRef.current = document.createElement('video');
        if (!canvasRef.current) canvasRef.current = document.createElement('canvas');

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Use rear camera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        streamRef.current = stream;

        const video = videoRef.current;
        video.srcObject = stream;
        video.play();

        // Attempt to turn on the flash
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        // @ts-ignore
        if (capabilities.torch) {
            try {
                // @ts-ignore
                await track.applyConstraints({ advanced: [{ torch: true }] });
            } catch (err) {
                console.warn("Could not enable torch:", err);
            }
        } else {
            console.warn("Flash/torch not available on this device.");
        }

        lastPeakTimeRef.current = 0;
        intervalRef.current = setInterval(processSignal, 1000 / SAMPLES_PER_SECOND);

    } catch (err: any) {
        console.error("Error starting pulse sensor:", err);
        setError(`Could not start sensor: ${err.message}. Make sure you have given camera permissions.`);
        stopSensing();
    }
  }, [isSensing, processSignal]);

  const stopSensing = useCallback(() => {
    if (!isSensing) return;
    console.log('📷 Stopping phone pulse sensor...');

    if (noSignalTimeoutRef.current) {
        clearTimeout(noSignalTimeoutRef.current);
        noSignalTimeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
        // Turn off flash
        const track = streamRef.current.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        // @ts-ignore
        if (capabilities.torch) {
            try {
                // @ts-ignore
                track.applyConstraints({ advanced: [{ torch: false }] });
            } catch (err) {
                console.warn("Could not disable torch:", err);
            }
        }
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }

    setIsSensing(false);
    setBpm(0);
    waveformBufferRef.current = [];
  }, [isSensing]);

  useEffect(() => {
    // Cleanup on unmount
    return () => stopSensing();
  }, [stopSensing]);

  return {
    bpm,
    isSensing,
    error,
    signalQuality,
    startSensing,
    stopSensing,
  };
};
