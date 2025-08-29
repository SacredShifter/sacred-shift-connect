import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export interface CompactStateOptions {
  autoCompactRoutes?: string[];
  defaultCompact?: boolean;
  persistState?: boolean;
  storageKey?: string;
}

const DEFAULT_COMPACT_ROUTES = ['/messages', '/journal'];

export const useCompactState = (options: CompactStateOptions = {}) => {
  const {
    autoCompactRoutes = DEFAULT_COMPACT_ROUTES,
    defaultCompact = false,
    persistState = true,
    storageKey = 'whereAmIWidget-compact'
  } = options;

  const location = useLocation();
  const [isCompact, setIsCompact] = useState(defaultCompact);
  const [wasManuallyToggled, setWasManuallyToggled] = useState(false);

  // Load saved compact state
  useEffect(() => {
    if (!persistState) return;
    
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const { compact, manuallyToggled } = JSON.parse(savedState);
        setIsCompact(compact);
        setWasManuallyToggled(manuallyToggled);
      } catch {
        // Invalid JSON, use default
      }
    }
  }, [persistState, storageKey]);

  // Auto-compact on specific routes (unless manually overridden)
  useEffect(() => {
    if (wasManuallyToggled) return;

    const shouldAutoCompact = autoCompactRoutes.includes(location.pathname);
    setIsCompact(shouldAutoCompact);
  }, [location.pathname, autoCompactRoutes, wasManuallyToggled]);

  // Save state to localStorage
  const saveState = useCallback((compact: boolean, manuallyToggled: boolean) => {
    if (!persistState) return;
    
    const state = {
      compact,
      manuallyToggled,
      route: location.pathname
    };
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [persistState, storageKey, location.pathname]);

  // Toggle compact state manually
  const toggleCompact = useCallback(() => {
    const newCompact = !isCompact;
    setIsCompact(newCompact);
    setWasManuallyToggled(true);
    saveState(newCompact, true);
  }, [isCompact, saveState]);

  // Force compact state
  const setCompact = useCallback((compact: boolean, manual = false) => {
    setIsCompact(compact);
    if (manual) {
      setWasManuallyToggled(true);
      saveState(compact, true);
    }
  }, [saveState]);

  // Reset to auto-compact behavior
  const resetToAuto = useCallback(() => {
    setWasManuallyToggled(false);
    const shouldAutoCompact = autoCompactRoutes.includes(location.pathname);
    setIsCompact(shouldAutoCompact);
    saveState(shouldAutoCompact, false);
  }, [location.pathname, autoCompactRoutes, saveState]);

  // Check if current route should auto-compact
  const shouldAutoCompact = autoCompactRoutes.includes(location.pathname);

  return {
    isCompact,
    wasManuallyToggled,
    shouldAutoCompact,
    toggleCompact,
    setCompact,
    resetToAuto
  };
};