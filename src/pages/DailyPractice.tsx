import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Target } from 'lucide-react';

export default function DailyPractice() {
  const navigate = useNavigate();
  const dailyRoutine = useDailyRoutine();
  const todaysStep = dailyRoutine?.getTodaysStep();

  if (!dailyRoutine || !todaysStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">No Practice Available</h1>
          <p className="text-muted-foreground">Your daily routine is not yet set up.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { state } = dailyRoutine;

  const handleStartPractice = () => {
    // For now, mark as complete - in the future this could navigate to specific practice
    dailyRoutine.completeStep(todaysStep.id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Today's Sacred Practice</h1>
            <p className="text-muted-foreground">{todaysStep.id} • {new Date().toLocaleDateString()}</p>
          </div>
        </motion.div>

        {/* Progress Streak */}
        {state.streak > 0 && (
          <motion.div 
            className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{state.streak} Day Streak</h3>
                <p className="text-muted-foreground">Keep the momentum going!</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Practice Card */}
        <motion.div 
          className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="space-y-6">
            {/* Practice Title */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{todaysStep.title}</h2>
              
              {/* Practice Details */}
              <div className="flex items-center justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{todaysStep.estimatedMinutes} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{todaysStep.timeOfDay}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>{todaysStep.id}</span>
                </div>
              </div>
            </div>

            {/* Practice Description */}
            <div className="bg-muted/30 rounded-2xl p-6">
              <p className="text-foreground/90 text-lg leading-relaxed text-center">
                {todaysStep.practice}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {!todaysStep.completedAt ? (
                <>
                  <Button 
                    onClick={handleStartPractice}
                    className="flex-1 py-6 text-lg font-semibold"
                    size="lg"
                  >
                    Complete Today's Practice
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="sm:w-auto"
                  >
                    Return Later
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 text-emerald-600">
                    <span className="text-2xl">✨</span>
                    <span className="text-lg font-medium">Practice Complete!</span>
                    <span className="text-2xl">🙏</span>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}