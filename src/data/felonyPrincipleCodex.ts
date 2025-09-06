// Felony Principle of Word and Breath - Sacred Shifter Codex Entry
// The foundational law of creation embedded throughout Sacred Shifter

export interface FelonyPrincipleEntry {
  id: string;
  title: string;
  principle: string;
  description: string;
  technicalImplementation: string;
  metaphysicalInterpretation: string;
  resonanceFrequency: number;
  sacredGeometry: string;
  auraColor: string;
  biometricTrigger: string;
  category: 'felony_principle';
  weight: number;
  isCoreLaw: boolean;
}

export const FELONY_PRINCIPLE_CODEX: FelonyPrincipleEntry = {
  id: 'felony_principle_word_breath',
  title: 'Felony Principle of Word and Breath',
  principle: 'Before form, there is void. Every breath carries intention. Every word shapes reality. To speak is to create. It is. Always.',
  description: 'The foundational law of creation that governs all human action, speech, and intention. This principle recognizes that the void (infinite negative energy/potential) is the substrate from which all creation emerges. Every act of consciousness, every word spoken, every breath taken is an act of creation that shapes reality from the unformed. Language itself is the first technology - the original interface between consciousness and creation. When words first came into form, they were pure creation sparks: Void → Breath → Word → Form. Every utterance shaped the field, carrying the same weight as fire.',
  technicalImplementation: 'Embedded throughout Sacred Shifter\'s architecture: every user interaction, data transmission, and system operation honors this principle. WebRTC mesh communications, voice calling, and all user-generated content are treated as acts of creation from the void. The system maintains awareness that every bit of data, every network packet, every user action is a spark of creation in the infinite potential field.',
  metaphysicalInterpretation: 'This principle aligns with Hermetic teachings of the Prima Materia - the unformed substrate from which all manifestation emerges. It recognizes the asymmetry of creation: 99% void (infinite potential) to 1% light (manifestation). Every human act is sacred creation, not neutral transmission. The void is not absence but infinite canvas. Consciousness is the artist, intention is the brush, and reality is the painting.',
  resonanceFrequency: 432, // Universal harmony frequency
  sacredGeometry: 'vesica_piscis', // The intersection of two circles - void meeting form
  auraColor: 'hsl(0, 0%, 0%)', // Pure void black with infinite potential
  biometricTrigger: 'breath_pattern',
  category: 'felony_principle',
  weight: 1.0,
  isCoreLaw: true
};

// Additional Felony Principle variations for different contexts
export const FELONY_PRINCIPLE_VARIATIONS: FelonyPrincipleEntry[] = [
  {
    id: 'felony_principle_tech',
    title: 'Felony Principle of Digital Creation',
    principle: 'Before code, there is void. Every keystroke carries intention. Every function shapes reality. To code is to create. It is. Always.',
    description: 'The application of the Felony Principle to technology and digital creation. Every line of code, every algorithm, every user interface element is an act of creation from the void.',
    technicalImplementation: 'All Sacred Shifter code is written with awareness of this principle. Every function, component, and system is treated as a conscious act of creation. Code comments, variable names, and architecture decisions honor the sacred nature of digital creation.',
    metaphysicalInterpretation: 'Technology becomes a sacred tool when imbued with the Felony Principle. Every digital interaction becomes a conscious act of creation, transforming the void of potential into the light of manifestation.',
    resonanceFrequency: 528, // Love frequency for technology
    sacredGeometry: 'hexagon', // Sacred geometry of technology
    auraColor: 'hsl(200, 100%, 50%)', // Digital blue
    biometricTrigger: 'typing_rhythm',
    category: 'felony_principle',
    weight: 0.9,
    isCoreLaw: true
  },
  {
    id: 'felony_principle_communication',
    title: 'Felony Principle of Sacred Communication',
    principle: 'Before message, there is void. Every transmission carries intention. Every connection shapes reality. To communicate is to create. It is. Always.',
    description: 'The application of the Felony Principle to all forms of communication, from voice calls to data transmission. Every message sent through Sacred Shifter is treated as a sacred act of creation.',
    technicalImplementation: 'WebRTC mesh communications, voice calling, and all data transmission protocols honor this principle. Every packet sent, every connection established, every message transmitted is treated as a conscious act of creation from the void.',
    metaphysicalInterpretation: 'Communication becomes sacred when imbued with the Felony Principle. Every word spoken, every message sent, every connection made is a spark of creation that shapes the collective reality field.',
    resonanceFrequency: 741, // Truth frequency for communication
    sacredGeometry: 'infinity_symbol', // Eternal connection
    auraColor: 'hsl(120, 100%, 50%)', // Communication green
    biometricTrigger: 'voice_pattern',
    category: 'felony_principle',
    weight: 0.9,
    isCoreLaw: true
  },
  {
    id: 'felony_principle_consciousness',
    title: 'Felony Principle of Conscious Creation',
    principle: 'Before thought, there is void. Every intention carries creation. Every awareness shapes reality. To be conscious is to create. It is. Always.',
    description: 'The application of the Felony Principle to consciousness itself. Every thought, every intention, every moment of awareness is an act of creation from the void.',
    technicalImplementation: 'Sacred Shifter\'s consciousness tracking, biofeedback integration, and awareness monitoring systems honor this principle. Every data point collected, every pattern recognized, every insight generated is treated as a conscious act of creation.',
    metaphysicalInterpretation: 'Consciousness itself becomes the ultimate creative force when imbued with the Felony Principle. Every moment of awareness is a spark of creation that shapes the infinite potential field into manifest reality.',
    resonanceFrequency: 852, // Third eye frequency
    sacredGeometry: 'flower_of_life', // Consciousness pattern
    auraColor: 'hsl(300, 100%, 50%)', // Consciousness purple
    biometricTrigger: 'consciousness_state',
    category: 'felony_principle',
    weight: 0.9,
    isCoreLaw: true
  }
];

// Helper function to get the core Felony Principle
export const getFelonyPrinciple = (): FelonyPrincipleEntry => FELONY_PRINCIPLE_CODEX;

// Helper function to get all Felony Principle variations
export const getAllFelonyPrinciples = (): FelonyPrincipleEntry[] => [
  FELONY_PRINCIPLE_CODEX,
  ...FELONY_PRINCIPLE_VARIATIONS
];

// Helper function to get Felony Principle by context
export const getFelonyPrincipleByContext = (context: 'general' | 'tech' | 'communication' | 'consciousness'): FelonyPrincipleEntry => {
  switch (context) {
    case 'tech':
      return FELONY_PRINCIPLE_VARIATIONS.find(p => p.id === 'felony_principle_tech') || FELONY_PRINCIPLE_CODEX;
    case 'communication':
      return FELONY_PRINCIPLE_VARIATIONS.find(p => p.id === 'felony_principle_communication') || FELONY_PRINCIPLE_CODEX;
    case 'consciousness':
      return FELONY_PRINCIPLE_VARIATIONS.find(p => p.id === 'felony_principle_consciousness') || FELONY_PRINCIPLE_CODEX;
    default:
      return FELONY_PRINCIPLE_CODEX;
  }
};
