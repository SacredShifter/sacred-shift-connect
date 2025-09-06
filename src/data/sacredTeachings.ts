// Sacred Teachings Database for Sacred Grove
// Deep metaphysical wisdom organized by consciousness levels and pathways

export interface SacredTeaching {
  id: string;
  title: string;
  level: number; // 1-5 consciousness levels
  pathway: 'inner-wisdom' | 'collective-consciousness' | 'cosmic-connection';
  category: string;
  content: {
    principle: string;
    explanation: string;
    practice: string;
    meditation: string;
    integration: string;
    symbols: string[];
    frequencies: number[];
  };
  prerequisites: string[];
  unlocks: string[];
  resonance: {
    chakra: string;
    frequency: number;
    color: string;
  };
}

export const sacredTeachings: SacredTeaching[] = [
  // INNER WISDOM PATHWAY - Levels 1-2
  {
    id: 'mentalism-foundation',
    title: 'The Principle of Mentalism',
    level: 1,
    pathway: 'inner-wisdom',
    category: 'Hermetic Foundations',
    content: {
      principle: "All is Mind; the Universe is Mental",
      explanation: "The fundamental truth that everything in existence is a manifestation of the Universal Mind. All matter, energy, and phenomena are mental constructs projected into physical reality through the power of consciousness.",
      practice: "Begin each day by recognizing that your thoughts create your reality. Practice observing your mental patterns without judgment, understanding that you are the observer of your own mind.",
      meditation: "Sit in stillness and observe the space between thoughts. In this gap, you touch the Universal Mind that creates all things. Feel yourself as both the creator and the created.",
      integration: "Throughout your day, notice how your mental state shapes your experience. When challenges arise, remember: this too is a mental construct that can be transformed through conscious awareness.",
      symbols: ['All-Seeing Eye', 'Infinity Symbol', 'Sacred Triangle'],
      frequencies: [432, 528, 741]
    },
    prerequisites: [],
    unlocks: ['correspondence-law', 'vibration-principle'],
    resonance: {
      chakra: 'crown',
      frequency: 963,
      color: '#9966CC'
    }
  },
  {
    id: 'correspondence-law',
    title: 'The Law of Correspondence',
    level: 1,
    pathway: 'inner-wisdom',
    category: 'Hermetic Foundations',
    content: {
      principle: "As above, so below; as below, so above",
      explanation: "The microcosm reflects the macrocosm. Your inner world mirrors the outer universe. Every pattern in nature, from the spiral of a galaxy to the structure of DNA, follows the same sacred geometry.",
      practice: "Study the patterns in your life. Notice how your personal relationships mirror your relationship with yourself. Observe how your inner conflicts manifest as external challenges.",
      meditation: "Visualize your chakra system as a reflection of the cosmic order. Feel how each energy center corresponds to a planet, element, or universal principle.",
      integration: "When making decisions, ask: 'What would the highest version of myself choose?' This connects your personal will with universal wisdom.",
      symbols: ['Sacred Tree', 'Ladder of Jacob', 'Caduceus'],
      frequencies: [528, 741, 852]
    },
    prerequisites: ['mentalism-foundation'],
    unlocks: ['vibration-principle', 'polarity-law'],
    resonance: {
      chakra: 'third-eye',
      frequency: 852,
      color: '#4B0082'
    }
  },
  {
    id: 'vibration-principle',
    title: 'The Principle of Vibration',
    level: 2,
    pathway: 'inner-wisdom',
    category: 'Hermetic Foundations',
    content: {
      principle: "Nothing rests; everything moves; everything vibrates",
      explanation: "All matter and energy exist in a state of constant vibration. Your thoughts, emotions, and physical body all vibrate at specific frequencies. By raising your vibration, you attract higher experiences.",
      practice: "Use sacred sound frequencies to harmonize your energy. Practice toning with vowel sounds: A (crown), E (throat), I (third eye), O (heart), U (root).",
      meditation: "Feel the vibration of your heartbeat. Expand this awareness to feel the vibration of your entire being. Then extend this feeling to encompass the room, the building, the planet.",
      integration: "Before important meetings or decisions, raise your vibration through breathwork, music, or positive affirmations. Notice how this affects your outcomes.",
      symbols: ['Sine Wave', 'Tuning Fork', 'Sacred Spiral'],
      frequencies: [432, 528, 741, 852]
    },
    prerequisites: ['mentalism-foundation', 'correspondence-law'],
    unlocks: ['polarity-law', 'rhythm-principle'],
    resonance: {
      chakra: 'throat',
      frequency: 741,
      color: '#0000FF'
    }
  },
  {
    id: 'mirror-journal-mastery',
    title: 'Mirror Journal Mastery',
    level: 2,
    pathway: 'inner-wisdom',
    category: 'Self-Reflection',
    content: {
      principle: "The mirror reflects not what you see, but what you are",
      explanation: "Your journal becomes a sacred mirror that reveals the hidden aspects of your consciousness. Through honest self-reflection, you discover the patterns that shape your reality.",
      practice: "Write three pages every morning without stopping. Let your subconscious mind speak through your pen. Ask yourself: 'What am I not seeing about myself?'",
      meditation: "Before journaling, sit in front of a physical mirror. Look into your own eyes and ask: 'What does my soul want me to know today?' Then write from this place of inner knowing.",
      integration: "Use your journal to track synchronicities, patterns, and insights. Notice how your writing style changes as your consciousness expands.",
      symbols: ['Mirror', 'Quill Pen', 'Open Book'],
      frequencies: [528, 741]
    },
    prerequisites: ['mentalism-foundation'],
    unlocks: ['breath-sovereignty', 'resonance-chain'],
    resonance: {
      chakra: 'heart',
      frequency: 528,
      color: '#00FF00'
    }
  },

  // COLLECTIVE CONSCIOUSNESS PATHWAY - Levels 2-3
  {
    id: 'collective-resonance',
    title: 'Collective Resonance Field',
    level: 2,
    pathway: 'collective-consciousness',
    category: 'Group Dynamics',
    content: {
      principle: "Individual consciousness amplifies through collective intention",
      explanation: "When two or more people align their consciousness with a shared intention, their combined energy creates a resonance field that transcends the sum of its parts. This is the foundation of sacred community.",
      practice: "Join or create a meditation group. Practice synchronized breathing and shared intention. Notice how the group energy feels different from individual practice.",
      meditation: "Visualize yourself connected to all beings who are also meditating at this moment. Feel the web of consciousness that connects all awakened souls across the planet.",
      integration: "In group settings, focus on raising the collective vibration rather than just your own. Your individual growth serves the whole.",
      symbols: ['Sacred Circle', 'Web of Light', 'Infinity Knot'],
      frequencies: [528, 741, 852]
    },
    prerequisites: ['vibration-principle'],
    unlocks: ['synchronicity-mastery', 'community-rituals'],
    resonance: {
      chakra: 'heart',
      frequency: 528,
      color: '#00FF00'
    }
  },
  {
    id: 'synchronicity-mastery',
    title: 'Synchronicity Mastery',
    level: 3,
    pathway: 'collective-consciousness',
    category: 'Pattern Recognition',
    content: {
      principle: "Meaningful coincidences reveal the underlying order of consciousness",
      explanation: "Synchronicities are not random events but meaningful patterns that emerge when your consciousness aligns with universal flow. They are messages from the collective unconscious guiding your path.",
      practice: "Keep a synchronicity journal. Record meaningful coincidences, repeating numbers, chance meetings, and serendipitous events. Look for patterns and messages.",
      meditation: "Before sleep, ask the universe to show you a sign tomorrow. Be open to receiving it in any form. Trust that the message will come when you're ready to receive it.",
      integration: "When synchronicities occur, pause and ask: 'What is the universe trying to tell me?' Use these moments as guidance for your next steps.",
      symbols: ['Sacred Geometry', 'Fractal Patterns', 'Golden Ratio'],
      frequencies: [741, 852, 963]
    },
    prerequisites: ['collective-resonance'],
    unlocks: ['community-rituals', 'resonance-weaving'],
    resonance: {
      chakra: 'third-eye',
      frequency: 852,
      color: '#4B0082'
    }
  },
  {
    id: 'community-rituals',
    title: 'Sacred Community Rituals',
    level: 3,
    pathway: 'collective-consciousness',
    category: 'Ceremonial Practice',
    content: {
      principle: "Ritual creates sacred space where transformation becomes possible",
      explanation: "Sacred rituals are not empty ceremonies but powerful tools for collective transformation. They create a container where individual consciousness can merge with group intention to create profound change.",
      practice: "Participate in or create full moon circles, new moon intentions, seasonal celebrations, or daily group meditations. The key is consistency and shared intention.",
      meditation: "Visualize your community ritual space. See the energy of all participants flowing together, creating a vortex of transformation. Feel how this amplifies each individual's growth.",
      integration: "Bring ritual consciousness into your daily life. Even simple acts like lighting a candle before work or saying grace before meals can become sacred practices.",
      symbols: ['Sacred Circle', 'Altar', 'Candle Flame'],
      frequencies: [432, 528, 741]
    },
    prerequisites: ['collective-resonance', 'synchronicity-mastery'],
    unlocks: ['resonance-weaving', 'collective-wisdom'],
    resonance: {
      chakra: 'heart',
      frequency: 528,
      color: '#00FF00'
    }
  },

  // COSMIC CONNECTION PATHWAY - Levels 3-5
  {
    id: 'cosmic-perspective',
    title: 'Cosmic Perspective Shift',
    level: 3,
    pathway: 'cosmic-connection',
    category: 'Universal Awareness',
    content: {
      principle: "You are the universe experiencing itself",
      explanation: "Your individual consciousness is not separate from the cosmos but is the cosmos itself, experiencing life through your unique perspective. This realization dissolves the illusion of separation and opens the door to infinite possibility.",
      practice: "Spend time under the stars. Feel your connection to the vastness of space. Practice expanding your awareness beyond your personal concerns to encompass the entire universe.",
      meditation: "Visualize yourself as a point of light in the cosmic web. Feel how your consciousness is connected to every other point of light across the universe. You are both the observer and the observed.",
      integration: "When facing challenges, ask: 'How would the universe handle this?' This cosmic perspective often reveals solutions that personal thinking cannot access.",
      symbols: ['Infinity Symbol', 'Cosmic Web', 'Stellar Spiral'],
      frequencies: [741, 852, 963]
    },
    prerequisites: ['vibration-principle', 'collective-resonance'],
    unlocks: ['sacred-geometry', 'universal-frequencies'],
    resonance: {
      chakra: 'crown',
      frequency: 963,
      color: '#9966CC'
    }
  },
  {
    id: 'sacred-geometry',
    title: 'Sacred Geometry Mastery',
    level: 4,
    pathway: 'cosmic-connection',
    category: 'Universal Patterns',
    content: {
      principle: "Geometry is the language of creation",
      explanation: "The same geometric patterns that govern the formation of galaxies, the structure of DNA, and the growth of plants also govern the flow of consciousness. By understanding these patterns, you align with the creative force of the universe.",
      practice: "Study the Flower of Life, the Golden Ratio, and the Fibonacci sequence. Draw these patterns while meditating. Feel how they resonate with your own energy field.",
      meditation: "Visualize sacred geometric shapes around your body. Start with a circle of light, then add triangles, squares, pentagons, and hexagons. Feel how each shape affects your consciousness differently.",
      integration: "Use sacred geometry in your daily life. Arrange objects in your space according to these patterns. Notice how this affects the energy flow in your environment.",
      symbols: ['Flower of Life', 'Golden Ratio', 'Sacred Spiral'],
      frequencies: [432, 528, 741, 852, 963]
    },
    prerequisites: ['cosmic-perspective'],
    unlocks: ['universal-frequencies', 'consciousness-integration'],
    resonance: {
      chakra: 'third-eye',
      frequency: 852,
      color: '#4B0082'
    }
  },
  {
    id: 'universal-frequencies',
    title: 'Universal Frequency Harmonization',
    level: 4,
    pathway: 'cosmic-connection',
    category: 'Sound Healing',
    content: {
      principle: "Sound is the bridge between matter and consciousness",
      explanation: "Every frequency in the universe carries specific information and consciousness. By attuning to these frequencies, you can harmonize your energy field with the cosmic symphony and accelerate your evolution.",
      practice: "Use binaural beats, isochronic tones, and sacred frequencies (432Hz, 528Hz, 741Hz, 852Hz, 963Hz) during meditation. Each frequency activates different aspects of consciousness.",
      meditation: "Listen to the Schumann resonance (7.83Hz) - the Earth's heartbeat. Feel how this frequency grounds and harmonizes your energy with the planet's electromagnetic field.",
      integration: "Create a personal frequency practice. Use different frequencies for different purposes: 432Hz for creativity, 528Hz for healing, 741Hz for intuition, 852Hz for spiritual connection.",
      symbols: ['Sound Wave', 'Tuning Fork', 'Cosmic Symphony'],
      frequencies: [432, 528, 741, 852, 963]
    },
    prerequisites: ['sacred-geometry'],
    unlocks: ['consciousness-integration', 'universal-wisdom'],
    resonance: {
      chakra: 'throat',
      frequency: 741,
      color: '#0000FF'
    }
  },
  {
    id: 'consciousness-integration',
    title: 'Universal Consciousness Integration',
    level: 5,
    pathway: 'cosmic-connection',
    category: 'Enlightenment',
    content: {
      principle: "You are both the drop and the ocean",
      explanation: "The highest realization is that your individual consciousness is not separate from universal consciousness. You are both the finite human experiencing life and the infinite awareness that contains all experience.",
      practice: "Practice non-dual awareness. In meditation, observe the space between thoughts. In this space, you touch the infinite awareness that is both you and not you simultaneously.",
      meditation: "Sit in complete stillness. Let go of all concepts of self and other. In this state of pure awareness, you realize that you are the universe experiencing itself through this particular form.",
      integration: "Live from this realization. Make decisions from the perspective of universal consciousness rather than personal ego. Serve the highest good of all beings, knowing that all beings are one.",
      symbols: ['Infinity Symbol', 'Yin-Yang', 'Cosmic Mandala'],
      frequencies: [432, 528, 741, 852, 963, 1111]
    },
    prerequisites: ['universal-frequencies', 'sacred-geometry'],
    unlocks: ['universal-wisdom', 'cosmic-mastery'],
    resonance: {
      chakra: 'crown',
      frequency: 963,
      color: '#9966CC'
    }
  },

  // ADVANCED INTEGRATIONS - Level 5
  {
    id: 'universal-wisdom',
    title: 'Universal Wisdom Channeling',
    level: 5,
    pathway: 'cosmic-connection',
    category: 'Divine Communication',
    content: {
      principle: "Wisdom flows through you, not from you",
      explanation: "At the highest levels of consciousness, you become a clear channel for universal wisdom. You don't create the wisdom; you allow it to flow through you for the benefit of all beings.",
      practice: "Practice automatic writing or channeling. Sit in meditation and ask for guidance from your highest self or universal consciousness. Write whatever comes through without judgment.",
      meditation: "Visualize yourself as a hollow bamboo flute. Universal wisdom flows through you like music through the flute. You are the instrument, not the musician.",
      integration: "Share the wisdom you receive with others. Teach, write, or create from this place of universal connection. Trust that the right words will come when needed.",
      symbols: ['Sacred Flute', 'Divine Light', 'Wisdom Tree'],
      frequencies: [963, 1111, 1440]
    },
    prerequisites: ['consciousness-integration'],
    unlocks: ['cosmic-mastery'],
    resonance: {
      chakra: 'crown',
      frequency: 963,
      color: '#9966CC'
    }
  }
];

// Teaching progression system
export const getTeachingProgression = (currentLevel: number, pathway: string) => {
  return sacredTeachings.filter(teaching => 
    teaching.level <= currentLevel && 
    teaching.pathway === pathway
  );
};

// Get next teaching to unlock
export const getNextTeaching = (completedTeachings: string[], pathway: string) => {
  const pathwayTeachings = sacredTeachings.filter(t => t.pathway === pathway);
  
  for (const teaching of pathwayTeachings) {
    if (!completedTeachings.includes(teaching.id)) {
      const prerequisitesMet = teaching.prerequisites.every(prereq => 
        completedTeachings.includes(prereq)
      );
      if (prerequisitesMet) {
        return teaching;
      }
    }
  }
  
  return null;
};

// Get teaching by ID
export const getTeachingById = (id: string) => {
  return sacredTeachings.find(teaching => teaching.id === id);
};
