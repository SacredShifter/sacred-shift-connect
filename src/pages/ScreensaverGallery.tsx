import React, { useState } from 'react';
import { useSacredScreensaver } from '@/screensavers/SacredScreensaverRouter';
import { motion } from 'framer-motion';

export default function ScreensaverGallery() {
  const { 
    isActive, 
    currentType, 
    activateScreensaver, 
    deactivateScreensaver, 
    cycleToNext,
    availableTypes,
    configs 
  } = useSacredScreensaver();

  const [selectedType, setSelectedType] = useState<string>('resonant_field');

  const handleActivateScreensaver = () => {
    activateScreensaver(selectedType as any);
  };

  const handleCycleNext = () => {
    cycleToNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            Sacred Screensaver Gallery
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Experience the four new cosmic consciousness portals, each one a gateway to different dimensions of sacred geometry and resonance.
          </p>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isActive ? 'Active Screensaver' : 'Screensaver Gallery'}
              </h2>
              <p className="text-white/80">
                {isActive 
                  ? `Currently showing: ${configs[currentType].name}` 
                  : 'Select a screensaver to experience cosmic consciousness'
                }
              </p>
            </div>
            <div className="flex space-x-4">
              {isActive ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={deactivateScreensaver}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Exit Screensaver
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleActivateScreensaver}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Activate Selected
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCycleNext}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Random Cycle
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Screensaver Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTypes.map((type, index) => {
            const config = configs[type];
            const isSelected = selectedType === type;
            const isCurrent = currentType === type && isActive;
            
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(type)}
                className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                  isSelected 
                    ? 'border-yellow-400 bg-yellow-400/20' 
                    : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'
                } ${isCurrent ? 'ring-4 ring-green-400 ring-opacity-50' : ''}`}
              >
                {/* Status Indicators */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  {isCurrent && (
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  )}
                  {isSelected && !isCurrent && (
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  )}
                </div>

                {/* Screensaver Preview */}
                <div className="h-32 mb-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <div className="text-4xl">
                    {type === 'resonant_field' && '🌀'}
                    {type === 'fractal_pyramid' && '🔺'}
                    {type === 'chime_garden' && '🎋'}
                    {type === 'ether_grid' && '🕸️'}
                    {type === 'gaia_chamber' && '🌍'}
                  </div>
                </div>

                {/* Screensaver Info */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {config.name}
                  </h3>
                  <p className="text-white/70 text-sm mb-3">
                    {config.description}
                  </p>
                  
                  {/* Duration Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">
                      Duration: {Math.round(config.duration / 1000 / 60)}min
                    </span>
                    <span className="text-xs text-white/60">
                      Weight: {Math.round(config.weight * 100)}%
                    </span>
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                  >
                    <span className="text-black text-sm">✓</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Cosmic Experience Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            The Four Cosmic Consciousness Portals
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-yellow-400">🔺 The Ascending Temple</h3>
              <p className="text-white/80">
                A golden fractal pyramid suspended in space, endlessly rotating with Metatron's Cube constellations. 
                Experience 432Hz/528Hz breath cycles and the Law of Fragments in action.
              </p>
              
              <h3 className="text-xl font-semibold text-green-400">🎋 The Sonic Grove</h3>
              <p className="text-white/80">
                A bamboo garden with chakra-aligned wind chimes emitting resonance ripples. 
                Journey through a 24-minute cosmic day cycle with fractal lotus blossoms.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-400">🕸️ The Resonance Mesh</h3>
              <p className="text-white/80">
                A 3D infinite web of golden-blue threads flowing like liquid light. 
                Watch sacred geometry sigils flare at nodes as the cosmic heartbeat pulses.
              </p>
              
              <h3 className="text-xl font-semibold text-purple-400">🌍 The Planet's Breath</h3>
              <p className="text-white/80">
                Earth suspended in crystalline rings with aurora belts pulsing to Schumann resonance. 
                Experience 7-minute activation cycles with sacred geometry wings unfolding.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-white/60 text-sm"
        >
          <p>
            Each screensaver is a portal to different dimensions of consciousness. 
            They will automatically cycle through random selections, or you can choose specific experiences.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
