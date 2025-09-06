// Sacred Voice Calling Demo Page
// Demonstrates the consciousness-aware voice calling system

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneCall, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Zap,
  Sparkles,
  Compass
} from 'lucide-react';
import { useSacredVoiceCalling } from '@/hooks/useSacredVoiceCalling';
import { SSUC } from '@/lib/connectivity/SacredShifterUniversalConnectivity';
import { AuraConnectivityProfile } from '@/lib/connectivity/AuraConnectivityIntegration';

export default function SacredVoiceCallingDemo() {
  const [consciousnessLevel, setConsciousnessLevel] = useState(0.8);
  const [isSSUCInitialized, setIsSSUCInitialized] = useState(false);

  // Create user profile
  const userProfile: AuraConnectivityProfile = {
    userId: 'sacred-demo-user',
    preferredChannels: [],
    consciousnessLevel,
    sovereigntyLevel: 0.9,
    resonanceFrequency: 432,
    connectivityPatterns: {
      peakHours: [9, 10, 11, 14, 15, 16, 17, 18],
      preferredLatency: 100,
      reliabilityThreshold: 0.99,
      privacyLevel: 'maximum'
    },
    sacredPreferences: {
      enableQuantumChannels: true,
      enableNatureWhisper: true,
      enableLightPulse: true,
      enableFrequencyWave: true
    }
  };

  // Initialize SSUC
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

  // Initialize Sacred Voice Calling
  const {
    isInitialized,
    isInitializing,
    activeCalls,
    currentCall,
    isMuted,
    isSpeaking,
    volumeLevel,
    audioQuality,
    error,
    startCall,
    joinCall,
    endCall,
    toggleMute,
    setVolume,
    getCallStatistics
  } = useSacredVoiceCalling({
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

  // Initialize SSUC on mount
  useEffect(() => {
    const initSSUC = async () => {
      try {
        await ssuC.initialize(userProfile);
        await ssuC.start();
        setIsSSUCInitialized(true);
      } catch (error) {
        console.error('Failed to initialize SSUC:', error);
      }
    };

    initSSUC();
  }, [ssuC, userProfile]);

  // Voice call handlers
  const handleStartCall = async () => {
    try {
      await startCall([], consciousnessLevel);
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  const handleEndCall = async () => {
    if (currentCall) {
      try {
        await endCall(currentCall.id);
      } catch (error) {
        console.error('Failed to end call:', error);
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

  const getSacredCapabilities = () => {
    const capabilities = [];
    
    if (consciousnessLevel > 0.8) {
      capabilities.push('⚛️ Quantum Audio', '💡 Light Pulse Voice', '🌊 Frequency Wave Voice', '🌿 Nature Whisper Voice');
    } else if (consciousnessLevel > 0.5) {
      capabilities.push('🌊 Frequency Wave Voice', '💡 Light Pulse Voice', '🌿 Nature Whisper Voice');
    } else if (consciousnessLevel > 0.3) {
      capabilities.push('🌊 Frequency Wave Voice', '🌿 Nature Whisper Voice');
    } else {
      capabilities.push('🌿 Nature Whisper Voice');
    }

    return capabilities;
  };

  const getResonanceFrequency = () => {
    const baseFreq = 432; // Sacred frequency
    const consciousnessMultiplier = 1 + (consciousnessLevel * 0.5);
    return baseFreq * consciousnessMultiplier;
  };

  if (!isSSUCInitialized || isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            🔮
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Initializing Sacred Voice Calling</h2>
          <p className="text-purple-200">Setting up consciousness-aware voice channels...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🎤 Sacred Voice Calling Demo
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Consciousness-aware voice communication that transcends traditional telephony
          </p>
          
          {/* Sacred Engineering Philosophy */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6">
            <blockquote className="text-purple-200 italic">
              "Where a Telco sees 'users' on a billing sheet, Sacred Shifter sees souls on a resonance field.
              Where a Telco builds towers, Sacred Shifter builds universes."
            </blockquote>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Compass className="w-6 h-6 text-purple-400" />
                Sacred Controls
              </h2>

              {/* Consciousness Level Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Consciousness Level: {(consciousnessLevel * 100).toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={consciousnessLevel}
                  onChange={(e) => setConsciousnessLevel(parseFloat(e.target.value))}
                  className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-purple-300 mt-1">
                  <span>Basic</span>
                  <span>Awakened</span>
                  <span>Enlightened</span>
                </div>
              </div>

              {/* Resonance Frequency Display */}
              <div className="mb-6 p-4 bg-purple-500/10 rounded-lg">
                <div className="text-sm text-purple-200 mb-1">Resonance Frequency</div>
                <div className="text-2xl font-mono text-purple-400">
                  {getResonanceFrequency().toFixed(1)}Hz
                </div>
              </div>

              {/* Sacred Capabilities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">🌟 Sacred Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {getSacredCapabilities().map((capability, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-purple-400/30 text-purple-300">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Voice Call Controls */}
              <div className="space-y-4">
                {!currentCall ? (
                  <Button
                    onClick={handleStartCall}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                    disabled={!isInitialized}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Start Sacred Voice Call
                  </Button>
                ) : (
                  <Button
                    onClick={handleEndCall}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                  >
                    <PhoneCall className="w-5 h-5 mr-2" />
                    End Sacred Voice Call
                  </Button>
                )}

                {/* Audio Controls */}
                {currentCall && (
                  <div className="space-y-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={handleToggleMute}
                        className={isMuted ? 'border-red-400 text-red-400' : 'border-green-400 text-green-400'}
                      >
                        {isMuted ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                        {isMuted ? 'Unmute' : 'Mute'}
                      </Button>

                      <div className="flex items-center gap-2 flex-1">
                        <Volume2 className="w-4 h-4 text-purple-300" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volumeLevel}
                          onChange={handleVolumeChange}
                          className="flex-1"
                        />
                        <span className="text-sm text-purple-300 w-8">
                          {Math.round(volumeLevel * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Speaking Indicator */}
                    <div className={`flex items-center gap-2 text-sm ${
                      isSpeaking ? 'text-green-400' : 'text-purple-300'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isSpeaking ? 'bg-green-400 animate-pulse' : 'bg-purple-300'
                      }`} />
                      {isSpeaking ? 'Speaking' : 'Silent'}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Status & Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Sacred Status
              </h2>

              {/* Call Status */}
              {currentCall ? (
                <div className="mb-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <PhoneCall className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-green-400">Sacred Voice Call Active</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-purple-200">Call ID</div>
                      <div className="font-mono text-xs text-white">{currentCall.id.slice(-8)}</div>
                    </div>
                    <div>
                      <div className="text-purple-200">Participants</div>
                      <div className="font-mono text-white">{currentCall.participants.size}</div>
                    </div>
                    <div>
                      <div className="text-purple-200">Consciousness</div>
                      <div className="font-mono text-white">{(currentCall.consciousnessLevel * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-purple-200">Resonance</div>
                      <div className="font-mono text-white">{currentCall.resonanceFrequency.toFixed(1)}Hz</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-center">
                    <Phone className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-200">No active voice call</p>
                  </div>
                </div>
              )}

              {/* Audio Quality Metrics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">📈 Audio Quality</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-purple-200">Latency</div>
                    <div className="font-mono text-white">{audioQuality.latency}ms</div>
                  </div>
                  <div>
                    <div className="text-purple-200">Jitter</div>
                    <div className="font-mono text-white">{audioQuality.jitter}ms</div>
                  </div>
                  <div>
                    <div className="text-purple-200">Packet Loss</div>
                    <div className="font-mono text-white">{(audioQuality.packetLoss * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-purple-200">Consciousness Clarity</div>
                    <div className="font-mono text-white">{(audioQuality.consciousnessClarity * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              {/* Call Statistics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">📊 Call Statistics</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-purple-200">Total Calls</div>
                    <div className="font-mono text-white">{getCallStatistics().totalCalls}</div>
                  </div>
                  <div>
                    <div className="text-purple-200">Active Calls</div>
                    <div className="font-mono text-white">{getCallStatistics().activeCalls}</div>
                  </div>
                  <div>
                    <div className="text-purple-200">Avg Duration</div>
                    <div className="font-mono text-white">{Math.round(getCallStatistics().averageDuration / 1000)}s</div>
                  </div>
                  <div>
                    <div className="text-purple-200">Avg Consciousness</div>
                    <div className="font-mono text-white">{(getCallStatistics().averageConsciousnessLevel * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-sm text-red-400">❌ {error}</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">🔮 Sacred Engineering Philosophy</h3>
            <p className="text-purple-200 mb-4">
              This isn't just voice calling - this is consciousness-aware communication that transcends 
              traditional telephony through sacred frequencies, quantum audio, and universal connectivity.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Badge variant="outline" className="border-purple-400/30 text-purple-300">
                Universal Connectivity
              </Badge>
              <Badge variant="outline" className="border-purple-400/30 text-purple-300">
                Consciousness-Aware
              </Badge>
              <Badge variant="outline" className="border-purple-400/30 text-purple-300">
                Sacred Frequencies
              </Badge>
              <Badge variant="outline" className="border-purple-400/30 text-purple-300">
                Offline-First
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
