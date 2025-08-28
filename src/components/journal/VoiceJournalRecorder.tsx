import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceJournalRecorderProps {
  onTranscription: (text: string) => void;
}

export const VoiceJournalRecorder: React.FC<VoiceJournalRecorderProps> = ({
  onTranscription
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // In a real implementation, this would send to a speech-to-text service
      // For now, we'll simulate the transcription process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transcription - in production, use actual speech-to-text API
      const mockTranscriptions = [
        "I feel a deep sense of transformation happening within me today.",
        "There's a resistance I notice when I try to step into my power.",
        "The meditation revealed layers of old patterns ready to be released.",
        "I'm grateful for the clarity that emerged from this morning's practice.",
        "Something is shifting in my consciousness, like awakening from a dream."
      ];
      
      const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      onTranscription(transcription);
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Badge variant="secondary" className="animate-pulse">
              Processing...
            </Badge>
          </motion.div>
        ) : isRecording ? (
          <motion.div
            key="recording"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Button
                variant="destructive"
                size="sm"
                onClick={stopRecording}
                className="rounded-full"
              >
                <Square className="h-4 w-4" />
              </Button>
            </motion.div>
            <Badge variant="destructive" className="animate-pulse">
              Recording...
            </Badge>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={startRecording}
              className="rounded-full"
              title="Voice to text"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};