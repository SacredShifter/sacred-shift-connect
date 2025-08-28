import { useState, useEffect, useRef } from 'react';
import { useBreathingTool } from '@/hooks/useBreathingTool';

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export const useBreathCoach = () => {
  // Delegate to the main breathing tool for consistency
  const breathingTool = useBreathingTool();
  
  return {
    isActive: breathingTool.isActive,
    currentPhase: breathingTool.currentPhase,
    start: breathingTool.startBreathing,
    stop: breathingTool.stopBreathing,
    cycleCount: breathingTool.cycleCount,
    timeRemaining: breathingTool.timeRemaining,
    soundEnabled: breathingTool.soundEnabled,
    setSoundEnabled: breathingTool.setSoundEnabled,
    currentPreset: breathingTool.currentPreset,
    setCurrentPreset: breathingTool.setCurrentPreset,
  };
};