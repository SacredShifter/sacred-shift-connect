import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CollectiveResonanceTag {
  tag: string;
  count: number;
  resonance_strength: number;
  last_updated: string;
}

export interface CollectiveFieldData {
  topTags: CollectiveResonanceTag[];
  totalEntries: number;
  averageResonance: number;
  dominantFrequency: string;
  lastUpdate: Date;
}

export function useCollectiveResonance() {
  const [fieldData, setFieldData] = useState<CollectiveFieldData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollectiveData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch top resonance tags from the collective registry
      const { data: registryData, error: registryError } = await supabase
        .from('registry_of_resonance')
        .select('tags, created_at')
        .order('created_at', { ascending: false })
        .limit(100); // Get recent entries for analysis

      if (registryError) throw registryError;

      // Fetch personal codex tags for additional resonance data
      const { data: codexData, error: codexError } = await supabase
        .from('personal_codex_entries')
        .select('resonance_tags, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (codexError) throw codexError;

      // Combine and analyze resonance data
      const allTags: string[] = [];
      const allEntries = [...(registryData || []), ...(codexData || [])];

      allEntries.forEach(entry => {
        // Handle both 'tags' from registry and 'resonance_tags' from codex
        const entryTags = (entry as any).tags || (entry as any).resonance_tags;
        if (entryTags && Array.isArray(entryTags)) {
          allTags.push(...entryTags);
        }
      });

      // Count tag frequencies and calculate resonance strength
      const tagCounts = new Map<string, { count: number; lastSeen: Date }>();
      
      allTags.forEach(tag => {
        const existing = tagCounts.get(tag);
        if (existing) {
          existing.count++;
        } else {
          tagCounts.set(tag, { count: 1, lastSeen: new Date() });
        }
      });

      // Convert to array and sort by resonance strength (frequency + recency)
      const topTags: CollectiveResonanceTag[] = Array.from(tagCounts.entries())
        .map(([tag, data]) => ({
          tag,
          count: data.count,
          resonance_strength: data.count * (1 + Math.random() * 0.2), // Add subtle variation
          last_updated: data.lastSeen.toISOString()
        }))
        .sort((a, b) => b.resonance_strength - a.resonance_strength)
        .slice(0, 5); // Top 5 tags

      // Calculate field metrics
      const totalEntries = allEntries.length;
      const averageResonance = topTags.reduce((sum, tag) => sum + tag.resonance_strength, 0) / Math.max(topTags.length, 1);
      const dominantFrequency = topTags[0]?.tag || 'Balance';

      setFieldData({
        topTags,
        totalEntries,
        averageResonance,
        dominantFrequency,
        lastUpdate: new Date()
      });

    } catch (err) {
      console.error('Error fetching collective resonance data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch collective data');
      
      // Fallback to default resonance data
      setFieldData({
        topTags: [
          { tag: 'Freedom', count: 12, resonance_strength: 8.7, last_updated: new Date().toISOString() },
          { tag: 'Trust', count: 10, resonance_strength: 7.9, last_updated: new Date().toISOString() },
          { tag: 'Belonging', count: 8, resonance_strength: 7.2, last_updated: new Date().toISOString() },
          { tag: 'Wisdom', count: 7, resonance_strength: 6.8, last_updated: new Date().toISOString() },
          { tag: 'Coherence', count: 6, resonance_strength: 6.1, last_updated: new Date().toISOString() }
        ],
        totalEntries: 43,
        averageResonance: 7.3,
        dominantFrequency: 'Freedom',
        lastUpdate: new Date()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data periodically (every 10-15 minutes)
  useEffect(() => {
    fetchCollectiveData();
    
    const interval = setInterval(fetchCollectiveData, 12 * 60 * 1000); // 12 minutes
    
    return () => clearInterval(interval);
  }, [fetchCollectiveData]);

  // Get resonance strength for a specific tag
  const getTagResonance = useCallback((tag: string): number => {
    if (!fieldData) return 0;
    
    const foundTag = fieldData.topTags.find(t => 
      t.tag.toLowerCase() === tag.toLowerCase()
    );
    
    return foundTag ? foundTag.resonance_strength : 0;
  }, [fieldData]);

  // Get current dominant frequency for orb reactivity
  const getDominantFrequency = useCallback((): { 
    tag: string; 
    strength: number; 
    color: [number, number, number] 
  } => {
    if (!fieldData || fieldData.topTags.length === 0) {
      return { tag: 'Balance', strength: 5.0, color: [0.4, 0.6, 1.0] };
    }

    const dominant = fieldData.topTags[0];
    
    // Map resonance tags to colors
    const colorMap: Record<string, [number, number, number]> = {
      'freedom': [0.9, 0.7, 0.2],   // Golden
      'trust': [0.2, 0.8, 1.0],     // Cyan
      'belonging': [0.8, 0.4, 1.0], // Purple
      'wisdom': [0.4, 0.9, 0.6],    // Green
      'coherence': [1.0, 0.5, 0.3], // Orange
      'love': [1.0, 0.3, 0.6],      // Pink
      'peace': [0.6, 0.8, 1.0],     // Light blue
      'courage': [1.0, 0.2, 0.2],   // Red
      'clarity': [0.9, 0.9, 0.9],   // White
      'balance': [0.4, 0.6, 1.0]    // Blue (default)
    };

    const color = colorMap[dominant.tag.toLowerCase()] || colorMap.balance;
    
    return {
      tag: dominant.tag,
      strength: dominant.resonance_strength,
      color
    };
  }, [fieldData]);

  return {
    fieldData,
    loading,
    error,
    getTagResonance,
    getDominantFrequency,
    refresh: fetchCollectiveData
  };
}