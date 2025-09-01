import { getAudioContextClass } from '@/utils/audio/SimpleAudioEngine';

class AudioCueSystem {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;
  
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      const AudioContextClass = getAudioContextClass();
      if (!AudioContextClass) {
        throw new Error("AudioContext not supported");
      }
      this.audioContext = new AudioContextClass();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async playInhaleCue(volume: number = 0.5) {
    await this.ensureInitialized();
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(this.gainNode);
    
    // Higher pitch for inhale
    oscillator.frequency.value = 440; // A4
    oscillator.type = 'sine';
    
    // Quick attack, quick decay
    const now = this.audioContext.currentTime;
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(volume * 0.3, now + 0.05);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  }

  async playExhaleCue(volume: number = 0.5) {
    await this.ensureInitialized();
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(this.gainNode);
    
    // Lower pitch for exhale
    oscillator.frequency.value = 220; // A3
    oscillator.type = 'sine';
    
    // Quick attack, longer decay
    const now = this.audioContext.currentTime;
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(volume * 0.3, now + 0.05);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }

  async playBaselineCue(volume: number = 0.3) {
    await this.ensureInitialized();
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(this.gainNode);
    
    // Gentle mid-tone for baseline breathing
    oscillator.frequency.value = 330; // E4
    oscillator.type = 'triangle';
    
    const now = this.audioContext.currentTime;
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(volume * 0.2, now + 0.1);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    oscillator.start(now);
    oscillator.stop(now + 0.5);
  }

  stopAllCues() {
    // Individual cues stop themselves, but this can be extended for longer tones
  }

  setMasterVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.audioContext!.currentTime);
    }
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.gainNode = null;
      this.isInitialized = false;
    }
  }
}

// Global audio cue system
const audioCueSystem = new AudioCueSystem();

export const playInhaleCue = (volume: number = 0.5) => audioCueSystem.playInhaleCue(volume);
export const playExhaleCue = (volume: number = 0.5) => audioCueSystem.playExhaleCue(volume);
export const playBaselineCue = (volume: number = 0.3) => audioCueSystem.playBaselineCue(volume);
export const stopAllCues = () => audioCueSystem.stopAllCues();
export const setMasterVolume = (volume: number) => audioCueSystem.setMasterVolume(volume);

// Initialize on first user interaction
export const initializeAudioCues = () => audioCueSystem.initialize();

// Auto-cleanup
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => audioCueSystem.destroy());
}