import React, { useEffect, useState } from 'react';

interface SoundSystemProps {
  onUnlock: (modulePath: string) => void;
  volume?: number;
}

export const SoundSystem: React.FC<SoundSystemProps> = ({ 
  onUnlock, 
  volume = 0.3 
}) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  
  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && window.AudioContext) {
      const ctx = new AudioContext();
      setAudioContext(ctx);
      
      return () => {
        ctx.close();
      };
    }
  }, []);
  
  const playUnlockTone = (modulePath: string) => {
    if (!audioContext) return;
    
    // Sacred frequencies for different module types
    const frequencies: { [key: string]: number } = {
      '/breath': 528, // Healing frequency
      '/journal': 396, // Liberation frequency  
      '/meditation': 852, // Awakening frequency
      '/grove': 741, // Expression frequency
      '/gaa': 963, // Pineal activation
      '/learning-3d': 417, // Change frequency
      '/circles': 285, // Multi-dimensional healing
      '/messages': 174, // Foundation frequency
      '/codex': 432, // Natural frequency
      '/constellation': 639, // Relationships frequency
    };
    
    const baseFreq = frequencies[modulePath] || 528;
    
    // Create oscillator for harmonic tone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
    oscillator.type = 'sine';
    
    // Envelope for natural fade
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
  };
  
  useEffect(() => {
    const handleUnlock = (modulePath: string) => {
      playUnlockTone(modulePath);
      onUnlock(modulePath);
    };
    
    // Listen for unlock events
    window.addEventListener('constellation-unlock', (event: any) => {
      handleUnlock(event.detail.modulePath);
    });
    
    return () => {
      window.removeEventListener('constellation-unlock', handleUnlock);
    };
  }, [audioContext, onUnlock, volume]);
  
  return null; // This component doesn't render anything visual
};