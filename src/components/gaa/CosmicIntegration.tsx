import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CosmicStructureData, CosmicDataResponse } from '@/types/gaa-polarity';
import { Telescope, Star, RefreshCw } from 'lucide-react';

interface CosmicIntegrationProps {
  cosmicData?: CosmicDataResponse | null;
  selectedStructure?: CosmicStructureData | null;
  onStructureSelect?: (structure: CosmicStructureData) => void;
  onGeneratePreset?: (structure: CosmicStructureData) => void;
  isStreaming?: boolean;
  onToggleStreaming?: () => void;
}

export const CosmicIntegration: React.FC<CosmicIntegrationProps> = ({
  cosmicData,
  selectedStructure,
  onStructureSelect,
  onGeneratePreset,
  isStreaming = false,
  onToggleStreaming
}) => {
  const [mockData, setMockData] = useState<CosmicDataResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading cosmic data
    const loadMockData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mock: CosmicDataResponse = {
        structures: [
          {
            id: 'andromeda',
            name: 'Andromeda Galaxy',
            type: 'galaxy',
            coordinates: {
              rightAscension: 10.684,
              declination: 41.269,
              distance: 2537000
            },
            physicalProperties: {
              mass: 1.5e12,
              diameter: 220000
            },
            geometricSignature: {
              vertices: [[0, 0, 0], [1, 0, 0], [0.5, 0.866, 0]],
              boundingBox: { min: [-1, -1, -1], max: [1, 1, 1] },
              sacredRatios: { phi: 1.618, pi: 3.14159, sqrt2: 1.414 }
            },
            audioMapping: {
              baseFrequency: 220,
              harmonicSeries: [220, 330, 440],
              amplitude: 0.8,
              duration: 120
            },
            discoveryMetadata: {
              discoveryDate: '964-01-01',
              observatory: 'Ancient',
              catalogId: 'NGC 224',
              confidence: 'confirmed'
            }
          },
          {
            id: 'orion',
            name: 'Orion Nebula',
            type: 'nebula',
            coordinates: {
              rightAscension: 83.822,
              declination: -5.391,
              distance: 1344
            },
            physicalProperties: {
              diameter: 24,
              temperature: 10000
            },
            geometricSignature: {
              vertices: [[0, 0, 0], [0.8, 0.6, 0], [-0.3, 0.9, 0.2]],
              boundingBox: { min: [-1, -1, -1], max: [1, 1, 1] },
              sacredRatios: { phi: 1.618, pi: 3.14159, sqrt2: 1.414 }
            },
            audioMapping: {
              baseFrequency: 174,
              harmonicSeries: [174, 261, 348],
              amplitude: 0.6,
              duration: 90
            },
            discoveryMetadata: {
              discoveryDate: '1610-01-01',
              observatory: 'Galileo',
              catalogId: 'M42',
              confidence: 'confirmed'
            }
          }
        ],
        metadata: {
          totalCount: 2,
          lastUpdated: new Date().toISOString(),
          source: 'Mock Cosmic Database'
        }
      };
      
      setMockData(mock);
      setLoading(false);
    };

    loadMockData();
  }, []);

  const data = cosmicData || mockData;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'galaxy': return 'bg-purple-500';
      case 'nebula': return 'bg-blue-500';
      case 'star_cluster': return 'bg-yellow-500';
      case 'pulsar': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Telescope className="h-5 w-5" />
          Cosmic Integration
          <div className="ml-auto flex gap-2">
            <Badge variant={isStreaming ? "default" : "outline"}>
              {isStreaming ? "Streaming" : "Ready"}
            </Badge>
            <Button variant="outline" size="sm" onClick={onToggleStreaming}>
              {isStreaming ? "Stop" : "Start"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin" />
            <p>Loading cosmic structures...</p>
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{data.structures.length}</p>
                <p className="text-sm text-muted-foreground">Structures</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">Active</p>
                <p className="text-sm text-muted-foreground">Integration</p>
              </div>
            </div>

            <div className="space-y-2">
              {data.structures.map((structure) => (
                <Card
                  key={structure.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedStructure?.id === structure.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => onStructureSelect?.(structure)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span className="font-medium">{structure.name}</span>
                        <Badge className={getTypeColor(structure.type)}>
                          {structure.type}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {structure.audioMapping.baseFrequency}Hz
                      </span>
                    </div>
                    {selectedStructure?.id === structure.id && (
                      <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                        <p>Distance: {structure.coordinates.distance?.toLocaleString() || 'Unknown'} ly</p>
                        <p>Catalog: {structure.discoveryMetadata.catalogId}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Telescope className="h-8 w-8 mx-auto mb-4 opacity-50" />
            <p>No cosmic data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};