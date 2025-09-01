/**
 * Simple Audio Engine - Direct Web Audio API implementation
 * Fallback for when Tone.js has issues
 */

export const getAudioContextClass = (): typeof AudioContext | null => {
  // Check for window to avoid SSR errors
  if (typeof window === 'undefined') {
    return null;
  }
  return window.AudioContext || (window as any).webkitAudioContext || null;
};

export class SimpleAudioEngine {
  private audioContext: AudioContext | null = null;
  private oscillators: Map<string, {
    osc: OscillatorNode;
    gain: GainNode;
  }> = new Map();
  private masterGain: GainNode | null = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      console.log('🎵 SimpleAudioEngine: Initializing...');
      
      // Create audio context
      const AudioContextClass = getAudioContextClass();
      if (!AudioContextClass) {
        console.error('❌ SimpleAudioEngine: AudioContext not supported');
        return false;
      }
      this.audioContext = new AudioContextClass();
      
      if (this.audioContext.state === 'suspended') {
        console.log('🎵 SimpleAudioEngine: Resuming suspended context...');
        await this.audioContext.resume();
      }
      
      // Create master gain
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      this.masterGain.connect(this.audioContext.destination);
      
      this.isInitialized = true;
      console.log('✅ SimpleAudioEngine: Initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ SimpleAudioEngine: Failed to initialize:', error);
      return false;
    }
  }

  createOscillator(id: string, frequency: number = 220): boolean {
    if (!this.audioContext || !this.masterGain) {
      console.error('❌ SimpleAudioEngine: Not initialized');
      return false;
    }

    try {
      console.log(`🎼 SimpleAudioEngine: Creating oscillator ${id} at ${frequency}Hz`);
      
      // Stop existing oscillator if it exists
      if (this.oscillators.has(id)) {
        this.stopOscillator(id);
      }

      // Create oscillator
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      // Configure oscillator
      osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      osc.type = 'sine';

      // Configure gain with envelope
      gain.gain.setValueAtTime(0, this.audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.1);

      // Connect audio chain
      osc.connect(gain);
      gain.connect(this.masterGain);

      // Store references
      this.oscillators.set(id, { osc, gain });

      // Start oscillator
      osc.start();
      
      console.log(`✅ SimpleAudioEngine: Oscillator ${id} started successfully`);
      return true;
    } catch (error) {
      console.error(`❌ SimpleAudioEngine: Failed to create oscillator ${id}:`, error);
      return false;
    }
  }

  stopOscillator(id: string): void {
    const components = this.oscillators.get(id);
    if (!components || !this.audioContext) return;

    try {
      console.log(`🛑 SimpleAudioEngine: Stopping oscillator ${id}`);
      const { osc, gain } = components;

      // Fade out
      gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);

      // Stop after fade
      setTimeout(() => {
        try {
          osc.stop();
          osc.disconnect();
          gain.disconnect();
          this.oscillators.delete(id);
          console.log(`✅ SimpleAudioEngine: Oscillator ${id} stopped and cleaned up`);
        } catch (error) {
          console.error(`❌ SimpleAudioEngine: Error cleaning up oscillator ${id}:`, error);
          this.oscillators.delete(id);
        }
      }, 150);
    } catch (error) {
      console.error(`❌ SimpleAudioEngine: Error stopping oscillator ${id}:`, error);
      this.oscillators.delete(id);
    }
  }

  stopAll(): void {
    console.log(`🛑 SimpleAudioEngine: Stopping all ${this.oscillators.size} oscillators`);
    const oscillatorIds = Array.from(this.oscillators.keys());
    oscillatorIds.forEach(id => this.stopOscillator(id));
  }

  updateFrequency(id: string, frequency: number): void {
    const components = this.oscillators.get(id);
    if (!components || !this.audioContext) return;

    try {
      components.osc.frequency.linearRampToValueAtTime(
        frequency, 
        this.audioContext.currentTime + 0.1
      );
      console.log(`🎵 SimpleAudioEngine: Updated ${id} frequency to ${frequency}Hz`);
    } catch (error) {
      console.error(`❌ SimpleAudioEngine: Failed to update ${id} frequency:`, error);
    }
  }

  setMasterVolume(volume: number): void {
    if (!this.masterGain || !this.audioContext) return;

    try {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      this.masterGain.gain.linearRampToValueAtTime(
        clampedVolume, 
        this.audioContext.currentTime + 0.1
      );
      console.log(`🔊 SimpleAudioEngine: Master volume set to ${(clampedVolume * 100).toFixed(0)}%`);
    } catch (error) {
      console.error('❌ SimpleAudioEngine: Failed to set master volume:', error);
    }
  }

  getActiveCount(): number {
    return this.oscillators.size;
  }

  getIsInitialized(): boolean {
    return this.isInitialized;
  }

  // Create a simple test tone to verify audio is working
  playTestTone(duration: number = 1000): void {
    if (!this.isInitialized) {
      console.error('❌ SimpleAudioEngine: Cannot play test tone - not initialized');
      return;
    }

    console.log('🎵 SimpleAudioEngine: Playing test tone...');
    
    const testId = `test-${Date.now()}`;
    this.createOscillator(testId, 440); // A4 note

    setTimeout(() => {
      this.stopOscillator(testId);
      console.log('✅ SimpleAudioEngine: Test tone completed');
    }, duration);
  }
}