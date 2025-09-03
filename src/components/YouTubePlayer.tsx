import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface YouTubePlayerRef {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  destroy: () => void;
}

interface YouTubePlayerProps {
  videoId: string;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
  onError?: (error: number) => void;
  className?: string;
}

interface YouTubeEvent {
  target: {
    playVideo: () => void;
    pauseVideo: () => void;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
    setVolume: (volume: number) => void;
    getVolume: () => number;
    destroy: () => void;
  };
  data?: number;
}

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  ({ videoId, onReady, onStateChange, onError, className = "" }, ref) => {
    const playerRef = useRef<YouTubeEvent['target'] | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current?.playVideo(),
      pause: () => playerRef.current?.pauseVideo(),
      seekTo: (seconds: number) => playerRef.current?.seekTo(seconds, true),
      setVolume: (volume: number) => playerRef.current?.setVolume(volume),
      getVolume: () => playerRef.current?.getVolume() || 0,
      destroy: () => playerRef.current?.destroy(),
    }));

    useEffect(() => {
      // Load YouTube API if not already loaded
      if (!(window as Record<string, unknown>).YT) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);
        
        (window as Record<string, unknown>).onYouTubeIframeAPIReady = createPlayer;
      } else {
        createPlayer();
      }

      function createPlayer() {
        if (!containerRef.current) return;

        playerRef.current = new (window as Record<string, unknown>).YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            controls: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            fs: 1,
          },
          events: {
            onReady: (event: YouTubeEvent) => {
              playerRef.current = event.target;
              onReady?.();
            },
            onStateChange: (event: YouTubeEvent) => {
              onStateChange?.(event.data || 0);
            },
            onError: (event: YouTubeEvent) => {
              onError?.(event.data || 0);
            },
          },
        });
      }

      return () => {
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      };
    }, [videoId, onReady, onStateChange, onError]);

    return (
      <div 
        ref={containerRef}
        className={`youtube-player-container bg-muted rounded-lg overflow-hidden flex items-center justify-center ${className}`}
        style={{ minHeight: '200px' }}
      >
        <div className="text-muted-foreground">Loading YouTube player...</div>
      </div>
    );
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';
