// Sacred Practice Tracker
// Tracks daily completion, session history, and practice analytics
// Implements Principle of Rhythm: daily practice patterns and consistency tracking

export interface PracticeSession {
  id: string;
  practiceType: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  completed: boolean;
  reflection?: string;
  metrics: {
    cycles: number;
    averageHeartRate: number;
    peakHeartRate: number;
    calmnessLevel: number;
    focusLevel: number;
  };
  timestamp: string;
}

export interface DailyPractice {
  date: string; // YYYY-MM-DD format
  practices: PracticeSession[];
  totalDuration: number;
  completed: boolean;
  streak: number;
  mood: 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';
  notes?: string;
}

export interface PracticeStats {
  totalSessions: number;
  totalDuration: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  averageSessionDuration: number;
  completionRate: number; // percentage
  lastPracticeDate?: string;
  favoriteTime: string; // most common practice time
  weeklyGoal: number; // sessions per week
  weeklyProgress: number; // current week's sessions
  monthlyGoal: number; // sessions per month
  monthlyProgress: number; // current month's sessions
}

export interface PracticeInsights {
  consistency: 'excellent' | 'good' | 'needs_improvement';
  bestTimeOfDay: string;
  averageCalmness: number;
  improvementAreas: string[];
  achievements: string[];
  recommendations: string[];
}

export class PracticeTracker {
  private storageKey = 'sacred-practice-tracker';
  private practices: Map<string, DailyPractice> = new Map();
  private currentStreak = 0;
  private longestStreak = 0;

  constructor() {
    this.loadFromStorage();
    this.calculateStreaks();
  }

  // Record a practice session
  recordSession(session: Omit<PracticeSession, 'id' | 'timestamp'>): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullSession: PracticeSession = {
      ...session,
      id: sessionId,
      timestamp: new Date().toISOString()
    };

    const today = this.getTodayString();
    const dailyPractice = this.practices.get(today) || {
      date: today,
      practices: [],
      totalDuration: 0,
      completed: false,
      streak: 0,
      mood: 'neutral' as const
    };

    dailyPractice.practices.push(fullSession);
    dailyPractice.totalDuration += session.duration;
    dailyPractice.completed = true;

    this.practices.set(today, dailyPractice);
    this.calculateStreaks();
    this.saveToStorage();

    console.log(`📝 Practice session recorded: ${sessionId}`);
    return sessionId;
  }

  // Get today's practice status
  getTodayStatus(): {
    completed: boolean;
    sessions: PracticeSession[];
    totalDuration: number;
    streak: number;
  } {
    const today = this.getTodayString();
    const dailyPractice = this.practices.get(today);

    return {
      completed: dailyPractice?.completed || false,
      sessions: dailyPractice?.practices || [],
      totalDuration: dailyPractice?.totalDuration || 0,
      streak: this.currentStreak
    };
  }

  // Get practice statistics
  getStats(): PracticeStats {
    const allSessions = Array.from(this.practices.values())
      .flatMap(day => day.practices);

    const totalSessions = allSessions.length;
    const totalDuration = allSessions.reduce((sum, session) => sum + session.duration, 0) / 60; // convert to minutes
    const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    // Calculate completion rate (last 30 days)
    const last30Days = this.getLastNDays(30);
    const completedDays = last30Days.filter(date => 
      this.practices.get(date)?.completed
    ).length;
    const completionRate = last30Days.length > 0 ? (completedDays / last30Days.length) * 100 : 0;

    // Find most common practice time
    const practiceTimes = allSessions.map(session => {
      const hour = new Date(session.startTime).getHours();
      if (hour < 6) return 'early_morning';
      if (hour < 12) return 'morning';
      if (hour < 18) return 'afternoon';
      return 'evening';
    });

    const timeCounts = practiceTimes.reduce((acc, time) => {
      acc[time] = (acc[time] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteTime = Object.entries(timeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'morning';

    // Calculate weekly and monthly progress
    const currentWeek = this.getCurrentWeek();
    const currentMonth = this.getCurrentMonth();
    
    const weeklyProgress = currentWeek.filter(date => 
      this.practices.get(date)?.completed
    ).length;

    const monthlyProgress = currentMonth.filter(date => 
      this.practices.get(date)?.completed
    ).length;

    const lastPracticeDate = allSessions.length > 0 
      ? allSessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0].startTime.toISOString().split('T')[0]
      : undefined;

    return {
      totalSessions,
      totalDuration: Math.round(totalDuration),
      currentStreak: this.currentStreak,
      longestStreak: this.longestStreak,
      averageSessionDuration: Math.round(averageSessionDuration),
      completionRate: Math.round(completionRate),
      lastPracticeDate,
      favoriteTime,
      weeklyGoal: 7, // 7 sessions per week
      weeklyProgress,
      monthlyGoal: 30, // 30 sessions per month
      monthlyProgress
    };
  }

  // Get practice insights
  getInsights(): PracticeInsights {
    const stats = this.getStats();
    const allSessions = Array.from(this.practices.values())
      .flatMap(day => day.practices);

    // Determine consistency
    let consistency: 'excellent' | 'good' | 'needs_improvement';
    if (stats.completionRate >= 80) consistency = 'excellent';
    else if (stats.completionRate >= 60) consistency = 'good';
    else consistency = 'needs_improvement';

    // Calculate average calmness
    const averageCalmness = allSessions.length > 0
      ? allSessions.reduce((sum, session) => sum + session.metrics.calmnessLevel, 0) / allSessions.length
      : 0;

    // Identify improvement areas
    const improvementAreas: string[] = [];
    if (stats.completionRate < 60) improvementAreas.push('Consistency');
    if (stats.averageSessionDuration < 2) improvementAreas.push('Session Duration');
    if (averageCalmness < 0.6) improvementAreas.push('Calmness Level');
    if (stats.currentStreak < 7) improvementAreas.push('Daily Practice');

    // Generate achievements
    const achievements: string[] = [];
    if (stats.currentStreak >= 7) achievements.push('7-Day Streak! 🔥');
    if (stats.currentStreak >= 30) achievements.push('30-Day Streak! 🌟');
    if (stats.totalSessions >= 100) achievements.push('100 Sessions! 🎉');
    if (stats.completionRate >= 90) achievements.push('Consistency Master! 📈');

    // Generate recommendations
    const recommendations: string[] = [];
    if (stats.completionRate < 60) {
      recommendations.push('Try setting a daily reminder for your practice');
    }
    if (stats.averageSessionDuration < 2) {
      recommendations.push('Consider extending your practice sessions');
    }
    if (stats.currentStreak < 3) {
      recommendations.push('Focus on building a consistent daily habit');
    }
    if (averageCalmness < 0.6) {
      recommendations.push('Try practicing in a quieter environment');
    }

    return {
      consistency,
      bestTimeOfDay: stats.favoriteTime,
      averageCalmness: Math.round(averageCalmness * 100) / 100,
      improvementAreas,
      achievements,
      recommendations
    };
  }

  // Get session history for a date range
  getSessionHistory(startDate: Date, endDate: Date): PracticeSession[] {
    const sessions: PracticeSession[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateString = this.formatDate(currentDate);
      const dailyPractice = this.practices.get(dateString);
      if (dailyPractice) {
        sessions.push(...dailyPractice.practices);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  // Update daily mood
  updateDailyMood(date: string, mood: DailyPractice['mood'], notes?: string): void {
    const dailyPractice = this.practices.get(date) || {
      date,
      practices: [],
      totalDuration: 0,
      completed: false,
      streak: 0,
      mood: 'neutral' as const
    };

    dailyPractice.mood = mood;
    if (notes) dailyPractice.notes = notes;

    this.practices.set(date, dailyPractice);
    this.saveToStorage();
  }

  // Calculate streaks
  private calculateStreaks(): void {
    const dates = Array.from(this.practices.keys()).sort().reverse();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (const date of dates) {
      const dailyPractice = this.practices.get(date);
      if (dailyPractice?.completed) {
        if (currentStreak === 0) currentStreak = 1;
        else if (this.isConsecutiveDay(date, dates[dates.indexOf(date) + 1])) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    this.currentStreak = currentStreak;
    this.longestStreak = longestStreak;
  }

  // Check if two dates are consecutive
  private isConsecutiveDay(date1: string, date2: string): boolean {
    if (!date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d1.getTime() - d2.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }

  // Get today's date string
  private getTodayString(): string {
    return this.formatDate(new Date());
  }

  // Format date as YYYY-MM-DD
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Get last N days
  private getLastNDays(n: number): string[] {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 0; i < n; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(this.formatDate(date));
    }
    
    return dates;
  }

  // Get current week dates
  private getCurrentWeek(): string[] {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const week: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(this.formatDate(date));
    }
    
    return week;
  }

  // Get current month dates
  private getCurrentMonth(): string[] {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const month: string[] = [];
    const current = new Date(startOfMonth);
    
    while (current <= endOfMonth) {
      month.push(this.formatDate(current));
      current.setDate(current.getDate() + 1);
    }
    
    return month;
  }

  // Load data from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.practices = new Map(data.practices || []);
        this.currentStreak = data.currentStreak || 0;
        this.longestStreak = data.longestStreak || 0;
      }
    } catch (error) {
      console.warn('Failed to load practice data:', error);
    }
  }

  // Save data to localStorage
  private saveToStorage(): void {
    try {
      const data = {
        practices: Array.from(this.practices.entries()),
        currentStreak: this.currentStreak,
        longestStreak: this.longestStreak,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save practice data:', error);
    }
  }

  // Clear all data (for testing)
  clearAllData(): void {
    this.practices.clear();
    this.currentStreak = 0;
    this.longestStreak = 0;
    localStorage.removeItem(this.storageKey);
  }
}

// Export singleton instance
export const practiceTracker = new PracticeTracker();
