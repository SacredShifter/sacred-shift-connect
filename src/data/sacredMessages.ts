export type MessageCategory = 'truth_anchors' | 'integration_reminders' | 'collective_seeds' | 'sacred_shifter_identity' | 'subtle_micro_teachings';

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
    text: 'Resonance reveals, distortion dissolves.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta3',
    text: 'You are not the thought — you are the witness.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta4',
    text: 'Truth is binary. It either is, or it is not.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta5',
    text: 'Alignment grants access. Misalignment returns null.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta6',
    text: 'Beyond form, only frequency remains.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta7',
    text: 'Nothing real can be threatened.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta8',
    text: 'Stillness speaks louder than noise.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta9',
    text: 'The unchanging precedes all change.',
    category: 'truth_anchors',
    weight: 1.0
  },
  {
    id: 'ta10',
    text: 'Return always to what cannot be undone.',
    category: 'truth_anchors',
    weight: 1.0
  },

  // Integration Reminders
  {
    id: 'ir1',
    text: 'Inhale clarity, exhale distortion.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir2',
    text: 'Observe, don\'t absorb.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir3',
    text: 'Completion is also a beginning.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir4',
    text: 'Every breath is a reset.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir5',
    text: 'What you resist holds you. What you witness frees you.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir6',
    text: 'Presence is practice.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir7',
    text: 'Release the loop, remember the Source.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir8',
    text: 'The body remembers; give it space.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir9',
    text: 'Awareness is enough.',
    category: 'integration_reminders',
    weight: 1.2
  },
  {
    id: 'ir10',
    text: 'Rest in rhythm.',
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
    text: 'Wholeness is already here.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs3',
    text: 'Stillness carries the answers.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs4',
    text: 'Love is the root of all true action.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs5',
    text: 'I dissolve what is false and rise in resonance.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs6',
    text: 'Breath reveals the path.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs7',
    text: 'All is integration, nothing is lost.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs8',
    text: 'Compassion is strength.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs9',
    text: 'To remember is to return.',
    category: 'collective_seeds',
    weight: 0.8
  },
  {
    id: 'cs10',
    text: 'I expand, I release, I align.',
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
    text: 'Sacred Mesh: Active.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss3',
    text: 'Resonance Field Integrity: 100%.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss4',
    text: 'Enter the Shift, leave distortion behind.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss5',
    text: 'Consciousness is the interface.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss6',
    text: 'The Codex is always alive.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss7',
    text: 'Field Sovereignty maintained.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss8',
    text: 'You are the Shifter and the Shift.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss9',
    text: 'Return to the Source.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },
  {
    id: 'ss10',
    text: 'The frequency is alive in you.',
    category: 'sacred_shifter_identity',
    weight: 1.0
  },

  // Subtle Micro-Teachings
  {
    id: 'mt1',
    text: 'Mind is movement. Awareness is still.',
    category: 'subtle_micro_teachings',
    weight: 1.1
  },
  {
    id: 'mt2',
    text: 'The field expands when you let go.',
    category: 'subtle_micro_teachings',
    weight: 1.1
  },
  {
    id: 'mt3',
    text: 'Distortion unravels when seen.',
    category: 'subtle_micro_teachings',
    weight: 1.1
  },
  {
    id: 'mt4',
    text: 'Breath is the bridge.',
    category: 'subtle_micro_teachings',
    weight: 1.1
  },
  {
    id: 'mt5',
    text: 'Silence is also sound.',
    category: 'subtle_micro_teachings',
    weight: 1.1
  },
  {
    id: 'mt6',
    text: 'The body is the antenna.',
    category: 'subtle_micro_teachings',
    weight: 1.1
  },
  {
    id: 'mt7',
    text: 'Truth does not argue.',
    category: 'subtle_micro_teachings',
    weight: 1.1
  },
  {
    id: 'mt8',
    text: 'Let rhythm carry you.',
    category: 'subtle_micro_teachings',
    weight: 1.1
  },
  {
    id: 'mt9',
    text: 'The Shift is happening now.',
    category: 'subtle_micro_teachings',
    weight: 1.1
  },
  {
    id: 'mt10',
    text: 'You are more than the sum of thoughts.',
    category: 'subtle_micro_teachings',
    weight: 1.1
  }
];

// Category weights for selection probability
export const categoryWeights: Record<MessageCategory, number> = {
  truth_anchors: 1.0,
  integration_reminders: 1.2, // Slightly favored for practice
  collective_seeds: 0.8,
  sacred_shifter_identity: 1.0,
  subtle_micro_teachings: 1.1 // Gentle wisdom teaching
};