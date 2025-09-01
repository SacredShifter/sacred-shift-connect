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
  it('should handle 1000+ simulated nodes without crashing', () => {
    const receiver = new CollectiveReceiver('self-id');
    const onSignal = vi.fn();
    receiver.onSignal(onSignal);

    const nodeCount = 1200; // More than 1000 to test the limit

    for (let i = 0; i < nodeCount; i++) {
        const peerId = `peer-${i}`;
        receiver.connect(peerId, true);
    }

    // The MAX_PEERS constant in CollectiveReceiver is 100, so we expect 100 peers.
    // The test is to ensure it doesn't crash when trying to add more.
    // @ts-ignore
    expect(receiver.transport.peers.size).toBe(100);

    // Simulate receiving state updates from all connected peers
    for (let i = 0; i < 100; i++) {
        const peerId = `peer-${i}`;
        // @ts-ignore
        receiver.updateParticipantState(peerId, {
            userId: peerId,
            resonance: Math.random(),
            polarity: Math.random() * 2 - 1,
            coherence: Math.random(),
            lastUpdate: Date.now(),
        });
    }

    // The test verifies that the system doesn't crash when trying to connect more than the MAX_PEERS limit.
    // The number of participant states will be 100 peers + 1 self.
    expect(receiver.collectiveField.nodeCount).toBe(101);
    expect(receiver.collectiveField.resonance).toBeGreaterThan(0);
    expect(receiver.collectiveField.coherence).toBeGreaterThan(0);

    receiver.disconnect();
    // @ts-ignore
    expect(receiver.transport.peers.size).toBe(0);
  });
});
