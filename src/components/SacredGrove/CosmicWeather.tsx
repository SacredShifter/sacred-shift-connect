import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Star, Zap, Cloud, Wind } from 'lucide-react';

interface CosmicEvent {
  id: string;
  name: string;
  type: 'planetary' | 'lunar' | 'solar' | 'galactic';
  intensity: number;
  influence: number;
  description: string;
}

export const CosmicWeather: React.FC = () => {
  const [cosmicEvents, setCosmicEvents] = useState<CosmicEvent[]>([]);
  const [currentPhase, setCurrentPhase] = useState<'dawn' | 'day' | 'dusk' | 'night'>('day');

  useEffect(() => {
    // Simulate cosmic events (in production, this would connect to real astronomical data)
    const events: CosmicEvent[] = [
      {
        id: 'moon-phase',
        name: 'Waxing Crescent',
        type: 'lunar',
        intensity: 0.7,
        influence: 0.8,
        description: 'A time of new beginnings and intention setting'
      },
      {
        id: 'mercury-retrograde',
        name: 'Mercury Retrograde',
        type: 'planetary',
        intensity: 0.6,
        influence: 0.5,
        description: 'A period for reflection and inner work'
      },
      {
        id: 'solar-flare',
        name: 'Solar Flare Activity',
        type: 'solar',
        intensity: 0.4,
        influence: 0.3,
        description: 'Enhanced cosmic energy affecting consciousness'
      }
    ];

    setCosmicEvents(events);

    // Determine current phase based on time
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setCurrentPhase('dawn');
    else if (hour >= 12 && hour < 17) setCurrentPhase('day');
    else if (hour >= 17 && hour < 20) setCurrentPhase('dusk');
    else setCurrentPhase('night');
  }, []);

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'dawn': return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'day': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'dusk': return <Moon className="w-4 h-4 text-orange-400" />;
      case 'night': return <Moon className="w-4 h-4 text-blue-400" />;
      default: return <Sun className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'lunar': return <Moon className="w-3 h-3" />;
      case 'planetary': return <Star className="w-3 h-3" />;
      case 'solar': return <Sun className="w-3 h-3" />;
      case 'galactic': return <Zap className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'lunar': return 'text-blue-400';
      case 'planetary': return 'text-purple-400';
      case 'solar': return 'text-yellow-400';
      case 'galactic': return 'text-pink-400';
      default: return 'text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute top-4 right-4 z-20"
    >
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 min-w-[300px]">
        <div className="flex items-center gap-2 mb-3">
          {getPhaseIcon(currentPhase)}
          <h4 className="text-sm font-semibold text-white">Cosmic Weather</h4>
        </div>

        <div className="space-y-3">
          {cosmicEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className={getEventColor(event.type)}>
                  {getEventIcon(event.type)}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {event.name}
                  </div>
                  <div className="text-xs text-white/60">
                    {event.description}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-white/80">
                  {(event.intensity * 100).toFixed(0)}%
                </div>
                <div className="w-12 bg-white/10 rounded-full h-1">
                  <motion.div
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-1 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${event.intensity * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Current Phase: {currentPhase}</span>
            <span>Influence: {Math.round(cosmicEvents.reduce((sum, event) => sum + event.influence, 0) / cosmicEvents.length * 100)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
