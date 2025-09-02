import { WebRTCManager } from '../webrtc';
import { CollectiveSync, SyncMessage } from './CollectiveSync';
import { logger } from '@/lib/logger';
import { AudioStreamer } from '../audio/AudioStreamer';

export class CollectiveSessionManager {
  public webRTCManager: WebRTCManager;
  public collectiveSync: CollectiveSync;
  private userId: string;
  private audioStreamer: AudioStreamer;

  constructor(
    userId: string,
    onPhaseUpdate: (phase: number, coherence: number) => void,
    onRemoteStream: (stream: MediaStream) => void,
    onCallEnd: () => void,
    onIncomingCall: (callId: string, fromUserId: string) => void
  ) {
    this.userId = userId;

    this.webRTCManager = new WebRTCManager(
      onCallEnd,
      onIncomingCall,
      this.userId,
      this.handleDataChannelMessage,
      onRemoteStream
    );


    this.collectiveSync = new CollectiveSync(onPhaseUpdate);
    this.collectiveSync.startSync(this.sendMessage);

    this.audioStreamer = new AudioStreamer();
  }

  private handleDataChannelMessage = (event: MessageEvent) => {
    try {
      const message: SyncMessage = JSON.parse(event.data);
      this.collectiveSync.handleSyncMessage(message, performance.now());
    } catch (error) {
      logger.error('Error handling data channel message:', error);
    }
  };

  private sendMessage = (message: SyncMessage) => {
    this.webRTCManager.sendData(JSON.stringify(message));
  };

  public async startCall(remoteUserId: string): Promise<string> {
    this.audioStreamer.start();
    const stream = this.audioStreamer.getStream();
    const callId = await this.webRTCManager.initializeCall(remoteUserId, stream);
    return callId;
  }

  public async joinCall(callId: string, remoteUserId: string): Promise<void> {
    this.audioStreamer.start();
    const stream = this.audioStreamer.getStream();
    await this.webRTCManager.acceptCall(callId, remoteUserId, stream);
  }

  public endCall(): void {
    this.webRTCManager.endCall();
    this.collectiveSync.stopSync();
    this.audioStreamer.stop();
  }

  public setFrequency(frequency: number): void {
    this.collectiveSync.setFrequency(frequency);
  }
}
