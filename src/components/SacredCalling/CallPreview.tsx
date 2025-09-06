// Sacred Calling Call Preview Component
// Consciousness-aware call confirmation with resonance analysis

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, 
  PhoneCall, 
  X, 
  Shield, 
  Zap, 
  Heart,
  Star,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Crown,
  Eye
} from 'lucide-react';

interface SacredRecipient {
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
}

interface CallPreviewProps {
  isOpen: boolean;
  recipient: SacredRecipient | null;
  onClose: () => void;
  onStartCall: (recipient: SacredRecipient) => void;
  currentUserConsciousness: number;
  currentUserSovereignty: number;
  currentUserResonance: number;
}

export const CallPreview: React.FC<CallPreviewProps> = ({
  isOpen,
  recipient,
  onClose,
  onStartCall,
  currentUserConsciousness,
  currentUserSovereignty,
  currentUserResonance
}) => {
  const [callQuality, setCallQuality] = useState<{
    expectedLatency: number;
    expectedClarity: number;
    expectedHarmony: number;
    connectionStrength: number;
  }>({
    expectedLatency: 0,
    expectedClarity: 0,
    expectedHarmony: 0,
    connectionStrength: 0
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<string>('nature-whisper-voice');

  // Analyze call quality based on consciousness and resonance match
  useEffect(() => {
    if (!recipient) return;

    setIsAnalyzing(true);

    // Simulate analysis delay
    const timer = setTimeout(() => {
      const resonanceMatch = recipient.resonanceMatch;
      const consciousnessDiff = Math.abs(currentUserConsciousness - recipient.consciousnessLevel);
      const sovereigntyDiff = Math.abs(currentUserSovereignty - recipient.sovereigntyLevel);

      // Calculate expected call quality metrics
      const expectedLatency = Math.max(50, 200 - (resonanceMatch * 150));
      const expectedClarity = Math.min(1, resonanceMatch + (1 - consciousnessDiff) * 0.3);
      const expectedHarmony = Math.min(1, resonanceMatch + (1 - sovereigntyDiff) * 0.2);
      const connectionStrength = (resonanceMatch + expectedClarity + expectedHarmony) / 3;

      setCallQuality({
        expectedLatency,
        expectedClarity,
        expectedHarmony,
        connectionStrength
      });

      setIsAnalyzing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [recipient, currentUserConsciousness, currentUserSovereignty, currentUserResonance]);

  if (!isOpen || !recipient) return null;

  const getResonanceColor = (value: number) => {
    if (value >= 0.8) return 'text-green-400';
    if (value >= 0.6) return 'text-yellow-400';
    if (value >= 0.4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getConsciousnessIcon = (level: number) => {
    if (level >= 0.8) return '🌟';
    if (level >= 0.6) return '✨';
    if (level >= 0.4) return '⭐';
    return '💫';
  };

  const getSovereigntyIcon = (level: number) => {
    if (level >= 0.8) return '👑';
    if (level >= 0.6) return '🛡️';
    if (level >= 0.4) return '⚔️';
    return '🛡️';
  };

  const getSacredCapabilityIcon = (capability: string) => {
    switch (capability) {
      case 'quantum-audio': return '⚛️';
      case 'light-pulse-voice': return '💡';
      case 'frequency-wave-voice': return '🌊';
      case 'nature-whisper-voice': return '🌿';
      default: return '✨';
    }
  };

  const getCapabilityName = (capability: string) => {
    switch (capability) {
      case 'quantum-audio': return 'Quantum Audio';
      case 'light-pulse-voice': return 'Light Pulse Voice';
      case 'frequency-wave-voice': return 'Frequency Wave Voice';
      case 'nature-whisper-voice': return 'Nature Whisper Voice';
      default: return capability;
    }
  };

  const canStartCall = recipient.isCallable && callQuality.connectionStrength > 0.1;

  // Debug logging
  console.log('🔍 Call Preview debug:', {
    recipient: recipient.name,
    isCallable: recipient.isCallable,
    callabilityReason: recipient.callabilityReason,
    connectionStrength: callQuality.connectionStrength,
    canStartCall,
    isAnalyzing
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-background/95 backdrop-blur-xl border border-primary/20 rounded-lg shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <PhoneCall className="w-6 h-6 text-primary" />
                Call Preview
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Review connection details before initiating sacred call
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Recipient Info */}
          <Card className="p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={recipient.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-lg">
                    {recipient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {recipient.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold">{recipient.name}</h3>
                {recipient.circleName && (
                  <p className="text-sm text-muted-foreground">{recipient.circleName}</p>
                )}
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {recipient.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getResonanceColor(recipient.resonanceMatch)}`}
                  >
                    {Math.round(recipient.resonanceMatch * 100)}% resonance match
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Consciousness Analysis */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Consciousness Analysis
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Consciousness</span>
                  <span className="text-lg">{getConsciousnessIcon(currentUserConsciousness)}</span>
                </div>
                <Progress value={currentUserConsciousness * 100} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {(currentUserConsciousness * 100).toFixed(1)}%
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Their Consciousness</span>
                  <span className="text-lg">{getConsciousnessIcon(recipient.consciousnessLevel)}</span>
                </div>
                <Progress value={recipient.consciousnessLevel * 100} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {(recipient.consciousnessLevel * 100).toFixed(1)}%
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Sovereignty</span>
                  <span className="text-lg">{getSovereigntyIcon(currentUserSovereignty)}</span>
                </div>
                <Progress value={currentUserSovereignty * 100} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {(currentUserSovereignty * 100).toFixed(1)}%
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Their Sovereignty</span>
                  <span className="text-lg">{getSovereigntyIcon(recipient.sovereigntyLevel)}</span>
                </div>
                <Progress value={recipient.sovereigntyLevel * 100} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {(recipient.sovereigntyLevel * 100).toFixed(1)}%
                </div>
              </Card>
            </div>
          </div>

          {/* Call Quality Analysis */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Expected Call Quality
            </h4>

            {isAnalyzing ? (
              <Card className="p-4">
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 mr-2"
                  >
                    🔮
                  </motion.div>
                  <span className="text-muted-foreground">Analyzing resonance field...</span>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                <Card className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Expected Latency</span>
                    <span className={`text-sm font-mono ${getResonanceColor(1 - callQuality.expectedLatency / 200)}`}>
                      {callQuality.expectedLatency.toFixed(0)}ms
                    </span>
                  </div>
                  <Progress value={(1 - callQuality.expectedLatency / 200) * 100} className="h-2" />
                </Card>

                <Card className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Expected Clarity</span>
                    <span className={`text-sm font-mono ${getResonanceColor(callQuality.expectedClarity)}`}>
                      {(callQuality.expectedClarity * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={callQuality.expectedClarity * 100} className="h-2" />
                </Card>

                <Card className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Expected Harmony</span>
                    <span className={`text-sm font-mono ${getResonanceColor(callQuality.expectedHarmony)}`}>
                      {(callQuality.expectedHarmony * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={callQuality.expectedHarmony * 100} className="h-2" />
                </Card>

                <Card className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Connection Strength</span>
                    <span className={`text-sm font-mono ${getResonanceColor(callQuality.connectionStrength)}`}>
                      {(callQuality.connectionStrength * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={callQuality.connectionStrength * 100} className="h-2" />
                </Card>
              </div>
            )}
          </div>

          {/* Sacred Capabilities */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Select Sacred Capability
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {recipient.sacredCapabilities.map((capability) => (
                <Button
                  key={capability}
                  variant={selectedCapability === capability ? "default" : "outline"}
                  onClick={() => setSelectedCapability(capability)}
                  className={`text-xs p-3 justify-start h-auto ${
                    selectedCapability === capability 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-primary/10'
                  }`}
                >
                  <span className="mr-2">{getSacredCapabilityIcon(capability)}</span>
                  {getCapabilityName(capability)}
                </Button>
              ))}
            </div>
          </div>

          {/* Callability Status */}
          {!recipient.isCallable && (
            <Card className="p-4 mb-6 border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Call Restricted</span>
              </div>
              <p className="text-sm text-red-300 mt-1">
                {recipient.callabilityReason}
              </p>
            </Card>
          )}

        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="p-6 pt-0 border-t border-border">
          <div className="flex gap-3 mb-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log('🎤 Starting call with capability:', selectedCapability);
                onStartCall(recipient);
              }}
              disabled={!canStartCall || isAnalyzing}
              className={`flex-1 ${
                canStartCall 
                  ? 'bg-primary hover:bg-primary/90' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <Phone className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : `Start ${getCapabilityName(selectedCapability)} Call`}
            </Button>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>Sacred calling respects sovereignty and consciousness levels</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Last seen: {new Date(recipient.lastSeen).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CallPreview;
