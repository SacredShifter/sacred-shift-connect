import { describe, it, expect, vi } from 'vitest';
import { CollectiveReceiver } from '../../modules/collective/CollectiveReceiver';

// Mock simple-peer
vi.mock('simple-peer', () => {
    class MockPeer {
        constructor(opts) {
            // @ts-ignore
            this.initiator = opts.initiator;
        }
        on(event, callback) {
            if (event === 'signal') {
                // Immediately signal back to simulate a connection
                callback({ type: 'offer', sdp: 'mock-sdp' });
            }
            if(event === 'connect') {
                setTimeout(() => callback(), 1); // simulate async connection
            }
        }
        signal(data) {}
        send(data) {}
        destroy() {}
        get connected() {
            return true;
        }
    }
    return { default: MockPeer };
});


describe('CollectiveReceiver Stress Test', () => {
  it('should handle many simulated nodes without crashing', () => {
    const receiver = new CollectiveReceiver('self-id');
    const onSignal = vi.fn();
    receiver.onSignal(onSignal);

    const nodeCount = 32; // Should be <= MAX_PEERS in CollectiveReceiver.ts

    for (let i = 0; i < nodeCount; i++) {
        const peerId = `peer-${i}`;
        receiver.connect(peerId, true);
    }

    // @ts-ignore
    expect(receiver.transport.peers.size).toBe(nodeCount);

    // Simulate receiving state updates from all connected peers
    for (let i = 0; i < nodeCount; i++) {
        const peerId = `peer-${i}`;
        // @ts-ignore
        receiver.updateParticipantState(peerId, {
            userId: peerId,
            displayName: `Peer ${i}`,
            resonance: Math.random(),
            polarity: Math.random() * 2 - 1,
            coherence: Math.random(),
            lastUpdate: Date.now(),
        });
    }

    expect(receiver.collectiveField.nodeCount).toBe(nodeCount + 1);
    expect(receiver.collectiveField.resonance).toBeGreaterThan(0);
    expect(receiver.collectiveField.coherence).toBeGreaterThan(0);

    receiver.disconnect();
    // @ts-ignore
    expect(receiver.transport.peers.size).toBe(0);
  });
});
