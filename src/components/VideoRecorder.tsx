import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Square, Play, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VideoRecorderProps {
  onVideoComplete: (videoBlob: Blob) => void;
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ onVideoComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // Display preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Prevent feedback
      }

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        
        // Create preview URL
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        
        // Stop and cleanup stream first
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        // Set up video element for playback
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = url;
            videoRef.current.muted = false;
            videoRef.current.load(); // Force reload
          }
        }, 100);
      };

      // Start recording
      mediaRecorder.start(100); // Record in 100ms chunks
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) { // Max 30 seconds
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      // Store timer reference
      (mediaRecorder as any).timer = timer;

      toast({
        title: "Recording Started",
        description: "Sacred moments being captured ✨"
      });

    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Failed",
        description: "Please grant camera and microphone permissions",
        variant: "destructive"
      });
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Clear timer
      const timer = (mediaRecorderRef.current as any).timer;
      if (timer) {
        clearInterval(timer);
      }
      
      setIsRecording(false);
      
      toast({
        title: "Recording Complete",
        description: "Sacred video ready to share 🎬"
      });
    }
  }, [isRecording]);

  const useVideo = () => {
    if (recordedBlob) {
      onVideoComplete(recordedBlob);
      
      // Cleanup
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setRecordedBlob(null);
      setPreviewUrl(null);
      setRecordingTime(0);
    }
  };

  const retakeVideo = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setRecordedBlob(null);
    setPreviewUrl(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (recordedBlob) {
    // Show preview and options
    return (
      <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-background/50">
        <div className="relative w-full max-w-md mx-auto">
          <video
            ref={videoRef}
            className="w-full h-auto rounded-lg bg-black"
            controls
            playsInline
            style={{ minHeight: '200px' }}
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            Duration: {formatTime(recordingTime)}
          </div>
        </div>
        
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={retakeVideo}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake
          </Button>
          <Button
            onClick={useVideo}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            <Play className="w-4 h-4 mr-2" />
            Use Video
          </Button>
        </div>
      </div>
    );
  }

  if (isRecording) {
    // Show recording interface
    return (
      <div className="space-y-3 p-4 border border-red-300 rounded-lg bg-red-50/50 dark:bg-red-900/20">
        <div className="relative w-full max-w-md mx-auto">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto rounded-lg bg-black"
            style={{ 
              minHeight: '200px',
              transform: 'scaleX(-1)' // Mirror effect for selfie view
            }}
          />
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-mono flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            REC {formatTime(recordingTime)}
          </div>
          {recordingTime >= 25 && (
            <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white p-2 rounded text-sm text-center">
              {30 - recordingTime}s remaining (max 30s)
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <Button
            variant="destructive"
            onClick={stopRecording}
            className="animate-pulse"
          >
            <Square className="w-4 h-4 mr-2 fill-current" />
            Stop Recording
          </Button>
        </div>
      </div>
    );
  }

  // Show start recording button
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={startRecording}
      className="text-muted-foreground hover:text-foreground"
    >
      <Video className="w-4 h-4" />
    </Button>
  );
};