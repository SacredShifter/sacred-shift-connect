import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface PracticeTimerProps {
  duration: number; // in seconds
  isActive: boolean;
  onComplete: () => void;
  onTimeUpdate: (timeRemaining: number) => void;
}

export const PracticeTimer: React.FC<PracticeTimerProps> = ({
  duration,
  isActive,
  onComplete,
  onTimeUpdate
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeRemaining(duration);
    onTimeUpdate(duration);
  }, [duration, onTimeUpdate]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = Math.max(0, prev - 1);
          onTimeUpdate(newTime);
          
          if (newTime === 0) {
            onComplete();
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining, onComplete, onTimeUpdate]);

  const progress = ((duration - timeRemaining) / duration) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Background circle */}
        <svg 
          width="140" 
          height="140" 
          viewBox="0 0 140 140"
          className="transform -rotate-90"
        >
          <circle
            cx="70"
            cy="70"
            r={radius}
            strokeWidth="8"
            className="stroke-primary/10"
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            strokeWidth="8"
            fill="transparent"
            className="stroke-primary"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
        </svg>
        
        {/* Timer display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="text-center"
            animate={{
              scale: timeRemaining <= 10 && timeRemaining > 0 ? [1, 1.05, 1] : 1
            }}
            transition={{
              duration: 1,
              repeat: timeRemaining <= 10 && timeRemaining > 0 ? Infinity : 0
            }}
          >
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground">
              {isActive ? 'remaining' : 'paused'}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="w-full max-w-xs">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0:00</span>
          <span>
            {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};