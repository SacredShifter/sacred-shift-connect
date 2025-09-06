// Sacred Micro-Reset Practice Component
// 60-second nervous system safety switch with guided 4-4-4-4 breath cycle
// Implements Principle of Rhythm: cyclical breathing patterns for consciousness regulation

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Heart, Clock, CheckCircle, Trophy, TrendingUp, Calendar, Target } from 'lucide-react';
import { practiceTracker, PracticeSession } from '../../lib/practice/PracticeTracker';

interface BreathPhase {
  name: string;
  duration: number;
  instruction: string;
  color: string;
  icon: string;
}

interface MicroResetState {
  isActive: boolean;
  isPaused: boolean;
  currentPhase: number;
  timeRemaining: number;
  totalTime: number;
  cycleCount: number;
  reflection: string;
  isComplete: boolean;
  heartRate: number;
  startTime?: number;
  endTime?: number;
  peakHeartRate: number;
  calmnessLevel: number;
  focusLevel: number;
  todayCompleted: boolean;
  showStats: boolean;
}

const BREATH_PHASES: BreathPhase[] = [
  {
    name: 'Inhale',
    duration: 4,
    instruction: 'Breathe in slowly and deeply',
    color: 'from-blue-400 to-cyan-300',
    icon: '↗'
  },
  {
    name: 'Hold',
    duration: 4,
    instruction: 'Hold your breath gently',
    color: 'from-cyan-300 to-green-300',
    icon: '→'
  },
  {
    name: 'Exhale',
    duration: 4,
    instruction: 'Release slowly and completely',
    color: 'from-green-300 to-yellow-300',
    icon: '↘'
  },
  {
    name: 'Rest',
    duration: 4,
    instruction: 'Rest in the stillness',
    color: 'from-yellow-300 to-orange-300',
    icon: '↓'
  }
];

const MicroReset: React.FC = () => {
  const [state, setState] = useState<MicroResetState>({
    isActive: false,
    isPaused: false,
    currentPhase: 0,
    timeRemaining: 60,
    totalTime: 60,
    cycleCount: 0,
    reflection: '',
    isComplete: false,
    heartRate: 72,
    peakHeartRate: 72,
    calmnessLevel: 0.5,
    focusLevel: 0.5,
    todayCompleted: false,
    showStats: false
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const heartRateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check today's completion status on mount
  useEffect(() => {
    const todayStatus = practiceTracker.getTodayStatus();
    setState(prev => ({
      ...prev,
      todayCompleted: todayStatus.completed
    }));
  }, []);

  // Calculate progress percentage
  const progress = ((state.totalTime - state.timeRemaining) / state.totalTime) * 100;
  const currentPhase = BREATH_PHASES[state.currentPhase];
  const phaseProgress = ((4 - (state.timeRemaining % 4)) / 4) * 100;

  // Start the practice
  const startPractice = () => {
    const startTime = Date.now();
    setState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
      startTime,
      timeRemaining: 60,
      currentPhase: 0,
      cycleCount: 0,
      isComplete: false,
      peakHeartRate: 72,
      calmnessLevel: 0.5,
      focusLevel: 0.5
    }));

    // Start main timer
    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          // Practice complete
          clearInterval(intervalRef.current!);
          clearInterval(phaseIntervalRef.current!);
          clearInterval(heartRateIntervalRef.current!);
          
          const endTime = Date.now();
          const duration = Math.round((endTime - (prev.startTime || endTime)) / 1000);
          
          return {
            ...prev,
            isActive: false,
            isComplete: true,
            timeRemaining: 0,
            endTime
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);

    // Start phase timer (4-second cycles)
    phaseIntervalRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        currentPhase: (prev.currentPhase + 1) % BREATH_PHASES.length,
        cycleCount: prev.currentPhase === 0 ? prev.cycleCount + 1 : prev.cycleCount
      }));
    }, 4000);

    // Simulate heart rate changes
    heartRateIntervalRef.current = setInterval(() => {
      setState(prev => {
        const baseRate = 72;
        const variation = Math.sin(Date.now() / 10000) * 5; // Slow oscillation
        const breathEffect = Math.sin((60 - prev.timeRemaining) / 4) * 3; // Breath effect
        const newHeartRate = Math.round(baseRate + variation + breathEffect);
        
        return {
          ...prev,
          heartRate: newHeartRate,
          peakHeartRate: Math.max(prev.peakHeartRate, newHeartRate),
          calmnessLevel: Math.max(0, Math.min(1, 0.5 + Math.sin((60 - prev.timeRemaining) / 10) * 0.3)),
          focusLevel: Math.max(0, Math.min(1, 0.5 + Math.cos((60 - prev.timeRemaining) / 8) * 0.4))
        };
      });
    }, 2000);
  };

  // Pause/Resume practice
  const togglePause = () => {
    if (state.isPaused) {
      // Resume
      startPractice();
    } else {
      // Pause
      setState(prev => ({ ...prev, isPaused: true, isActive: false }));
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
      if (heartRateIntervalRef.current) clearInterval(heartRateIntervalRef.current);
    }
  };

  // Reset practice
  const resetPractice = () => {
    setState({
      isActive: false,
      isPaused: false,
      currentPhase: 0,
      timeRemaining: 60,
      totalTime: 60,
      cycleCount: 0,
      reflection: '',
      isComplete: false,
      heartRate: 72
    });
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
    if (heartRateIntervalRef.current) clearInterval(heartRateIntervalRef.current);
  };

  // Save to journal
  const saveToJournal = () => {
    if (!state.startTime || !state.endTime) return;

    const duration = Math.round((state.endTime - state.startTime) / 1000);
    
    // Record the practice session
    const sessionId = practiceTracker.recordSession({
      practiceType: 'micro-reset',
      startTime: new Date(state.startTime),
      endTime: new Date(state.endTime),
      duration,
      completed: true,
      reflection: state.reflection,
      metrics: {
        cycles: state.cycleCount,
        averageHeartRate: state.heartRate,
        peakHeartRate: state.peakHeartRate,
        calmnessLevel: state.calmnessLevel,
        focusLevel: state.focusLevel
      }
    });

    // Update today's completion status
    setState(prev => ({
      ...prev,
      todayCompleted: true
    }));

    // Show success message with stats
    const stats = practiceTracker.getStats();
    alert(`Practice saved! 🌸\n\nSession ID: ${sessionId}\nCurrent Streak: ${stats.currentStreak} days\nTotal Sessions: ${stats.totalSessions}`);
    
    // Reset for next practice
    resetPractice();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
      if (heartRateIntervalRef.current) clearInterval(heartRateIntervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              state.todayCompleted 
                ? 'border-green-400 bg-green-400/20' 
                : 'border-green-400'
            }`}>
              <Heart className={`w-4 h-4 ${state.todayCompleted ? 'text-green-400' : 'text-green-400'}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Micro-Reset</h1>
              <p className="text-purple-300 text-sm">60-second nervous system safety switch</p>
              {state.todayCompleted && (
                <p className="text-green-400 text-xs font-medium">✅ Completed today</p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
              state.todayCompleted ? 'bg-green-600' : 'bg-purple-600'
            }`}>
              {state.todayCompleted ? 'Completed' : 'Today'}
            </div>
            <div className="px-3 py-1 border border-purple-400 rounded-full text-white text-sm flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>1m</span>
            </div>
            <button
              onClick={() => setState(prev => ({ ...prev, showStats: !prev.showStats }))}
              className="px-3 py-1 border border-purple-400 rounded-full text-white text-sm flex items-center space-x-1 hover:bg-purple-400/20 transition-colors"
            >
              <TrendingUp className="w-3 h-3" />
              <span>Stats</span>
            </button>
          </div>
        </div>

        {/* Practice Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Practice</h2>
          </div>

          {/* Breathing Circle */}
          <div className="relative mb-6">
            <div className="w-48 h-48 mx-auto relative">
              {/* Outer progress ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inner breathing circle */}
              <div 
                className={`absolute inset-8 rounded-full bg-gradient-to-br ${currentPhase.color} flex items-center justify-center transition-all duration-1000 ease-in-out`}
                style={{
                  transform: `scale(${0.8 + (phaseProgress / 100) * 0.4})`,
                  opacity: 0.7 + (phaseProgress / 100) * 0.3
                }}
              >
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">{currentPhase.icon}</div>
                  <div className="text-lg font-semibold">{currentPhase.name}</div>
                  <div className="text-sm opacity-80">{currentPhase.duration}s</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Phase Info */}
          <div className="text-center mb-4">
            <p className="text-white text-lg mb-2">{currentPhase.instruction}</p>
            <div className="flex justify-center space-x-4 text-sm text-purple-300">
              <span>Cycle: {state.cycleCount}</span>
              <span>•</span>
              <span>Time: {state.timeRemaining}s</span>
              <span>•</span>
              <span>HR: {state.heartRate} bpm</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!state.isActive && !state.isComplete && (
              <button
                onClick={startPractice}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold flex items-center space-x-2 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                <span>Start Practice</span>
              </button>
            )}

            {state.isActive && (
              <button
                onClick={togglePause}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold flex items-center space-x-2 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
              >
                <Pause className="w-5 h-5" />
                <span>{state.isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            )}

            {(state.isActive || state.isComplete) && (
              <button
                onClick={resetPractice}
                className="px-6 py-3 bg-gray-600 text-white rounded-full font-semibold flex items-center space-x-2 hover:bg-gray-700 transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Why This Matters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-sm font-bold">i</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Why this matters</h3>
            <span className="text-white">→</span>
          </div>
          <p className="text-purple-200 text-sm leading-relaxed">
            The 4-4-4-4 breath cycle activates your parasympathetic nervous system, 
            reducing cortisol and promoting calm. This physiological reset requires 
            no belief system - it's pure science. Notice your heart rate drop and 
            mental clarity increase as you practice.
          </p>
        </div>

        {/* Reflection */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Quick reflection (optional)</h3>
          <textarea
            value={state.reflection}
            onChange={(e) => setState(prev => ({ ...prev, reflection: e.target.value }))}
            placeholder="How did this practice land for you?"
            className="w-full h-20 bg-purple-900/50 border border-purple-400/30 rounded-lg p-3 text-white placeholder-purple-300 resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        {/* Stats Display */}
        {state.showStats && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Your Practice Stats</h3>
            </div>
            
            {(() => {
              const stats = practiceTracker.getStats();
              const insights = practiceTracker.getInsights();
              
              return (
                <div className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{stats.currentStreak}</div>
                      <div className="text-sm text-purple-300">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{stats.totalSessions}</div>
                      <div className="text-sm text-purple-300">Total Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{stats.completionRate}%</div>
                      <div className="text-sm text-purple-300">Completion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-400">{stats.totalDuration}</div>
                      <div className="text-sm text-purple-300">Minutes Practiced</div>
                    </div>
                  </div>

                  {/* Weekly Progress */}
                  <div>
                    <div className="flex justify-between text-sm text-purple-300 mb-2">
                      <span>This Week</span>
                      <span>{stats.weeklyProgress}/{stats.weeklyGoal}</span>
                    </div>
                    <div className="w-full bg-purple-900/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.weeklyProgress / stats.weeklyGoal) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Achievements */}
                  {insights.achievements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Recent Achievements</h4>
                      <div className="space-y-1">
                        {insights.achievements.map((achievement, index) => (
                          <div key={index} className="text-sm text-yellow-400 flex items-center space-x-2">
                            <Trophy className="w-3 h-3" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {insights.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Recommendations</h4>
                      <div className="space-y-1">
                        {insights.recommendations.map((rec, index) => (
                          <div key={index} className="text-sm text-purple-300 flex items-center space-x-2">
                            <Target className="w-3 h-3" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Complete Button */}
        {state.isComplete && (
          <button
            onClick={saveToJournal}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
          >
            <CheckCircle className="w-6 h-6" />
            <span>Mark Complete & Save to Journal</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MicroReset;
