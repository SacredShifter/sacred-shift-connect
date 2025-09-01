import { ActiveNode } from '../state/useShiftStore';

// Chapter jump event system
export const onChapterJump = (node: ActiveNode) => {
  if (!node) return;
  
  console.log(`🎬 Chapter jump to: ${node}`);
  
  // Trigger any video/audio synchronization here
  const event = new CustomEvent('shiftChapterJump', {
    detail: { node, timestamp: Date.now() }
  });
  
  window.dispatchEvent(event);
};

// Listen for chapter jumps - export this function
export const listenForChapterJumps = (callback: (node: ActiveNode) => void) => {
  const handleChapterJump = (event: any) => {
    callback(event.detail.node);
  };
  
  window.addEventListener('shiftChapterJump', handleChapterJump);
  
  return () => {
    window.removeEventListener('shiftChapterJump', handleChapterJump);
  };
};