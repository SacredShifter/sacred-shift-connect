/**
 * Audio Streamer - Handles audio input/output streaming for collective sessions
 */

export class AudioStreamer {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isStreaming: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 0.8;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  async start(): Promise<void> {
    if (this.isStreaming) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        },
        video: false
      });

      if (this.audioContext && this.gainNode) {
        const source = this.audioContext.createMediaStreamSource(this.stream);
        source.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
      }

      this.isStreaming = true;
    } catch (error) {
      console.error('Failed to start audio streaming:', error);
      throw error;
    }
  }

  stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isStreaming = false;
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  isActive(): boolean {
    return this.isStreaming && this.stream !== null;
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  async createAudioWorklet(workletUrl: string): Promise<AudioWorkletNode | null> {
    if (!this.audioContext) return null;

    try {
      await this.audioContext.audioWorklet.addModule(workletUrl);
      return new AudioWorkletNode(this.audioContext, 'audio-worklet-processor');
    } catch (error) {
      console.error('Failed to create audio worklet:', error);
      return null;
    }
  }

  cleanup(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.gainNode = null;
  }
}