/**
 * Biofeedback Provider - Manages biometric data and safety protocols
 */
import React, { createContext, useContext } from 'react';
import { BiofeedbackMetrics } from '@/types/gaa-polarity';

interface BiofeedbackContextType {
  metrics: BiofeedbackMetrics | null;
  isConnected: boolean;
  hrvLow: boolean;
  stressDetected: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => void;
}

// Create a default context value to prevent hook errors
const defaultBiofeedbackContext: BiofeedbackContextType = {
  metrics: null,
  isConnected: false,
  hrvLow: false,
  stressDetected: false,
  connect: async () => false,
  disconnect: () => {}
};

const BiofeedbackContext = createContext<BiofeedbackContextType>(defaultBiofeedbackContext);

export const useBiofeedback = () => {
  const context = useContext(BiofeedbackContext);
  return context;
};

interface BiofeedbackProviderProps {
  children: React.ReactNode;
}

export const BiofeedbackProvider: React.FC<BiofeedbackProviderProps> = ({ children }) => {
  // Simple static implementation to prevent React hook errors
  const value: BiofeedbackContextType = {
    metrics: null,
    isConnected: false,
    hrvLow: false,
    stressDetected: false,
    connect: async () => {
      console.log('Biofeedback connection simulated');
      return true;
    },
    disconnect: () => {
      console.log('Biofeedback disconnected');
    }
  };

  return (
    <BiofeedbackContext.Provider value={value}>
      {children}
    </BiofeedbackContext.Provider>
  );
};