import { BaseTransport } from './transport';
import { TransportType } from './types';
import Peer from 'simple-peer';

export class WebRTCTransport extends BaseTransport {
    type = TransportType.WEBRTC;
    public peers: Map<string, Peer.Instance> = new Map();

    constructor() {
        super();
    }

    async available(): Promise<boolean> {
        return Peer.WEBRTC_SUPPORT;
    }

    async send(packet: Uint8Array): Promise<void> {
        this.peers.forEach(peer => {
            if (peer.connected) {
                peer.send(packet);
            }
        });
    }

    async disconnect(): Promise<void> {
        this.peers.forEach(peer => peer.destroy());
        this.peers.clear();
    }

    public addPeer(peerId: string, peer: Peer.Instance) {
        this.peers.set(peerId, peer);
        peer.on('data', (data: any) => {
            if (data instanceof ArrayBuffer) {
                this.handleMessage(new Uint8Array(data));
            } else if (data instanceof Uint8Array) {
                this.handleMessage(data);
            }
        });
    }
}
