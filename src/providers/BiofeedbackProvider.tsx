/**
 * Biofeedback Provider - Manages biometric data and safety protocols
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BiofeedbackMetrics } from '@/types/gaa-polarity';

interface BiofeedbackContextType {
  metrics: BiofeedbackMetrics | null;
  isConnected: boolean;
  hrvLow: boolean;
  stressDetected: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => void;
}

const BiofeedbackContext = createContext<BiofeedbackContextType | null>(null);

export const useBiofeedback = () => {
  const context = useContext(BiofeedbackContext);
  if (!context) {
    throw new Error('useBiofeedback must be used within BiofeedbackProvider');
  }
  return context;
};

interface BiofeedbackProviderProps {
  children: React.ReactNode;
}

export const BiofeedbackProvider: React.FC<BiofeedbackProviderProps> = ({ children }) => {
  const [metrics, setMetrics] = useState<BiofeedbackMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hrvLow, setHrvLow] = useState(false);
  const [stressDetected, setStressDetected] = useState(false);

  // Simulate biofeedback data
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      const newMetrics: BiofeedbackMetrics = {
        heartRateVariability: 20 + Math.random() * 60,
        brainwaveActivity: {
          alpha: Math.random() * 0.8,
          beta: Math.random() * 0.6,
          theta: Math.random() * 0.4,
          delta: Math.random() * 0.3,
          gamma: Math.random() * 0.2
        },
        breathingPattern: {
          rate: 12 + Math.random() * 8,
          depth: Math.random(),
          coherence: Math.random()
        },
        autonomicBalance: {
          sympathetic: Math.random(),
          parasympathetic: Math.random()
        }
      };

      setMetrics(newMetrics);

      // Check for HRV low condition
      setHrvLow(newMetrics.heartRateVariability < 30);
      
      // Check for stress indicators
      setStressDetected(
        newMetrics.heartRateVariability < 25 &&
        newMetrics.autonomicBalance.sympathetic > 0.7
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const connect = async (): Promise<boolean> => {
    // Simulate connection attempt
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsConnected(true);
    return true;
  };

  const disconnect = () => {
    setIsConnected(false);
    setMetrics(null);
    setHrvLow(false);
    setStressDetected(false);
  };

  return (
    <BiofeedbackContext.Provider value={{
      metrics,
      isConnected,
      hrvLow,
      stressDetected,
      connect,
      disconnect
    }}>
      {children}
    </BiofeedbackContext.Provider>
  );
};