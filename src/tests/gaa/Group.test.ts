import { describe, it, expect, vi } from 'vitest';
import { PrimeLatticeOscillator } from '../../dsp/PrimeLatticeOscillator';

// Create a stateful mock for Tone.js components
vi.mock('tone', () => {
    const createMockGain = () => {
        const state = { value: 0.5 };
        return {
            toDestination: vi.fn().mockReturnThis(),
            dispose: vi.fn(),
            connect: vi.fn().mockReturnThis(),
            gain: {
                get value() { return state.value; },
                set value(v) { state.value = v; },
                rampTo: vi.fn((val, time) => {
                    state.value = val;
                }),
            },
        };
    };

    const createMockOscillator = () => {
        const freqState = { value: 432 };
        return {
            connect: vi.fn().mockReturnThis(),
            start: vi.fn(),
            stop: vi.fn(),
            dispose: vi.fn(),
            frequency: {
                get value() { return freqState.value; },
                set value(v) { freqState.value = v; },
                rampTo: vi.fn((val) => {
                    freqState.value = val;
                }),
            },
        };
    };

    return {
        __esModule: true,
        default: {
            Gain: vi.fn().mockImplementation(createMockGain),
            Oscillator: vi.fn().mockImplementation(createMockOscillator),
        },
        Gain: vi.fn().mockImplementation(createMockGain),
        Oscillator: vi.fn().mockImplementation(createMockOscillator),
    };
});


describe('Group Simulation Test', () => {
  it('should detect frequency lock and amplify coherence in a group of 50 nodes', () => {
    const nodeCount = 50;
    const nodes: PrimeLatticeOscillator[] = [];

    // Create 50 nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new PrimeLatticeOscillator({ baseFrequency: 432 + i * 0.1 }));
    }

    const leaderNode = nodes[0];
    // @ts-ignore
    const leaderFrequencies = leaderNode.oscillators.map(o => o.frequency.value);

    // Simulate 10 followers syncing with the leader
    const followersToSync = 10;

    for (let i = 1; i <= followersToSync; i++) {
        const followerNode = nodes[i];
        // @ts-ignore
        const followerOscillators = followerNode.oscillators;
        const leaderFirstPrimeFreq = leaderFrequencies[0];
        followerOscillators[0].frequency.value = (leaderFirstPrimeFreq as any) + (Math.random() * 0.01 - 0.005);
    }

    const allOtherFrequencies = nodes.slice(1).flatMap(node =>
        // @ts-ignore
        node.oscillators.map((o: any) => o.frequency.value as number)
    );

    // @ts-ignore
    const initialGain = leaderNode.gain.gain.value;
    expect(initialGain).toBe(0.5);

    // Detect lock
    const isLocked = leaderNode.detectLock(allOtherFrequencies);

    // Assert that the lock was detected
    expect(isLocked).toBe(true);

    // @ts-ignore
    const finalGain = leaderNode.gain.gain.value;
    expect(finalGain).toBeGreaterThan(initialGain);

    // Clean up
    nodes.forEach(node => node.dispose());
  });
});
