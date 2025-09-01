import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GuidedPracticeFlow } from '@/components/practice/GuidedPracticeFlow';

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

  const handleCompletePractice = (reflection?: string) => {
    dailyRoutine.completeStep(todaysStep.id, reflection);
    navigate('/dashboard');
  };

  const handleExit = () => {
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

        {/* Guided Practice Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <GuidedPracticeFlow
            step={todaysStep}
            streak={state.streak}
            onComplete={handleCompletePractice}
            onExit={handleExit}
          />
        </motion.div>
      </div>
    </div>
  );
}