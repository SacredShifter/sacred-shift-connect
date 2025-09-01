import { VentilationContext } from '../hooks/useSacredVentilationMachine';

export interface UserSignals {
  previousEmotions: string[];
  previousResonance: string[];
  sessionCount: number;
  lastIntensity: number;
}

export const getRestPrompt = (context: VentilationContext, userSignals: UserSignals): string => {
  // High intensity prompts (>70)
  if (context.intensity > 70) {
    const highIntensityPrompts = [
      "Notice body buzz; let jaw and shoulders drop.",
      "Feel the energy settling; breathe naturally now.",
      "Sense the electricity in your cells; allow integration.",
      "Let the intensity find its natural rhythm."
    ];
    return highIntensityPrompts[Math.floor(Math.random() * highIntensityPrompts.length)];
  }
  
  // Fear-release focused prompts (if user tagged Fear↓ previously)
  if (userSignals.previousEmotions.includes('Fear↓')) {
    const fearReleasePrompts = [
      "Sense into safety; lengthen your exhale.",
      "You are held and protected; breathe trust into your body.",
      "Notice what feels solid and supportive around you.",
      "Let your nervous system know it's safe to rest."
    ];
    return fearReleasePrompts[Math.floor(Math.random() * fearReleasePrompts.length)];
  }
  
  // Boundlessness integration prompts
  if (userSignals.previousResonance.includes('Boundlessness')) {
    const boundlessnessPrompts = [
      "Feel your edges softening; where do you end and space begin?",
      "Rest in the vastness you touched; let it integrate gently.",
      "Notice the infinite space within your chest as you breathe.",
      "You are both form and formlessness; breathe between the two."
    ];
    return boundlessnessPrompts[Math.floor(Math.random() * boundlessnessPrompts.length)];
  }
  
  // Default rotation prompts
  const defaultPrompts = [
    "What emotion surfaced most strongly?",
    "Did you feel oceanic boundlessness?", 
    "Name one belief loosening its grip.",
    "How does your body feel different now?",
    "What wants to be released that hasn't been yet?",
    "Where do you feel most alive in your body?",
    "What truth is trying to emerge?",
    "How has your relationship to breath shifted?",
    "What are you grateful to have moved through?",
    "What part of you feels most free right now?"
  ];
  
  // Use session count and context to create some variety
  const promptIndex = (userSignals.sessionCount + context.currentRound) % defaultPrompts.length;
  return defaultPrompts[promptIndex];
};

export const getGroundingTips = (): string[] => {
  return [
    "Feel your body's weight supported by the earth",
    "Press palms together and notice the warmth",
    "Wiggle fingers and toes to reconnect with form", 
    "Look around and name 3 things you can see",
    "Take 3 slow belly breaths through your nose",
    "Place hand on heart and feel it beating",
    "Drink some water mindfully",
    "Gentle movement helps integration"
  ];
};

export const getBaselineBreathingInstructions = (): string[] => {
  return [
    "Breathe in slowly for 4 counts",
    "Hold gently for 2 counts", 
    "Exhale slowly for 6 counts",
    "Pause naturally before next breath",
    "Let your belly rise on inhale",
    "Soften your shoulders on exhale",
    "Return to your natural rhythm",
    "Notice your nervous system calming"
  ];
};

export const getSafetyReminders = (): string[] => {
  return [
    "You're in control - breathe at your own pace",
    "Stop anytime if you feel dizzy or uncomfortable", 
    "Normal breathing is always available to you",
    "Trust your body's wisdom",
    "Go slower if intensity feels too much",
    "You're safe to explore your inner landscape",
    "Integration happens in the pauses",
    "Honor what your system needs right now"
  ];
};

// Dynamic prompt selection based on time in session
export const getTimedPrompt = (minutesIntoSession: number): string | null => {
  if (minutesIntoSession < 5) {
    return "Allow your breath to find its natural depth and rhythm.";
  } else if (minutesIntoSession < 15) {
    return "Notice what wants to move through you without forcing.";
  } else if (minutesIntoSession < 30) {
    return "Trust the intelligence of your breath and body.";
  } else {
    return "Honor the journey you've taken; integration is beginning.";
  }
};

// Intensity-based encouragement
export const getIntensityGuidance = (intensity: number): string => {
  if (intensity < 30) {
    return "Gentle exploration - listen to subtle sensations";
  } else if (intensity < 60) {
    return "Finding your edge - breathe with curiosity";
  } else if (intensity < 80) {
    return "Deep waters - stay present with what arises";
  } else {
    return "Intensity portal - breathe through with trust";
  }
};