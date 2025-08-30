import { useQuery } from '@tanstack/react-query';

export interface RoutineTemplate {
  id: string;
  name: string;
  archetype: string;
  description: string;
  sacred_geometry: string;
  color_primary: string;
  color_secondary: string;
  category: string;
  sequence_data: any;
  unlock_requirements: any;
  tri_lens_progression: any;
  created_at: string;
}

// Mock data until database migration is approved
const MOCK_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'trauma-healing',
    name: 'Trauma Healing Pathway',
    archetype: 'The Wounded Healer',
    description: 'Nervous system regulation, journaling, and Circle witness work for deep healing.',
    sacred_geometry: 'phoenix_spiral',
    color_primary: '#F97316',
    color_secondary: '#FB923C',
    category: 'healing',
    sequence_data: { modules: ['breathwork', 'journaling', 'circle_witness'] },
    unlock_requirements: { level: 1 },
    tri_lens_progression: { scientific: 'nervous_system', metaphysical: 'energy_clearing', esoteric: 'shadow_alchemy' },
    created_at: new Date().toISOString()
  },
  {
    id: 'truth-seeking',
    name: 'Truth-Seeking Routine',
    archetype: 'The Seeker',
    description: 'Meditation, Mapper reflection, Codex study, and Circle dialogue for clarity.',
    sacred_geometry: 'triangle_circle',
    color_primary: '#8B5CF6',
    color_secondary: '#A78BFA',
    category: 'awakening',
    sequence_data: { modules: ['meditation', 'mapper', 'codex', 'circle'] },
    unlock_requirements: { level: 1 },
    tri_lens_progression: { scientific: 'neuroscience', metaphysical: 'consciousness', esoteric: 'gnosis' },
    created_at: new Date().toISOString()
  },
  {
    id: 'daily-centering',
    name: 'Daily Centering',
    archetype: 'The Grounded One',
    description: 'Morning breath, midday Grove awe, evening journal for balanced living.',
    sacred_geometry: 'square_circle',
    color_primary: '#10B981',
    color_secondary: '#34D399',
    category: 'balance',
    sequence_data: { modules: ['breathwork', 'grove', 'journaling'] },
    unlock_requirements: { level: 1 },
    tri_lens_progression: { scientific: 'circadian', metaphysical: 'grounding', esoteric: 'four_elements' },
    created_at: new Date().toISOString()
  },
  {
    id: 'sacred-starter',
    name: 'Sacred Starter Routine',
    archetype: 'The Pilgrim',
    description: 'Morning breath + meditation, midday Grove awe, evening journal + Mapper.',
    sacred_geometry: 'seed_of_life',
    color_primary: '#06B6D4',
    color_secondary: '#67E8F9',
    category: 'starter',
    sequence_data: { modules: ['breathwork', 'meditation', 'grove', 'journaling', 'mapper'] },
    unlock_requirements: { level: 1 },
    tri_lens_progression: { scientific: 'foundations', metaphysical: 'awareness', esoteric: 'initiation' },
    created_at: new Date().toISOString()
  }
];

export const useRoutineTemplates = () => {
  return useQuery({
    queryKey: ['routineTemplates'],
    queryFn: async (): Promise<RoutineTemplate[]> => {
      // Return mock data until database migration is approved
      return MOCK_TEMPLATES;
    }
  });
};

export const useRoutineTemplate = (templateId: string) => {
  return useQuery({
    queryKey: ['routineTemplate', templateId],
    queryFn: async (): Promise<RoutineTemplate | null> => {
      return MOCK_TEMPLATES.find(t => t.id === templateId) || null;
    },
    enabled: !!templateId
  });
};