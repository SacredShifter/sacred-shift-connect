import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConsciousnessLevel, CONSCIOUSNESS_LEVELS } from '@/types/consciousness';
import { ContentSource } from '@/hooks/useContentSources';

interface SacredGeometryLotusProps {
  sources: ContentSource[];
  selectedSourceId?: string;
  onSourceSelect: (sourceId: string | undefined) => void;
  consciousnessLevel: ConsciousnessLevel;
  userPoints: number;
  className?: string;
}

const GOLDEN_RATIO = 1.618;
const PHI = (1 + Math.sqrt(5)) / 2;

export const SacredGeometryLotus: React.FC<SacredGeometryLotusProps> = ({
  sources,
  selectedSourceId,
  onSourceSelect,
  consciousnessLevel,
  userPoints,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const currentLevel = CONSCIOUSNESS_LEVELS[consciousnessLevel];
  const levelProgress = ((userPoints - currentLevel.min_points) / (currentLevel.max_points - currentLevel.min_points)) * 100;

  // Calculate petal positions using sacred geometry
  const petalPositions = sources.map((_, index) => {
    const angle = (index * (360 / Math.max(sources.length, 1))) * (Math.PI / 180);
    const radius = 120 * GOLDEN_RATIO;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      angle: angle * (180 / Math.PI)
    };
  });

  // Create concentric circles for the 7 Hermetic Principles
  const hermetiCircles = [
    { radius: 40, principle: 'Mentalism', color: '#FF6B6B', opacity: 0.3 },
    { radius: 60, principle: 'Correspondence', color: '#4ECDC4', opacity: 0.4 },
    { radius: 80, principle: 'Vibration', color: '#45B7D1', opacity: 0.3 },
    { radius: 100, principle: 'Polarity', color: '#96CEB4', opacity: 0.4 },
    { radius: 120, principle: 'Rhythm', color: '#FFEAA7', opacity: 0.3 },
    { radius: 140, principle: 'Cause & Effect', color: '#DDA0DD', opacity: 0.4 },
    { radius: 160, principle: 'Gender', color: '#98D8C8', opacity: 0.3 }
  ];

  // Animation phases for the sacred geometry
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const renderSacredGeometry = () => (
    <svg
      ref={svgRef}
      width="400"
      height="400"
      viewBox="-200 -200 400 400"
      className="absolute inset-0 w-full h-full"
    >
      {/* Hermetic Circles */}
      {hermetiCircles.map((circle, index) => (
        <motion.circle
          key={circle.principle}
          cx="0"
          cy="0"
          r={circle.radius}
          fill="none"
          stroke={circle.color}
          strokeWidth="1"
          opacity={circle.opacity}
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            rotate: animationPhase * (index + 1) * 0.1
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Golden Spiral */}
      <motion.path
        d={`M 0,0 Q ${40 * GOLDEN_RATIO},0 ${40 * GOLDEN_RATIO},${40 * GOLDEN_RATIO} Q ${40 * GOLDEN_RATIO},${80 * GOLDEN_RATIO} 0,${80 * GOLDEN_RATIO} Q -${40 * GOLDEN_RATIO},${80 * GOLDEN_RATIO} -${40 * GOLDEN_RATIO},${40 * GOLDEN_RATIO} Q -${40 * GOLDEN_RATIO},0 0,0`}
        fill="none"
        stroke="url(#goldenGradient)"
        strokeWidth="2"
        opacity="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Consciousness Level Indicator */}
      <motion.circle
        cx="0"
        cy="0"
        r="20"
        fill={currentLevel.energy_color}
        opacity="0.8"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Level Progress Ring */}
      <motion.circle
        cx="0"
        cy="0"
        r="25"
        fill="none"
        stroke={currentLevel.energy_color}
        strokeWidth="3"
        strokeDasharray={`${2 * Math.PI * 25 * (levelProgress / 100)} ${2 * Math.PI * 25}`}
        strokeDashoffset="0"
        transform="rotate(-90)"
        initial={{ strokeDasharray: "0 157" }}
        animate={{ 
          strokeDasharray: `${2 * Math.PI * 25 * (levelProgress / 100)} ${2 * Math.PI * 25}`
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* Energy Flow Lines */}
      {petalPositions.map((position, index) => (
        <motion.line
          key={index}
          x1="0"
          y1="0"
          x2={position.x}
          y2={position.y}
          stroke="url(#energyGradient)"
          strokeWidth="1"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 2,
            delay: index * 0.1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Gradients */}
      <defs>
        <linearGradient id="goldenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF6B6B" />
        </linearGradient>
        <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={currentLevel.energy_color} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );

  const renderPetal = (source: ContentSource, index: number) => {
    const position = petalPositions[index];
    const isSelected = selectedSourceId === source.id;
    const isHovered = hoveredSource === source.id;
    
    const platformConfig = {
      youtube: { icon: '🎥', color: '#FF0000' },
      facebook: { icon: '📘', color: '#1877F2' },
      instagram: { icon: '📸', color: '#E4405F' },
      tiktok: { icon: '🎵', color: '#000000' },
      twitter: { icon: '🐦', color: '#1DA1F2' },
      podcast: { icon: '🎧', color: '#8B5CF6' },
      blog: { icon: '📝', color: '#10B981' },
      newsletter: { icon: '📧', color: '#F59E0B' }
    };

    const config = platformConfig[source.source_type as keyof typeof platformConfig] || 
                  { icon: '🌐', color: '#6B7280' };

    return (
      <motion.div
        key={source.id}
        className="absolute cursor-pointer group"
        style={{
          transform: `translate(${position.x - 30}px, ${position.y - 30}px)`
        }}
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ 
          scale: isSelected ? 1.3 : isHovered ? 1.1 : 1,
          opacity: 1,
          rotate: 0
        }}
        transition={{
          delay: index * 0.1,
          duration: 0.8,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ scale: 1.2 }}
        onClick={() => onSourceSelect(isSelected ? undefined : source.id)}
        onMouseEnter={() => setHoveredSource(source.id)}
        onMouseLeave={() => setHoveredSource(null)}
      >
        {/* Petal Shape */}
        <motion.div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl relative"
          style={{
            background: `radial-gradient(circle, ${config.color}40, ${config.color}20)`,
            border: `2px solid ${config.color}`,
            boxShadow: `0 0 20px ${config.color}40`
          }}
          animate={{
            boxShadow: [
              `0 0 20px ${config.color}40`,
              `0 0 30px ${config.color}60`,
              `0 0 20px ${config.color}40`
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {config.icon}
          
          {/* Energy Pulse */}
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: config.color }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.div>

        {/* Hover Info */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
            >
              <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap backdrop-blur-sm">
                <div className="font-medium">{source.source_name}</div>
                <div className="text-gray-300 capitalize">{source.source_type}</div>
                <div className="text-gray-300">
                  {source.sync_status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className={`relative w-full h-96 ${className}`}>
      {/* Sacred Geometry Background */}
      {renderSacredGeometry()}
      
      {/* Central Consciousness Level Display */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <motion.div
          className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-bold relative overflow-hidden"
          style={{ backgroundColor: currentLevel.energy_color }}
          whileHover={{ scale: 1.1 }}
          animate={{
            boxShadow: [
              `0 0 20px ${currentLevel.energy_color}40`,
              `0 0 40px ${currentLevel.energy_color}60`,
              `0 0 20px ${currentLevel.energy_color}40`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-2xl">{currentLevel.sacred_symbol}</div>
          <div className="text-xs">{userPoints}</div>
          
          {/* Consciousness Level Name */}
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {currentLevel.title}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Platform Petals */}
      {sources.map((source, index) => renderPetal(source, index))}

      {/* Expansion Controls */}
      <motion.div
        className="absolute top-4 right-4 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isExpanded ? '−' : '+'}
        </motion.button>
      </motion.div>

      {/* Expanded View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg p-4 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-white text-center">
              <h3 className="text-lg font-bold mb-2">{currentLevel.title}</h3>
              <p className="text-sm mb-4">{currentLevel.description}</p>
              <div className="text-xs space-y-1">
                <div>Progress: {levelProgress.toFixed(1)}%</div>
                <div>Points: {userPoints} / {currentLevel.max_points}</div>
                <div>Next Level: {currentLevel.next_level_requirements[0]}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
