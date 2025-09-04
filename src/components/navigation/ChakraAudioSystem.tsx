import React, { useEffect, useState, useCallback } from 'react';
import { chakraData } from '@/data/chakraData';

interface ChakraAudioSystemProps {
  volume?: number;
  enableAmbient?: boolean;
}

export const ChakraAudioSystem: React.FC<ChakraAudioSystemProps> = ({ 
  volume = 0.3,
  enableAmbient = true
}) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [currentResonance, setCurrentResonance] = useState<string | null>(null);

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

  // Create chakra-specific harmonic sequences
  const playChakraBell = useCallback((
    chakraId: string, 
    frequency: number | string, 
    type: 'hover' | 'selection',
    modulePath?: string
  ) => {
    if (!audioContext) return;
    
    // Parse frequency if it's a string (e.g., "963 Hz")
    const freq = typeof frequency === 'string' 
      ? parseFloat(frequency.replace('Hz', '').trim()) 
      : frequency;
      
    if (isNaN(freq)) return;
    
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.setValueAtTime(0, audioContext.currentTime);
    
    // Different sounds for different interaction types
    if (type === 'hover') {
      // Gentle preview chime
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(masterGain);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Gentle fade in/out
      masterGain.gain.linearRampToValueAtTime(volume * 0.5, audioContext.currentTime + 0.1);
      masterGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
      
    } else if (type === 'selection') {
      // Full harmonic bell sequence
      const fundamentalFreq = freq;
      const harmonics = [1, 2, 3, 4, 5]; // Harmonic series
      
      harmonics.forEach((harmonic, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const panNode = audioContext.createStereoPanner();
        
        oscillator.connect(gainNode);
        gainNode.connect(panNode);
        panNode.connect(masterGain);
        
        // Calculate harmonic frequency
        const harmonicFreq = fundamentalFreq * harmonic;
        oscillator.frequency.setValueAtTime(harmonicFreq, audioContext.currentTime);
        
        // Different waveforms for different harmonics
        oscillator.type = index === 0 ? 'sine' : index < 3 ? 'triangle' : 'sawtooth';
        
        // Harmonic volume decreases with overtones
        const harmonicVolume = volume / (harmonic * 1.5);
        
        // Slight stereo spread for richness
        panNode.pan.setValueAtTime((index - 2) * 0.2, audioContext.currentTime);
        
        // Bell envelope - quick attack, slow decay
        masterGain.gain.linearRampToValueAtTime(harmonicVolume, audioContext.currentTime + 0.05);
        masterGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 3);
        
        oscillator.start(audioContext.currentTime + index * 0.02);
        oscillator.stop(audioContext.currentTime + 3);
      });
      
      // Set current resonance for ambient continuation
      setCurrentResonance(chakraId);
      
      // Clear resonance after bell fade
      setTimeout(() => {
        if (currentResonance === chakraId) {
          setCurrentResonance(null);
        }
      }, 3000);
    }
  }, [audioContext, volume, currentResonance]);

  // Ambient resonance for active chakras
  useEffect(() => {
    if (!enableAmbient || !audioContext || !currentResonance) return;
    
    const chakra = chakraData.find(c => c.id === currentResonance);
    if (!chakra) return;
    
    // Parse frequency properly
    const baseFreq = parseFloat(chakra.frequency.replace('Hz', '').trim()) || 396;
    
    const playAmbientTone = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Very subtle ambient frequency
      oscillator.frequency.setValueAtTime(baseFreq / 4, audioContext.currentTime); // Sub-harmonic
      oscillator.type = 'sine';
      
      // Low-pass filter for warmth
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(baseFreq * 2, audioContext.currentTime);
      
      // Very quiet background resonance
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 2);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 8);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 8);
    };
    
    // Play ambient tone after short delay
    const timeoutId = setTimeout(playAmbientTone, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [currentResonance, audioContext, volume, enableAmbient]);

  // Listen for chakra bell events
  useEffect(() => {
    const handleChakraBell = (event: Event) => {
      const customEvent = event as CustomEvent<{
        chakraId: string;
        frequency: number | string;
        modulePath: string;
        type: 'hover' | 'selection';
      }>;
      
      const { chakraId, frequency, modulePath, type } = customEvent.detail;
      playChakraBell(chakraId, frequency, type, modulePath);
    };
    
    window.addEventListener('chakra-bell', handleChakraBell as EventListener);
    
    return () => {
      window.removeEventListener('chakra-bell', handleChakraBell as EventListener);
    };
  }, [playChakraBell]);

  return null; // This component doesn't render anything visual
};