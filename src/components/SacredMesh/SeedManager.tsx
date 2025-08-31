import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSacredMeshSeeds, useCreateSacredMeshSeed, type SacredMeshSeed } from '@/hooks/useSacredMeshSeeds';
import { 
  Sprout, 
  Wifi, 
  Lightbulb, 
  Music, 
  TreePine, 
  FileText, 
  Satellite, 
  Atom,
  Shield,
  Heart,
  Eye,
  Waves,
  Sparkles,
  Plus,
  Copy,
  Download
} from 'lucide-react';

export const SeedManager: React.FC = () => {
  const { toast } = useToast();
  const { data: seeds = [], isLoading } = useSacredMeshSeeds();
  const createSeedMutation = useCreateSacredMeshSeed();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newSeedName, setNewSeedName] = useState('');
  const [transportCapabilities, setTransportCapabilities] = useState({
    websocket: true,
    light: false,
    frequency: false,
    nature: false,
    file: true,
    satellite: false,
    quantum: false
  });
  const [consentScope, setConsentScope] = useState({
    data_sharing: true,
    light_communication: false,
    frequency_communication: false,
    nature_harmony: false,
    quantum_entanglement: false
  });

  const handleCreateSeed = async () => {
    if (!newSeedName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your Sacred Mesh seed.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createSeedMutation.mutateAsync({
        seed_name: newSeedName,
        transport_capabilities: transportCapabilities,
        consent_scope: consentScope
      });
      
      setIsCreating(false);
      setNewSeedName('');
      setTransportCapabilities({
        websocket: true,
        light: false,
        frequency: false,
        nature: false,
        file: true,
        satellite: false,
        quantum: false
      });
      setConsentScope({
        data_sharing: true,
        light_communication: false,
        frequency_communication: false,
        nature_harmony: false,
        quantum_entanglement: false
      });
    } catch (error) {
      console.error('Failed to create seed:', error);
    }
  };

  const exportSeedIdentity = (seed: SacredMeshSeed) => {
    const exportData = {
      seed_name: seed.seed_name,
      identity_public_key: Array.from(seed.identity_key_public),
      transport_capabilities: seed.transport_capabilities,
      signatures: {
        frequency: seed.frequency_signature,
        light: seed.light_signature,
        nature: seed.nature_signature
      },
      genealogy: seed.genealogy,
      created_at: seed.created_at
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sacred-seed-${seed.seed_name}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Seed identity exported",
      description: "Your Sacred Mesh seed identity has been exported for sharing.",
    });
  };

  const copyPublicKey = (seed: SacredMeshSeed) => {
    const publicKeyHex = Array.from(seed.identity_key_public, byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');
    
    navigator.clipboard.writeText(publicKeyHex);
    toast({
      title: "Public key copied",
      description: "Your seed's public key has been copied to clipboard.",
    });
  };

  const getTransportIcon = (transport: string) => {
    const icons = {
      websocket: Wifi,
      light: Lightbulb,
      frequency: Music,
      nature: TreePine,
      file: FileText,
      satellite: Satellite,
      quantum: Atom
    };
    return icons[transport as keyof typeof icons] || Wifi;
  };

  const getTransportColor = (transport: string) => {
    const colors = {
      websocket: 'bg-blue-500',
      light: 'bg-yellow-500',
      frequency: 'bg-purple-500',
      nature: 'bg-green-500',
      file: 'bg-gray-500',
      satellite: 'bg-red-500',
      quantum: 'bg-violet-500'
    };
    return colors[transport as keyof typeof colors] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            Sacred Mesh Seeds
          </h2>
          <p className="text-muted-foreground">
            Manage your cryptographic identities for the living mesh organism
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Seed
        </Button>
      </div>

      {isCreating && (
        <Card className="border-2 border-dashed border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Birth a New Sacred Seed
            </CardTitle>
            <CardDescription>
              Create a new cryptographic identity with nature-inspired communication capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="seed-name">Seed Name</Label>
              <Input
                id="seed-name"
                value={newSeedName}
                onChange={(e) => setNewSeedName(e.target.value)}
                placeholder="e.g., Forest Whisper, Ocean Song, Mountain Echo"
              />
            </div>

            <Tabs defaultValue="transports" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transports">Transport Capabilities</TabsTrigger>
                <TabsTrigger value="consent">Consent Scope</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transports" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select the communication channels your seed can use
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(transportCapabilities).map(([transport, enabled]) => {
                    const Icon = getTransportIcon(transport);
                    return (
                      <div key={transport} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className={`p-2 rounded-full ${getTransportColor(transport)} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={`transport-${transport}`} className="capitalize cursor-pointer">
                            {transport}
                          </Label>
                          <Switch
                            id={`transport-${transport}`}
                            checked={enabled}
                            onCheckedChange={(checked) => 
                              setTransportCapabilities(prev => ({ ...prev, [transport]: checked }))
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="consent" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Define what your seed can participate in
                </p>
                
                <div className="space-y-3">
                  {Object.entries(consentScope).map(([scope, enabled]) => (
                    <div key={scope} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <Label htmlFor={`consent-${scope}`} className="capitalize cursor-pointer">
                          {scope.replace('_', ' ')}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {getConsentDescription(scope)}
                        </p>
                      </div>
                      <Switch
                        id={`consent-${scope}`}
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          setConsentScope(prev => ({ ...prev, [scope]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSeed}
                disabled={createSeedMutation.isPending}
                className="flex items-center gap-2"
              >
                {createSeedMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Sprout className="h-4 w-4" />
                )}
                Birth Sacred Seed
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {seeds.map((seed) => (
          <Card key={seed.id} className={`${seed.is_active ? 'border-primary/50' : 'opacity-60'}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-primary" />
                    {seed.seed_name}
                    {seed.is_active && <Badge variant="default">Active</Badge>}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span>Generation {seed.genealogy?.generation || 0}</span>
                    <span>Created {new Date(seed.created_at!).toLocaleDateString()}</span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyPublicKey(seed)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportSeedIdentity(seed)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Waves className="h-4 w-4" />
                  Transport Capabilities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(seed.transport_capabilities).map(([transport, enabled]) => {
                    if (!enabled) return null;
                    const Icon = getTransportIcon(transport);
                    return (
                      <Badge key={transport} variant="secondary" className="flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {transport}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {seed.frequency_signature && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Frequency Signature
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    Primary: {seed.frequency_signature.primary_hz}Hz | 
                    Harmonics: {seed.frequency_signature.harmonics?.join(', ')}Hz
                  </div>
                </div>
              )}

              {seed.light_signature && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Light Signature
                  </h4>
                  <div className="flex gap-1">
                    {seed.light_signature.color_sequence?.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {seed.nature_signature && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TreePine className="h-4 w-4" />
                    Nature Signature
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    {seed.nature_signature.bird_chirp_pattern && 
                      `Bird song: ${seed.nature_signature.bird_chirp_pattern.join(', ')}Hz`
                    }
                    {seed.nature_signature.earth_rhythm && 
                      ` | Earth rhythm: ${seed.nature_signature.earth_rhythm.join(', ')}Hz`
                    }
                  </div>
                </div>
              )}

              <Separator />
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Privacy Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>Sacred Geometry Encoded</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {seeds.length === 0 && !isCreating && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sprout className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Sacred Seeds Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first Sacred Mesh seed to begin participating in the living organism network
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Seed
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

function getConsentDescription(scope: string): string {
  const descriptions = {
    data_sharing: 'Allow sharing of non-sensitive profile data',
    light_communication: 'Participate in light-based communication',
    frequency_communication: 'Enable sacred frequency exchanges',
    nature_harmony: 'Join nature-inspired communication patterns',
    quantum_entanglement: 'Future quantum consciousness bridge'
  };
  return descriptions[scope as keyof typeof descriptions] || 'Sacred mesh participation';
}