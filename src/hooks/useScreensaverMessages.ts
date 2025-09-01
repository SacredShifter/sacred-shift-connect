import { useState, useEffect, useCallback, useRef } from 'react';
import { sacredMessages, categoryWeights, getCurrentTimeOfDay, type MessageCategory, type SacredMessage } from '@/data/sacredMessages';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';

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

  // Get daily routine context
  const dailyRoutine = useDailyRoutine();
  const todaysStep = dailyRoutine?.getTodaysStep();
  
  // Generate dynamic daily routine messages
  const generateDailyMessages = useCallback((): SacredMessage[] => {
    if (!dailyRoutine || !todaysStep) return [];

    const { state } = dailyRoutine;
    const badgeProgress = dailyRoutine.getProgressToNextBadge();
    const timeOfDay = getCurrentTimeOfDay();
    
    const dynamicMessages: SacredMessage[] = [];

    // Today's step reminder (if not completed)
    if (todaysStep && !todaysStep.completedAt) {
      dynamicMessages.push({
        id: `daily-${todaysStep.id}`,
        text: `Ready for today's practice: ${todaysStep.title}? (${todaysStep.estimatedMinutes} min)`,
        category: 'daily_routine_nudges',
        weight: 3.0,
        timeOfDay: 'any',
        routineContext: {
          stepId: todaysStep.id,
          stepTitle: todaysStep.title,
          practice: todaysStep.practice,
          estimatedMinutes: todaysStep.estimatedMinutes
        }
      });
    }

    // Streak celebration
    if (state.streak > 0) {
      dynamicMessages.push({
        id: `streak-${state.streak}`,
        text: state.streak >= 7 ? `🔥 ${state.streak} day streak! You're becoming who you're meant to be.` : 
              state.streak >= 3 ? `✨ ${state.streak} days of sacred practice. Keep going.` :
              `Day ${state.streak} of your journey. Beautiful momentum.`,
        category: 'progress_celebration',
        weight: 2.5,
        timeOfDay: 'any'
      });
    }

    // Badge progress
    if (badgeProgress && (badgeProgress.needed - badgeProgress.current) <= 3) {
      const daysUntilNext = badgeProgress.needed - badgeProgress.current;
      dynamicMessages.push({
        id: `badge-progress-${badgeProgress.badgeName}`,
        text: `Only ${daysUntilNext} day${daysUntilNext !== 1 ? 's' : ''} until your ${badgeProgress.badgeName} badge!`,
        category: 'progress_celebration',
        weight: 2.0,
        timeOfDay: 'any'
      });
    }

    // Time-specific messages
    if (timeOfDay === 'morning' && todaysStep && !todaysStep.completedAt) {
      dynamicMessages.push({
        id: `morning-${todaysStep.id}`,
        text: `${todaysStep.title} awaits. Begin when you're ready.`,
        category: 'morning_encouragement',
        weight: 2.5,
        timeOfDay: 'morning'
      });
    }

    if (timeOfDay === 'evening' && todaysStep?.completedAt) {
      dynamicMessages.push({
        id: `evening-complete`,
        text: `Today's practice complete. Let it integrate.`,
        category: 'evening_reflection',
        weight: 2.0,
        timeOfDay: 'evening'
      });
    }

    return dynamicMessages;
  }, [dailyRoutine, todaysStep]);

  // Weighted random message selection with daily routine integration
  const selectRandomMessage = useCallback((): SacredMessage => {
    const dynamicMessages = generateDailyMessages();
    const timeOfDay = getCurrentTimeOfDay();
    
    // Combine static and dynamic messages
    const allMessages = [...sacredMessages, ...dynamicMessages];
    
    // Filter out recently shown messages
    const availableMessages = allMessages.filter(
      msg => !recentMessagesRef.current.includes(msg.id)
    );
    
    // If we've exhausted unique messages, reset the recent list
    if (availableMessages.length === 0) {
      recentMessagesRef.current = [];
      return allMessages[Math.floor(Math.random() * allMessages.length)];
    }

    // Filter by time of day preference
    const timeFilteredMessages = availableMessages.filter(
      msg => !msg.timeOfDay || msg.timeOfDay === 'any' || msg.timeOfDay === timeOfDay
    );

    const messagesToUse = timeFilteredMessages.length > 0 ? timeFilteredMessages : availableMessages;

    // Calculate weighted selection
    const weightedMessages: SacredMessage[] = [];
    
    messagesToUse.forEach(message => {
      const categoryWeight = categoryWeights[message.category] || 1.0;
      const messageWeight = message.weight || 1.0;
      
      // Boost weight for daily routine messages
      const routineBoost = message.category.includes('daily_') || 
                           message.category === 'progress_celebration' ||
                           message.category === 'morning_encouragement' ||
                           message.category === 'evening_reflection' ? 1.5 : 1.0;
      
      const finalWeight = Math.floor(categoryWeight * messageWeight * routineBoost * 10);
      
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
  }, [preventRepeats, generateDailyMessages]);

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
    // Expose daily routine context
    dailyContext: {
      todaysStep,
      streak: dailyRoutine?.state.streak || 0,
      hasCompletedToday: todaysStep?.completedAt ? true : false,
      timeOfDay: getCurrentTimeOfDay()
    },
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