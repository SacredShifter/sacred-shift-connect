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
        moduleId: 'foundation',
        moduleName: 'Sacred Foundation',
        frequency: 256,
        note: 'Low C',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'security',
        moduleName: 'Inner Security',
        frequency: 288,
        note: 'C#',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'vitality',
        moduleName: 'Physical Vitality',
        frequency: 396,
        note: 'D',
        isUnlocked: false,
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
        moduleId: 'creativity',
        moduleName: 'Creative Flow',
        frequency: 417,
        note: 'D#',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'emotions',
        moduleName: 'Emotional Mastery',
        frequency: 432,
        note: 'E',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'pleasure',
        moduleName: 'Sacred Pleasure',
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
        moduleId: 'power',
        moduleName: 'Personal Power',
        frequency: 528,
        note: 'F#',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'will',
        moduleName: 'Divine Will',
        frequency: 540,
        note: 'G',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'confidence',
        moduleName: 'Radiant Confidence',
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
        moduleId: 'love',
        moduleName: 'Universal Love',
        frequency: 639,
        note: 'A',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'compassion',
        moduleName: 'Infinite Compassion',
        frequency: 672,
        note: 'A#',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'forgiveness',
        moduleName: 'Sacred Forgiveness',
        frequency: 720,
        note: 'B',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'expansion',
        moduleName: 'Heart Expansion',
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
        moduleId: 'communication',
        moduleName: 'Sacred Communication',
        frequency: 741,
        note: 'C#',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'truth',
        moduleName: 'Divine Truth',
        frequency: 768,
        note: 'D',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'expression',
        moduleName: 'Authentic Expression',
        frequency: 800,
        note: 'D#',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'sound',
        moduleName: 'Sound Healing',
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
        moduleId: 'intuition',
        moduleName: 'Intuitive Awakening',
        frequency: 852,
        note: 'F',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'vision',
        moduleName: 'Inner Vision',
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
        moduleId: 'transcendence',
        moduleName: 'Divine Transcendence',
        frequency: 963,
        note: 'G',
        isUnlocked: true,
        isCompleted: false
      },
      {
        moduleId: 'cosmic',
        moduleName: 'Cosmic Connection',
        frequency: 1080,
        note: 'A',
        isUnlocked: true,
        isCompleted: false
      }
    ]
  }
];