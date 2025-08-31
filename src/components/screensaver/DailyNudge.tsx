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
      className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center max-w-2xl px-8"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.9 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
    >
      {/* Enhanced Progress indicators */}
      {state.streak > 0 && (
        <motion.div
          className="mb-6 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/30"
            style={{
              boxShadow: `
                0 0 30px rgba(147, 51, 234, 0.4),
                0 0 60px rgba(236, 72, 153, 0.2),
                inset 0 0 30px rgba(255, 255, 255, 0.1)
              `
            }}
          >
            <span className="text-2xl">🔥</span>
            <div className="text-white text-lg font-bold">
              {state.streak} Day Streak
            </div>
            {badgeProgress && (badgeProgress.needed - badgeProgress.current) <= 3 && (
              <div className="text-white/80 text-sm">
                • {badgeProgress.needed - badgeProgress.current} to {badgeProgress.badgeName}
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Enhanced Today's practice status */}
      {!todaysStep.completedAt && (
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Glowing background */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-teal-500/30 rounded-3xl blur-xl"
            style={{
              animation: "pulse 3s ease-in-out infinite"
            }}
          />
          
          {/* Main content card */}
          <div 
            className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/30"
            style={{
              boxShadow: `
                0 0 40px rgba(147, 51, 234, 0.3),
                0 0 80px rgba(59, 130, 246, 0.2),
                inset 0 0 40px rgba(255, 255, 255, 0.1)
              `
            }}
          >
            <motion.div 
              className="text-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="text-white text-xl font-bold mb-4">
                {timeOfDay === 'morning' ? "🌅 Today's Sacred Practice" : 
                 timeOfDay === 'afternoon' ? "⚡ Continue Your Journey" : 
                 "🌙 Complete Today's Step"}
              </div>
              
              <div className="space-y-3">
                <div className="text-white/95 text-lg font-semibold">{todaysStep.title}</div>
                
                <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
                  <span className="bg-white/20 rounded-full px-3 py-1">
                    ⏱️ {todaysStep.estimatedMinutes} min
                  </span>
                  <span className="bg-white/20 rounded-full px-3 py-1">
                    🧘‍♀️ {todaysStep.timeOfDay}
                  </span>
                </div>
                
                <div className="text-white/75 text-base leading-relaxed mt-4 max-w-lg mx-auto">
                  {todaysStep.practice}
                </div>
              </div>
              
              <motion.div 
                className="mt-6 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse" />
                  <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400/60 via-white/60 to-teal-400/60" />
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 animate-pulse" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {/* Enhanced Completed message */}
      {todaysStep.completedAt && timeOfDay === 'evening' && (
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div 
            className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-lg rounded-2xl p-6 border border-emerald-400/30"
            style={{
              boxShadow: `
                0 0 30px rgba(16, 185, 129, 0.3),
                inset 0 0 30px rgba(255, 255, 255, 0.1)
              `
            }}
          >
            <div className="text-white text-lg font-medium flex items-center justify-center gap-3">
              <span className="text-2xl">✨</span>
              <span>Today's practice complete. Integration in progress.</span>
              <span className="text-2xl">🙏</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}