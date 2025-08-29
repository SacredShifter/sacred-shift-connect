import { useState, useRef, useCallback, useEffect } from 'react';
import { useYouTubeAPI } from '@/hooks/useYouTubeAPI';
import { YouTubeVideo } from '@/types/youtube';
import { MEDITATION_MODULE_CONFIG } from '@/config/mediaMaps';

interface PlaylistSession {
  videos: YouTubeVideo[];
  currentIndex: number;
  totalDuration: number;
  targetDuration: number;
  startTime: number;
  isActive: boolean;
}

interface FadeController {
  start: () => void;
  stop: () => void;
  fadeOut: (duration?: number) => void;
  setVolume: (volume: number) => void;
}

export const useMeditationPlaylist = () => {
  const { getVideosFromPlaylistByTitle, loading } = useYouTubeAPI();
  const [currentSession, setCurrentSession] = useState<PlaylistSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const playerRef = useRef<any>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentVolumeRef = useRef<number>(0.3);

  // Initialize YouTube player for a given video
  const initializePlayer = useCallback((videoId: string, onReady?: () => void, onEnd?: () => void) => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    // Load YouTube API if not already loaded
    if (!(window as any).YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
      
      (window as any).onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    } else {
      createPlayer();
    }

    function createPlayer() {
      playerRef.current = new (window as any).YT.Player('youtube-player-container', {
        videoId,
        playerVars: {
          controls: 0,
          autoplay: 1,
          loop: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(0);
            fadeIn();
            onReady?.();
          },
          onStateChange: (event: any) => {
            if (event.data === 0) { // ended
              onEnd?.();
            }
          }
        }
      });
    }
  }, []);

  // Fade in audio smoothly
  const fadeIn = useCallback((targetVolume = 30) => {
    if (!playerRef.current) return;
    
    let volume = 0;
    const increment = targetVolume / 30; // 1 second fade in
    
    const interval = setInterval(() => {
      volume += increment;
      if (volume >= targetVolume) {
        volume = targetVolume;
        clearInterval(interval);
      }
      playerRef.current?.setVolume(volume);
      currentVolumeRef.current = volume / 100;
    }, 33); // ~30fps
  }, []);

  // Fade out audio smoothly
  const fadeOut = useCallback((duration = 3000) => {
    if (!playerRef.current) return Promise.resolve();
    
    return new Promise<void>((resolve) => {
      const currentVolume = playerRef.current.getVolume();
      const decrement = currentVolume / (duration / 33);
      let volume = currentVolume;
      
      const interval = setInterval(() => {
        volume -= decrement;
        if (volume <= 0) {
          volume = 0;
          playerRef.current?.setVolume(0);
          playerRef.current?.pauseVideo();
          clearInterval(interval);
          resolve();
        } else {
          playerRef.current?.setVolume(volume);
        }
        currentVolumeRef.current = volume / 100;
      }, 33);
    });
  }, []);

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = useCallback((array: any[]): any[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Parse YouTube duration (PT4M13S format) to seconds
  const parseDuration = useCallback((duration: string): number => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }, []);

  // Create optimized playlist for target duration
  const createOptimalPlaylist = useCallback((videos: YouTubeVideo[], targetDurationMinutes: number): YouTubeVideo[] => {
    const targetSeconds = targetDurationMinutes * 60;
    const shuffledVideos = shuffleArray(videos);
    const playlist: YouTubeVideo[] = [];
    let totalDuration = 0;

    // First pass: add videos that fit within target duration
    for (const video of shuffledVideos) {
      const videoDuration = parseDuration(video.duration);
      if (totalDuration + videoDuration <= targetSeconds) {
        playlist.push(video);
        totalDuration += videoDuration;
      }
    }

    // Second pass: if we're short, loop through videos again
    if (totalDuration < targetSeconds * 0.8) { // If less than 80% of target
      const remainingTime = targetSeconds - totalDuration;
      const additionalVideos = shuffledVideos.filter(v => 
        parseDuration(v.duration) <= remainingTime
      );
      
      for (const video of additionalVideos) {
        const videoDuration = parseDuration(video.duration);
        if (totalDuration + videoDuration <= targetSeconds) {
          playlist.push(video);
          totalDuration += videoDuration;
        }
      }
    }

    return playlist;
  }, [shuffleArray, parseDuration]);

  // Load playlist for meditation practice
  const loadPlaylistForPractice = useCallback(async (
    practiceName: string, 
    durationMinutes: number
  ): Promise<YouTubeVideo[]> => {
    setError(null);
    
    try {
      // First try to find playlist with exact practice name
      let playlistData = await getVideosFromPlaylistByTitle(practiceName, 50);
      
      // If no playlist found, fall back to default
      if (!playlistData.videos || playlistData.videos.length === 0) {
        console.log(`No playlist found for "${practiceName}", using default playlist`);
        playlistData = await getVideosFromPlaylistByTitle(
          MEDITATION_MODULE_CONFIG.playlistTitle, 
          50
        );
      }

      if (!playlistData.videos || playlistData.videos.length === 0) {
        throw new Error('No meditation audio content available');
      }

      // Create optimized playlist for target duration
      const optimizedPlaylist = createOptimalPlaylist(playlistData.videos, durationMinutes);
      
      if (optimizedPlaylist.length === 0) {
        throw new Error('Unable to create playlist for the selected duration');
      }

      return optimizedPlaylist;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load meditation playlist';
      setError(errorMessage);
      throw error;
    }
  }, [getVideosFromPlaylistByTitle, createOptimalPlaylist]);

  // Start meditation session with playlist
  const startMeditationSession = useCallback(async (
    practiceName: string,
    durationMinutes: number,
    onVideoChange?: (video: YouTubeVideo, index: number) => void,
    onSessionComplete?: () => void
  ) => {
    try {
      const playlist = await loadPlaylistForPractice(practiceName, durationMinutes);
      
      const session: PlaylistSession = {
        videos: playlist,
        currentIndex: 0,
        totalDuration: 0,
        targetDuration: durationMinutes * 60,
        startTime: Date.now(),
        isActive: true
      };

      setCurrentSession(session);

      // Start playing first video
      if (playlist.length > 0) {
        await playVideoFromSession(session, 0, onVideoChange, onSessionComplete);
      }

      return session;
    } catch (error) {
      console.error('Error starting meditation session:', error);
      throw error;
    }
  }, [loadPlaylistForPractice]);

  // Play specific video from session
  const playVideoFromSession = useCallback(async (
    session: PlaylistSession,
    index: number,
    onVideoChange?: (video: YouTubeVideo, index: number) => void,
    onSessionComplete?: () => void
  ) => {
    if (index >= session.videos.length) {
      // Session complete
      setCurrentSession(prev => prev ? { ...prev, isActive: false } : null);
      onSessionComplete?.();
      return;
    }

    const video = session.videos[index];
    const elapsedTime = (Date.now() - session.startTime) / 1000;
    const remainingTime = session.targetDuration - elapsedTime;

    // If we're near the end, start fade out
    if (remainingTime <= 5) {
      await fadeOut(remainingTime * 1000);
      onSessionComplete?.();
      return;
    }

    onVideoChange?.(video, index);

    initializePlayer(
      video.id,
      () => {
        console.log(`Now playing: ${video.title}`);
      },
      () => {
        // Video ended, play next
        const nextIndex = index + 1;
        setCurrentSession(prev => 
          prev ? { ...prev, currentIndex: nextIndex } : null
        );
        playVideoFromSession(session, nextIndex, onVideoChange, onSessionComplete);
      }
    );
  }, [initializePlayer, fadeOut]);

  // Stop current session
  const stopSession = useCallback(async () => {
    if (currentSession) {
      await fadeOut(2000);
      setCurrentSession(null);
    }
    
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, [currentSession, fadeOut]);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume * 100);
      currentVolumeRef.current = volume;
    }
  }, []);

  // Get current session info
  const getSessionInfo = useCallback(() => {
    if (!currentSession) return null;
    
    const elapsedTime = (Date.now() - currentSession.startTime) / 1000;
    const progress = (elapsedTime / currentSession.targetDuration) * 100;
    const remainingTime = Math.max(0, currentSession.targetDuration - elapsedTime);
    
    return {
      currentVideo: currentSession.videos[currentSession.currentIndex],
      progress,
      remainingTime,
      isActive: currentSession.isActive,
      totalVideos: currentSession.videos.length,
      currentIndex: currentSession.currentIndex
    };
  }, [currentSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  return {
    loading,
    error,
    currentSession,
    startMeditationSession,
    stopSession,
    setVolume,
    getSessionInfo,
    fadeOut
  };
};