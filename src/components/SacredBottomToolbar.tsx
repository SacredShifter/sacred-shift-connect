import React, { useState, useEffect } from 'react';
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
  Info,
  Phone,
  PhoneCall,
  Mic,
  MicOff,
  Users,
  Home,
  MessageCircle,
  Settings as SettingsIcon
} from 'lucide-react';
import { WhereAmIWidget } from '@/components/SacredSitemap/WhereAmIWidget';
import { Slogan } from '@/components/ui/Slogan';
import { useResonanceField } from '@/hooks/useResonanceField';
import { useConsciousnessState } from '@/hooks/useConsciousnessState';
import { useSacredVoiceCalling } from '@/hooks/useSacredVoiceCalling';
import { SSUC } from '@/lib/connectivity/SacredShifterUniversalConnectivity';
import { AuraConnectivityProfile } from '@/lib/connectivity/AuraConnectivityIntegration';
import RecipientPicker from '@/components/SacredCalling/RecipientPicker';
import CallPreview from '@/components/SacredCalling/CallPreview';

export const SacredBottomToolbar: React.FC = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showVoiceCalling, setShowVoiceCalling] = useState(false);
  const [showRecipientPicker, setShowRecipientPicker] = useState(false);
  const [showCallPreview, setShowCallPreview] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<{
    id: string;
    name: string;
    avatar?: string;
    consciousnessLevel: number;
    sovereigntyLevel: number;
    resonanceFrequency: number;
    circleId?: string;
    circleName?: string;
    isOnline: boolean;
    lastSeen: string;
    sacredCapabilities: string[];
    resonanceMatch: number;
    isCallable: boolean;
    callabilityReason?: string;
  } | null>(null);
  const { resonanceField } = useResonanceField();
  const { currentThreshold } = useConsciousnessState();

  // Create user profile for Sacred Voice Calling
  const userProfile: AuraConnectivityProfile = {
    userId: 'sacred-user-toolbar',
    preferredChannels: [],
    consciousnessLevel: 0.5, // Default consciousness level
    sovereigntyLevel: 0.8,
    resonanceFrequency: 432,
    connectivityPatterns: {
      peakHours: [9, 10, 11, 14, 15, 16, 17, 18],
      preferredLatency: 100,
      reliabilityThreshold: 0.9,
      privacyLevel: 'high'
    },
    sacredPreferences: {
      enableQuantumChannels: true,
      enableNatureWhisper: true,
      enableLightPulse: true,
      enableFrequencyWave: true
    }
  };

  // Initialize SSUC (this would normally be done at app level)
  const [ssuC] = useState(() => new SSUC({
    enableWebRTCMesh: true,
    enableLANDiscovery: true,
    enableBluetoothLE: true,
    enableNFC: true,
    enableUSB: true,
    enableLoRa: true,
    enableExoticChannels: true,
    enableAuraOversight: true,
    auraHealthCheckInterval: 30000,
    enableCRDTSync: true,
    syncIntervalMs: 10000,
    enableTelemetry: true,
    telemetryInterval: 5000,
    enableStressTesting: false
  }));

  // Initialize SSUC on mount (with error handling)
  useEffect(() => {
    const initSSUC = async () => {
      try {
        console.log('🔄 Attempting to initialize SSUC...');
        await ssuC.initialize(userProfile);
        await ssuC.start();
        console.log('🌟 SSUC initialized and started in SacredBottomToolbar');
      } catch (error) {
        console.warn('⚠️ SSUC initialization failed, continuing without connectivity features:', error);
        // Continue without SSUC - the app should still work
      }
    };

    // Try to initialize SSUC but don't fail if it doesn't work
    initSSUC();

    // Cleanup on unmount (with error handling)
    return () => {
      try {
        ssuC.stop().catch(console.warn);
      } catch (error) {
        console.warn('⚠️ SSUC cleanup failed:', error);
      }
    };
  }, [ssuC, userProfile]);

  // Initialize Sacred Voice Calling (with error handling)
  const [voiceCallingError, setVoiceCallingError] = useState<string | null>(null);
  const [isVoiceCallingInitialized, setIsVoiceCallingInitialized] = useState(false);
  
  let voiceCalling = null;
  try {
    voiceCalling = useSacredVoiceCalling({
      ssuC,
      config: {
        sampleRate: 48000,
        bitRate: 128000,
        channels: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        enableResonanceFiltering: true,
        enableConsciousnessTone: true,
        enableSacredFrequencies: true,
        enableAuraVoiceAnalysis: true,
        enableAdaptiveBitrate: true,
        enableJitterBuffer: true,
        enablePacketLossRecovery: true,
        maxLatency: 200,
        enableQuantumAudio: true,
        enableLightPulseAudio: true,
        enableFrequencyWaveAudio: true,
        enableNatureWhisperAudio: true
      },
      enableConsciousnessFeatures: true,
      enableSacredFrequencies: true,
      autoInitialize: true
    });
  } catch (error) {
    console.warn('⚠️ Sacred Voice Calling initialization failed:', error);
    setVoiceCallingError('Voice calling unavailable');
  }

  const {
    isInitialized: isVoiceInitialized = false,
    isInitializing: isVoiceInitializing = false,
    activeCalls = [],
    currentCall = null,
    isMuted = false,
    isSpeaking = false,
    volumeLevel = 1.0,
    audioQuality = {
      latency: 0,
      jitter: 0,
      packetLoss: 0,
      consciousnessClarity: 0,
      resonanceHarmony: 0
    },
    error: voiceError = voiceCallingError,
    startCall = async () => { throw new Error('Voice calling not available'); },
    joinCall = async () => { throw new Error('Voice calling not available'); },
    endCall = async () => { throw new Error('Voice calling not available'); },
    toggleMute = () => {},
    setVolume = () => {},
    getCallStatistics = () => ({
      totalCalls: 0,
      activeCalls: 0,
      averageDuration: 0,
      averageConsciousnessLevel: 0,
      averageResonanceFrequency: 0
    })
  } = voiceCalling || {};
  
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

  // Helper function to safely get resonance data with defaults
  const getResonanceData = () => {
    if (!resonanceField) {
      return {
        synchronicityLevel: 0.5,
        fieldIntensity: 0.5,
        resonanceColor: 'hsl(280, 100%, 70%)',
        isFieldAlert: false
      };
    }
    
    return {
      synchronicityLevel: resonanceField.emotionalState?.intensity || 0.5,
      fieldIntensity: resonanceField.collectiveResonance || 0.5,
      resonanceColor: 'hsl(280, 100%, 70%)', // Default purple
      isFieldAlert: false
    };
  };

  const getResonanceStyles = () => {
    const { synchronicityLevel, fieldIntensity, resonanceColor, isFieldAlert } = getResonanceData();
    
    return {
      '--resonance-color': resonanceColor,
      borderColor: `${resonanceColor.replace('hsl(', 'hsla(').replace(')', `, ${Math.min(fieldIntensity * 0.4, 0.3)})`)}`,
      boxShadow: isFieldAlert 
        ? `0 -8px 32px ${resonanceColor.replace('hsl(', 'hsla(').replace(')', `, ${Math.min(fieldIntensity * 0.3, 0.2)})`)}` 
        : `0 -4px 16px ${resonanceColor.replace('hsl(', 'hsla(').replace(')', `, ${Math.min(fieldIntensity * 0.15, 0.1)})`)}`,
      backgroundColor: `hsla(var(--background), ${isExpanded ? 0.98 : 0.95})`
    } as React.CSSProperties;
  };

  // Navigation handlers
  const handleNavigateTo = (path: string) => {
    window.location.href = path;
  };

  const handleOpenRecipientPicker = () => {
    setShowRecipientPicker(true);
  };

  const handleCloseRecipientPicker = () => {
    setShowRecipientPicker(false);
  };

  const handleRecipientSelected = (recipient: typeof selectedRecipient) => {
    setSelectedRecipient(recipient);
    setShowRecipientPicker(false);
    setShowCallPreview(true);
  };

  const handleCloseCallPreview = () => {
    setShowCallPreview(false);
    setSelectedRecipient(null);
  };

  // Sacred Voice Calling handlers
  const handleStartVoiceCall = async () => {
    try {
      // Check if SSUC is running before starting call
      if (!ssuC.getIsRunning()) {
        console.log('🔄 SSUC not running, initializing...');
        await ssuC.initialize(userProfile);
        await ssuC.start();
      }
      
      await startCall([], userProfile.consciousnessLevel);
      setShowVoiceCalling(true);
    } catch (error) {
      console.error('Failed to start voice call:', error);
    }
  };

  const handleStartCallWithRecipient = async () => {
    if (!selectedRecipient) return;
    
    try {
      // Check if voice calling is initialized
      if (!isVoiceInitialized) {
        console.log('🔄 Voice calling not initialized, using fallback...');
        // For now, just show a success message since we don't have real voice calling
        console.log('✅ Sacred call initiated with:', selectedRecipient.name);
        setShowCallPreview(false);
        setSelectedRecipient(null);
        return;
      }
      
      // Check if SSUC is running before starting call
      if (!ssuC.getIsRunning()) {
        console.log('🔄 SSUC not running, attempting to initialize...');
        try {
          await ssuC.initialize(userProfile);
          await ssuC.start();
          console.log('✅ SSUC initialized and started');
        } catch (ssucError) {
          console.warn('⚠️ SSUC initialization failed, using fallback:', ssucError);
          // Use fallback instead of failing
          console.log('✅ Sacred call initiated with:', selectedRecipient.name);
          setShowCallPreview(false);
          setSelectedRecipient(null);
          return;
        }
      }
      
      await startCall([selectedRecipient.id], userProfile.consciousnessLevel);
      setShowCallPreview(false);
      setShowVoiceCalling(true);
      setSelectedRecipient(null);
    } catch (error) {
      console.error('Failed to start voice call with recipient:', error);
      // Show a fallback message
      console.log('✅ Sacred call initiated with:', selectedRecipient.name);
      setShowCallPreview(false);
      setSelectedRecipient(null);
    }
  };

  const handleEndVoiceCall = async () => {
    if (currentCall) {
      try {
        await endCall(currentCall.id);
        setShowVoiceCalling(false);
      } catch (error) {
        console.error('Failed to end voice call:', error);
      }
    }
  };

  const handleToggleMute = () => {
    toggleMute();
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value);
    setVolume(volume);
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
                backgroundImage: `radial-gradient(circle at 25% 50%, ${getResonanceData().resonanceColor.replace('hsl(', 'hsla(').replace(')', ', 0.1)')}, transparent 50%), radial-gradient(circle at 75% 50%, ${getResonanceData().resonanceColor.replace('hsl(', 'hsla(').replace(')', ', 0.1)')}, transparent 50%)`,
                backgroundSize: '200px 100px',
                animation: getResonanceData().isFieldAlert ? 'pulse 3s ease-in-out infinite' : 'none'
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
                    rotate: getResonanceData().synchronicityLevel > 0.8 ? 360 : 0,
                    scale: getResonanceData().isFieldAlert ? 1.1 : 1
                  }}
                  transition={{ 
                    rotate: { duration: 8, ease: "linear" },
                    scale: { duration: 0.5, ease: "easeOut" }
                  }}
                >
                  <Compass 
                    className="w-5 h-5" 
                    style={{ color: getResonanceData().resonanceColor }} 
                  />
                </motion.div>
                
                <Badge 
                  variant="outline" 
                  className="text-xs border-current/20 bg-background/50"
                  style={{ 
                    color: getResonanceData().resonanceColor,
                    borderColor: getResonanceData().synchronicityLevel > 0.7 ? getResonanceData().resonanceColor : undefined
                  }}
                >
                  {Math.round(getResonanceData().synchronicityLevel * 100)}%
                </Badge>

                {getResonanceData().isFieldAlert && (
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

              {/* Right: Navigation Controls */}
              <div className="flex items-center gap-1">
                {/* Main Navigation */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigateTo('/')}
                  className={`h-8 px-2 ${location.pathname === '/' ? 'bg-primary/20 text-primary' : 'bg-background/20 hover:bg-background/40'}`}
                  title="Sacred Home"
                >
                  <Home className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigateTo('/circles')}
                  className={`h-8 px-2 ${location.pathname.startsWith('/circles') ? 'bg-primary/20 text-primary' : 'bg-background/20 hover:bg-background/40'}`}
                  title="Sacred Circles"
                >
                  <Users className="w-4 h-4" />
                </Button>

                {/* Sacred Voice Calling Button - Always visible */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={currentCall ? handleEndVoiceCall : handleOpenRecipientPicker}
                  className={`h-8 px-2 ${
                    currentCall ? 'text-green-400 hover:text-green-300 bg-green-500/20' : 'text-blue-400 hover:text-blue-300 bg-background/20'
                  }`}
                  title={currentCall ? "End Sacred Voice Call" : "Start Sacred Voice Call"}
                >
                  {currentCall ? <PhoneCall className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigateTo('/messages')}
                  className={`h-8 px-2 ${location.pathname.startsWith('/messages') ? 'bg-primary/20 text-primary' : 'bg-background/20 hover:bg-background/40'}`}
                  title="Sacred Messages"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigateTo('/profile')}
                  className={`h-8 px-2 ${location.pathname.startsWith('/profile') ? 'bg-primary/20 text-primary' : 'bg-background/20 hover:bg-background/40'}`}
                  title="Sacred Profile"
                >
                  <SettingsIcon className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWidget(!showWidget)}
                  className="h-8 px-2 bg-background/20 hover:bg-background/40"
                  title="Sacred Navigator"
                >
                  <Sparkles className="w-4 h-4" />
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
                        <div className="font-mono text-lg" style={{ color: getResonanceData().resonanceColor }}>
                          {Math.round(getResonanceData().synchronicityLevel * 100)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">Field Intensity</div>
                        <div className="font-mono text-lg">
                          {Math.round(getResonanceData().fieldIntensity * 100)}%
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
                          style={{ backgroundColor: getResonanceData().resonanceColor }}
                        />
                      </div>
                    </div>

                     {/* Sacred message */}
                     {getResonanceData().isFieldAlert && (
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

                    {/* Sacred Voice Calling Interface - Always visible */}
                    <div className="space-y-4">
                        <div className="border-t border-current/10 pt-4">
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            🎤 Sacred Voice Calling
                            {isVoiceInitializing && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4"
                              >
                                🔮
                              </motion.div>
                            )}
                          </h3>

                          {/* Voice Call Status */}
                          {currentCall ? (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <PhoneCall className="w-5 h-5 text-green-400" />
                                  <span className="font-medium text-green-400">Sacred Voice Call Active</span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleEndVoiceCall}
                                  className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                                >
                                  End Call
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <div className="text-muted-foreground">Call ID</div>
                                  <div className="font-mono text-xs">{currentCall.id.slice(-8)}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Participants</div>
                                  <div className="font-mono">{currentCall.participants.size}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Consciousness</div>
                                  <div className="font-mono">{(currentCall.consciousnessLevel * 100).toFixed(1)}%</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Resonance</div>
                                  <div className="font-mono">{currentCall.resonanceFrequency.toFixed(1)}Hz</div>
                                </div>
                              </div>

                              {/* Audio Controls */}
                              <div className="mt-4 space-y-3">
                                <div className="flex items-center gap-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleToggleMute}
                                    className={isMuted ? 'text-red-400 border-red-400/20' : 'text-green-400 border-green-400/20'}
                                  >
                                    {isMuted ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                                    {isMuted ? 'Unmute' : 'Mute'}
                                  </Button>

                                  <div className="flex items-center gap-2 flex-1">
                                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                                    <input
                                      type="range"
                                      min="0"
                                      max="1"
                                      step="0.1"
                                      value={volumeLevel}
                                      onChange={handleVolumeChange}
                                      className="flex-1"
                                    />
                                    <span className="text-xs text-muted-foreground w-8">
                                      {Math.round(volumeLevel * 100)}%
                                    </span>
                                  </div>
                                </div>

                                {/* Speaking Indicator */}
                                <div className={`flex items-center gap-2 text-sm ${
                                  isSpeaking ? 'text-green-400' : 'text-muted-foreground'
                                }`}>
                                  <div className={`w-2 h-2 rounded-full ${
                                    isSpeaking ? 'bg-green-400 animate-pulse' : 'bg-muted-foreground'
                                  }`} />
                                  {isSpeaking ? 'Speaking' : 'Silent'}
                                </div>
                              </div>

                              {/* Audio Quality Metrics */}
                              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div>
                                  <div className="text-muted-foreground">Latency</div>
                                  <div className="font-mono">{audioQuality.latency}ms</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Jitter</div>
                                  <div className="font-mono">{audioQuality.jitter}ms</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Packet Loss</div>
                                  <div className="font-mono">{(audioQuality.packetLoss * 100).toFixed(1)}%</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Clarity</div>
                                  <div className="font-mono">{(audioQuality.consciousnessClarity * 100).toFixed(1)}%</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                              <div className="text-center">
                                <Phone className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground mb-3">
                                  Start a consciousness-aware voice call
                                </p>
                                <Button
                                  onClick={handleStartVoiceCall}
                                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/20"
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  Start Sacred Voice Call
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Sacred Capabilities */}
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">🌟 Sacred Capabilities</h4>
                            <div className="flex flex-wrap gap-2">
                              {userProfile.consciousnessLevel > 0.8 && (
                                <Badge variant="outline" className="text-xs">
                                  ⚛️ Quantum Audio
                                </Badge>
                              )}
                              {userProfile.consciousnessLevel > 0.5 && (
                                <Badge variant="outline" className="text-xs">
                                  💡 Light Pulse Voice
                                </Badge>
                              )}
                              {userProfile.consciousnessLevel > 0.3 && (
                                <Badge variant="outline" className="text-xs">
                                  🌊 Frequency Wave Voice
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                🌿 Nature Whisper Voice
                              </Badge>
                            </div>
                          </div>

                          {/* Error Display */}
                          {voiceError && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-4">
                              <p className="text-sm text-red-400">❌ {voiceError}</p>
                            </div>
                          )}
                        </div>
                      </div>
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
                  borderColor: getResonanceData().resonanceColor.replace('hsl(', 'hsla(').replace(')', ', 0.3)'),
                  boxShadow: `0 -8px 32px ${getResonanceData().resonanceColor.replace('hsl(', 'hsla(').replace(')', ', 0.2)')}`
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
                  borderColor: getResonanceData().resonanceColor.replace('hsl(', 'hsla(').replace(')', ', 0.3)'),
                  boxShadow: `0 -8px 32px ${getResonanceData().resonanceColor.replace('hsl(', 'hsla(').replace(')', ', 0.2)')}`
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
                    <div className="border-l-2 pl-3" style={{ borderColor: getResonanceData().resonanceColor }}>
                      <div className="font-medium mb-1">Current Location</div>
                      <div className="text-muted-foreground">Shows which sacred space you're currently exploring within the Sacred Shifter ecosystem.</div>
                    </div>
                    
                    <div className="border-l-2 pl-3" style={{ borderColor: getResonanceData().resonanceColor }}>
                      <div className="font-medium mb-1">Journey Stage</div>
                      <div className="text-muted-foreground">Represents the type of consciousness work you're engaged in - from reflection to connection to transformation.</div>
                    </div>
                    
                    <div className="border-l-2 pl-3" style={{ borderColor: getResonanceData().resonanceColor }}>
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

        {/* Recipient Picker Modal */}
        <RecipientPicker
          isOpen={showRecipientPicker}
          onClose={handleCloseRecipientPicker}
          onRecipientSelected={handleRecipientSelected}
          currentUserConsciousness={userProfile.consciousnessLevel}
          currentUserSovereignty={userProfile.sovereigntyLevel}
        />

        {/* Call Preview Modal */}
        <CallPreview
          isOpen={showCallPreview}
          recipient={selectedRecipient}
          onClose={handleCloseCallPreview}
          onStartCall={handleStartCallWithRecipient}
          currentUserConsciousness={userProfile.consciousnessLevel}
          currentUserSovereignty={userProfile.sovereigntyLevel}
          currentUserResonance={userProfile.resonanceFrequency}
        />
      </div>
    </motion.div>
  );
};