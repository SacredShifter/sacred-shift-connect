/**
 * Safety Provider - Manages audio safety protocols and emergency systems
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SafetyAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: number;
  autoResolve?: boolean;
}

interface SafetyContextType {
  alerts: SafetyAlert[];
  limiterActive: boolean;
  hpfEnabled: boolean;
  masterVolume: number;
  emergencyStop: boolean;
  addAlert: (alert: Omit<SafetyAlert, 'id' | 'timestamp'>) => void;
  removeAlert: (alertId: string) => void;
  clearAlerts: () => void;
  setLimiterActive: (active: boolean) => void;
  setHPFEnabled: (enabled: boolean) => void;
  setMasterVolume: (volume: number) => void;
  triggerEmergencyStop: () => void;
  resetEmergencyStop: () => void;
}

const SafetyContext = createContext<SafetyContextType | null>(null);

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within SafetyProvider');
  }
  return context;
};

interface SafetyProviderProps {
  children: React.ReactNode;
}

export const SafetyProvider: React.FC<SafetyProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [limiterActive, setLimiterActive] = useState(false);
  const [hpfEnabled, setHPFEnabled] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [emergencyStop, setEmergencyStop] = useState(false);

  // Auto-resolve alerts after timeout
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => prev.filter(alert => {
        if (alert.autoResolve && Date.now() - alert.timestamp > 10000) {
          return false; // Remove alert after 10 seconds
        }
        return true;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Monitor headphone detection
  useEffect(() => {
    const handleDeviceChange = () => {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
        const hasHeadphones = audioOutputs.some(device => 
          device.label.toLowerCase().includes('headphone') ||
          device.label.toLowerCase().includes('headset')
        );
        
        if (hasHeadphones !== hpfEnabled) {
          setHPFEnabled(hasHeadphones);
          addAlert({
            type: 'info',
            message: hasHeadphones ? 
              'Headphones detected - HPF enabled (≥35-40 Hz)' : 
              'Headphones disconnected - HPF disabled',
            autoResolve: true
          });
        }
      });
    };

    // Initial check
    handleDeviceChange();

    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [hpfEnabled]);

  const addAlert = (alert: Omit<SafetyAlert, 'id' | 'timestamp'>) => {
    const newAlert: SafetyAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    
    setAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const triggerEmergencyStop = () => {
    setEmergencyStop(true);
    setMasterVolume(0);
    addAlert({
      type: 'critical',
      message: 'Emergency stop activated - All audio stopped',
      autoResolve: false
    });
  };

  const resetEmergencyStop = () => {
    setEmergencyStop(false);
    setMasterVolume(0.7);
    removeAlert('emergency_stop');
  };

  return (
    <SafetyContext.Provider value={{
      alerts,
      limiterActive,
      hpfEnabled,
      masterVolume,
      emergencyStop,
      addAlert,
      removeAlert,
      clearAlerts,
      setLimiterActive,
      setHPFEnabled,
      setMasterVolume,
      triggerEmergencyStop,
      resetEmergencyStop
    }}>
      {children}
    </SafetyContext.Provider>
  );
};