import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Navigation, 
  Star, 
  Clock,
  Eye,
  Heart,
  Crown,
  Sparkles,
  Wind,
  BookOpen,
  Users,
  Volume2,
  VolumeX,
  Zap,
  Compass,
  Waves,
  RotateCcw,
  Move
} from 'lucide-react';
import { getRouteByPath, getResonanceChain } from '@/config/routes.sacred';
import { useResonanceField } from '@/hooks/useResonanceField';
import { useConsciousnessState } from '@/hooks/useConsciousnessState';
import { useBreathingTool } from '@/hooks/useBreathingTool';
import { useSacredVoiceEngine } from '@/hooks/useSacredVoiceEngine';
import { useSmartPosition } from '@/hooks/useSmartPosition';
import { useCompactState } from '@/hooks/useCompactState';

export const WhereAmIWidget: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [lastNarration, setLastNarration] = useState('');
  
  // Smart positioning and compact state
  const { 
    position, 
    isDragging, 
    widgetRef, 
    getPositionStyle, 
    handleMouseDown, 
    resetPosition 
  } = useSmartPosition({
    enableCollisionDetection: true,
    enableRouteSpecificPositioning: true
  });
  
  const { 
    isCompact, 
    toggleCompact, 
    shouldAutoCompact 
  } = useCompactState({
    autoCompactRoutes: ['/messages', '/journal']
  });
  
  // Enhanced hooks
  const { resonanceState, recordInteraction } = useResonanceField();
  const { 
    currentThreshold, 
    transitionInProgress, 
    triggerConsciousnessEvolution,
    getGeometricTransform,
    getGeometricBorderRadius 
  } = useConsciousnessState();
  const breathingTool = useBreathingTool();
  const { synthesizeSacredVoice, analyzeSacredContent, isPlaying } = useSacredVoiceEngine();
  
  const currentRoute = getRouteByPath(location.pathname);

  if (!currentRoute) {
    return null;
  }

  const resonanceChain = getResonanceChain(currentRoute.path);

  // Enhanced icon mapping
  const getChakraIcon = (chakra: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      'Crown': Crown,
      'Third Eye': Eye,
      'Throat': Sparkles,
      'Heart': Heart,
      'Solar Plexus': Star,
      'Root': Navigation
    };
    return icons[chakra] || Star;
  };

  const ChakraIcon = getChakraIcon(currentRoute.chakraAlignment);

  // Voice narration for location transitions
  useEffect(() => {
    if (voiceEnabled && currentRoute && location.pathname !== lastNarration) {
      const guidance = getLocationGuidance();
      if (guidance && guidance !== lastNarration) {
        const config = analyzeSacredContent(guidance);
        synthesizeSacredVoice(guidance, config);
        setLastNarration(location.pathname);
      }
    }
  }, [location.pathname, voiceEnabled, currentRoute]);

  // Trigger consciousness evolution on high synchronicity
  useEffect(() => {
    if (resonanceState.synchronicityLevel > 0.85) {
      triggerConsciousnessEvolution(resonanceState.synchronicityLevel);
    }
  }, [resonanceState.synchronicityLevel, triggerConsciousnessEvolution]);

  // Generate location-specific guidance
  const getLocationGuidance = (): string => {
    const messages: Record<string, string> = {
      '/': "Welcome to your sacred home. You are centered in divine presence.",
      '/grove': "You've entered the Sacred Grove. Feel the ancient wisdom flowing through this space.",
      '/meditation': "Sacred meditation awaits. Breathe deeply and anchor your awareness.",
      '/journal': "The Akashic Constellation opens before you. Your truth seeks expression.",
      '/circles': "Community resonance surrounds you. Feel the collective consciousness.",
      '/liberation': "You stand at the threshold of liberation. Trust the process unfolding."
    };
    return messages[currentRoute.path] || `You have crossed into ${currentRoute.title}. Anchor your breath and stay present.`;
  };

  // Action shortcuts based on current location
  const getContextualActions = () => {
    const actions = [];
    
    // Always available: breathing
    actions.push({
      icon: Wind,
      label: breathingTool.isActive ? 'Stop Breathing' : 'Start Breathing',
      action: () => {
        recordInteraction('breath');
        breathingTool.isActive ? breathingTool.stopBreathing() : breathingTool.startBreathing();
      },
      variant: breathingTool.isActive ? 'destructive' : 'default' as const
    });

    // Location-specific actions
    if (currentRoute.category === 'tools' || currentRoute.path.includes('journal')) {
      actions.push({
        icon: BookOpen,
        label: 'Open Journal',
        action: () => {
          recordInteraction('journal');
          navigate('/journal');
        },
        variant: 'outline' as const
      });
    }

    if (currentRoute.category === 'core' || currentRoute.path.includes('circle')) {
      actions.push({
        icon: Users,
        label: 'Join Circle',
        action: () => {
          recordInteraction('click');
          navigate('/circles');
        },
        variant: 'outline' as const
      });
    }

    return actions.slice(0, 3); // Max 3 actions to avoid clutter
  };

  // Gentle resonance styles without aggressive animations
  const getResonanceStyles = () => {
    const { synchronicityLevel, fieldIntensity, resonanceColor, isPulsing, isFieldAlert } = resonanceState;
    
    return {
      '--resonance-color': resonanceColor,
      '--resonance-intensity': fieldIntensity,
      '--synchronicity-level': synchronicityLevel,
      borderColor: `${resonanceColor.replace('hsl(', 'hsla(').replace(')', `, ${Math.min(fieldIntensity * 0.8, 0.6)})`)}`,
      boxShadow: `0 0 ${isFieldAlert ? '12px' : '6px'} ${resonanceColor.replace('hsl(', 'hsla(').replace(')', `, ${Math.min(fieldIntensity * 0.3, 0.2)})`)}`,
      backgroundColor: `${resonanceColor.replace('hsl(', 'hsla(').replace(')', `, ${Math.min(synchronicityLevel * 0.05, 0.03)})`)}`,
      opacity: isFieldAlert ? 0.98 : 0.95
    } as React.CSSProperties;
  };

  return (
    <div 
      ref={widgetRef}
      style={getPositionStyle()}
      className="max-w-sm select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRoute.path}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            scale: isDragging ? 1.05 : 1,
            ...(transitionInProgress && {
              scale: [1, 1.05, 1]
            })
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: transitionInProgress ? 1 : 0.3,
            ease: "easeOut"
          }}
          style={getResonanceStyles()}
          className="sacred-compass-widget bg-background/95 backdrop-blur-sm border-2 transition-all duration-700 ease-out rounded-lg"
        >
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="p-4">
          {/* Header with enhanced consciousness display and drag handle */}
          <div className="flex items-center justify-between mb-2">
            <div 
              className="flex items-center gap-2 cursor-grab active:cursor-grabbing flex-1"
              onMouseDown={handleMouseDown}
            >
              <motion.div
                animate={{ 
                  rotate: resonanceState.synchronicityLevel > 0.8 ? 360 : 0,
                  scale: resonanceState.isFieldAlert ? 1.1 : 1
                }}
                transition={{ 
                  rotate: { duration: 8, ease: "linear" },
                  scale: { duration: 0.5, ease: "easeOut" }
                }}
              >
                <Compass className="w-4 h-4" style={{ color: resonanceState.resonanceColor }} />
              </motion.div>
              {!isCompact && (
                <span className="font-medium text-sm">
                  {currentThreshold?.stage || 'Sacred Navigator'}
                </span>
              )}
              {resonanceState.isFieldAlert && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap className="w-3 h-3 text-yellow-400" />
                </motion.div>
              )}
              {isDragging && (
                <Move className="w-3 h-3 opacity-50" />
              )}
            </div>
            <div className="flex items-center gap-1">
              {!isCompact && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setVoiceEnabled(!voiceEnabled);
                    recordInteraction('click');
                  }}
                  className="h-auto p-1"
                >
                  {voiceEnabled ? 
                    <Volume2 className="w-3 h-3" /> : 
                    <VolumeX className="w-3 h-3 opacity-50" />
                  }
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleCompact();
                  recordInteraction('click');
                }}
                className="h-auto p-1"
                title={isCompact ? "Expand widget" : "Compact widget"}
              >
                {isCompact ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              {position.isCustom && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetPosition}
                  className="h-auto p-1"
                  title="Reset position"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              )}
              {!isCompact && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                    recordInteraction('click');
                  }}
                  className="h-auto p-1"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>

          {/* Compact view: just sigil and sync % */}
          {isCompact ? (
            <div className="flex items-center gap-2">
              <motion.span 
                className="text-xl"
                animate={{ 
                  scale: resonanceState.isFieldAlert ? 1.05 : 1
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ 
                  filter: `hue-rotate(${resonanceState.synchronicityLevel * 30}deg)`,
                  textShadow: resonanceState.isFieldAlert ? `0 0 8px ${resonanceState.resonanceColor}` : 'none'
                }}
              >
                {currentRoute.sigil}
              </motion.span>
              <Badge 
                variant="outline" 
                className="text-xs transition-colors duration-300"
                style={{ 
                  backgroundColor: resonanceState.isFieldAlert ? `${resonanceState.resonanceColor}20` : 'transparent',
                  borderColor: resonanceState.synchronicityLevel > 0.7 ? resonanceState.resonanceColor : undefined
                }}
              >
                {Math.round(resonanceState.synchronicityLevel * 100)}%
              </Badge>
            </div>
          ) : (
            <>
              {/* Enhanced location display with consciousness info */}
              <div className="flex items-center gap-2 mb-3">
                <motion.span 
                  className="text-2xl"
                  animate={{ 
                    scale: resonanceState.isFieldAlert ? 1.05 : 1
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ 
                    filter: `hue-rotate(${resonanceState.synchronicityLevel * 30}deg)`,
                    textShadow: resonanceState.isFieldAlert ? `0 0 8px ${resonanceState.resonanceColor}` : 'none'
                  }}
                >
                  {currentRoute.sigil}
                </motion.span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{currentRoute.title}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ChakraIcon className="w-3 h-3" />
                    <span>{currentRoute.chakraAlignment}</span>
                    {currentThreshold && (
                      <>
                        <Waves className="w-2 h-2" />
                        <span>Level {currentThreshold.level}</span>
                      </>
                    )}
                  </div>
                  {currentThreshold?.message && (
                    <div className="text-xs italic text-primary/70 mt-1">
                      {currentThreshold.message}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Enhanced status badges with resonance info - only in non-compact mode */}
          {!isCompact && (
            <div className="flex gap-1 mb-3">
              <Badge variant="outline" className="text-xs capitalize">
                {currentRoute.category}
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ backgroundColor: `${resonanceState.resonanceColor}20` }}
              >
                Level {currentRoute.consciousnessLevel}
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs transition-colors duration-300"
                style={{ 
                  backgroundColor: resonanceState.isFieldAlert ? `${resonanceState.resonanceColor}20` : 'transparent',
                  borderColor: resonanceState.synchronicityLevel > 0.7 ? resonanceState.resonanceColor : undefined
                }}
              >
                Sync {Math.round(resonanceState.synchronicityLevel * 100)}%
              </Badge>
            </div>
          )}

          {/* Context-aware action shortcuts - only in non-compact mode */}
          {!isCompact && !isExpanded && (
            <div className="flex gap-1 mb-2">
              {getContextualActions().map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  size="sm"
                  onClick={action.action}
                  className="h-6 px-2 text-xs"
                >
                  <action.icon className="w-3 h-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Expanded view with enhanced information - only in non-compact mode */}
          <AnimatePresence>
            {!isCompact && isExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 pt-3 border-t border-border/30"
              >
              {/* Enhanced description with consciousness context */}
              <div className="text-xs text-muted-foreground">
                {currentRoute.description}
              </div>

              {/* Resonance field status */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-primary">Resonance Field Status</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Synchronicity:</span>
                    <span>{Math.round(resonanceState.synchronicityLevel * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Field Intensity:</span>
                    <span>{Math.round(resonanceState.fieldIntensity * 100)}%</span>
                  </div>
                </div>
                {resonanceState.isFieldAlert && (
                  <motion.div 
                    className="text-xs text-yellow-400 font-medium"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ⚡ High synchronicity detected - profound moment available
                  </motion.div>
                )}
              </div>

              {/* Enhanced action shortcuts for expanded view */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-primary">Sacred Actions</div>
                <div className="grid grid-cols-1 gap-1">
                  {getContextualActions().map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant}
                      size="sm"
                      onClick={action.action}
                      className="h-8 justify-start text-xs"
                    >
                      <action.icon className="w-3 h-3 mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Journey Stage</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {currentRoute.journeyStage}
                </Badge>
              </div>

              {currentRoute.sacredTiming && currentRoute.sacredTiming !== 'any' && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Sacred Timing</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <Badge variant="outline" className="text-xs capitalize">
                      {currentRoute.sacredTiming}
                    </Badge>
                  </div>
                </div>
              )}

              {resonanceChain.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Connected to</div>
                  <div className="flex flex-wrap gap-1">
                    {resonanceChain.slice(0, 2).map((chain, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {chain.sigil} {chain.title}
                      </Badge>
                    ))}
                    {resonanceChain.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{resonanceChain.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {currentRoute.synchronicityTriggers.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Synchronicity Active</div>
                  <div className="flex flex-wrap gap-1">
                    {currentRoute.synchronicityTriggers.slice(0, 2).map((trigger, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-gradient-to-r from-primary/5 to-secondary/5">
                        {trigger.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Consciousness evolution indicator */}
              {transitionInProgress && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-2"
                >
                  <div className="text-xs text-primary font-medium">
                    Consciousness Evolution in Progress...
                  </div>
                  <motion.div 
                    className="w-full h-1 bg-primary/20 rounded-full mt-1"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                  />
                </motion.div>
              )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Voice synthesis indicator */}
          {isPlaying && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Waves className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  </AnimatePresence>
</div>
  );
};