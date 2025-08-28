import { useState, useEffect, useCallback, useRef } from 'react';
import { sacredMessages, categoryWeights, type MessageCategory, type SacredMessage } from '@/data/sacredMessages';

interface UseScreensaverMessagesOptions {
  rotationInterval?: number; // ms between message changes (default: 75000 = 75s)
  isActive?: boolean; // Whether to rotate messages
  preventRepeats?: number; // Number of recent messages to avoid repeating (default: 3)
}

export function useScreensaverMessages({
  rotationInterval = 75000,
  isActive = false,
  preventRepeats = 3
}: UseScreensaverMessagesOptions = {}) {
  const [currentMessage, setCurrentMessage] = useState<SacredMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const recentMessagesRef = useRef<string[]>([]);
  const rotationTimerRef = useRef<NodeJS.Timeout>();
  const fadeTimerRef = useRef<NodeJS.Timeout>();

  // Weighted random message selection
  const selectRandomMessage = useCallback((): SacredMessage => {
    // Filter out recently shown messages
    const availableMessages = sacredMessages.filter(
      msg => !recentMessagesRef.current.includes(msg.id)
    );
    
    // If we've exhausted unique messages, reset the recent list
    if (availableMessages.length === 0) {
      recentMessagesRef.current = [];
      return sacredMessages[Math.floor(Math.random() * sacredMessages.length)];
    }

    // Calculate weighted selection
    const weightedMessages: SacredMessage[] = [];
    
    availableMessages.forEach(message => {
      const categoryWeight = categoryWeights[message.category] || 1.0;
      const messageWeight = message.weight || 1.0;
      const finalWeight = Math.floor(categoryWeight * messageWeight * 10);
      
      // Add message multiple times based on weight
      for (let i = 0; i < finalWeight; i++) {
        weightedMessages.push(message);
      }
    });

    const selectedMessage = weightedMessages[Math.floor(Math.random() * weightedMessages.length)];
    
    // Track recent messages
    recentMessagesRef.current.push(selectedMessage.id);
    if (recentMessagesRef.current.length > preventRepeats) {
      recentMessagesRef.current.shift();
    }
    
    return selectedMessage;
  }, [preventRepeats]);

  // Show a new message with fade-in effect
  const showNewMessage = useCallback(() => {
    // Fade out current message
    setIsVisible(false);
    
    // After fade out, set new message and fade in
    fadeTimerRef.current = setTimeout(() => {
      const newMessage = selectRandomMessage();
      setCurrentMessage(newMessage);
      
      // Small delay before fade in
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }, 500); // Wait for fade out
  }, [selectRandomMessage]);

  // Start message rotation
  const startRotation = useCallback(() => {
    if (!isActive) return;

    // Show first message immediately
    const firstMessage = selectRandomMessage();
    setCurrentMessage(firstMessage);
    
    // Delay first visibility for dramatic effect (3-5 seconds)
    setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Set up rotation timer
    rotationTimerRef.current = setInterval(showNewMessage, rotationInterval);
  }, [isActive, rotationInterval, selectRandomMessage, showNewMessage]);

  // Stop message rotation
  const stopRotation = useCallback(() => {
    if (rotationTimerRef.current) {
      clearInterval(rotationTimerRef.current);
      rotationTimerRef.current = undefined;
    }
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = undefined;
    }
    
    // Fade out current message
    setIsVisible(false);
    
    // Clear message after fade out
    setTimeout(() => {
      setCurrentMessage(null);
    }, 500);
  }, []);

  // Reset message history
  const resetHistory = useCallback(() => {
    recentMessagesRef.current = [];
  }, []);

  // Effect to handle activation/deactivation
  useEffect(() => {
    if (isActive) {
      startRotation();
    } else {
      stopRotation();
    }

    return () => {
      stopRotation();
    };
  }, [isActive, startRotation, stopRotation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
      }
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
    };
  }, []);

  return {
    currentMessage,
    isVisible,
    showNewMessage,
    resetHistory,
    // Expose category breakdown for debugging
    messageStats: {
      total: sacredMessages.length,
      byCategory: Object.entries(categoryWeights).map(([category, weight]) => ({
        category: category as MessageCategory,
        count: sacredMessages.filter(m => m.category === category).length,
        weight
      }))
    }
  };
}