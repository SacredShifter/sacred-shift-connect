import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Zap, Wind, Snowflake, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSynchronicityMirror } from '@/hooks/useSynchronicityMirror';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const EnhancedMysticHarmony = () => {
  const { currentReading } = useSynchronicityMirror();
  const { user } = useAuth();
  
  // Fetch user's recent journal entries to calculate authentic resonance
  const { data: recentEntries } = useQuery({
    queryKey: ['recent-journal-resonance', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('mirror_journal_entries')
        .select('mood_tag, resonance_sigil, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });
  
  // Calculate resonance based on actual user data
  const calculateResonance = () => {
    if (!recentEntries?.length) return currentReading?.resonance_score || 0.5;
    
    // Calculate based on mood trends and recent activity
    const moodScores = recentEntries.map(entry => {
      const mood = entry.mood_tag?.toLowerCase() || '';
      if (mood.includes('blissful') || mood.includes('enlightened')) return 0.9;
      if (mood.includes('peaceful') || mood.includes('harmonious')) return 0.8;
      if (mood.includes('good') || mood.includes('positive')) return 0.7;
      if (mood.includes('neutral') || mood.includes('calm')) return 0.6;
      if (mood.includes('confused') || mood.includes('scattered')) return 0.4;
      if (mood.includes('distressed') || mood.includes('chaotic')) return 0.3;
      return 0.5;
    });
    
    const avgMood = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;
    
    // Factor in frequency of entries (more entries = higher resonance)
    const activityBonus = Math.min(0.2, recentEntries.length * 0.04);
    
    return Math.min(1, avgMood + activityBonus);
  };
  
  const resonanceScore = calculateResonance();
  
  const getWeatherData = (score: number) => {
    if (score >= 0.9) {
      return {
        weather: 'Celestial Harmony',
        icon: Sun,
        color: 'text-yellow-500',
        bg: 'from-yellow-500/20 to-orange-500/10',
        description: 'Perfect alignment flows',
        sigil: '☀',
        message: 'Your consciousness radiates pure light'
      };
    } else if (score >= 0.75) {
      return {
        weather: 'Mystic Harmony',
        icon: Wind,
        color: 'text-blue-500',
        bg: 'from-blue-500/20 to-cyan-500/10',
        description: 'Synchronicities dancing',
        sigil: '◊',
        message: 'The universe conspires in your favor'
      };
    } else if (score >= 0.6) {
      return {
        weather: 'Sacred Storm',
        icon: CloudRain,
        color: 'text-purple-500',
        bg: 'from-purple-500/20 to-violet-500/10',
        description: 'Transformation brewing',
        sigil: '⚡',
        message: 'Change awakens new possibilities'
      };
    } else if (score >= 0.4) {
      return {
        weather: 'Ethereal Mist',
        icon: Cloud,
        color: 'text-gray-500',
        bg: 'from-gray-500/20 to-slate-500/10',
        description: 'Mysteries emerging',
        sigil: '◐',
        message: 'Hidden truths seek your attention'
      };
    } else {
      return {
        weather: 'Deep Reflection',
        icon: Snowflake,
        color: 'text-indigo-500',
        bg: 'from-indigo-500/20 to-blue-500/10',
        description: 'Inner stillness calls',
        sigil: '❅',
        message: 'Silence holds profound wisdom'
      };
    }
  };

  const weather = getWeatherData(resonanceScore);
  const WeatherIcon = weather.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`bg-gradient-to-r ${weather.bg} border-primary/20 relative overflow-hidden cursor-help hover:border-primary/40 transition-all`}>
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
                    className={`p-2 rounded-full bg-background/20 ${weather.color} relative`}
                  >
                    <WeatherIcon className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{weather.weather}</h3>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </div>
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
              
              {/* Resonance message */}
              <div className="mt-3 pt-3 border-t border-primary/10">
                <p className="text-xs text-muted-foreground italic text-center">
                  {weather.message}
                </p>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">Mystic Harmony Weather</p>
            <p className="text-sm">This shows your current synchronicity weather based on your recent journal entries, mood patterns, and spiritual activities.</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Higher resonance = more synchronicities</div>
              <div>• Weather changes based on your inner state</div>
              <div>• Use this to guide your daily practices</div>
            </div>
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs">
                <strong>Based on:</strong> {recentEntries?.length || 0} recent journal entries, mood trends, and practice consistency
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};