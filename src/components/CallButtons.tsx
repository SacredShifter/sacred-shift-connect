import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Video } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { WebRTCManager } from '@/utils/webrtc';
import { VideoCallModal } from '@/components/VideoCall/VideoCallModal';
import { IncomingCallModal } from '@/components/VideoCall/IncomingCallModal';
import { useAuth } from '@/hooks/useAuth';

interface CallButtonsProps {
  userId: string;
  userName: string;
}

export const CallButtons: React.FC<CallButtonsProps> = ({ userId, userName }) => {
  const { user } = useAuth();
  const [webrtcManager, setWebrtcManager] = useState<WebRTCManager | null>(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [incomingCallId, setIncomingCallId] = useState<string | null>(null);
  const [incomingFromUserId, setIncomingFromUserId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    console.log('Initializing WebRTC manager for user:', user.id);
    
    const manager = new WebRTCManager(
      // onCallEnd
      () => {
        console.log('Call ended');
        setIsVideoCallOpen(false);
        setIsIncomingCall(false);
        setLocalStream(null);
        setRemoteStream(null);
        setIsConnected(false);
        setCallDuration(0);
      },
      // onIncomingCall
      (callId, fromUserId) => {
        console.log('Incoming call:', callId, 'from:', fromUserId);
        setIncomingCallId(callId);
        setIncomingFromUserId(fromUserId);
        setIsIncomingCall(true);
        
        toast({
          title: "Incoming Video Call",
          description: `Call from user ${fromUserId.slice(0, 8)}...`
        });
      },
      user.id,
      // onDataChannelMessage
      (event) => {
        console.log('Data channel message:', event.data);
      },
      // onRemoteStream
      (stream) => {
        console.log('Remote stream received:', stream);
        setRemoteStream(stream);
        setIsConnected(true);
      }
    );

    setWebrtcManager(manager);

    // Set up incoming call listener
    const userChannel = manager.setupIncomingCallListener();

    return () => {
      console.log('Cleaning up WebRTC manager');
      manager.endCall();
      userChannel?.unsubscribe();
    };
  }, [user?.id]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  const handleVoiceCall = () => {
    toast({
      title: "Voice Call",
      description: 'Voice calling feature coming soon!'
    });
  };

  const handleVideoCall = async () => {
    if (!webrtcManager || !user?.id) {
      toast({
        title: "Error", 
        description: "WebRTC not initialized",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Starting video call to:', userId);
      
      toast({
        title: "Initiating Call",
        description: `Calling ${userName}...`
      });

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      const callId = await webrtcManager.initializeCall(userId, stream);
      setLocalStream(stream);
      setIsVideoCallOpen(true);
      
      console.log('Video call initiated with callId:', callId);
      
    } catch (error) {
      console.error('Error starting video call:', error);
      toast({
        title: "Call Failed",
        description: "Could not start video call. Please check camera/microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const handleAcceptCall = async () => {
    if (!webrtcManager || !incomingCallId || !incomingFromUserId) return;

    try {
      console.log('Accepting call:', incomingCallId);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      await webrtcManager.acceptCall(incomingCallId, incomingFromUserId, stream);
      setLocalStream(stream);
      setIsIncomingCall(false);
      setIsVideoCallOpen(true);
      
      toast({
        title: "Call Connected",
        description: "Video call established successfully"
      });
      
    } catch (error) {
      console.error('Error accepting call:', error);
      toast({
        title: "Error",
        description: "Could not accept call",
        variant: "destructive"
      });
      setIsIncomingCall(false);
    }
  };

  const handleRejectCall = () => {
    if (!webrtcManager || !incomingCallId || !incomingFromUserId) return;
    
    console.log('Rejecting call:', incomingCallId);
    webrtcManager.rejectCall(incomingCallId, incomingFromUserId);
    setIsIncomingCall(false);
    setIncomingCallId(null);
    setIncomingFromUserId(null);
    
    toast({
      title: "Call Rejected",
      description: "Incoming call declined"
    });
  };

  const handleEndCall = () => {
    if (webrtcManager) {
      webrtcManager.endCall();
    }
  };

  const handleToggleVideo = () => {
    if (webrtcManager) {
      webrtcManager.toggleVideo();
    }
  };

  const handleToggleAudio = () => {
    if (webrtcManager) {
      webrtcManager.toggleAudio();
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleVoiceCall}
        className="text-muted-foreground hover:text-green-500"
      >
        <Phone className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleVideoCall}
        className="text-muted-foreground hover:text-blue-500"
        disabled={!webrtcManager}
      >
        <Video className="h-4 w-4" />
      </Button>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        localStream={localStream}
        remoteStream={remoteStream}
        remoteUserName={userName}
        onEndCall={handleEndCall}
        onToggleVideo={handleToggleVideo}
        onToggleAudio={handleToggleAudio}
        isConnected={isConnected}
        callDuration={callDuration}
      />

      {/* Incoming Call Modal */}
      <IncomingCallModal
        isOpen={isIncomingCall}
        callerName={`User ${incomingFromUserId?.slice(0, 8) || 'Unknown'}`}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </>
  );
};