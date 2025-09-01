import * as Tone from 'tone';

// Helper function to check for primality
const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i = i + 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

// Generates a list of prime numbers up to a limit
const generatePrimes = (limit: number): number[] => {
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  return primes;
};

export interface PrimeLatticeOscillatorOptions {
  baseFrequency?: number;
  primeLimit?: number;
  volume?: number;
}

export class PrimeLatticeOscillator {
  private readonly baseFrequency: number;
  private readonly primes: number[];
  private readonly oscillators: Tone.Oscillator[];
  private readonly gain: Tone.Gain;
  private lockDetectionThreshold = 0.05; // 5% tolerance for frequency matching
  private coherence = 1.0; // Starts at 1, amplifies when locked

  constructor(options: PrimeLatticeOscillatorOptions = {}) {
    this.baseFrequency = options.baseFrequency ?? 432; // A=432Hz tuning
    const primeLimit = options.primeLimit ?? 100;
    this.primes = generatePrimes(primeLimit);

    this.gain = new Tone.Gain(options.volume ?? 0.5).toDestination();

    this.oscillators = this.primes.map(prime => {
      const freq = this.baseFrequency * (prime / this.primes[0]); // Scale frequency based on prime
      const osc = new Tone.Oscillator({
        frequency: freq,
        type: 'sine',
      }).connect(this.gain);
      return osc;
    });
  }

  start() {
    this.oscillators.forEach(osc => osc.start());
  }

  stop() {
    this.oscillators.forEach(osc => osc.stop());
  }

  setVolume(volume: number) {
    this.gain.gain.rampTo(volume, 0.1);
  }

  // Basic lock detection: check if external frequencies are close to our prime-based frequencies
  detectLock(externalFrequencies: number[]): boolean {
    let locked = false;
    for (const osc of this.oscillators) {
      for (const extFreq of externalFrequencies) {
        const freq = osc.frequency.getValue();
        const difference = Math.abs(freq - extFreq) / freq;
        if (difference < this.lockDetectionThreshold) {
          locked = true;
          break;
        }
      }
      if(locked) break;
    }

    if (locked) {
      this.amplifyCoherence();
    } else {
        this.resetCoherence();
    }
    return locked;
  }

  private amplifyCoherence() {
    this.coherence = Math.min(this.coherence * 1.05, 2.0); // Amplify by 5%, max 2x
    this.gain.gain.rampTo(0.5 * this.coherence, 0.5);
    console.log(`Coherence amplified: ${this.coherence}`);
  }

  private resetCoherence() {
    this.coherence = 1.0;
    this.gain.gain.rampTo(0.5, 0.5);
  }

  dispose() {
    this.oscillators.forEach(osc => osc.dispose());
    this.gain.dispose();
  }
}
