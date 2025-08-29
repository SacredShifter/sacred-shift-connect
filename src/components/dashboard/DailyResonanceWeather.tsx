import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Zap, Wind, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSynchronicityMirror } from '@/hooks/useSynchronicityMirror';

export const DailyResonanceWeather = () => {
  const { currentReading } = useSynchronicityMirror();
  
  // Mock resonance weather data
  const resonanceScore = currentReading?.resonance_score || 0.78;
  
  const getWeatherData = (score: number) => {
    if (score >= 0.9) {
      return {
        weather: 'Celestial Clarity',
        icon: Sun,
        color: 'text-yellow-500',
        bg: 'from-yellow-500/20 to-orange-500/10',
        description: 'Perfect alignment flows',
        sigil: '☀'
      };
    } else if (score >= 0.75) {
      return {
        weather: 'Mystic Harmony',
        icon: Wind,
        color: 'text-blue-500',
        bg: 'from-blue-500/20 to-cyan-500/10',
        description: 'Synchronicities dancing',
        sigil: '◊'
      };
    } else if (score >= 0.6) {
      return {
        weather: 'Sacred Storm',
        icon: CloudRain,
        color: 'text-purple-500',
        bg: 'from-purple-500/20 to-violet-500/10',
        description: 'Transformation brewing',
        sigil: '⚡'
      };
    } else if (score >= 0.4) {
      return {
        weather: 'Ethereal Mist',
        icon: Cloud,
        color: 'text-gray-500',
        bg: 'from-gray-500/20 to-slate-500/10',
        description: 'Mysteries emerging',
        sigil: '◐'
      };
    } else {
      return {
        weather: 'Deep Reflection',
        icon: Snowflake,
        color: 'text-indigo-500',
        bg: 'from-indigo-500/20 to-blue-500/10',
        description: 'Inner stillness calls',
        sigil: '❅'
      };
    }
  };

  const weather = getWeatherData(resonanceScore);
  const WeatherIcon = weather.icon;

  return (
    <Card className={`bg-gradient-to-r ${weather.bg} border-primary/20 relative overflow-hidden`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`p-2 rounded-full bg-background/20 ${weather.color}`}
            >
              <WeatherIcon className="h-5 w-5" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-sm">{weather.weather}</h3>
              <p className="text-xs text-muted-foreground">{weather.description}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-1">
              {Math.round(resonanceScore * 100)}°
            </Badge>
            <motion.div
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-lg"
            >
              {weather.sigil}
            </motion.div>
          </div>
        </div>
        
        {/* Atmospheric particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 15}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};