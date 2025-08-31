/**
 * Cosmic Data Provider - Manages cosmic data streams and firmament/shadow dome data
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CosmicStructure {
  id: string;
  type: 'stellar' | 'nebula' | 'void' | 'alignment';
  position: [number, number, number];
  intensity: number;
  color: string;
  timestamp: number;
}

interface CosmicDataContextType {
  structures: CosmicStructure[];
  firmamentRadius: number;
  shadowDomeOpacity: number;
  isConnected: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => void;
}

const CosmicDataContext = createContext<CosmicDataContextType | null>(null);

export const useCosmicData = () => {
  const context = useContext(CosmicDataContext);
  if (!context) {
    throw new Error('useCosmicData must be used within CosmicDataProvider');
  }
  return context;
};

interface CosmicDataProviderProps {
  children: React.ReactNode;
}

export const CosmicDataProvider: React.FC<CosmicDataProviderProps> = ({ children }) => {
  const [structures, setStructures] = useState<CosmicStructure[]>([]);
  const [firmamentRadius, setFirmamentRadius] = useState(1.0);
  const [shadowDomeOpacity, setShadowDomeOpacity] = useState(0.3);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate cosmic data updates
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      // Add new structure occasionally
      if (Math.random() < 0.1) {
        const newStructure: CosmicStructure = {
          id: `struct_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: ['stellar', 'nebula', 'void', 'alignment'][Math.floor(Math.random() * 4)] as CosmicStructure['type'],
          position: [
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
          ],
          intensity: Math.random(),
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
          timestamp: Date.now()
        };

        setStructures(prev => [...prev.slice(-9), newStructure]); // Keep last 10
      }

      // Update firmament and shadow dome
      setFirmamentRadius(0.8 + Math.sin(Date.now() / 10000) * 0.3);
      setShadowDomeOpacity(0.2 + Math.sin(Date.now() / 8000) * 0.2);
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const connect = async (): Promise<boolean> => {
    // Simulate connection to cosmic data stream
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsConnected(true);
    
    // Add initial structures
    const initialStructures: CosmicStructure[] = Array.from({ length: 5 }, (_, i) => ({
      id: `initial_${i}`,
      type: ['stellar', 'nebula', 'void', 'alignment'][i % 4] as CosmicStructure['type'],
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ],
      intensity: 0.5 + Math.random() * 0.5,
      color: `hsl(${i * 72}, 70%, 60%)`,
      timestamp: Date.now() - i * 1000
    }));
    
    setStructures(initialStructures);
    return true;
  };

  const disconnect = () => {
    setIsConnected(false);
    setStructures([]);
  };

  return (
    <CosmicDataContext.Provider value={{
      structures,
      firmamentRadius,
      shadowDomeOpacity,
      isConnected,
      connect,
      disconnect
    }}>
      {children}
    </CosmicDataContext.Provider>
  );
};