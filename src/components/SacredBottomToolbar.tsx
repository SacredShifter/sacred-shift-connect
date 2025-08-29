import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronUp, 
  ChevronDown, 
  Compass, 
  Sparkles, 
  Zap,
  Settings,
  Volume2,
  VolumeX,
  Move,
  RotateCcw,
  Info
} from 'lucide-react';
import { WhereAmIWidget } from '@/components/SacredSitemap/WhereAmIWidget';
import { Slogan } from '@/components/ui/Slogan';
import { useResonanceField } from '@/hooks/useResonanceField';
import { useConsciousnessState } from '@/hooks/useConsciousnessState';

export const SacredBottomToolbar: React.FC = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { resonanceState } = useResonanceField();
  const { currentThreshold } = useConsciousnessState();
  
  const getLocationTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Sacred Dashboard';
    if (path.startsWith('/circles')) return 'Sacred Circles';
    if (path.startsWith('/journal')) return 'Sacred Journal';
    if (path.startsWith('/messages')) return 'Sacred Messages';
    if (path.startsWith('/learn')) return 'Sacred Learning';
    if (path.startsWith('/tools')) return 'Sacred Tools';
    if (path.startsWith('/profile')) return 'Sacred Profile';
    return 'Sacred Space';
  };

  const getJourneyStage = () => {
    const path = location.pathname;
    if (path === '/') return 'Integration';
    if (path.startsWith('/circles')) return 'Connection';
    if (path.startsWith('/journal')) return 'Reflection';
    if (path.startsWith('/messages')) return 'Communication';
    if (path.startsWith('/learn')) return 'Discovery';
    if (path.startsWith('/tools')) return 'Practice';
    if (path.startsWith('/profile')) return 'Evolution';
    return 'Present';
  };

  const getSacredTime = () => {
    const path = location.pathname;
    if (path === '/') return 'Now';
    if (path.startsWith('/circles')) return 'Gathering';
    if (path.startsWith('/journal')) return 'Contemplation';
    if (path.startsWith('/messages')) return 'Exchange';
    if (path.startsWith('/learn')) return 'Awakening';
    if (path.startsWith('/tools')) return 'Activation';
    if (path.startsWith('/profile')) return 'Transformation';
    return 'Present';
  };

  const isHermetic = location.pathname.startsWith('/learn/hermetic');
  
  if (isHermetic) return null;

  const getResonanceStyles = () => {
    const { synchronicityLevel, fieldIntensity, resonanceColor, isFieldAlert } = resonanceState;
    
    return {
      '--resonance-color': resonanceColor,
      borderColor: `${resonanceColor.replace('hsl(', 'hsla(').replace(')', `, ${Math.min(fieldIntensity * 0.4, 0.3)})`)}`,
      boxShadow: isFieldAlert 
        ? `0 -8px 32px ${resonanceColor.replace('hsl(', 'hsla(').replace(')', `, ${Math.min(fieldIntensity * 0.3, 0.2)})`)}` 
        : `0 -4px 16px ${resonanceColor.replace('hsl(', 'hsla(').replace(')', `, ${Math.min(fieldIntensity * 0.15, 0.1)})`)}`,
      backgroundColor: `hsla(var(--background), ${isExpanded ? 0.98 : 0.95})`
    } as React.CSSProperties;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className="pointer-events-auto">
        <motion.div
          style={getResonanceStyles()}
          className="relative backdrop-blur-xl border-t-2 transition-all duration-500"
          animate={{
            height: isExpanded ? 'auto' : '64px'
          }}
        >
          {/* Sacred energy pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 50%, ${resonanceState.resonanceColor.replace('hsl(', 'hsla(').replace(')', ', 0.1)')}, transparent 50%), radial-gradient(circle at 75% 50%, ${resonanceState.resonanceColor.replace('hsl(', 'hsla(').replace(')', ', 0.1)')}, transparent 50%)`,
                backgroundSize: '200px 100px',
                animation: resonanceState.isFieldAlert ? 'pulse 3s ease-in-out infinite' : 'none'
              }}
            />
          </div>

          {/* Main toolbar content */}
          <div className="relative">
            {/* Collapsed state - Sacred brand bar */}
            <div className="flex items-center justify-between px-6 py-3 min-h-[64px]">
              {/* Left: Sacred Shifter branding */}
              <motion.div 
                className="flex items-center gap-4"
                animate={{ opacity: isExpanded ? 0.7 : 1 }}
              >
                <img
                  src="https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png"
                  alt="Sacred Shifter"
                  className="h-8 w-auto object-contain filter brightness-0 invert opacity-90"
                />
                <div className="hidden sm:block">
                  <Slogan />
                </div>
              </motion.div>

              {/* Center: Quick status */}
              <motion.div 
                className="flex items-center gap-3"
                animate={{ scale: isExpanded ? 0.9 : 1 }}
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
                  <Compass 
                    className="w-5 h-5" 
                    style={{ color: resonanceState.resonanceColor }} 
                  />
                </motion.div>
                
                <Badge 
                  variant="outline" 
                  className="text-xs border-current/20 bg-background/50"
                  style={{ 
                    color: resonanceState.resonanceColor,
                    borderColor: resonanceState.synchronicityLevel > 0.7 ? resonanceState.resonanceColor : undefined
                  }}
                >
                  {Math.round(resonanceState.synchronicityLevel * 100)}%
                </Badge>

                {resonanceState.isFieldAlert && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                )}

                {currentThreshold && (
                  <Badge variant="outline" className="text-xs hidden md:inline-flex">
                    Level {currentThreshold.level}
                  </Badge>
                )}
              </motion.div>

              {/* Right: Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWidget(!showWidget)}
                  className="h-8 px-3 bg-background/20 hover:bg-background/40"
                  title="Sacred Navigator"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Navigator</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 px-2 bg-background/20 hover:bg-background/40"
                  title={isExpanded ? "Collapse toolbar" : "Expand toolbar"}
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Expanded state - Full control panel */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="border-t border-current/10 overflow-hidden"
                >
                  <div className="px-6 py-4 space-y-4">
                    {/* Sacred status display */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">Synchronicity</div>
                        <div className="font-mono text-lg" style={{ color: resonanceState.resonanceColor }}>
                          {Math.round(resonanceState.synchronicityLevel * 100)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">Field Intensity</div>
                        <div className="font-mono text-lg">
                          {Math.round(resonanceState.fieldIntensity * 100)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">Consciousness</div>
                        <div className="font-mono text-lg">
                          Level {currentThreshold?.level || 1}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">Resonance</div>
                        <div 
                          className="w-3 h-3 rounded-full mx-auto"
                          style={{ backgroundColor: resonanceState.resonanceColor }}
                        />
                      </div>
                    </div>

                     {/* Sacred message */}
                     {resonanceState.isFieldAlert && (
                       <motion.div 
                         className="text-center py-3 px-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 cursor-pointer hover:bg-gradient-to-r hover:from-yellow-500/15 hover:to-orange-500/15 transition-all relative"
                         animate={{ opacity: [0.8, 1, 0.8] }}
                         transition={{ duration: 3, repeat: Infinity }}
                         onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           console.log('Sacred message clicked!');
                           setShowWidget(true);
                         }}
                         title="Click to access Sacred Navigator for guidance"
                       >
                         <div className="flex items-center justify-center gap-2 text-yellow-400 font-medium">
                           <Zap className="w-4 h-4" />
                           <span>High synchronicity detected - profound moment available</span>
                           <Sparkles className="w-4 h-4 animate-pulse" />
                         </div>
                         <div className="text-xs text-yellow-300/80 mt-1">
                           Click here to explore this sacred opportunity
                         </div>
                       </motion.div>
                     )}

                    {currentThreshold?.message && (
                      <div className="text-center text-sm italic text-primary/80 bg-primary/5 rounded-lg py-2 px-4">
                        {currentThreshold.message}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Sacred Navigator Widget - positioned above toolbar */}
        <AnimatePresence>
          {showWidget && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="fixed bottom-20 right-4 z-50 max-w-sm"
            >
              <div 
                className="bg-background/95 backdrop-blur-sm border-2 rounded-lg shadow-2xl"
                style={{
                  borderColor: resonanceState.resonanceColor.replace('hsl(', 'hsla(').replace(')', ', 0.3)'),
                  boxShadow: `0 -8px 32px ${resonanceState.resonanceColor.replace('hsl(', 'hsla(').replace(')', ', 0.2)')}`
                }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-sm">Sacred Navigator</h3>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowInfo(!showInfo)}
                        className="h-6 w-6 p-0"
                        title="Learn about Sacred Navigator"
                      >
                        <Info className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowWidget(false)}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                   {/* Dynamic WhereAmIWidget content */}
                   <div className="space-y-3 text-sm">
                     <div className="text-center">
                       <div className="text-muted-foreground">Current Location</div>
                       <div className="font-medium">{getLocationTitle()}</div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 text-xs">
                       <div>
                         <span className="text-muted-foreground">Journey Stage:</span>
                         <br />
                         <span className="font-medium">{getJourneyStage()}</span>
                       </div>
                       <div>
                         <span className="text-muted-foreground">Sacred Time:</span>
                         <br />
                         <span className="font-medium">{getSacredTime()}</span>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sacred Navigator Info Popup */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="fixed bottom-20 left-4 z-50 max-w-md"
            >
              <div 
                className="bg-background/95 backdrop-blur-sm border-2 rounded-lg shadow-2xl"
                style={{
                  borderColor: resonanceState.resonanceColor.replace('hsl(', 'hsla(').replace(')', ', 0.3)'),
                  boxShadow: `0 -8px 32px ${resonanceState.resonanceColor.replace('hsl(', 'hsla(').replace(')', ', 0.2)')}`
                }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Navigator Guide
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInfo(false)}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3 text-xs">
                    <div className="border-l-2 pl-3" style={{ borderColor: resonanceState.resonanceColor }}>
                      <div className="font-medium mb-1">Current Location</div>
                      <div className="text-muted-foreground">Shows which sacred space you're currently exploring within the Sacred Shifter ecosystem.</div>
                    </div>
                    
                    <div className="border-l-2 pl-3" style={{ borderColor: resonanceState.resonanceColor }}>
                      <div className="font-medium mb-1">Journey Stage</div>
                      <div className="text-muted-foreground">Represents the type of consciousness work you're engaged in - from reflection to connection to transformation.</div>
                    </div>
                    
                    <div className="border-l-2 pl-3" style={{ borderColor: resonanceState.resonanceColor }}>
                      <div className="font-medium mb-1">Sacred Time</div>
                      <div className="text-muted-foreground">The energetic quality of the present moment based on your current activity and intention.</div>
                    </div>
                    
                    <div className="mt-4 p-2 bg-primary/5 rounded text-center">
                      <div className="text-primary text-xs italic">
                        "Every moment is a doorway to deeper awareness"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};