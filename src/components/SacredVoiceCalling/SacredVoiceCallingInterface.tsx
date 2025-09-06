// Sacred Voice Calling Interface
// Connects RecipientPicker → CallPreview → SacredVoiceCalling flow
// Implements the complete WebRTC calling experience with consciousness awareness

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Users,
  Settings,
  X,
  CheckCircle,
  AlertTriangle,
  Zap,
  Heart,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { RecipientPicker } from '@/components/SacredCalling/RecipientPicker';
import { CallPreview } from '@/components/SacredCalling/CallPreview';
import { SacredVoiceCalling } from '@/lib/connectivity/SacredVoiceCalling';
import { SSUC } from '@/lib/connectivity/SacredShifterUniversalConnectivity';

interface SacredRecipient {
  id: string;
  name: string;
  avatar?: string;
  consciousnessLevel: number;
  sovereigntyLevel: number;
  resonanceFrequency: number;
  circleId?: string;
  circleName?: string;
  isOnline: boolean;
  lastSeen: string;
  sacredCapabilities: string[];
  resonanceMatch: number;
  isCallable: boolean;
  callabilityReason?: string;
}

interface SacredVoiceCallingInterfaceProps {
  className?: string;
}

export const SacredVoiceCallingInterface: React.FC<SacredVoiceCallingInterfaceProps> = ({
  className = ''
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [isRecipientPickerOpen, setIsRecipientPickerOpen] = useState(false);
  const [isCallPreviewOpen, setIsCallPreviewOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<SacredRecipient | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Consciousness and sovereignty levels (would come from user profile)
  const [currentUserConsciousness] = useState(0.7);
  const [currentUserSovereignty] = useState(0.8);
  const [currentUserResonance] = useState(432);
  
  // Sacred Voice Calling system
  const [sacredVoiceCalling, setSacredVoiceCalling] = useState<SacredVoiceCalling | null>(null);
  const [ssuC, setSsuC] = useState<SSUC | null>(null);

  // Initialize Sacred Voice Calling system
  useEffect(() => {
    const initializeVoiceCalling = async () => {
      try {
        // Initialize SSUC
        const ssuCInstance = new SSUC();
        await ssuCInstance.initialize();
        setSsuC(ssuCInstance);

        // Initialize Sacred Voice Calling
        const voiceCallingConfig = {
          sampleRate: 48000,
          bitRate: 128000,
          channels: 2,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          enableResonanceFiltering: true,
          enableConsciousnessTone: true,
          enableSacredFrequencies: true,
          enableAuraVoiceAnalysis: true,
          enableAdaptiveBitrate: true,
          enableJitterBuffer: true,
          enablePacketLossRecovery: true,
          maxLatency: 200,
          enableQuantumAudio: true,
          enableLightPulseAudio: true,
          enableFrequencyWaveAudio: true,
          enableNatureWhisperAudio: true
        };

        const voiceCallingInstance = new SacredVoiceCalling(ssuCInstance, voiceCallingConfig);
        await voiceCallingInstance.initialize();
        setSacredVoiceCalling(voiceCallingInstance);

        console.log('🎤 Sacred Voice Calling Interface initialized');
      } catch (error) {
        console.error('❌ Failed to initialize Sacred Voice Calling:', error);
        toast({
          title: "Initialization Error",
          description: "Failed to initialize voice calling system",
          variant: "destructive"
        });
      }
    };

    if (user) {
      initializeVoiceCalling();
    }

    return () => {
      if (sacredVoiceCalling) {
        sacredVoiceCalling.shutdown();
      }
      if (ssuC) {
        ssuC.shutdown();
      }
    };
  }, [user, toast]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive && isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive, isConnected]);

  // Handle recipient selection
  const handleRecipientSelected = useCallback((recipient: SacredRecipient) => {
    setSelectedRecipient(recipient);
    setIsRecipientPickerOpen(false);
    setIsCallPreviewOpen(true);
  }, []);

  // Handle call initiation
  const handleStartCall = useCallback(async (recipient: SacredRecipient) => {
    if (!sacredVoiceCalling) {
      toast({
        title: "Error",
        description: "Voice calling system not initialized",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCallPreviewOpen(false);
      setIsCallActive(true);
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      
      // Initiate call
      const newCallId = await sacredVoiceCalling.initiateCall([recipient.id], currentUserConsciousness);
      setCallId(newCallId);
      
      toast({
        title: "Call Initiated",
        description: `Calling ${recipient.name}...`
      });
      
    } catch (error) {
      console.error('❌ Failed to start call:', error);
      toast({
        title: "Call Failed",
        description: "Could not start call. Please check permissions.",
        variant: "destructive"
      });
      setIsCallActive(false);
    }
  }, [sacredVoiceCalling, currentUserConsciousness, toast]);

  // Handle call end
  const handleEndCall = useCallback(async () => {
    if (sacredVoiceCalling && callId) {
      try {
        await sacredVoiceCalling.endCall(callId);
        
        // Stop local stream
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
        }
        
        setIsCallActive(false);
        setCallId(null);
        setCallDuration(0);
        setLocalStream(null);
        setRemoteStream(null);
        setIsConnected(false);
        setSelectedRecipient(null);
        
        toast({
          title: "Call Ended",
          description: "Call has been ended"
        });
      } catch (error) {
        console.error('❌ Failed to end call:', error);
      }
    }
  }, [sacredVoiceCalling, callId, localStream, toast]);

  // Handle mute toggle
  const handleToggleMute = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  }, [localStream, isMuted]);

  // Handle video toggle
  const handleToggleVideo = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [localStream, isVideoEnabled]);

  // Format call duration
  const formatCallDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
        <p className="text-muted-foreground">
          Please sign in to access sacred voice calling features
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Sacred Voice Calling</h2>
              <p className="text-sm text-muted-foreground">
                Consciousness-aware voice communication
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {currentUserConsciousness * 100}% consciousness
            </Badge>
            <Badge variant="outline" className="text-xs">
              {currentUserSovereignty * 100}% sovereignty
            </Badge>
          </div>
        </div>
      </Card>

      {/* Call Interface */}
      {isCallActive ? (
        <Card className="p-6">
          <div className="text-center space-y-4">
            {/* Call Status */}
            <div className="flex items-center justify-center gap-2">
              {isConnected ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              )}
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>

            {/* Call Duration */}
            {isConnected && (
              <div className="text-2xl font-mono">
                {formatCallDuration(callDuration)}
              </div>
            )}

            {/* Remote User Info */}
            {selectedRecipient && (
              <div className="flex items-center justify-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedRecipient.avatar} />
                  <AvatarFallback>
                    {selectedRecipient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-semibold">{selectedRecipient.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedRecipient.circleName}
                  </div>
                </div>
              </div>
            )}

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="sm"
                onClick={handleToggleMute}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <Button
                variant={isVideoEnabled ? "default" : "outline"}
                size="sm"
                onClick={handleToggleVideo}
              >
                {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleEndCall}
              >
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* Call Initiation */
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Initiate Sacred Call</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Connect with souls through consciousness-aware voice communication
            </p>
            
            <Button
              onClick={() => setIsRecipientPickerOpen(true)}
              className="w-full"
              size="lg"
            >
              <PhoneCall className="w-4 h-4 mr-2" />
              Select Sacred Recipient
            </Button>
          </div>
        </Card>
      )}

      {/* Recipient Picker Modal */}
      <RecipientPicker
        isOpen={isRecipientPickerOpen}
        onClose={() => setIsRecipientPickerOpen(false)}
        onRecipientSelected={handleRecipientSelected}
        currentUserConsciousness={currentUserConsciousness}
        currentUserSovereignty={currentUserSovereignty}
      />

      {/* Call Preview Modal */}
      <CallPreview
        isOpen={isCallPreviewOpen}
        recipient={selectedRecipient}
        onClose={() => setIsCallPreviewOpen(false)}
        onStartCall={handleStartCall}
        currentUserConsciousness={currentUserConsciousness}
        currentUserSovereignty={currentUserSovereignty}
        currentUserResonance={currentUserResonance}
      />
    </div>
  );
};

export default SacredVoiceCallingInterface;