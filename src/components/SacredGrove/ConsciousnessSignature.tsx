import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, Heart, Brain, Activity, Star } from 'lucide-react';

interface ConsciousnessSignatureProps {
  resonanceField: {
    personalFrequency: number;
    chakraAlignment: Array<{
      id: string;
      name: string;
      level: number;
      color: string;
      frequency: number;
      isActive: boolean;
    }>;
    emotionalState: {
      primary: string;
      secondary: string;
      intensity: number;
      patterns: string[];
    };
    consciousnessLevel: number;
    collectiveResonance: number;
  };
  consciousnessLevel: number;
}

export const ConsciousnessSignature: React.FC<ConsciousnessSignatureProps> = ({ 
  resonanceField, 
  consciousnessLevel 
}) => {
  const getConsciousnessLevelName = (level: number) => {
    if (level < 1) return 'Awakening';
    if (level < 2) return 'Seeking';
    if (level < 3) return 'Integrating';
    if (level < 4) return 'Transcending';
    if (level < 5) return 'Mastering';
    return 'Enlightened';
  };

  const getConsciousnessColor = (level: number) => {
    if (level < 1) return 'from-gray-400 to-gray-600';
    if (level < 2) return 'from-blue-400 to-blue-600';
    if (level < 3) return 'from-green-400 to-green-600';
    if (level < 4) return 'from-purple-400 to-purple-600';
    if (level < 5) return 'from-yellow-400 to-yellow-600';
    return 'from-white to-gold-400';
  };

  const activeChakras = resonanceField.chakraAlignment.filter(chakra => chakra.isActive);
  const averageChakraLevel = activeChakras.reduce((sum, chakra) => sum + chakra.level, 0) / activeChakras.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Your Consciousness Signature</h3>
          <p className="text-white/70">The Grove recognizes your unique resonance field</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Consciousness Level */}
          <div className="text-center">
            <motion.div
              className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${getConsciousnessColor(consciousnessLevel)} flex items-center justify-center`}
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
            <h4 className="text-lg font-semibold text-white mb-1">
              {getConsciousnessLevelName(consciousnessLevel)}
            </h4>
            <p className="text-sm text-white/60">Level {consciousnessLevel.toFixed(1)}</p>
          </div>

          {/* Personal Frequency */}
          <div className="text-center">
            <motion.div
              className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center"
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 20px rgba(147, 51, 234, 0.3)',
                  '0 0 40px rgba(147, 51, 234, 0.6)',
                  '0 0 20px rgba(147, 51, 234, 0.3)'
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <h4 className="text-lg font-semibold text-white mb-1">
              {resonanceField.personalFrequency} Hz
            </h4>
            <p className="text-sm text-white/60">Personal Resonance</p>
          </div>

          {/* Chakra Alignment */}
          <div className="text-center">
            <motion.div
              className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            <h4 className="text-lg font-semibold text-white mb-1">
              {(averageChakraLevel * 100).toFixed(0)}%
            </h4>
            <p className="text-sm text-white/60">Chakra Alignment</p>
          </div>
        </div>

        {/* Emotional State */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-3">Current Emotional Resonance</h4>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {resonanceField.emotionalState.primary}
                </div>
                <div className="text-sm text-white/60">Primary</div>
              </div>
              <div className="w-8 h-0.5 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white/80">
                  {resonanceField.emotionalState.secondary}
                </div>
                <div className="text-sm text-white/60">Secondary</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${resonanceField.emotionalState.intensity * 100}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-white/60 mt-1">
                Intensity: {(resonanceField.emotionalState.intensity * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Collective Resonance */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Activity className="w-4 h-4" />
            <span className="text-sm">
              Collective Resonance: {(resonanceField.collectiveResonance * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
