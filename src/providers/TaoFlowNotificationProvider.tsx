import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaoModule, TaoStage } from '@/config/taoFlowConfig';
import { useTaoFlowProgress } from '@/hooks/useTaoFlowProgress';
import { ModuleRevealNotification } from '@/components/TaoFlow/ModuleRevealNotification';
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
  const [revealModule, setRevealModule] = useState<TaoModule | null>(null);
  const [celebrationStage, setCelebrationStage] = useState<TaoStage | null>(null);
  const [showRevealModal, setShowRevealModal] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  
  const { getAllUnlockedModules, currentStage } = useTaoFlowProgress();
  const [previousStage, setPreviousStage] = useState<TaoStage>(currentStage);
  const [previousModuleCount, setPreviousModuleCount] = useState(0);

  // Track stage changes
  useEffect(() => {
    if (currentStage !== previousStage) {
      // Stage has changed - show celebration
      setCelebrationStage(currentStage);
      setShowCelebrationModal(true);
      setPreviousStage(currentStage);
    }
  }, [currentStage, previousStage]);

  // Track new module unlocks
  useEffect(() => {
    const unlockedModules = getAllUnlockedModules();
    const currentModuleCount = unlockedModules.length;
    
    if (currentModuleCount > previousModuleCount && previousModuleCount > 0) {
      // New module unlocked - find the newest one
      const newModule = unlockedModules[unlockedModules.length - 1];
      if (newModule) {
        setRevealModule(newModule);
        setShowRevealModal(true);
      }
    }
    
    setPreviousModuleCount(currentModuleCount);
  }, [getAllUnlockedModules, previousModuleCount]);

  const showModuleReveal = (module: TaoModule) => {
    setRevealModule(module);
    setShowRevealModal(true);
  };

  const showMilestoneCelebration = (stage: TaoStage) => {
    setCelebrationStage(stage);
    setShowCelebrationModal(true);
  };

  const hideAllNotifications = () => {
    setShowRevealModal(false);
    setShowCelebrationModal(false);
    setRevealModule(null);
    setCelebrationStage(null);
  };

  const handleRevealClose = () => {
    setShowRevealModal(false);
    setRevealModule(null);
  };

  const handleCelebrationClose = () => {
    setShowCelebrationModal(false);
    setCelebrationStage(null);
  };

  const handleExploreModule = () => {
    if (revealModule?.path) {
      console.log('Exploring module:', revealModule.path);
      navigate(revealModule.path);
      handleRevealClose();
    }
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
      
      {/* Module Reveal Notification */}
      <ModuleRevealNotification
        newModule={revealModule}
        isOpen={showRevealModal}
        onClose={handleRevealClose}
        onExplore={handleExploreModule}
      />

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