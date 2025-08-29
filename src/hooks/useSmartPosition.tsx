import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export interface Position {
  x: number;
  y: number;
  corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  isCustom: boolean;
}

export interface SmartPositionOptions {
  defaultPosition?: Position;
  enableCollisionDetection?: boolean;
  enableRouteSpecificPositioning?: boolean;
  storageKey?: string;
}

const DEFAULT_POSITIONS = {
  'top-left': { x: 24, y: 24, corner: 'top-left' as const, isCustom: false },
  'top-right': { x: -24, y: 24, corner: 'top-right' as const, isCustom: false },
  'bottom-left': { x: 24, y: -24, corner: 'bottom-left' as const, isCustom: false },
  'bottom-right': { x: -24, y: -24, corner: 'bottom-right' as const, isCustom: false }
};

const ROUTE_SPECIFIC_POSITIONS: Record<string, Position> = {
  '/messages': { x: 24, y: 24, corner: 'top-right', isCustom: false },
  '/journal': { x: 24, y: -24, corner: 'bottom-left', isCustom: false },
  '/dashboard': { x: -24, y: -24, corner: 'bottom-right', isCustom: false },
  // Add more route-specific positions as needed
};

export const useSmartPosition = (options: SmartPositionOptions = {}) => {
  const {
    defaultPosition = DEFAULT_POSITIONS['bottom-right'],
    enableCollisionDetection = true,
    enableRouteSpecificPositioning = true,
    storageKey = 'whereAmIWidget-position'
  } = options;

  const location = useLocation();
  const [position, setPosition] = useState<Position>(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem(storageKey);
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition(parsed);
      } catch {
        // Invalid JSON, use default
      }
    }
  }, [storageKey]);

  // Save position to localStorage
  const savePosition = useCallback((newPosition: Position) => {
    localStorage.setItem(storageKey, JSON.stringify(newPosition));
    setPosition(newPosition);
  }, [storageKey]);

  // Route-specific positioning
  useEffect(() => {
    if (!enableRouteSpecificPositioning) return;

    const routePosition = ROUTE_SPECIFIC_POSITIONS[location.pathname];
    if (routePosition && !position.isCustom) {
      setPosition(routePosition);
    }
  }, [location.pathname, enableRouteSpecificPositioning, position.isCustom]);

  // Collision detection setup
  useEffect(() => {
    if (!enableCollisionDetection || !widgetRef.current) return;

    const widget = widgetRef.current;
    
    // Create intersection observer to detect overlaps with input elements
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const hasCollision = entries.some((entry) => {
          const target = entry.target as HTMLElement;
          // Check if target is an input, button, or other interactive element
          const isInteractive = target.tagName === 'INPUT' || 
                               target.tagName === 'BUTTON' || 
                               target.tagName === 'TEXTAREA' ||
                               target.closest('[role="button"]') ||
                               target.closest('.chat-input') ||
                               target.closest('.message-input');
          
          return isInteractive && entry.isIntersecting && entry.intersectionRatio > 0.1;
        });

        if (hasCollision && !position.isCustom) {
          // Move to opposite corner when collision detected
          const newCorner = getOppositeCorner(position.corner);
          const newPosition = DEFAULT_POSITIONS[newCorner];
          setPosition(newPosition);
        }
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: '20px'
      }
    );

    // Observe all potentially colliding elements
    const interactiveElements = document.querySelectorAll(
      'input, button, textarea, [role="button"], .chat-input, .message-input'
    );
    
    interactiveElements.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [enableCollisionDetection, position.corner, position.isCustom]);

  const getOppositeCorner = (corner: Position['corner']): Position['corner'] => {
    switch (corner) {
      case 'top-left': return 'bottom-right';
      case 'top-right': return 'bottom-left';
      case 'bottom-left': return 'top-right';
      case 'bottom-right': return 'top-left';
      default: return 'bottom-right';
    }
  };

  // Drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const rect = widgetRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Determine which corner is closest
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;
    
    let corner: Position['corner'];
    if (newX < centerX && newY < centerY) {
      corner = 'top-left';
    } else if (newX >= centerX && newY < centerY) {
      corner = 'top-right';
    } else if (newX < centerX && newY >= centerY) {
      corner = 'bottom-left';
    } else {
      corner = 'bottom-right';
    }

    const newPosition: Position = {
      x: newX,
      y: newY,
      corner,
      isCustom: true
    };

    setPosition(newPosition);
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      savePosition(position);
    }
  }, [isDragging, position, savePosition]);

  // Add mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Reset to default position
  const resetPosition = useCallback(() => {
    const routeDefault = ROUTE_SPECIFIC_POSITIONS[location.pathname] || defaultPosition;
    setPosition(routeDefault);
    localStorage.removeItem(storageKey);
  }, [location.pathname, defaultPosition, storageKey]);

  // Get CSS styles for positioning
  const getPositionStyle = useCallback((): React.CSSProperties => {
    const { x, y, corner } = position;
    
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 50,
      cursor: isDragging ? 'grabbing' : 'grab'
    };

    if (position.isCustom) {
      return {
        ...baseStyle,
        left: x,
        top: y,
        transform: 'none'
      };
    }

    // Use corner-based positioning for non-custom positions
    switch (corner) {
      case 'top-left':
        return { ...baseStyle, top: Math.abs(y), left: Math.abs(x) };
      case 'top-right':
        return { ...baseStyle, top: Math.abs(y), right: Math.abs(x) };
      case 'bottom-left':
        return { ...baseStyle, bottom: Math.abs(y), left: Math.abs(x) };
      case 'bottom-right':
        return { ...baseStyle, bottom: Math.abs(y), right: Math.abs(x) };
      default:
        return { ...baseStyle, bottom: 16, right: 16 };
    }
  }, [position, isDragging]);

  return {
    position,
    isDragging,
    widgetRef,
    getPositionStyle,
    handleMouseDown,
    resetPosition,
    setPosition: savePosition
  };
};