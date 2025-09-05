/**
 * Sacred Shifter Sacred Timing Dashboard
 * Displays optimal timing for practices based on cosmic cycles
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Moon, 
  Sun, 
  Clock, 
  Sparkles, 
  Zap, 
  Heart, 
  Brain,
  Calendar,
  Compass,
  Star,
  RefreshCw,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useDailyRoutine } from '@/providers/DailyRoutineProvider';
import { LunarPhase, Season, SacredTiming } from '@/providers/DailyRoutineProvider';

interface SacredTimingInfo {
  timing: SacredTiming;
  hour: number;
  lunarPhase: LunarPhase;
  season: Season;
  optimalPractices: string[];
  energyQuality: string;
  chakraFocus: string[];
  archetypeResonance: string[];
}

export const SacredTimingDashboard: React.FC = () => {
  const { 
    state, 
    toggleSacredTiming, 
    updateLunarPhase, 
    updateSeason,
    getOptimalTiming,
    getSacredRecommendations
  } = useDailyRoutine();

  const [timingInfo, setTimingInfo] = useState<SacredTimingInfo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get current timing information
  const getCurrentTimingInfo = (): SacredTimingInfo => {
    const hour = new Date().getHours();
    const { timing } = getOptimalTiming();
    
    const timingData: { [key in SacredTiming]: Partial<SacredTimingInfo> } = {
      'dawn': {
        optimalPractices: ['Meditation', 'Intention Setting', 'Breath Work', 'Gratitude'],
        energyQuality: 'Fresh, new beginnings, clarity',
        chakraFocus: ['crown', 'third-eye'],
        archetypeResonance: ['mystic', 'sage']
      },
      'midday': {
        optimalPractices: ['Action', 'Manifestation', 'Creative Work', 'Social Connection'],
        energyQuality: 'Active, powerful, manifesting',
        chakraFocus: ['solar-plexus', 'heart'],
        archetypeResonance: ['warrior', 'creator']
      },
      'dusk': {
        optimalPractices: ['Reflection', 'Integration', 'Gratitude', 'Release'],
        energyQuality: 'Reflective, integrating, releasing',
        chakraFocus: ['heart', 'throat'],
        archetypeResonance: ['healer', 'sage']
      },
      'midnight': {
        optimalPractices: ['Deep Meditation', 'Shadow Work', 'Dream Work', 'Transcendence'],
        energyQuality: 'Mystical, deep, transformative',
        chakraFocus: ['crown', 'third-eye'],
        archetypeResonance: ['mystic', 'guardian']
      },
      'lunar-phase': {
        optimalPractices: ['Lunar Rituals', 'Cyclical Work', 'Emotional Processing'],
        energyQuality: 'Cyclical, emotional, intuitive',
        chakraFocus: ['sacral', 'heart'],
        archetypeResonance: ['healer', 'mystic']
      },
      'seasonal': {
        optimalPractices: ['Seasonal Rituals', 'Nature Connection', 'Cyclical Awareness'],
        energyQuality: 'Natural, cyclical, grounded',
        chakraFocus: ['root', 'heart'],
        archetypeResonance: ['guardian', 'healer']
      }
    };

    const currentData = timingData[timing] || timingData['lunar-phase'];

    return {
      timing,
      hour,
      lunarPhase: state.lunarPhase,
      season: state.season,
      optimalPractices: currentData.optimalPractices || [],
      energyQuality: currentData.energyQuality || 'Balanced',
      chakraFocus: currentData.chakraFocus || [],
      archetypeResonance: currentData.archetypeResonance || []
    };
  };

  // Update timing info when state changes
  useEffect(() => {
    setTimingInfo(getCurrentTimingInfo());
  }, [state.lunarPhase, state.season, state.sacredTimingEnabled]);

  const handleLunarPhaseChange = async (phase: LunarPhase) => {
    setIsUpdating(true);
    try {
      updateLunarPhase(phase);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSeasonChange = async (season: Season) => {
    setIsUpdating(true);
    try {
      updateSeason(season);
    } finally {
      setIsUpdating(false);
    }
  };

  const getLunarPhaseIcon = (phase: LunarPhase) => {
    switch (phase) {
      case 'new': return '🌑';
      case 'waxing': return '🌒';
      case 'full': return '🌕';
      case 'waning': return '🌖';
      default: return '🌙';
    }
  };

  const getSeasonIcon = (season: Season) => {
    switch (season) {
      case 'spring': return '🌸';
      case 'summer': return '☀️';
      case 'autumn': return '🍂';
      case 'winter': return '❄️';
      default: return '🌿';
    }
  };

  const getTimingIcon = (timing: SacredTiming) => {
    switch (timing) {
      case 'dawn': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'midday': return <Zap className="w-5 h-5 text-orange-500" />;
      case 'dusk': return <Moon className="w-5 h-5 text-purple-500" />;
      case 'midnight': return <Star className="w-5 h-5 text-indigo-500" />;
      case 'lunar-phase': return <Moon className="w-5 h-5 text-blue-500" />;
      case 'seasonal': return <Calendar className="w-5 h-5 text-green-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!timingInfo) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sacred timing...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sacredRecommendations = getSacredRecommendations();
  const optimalTiming = getOptimalTiming();

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              Sacred Timing Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Switch
                checked={state.sacredTimingEnabled}
                onCheckedChange={toggleSacredTiming}
              />
              <span className="text-sm text-muted-foreground">Sacred Timing</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Timing */}
            <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getTimingIcon(timingInfo.timing)}
                <span className="font-semibold capitalize">{timingInfo.timing.replace('-', ' ')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {timingInfo.hour}:00 - {optimalTiming.bestTime}
              </p>
            </div>

            {/* Lunar Phase */}
            <div className="text-center p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">{getLunarPhaseIcon(timingInfo.lunarPhase)}</span>
                <span className="font-semibold capitalize">{timingInfo.lunarPhase} Moon</span>
              </div>
              <p className="text-sm text-muted-foreground">Lunar Energy</p>
            </div>

            {/* Season */}
            <div className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">{getSeasonIcon(timingInfo.season)}</span>
                <span className="font-semibold capitalize">{timingInfo.season}</span>
              </div>
              <p className="text-sm text-muted-foreground">Seasonal Energy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Energy Quality */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Current Energy Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <p className="text-lg font-medium mb-2">{timingInfo.energyQuality}</p>
              <p className="text-sm text-muted-foreground">
                This energy is optimal for {timingInfo.optimalPractices.join(', ').toLowerCase()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  Chakra Focus
                </h4>
                <div className="flex flex-wrap gap-2">
                  {timingInfo.chakraFocus.map((chakra, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {chakra.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  Archetype Resonance
                </h4>
                <div className="flex flex-wrap gap-2">
                  {timingInfo.archetypeResonance.map((archetype, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {archetype}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sacred Recommendations */}
      {sacredRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Sacred Recommendations
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Practices aligned with current cosmic timing
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sacredRecommendations.map((step, index) => (
                <div key={step.id} className="p-4 rounded-lg bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>⏱️ {step.estimatedMinutes} min</span>
                        {step.energyFrequency && <span>🎵 {step.energyFrequency}</span>}
                        {step.chakraAlignment && (
                          <span>🔮 {step.chakraAlignment.join(', ')}</span>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timing Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Timing Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Lunar Phase</h4>
              <div className="grid grid-cols-2 gap-2">
                {(['new', 'waxing', 'full', 'waning'] as LunarPhase[]).map((phase) => (
                  <Button
                    key={phase}
                    variant={state.lunarPhase === phase ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleLunarPhaseChange(phase)}
                    disabled={isUpdating}
                    className="justify-start"
                  >
                    <span className="mr-2">{getLunarPhaseIcon(phase)}</span>
                    {phase.charAt(0).toUpperCase() + phase.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Season</h4>
              <div className="grid grid-cols-2 gap-2">
                {(['spring', 'summer', 'autumn', 'winter'] as Season[]).map((season) => (
                  <Button
                    key={season}
                    variant={state.season === season ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSeasonChange(season)}
                    disabled={isUpdating}
                    className="justify-start"
                  >
                    <span className="mr-2">{getSeasonIcon(season)}</span>
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
