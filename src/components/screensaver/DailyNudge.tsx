import React from 'react';
import { motion } from 'framer-motion';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';
import { getCurrentTimeOfDay } from '@/data/sacredMessages';

interface DailyNudgeProps {
  isVisible: boolean;
}

export function DailyNudge({ isVisible }: DailyNudgeProps) {
  const dailyRoutine = useDailyRoutine();
  const todaysStep = dailyRoutine?.getTodaysStep();
  const timeOfDay = getCurrentTimeOfDay();
  
  if (!dailyRoutine || !todaysStep || !isVisible) return null;
  
  const { state } = dailyRoutine;
  const badgeProgress = dailyRoutine.getProgressToNextBadge();
  
  return (
    <motion.div
      className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center max-w-md px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
    >
      {/* Progress indicators */}
      {state.streak > 0 && (
        <motion.div
          className="mb-4 text-white/70 text-sm"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          🔥 {state.streak} day streak
          {badgeProgress && (badgeProgress.needed - badgeProgress.current) <= 3 && (
            <span className="block text-xs mt-1 text-white/50">
              {badgeProgress.needed - badgeProgress.current} days to {badgeProgress.badgeName}
            </span>
          )}
        </motion.div>
      )}
      
      {/* Today's practice status */}
      {!todaysStep.completedAt && (
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-white/90 font-medium text-sm mb-2">
            {timeOfDay === 'morning' ? "Today's Practice" : 
             timeOfDay === 'afternoon' ? "Continue Your Journey" : 
             "Complete Today's Step"}
          </div>
          
          <div className="text-white/70 text-xs leading-relaxed">
            <div className="font-medium text-white/80">{todaysStep.title}</div>
            <div className="mt-1">{todaysStep.estimatedMinutes} min • {todaysStep.practice}</div>
          </div>
          
          <div className="mt-3 flex items-center justify-center">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </motion.div>
      )}
      
      {/* Completed message */}
      {todaysStep.completedAt && timeOfDay === 'evening' && (
        <motion.div
          className="text-white/70 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ✨ Today's practice complete. Integration in progress.
        </motion.div>
      )}
    </motion.div>
  );
}