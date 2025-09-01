import * as Tone from 'tone';

export type StoneType = 'granite' | 'limestone' | 'quartz';

// Constants for the sacred ratios
const SQRT2 = Math.sqrt(2);
const SQRT3 = Math.sqrt(3);
const SQRT5 = Math.sqrt(5);
const PI = Math.PI;

export class StoneResonanceFilter {
  private readonly input: Tone.Gain;
  readonly output: Tone.Gain;
  private filter: Tone.Filter | Tone.EQ4;
  private infrasoundOscillator: Tone.Oscillator;

  constructor(stoneType: StoneType) {
    this.input = new Tone.Gain();
    this.output = new Tone.Gain();
    this.filter = this.createFilterForStone(stoneType);
    this.input.connect(this.filter);
    this.filter.connect(this.output);

    // Add a safe infrasound layer (19-32Hz)
    // This oscillator is subtly mixed in to add a foundational hum
    this.infrasoundOscillator = new Tone.Oscillator({
      frequency: 25.5, // Mid-point of the 19-32Hz range
      type: 'sine',
      volume: -24, // Low volume to be felt more than heard
    }).connect(this.output).start();
  }

  private createFilterForStone(stoneType: StoneType): Tone.Filter | Tone.EQ4 {
    switch (stoneType) {
      case 'granite':
        // Granite is dense and crystalline, good for low frequencies.
        // We'll use a low-pass filter to emphasize the bass.
        return new Tone.Filter(800, 'lowpass');
      case 'limestone':
        // Limestone is softer and more porous, absorbing high frequencies.
        // We'll use an EQ to cut highs and slightly boost mids.
        return new Tone.EQ4({
            low: 0,
            mid: 3,
            high: -6,
            lowFrequency: 250,
            highFrequency: 2500
        });
      case 'quartz':
        // Quartz is highly resonant, often associated with high frequencies.
        // We'll use a high-pass filter to emphasize the treble.
        return new Tone.Filter(1500, 'highpass');
      default:
        // Default to a simple pass-through filter
        return new Tone.Filter(20000, 'lowpass');
    }
  }

  // Connect an audio source to the filter's input
  connect(source: Tone.ToneAudioNode) {
    source.connect(this.input);
  }

  dispose() {
    this.input.dispose();
    this.output.dispose();
    this.filter.dispose();
    this.infrasoundOscillator.dispose();
  }
}

// Function to extend a base frequency with sacred ratios
export function getSacredRatioFrequencies(baseFrequency: number): number[] {
    return [
        baseFrequency * SQRT2,
        baseFrequency * SQRT3,
        baseFrequency * SQRT5,
        baseFrequency * PI,
    ];
}
