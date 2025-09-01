import { useState, useEffect, useMemo } from 'react';
import { useCodex } from './useCodex';
import { FractalGeometry, FractalPoint } from '@/utils/fractalMath';

export interface ConstellationEntry {
  id: string;
  title: string;
  content: string | null;
  type: string;
  resonance_tags: string[];
  position: FractalPoint;
  theme: string;
  isAnchor: boolean;
  connections: number[];
}

export interface ConstellationState {
  zoomLevel: 'far' | 'mid' | 'close';
  selectedNode: string | null;
  highlightedConnections: number[];
  showLawOfFragments: boolean;
  showPathMode: boolean;
}

export function useConstellationData() {
  const { entries, loading } = useCodex();
  const [state, setState] = useState<ConstellationState>({
    zoomLevel: 'far',
    selectedNode: null,
    highlightedConnections: [],
    showLawOfFragments: false,
    showPathMode: false
  });

  // Transform entries into constellation format with fractal positions
  const constellationEntries = useMemo<ConstellationEntry[]>(() => {
    if (!entries.length) return [];

    const fractal = new FractalGeometry(6, 12);
    const positions = fractal.generateFractalPositions(entries.length);
    const connections = FractalGeometry.generateConnections(entries, positions);

    return entries.map((entry, index) => {
      const theme = FractalGeometry.getEntryTheme(entry);
      const position = positions[index] || { x: 0, y: 0, z: 0, level: 0 };
      
      return {
        id: entry.id,
        title: entry.title,
        content: entry.content,
        type: entry.type,
        resonance_tags: entry.resonance_tags,
        position,
        theme,
        isAnchor: position.isAnchor || false,
        connections: connections
          .filter(conn => conn.from === index || conn.to === index)
          .map(conn => conn.from === index ? conn.to : conn.from)
      };
    });
  }, [entries]);

  // Anchor entries (major themes)
  const anchorEntries = useMemo(() => {
    return constellationEntries.filter(entry => entry.isAnchor);
  }, [constellationEntries]);

  // Orbital entries (fragments around anchors)
  const orbitalEntries = useMemo(() => {
    return constellationEntries.filter(entry => !entry.isAnchor);
  }, [constellationEntries]);

  // Theme clusters
  const themeClusters = useMemo(() => {
    const clusters = new Map<string, ConstellationEntry[]>();
    
    constellationEntries.forEach(entry => {
      if (!clusters.has(entry.theme)) {
        clusters.set(entry.theme, []);
      }
      clusters.get(entry.theme)!.push(entry);
    });
    
    return clusters;
  }, [constellationEntries]);

  // Camera positions for different zoom levels
  const cameraPositions = useMemo(() => {
    const zoomLevels = FractalGeometry.calculateZoomLevels();
    
    return {
      far: { x: 0, y: 5, z: zoomLevels.far },
      mid: { x: 0, y: 3, z: zoomLevels.mid },
      close: { x: 0, y: 1, z: zoomLevels.close }
    };
  }, []);

  // Actions
  const setZoomLevel = (level: 'far' | 'mid' | 'close') => {
    setState(prev => ({ ...prev, zoomLevel: level }));
  };

  const selectNode = (nodeId: string | null) => {
    setState(prev => {
      const selectedEntry = constellationEntries.find(e => e.id === nodeId);
      return {
        ...prev,
        selectedNode: nodeId,
        highlightedConnections: selectedEntry ? selectedEntry.connections : []
      };
    });
  };

  const toggleLawOfFragments = () => {
    setState(prev => ({ ...prev, showLawOfFragments: !prev.showLawOfFragments }));
  };

  const togglePathMode = () => {
    setState(prev => ({ ...prev, showPathMode: !prev.showPathMode }));
  };

  const getRelatedEntries = (entryId: string): ConstellationEntry[] => {
    const entry = constellationEntries.find(e => e.id === entryId);
    if (!entry) return [];
    
    return entry.connections
      .map(index => constellationEntries[index])
      .filter(Boolean);
  };

  const getEntriesByTheme = (theme: string): ConstellationEntry[] => {
    return themeClusters.get(theme) || [];
  };

  // Journey path calculation (for path mode)
  const calculateJourneyPath = useMemo(() => {
    if (!state.showPathMode) return [];
    
    // Simple chronological path - can be enhanced with more sophisticated journey logic
    return constellationEntries
      .sort((a, b) => new Date(entries.find(e => e.id === a.id)?.created_at || 0).getTime() - 
                     new Date(entries.find(e => e.id === b.id)?.created_at || 0).getTime())
      .map((entry, index) => ({
        ...entry,
        pathIndex: index,
        isPathHighlighted: true
      }));
  }, [constellationEntries, entries, state.showPathMode]);

  return {
    // Data
    constellationEntries,
    anchorEntries,
    orbitalEntries,
    themeClusters,
    journeyPath: calculateJourneyPath,
    
    // State
    state,
    cameraPositions,
    loading,
    
    // Actions
    setZoomLevel,
    selectNode,
    toggleLawOfFragments,
    togglePathMode,
    getRelatedEntries,
    getEntriesByTheme,
    
    // Computed
    selectedEntry: constellationEntries.find(e => e.id === state.selectedNode) || null,
    totalFragments: constellationEntries.length,
    anchorCount: anchorEntries.length,
    themeCount: themeClusters.size
  };
}