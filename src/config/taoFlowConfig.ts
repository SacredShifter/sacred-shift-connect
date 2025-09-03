/**
 * Sacred Shifter Tao Flow Configuration
 * Guardian's map of consciousness unfolding through Wu Wei principles
 */

export type TaoStage = 'wuWei' | 'yinYang' | 'advancedCeremony' | 'returnToSilence';

export interface TaoModule {
  name: string;
  path: string;
  education: "high" | "medium" | "low";
  reveal: "auto" | "tooltip" | "hint" | "ceremony" | "wisdom" | "mastery";
  predecessors: string[];
  successors: string[];
  alternatives: string[];
  fadeEducation: boolean;
}

export interface TaoStageConfig {
  [key: string]: TaoModule;
}

export interface TaoFlowConfig {
  wuWei: TaoStageConfig;           // Uncarved Block - Foundation & Onboarding
  yinYang: TaoStageConfig;         // Yin/Yang Flow - Active Practice & Community  
  advancedCeremony: TaoStageConfig; // Advanced Ceremony - Deep Work & Mastery
  returnToSilence: TaoStageConfig;  // Return to Silence - Integration & Service
}

export const taoFlowConfig: TaoFlowConfig = {
  // ================ WU WEI STAGE (UNCARVED BLOCK) ================
  // Foundation modules that auto-reveal during onboarding
  wuWei: {

    home: {
      name: "Sacred Community Hub",
      path: "/",
      education: "high", 
      reveal: "auto",
      predecessors: [],
      successors: ["feed", "breath", "help"],
      alternatives: ["dashboard"], // Dashboard also leads here
      fadeEducation: false
    },

    profile: {
      name: "Sacred Identity",
      path: "/profile",
      education: "medium",
      reveal: "auto",
      predecessors: ["home"],
      successors: ["breath"],
      alternatives: ["home"], // Can access via home menu
      fadeEducation: false
    },


    help: {
      name: "Sacred Guidance Center",
      path: "/help",
      education: "high",
      reveal: "auto", 
      predecessors: ["home"],
      successors: ["guidebook", "support"],
      alternatives: ["home"], // Always accessible
      fadeEducation: false
    },

    guidebook: {
      name: "Ancient Wisdom Codex", 
      path: "/guidebook",
      education: "high",
      reveal: "tooltip",
      predecessors: ["help"],
      successors: ["breath", "meditation"],
      alternatives: ["help", "codex"], // Multiple access paths
      fadeEducation: false
    },

    breath: {
      name: "Breath of Source",
      path: "/breath",
      education: "high",
      reveal: "auto", 
      predecessors: ["dashboard", "home"],
      successors: ["meditation", "journal", "dailyPractice"],
      alternatives: ["guidebook"], // Can start via learning
      fadeEducation: true // Begins education fade
    },

    dailyPractice: {
      name: "Daily Sacred Ritual",
      path: "/daily-ritual", 
      education: "high",
      reveal: "tooltip",
      predecessors: ["breath"],
      successors: ["meditation", "journal"],
      alternatives: ["breath"], // Breath practice unlocks
      fadeEducation: true
    }
  },

  // ================ YIN/YANG FLOW STAGE ================
  // Active exploration through practice completion
  yinYang: {
    meditation: {
      name: "Consciousness Meditation",
      path: "/meditation",
      education: "medium",
      reveal: "auto", // Unlocked after breath sessions
      predecessors: ["breath", "dailyPractice"],
      successors: ["grove", "feed", "learning3d"],
      alternatives: ["guidebook"], // Learning path alternative
      fadeEducation: true
    },

    journal: {
      name: "Sacred Mirror Journal", 
      path: "/journal",
      education: "medium",
      reveal: "tooltip",
      predecessors: ["breath", "meditation"],
      successors: ["codex", "grove", "feed"],
      alternatives: ["meditation"], // Meditation opens journaling
      fadeEducation: true
    },

    feed: {
      name: "Community Consciousness Stream",
      path: "/feed",
      education: "medium", 
      reveal: "auto",
      predecessors: ["home", "meditation"],
      successors: ["messages", "circles", "grove"],
      alternatives: ["journal"], // Journal practice opens community
      fadeEducation: true
    },

    grove: {
      name: "Sacred Grove Ceremonies", 
      path: "/grove",
      education: "medium",
      reveal: "hint",
      predecessors: ["meditation", "journal"],
      successors: ["circles", "collective", "gaa"],
      alternatives: ["feed"], // Community connection alternative
      fadeEducation: true
    },

    learning3d: {
      name: "Immersive Consciousness Learning",
      path: "/learning-3d",
      education: "low",
      reveal: "hint",
      predecessors: ["meditation", "breath"],
      successors: ["gaa", "hermetic", "shift"],
      alternatives: ["grove"], // Ceremonial alternative
      fadeEducation: true
    },

    codex: {
      name: "Wisdom Archives", 
      path: "/codex",
      education: "low",
      reveal: "wisdom", // Reveals through journal practice depth
      predecessors: ["journal", "feed"],
      successors: ["constellation", "library", "hermetic"],
      alternatives: ["learning3d"], // 3D learning alternative
      fadeEducation: true
    },

    library: {
      name: "Sacred Content Petals",
      path: "/library", 
      education: "low",
      reveal: "hint",
      predecessors: ["codex", "feed"],
      successors: ["constellation", "shift"],
      alternatives: ["grove"], // Ceremonial content access
      fadeEducation: true
    }
  },

  // ================ ADVANCED CEREMONY STAGE ================
  // Deep work unlocked through wisdom-based triggers
  advancedCeremony: {
    circles: {
      name: "Circles",
      path: "/circles",
      education: "low",
      reveal: "ceremony", // Requires sustained community engagement
      predecessors: ["grove", "feed"],
      successors: ["messages", "constellation", "collective"],
      alternatives: ["meditation"], // Deep practice alternative
      fadeEducation: true
    },

    messages: {
      name: "Consciousness Communication", 
      path: "/messages",
      education: "low",
      reveal: "ceremony",
      predecessors: ["circles", "feed"],
      successors: ["collective", "constellation"],
      alternatives: ["grove"], // Sacred ceremony alternative
      fadeEducation: true
    },

    gaa: {
      name: "Geometrically Aligned Audio Engine",
      path: "/gaa",
      education: "low", 
      reveal: "ceremony", // Requires advanced breath mastery
      predecessors: ["grove", "learning3d"],
      successors: ["shift", "liberation", "sonicShifter"],
      alternatives: ["constellation"], // Consciousness mapping alternative
      fadeEducation: true
    },

    constellation: {
      name: "Consciousness Constellation Mapper",
      path: "/constellation",
      education: "low",
      reveal: "wisdom", // Unlocks through deep contemplative work
      predecessors: ["codex", "circles"],
      successors: ["liberation", "shift", "registry"],
      alternatives: ["gaa"], // Audio technology alternative
      fadeEducation: true
    },

    hermetic: {
      name: "Hermetic Principles Mastery", 
      path: "/learning-3d", // Currently accessed via 3D learning
      education: "medium", // Higher education for principle teaching
      reveal: "mastery", // Requires demonstrated understanding
      predecessors: ["learning3d", "codex"],
      successors: ["liberation", "shift", "sonicShifter"],
      alternatives: ["constellation"], // Mapping alternative path
      fadeEducation: true
    },

    collective: {
      name: "Collective Coherence Circle",
      path: "/collective",
      education: "low",
      reveal: "ceremony", // Requires community engagement milestones
      predecessors: ["grove", "circles"],
      successors: ["liberation", "registry", "adminMastery"],
      alternatives: ["gaa"], // Technology-enhanced collective work
      fadeEducation: true
    },

    liberation: {
      name: "Liberation Consciousness Module", 
      path: "/liberation",
      education: "low",
      reveal: "wisdom", // Deep contemplative unlocking
      predecessors: ["constellation", "hermetic"],
      successors: ["shift", "registry", "sonicShifter"],
      alternatives: ["collective"], // Community liberation path
      fadeEducation: true
    },

    shift: {
      name: "Sacred Shifter Core Engine",
      path: "/shift",
      education: "low", 
      reveal: "mastery", // Requires mastery demonstration
      predecessors: ["liberation", "gaa"],
      successors: ["sonicShifter", "adminMastery", "registry"],
      alternatives: ["hermetic"], // Principle-based alternative
      fadeEducation: true
    }
  },

  // ================ RETURN TO SILENCE STAGE ================
  // Integration and service, hidden until mastery
  returnToSilence: {
    registry: {
      name: "Collective Codex",
      path: "/registry", 
      education: "low",
      reveal: "mastery", // Service through knowledge sharing
      predecessors: ["shift", "collective"],
      successors: ["sonicShifter", "adminMastery"],
      alternatives: ["liberation"], // Liberation service path
      fadeEducation: true
    },

    sonicShifter: {
      name: "Sonic Shifter (Conceptual)",
      path: "/sonic-shifter", // Future implementation
      education: "low",
      reveal: "mastery", // Conceptual until implementation
      predecessors: ["shift", "liberation"],
      successors: ["adminMastery"],
      alternatives: ["registry"], // Knowledge service alternative
      fadeEducation: true
    },

    adminMastery: {
      name: "Guardian Administration Interface",
      path: "/ai-admin",
      education: "low", 
      reveal: "mastery", // Hidden until ceremony completion
      predecessors: ["shift", "collective"],
      successors: [],
      alternatives: ["registry"], // Service through curation
      fadeEducation: true
    },


    // Support modules for the Return stage
    privacy: {
      name: "Sacred Data Sovereignty",
      path: "/privacy",
      education: "low",
      reveal: "auto", // Always accessible for sovereignty
      predecessors: ["settings"],
      successors: [],
      alternatives: ["adminMastery"], // Admin alternative for advanced users
      fadeEducation: true
    },

    support: {
      name: "Sacred Support Portal", 
      path: "/support",
      education: "low",
      reveal: "auto", // Always available
      predecessors: ["help"],
      successors: [],
      alternatives: [], // Always available
      fadeEducation: true
    },

  }
};

// ================ GUARDIAN HELPER FUNCTIONS ================

export const getModuleByPath = (path: string): TaoModule | null => {
  const stages = [taoFlowConfig.wuWei, taoFlowConfig.yinYang, taoFlowConfig.advancedCeremony, taoFlowConfig.returnToSilence];
  
  for (const stage of stages) {
    for (const module of Object.values(stage)) {
      if (module.path === path) {
        return module;
      }
    }
  }
  return null;
};

export const getUnlockedModules = (completedModules: string[]): TaoModule[] => {
  const unlocked: TaoModule[] = [];
  const stages = [taoFlowConfig.wuWei, taoFlowConfig.yinYang, taoFlowConfig.advancedCeremony, taoFlowConfig.returnToSilence];
  
  for (const stage of stages) {
    for (const [key, module] of Object.entries(stage)) {
      // Auto-reveal modules are always available
      if (module.reveal === "auto") {
        unlocked.push(module);
        continue;
      }
      
      // Check if prerequisites are met
      const hasPrerequisites = module.predecessors.length === 0 || 
        module.predecessors.some(pred => completedModules.includes(pred));
      
      // Check if alternatives are met
      const hasAlternatives = module.alternatives.length === 0 ||
        module.alternatives.some(alt => completedModules.includes(alt));
      
      if (hasPrerequisites || hasAlternatives) {
        unlocked.push(module);
      }
    }
  }
  
  return unlocked;
};

export const getNextSuggestedModules = (currentModule: string, completedModules: string[]): TaoModule[] => {
  const current = getModuleByPath(currentModule);
  if (!current) return [];
  
  const suggestions: TaoModule[] = [];
  const stages = [taoFlowConfig.wuWei, taoFlowConfig.yinYang, taoFlowConfig.advancedCeremony, taoFlowConfig.returnToSilence];
  
  // Find modules in successors
  for (const stage of stages) {
    for (const module of Object.values(stage)) {
      if (current.successors.includes(module.path.replace('/', ''))) {
        suggestions.push(module);
      }
    }
  }
  
  return suggestions;
};

export const shouldFadeEducation = (modulePath: string, userProgress: number): boolean => {
  const module = getModuleByPath(modulePath);
  if (!module) return false;
  
  // Fade education for modules marked with fadeEducation=true and user has progressed
  return module.fadeEducation && userProgress > 0.3; // 30% progress threshold
};

/**
 * Guardian's Wisdom: This configuration ensures Wu Wei unfolding
 * - No seeker is ever blocked (alternatives always exist)
 * - Education fades naturally (high -> medium -> low)  
 * - Unlock logic is deterministic and testable
 * - Natural progression honors readiness over forcing
 */