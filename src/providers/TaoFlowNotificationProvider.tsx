import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaoModule, TaoStage } from '@/config/taoFlowConfig';
import { useTaoFlowProgress } from '@/hooks/useTaoFlowProgress';
import { MilestoneCelebration } from '@/components/TaoFlow/MilestoneCelebration';

interface TaoFlowNotificationContextType {
  showModuleReveal: (module: TaoModule) => void;
  showMilestoneCelebration: (stage: TaoStage) => void;
  hideAllNotifications: () => void;
}

const TaoFlowNotificationContext = createContext<TaoFlowNotificationContextType | undefined>(undefined);

interface TaoFlowNotificationProviderProps {
  children: React.ReactNode;
}

export const TaoFlowNotificationProvider: React.FC<TaoFlowNotificationProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [celebrationStage, setCelebrationStage] = useState<TaoStage | null>(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  
  const { currentStage } = useTaoFlowProgress();
  const [previousStage, setPreviousStage] = useState<TaoStage>(currentStage);
  const [celebratedStages, setCelebratedStages] = useState<Set<TaoStage>>(new Set());

  // Load celebrated stages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tao-celebrated-stages');
    if (saved) {
      try {
        const stages = JSON.parse(saved);
        setCelebratedStages(new Set(stages));
      } catch (error) {
        console.warn('Failed to parse celebrated stages:', error);
      }
    }
  }, []);

  // Track stage changes
  useEffect(() => {
    if (currentStage !== previousStage && !celebratedStages.has(currentStage)) {
      // Stage has changed and hasn't been celebrated yet - show celebration
      setCelebrationStage(currentStage);
      setShowCelebrationModal(true);
      setPreviousStage(currentStage);
      
      // Mark this stage as celebrated
      const newCelebratedStages = new Set(celebratedStages);
      newCelebratedStages.add(currentStage);
      setCelebratedStages(newCelebratedStages);
      localStorage.setItem('tao-celebrated-stages', JSON.stringify(Array.from(newCelebratedStages)));
    }
  }, [currentStage, previousStage, celebratedStages]);

  // MODULE UNLOCK NOTIFICATIONS DISABLED - No more annoying popups!

  const showModuleReveal = (module: TaoModule) => {
    // MODULE REVEALS DISABLED - No more popups!
    console.log('Module reveal disabled:', module.name);
  };

  const showMilestoneCelebration = (stage: TaoStage) => {
    setCelebrationStage(stage);
    setShowCelebrationModal(true);
  };

  const hideAllNotifications = () => {
    setShowCelebrationModal(false);
    setCelebrationStage(null);
  };

  const handleCelebrationClose = () => {
    setShowCelebrationModal(false);
    setCelebrationStage(null);
  };

  const handleContinueJourney = () => {
    console.log('Continuing from milestone:', celebrationStage);
    // Navigate to journey map to see progress
    navigate('/journey-map');
    handleCelebrationClose();
  };

  const value = {
    showModuleReveal,
    showMilestoneCelebration,
    hideAllNotifications,
  };

  return (
    <TaoFlowNotificationContext.Provider value={value}>
      {children}
      
      {/* Module Reveal Notifications DISABLED - No more annoying popups! */}

      {/* Milestone Celebration */}
      <MilestoneCelebration
        newStage={celebrationStage}
        isOpen={showCelebrationModal}
        onClose={handleCelebrationClose}
        onContinue={handleContinueJourney}
      />
    </TaoFlowNotificationContext.Provider>
  );
};

export const useTaoFlowNotifications = () => {
  const context = useContext(TaoFlowNotificationContext);
  if (context === undefined) {
    throw new Error('useTaoFlowNotifications must be used within a TaoFlowNotificationProvider');
  }
  return context;
};