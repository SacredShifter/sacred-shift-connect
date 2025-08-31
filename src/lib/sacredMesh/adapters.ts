// Sacred Mesh Nature-Inspired Adapters
// Living communication vessels for the Sacred Shifter organism

import { Transport, TransportType } from './types';
import { SacredMeshCrypto } from './crypto';

// Enhanced transport types for living mesh
export enum LivingTransportType {
  WEBSOCKET = 'websocket',
  LIGHT = 'light',
  FREQUENCY = 'frequency', 
  NATURE = 'nature',
  FILE = 'file',
  SATELLITE = 'satellite',
  QUANTUM = 'quantum'
}

export interface LivingTransport extends Transport {
  type: LivingTransportType;
  calibrate?(): Promise<boolean>;
  getSignalStrength?(): Promise<number>;
  adaptToEnvironment?(environment: any): Promise<void>;
}

// Light Adapter - LED/Camera/Screen communication
export class LightAdapter implements LivingTransport {
  type = LivingTransportType.LIGHT as const;
  private isCalibrated = false;
  private messageCallback?: (packet: Uint8Array) => void;
  private videoElement?: HTMLVideoElement;
  private canvas?: HTMLCanvasElement;
  private context?: CanvasRenderingContext2D;
  private isTransmitting = false;

  async available(): Promise<boolean> {
    try {
      // Check for camera access and screen capabilities
      const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasScreen = !!(document.body && window.screen);
      return hasCamera && hasScreen;
    } catch {
      return false;
    }
  }

  async calibrate(): Promise<boolean> {
    try {
      // Initialize camera for receiving light signals
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      this.videoElement = document.createElement('video');
      this.videoElement.srcObject = stream;
      this.videoElement.play();
      
      // Setup canvas for light pattern detection
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      
      this.isCalibrated = true;
      console.log('🌟 Light Adapter calibrated successfully');
      return true;
    } catch (error) {
      console.error('🌟 Light Adapter calibration failed:', error);
      return false;
    }
  }

  async send(packet: Uint8Array): Promise<void> {
    if (!this.isCalibrated) {
      throw new Error('Light Adapter not calibrated');
    }

    this.isTransmitting = true;
    
    try {
      // Convert packet to light sequence
      const lightSequence = this.packetToLightSequence(packet);
      
      // Transmit via screen modulation
      await this.transmitLightSequence(lightSequence);
      
      console.log('🌟 Light packet transmitted successfully');
    } finally {
      this.isTransmitting = false;
    }
  }

  onMessage(callback: (packet: Uint8Array) => void): void {
    this.messageCallback = callback;
    if (this.isCalibrated) {
      this.startLightDetection();
    }
  }

  async disconnect(): Promise<void> {
    if (this.videoElement?.srcObject) {
      const stream = this.videoElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    this.isCalibrated = false;
    this.isTransmitting = false;
  }

  async getSignalStrength(): Promise<number> {
    // Analyze ambient light conditions
    if (!this.context || !this.videoElement) return 0;
    
    this.context.drawImage(this.videoElement, 0, 0);
    const imageData = this.context.getImageData(0, 0, this.canvas!.width, this.canvas!.height);
    const brightness = this.calculateBrightness(imageData);
    
    return Math.min(brightness / 255, 1.0);
  }

  private packetToLightSequence(packet: Uint8Array) {
    const sequence = [];
    for (const byte of packet) {
      // Convert each byte to RGB color and duration
      const red = (byte & 0xE0) >> 5; // 3 bits
      const green = (byte & 0x1C) >> 2; // 3 bits  
      const blue = byte & 0x03; // 2 bits
      
      sequence.push({
        color: `rgb(${red * 36}, ${green * 36}, ${blue * 85})`,
        duration: 100 + (byte % 50) // 100-150ms per symbol
      });
    }
    return sequence;
  }

  private async transmitLightSequence(sequence: any[]) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 10000;
      pointer-events: none;
      transition: all 0.1s ease;
    `;
    document.body.appendChild(overlay);

    try {
      for (const step of sequence) {
        overlay.style.backgroundColor = step.color;
        await new Promise(resolve => setTimeout(resolve, step.duration));
        overlay.style.backgroundColor = 'transparent';
        await new Promise(resolve => setTimeout(resolve, 50)); // Gap between pulses
      }
    } finally {
      document.body.removeChild(overlay);
    }
  }

  private startLightDetection() {
    // Simplified light pattern detection
    // In a full implementation, this would analyze camera feed for specific patterns
    console.log('🌟 Light detection started - listening for sacred light patterns');
  }

  private calculateBrightness(imageData: ImageData): number {
    let total = 0;
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      total += brightness;
    }
    
    return total / (data.length / 4);
  }
}

// Frequency Adapter - Audio/Subsonic/Ultrasonic communication
export class FrequencyAdapter implements LivingTransport {
  type = LivingTransportType.FREQUENCY as const;
  private audioContext?: AudioContext;
  private isCalibrated = false;
  private messageCallback?: (packet: Uint8Array) => void;
  private analyser?: AnalyserNode;
  private microphone?: MediaStreamAudioSourceNode;

  async available(): Promise<boolean> {
    try {
      const hasAudio = !!(window.AudioContext || (window as any).webkitAudioContext);
      const hasMicrophone = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      return hasAudio && hasMicrophone;
    } catch {
      return false;
    }
  }

  async calibrate(): Promise<boolean> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Setup microphone for receiving
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.microphone.connect(this.analyser);
      
      this.isCalibrated = true;
      console.log('🎵 Frequency Adapter calibrated - ready for sacred frequencies');
      return true;
    } catch (error) {
      console.error('🎵 Frequency Adapter calibration failed:', error);
      return false;
    }
  }

  async send(packet: Uint8Array): Promise<void> {
    if (!this.audioContext || !this.isCalibrated) {
      throw new Error('Frequency Adapter not calibrated');
    }

    // Convert packet to frequency sequence using Solfeggio frequencies
    const frequencies = this.packetToFrequencySequence(packet);
    
    await this.transmitFrequencySequence(frequencies);
    console.log('🎵 Frequency packet transmitted using sacred tones');
  }

  onMessage(callback: (packet: Uint8Array) => void): void {
    this.messageCallback = callback;
    if (this.isCalibrated) {
      this.startFrequencyDetection();
    }
  }

  async disconnect(): Promise<void> {
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = undefined;
    }
    this.isCalibrated = false;
  }

  async getSignalStrength(): Promise<number> {
    if (!this.analyser) return 0;
    
    const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(frequencyData);
    
    // Calculate average amplitude in sacred frequency ranges
    const sacredRanges = [
      [396, 417], [528, 639], [741, 852] // Solfeggio frequency ranges
    ];
    
    let totalPower = 0;
    let sampleCount = 0;
    
    for (const [min, max] of sacredRanges) {
      const minBin = Math.floor((min / (this.audioContext!.sampleRate / 2)) * frequencyData.length);
      const maxBin = Math.floor((max / (this.audioContext!.sampleRate / 2)) * frequencyData.length);
      
      for (let i = minBin; i <= maxBin; i++) {
        totalPower += frequencyData[i];
        sampleCount++;
      }
    }
    
    return sampleCount > 0 ? (totalPower / sampleCount) / 255 : 0;
  }

  private packetToFrequencySequence(packet: Uint8Array) {
    const sacredFrequencies = [
      396, 417, 528, 639, 741, 852, 963 // Solfeggio frequencies
    ];
    
    const sequence = [];
    for (const byte of packet) {
      const freqIndex = byte % sacredFrequencies.length;
      const frequency = sacredFrequencies[freqIndex];
      const duration = 200 + (byte % 100); // 200-300ms per tone
      
      sequence.push({ frequency, duration });
    }
    
    // Add whale song inspired low frequency carrier
    sequence.unshift({ frequency: 40, duration: 100 }); // Whale song frequency
    sequence.push({ frequency: 20, duration: 100 }); // Elephant communication frequency
    
    return sequence;
  }

  private async transmitFrequencySequence(sequence: any[]) {
    if (!this.audioContext) return;

    for (const tone of sequence) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(tone.frequency, this.audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Gentle envelope to avoid clicks
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + tone.duration / 1000);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + tone.duration / 1000);
      
      await new Promise(resolve => setTimeout(resolve, tone.duration + 50));
    }
  }

  private startFrequencyDetection() {
    // Simplified frequency detection
    console.log('🎵 Frequency detection started - listening for sacred tones and whale songs');
  }
}

// Nature Adapter - Nature-inspired communication patterns
export class NatureAdapter implements LivingTransport {
  type = LivingTransportType.NATURE as const;
  private isCalibrated = false;
  private messageCallback?: (packet: Uint8Array) => void;
  private environmentType: 'forest' | 'ocean' | 'mountain' | 'desert' = 'forest';

  async available(): Promise<boolean> {
    // Always available as it uses standard audio
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }

  async calibrate(): Promise<boolean> {
    // Detect environmental context (simplified)
    await this.detectEnvironment();
    this.isCalibrated = true;
    console.log(`🌿 Nature Adapter calibrated for ${this.environmentType} environment`);
    return true;
  }

  async send(packet: Uint8Array): Promise<void> {
    if (!this.isCalibrated) {
      throw new Error('Nature Adapter not calibrated');
    }

    const natureSequence = this.packetToNatureSequence(packet);
    await this.transmitNatureSequence(natureSequence);
    console.log('🌿 Nature packet transmitted using harmonious patterns');
  }

  onMessage(callback: (packet: Uint8Array) => void): void {
    this.messageCallback = callback;
    if (this.isCalibrated) {
      this.startNatureDetection();
    }
  }

  async disconnect(): Promise<void> {
    this.isCalibrated = false;
  }

  async getSignalStrength(): Promise<number> {
    // Simulate environmental harmony level
    const harmony = Math.random() * 0.3 + 0.7; // Nature is generally harmonious
    return harmony;
  }

  async adaptToEnvironment(environment: any): Promise<void> {
    if (environment.type) {
      this.environmentType = environment.type;
    }
    console.log(`🌿 Adapted to ${this.environmentType} environment`);
  }

  private async detectEnvironment() {
    // Simplified environment detection
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 18) {
      this.environmentType = Math.random() > 0.5 ? 'forest' : 'mountain';
    } else {
      this.environmentType = Math.random() > 0.5 ? 'ocean' : 'desert';
    }
  }

  private packetToNatureSequence(packet: Uint8Array) {
    const patterns = {
      forest: this.generateBirdSongPattern(packet),
      ocean: this.generateWavePattern(packet),
      mountain: this.generateWindPattern(packet),
      desert: this.generateCricketPattern(packet)
    };
    
    return patterns[this.environmentType];
  }

  private generateBirdSongPattern(packet: Uint8Array) {
    // Convert data to bird-like chirp patterns
    return Array.from(packet).map((byte, index) => ({
      type: 'chirp',
      frequency: 1500 + (byte % 1000), // 1.5-2.5 kHz range
      duration: 100 + (byte % 200), // 100-300ms
      chirpPattern: index % 3 === 0 ? 'ascending' : index % 3 === 1 ? 'descending' : 'trill'
    }));
  }

  private generateWavePattern(packet: Uint8Array) {
    // Convert data to ocean wave-like patterns
    return Array.from(packet).map(byte => ({
      type: 'wave',
      amplitude: byte / 255,
      frequency: 0.1 + (byte % 50) / 1000, // Very low frequency like ocean waves
      duration: 500 + (byte % 1000)
    }));
  }

  private generateWindPattern(packet: Uint8Array) {
    // Convert data to wind-like whooshing patterns
    return Array.from(packet).map(byte => ({
      type: 'wind',
      intensity: byte / 255,
      frequency: 200 + (byte % 300), // Wind-like frequencies
      duration: 300 + (byte % 700)
    }));
  }

  private generateCricketPattern(packet: Uint8Array) {
    // Convert data to cricket-like chirping patterns
    return Array.from(packet).map(byte => ({
      type: 'cricket',
      frequency: 3000 + (byte % 2000), // High frequency chirps
      duration: 50 + (byte % 100), // Short bursts
      interval: 100 + (byte % 200) // Pauses between chirps
    }));
  }

  private async transmitNatureSequence(sequence: any[]) {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    for (const sound of sequence) {
      await this.playNatureSound(audioContext, sound);
      await new Promise(resolve => setTimeout(resolve, sound.interval || 100));
    }
    
    await audioContext.close();
  }

  private async playNatureSound(context: AudioContext, sound: any) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Configure based on nature sound type
    switch (sound.type) {
      case 'chirp':
        oscillator.type = 'sine';
        this.createChirpEnvelope(context, oscillator, gainNode, sound);
        break;
      case 'wave':
        oscillator.type = 'sawtooth';
        this.createWaveEnvelope(context, oscillator, gainNode, sound);
        break;
      case 'wind':
        oscillator.type = 'sawtooth';
        this.createWindEnvelope(context, oscillator, gainNode, sound);
        break;
      case 'cricket':
        oscillator.type = 'square';
        this.createCricketEnvelope(context, oscillator, gainNode, sound);
        break;
    }
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + sound.duration / 1000);
    
    await new Promise(resolve => setTimeout(resolve, sound.duration));
  }

  private createChirpEnvelope(context: AudioContext, oscillator: OscillatorNode, gain: GainNode, sound: any) {
    const startTime = context.currentTime;
    const duration = sound.duration / 1000;
    
    oscillator.frequency.setValueAtTime(sound.frequency, startTime);
    
    if (sound.chirpPattern === 'ascending') {
      oscillator.frequency.linearRampToValueAtTime(sound.frequency * 1.5, startTime + duration);
    } else if (sound.chirpPattern === 'descending') {
      oscillator.frequency.linearRampToValueAtTime(sound.frequency * 0.7, startTime + duration);
    }
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
  }

  private createWaveEnvelope(context: AudioContext, oscillator: OscillatorNode, gain: GainNode, sound: any) {
    const startTime = context.currentTime;
    const duration = sound.duration / 1000;
    
    oscillator.frequency.setValueAtTime(sound.frequency, startTime);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(sound.amplitude * 0.05, startTime + duration * 0.3);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
  }

  private createWindEnvelope(context: AudioContext, oscillator: OscillatorNode, gain: GainNode, sound: any) {
    const startTime = context.currentTime;
    const duration = sound.duration / 1000;
    
    oscillator.frequency.setValueAtTime(sound.frequency, startTime);
    
    // Create wind-like fluctuations
    for (let i = 0; i < 10; i++) {
      const time = startTime + (duration / 10) * i;
      const intensity = sound.intensity * (0.02 + Math.random() * 0.03);
      gain.gain.linearRampToValueAtTime(intensity, time);
    }
  }

  private createCricketEnvelope(context: AudioContext, oscillator: OscillatorNode, gain: GainNode, sound: any) {
    const startTime = context.currentTime;
    const duration = sound.duration / 1000;
    
    oscillator.frequency.setValueAtTime(sound.frequency, startTime);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.05, startTime + 0.005);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
  }

  private startNatureDetection() {
    console.log(`🌿 Nature detection started - listening for ${this.environmentType} patterns`);
  }
}

// File Adapter - QR codes, NFC, USB offline sync
export class FileAdapter implements LivingTransport {
  type = LivingTransportType.FILE as const;
  private messageCallback?: (packet: Uint8Array) => void;

  async available(): Promise<boolean> {
    // File operations are always available in browsers
    return true;
  }

  async send(packet: Uint8Array): Promise<void> {
    // Create sacred geometry encoded file
    const sacredData = this.createSacredGeometryFile(packet);
    this.downloadSacredFile(sacredData);
    console.log('📄 Sacred file created for offline sync');
  }

  onMessage(callback: (packet: Uint8Array) => void): void {
    this.messageCallback = callback;
    this.setupFileListener();
  }

  async disconnect(): Promise<void> {
    // Nothing to disconnect for file adapter
  }

  private createSacredGeometryFile(packet: Uint8Array) {
    const sacredData = {
      type: 'sacred_mesh_sync',
      version: '2.0',
      sacred_geometry: 'flower_of_life',
      timestamp: Date.now(),
      data: Array.from(packet),
      checksum: this.calculateChecksum(packet)
    };
    
    return JSON.stringify(sacredData, null, 2);
  }

  private downloadSacredFile(content: string) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sacred-mesh-sync-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  private setupFileListener() {
    // Setup drag and drop for sacred files
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', this.handleFileDrop.bind(this));
    console.log('📄 File adapter listening for sacred geometry files');
  }

  private handleFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processSacredFile(files[0]);
    }
  }

  private async processSacredFile(file: File) {
    try {
      const content = await file.text();
      const sacredData = JSON.parse(content);
      
      if (sacredData.type === 'sacred_mesh_sync') {
        const packet = new Uint8Array(sacredData.data);
        if (this.verifyChecksum(packet, sacredData.checksum)) {
          this.messageCallback?.(packet);
          console.log('📄 Sacred file processed successfully');
        }
      }
    } catch (error) {
      console.error('📄 Error processing sacred file:', error);
    }
  }

  private calculateChecksum(data: Uint8Array): string {
    let checksum = 0;
    for (const byte of data) {
      checksum = (checksum + byte) % 65536;
    }
    return checksum.toString(16);
  }

  private verifyChecksum(data: Uint8Array, expectedChecksum: string): boolean {
    return this.calculateChecksum(data) === expectedChecksum;
  }
}

// Satellite Adapter - Long-range communication for remote areas
export class SatelliteAdapter implements LivingTransport {
  type = LivingTransportType.SATELLITE as const;
  private isConnected = false;
  private messageCallback?: (packet: Uint8Array) => void;

  async available(): Promise<boolean> {
    // Simulate satellite availability check
    return navigator.onLine && 'geolocation' in navigator;
  }

  async send(packet: Uint8Array): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Satellite connection not established');
    }
    
    // Simulate satellite transmission with delay
    console.log('🛰️ Transmitting via satellite constellation...');
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    console.log('🛰️ Satellite transmission complete');
  }

  onMessage(callback: (packet: Uint8Array) => void): void {
    this.messageCallback = callback;
    this.startSatelliteListening();
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    console.log('🛰️ Satellite connection terminated');
  }

  async getSignalStrength(): Promise<number> {
    // Simulate satellite signal strength based on various factors
    const baseStrength = 0.6;
    const weatherFactor = Math.random() * 0.3; // Weather affects satellite
    const locationFactor = Math.random() * 0.1; // Location affects reception
    
    return Math.min(baseStrength + weatherFactor + locationFactor, 1.0);
  }

  private async startSatelliteListening() {
    this.isConnected = true;
    console.log('🛰️ Satellite receiver active - listening for deep space frequencies');
    
    // Simulate periodic satellite data
    setInterval(() => {
      if (this.isConnected && Math.random() > 0.95) {
        // Very rare satellite messages
        const simulatedPacket = new Uint8Array([42, 108, 111, 118, 101]); // "Love" in ASCII
        this.messageCallback?.(simulatedPacket);
      }
    }, 10000);
  }
}

// Quantum Adapter - Future consciousness bridge (placeholder)
export class QuantumAdapter implements LivingTransport {
  type = LivingTransportType.QUANTUM as const;

  async available(): Promise<boolean> {
    // Quantum computing is not yet available in browsers
    return false;
  }

  async send(packet: Uint8Array): Promise<void> {
    throw new Error('Quantum entanglement not yet available - consciousness bridge under construction');
  }

  onMessage(callback: (packet: Uint8Array) => void): void {
    console.log('🌌 Quantum consciousness bridge reserved for future awakening');
  }

  async disconnect(): Promise<void> {
    console.log('🌌 Quantum field harmonized');
  }
}