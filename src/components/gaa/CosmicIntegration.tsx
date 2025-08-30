/**
 * Cosmic Integration - Real-time cosmic data display and controls
 * Shows live cosmic structures, events, and integration with GAA presets
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Telescope, 
  Satellite, 
  Waves, 
  Star, 
  Clock,
  MapPin,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Search,
  Filter
} from 'lucide-react';
import { CosmicStructureData, CosmicDataResponse } from '@/types/gaa-polarity';

interface CosmicIntegrationProps {
  cosmicData: CosmicDataResponse | null;
  selectedStructure: CosmicStructureData | null;
  onStructureSelect: (structure: CosmicStructureData) => void;
  onGeneratePreset: (structure: CosmicStructureData) => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  className?: string;
}

export const CosmicIntegration: React.FC<CosmicIntegrationProps> = ({
  cosmicData,
  selectedStructure,
  onStructureSelect,
  onGeneratePreset,
  isStreaming,
  onToggleStreaming,
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getTypeIcon = (type: CosmicStructureData['type']) => {
    const icons = {
      galaxy: Star,
      nebula: Waves,
      pulsar: Zap,
      blackhole: RotateCcw,
      gravitational_wave: Waves,
      dark_matter: RotateCcw,
      jwst_discovery: Telescope
    };
    
    const Icon = icons[type] || Star;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeColor = (type: CosmicStructureData['type']) => {
    const colors = {
      galaxy: 'text-blue-500',
      nebula: 'text-purple-500',
      pulsar: 'text-green-500',
      blackhole: 'text-gray-900',
      gravitational_wave: 'text-orange-500',
      dark_matter: 'text-indigo-500',
      jwst_discovery: 'text-amber-500'
    };
    
    return colors[type] || 'text-blue-500';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-500 border-green-500';
    if (confidence >= 0.7) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  };

  const formatDistance = (distance: number) => {
    if (distance < 1000) return `${distance.toFixed(1)} ly`;
    if (distance < 1000000) return `${(distance / 1000).toFixed(1)}k ly`;
    return `${(distance / 1000000).toFixed(1)}M ly`;
  };

  const formatCoordinates = (ra: number, dec: number) => {
    return `RA ${ra.toFixed(2)}° Dec ${dec.toFixed(2)}°`;
  };

  const filteredStructures = cosmicData?.structures.filter(structure => {
    const matchesSearch = searchQuery === '' || 
      structure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      structure.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || structure.type === typeFilter;
    
    return matchesSearch && matchesType;
  }) || [];

  const uniqueTypes = [...new Set(cosmicData?.structures.map(s => s.type) || [])];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Streaming Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-blue-500" />
            Cosmic Data Stream
            <Badge variant={isStreaming ? "default" : "secondary"}>
              {isStreaming ? "Live" : "Offline"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Real-time integration with astronomical data sources
              </p>
              {cosmicData && (
                <p className="text-xs text-muted-foreground">
                  Last updated: {cosmicData.lastUpdated.toLocaleString()}
                  • Confidence: {(cosmicData.confidence * 100).toFixed(1)}%
                </p>
              )}
            </div>
            
            <Button 
              onClick={onToggleStreaming}
              variant={isStreaming ? "destructive" : "default"}
            >
              {isStreaming ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isStreaming ? "Stop Stream" : "Start Stream"}
            </Button>
          </div>
          
          {cosmicData && (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Structures:</span>
                <div className="font-mono">{cosmicData.structures.length}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Data Source:</span>
                <div className="font-mono">{cosmicData.dataSource}</div>
              </div>
              <div>
                <span className="text-muted-foreground">High Confidence:</span>
                <div className="font-mono">
                  {cosmicData.structures.filter(s => s.discoveryMetadata.confidence > 0.8).length}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cosmic structures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cosmic Structures List */}
      <div className="grid gap-4">
        {filteredStructures.map((structure) => (
          <Card 
            key={structure.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedStructure?.id === structure.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onStructureSelect(structure)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={getTypeColor(structure.type)}>
                      {getTypeIcon(structure.type)}
                    </span>
                    <h3 className="font-semibold">{structure.name}</h3>
                    <Badge variant="outline">
                      {structure.type}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={getConfidenceColor(structure.discoveryMetadata.confidence)}
                    >
                      {(structure.discoveryMetadata.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {formatCoordinates(structure.coordinates.ra, structure.coordinates.dec)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3" />
                      {structure.coordinates.distance && formatDistance(structure.coordinates.distance)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {structure.discoveryMetadata.discoveryDate.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Telescope className="h-3 w-3" />
                      {structure.discoveryMetadata.source}
                    </div>
                  </div>
                  
                  {Object.keys(structure.physicalProperties).length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-1">Physical Properties:</div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(structure.physicalProperties).slice(0, 3).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {key}: {typeof value === 'number' ? value.toFixed(2) : value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGeneratePreset(structure);
                  }}
                  className="ml-4"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredStructures.length === 0 && cosmicData && (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No cosmic structures found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!cosmicData && (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center text-muted-foreground">
                <Satellite className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No cosmic data available</p>
                <p className="text-sm">Start data streaming to view cosmic structures</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Structure Details */}
      {selectedStructure && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <span className={getTypeColor(selectedStructure.type)}>
                {getTypeIcon(selectedStructure.type)}
              </span>
              {selectedStructure.name}
              <Badge variant="outline">Selected</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Discovery Metadata</h4>
                <div className="space-y-1 text-sm">
                  <div>Source: {selectedStructure.discoveryMetadata.source}</div>
                  <div>Date: {selectedStructure.discoveryMetadata.discoveryDate.toLocaleDateString()}</div>
                  <div>Confidence: {(selectedStructure.discoveryMetadata.confidence * 100).toFixed(1)}%</div>
                  <div>Data Quality: {(selectedStructure.discoveryMetadata.dataQuality * 100).toFixed(1)}%</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Audio Mapping</h4>
                <div className="space-y-1 text-sm">
                  <div>Fundamental: {selectedStructure.audioMapping.fundamentalFreq.toFixed(1)} Hz</div>
                  <div>Harmonics: {selectedStructure.audioMapping.harmonicSeries.length} series</div>
                  <div>Cosmic Age: {selectedStructure.audioMapping.temporalEvolution.cosmicAge.toFixed(1)} Gy</div>
                  <div>Evolution Rate: {selectedStructure.audioMapping.temporalEvolution.evolutionRate.toFixed(3)}</div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Geometric Signature</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>Vertices: {selectedStructure.geometricSignature.vertices.length / 3}</div>
                <div>Symmetry: {selectedStructure.geometricSignature.symmetryGroup}</div>
                <div>Fractal Dim: {selectedStructure.geometricSignature.fractalDimension.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => onGeneratePreset(selectedStructure)}
                className="flex-1"
              >
                <Zap className="h-4 w-4 mr-2" />
                Generate GAA Preset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};