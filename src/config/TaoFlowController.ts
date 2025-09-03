import { taoFlowConfig, TaoModule, TaoStage, getModuleByPath } from './taoFlowConfig';

interface TaoProgress {
  breathSessions: number;
  journalEntries: number;
  meditationMinutes: number;
  circleParticipation: number;
  codeEntries: number;
  completedModules: Set<string>;
}

/**
 * Core unlock logic - determines if a specific module is available to the user
 */
export const isModuleUnlocked = (modulePath: string, progress: TaoProgress): boolean => {
  const module = getModuleByPath(modulePath);
  if (!module) return false;

  // Auto-reveal modules are always unlocked
  if (module.reveal === 'auto') return true;

  // Check if module requires ceremony gate
  if (module.reveal === 'ceremony') {
    return checkCeremonyRequirements(module, progress);
  }

  // Check predecessor requirements
  if (module.predecessors && module.predecessors.length > 0) {
    const hasPredecessors = module.predecessors.every(predPath => 
      progress.completedModules.has(predPath)
    );
    if (hasPredecessors) return true;
  }

  // Check alternative pathways
  if (module.alternatives && module.alternatives.length > 0) {
    const hasAlternatives = module.alternatives.some(altPath => 
      progress.completedModules.has(altPath)
    );
    if (hasAlternatives) return true;
  }

  // If no predecessors or alternatives, check milestone-based unlocks
  return checkMilestoneUnlock(module, progress);
};

/**
 * Get all unlocked modules for a specific Tao stage
 */
export const getUnlockedModules = (stage: TaoStage, progress: TaoProgress): TaoModule[] => {
  const stageModules = Object.values(taoFlowConfig[stage]) as TaoModule[];
  return stageModules.filter(module => isModuleUnlocked(module.path, progress));
};

/**
 * Check ceremony gate requirements based on module and user progress
 */
const checkCeremonyRequirements = (module: TaoModule, progress: TaoProgress): boolean => {
  // Wu Wei ceremony gates (foundation building)
  if (module.path === '/breath' || module.path === '/meditation') {
    return true; // Always available as foundation practices
  }
  
  if (module.path === '/journal') {
    return progress.breathSessions >= 1; // Unlock after first breath session
  }

  if (module.path === '/grove') {
    return progress.breathSessions >= 3; // Community after individual practice
  }

  // Yin/Yang ceremony gates (flow and balance)
  if (module.path === '/gaa') {
    return progress.breathSessions >= 5 && progress.journalEntries >= 3;
  }

  if (module.path === '/learning-3d') {
    return progress.meditationMinutes >= 60; // Hour of meditation
  }

  // Advanced Ceremony gates (deep practice)
  if (module.path === '/circles') {
    return progress.journalEntries >= 7; // Deep self-work before community
  }

  if (module.path === '/codex') {
    return progress.circleParticipation >= 1; // Community before wisdom sharing
  }

  // Return to Silence gates (service and integration)
  if (module.path === '/constellation') {
    return progress.codeEntries >= 5 && progress.circleParticipation >= 2;
  }

  // Default: unlock based on completion of milestone count
  return progress.breathSessions >= 3;
};

/**
 * Check milestone-based unlocks for modules without specific ceremony requirements
 */
const checkMilestoneUnlock = (module: TaoModule, progress: TaoProgress): boolean => {
  // Core practices - always available
  const corePractices = ['/dashboard', '/', '/breath', '/meditation'];
  if (corePractices.includes(module.path)) return true;

  // Foundation tier - unlock after any engagement
  const foundationModules = ['/journal', '/feed'];
  if (foundationModules.includes(module.path)) {
    return progress.breathSessions >= 1 || progress.journalEntries >= 1;
  }

  // Practice tier - unlock after showing commitment
  const practiceModules = ['/grove', '/gaa', '/learning-3d'];
  if (practiceModules.includes(module.path)) {
    return progress.breathSessions >= 3 || progress.meditationMinutes >= 30;
  }

  // Community tier - unlock after individual work
  const communityModules = ['/circles', '/messages', '/codex'];
  if (communityModules.includes(module.path)) {
    return progress.journalEntries >= 5 || progress.breathSessions >= 7;
  }

  // Advanced tier - unlock after community engagement
  const advancedModules = ['/constellation', '/library'];
  if (advancedModules.includes(module.path)) {
    return progress.circleParticipation >= 1 && progress.codeEntries >= 3;
  }

  // Support modules - always available
  const supportModules = ['/help', '/guidebook', '/sitemap', '/support', '/profile', '/settings', '/privacy'];
  if (supportModules.includes(module.path)) return true;

  // Default: require some level of engagement
  return progress.breathSessions >= 1;
};

/**
 * Get suggested next modules based on current progress
 */
export const getNextSuggestedModules = (progress: TaoProgress): TaoModule[] => {
  const allStages: TaoStage[] = ['wuWei', 'yinYang', 'advancedCeremony', 'returnToSilence'];
  const suggestions: TaoModule[] = [];

  for (const stage of allStages) {
    const stageModules = Object.values(taoFlowConfig[stage]) as TaoModule[];
    
    // Find modules that are not unlocked but close to being unlocked
    for (const module of stageModules) {
      if (!isModuleUnlocked(module.path, progress)) {
        // Check if user is close to unlocking this module
        if (isCloseToUnlocking(module, progress)) {
          suggestions.push(module);
        }
      }
    }
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
};

/**
 * Check if user is close to unlocking a module (for suggestions)
 */
const isCloseToUnlocking = (module: TaoModule, progress: TaoProgress): boolean => {
  // If they need 1-2 more sessions of any practice type
  if (module.path === '/grove' && progress.breathSessions >= 2) return true;
  if (module.path === '/gaa' && progress.breathSessions >= 4) return true;
  if (module.path === '/circles' && progress.journalEntries >= 5) return true;
  
  return false;
};