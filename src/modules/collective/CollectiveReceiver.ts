import Peer from 'simple-peer';
import { SignalData } from 'simple-peer';

// More detailed interfaces for state management
export interface ParticipantState {
  userId: string;
  resonance: number;
  polarity: number;
  coherence: number;
  lastUpdate: number;
}

export interface CollectiveField {
  resonance: number;
  polarity: number;
  coherence: number;
  nodeCount: number;
  regionalCoherence: { [region: string]: number };
  globalCoherence: number;
}

// FIXME: This is a hard-coded limit for the initial implementation. To scale to 100,000+ nodes,
// a more sophisticated peer discovery and management system would be required, likely involving
// a tiered architecture with regional signaling servers.
const MAX_PEERS = 100; // Scaling threshold

export class CollectiveReceiver {
  public collectiveField: CollectiveField;
  public isConnected: boolean = false;
  private peers: Map<string, Peer.Instance> = new Map();
  private participantStates: Map<string, ParticipantState> = new Map();
  private onFieldUpdateCallback?: (field: CollectiveField) => void;
  private onSignalCallback?: (userId: string, data: SignalData) => void;
  private readonly selfId: string;

  constructor(selfId: string) {
    this.selfId = selfId;
    this.collectiveField = {
      resonance: 0,
      polarity: 0,
      coherence: 0,
      nodeCount: 1, // Start with self
      regionalCoherence: {},
      globalCoherence: 0,
    };
    // Add self to participant states
    this.participantStates.set(selfId, {
        userId: selfId,
        resonance: 0,
        polarity: 0,
        coherence: 0,
        lastUpdate: Date.now()
    });
  }

  // Callbacks for external communication
  onFieldUpdate(callback: (field: CollectiveField) => void) {
    this.onFieldUpdateCallback = callback;
  }

  onSignal(callback: (userId: string, data: SignalData) => void) {
    this.onSignalCallback = callback;
  }

  // Entry point to connect to a new peer
  connect(peerId: string, initiator: boolean = false) {
    if (this.peers.size >= MAX_PEERS) {
      console.warn(`Cannot connect to new peer ${peerId}, max peers reached.`);
      return;
    }
    if (this.peers.has(peerId)) {
        console.log(`Already connected to peer ${peerId}`);
        return;
    }

    console.log(`Connecting to peer ${peerId}, initiator: ${initiator}`);
    const peer = new Peer({ initiator, trickle: false });
    this.peers.set(peerId, peer);

    peer.on('signal', data => {
      if (this.onSignalCallback) {
        this.onSignalCallback(peerId, data);
      }
    });

    peer.on('connect', () => {
      console.log(`Connected to peer ${peerId}`);
      this.isConnected = true;
      this.updateNodeCount();
    });

    peer.on('data', (data: any) => {
      const message = JSON.parse(data.toString());
      if (message.type === 'stateUpdate') {
        this.updateParticipantState(message.payload.userId, message.payload);
      }
    });

    peer.on('close', () => {
      console.log(`Connection to peer ${peerId} closed.`);
      this.peers.delete(peerId);
      this.participantStates.delete(peerId);
      this.updateNodeCount();
      if(this.peers.size === 0) {
        this.isConnected = false;
      }
    });

    peer.on('error', (err) => {
        console.error(`Error with peer ${peerId}:`, err);
        this.peers.delete(peerId);
        this.participantStates.delete(peerId);
        this.updateNodeCount();
    });
  }

  // Used to accept a connection from a peer
  signal(peerId: string, data: SignalData) {
    const peer = this.peers.get(peerId);
    if (peer && !peer.destroyed) {
      peer.signal(data);
    } else {
        // If we receive a signal for a peer we don't know, it's a new connection from a non-initiator
        this.connect(peerId, false);
        this.peers.get(peerId)?.signal(data);
    }
  }

  // Update local state and broadcast to peers
  updateSelfState(state: Omit<ParticipantState, 'userId' | 'lastUpdate'>) {
    const selfState: ParticipantState = {
        ...state,
        userId: this.selfId,
        lastUpdate: Date.now()
    };
    this.updateParticipantState(this.selfId, selfState);
    this.broadcastState(selfState);
  }

  private broadcastState(state: ParticipantState) {
    const message = JSON.stringify({ type: 'stateUpdate', payload: state });
    this.peers.forEach(peer => {
      if (peer.connected) {
        peer.send(message);
      }
    });
  }

  private updateParticipantState(userId: string, state: ParticipantState) {
    this.participantStates.set(userId, state);
    this.aggregateStates();
  }

  private aggregateStates() {
    let totalResonance = 0;
    let totalPolarity = 0;
    let totalCoherence = 0;
    const nodeCount = this.participantStates.size;

    if (nodeCount === 0) {
      this.collectiveField = { resonance: 0, polarity: 0, coherence: 0, nodeCount: 0, regionalCoherence: {}, globalCoherence: 0 };
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
    this.peers.forEach(peer => peer.destroy());
    this.peers.clear();
    this.participantStates.clear();
    this.isConnected = false;
    this.updateNodeCount();
  }
}
