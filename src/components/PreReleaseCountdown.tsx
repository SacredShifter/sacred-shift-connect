import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDate: Date;
  onCountdownComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const PreReleaseCountdown: React.FC<CountdownProps> = ({ targetDate, onCountdownComplete }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        onCountdownComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onCountdownComplete]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const formatNumber = (num: number): string => num.toString().padStart(2, '0');

  const isPortalReady = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="relative">
      {/* Portal Ring Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-96 h-96 rounded-full border-2 border-primary/30"
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full border border-primary-glow/40"
          animate={{ 
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full border border-primary/20"
          animate={{ 
            rotate: 360,
            scale: [1, 1.15, 1],
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      </div>

      {/* Countdown Display */}
      <div className="relative z-10 flex items-center justify-center">
        {isPortalReady ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center mb-4 mx-auto"
              animate={{ 
                boxShadow: [
                  "0 0 20px hsl(var(--primary-glow))",
                  "0 0 40px hsl(var(--primary-glow))",
                  "0 0 20px hsl(var(--primary-glow))"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl font-bold text-background">✦</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-primary mb-2">Portal Open</h2>
            <p className="text-muted-foreground">The Sacred Gateway Awaits</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((unit, index) => (
              <motion.div
                key={unit.label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg bg-background-inset border border-primary/20 flex items-center justify-center mb-2"
                  animate={{ 
                    boxShadow: unit.value > 0 ? [
                      "0 0 10px hsl(var(--primary) / 0.2)",
                      "0 0 20px hsl(var(--primary) / 0.4)",
                      "0 0 10px hsl(var(--primary) / 0.2)"
                    ] : "none"
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-2xl lg:text-3xl font-bold text-primary font-mono">
                    {formatNumber(unit.value)}
                  </span>
                </motion.div>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">
                  {unit.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};