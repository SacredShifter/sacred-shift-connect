export interface ModuleBell {
  moduleId: string;
  moduleName: string;
  frequency: number;
  note: string;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export interface EnhancedChakraData {
  id: string;
  name: string;
  sanskrit: string;
  position: [number, number, number];
  color: string;
  baseFrequency: string;
  element: string;
  description: string;
  qualities: string[];
  affirmation: string;
  theme: string;
  bells: ModuleBell[];
}

export const enhancedChakraData: EnhancedChakraData[] = [
  {
    id: 'root',
    name: 'Root Chakra',
    sanskrit: 'Muladhara',
    position: [0, -0.5, 0],
    color: '#DC143C',
    baseFrequency: '396 Hz',
    element: 'Earth',
    description: 'The first chakra, located at the base of the spine, governs survival, grounding, and stability.',
    qualities: ['Grounding', 'Stability', 'Security', 'Survival'],
    affirmation: 'I am safe, secure, and grounded in my being',
    theme: 'Grounding, safety, physical vitality',
    bells: [
      {
        moduleId: 'dashboard',
        moduleName: 'Dashboard',
        frequency: 256,
        note: 'Low C',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'profile',
        moduleName: 'Profile',
        frequency: 288,
        note: 'C#',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'settings',
        moduleName: 'Settings',
        frequency: 396,
        note: 'D',
        isUnlocked: true,
        isCompleted: false
      }
    ]
  },
  {
    id: 'sacral',
    name: 'Sacral Chakra',
    sanskrit: 'Svadhisthana',
    position: [0, 0.2, 0],
    color: '#FF6347',
    baseFrequency: '417 Hz',
    element: 'Water',
    description: 'The second chakra, located below the navel, governs creativity, sexuality, and emotional well-being.',
    qualities: ['Creativity', 'Sexuality', 'Emotions', 'Pleasure'],
    affirmation: 'I embrace my creative and sensual nature',
    theme: 'Creativity, sexuality, emotional flow',
    bells: [
      {
        moduleId: 'journal',
        moduleName: 'Journal',
        frequency: 417,
        note: 'D#',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'messages',
        moduleName: 'Messages',
        frequency: 432,
        note: 'E',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'library',
        moduleName: 'Library',
        frequency: 480,
        note: 'F',
        isUnlocked: true,
        isCompleted: false
      }
    ]
  },
  {
    id: 'solar-plexus',
    name: 'Solar Plexus Chakra',
    sanskrit: 'Manipura',
    position: [0, 0.8, 0],
    color: '#FFD700',
    baseFrequency: '528 Hz',
    element: 'Fire',
    description: 'The third chakra, located above the navel, governs personal power, confidence, and self-esteem.',
    qualities: ['Personal Power', 'Confidence', 'Will', 'Transformation'],
    affirmation: 'I am confident and empowered to create my reality',
    theme: 'Power, will, identity, self-confidence',
    bells: [
      {
        moduleId: 'gaa',
        moduleName: 'Guardian Administration',
        frequency: 528,
        note: 'F#',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'learning-3d',
        moduleName: '3D Learning',
        frequency: 540,
        note: 'G',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'labs',
        moduleName: 'Labs',
        frequency: 600,
        note: 'G#',
        isUnlocked: true,
        isCompleted: false
      }
    ]
  },
  {
    id: 'heart',
    name: 'Heart Chakra',
    sanskrit: 'Anahata',
    position: [0, 1.5, 0],
    color: '#32CD32',
    baseFrequency: '639 Hz',
    element: 'Air',
    description: 'The fourth chakra, located at the center of the chest, governs love, compassion, and emotional balance.',
    qualities: ['Love', 'Compassion', 'Forgiveness', 'Connection'],
    affirmation: 'I give and receive love freely and unconditionally',
    theme: 'Love, compassion, forgiveness, expansion',
    bells: [
      {
        moduleId: 'circles',
        moduleName: 'Circles',
        frequency: 639,
        note: 'A',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'grove',
        moduleName: 'Grove',
        frequency: 672,
        note: 'A#',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'feed',
        moduleName: 'Feed',
        frequency: 720,
        note: 'B',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'collective',
        moduleName: 'Collective',
        frequency: 768,
        note: 'C (higher)',
        isUnlocked: true,
        isCompleted: false
      }
    ]
  },
  {
    id: 'throat',
    name: 'Throat Chakra',
    sanskrit: 'Vishuddha',
    position: [0, 2.2, 0],
    color: '#00BFFF',
    baseFrequency: '741 Hz',
    element: 'Sound/Ether',
    description: 'The fifth chakra, located at the throat, governs communication, self-expression, and truth.',
    qualities: ['Communication', 'Expression', 'Truth', 'Creativity'],
    affirmation: 'I speak my truth with confidence and clarity',
    theme: 'Communication, truth, expression, sound',
    bells: [
      {
        moduleId: 'codex',
        moduleName: 'Codex',
        frequency: 741,
        note: 'C#',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'breath',
        moduleName: 'Breath',
        frequency: 768,
        note: 'D',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'help',
        moduleName: 'Help',
        frequency: 800,
        note: 'D#',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'guidebook',
        moduleName: 'Guidebook',
        frequency: 852,
        note: 'E (higher)',
        isUnlocked: true,
        isCompleted: false
      }
    ]
  },
  {
    id: 'third-eye',
    name: 'Third Eye Chakra',
    sanskrit: 'Ajna',
    position: [0, 2.8, 0.2],
    color: '#4B0082',
    baseFrequency: '852 Hz',
    element: 'Light',
    description: 'The sixth chakra, located between the eyebrows, governs intuition, psychic abilities, and inner wisdom.',
    qualities: ['Intuition', 'Psychic Abilities', 'Wisdom', 'Clarity'],
    affirmation: 'I see clearly and trust my inner wisdom',
    theme: 'Intuition, vision, clarity, insight',
    bells: [
      {
        moduleId: 'meditation',
        moduleName: 'Meditation',
        frequency: 852,
        note: 'F',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'shift',
        moduleName: 'Shift',
        frequency: 936,
        note: 'F#',
        isUnlocked: true,
        isCompleted: false
      }
    ]
  },
  {
    id: 'crown',
    name: 'Crown Chakra',
    sanskrit: 'Sahasrara',
    position: [0, 3.5, 0],
    color: '#9966CC',
    baseFrequency: '963 Hz',
    element: 'Thought/Light',
    description: 'The seventh chakra, located at the crown of the head, connects us to divine consciousness and spiritual enlightenment.',
    qualities: ['Spiritual Connection', 'Divine Wisdom', 'Enlightenment', 'Universal Consciousness'],
    affirmation: 'I am one with divine consciousness',
    theme: 'Oneness, transcendence, cosmic connection',
    bells: [
      {
        moduleId: 'journey-map',
        moduleName: 'Journey Map',
        frequency: 963,
        note: 'G',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'liberation',
        moduleName: 'Liberation',
        frequency: 1080,
        note: 'A',
        isUnlocked: true,
        isCompleted: false
      }
    ]
  }
];