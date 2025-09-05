import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type NavigationMode = 'sacred-journey' | 'explorer';

interface NavigationContextType {
  mode: NavigationMode;
  setMode: (mode: NavigationMode) => void;
  toggleMode: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [mode, setMode] = useState<NavigationMode>(() => {
    // Check localStorage for saved preference, default to explorer mode
    const saved = localStorage.getItem('navigation-mode');
    return (saved === 'sacred-journey' || saved === 'explorer') ? saved as NavigationMode : 'explorer';
  });

  useEffect(() => {
    localStorage.setItem('navigation-mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'sacred-journey' ? 'explorer' : 'sacred-journey');
  };

  return (
    <NavigationContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};