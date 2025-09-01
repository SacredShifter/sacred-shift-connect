import React from 'react';

export type GeometryType = 
  | 'seed_of_life' 
  | 'flower_of_life' 
  | 'phoenix_spiral' 
  | 'metatrons_cube' 
  | 'merkaba'
  | 'triangle_circle'
  | 'yin_yang'
  | 'square_circle'
  | 'labyrinth';

interface SacredGeometry3DProps {
  type: GeometryType;
  color?: string;
  animate?: boolean;
  size?: number;
}

export const SacredGeometry3D: React.FC<SacredGeometry3DProps> = ({ 
  type, 
  color = '#8B5CF6', 
  animate = false,
  size = 100 
}) => {
  const getSVGPath = () => {
    switch (type) {
      case 'seed_of_life':
        return (
          <g>
            <circle cx="50" cy="50" r="20" fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
            <circle cx="35" cy="35" r="15" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
            <circle cx="65" cy="35" r="15" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
            <circle cx="35" cy="65" r="15" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
            <circle cx="65" cy="65" r="15" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
            <circle cx="50" cy="20" r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
            <circle cx="50" cy="80" r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
          </g>
        );
      
      case 'flower_of_life':
        return (
          <g>
            {/* Central circle */}
            <circle cx="50" cy="50" r="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" />
            {/* Six surrounding circles */}
            <circle cx="50" cy="29" r="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
            <circle cx="68" cy="39" r="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
            <circle cx="68" cy="61" r="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
            <circle cx="50" cy="71" r="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
            <circle cx="32" cy="61" r="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
            <circle cx="32" cy="39" r="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
            {/* Outer ring */}
            <circle cx="50" cy="8" r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
            <circle cx="86" cy="29" r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
            <circle cx="86" cy="71" r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
            <circle cx="50" cy="92" r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
            <circle cx="14" cy="71" r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
            <circle cx="14" cy="29" r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
          </g>
        );
      
      case 'phoenix_spiral':
        return (
          <g>
            <path 
              d="M20 80 Q30 60 40 50 Q50 40 60 35 Q70 30 75 20" 
              fill="none" 
              stroke={color} 
              strokeWidth="2.5" 
              opacity="0.8"
            />
            <path 
              d="M75 20 Q80 25 85 35 Q85 45 80 50 Q75 55 70 60" 
              fill="none" 
              stroke={color} 
              strokeWidth="2" 
              opacity="0.6"
            />
            <circle cx="75" cy="20" r="3" fill={color} opacity="0.8" />
            <circle cx="20" cy="80" r="2" fill={color} opacity="0.5" />
          </g>
        );
      
      case 'metatrons_cube':
        return (
          <g>
            {/* Outer hexagon */}
            <polygon 
              points="50,15 75,30 75,60 50,75 25,60 25,30" 
              fill="none" 
              stroke={color} 
              strokeWidth="1.5" 
              opacity="0.6" 
            />
            {/* Inner connections */}
            <line x1="50" y1="15" x2="50" y2="75" stroke={color} strokeWidth="1" opacity="0.4" />
            <line x1="25" y1="30" x2="75" y2="60" stroke={color} strokeWidth="1" opacity="0.4" />
            <line x1="75" y1="30" x2="25" y2="60" stroke={color} strokeWidth="1" opacity="0.4" />
            {/* Central diamond */}
            <polygon 
              points="50,35 65,45 50,55 35,45" 
              fill="none" 
              stroke={color} 
              strokeWidth="2" 
              opacity="0.8" 
            />
          </g>
        );
      
      default:
        return (
          <circle 
            cx="50" 
            cy="50" 
            r="25" 
            fill="none" 
            stroke={color} 
            strokeWidth="2" 
            opacity="0.6" 
          />
        );
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className={`${animate ? 'animate-spin' : ''} transition-all duration-1000`}
        style={{ 
          filter: `drop-shadow(0 0 8px ${color}40)`,
          animationDuration: animate ? '20s' : undefined
        }}
      >
        {getSVGPath()}
      </svg>
    </div>
  );
};