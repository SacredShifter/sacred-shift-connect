// YouTube IFrame API wrapper for Sacred Ventilation playlist

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export interface YouTubePlayerOptions {
  onReady?: () => void;
  onStateChange?: (state: number) => void;
  onError?: (error: number) => void;
}

export class YouTubePlaylistPlayer {
  private player: any = null;
  private isAPIReady = false;
  private containerId: string;
  private playlistId: string;
  private options: YouTubePlayerOptions;
  
  constructor(containerId: string, playlistId: string, options: YouTubePlayerOptions = {}) {
    this.containerId = containerId;
    this.playlistId = playlistId;
    this.options = options;
    
    this.initializeAPI();
  }

  private async initializeAPI() {
    // Check if YouTube API is already loaded
    if (window.YT && window.YT.Player) {
      this.isAPIReady = true;
      this.createPlayer();
      return;
    }

    // Load YouTube IFrame API
    return new Promise<void>((resolve) => {
      // Set global callback for when API is ready
      window.onYouTubeIframeAPIReady = () => {
        this.isAPIReady = true;
        this.createPlayer();
        resolve();
      };

      // Check if script is already being loaded
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }

  private createPlayer() {
    if (!this.isAPIReady || !window.YT?.Player) return;

    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with ID "${this.containerId}" not found`);
      return;
    }

    this.player = new window.YT.Player(this.containerId, {
      height: '0',
      width: '0',
      playerVars: {
        listType: 'playlist',
        list: this.playlistId,
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        loop: 1,
        shuffle: 1, // Shuffle playlist
      },
      events: {
        onReady: (event: any) => {
          console.log('YouTube player ready');
          // Start muted to comply with autoplay policies
          event.target.mute();
          this.options.onReady?.();
        },
        onStateChange: (event: any) => {
          this.options.onStateChange?.(event.data);
          
          // Handle playlist end - restart with shuffle
          if (event.data === window.YT.PlayerState.ENDED) {
            this.shuffleAndPlay();
          }
        },
        onError: (event: any) => {
          console.error('YouTube player error:', event.data);
          this.options.onError?.(event.data);
        }
      }
    });
  }

  public async play() {
    if (!this.player?.playVideo) {
      console.warn('YouTube player not ready');
      return;
    }

    try {
      // Unmute and play
      this.player.unMute();
      this.player.setVolume(30); // Start at moderate volume
      await this.player.playVideo();
    } catch (error) {
      console.error('Failed to play YouTube playlist:', error);
    }
  }

  public pause() {
    if (this.player?.pauseVideo) {
      this.player.pauseVideo();
    }
  }

  public stop() {
    if (this.player?.stopVideo) {
      this.player.stopVideo();
    }
  }

  public mute() {
    if (this.player?.mute) {
      this.player.mute();
    }
  }

  public unmute() {
    if (this.player?.unMute) {
      this.player.unMute();
    }
  }

  public setVolume(volume: number) {
    if (this.player?.setVolume) {
      this.player.setVolume(Math.max(0, Math.min(100, volume)));
    }
  }

  public getVolume(): number {
    return this.player?.getVolume?.() || 0;
  }

  public shuffleAndPlay() {
    if (this.player?.setShuffle) {
      this.player.setShuffle(true);
      this.player.nextVideo();
      this.play();
    }
  }

  public nextTrack() {
    if (this.player?.nextVideo) {
      this.player.nextVideo();
    }
  }

  public previousTrack() {
    if (this.player?.previousVideo) {
      this.player.previousVideo();
    }
  }

  public getCurrentTime(): number {
    return this.player?.getCurrentTime?.() || 0;
  }

  public getDuration(): number {
    return this.player?.getDuration?.() || 0;
  }

  public getPlayerState(): number {
    return this.player?.getPlayerState?.() || -1;
  }

  public destroy() {
    if (this.player?.destroy) {
      this.player.destroy();
      this.player = null;
    }
  }

  public isPlaying(): boolean {
    return this.getPlayerState() === window.YT?.PlayerState?.PLAYING;
  }

  public isPaused(): boolean {
    return this.getPlayerState() === window.YT?.PlayerState?.PAUSED;
  }
}

// Factory function for easier usage
export function createPlaylistPlayer(
  containerId: string, 
  playlistId: string, 
  options: YouTubePlayerOptions = {}
): YouTubePlaylistPlayer {
  return new YouTubePlaylistPlayer(containerId, playlistId, options);
}

// Utility to extract playlist ID from YouTube URL
export function extractPlaylistId(url: string): string | null {
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Player state constants for convenience
export const PLAYER_STATES = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
} as const;