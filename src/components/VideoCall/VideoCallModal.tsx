import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  remoteUserName?: string;
  remoteUserAvatar?: string;
  onEndCall: () => void;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  isConnected: boolean;
  callDuration?: number;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  localStream,
  remoteStream,
  remoteUserName = 'Unknown User',
  remoteUserAvatar,
  onEndCall,
  onToggleVideo,
  onToggleAudio,
  isConnected,
  callDuration = 0
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Setup local video stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      console.log('Setting up local video stream', localStream);
      console.log('Video tracks:', localStream.getVideoTracks());
      localVideoRef.current.srcObject = localStream;
      
      // Ensure video plays
      localVideoRef.current.play().catch(error => {
        console.error('Error playing local video:', error);
      });
    }
  }, [localStream]);

  // Setup remote video stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Monitor track states
  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];
      
      // Update video enabled state based on track existence and enabled status
      setIsVideoEnabled(videoTrack ? videoTrack.enabled : false);
      setIsAudioEnabled(audioTrack ? audioTrack.enabled : false);

      console.log('Video track found:', !!videoTrack);
      console.log('Video track enabled:', videoTrack?.enabled);
      console.log('Audio track found:', !!audioTrack);
      console.log('Audio track enabled:', audioTrack?.enabled);
    } else {
      setIsVideoEnabled(false);
      setIsAudioEnabled(false);
      console.log('No local stream available');
    }
  }, [localStream]);

  const handleToggleVideo = () => {
    console.log('Toggling video, current state:', isVideoEnabled);
    onToggleVideo();
    
    // Update state immediately, then sync with actual track state
    setTimeout(() => {
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          setIsVideoEnabled(videoTrack.enabled);
          console.log('Video toggled, new state:', videoTrack.enabled);
        }
      }
    }, 100);
  };

  const handleToggleAudio = () => {
    onToggleAudio();
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleEndCall = () => {
    onEndCall();
    onClose();
    toast({
      title: "Call Ended",
      description: "Video call has been terminated."
    });
  };

  const formatCallDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'w-screen h-screen max-w-none' : 'max-w-4xl'} p-0 bg-black`}>
        <div className="relative w-full h-full min-h-[600px] bg-gradient-to-br from-background to-background/80 overflow-hidden">
          
          {/* Header */}
          <DialogHeader className="absolute top-0 left-0 right-0 z-20 p-4 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={remoteUserAvatar} />
                  <AvatarFallback>{remoteUserName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-white">{remoteUserName}</DialogTitle>
                  <p className="text-sm text-white/70">
                    {isConnected ? formatCallDuration(callDuration) : 'Connecting...'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Remote Video (Main) */}
          <div className="relative w-full h-full">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-900">
                <div className="text-center text-white">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={remoteUserAvatar} />
                    <AvatarFallback className="text-2xl">{remoteUserName[0]}</AvatarFallback>
                  </Avatar>
                  <p className="text-lg">{remoteUserName}</p>
                  <p className="text-sm text-white/70">
                    {isConnected ? 'Video disabled' : 'Connecting...'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-20 right-4 z-10 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-white/20">
            {localStream ? (
              <>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transform scale-x-[-1] ${
                    isVideoEnabled ? 'block' : 'hidden'
                  }`}
                />
                {!isVideoEnabled && (
                  <div className="flex items-center justify-center w-full h-full bg-gray-800">
                    <div className="text-center text-white">
                      <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs opacity-70">Video Off</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-800">
                <div className="text-center text-white">
                  <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs opacity-70">No Stream</p>
                </div>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-6">
              
              {/* Toggle Audio */}
              <Button
                variant={isAudioEnabled ? "secondary" : "destructive"}
                size="lg"
                onClick={handleToggleAudio}
                className="h-14 w-14 rounded-full"
              >
                {isAudioEnabled ? (
                  <Mic className="h-6 w-6" />
                ) : (
                  <MicOff className="h-6 w-6" />
                )}
              </Button>

              {/* End Call */}
              <Button
                variant="destructive"
                size="lg"
                onClick={handleEndCall}
                className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
              >
                <PhoneOff className="h-8 w-8" />
              </Button>

              {/* Toggle Video */}
              <Button
                variant={isVideoEnabled ? "secondary" : "destructive"}
                size="lg"
                onClick={handleToggleVideo}
                className="h-14 w-14 rounded-full"
              >
                {isVideoEnabled ? (
                  <Video className="h-6 w-6" />
                ) : (
                  <VideoOff className="h-6 w-6" />
                )}
              </Button>

            </div>
          </div>

          {/* Connection Status */}
          {!isConnected && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30">
              <div className="text-center text-white">
                <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg">Connecting to {remoteUserName}...</p>
                <p className="text-sm text-white/70">Please wait while we establish the connection</p>
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
};