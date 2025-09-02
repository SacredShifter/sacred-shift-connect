import { supabase } from '@/integrations/supabase/client';

export interface CallOffer {
  type: 'offer' | 'answer' | 'ice-candidate' | 'call-end' | 'call-accept' | 'call-reject';
  callId: string;
  fromUserId: string;
  toUserId: string;
  sdp?: string;
  candidate?: RTCIceCandidate;
  timestamp: number;
}

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private callChannel: any = null;
  private callId: string | null = null;
  private isInitiator: boolean = false;

  constructor(
    private onCallEnd: () => void,
    private onIncomingCall: (callId: string, fromUserId: string) => void,
    private userId: string,
    private onDataChannelMessage: (event: MessageEvent) => void,
    private onRemoteStream?: (stream: MediaStream) => void
  ) {
    this.setupPeerConnection();
  }

  private setupPeerConnection() {
    console.log('Setting up WebRTC peer connection...');
    
    // STUN servers for NAT traversal, and TURN server for relay
    const iceServers = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ];

    if (import.meta.env.VITE_TURN_URL) {
      iceServers.push({
        urls: import.meta.env.VITE_TURN_URL,
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_PASSWORD,
      });
    }

    this.peerConnection = new RTCPeerConnection({ iceServers });

    this.peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.dataChannel.binaryType = 'arraybuffer';
      this.dataChannel.onmessage = this.onDataChannelMessage;
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('Received remote stream:', event);
      this.remoteStream = event.streams[0];
      if (this.onRemoteStream) {
        this.onRemoteStream(this.remoteStream);
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.callChannel) {
        console.log('Sending ICE candidate:', event.candidate);
        this.callChannel.send({
          type: 'broadcast',
          event: 'webrtc_signal',
          payload: {
            type: 'ice-candidate',
            callId: this.callId,
            fromUserId: this.userId,
            candidate: event.candidate,
            timestamp: Date.now()
          }
        });
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection?.connectionState);
      if (this.peerConnection?.connectionState === 'disconnected' || 
          this.peerConnection?.connectionState === 'failed') {
        this.endCall();
      }
    };
  }

  async initializeCall(remoteUserId: string, stream?: MediaStream): Promise<string> {
    try {
      console.log('Initializing call to:', remoteUserId);
      this.callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.isInitiator = true;

      this.localStream = stream;

      // Add tracks to peer connection
      this.localStream?.getTracks().forEach(track => {
        if (this.peerConnection) {
          this.peerConnection.addTrack(track, this.localStream!);
        }
      });

      // Setup signaling channel
      this.setupSignalingChannel(remoteUserId);

      this.dataChannel = this.peerConnection!.createDataChannel('gaa-sync');
      this.dataChannel.onmessage = this.onDataChannelMessage;

      // Create offer
      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);

      // Send offer through signaling
      this.callChannel.send({
        type: 'broadcast',
        event: 'webrtc_signal',
        payload: {
          type: 'offer',
          callId: this.callId,
          fromUserId: this.userId,
          toUserId: remoteUserId,
          sdp: offer.sdp,
          timestamp: Date.now()
        }
      });

      console.log('Call offer sent for callId:', this.callId);
      return this.callId;

    } catch (error) {
      console.error('Error initializing call:', error);
      throw error;
    }
  }

  async acceptCall(callId: string, fromUserId: string, stream?: MediaStream): Promise<void> {
    try {
      console.log('Accepting call:', callId);
      this.callId = callId;
      this.isInitiator = false;

      this.localStream = stream;

      // Add tracks to peer connection
      this.localStream?.getTracks().forEach(track => {
        if (this.peerConnection) {
          this.peerConnection.addTrack(track, this.localStream!);
        }
      });

      // Setup signaling channel
      this.setupSignalingChannel(fromUserId);

      // Send accept signal
      this.callChannel.send({
        type: 'broadcast',
        event: 'webrtc_signal',
        payload: {
          type: 'call-accept',
          callId: this.callId,
          fromUserId: this.userId,
          toUserId: fromUserId,
          timestamp: Date.now()
        }
      });

    } catch (error) {
      console.error('Error accepting call:', error);
      throw error;
    }
  }

  rejectCall(callId: string, fromUserId: string): void {
    console.log('Rejecting call:', callId);
    
    const channel = supabase.channel(`video_call_${callId}`);
    channel.send({
      type: 'broadcast',
      event: 'webrtc_signal',
      payload: {
        type: 'call-reject',
        callId: callId,
        fromUserId: this.userId,
        toUserId: fromUserId,
        timestamp: Date.now()
      }
    });

    channel.unsubscribe();
  }

  private setupSignalingChannel(remoteUserId: string) {
    console.log('Setting up signaling channel for call:', this.callId);
    
    this.callChannel = supabase.channel(`video_call_${this.callId}`)
      .on('broadcast', { event: 'webrtc_signal' }, async (payload) => {
        const signal = payload.payload as CallOffer;
        console.log('Received WebRTC signal:', signal);

        // Ignore our own messages
        if (signal.fromUserId === this.userId) return;

        try {
          switch (signal.type) {
            case 'offer':
              console.log('Processing offer...');
              await this.peerConnection!.setRemoteDescription({
                type: 'offer',
                sdp: signal.sdp!
              });
              
              const answer = await this.peerConnection!.createAnswer();
              await this.peerConnection!.setLocalDescription(answer);
              
              this.callChannel.send({
                type: 'broadcast',
                event: 'webrtc_signal',
                payload: {
                  type: 'answer',
                  callId: signal.callId,
                  fromUserId: this.userId,
                  toUserId: signal.fromUserId,
                  sdp: answer.sdp,
                  timestamp: Date.now()
                }
              });
              break;

            case 'answer':
              console.log('Processing answer...');
              await this.peerConnection!.setRemoteDescription({
                type: 'answer',
                sdp: signal.sdp!
              });
              break;

            case 'ice-candidate':
              console.log('Adding ICE candidate...');
              await this.peerConnection!.addIceCandidate(signal.candidate!);
              break;

            case 'call-end':
              console.log('Call ended by remote peer');
              this.onCallEnd();
              break;

            case 'call-reject':
              console.log('Call rejected by remote peer');
              this.onCallEnd();
              break;
          }
        } catch (error) {
          console.error('Error processing WebRTC signal:', error);
        }
      })
      .subscribe();
  }

  setupIncomingCallListener() {
    console.log('Setting up incoming call listener for user:', this.userId);
    
    // Listen for incoming calls on user-specific channel
    const userChannel = supabase.channel(`user_${this.userId}_calls`)
      .on('broadcast', { event: 'webrtc_signal' }, (payload) => {
        const signal = payload.payload as CallOffer;
        console.log('Received signal on user channel:', signal);

        if (signal.type === 'offer' && signal.toUserId === this.userId) {
          console.log('Incoming call from:', signal.fromUserId);
          this.onIncomingCall(signal.callId, signal.fromUserId);
        }
      })
      .subscribe();

    return userChannel;
  }

  endCall(): void {
    console.log('Ending call...');

    // Send end call signal
    if (this.callChannel && this.callId) {
      this.callChannel.send({
        type: 'broadcast',
        event: 'webrtc_signal',
        payload: {
          type: 'call-end',
          callId: this.callId,
          fromUserId: this.userId,
          timestamp: Date.now()
        }
      });
    }

    // Clean up local resources
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.setupPeerConnection(); // Reset for next call
    }

    if (this.callChannel) {
      this.callChannel.unsubscribe();
      this.callChannel = null;
    }

    this.callId = null;
    this.remoteStream = null;
    this.onCallEnd();
  }


  toggleVideo(): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  }

  toggleAudio(): void {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  sendData(data: any): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(data));
    }
  }
}