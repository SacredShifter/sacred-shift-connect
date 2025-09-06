import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreePine, Sparkles, Heart, Users, Globe, Compass, Star, Moon, Sun } from 'lucide-react';

interface SacredWelcomeProps {
  onEnter: () => void;
}

export const SacredWelcome: React.FC<SacredWelcomeProps> = ({ onEnter }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const welcomeMessages = [
    "The Grove recognizes your consciousness signature...",
    "Welcome, traveler of the infinite...",
    "Three sacred pathways await your choice...",
    "The Grove is ready to guide your journey..."
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % welcomeMessages.length);
    }, 2000);

    const readyTimeout = setTimeout(() => {
      setIsReady(true);
    }, 8000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(readyTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
              'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))',
              'linear-gradient(225deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2), rgba(147, 51, 234, 0.2))',
              'linear-gradient(315deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))'
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Sacred Geometry Particles */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                rotate: [0, 360, 720]
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Welcome Content */}
      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-6">
        {/* Sacred Grove Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="flex items-center justify-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="p-8 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full backdrop-blur-sm border border-emerald-400/30"
          >
            <TreePine className="h-24 w-24 text-emerald-400" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-7xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
        >
          Sacred Grove
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-2xl text-white/80"
        >
          Consciousness Evolution Sanctuary
        </motion.p>

        {/* Animated Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="h-16 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-white/90 italic"
            >
              {welcomeMessages[currentMessage]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Three Pathways Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          {[
            { icon: Heart, title: 'Inner Wisdom', color: 'from-rose-400 to-pink-400', description: 'The Mirror of Self' },
            { icon: Users, title: 'Collective Consciousness', color: 'from-blue-400 to-indigo-400', description: 'The Web of Awakening' },
            { icon: Globe, title: 'Cosmic Connection', color: 'from-purple-400 to-violet-400', description: 'The Infinite Patterns' }
          ].map((pathway, index) => (
            <motion.div
              key={pathway.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 + index * 0.2 }}
              className="text-center"
            >
              <motion.div
                className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${pathway.color} flex items-center justify-center`}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5
                }}
              >
                <pathway.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {pathway.title}
              </h3>
              <p className="text-sm text-white/60">
                {pathway.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5 }}
        >
          <motion.button
            onClick={onEnter}
            disabled={!isReady}
            className={`px-12 py-4 rounded-full text-lg font-semibold transition-all duration-500 ${
              isReady
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-2xl hover:shadow-emerald-500/50 cursor-pointer'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
            whileHover={isReady ? { scale: 1.05 } : {}}
            whileTap={isReady ? { scale: 0.95 } : {}}
          >
            <div className="flex items-center gap-3">
              <Compass className="w-6 h-6" />
              {isReady ? 'Enter the Sacred Grove' : 'Preparing...'}
            </div>
          </motion.button>
        </motion.div>

        {/* Sacred Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="max-w-2xl mx-auto mt-12"
        >
          <blockquote className="text-lg italic text-white/70 leading-relaxed">
            "In the sacred grove, three paths converge - the journey within, the journey with others, 
            and the journey to the infinite. Choose your path, but know that all paths lead home."
          </blockquote>
          <cite className="text-sm text-white/50 mt-2 block">— Ancient Grove Teachings</cite>
        </motion.div>
      </div>
    </div>
  );
};
