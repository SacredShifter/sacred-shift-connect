import React, { useEffect, useRef } from 'react';
import { useMeditationPlaylist } from '@/hooks/useMeditationPlaylist';

interface MeditationPlaylistIntegrationProps {
  isActive: boolean;
  practiceName: string;
  durationMinutes: number;
  volume: number;
  onVideoChange?: (title: string) => void;
  onError?: (error: string) => void;
}

export const MeditationPlaylistIntegration: React.FC<MeditationPlaylistIntegrationProps> = ({
  isActive,
  practiceName,
  durationMinutes,
  volume,
  onVideoChange,
  onError
}) => {
  const {
    startMeditationSession,
    stopSession,
    setVolume,
    getSessionInfo,
    loading,
    error,
    currentSession
  } = useMeditationPlaylist();

  const containerRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  // Handle volume changes
  useEffect(() => {
    setVolume(volume / 100);
  }, [volume, setVolume]);

  // Handle session start/stop
  useEffect(() => {
    if (isActive && !hasStarted.current && practiceName) {
      hasStarted.current = true;
      startMeditationSession(
        practiceName,
        durationMinutes,
        (video, index) => {
          onVideoChange?.(video.title);
        },
        () => {
          hasStarted.current = false;
        }
      ).catch(error => {
        console.error('Failed to start meditation playlist:', error);
        onError?.(error.message || 'Failed to load meditation audio');
        hasStarted.current = false;
      });
    } else if (!isActive && hasStarted.current) {
      hasStarted.current = false;
      stopSession();
    }
  }, [isActive, practiceName, durationMinutes, startMeditationSession, stopSession, onVideoChange, onError]);

  // Handle errors
  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  return (
    <>
      {/* Hidden YouTube player container */}
      <div 
        id="youtube-player-container"
        ref={containerRef}
        style={{ display: 'none' }}
      />
      
      {/* Session info for debugging */}
      {currentSession && (
        <div className="fixed bottom-4 left-4 text-xs text-white/60 bg-black/20 p-2 rounded z-50">
          <div>Active: {currentSession.isActive ? 'Yes' : 'No'}</div>
          <div>Videos: {currentSession.videos.length}</div>
          <div>Current: {currentSession.currentIndex + 1}</div>
        </div>
      )}
    </>
  );
};