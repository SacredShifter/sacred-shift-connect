import { WebRTCTransport } from '@/lib/sacredMesh/webrtc';
import Peer, { SignalData } from 'simple-peer';

// More detailed interfaces for state management
export interface ParticipantState {
    userId: string;
    displayName: string;
    resonance: number;
    polarity: number;
    coherence: number;
    lastUpdate: number;
    lat?: number;
    lon?: number;
}

export interface CollectiveField {
  resonance: number;
  polarity: number;
  coherence: number;
  nodeCount: number;
  regionalCoherence: { [region: string]: number };
  globalCoherence: number;
  participantStates: { [userId: string]: ParticipantState };
}

// FIXME: This is a hard-coded limit for the initial implementation. To scale to 100,000+ nodes,
// a more sophisticated peer discovery and management system would be required, likely involving
// a tiered architecture with regional signaling servers.
const MAX_PEERS = 32; // Scaling threshold

export class CollectiveReceiver {
  public collectiveField: CollectiveField;
  public isConnected: boolean = false;
  private transport: WebRTCTransport;
  private participantStates: Map<string, ParticipantState> = new Map();
  private onFieldUpdateCallback?: (field: CollectiveField) => void;
  private onSignalCallback?: (userId: string, data: SignalData) => void;
  private onStreamCallback?: (userId: string, stream: MediaStream) => void;
  private readonly selfId: string;
  private localStream: MediaStream | null = null;

  constructor(selfId: string) {
    this.selfId = selfId;
    this.transport = new WebRTCTransport();
    this.collectiveField = {
      resonance: 0,
      polarity: 0,
      coherence: 0,
      nodeCount: 1, // Start with self
      regionalCoherence: {},
      globalCoherence: 0,
      participantStates: {}
    };
    // Add self to participant states
    this.participantStates.set(selfId, {
        userId: selfId,
        displayName: 'Self',
        resonance: 0,
        polarity: 0,
        coherence: 0,
        lastUpdate: Date.now()
    });

    this.transport.onMessage((packet: Uint8Array) => {
        const message = JSON.parse(new TextDecoder().decode(packet));
        if (message.type === 'stateUpdate') {
            this.updateParticipantState(message.payload.userId, message.payload);
        }
    });
  }

  // Callbacks for external communication
  onFieldUpdate(callback: (field: CollectiveField) => void) {
    this.onFieldUpdateCallback = callback;
  }

  onSignal(callback: (peerId: string, data: SignalData) => void) {
    this.onSignalCallback = callback;
  }

  onStream(callback: (userId: string, stream: MediaStream) => void) {
    this.onStreamCallback = callback;
  }

  setLocalStream(stream: MediaStream) {
    this.localStream = stream;
    // @ts-ignore
    for (const peer of this.transport.peers.values()) {
      peer.addStream(stream);
    }
  }

  // Entry point to connect to a new peer
  connect(peerId: string, initiator: boolean = false) {
    // @ts-ignore
    if (this.transport.peers.size >= MAX_PEERS) {
      console.warn(`Cannot connect to new peer ${peerId}, max peers reached.`);
      return;
    }

    console.log(`Connecting to peer ${peerId}, initiator: ${initiator}`);
    const peer = new Peer({ initiator, trickle: false, stream: this.localStream });
    this.transport.addPeer(peerId, peer);

    peer.on('signal', data => {
      if (this.onSignalCallback) {
        this.onSignalCallback(peerId, data);
      }
    });

    peer.on('stream', (stream) => {
        if (this.onStreamCallback) {
            this.onStreamCallback(peerId, stream);
        }
    });

    peer.on('connect', () => {
      console.log(`Connected to peer ${peerId}`);
      this.isConnected = true;
      this.updateNodeCount();
    });

    peer.on('close', () => {
      console.log(`Connection to peer ${peerId} closed.`);
      this.updateNodeCount();
      // @ts-ignore
      if(this.transport.peers.size === 0) {
        this.isConnected = false;
      }
    });

    peer.on('error', (err) => {
        console.error(`Error with peer ${peerId}:`, err);
        this.updateNodeCount();
    });
  }

  // Used to accept a connection from a peer
  signal(peerId: string, data: SignalData) {
    // This is a bit of a hack, but we need to get the peer from the transport
    // @ts-ignore
    const peer = this.transport.peers.get(peerId);
    if (peer && !peer.destroyed) {
      peer.signal(data);
    } else {
        // If we receive a signal for a peer we don't know, it's a new connection from a non-initiator
        this.connect(peerId, false);
        // @ts-ignore
        this.transport.peers.get(peerId)?.signal(data);
    }
  }

  // Update local state and broadcast to peers
  updateSelfState(state: Omit<ParticipantState, 'userId' | 'lastUpdate' | 'displayName'>) {
    const selfState: ParticipantState = {
        ...state,
        userId: this.selfId,
        displayName: 'Self',
        lastUpdate: Date.now()
    };
    this.updateParticipantState(this.selfId, selfState);
    this.broadcastState(selfState);
  }

  private broadcastState(state: ParticipantState) {
    const message = JSON.stringify({ type: 'stateUpdate', payload: state });
    this.transport.send(new TextEncoder().encode(message));
  }

  public broadcast(message: any) {
    const encoded = new TextEncoder().encode(JSON.stringify(message));
    this.transport.send(encoded);
  }

  public updateParticipantState(userId: string, state: ParticipantState) {
    this.participantStates.set(userId, state);
    this.aggregateStates();
  }

  private aggregateStates() {
    let totalResonance = 0;
    let totalPolarity = 0;
    let totalCoherence = 0;
    const nodeCount = this.participantStates.size;

    if (nodeCount === 0) {
      this.collectiveField = { resonance: 0, polarity: 0, coherence: 0, nodeCount: 0, regionalCoherence: {}, globalCoherence: 0, participantStates: {} };
    } else {
        for (const state of this.participantStates.values()) {
            totalResonance += state.resonance;
            totalPolarity += state.polarity;
            totalCoherence += state.coherence;
        }

        this.collectiveField = {
            resonance: totalResonance / nodeCount,
            polarity: totalPolarity / nodeCount,
            coherence: totalCoherence / nodeCount,
            nodeCount,
            // Placeholder for regional/global coherence
            regionalCoherence: {},
            globalCoherence: totalCoherence / nodeCount,
            participantStates: Object.fromEntries(this.participantStates)
        };
    }

    if (this.onFieldUpdateCallback) {
      this.onFieldUpdateCallback(this.collectiveField);
    }
  }

  private updateNodeCount() {
    this.collectiveField.nodeCount = this.participantStates.size;
    this.aggregateStates();
  }

  disconnect() {
    console.log('Disconnecting all peers.');
    this.transport.disconnect();
    this.participantStates.clear();
    this.isConnected = false;
    this.updateNodeCount();
  }
}

export const applyPLLDriftCorrection = (phase: number, correction?: number) => {
  return correction ? (phase + correction) % (2 * Math.PI) : phase;
};
