import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Video, PhoneOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { VideoCallModal } from '@/components/VideoCall/VideoCallModal';
import { IncomingCallModal } from '@/components/VideoCall/IncomingCallModal';
import { supabase } from '@/integrations/supabase/client';

interface CircleVideoCallManagerProps {
  circleId: string;
  circleName: string;
  className?: string;
}

interface CallParticipant {
  id: string;
  name?: string;
  avatar?: string;
  stream?: MediaStream;
}

export const CircleVideoCallManager: React.FC<CircleVideoCallManagerProps> = ({
  circleId,
  circleName,
  className
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<CallParticipant[]>([]);
  const [callChannel, setCallChannel] = useState<any>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Initialize call channel for this circle
  useEffect(() => {
    if (!user || !circleId) return;

    const channel = supabase.channel(`circle_call_${circleId}`)
      .on('broadcast', { event: 'call_update' }, (payload) => {
        const { type, userId, userName, isVideo } = payload.payload;
        
        switch (type) {
          case 'join':
            setParticipants(prev => {
              if (prev.find(p => p.id === userId)) return prev;
              return [...prev, { id: userId, name: userName }];
            });
            break;
            
          case 'leave':
            setParticipants(prev => prev.filter(p => p.id !== userId));
            break;
            
          case 'toggle_video':
            setParticipants(prev => 
              prev.map(p => p.id === userId ? { ...p, stream: isVideo ? undefined : p.stream } : p)
            );
            break;
        }
      })
      .subscribe();

    setCallChannel(channel);

    return () => {
      channel.unsubscribe();
    };
  }, [user, circleId]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInCall]);

  const startVoiceCall = async () => {
    if (!user || !callChannel) return;

    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      // Request microphone permission with better constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      setLocalStream(stream);
      setIsInCall(true);
      setIsVideoCall(false);
      setCallDuration(0);

      // Notify other participants
      callChannel.send({
        type: 'broadcast',
        event: 'call_update',
        payload: {
          type: 'join',
          userId: user.id,
          userName: user.user_metadata?.display_name || 'Unknown User',
          isVideo: false
        }
      });

      toast({
        title: "Voice Call Started",
        description: `Connected to ${circleName} voice channel`,
      });

    } catch (error: any) {
      console.error('Error starting voice call:', error);
      
      let errorMessage = "Could not access microphone.";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "Microphone access denied. Please allow microphone permission and try again.";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No microphone found. Please connect a microphone and try again.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Microphone is busy or unavailable. Please close other apps using the microphone.";
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = "Microphone constraints could not be satisfied.";
      }
      
      toast({
        title: "Call Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const startVideoCall = async () => {
    if (!user || !callChannel) return;

    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      // Request camera and microphone permission with better constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      });

      setLocalStream(stream);
      setIsInCall(true);
      setIsVideoCall(true);
      setCallDuration(0);

      // Notify other participants
      callChannel.send({
        type: 'broadcast',
        event: 'call_update',
        payload: {
          type: 'join',
          userId: user.id,
          userName: user.user_metadata?.display_name || 'Unknown User',
          isVideo: true
        }
      });

      toast({
        title: "Video Call Started",
        description: `Connected to ${circleName} video channel`,
      });

    } catch (error: any) {
      console.error('Error starting video call:', error);
      
      let errorMessage = "Could not access camera/microphone.";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "Camera/microphone access denied. Please allow permissions and try again.";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No camera/microphone found. Please connect devices and try again.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Camera/microphone is busy. Please close other apps using these devices.";
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = "Camera/microphone constraints could not be satisfied.";
      }
      
      toast({
        title: "Call Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const endCall = () => {
    if (!user || !callChannel) return;

    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    // Notify other participants
    callChannel.send({
      type: 'broadcast',
      event: 'call_update',
      payload: {
        type: 'leave',
        userId: user.id,
        userName: user.user_metadata?.display_name || 'Unknown User'
      }
    });

    setIsInCall(false);
    setIsVideoCall(false);
    setCallDuration(0);
    setParticipants([]);

    toast({
      title: "Call Ended",
      description: "You left the call",
    });
  };

  const toggleVideo = () => {
    if (!localStream || !callChannel || !user) return;

    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoCall(videoTrack.enabled);

      // Notify other participants
      callChannel.send({
        type: 'broadcast',
        event: 'call_update',
        payload: {
          type: 'toggle_video',
          userId: user.id,
          isVideo: videoTrack.enabled
        }
      });
    }
  };

  const toggleAudio = () => {
    if (!localStream) return;

    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
    }
  };

  const formatCallDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={className}>
      {!isInCall ? (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 hover:text-green-500"
            onClick={startVoiceCall}
            title="Start voice call"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 hover:text-blue-500"
            onClick={startVideoCall}
            title="Start video call"
          >
            <Video className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {formatCallDuration(callDuration)}
          </div>
          <div className="text-xs text-muted-foreground">
            {participants.length + 1} in call
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 text-red-500 hover:text-red-600"
            onClick={endCall}
            title="End call"
          >
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Video Call Modal for full video experience */}
      {isInCall && isVideoCall && (
        <VideoCallModal
          isOpen={true}
          onClose={endCall}
          localStream={localStream}
          remoteStream={null} // Group calls would need multiple streams
          remoteUserName={`${circleName} (${participants.length + 1} participants)`}
          onEndCall={endCall}
          onToggleVideo={toggleVideo}
          onToggleAudio={toggleAudio}
          isConnected={true}
          callDuration={callDuration}
        />
      )}
    </div>
  );
};