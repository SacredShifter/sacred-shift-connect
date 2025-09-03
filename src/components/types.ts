export interface MediaItem {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  source_platform?: string;
  source_url?: string;
  external_url?: string;
  category_name?: string;
  category_id?: string;
  featured_priority: number;
  energy_level: number;
  consciousness_level: string;
  genre_tags: string[];
  mood_tags: string[];
  teaching_notes?: string;
  created_at: string;
  content_type?: string;
  author_name?: string;
  author_url?: string;
}

export interface MediaCategory {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  color_scheme: string;
  sacred_geometry: string;
  display_order: number;
}