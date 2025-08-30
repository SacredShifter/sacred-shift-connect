import { useRef, useEffect } from 'react';
import { ActiveNode } from '../state/useShiftStore';
import { YouTubePlayerRef } from '@/components/media/YouTubePlayer';

// YouTube video mappings for each node
const NODE_VIDEO_MAPPINGS: Record<ActiveNode, string | null> = {
  cube: 'dQw4w9WgXcQ', // Example video IDs - replace with actual videos
  circle: 'dQw4w9WgXcQ',
  witness: 'dQw4w9WgXcQ', 
  eros: 'dQw4w9WgXcQ',
  butterfly: 'dQw4w9WgXcQ',
  justice: 'dQw4w9WgXcQ'
};

export const useYouTubeIntegration = () => {
  const playerRef = useRef<YouTubePlayerRef>(null);

  const handlePlayerReady = () => {
    console.log('🎬 YouTube player ready');
  };

  const handleStateChange = (state: number) => {
    console.log('🎬 YouTube player state change:', state);
  };

  const jumpToChapter = (node: ActiveNode) => {
    const videoId = NODE_VIDEO_MAPPINGS[node];
    if (playerRef.current && videoId) {
      console.log(`🎬 Jumping to chapter: ${node}, video: ${videoId}`);
      // Use the YouTube player's seekToChapter method
      // playerRef.current.seekToChapter(node as any);
    }
  };

  useEffect(() => {
    // Listen for chapter jumps manually for now
    const handleChapterJump = (event: any) => {
      jumpToChapter(event.detail.node);
    };
    
    window.addEventListener('shiftChapterJump', handleChapterJump);
    return () => window.removeEventListener('shiftChapterJump', handleChapterJump);
  }, []);

  return {
    playerRef,
    handlePlayerReady,
    handleStateChange,
    jumpToChapter
  };
};