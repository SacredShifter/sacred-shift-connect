export type MessageCategory = 'truth_anchors' | 'integration_reminders' | 'collective_seeds' | 'sacred_shifter_identity';

export interface SacredMessage {
  id: string;
  text: string;
  category: MessageCategory;
  weight?: number; // For category weighting
}

export const sacredMessages: SacredMessage[] = [
  // Truth Anchors
  {
    id: 'ta1',
    text: 'What is True cannot be broken.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta2',
    text: 'You are the witness beyond thought.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta3',
    text: 'Resonance reveals, distortion dissolves.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta4',
    text: 'Awareness is your unchanging nature.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta5',
    text: 'The Field responds to your frequency.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta6',
    text: 'You are sovereign in your experience.',
    category: 'truth_anchors',
    weight: 1.0
  },

  // Integration Reminders
  {
    id: 'ir1',
    text: 'Exhale what is complete, inhale what is becoming.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir2',
    text: 'Your body is the field, your breath is the key.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir3',
    text: 'Observe, don\'t absorb.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir4',
    text: 'Feel into the frequency before choosing.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir5',
    text: 'Ground through your heart, expand through your crown.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir6',
    text: 'Trust the process unfolding through you.',
    category: 'integration_reminders',
    weight: 1.2
  },

  // Collective Seeds (anonymous wisdom)
  {
    id: 'cs1',
    text: 'Clarity arises when I release control.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs2',
    text: 'The answer was in the pause between breaths.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs3',
    text: 'I found myself by letting go of who I thought I was.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs4',
    text: 'The chaos was teaching me to trust deeper.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs5',
    text: 'My resistance was showing me where to soften.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs6',
    text: 'The pattern shifted when I stopped forcing it.',
    category: 'collective_seeds',
    weight: 0.8
  },

  // Sacred Shifter Identity
  {
    id: 'ss1',
    text: 'Shift your experience. Make it Sacred.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss2',
    text: 'Sacred Mesh Active.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss3',
    text: 'Field Integrity: Holding resonance.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss4',
    text: 'Sacred Frequencies Aligned.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss5',
    text: 'Consciousness Field: Coherent.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss6',
    text: 'Sacred Technology: Online.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  }
];

// Category weights for selection probability
export const categoryWeights: Record<MessageCategory, number> = {
  truth_anchors: 1.0,
  integration_reminders: 1.2, // Slightly favored
  collective_seeds: 0.8,
  sacred_shifter_identity: 1.0
};