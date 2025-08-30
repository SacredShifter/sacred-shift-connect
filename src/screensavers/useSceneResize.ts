import { useState, useEffect } from 'react';

interface SceneSize {
  width: number;
  height: number;
  aspectRatio: number;
  pixelRatio: number;
}

export const useSceneResize = (): SceneSize => {
  const [size, setSize] = useState<SceneSize>(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
  }));

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        aspectRatio: window.innerWidth / window.innerHeight,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
      });
    };

    const debouncedUpdateSize = debounce(updateSize, 100);
    
    window.addEventListener('resize', debouncedUpdateSize);
    window.addEventListener('orientationchange', debouncedUpdateSize);
    
    return () => {
      window.removeEventListener('resize', debouncedUpdateSize);
      window.removeEventListener('orientationchange', debouncedUpdateSize);
    };
  }, []);

  return size;
};

// Simple debounce utility
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}