export interface TarotCardData {
  id: number;
  arcana: 'Major' | 'Minor';
  suit: 'Dream' | 'Energy' | 'Truth' | 'Community' | 'Major';
  title: string;
  archetype: string; // From prompt, maps to title for Major Arcana
  upright: string[];
  reversed: string[];
  keywords: string[];
  colors: {
    above: [string, string];
    below: [string, string];
  };
  sigil: string;
  // Optional fields for future implementation
  manifesto_excerpt?: string;
  soundscape_url?: string;
}
