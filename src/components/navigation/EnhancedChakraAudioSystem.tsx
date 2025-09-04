import React, { useEffect, useState, useCallback } from 'react';

interface EnhancedChakraAudioSystemProps {
  volume?: number;
  enableAmbient?: boolean;
  enableNatureSounds?: boolean;
}

export const EnhancedChakraAudioSystem: React.FC<EnhancedChakraAudioSystemProps> = ({ 
  volume = 0.3,
  enableAmbient = true,
  enableNatureSounds = true
}) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [currentResonance, setCurrentResonance] = useState<string | null>(null);
  const [ambientNodes, setAmbientNodes] = useState<Map<string, { oscillator: OscillatorNode; gain: GainNode }>>(new Map());

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

  // Enhanced bell sound with harmonic layers
  const playEnhancedChakraBell = useCallback((
    chakraId: string, 
    frequency: number | string, 
    type: 'hover' | 'selection',
    bellNote?: string,
    moduleName?: string
  ) => {
    if (!audioContext) return;
    
    const freq = typeof frequency === 'string' 
      ? parseFloat(frequency.replace('Hz', '').trim()) 
      : frequency;
      
    if (isNaN(freq)) return;
    
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.setValueAtTime(0, audioContext.currentTime);
    
    if (type === 'hover') {
      // Gentle preview with crystalline overtones
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(masterGain);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // High-pass filter for crystalline quality
      filterNode.type = 'highpass';
      filterNode.frequency.setValueAtTime(freq * 0.5, audioContext.currentTime);
      
      // Gentle fade
      masterGain.gain.linearRampToValueAtTime(volume * 0.4, audioContext.currentTime + 0.1);
      masterGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.5);
      
    } else if (type === 'selection') {
      // Rich harmonic bell with sacred geometry frequencies
      const fundamentalFreq = freq;
      const harmonics = [1, 2, 3, 4, 5, 6]; // Extended harmonic series
      const goldenRatio = 1.618033988749;
      
      harmonics.forEach((harmonic, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const panNode = audioContext.createStereoPanner();
        const filterNode = audioContext.createBiquadFilter();
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(panNode);
        panNode.connect(masterGain);
        
        // Sacred geometry frequency relationships
        let harmonicFreq;
        if (index < 3) {
          harmonicFreq = fundamentalFreq * harmonic;
        } else {
          // Golden ratio harmonics for higher overtones
          harmonicFreq = fundamentalFreq * Math.pow(goldenRatio, index - 2);
        }
        
        oscillator.frequency.setValueAtTime(harmonicFreq, audioContext.currentTime);
        
        // Different waveforms for complexity
        const waveforms: OscillatorType[] = ['sine', 'triangle', 'sawtooth'];
        oscillator.type = waveforms[index % waveforms.length];
        
        // Low-pass filter for warmth
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(harmonicFreq * 2, audioContext.currentTime);
        filterNode.Q.setValueAtTime(1, audioContext.currentTime);
        
        // Harmonic volume envelope
        const harmonicVolume = volume / (harmonic * 1.2);
        
        // Stereo positioning based on frequency
        panNode.pan.setValueAtTime((index - 2.5) * 0.15, audioContext.currentTime);
        
        // Natural bell envelope with long resonance
        masterGain.gain.linearRampToValueAtTime(harmonicVolume, audioContext.currentTime + 0.05);
        masterGain.gain.setTargetAtTime(harmonicVolume * 0.7, audioContext.currentTime + 0.1, 0.5);
        masterGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 4);
        
        oscillator.start(audioContext.currentTime + index * 0.02);
        oscillator.stop(audioContext.currentTime + 4);
      });
      
      // Set resonance for ambient continuation
      setCurrentResonance(chakraId);
      
      // Clear resonance after decay
      setTimeout(() => {
        setCurrentResonance(null);
      }, 4000);
    }
  }, [audioContext, volume]);

  // Nature soundscape layer
  useEffect(() => {
    if (!enableNatureSounds || !audioContext) return;
    
    const createNatureSounds = () => {
      // Gentle wind through bamboo
      const windOscillator = audioContext.createOscillator();
      const windGain = audioContext.createGain();
      const windFilter = audioContext.createBiquadFilter();
      
      windOscillator.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(audioContext.destination);
      
      windOscillator.frequency.setValueAtTime(80, audioContext.currentTime);
      windOscillator.type = 'sawtooth';
      
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(200, audioContext.currentTime);
      windFilter.Q.setValueAtTime(0.5, audioContext.currentTime);
      
      windGain.gain.setValueAtTime(volume * 0.05, audioContext.currentTime);
      
      // Gentle modulation for natural movement
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      
      lfo.connect(lfoGain);
      lfoGain.connect(windFilter.frequency);
      
      lfo.frequency.setValueAtTime(0.1, audioContext.currentTime);
      lfoGain.gain.setValueAtTime(50, audioContext.currentTime);
      
      windOscillator.start(audioContext.currentTime);
      lfo.start(audioContext.currentTime);
      
      return { windOscillator, windGain, lfo };
    };
    
    const natureNodes = createNatureSounds();
    
    return () => {
      natureNodes.windOscillator.stop();
      natureNodes.lfo.stop();
    };
  }, [enableNatureSounds, audioContext, volume]);

  // Listen for enhanced chakra bell events
  useEffect(() => {
    const handleChakraBell = (event: Event) => {
      const customEvent = event as CustomEvent<{
        chakraId: string;
        frequency: number | string;
        modulePath: string;
        type: 'hover' | 'selection';
        bellNote?: string;
        moduleName?: string;
      }>;
      
      const { chakraId, frequency, type, bellNote, moduleName } = customEvent.detail;
      playEnhancedChakraBell(chakraId, frequency, type, bellNote, moduleName);
    };
    
    window.addEventListener('chakra-bell', handleChakraBell as EventListener);
    
    return () => {
      window.removeEventListener('chakra-bell', handleChakraBell as EventListener);
    };
  }, [playEnhancedChakraBell]);

  return null; // This component doesn't render anything visual
};