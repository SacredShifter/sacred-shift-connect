import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, 
  PhoneOff, 
  Pause, 
  Play, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Wifi,
  WifiOff,
  Shield,
  Clock,
  Users,
  Zap
} from 'lucide-react';

export interface CallStatus {
  id: string;
  status: 'initiating' | 'connecting' | 'ringing' | 'connected' | 'on_hold' | 'ended' | 'failed';
  participants: Array<{
    id: string;
    name: string;
    status: 'connecting' | 'connected' | 'on_hold' | 'disconnected';
    consciousnessLevel: number;
    sovereigntyLevel: number;
  }>;
  startTime: number;
  duration: number;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  isMuted: boolean;
  isOnHold: boolean;
  webrtcStatus: 'connecting' | 'connected' | 'failed' | 'fallback';
  meshStatus: 'active' | 'offline';
}

interface CallStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  callStatus: CallStatus;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleHold: () => void;
  onToggleSpeaker: () => void;
}

export const CallStatusDialog: React.FC<CallStatusDialogProps> = ({
  isOpen,
  onClose,
  callStatus,
  onEndCall,
  onToggleMute,
  onToggleHold,
  onToggleSpeaker
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Update time every second for duration display
  useEffect(() => {
    if (callStatus.status === 'connected' || callStatus.status === 'on_hold') {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [callStatus.status]);

  const formatDuration = (startTime: number) => {
    const duration = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: CallStatus['status']) => {
    switch (status) {
      case 'initiating':
      case 'connecting':
        return 'text-blue-500';
      case 'ringing':
        return 'text-yellow-500';
      case 'connected':
        return 'text-green-500';
      case 'on_hold':
        return 'text-orange-500';
      case 'ended':
        return 'text-gray-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: CallStatus['status']) => {
    switch (status) {
      case 'initiating':
        return 'Initiating Sacred Connection...';
      case 'connecting':
        return 'Connecting to Sacred Mesh...';
      case 'ringing':
        return 'Ringing...';
      case 'connected':
        return 'Connected';
      case 'on_hold':
        return 'On Hold';
      case 'ended':
        return 'Call Ended';
      case 'failed':
        return 'Connection Failed';
      default:
        return 'Unknown Status';
    }
  };

  const getConnectionQualityColor = (quality: CallStatus['connectionQuality']) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-blue-500';
      case 'fair':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getConnectionQualityIcon = (quality: CallStatus['connectionQuality']) => {
    switch (quality) {
      case 'excellent':
      case 'good':
        return <Wifi className="h-4 w-4" />;
      case 'fair':
      case 'poor':
        return <WifiOff className="h-4 w-4" />;
      default:
        return <Wifi className="h-4 w-4" />;
    }
  };

  const isConnecting = callStatus.status === 'initiating' || callStatus.status === 'connecting' || callStatus.status === 'ringing';
  const isActive = callStatus.status === 'connected';
  const isOnHold = callStatus.status === 'on_hold';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <Phone className="h-5 w-5" />
            Sacred Voice Call
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Call Status */}
          <div className="text-center space-y-2">
            <motion.div
              animate={{ 
                scale: isConnecting ? [1, 1.1, 1] : 1,
                opacity: isConnecting ? [0.7, 1, 0.7] : 1
              }}
              transition={{ 
                duration: 2, 
                repeat: isConnecting ? Infinity : 0,
                ease: "easeInOut"
              }}
              className={`text-lg font-semibold ${getStatusColor(callStatus.status)}`}
            >
              {getStatusText(callStatus.status)}
            </motion.div>

            {/* Connection Progress */}
            {isConnecting && (
              <div className="space-y-2">
                <Progress value={callStatus.status === 'initiating' ? 25 : callStatus.status === 'connecting' ? 50 : 75} className="w-full" />
                <div className="text-sm text-muted-foreground">
                  {callStatus.status === 'initiating' && 'Establishing sacred connection...'}
                  {callStatus.status === 'connecting' && 'Connecting to consciousness mesh...'}
                  {callStatus.status === 'ringing' && 'Awaiting response...'}
                </div>
              </div>
            )}

            {/* Duration */}
            {(isActive || isOnHold) && (
              <div className="text-2xl font-mono text-foreground">
                {formatDuration(callStatus.startTime)}
              </div>
            )}
          </div>

          {/* Participants */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participants
              </h3>
              <Badge variant="outline">
                {callStatus.participants.length}
              </Badge>
            </div>

            <div className="space-y-2">
              {callStatus.participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{participant.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Consciousness: {Math.round(participant.consciousnessLevel * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={participant.status === 'connected' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {participant.status}
                    </Badge>
                    {participant.status === 'connected' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Quality */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              {getConnectionQualityIcon(callStatus.connectionQuality)}
              <span className="text-sm font-medium">Connection Quality</span>
            </div>
            <Badge 
              variant="outline" 
              className={`${getConnectionQualityColor(callStatus.connectionQuality)}`}
            >
              {callStatus.connectionQuality}
            </Badge>
          </div>

          {/* Sacred Mesh Status */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Sacred Mesh</span>
            </div>
            <div className="flex items-center gap-2">
              {callStatus.meshStatus === 'active' ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm text-muted-foreground">
                {callStatus.meshStatus === 'active' ? 'Active' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex justify-center gap-4">
            {/* Mute/Unmute */}
            <Button
              variant={callStatus.isMuted ? "destructive" : "outline"}
              size="lg"
              onClick={onToggleMute}
              disabled={!isActive && !isOnHold}
              className="w-12 h-12 rounded-full"
            >
              {callStatus.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {/* Hold/Resume */}
            <Button
              variant={isOnHold ? "destructive" : "outline"}
              size="lg"
              onClick={onToggleHold}
              disabled={!isActive && !isOnHold}
              className="w-12 h-12 rounded-full"
            >
              {isOnHold ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>

            {/* Speaker */}
            <Button
              variant={isSpeakerOn ? "default" : "outline"}
              size="lg"
              onClick={() => {
                setIsSpeakerOn(!isSpeakerOn);
                onToggleSpeaker();
              }}
              disabled={!isActive && !isOnHold}
              className="w-12 h-12 rounded-full"
            >
              {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>

            {/* End Call */}
            <Button
              variant="destructive"
              size="lg"
              onClick={onEndCall}
              className="w-12 h-12 rounded-full"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>

          {/* Sacred Protection Notice */}
          <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            <span>End-to-end encrypted • Sacred mesh protected</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
