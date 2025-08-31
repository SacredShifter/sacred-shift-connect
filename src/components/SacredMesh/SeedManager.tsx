import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSacredMeshSeeds, useCreateSacredMeshSeed, type SacredMeshSeed } from "@/hooks/useSacredMeshSeeds";
import { 
  Wifi, Radio, Lightbulb, Leaf, FileText, Satellite, 
  Atom, Download, Copy, Plus, Circle, Eye, EyeOff,
  Sparkles, Zap, Wind, Mountain, Waves
} from "lucide-react";

// Transport capability options
const TRANSPORT_OPTIONS = [
  { key: 'websocket', label: 'WebSocket', icon: Wifi },
  { key: 'light', label: 'Light Pulse', icon: Lightbulb },
  { key: 'frequency', label: 'Frequency Wave', icon: Radio },
  { key: 'nature', label: 'Nature Whisper', icon: Leaf },
  { key: 'quantum', label: 'Quantum Flutter', icon: Atom },
];

export default function SeedManager() {
  const { data: seeds = [], isLoading } = useSacredMeshSeeds();
  const createSeedMutation = useCreateSacredMeshSeed();
  const { toast } = useToast();

  // Create seed state
  const [isCreating, setIsCreating] = useState(false);
  const [newSeedName, setNewSeedName] = useState('');
  const [transportCapabilities, setTransportCapabilities] = useState<string[]>([]);
  const [consentScope, setConsentScope] = useState<'public' | 'circles' | 'private'>('circles');

  const handleCreateSeed = async () => {
    if (!newSeedName.trim()) {
      toast({
        title: "Seed name required",
        description: "Please enter a name for your Sacred Mesh seed.",
        variant: "destructive",
      });
      return;
    }

    if (transportCapabilities.length === 0) {
      toast({
        title: "Transport capabilities required",
        description: "Please select at least one transport capability.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      await createSeedMutation.mutateAsync({
        seed_name: newSeedName,
        transport_capabilities: transportCapabilities,
        consent_scope: consentScope,
      });

      // Reset form
      setNewSeedName('');
      setTransportCapabilities([]);
      setConsentScope('circles');
    } catch (error) {
      console.error('Failed to create seed:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const exportSeedIdentity = (seed: SacredMeshSeed) => {
    const exportData = {
      seed_name: seed.seed_name,
      public_key: seed.identity_key_public,
      transport_capabilities: seed.transport_capabilities,
      signatures: seed.signatures,
      genealogy: seed.genealogy_metadata,
      created_at: seed.created_at,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sacred-mesh-${seed.seed_name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyPublicKey = async (seed: SacredMeshSeed) => {
    try {
      await navigator.clipboard.writeText(seed.identity_key_public);
      toast({
        title: "Public key copied",
        description: "The seed's public key has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy public key to clipboard.",
        variant: "destructive",
      });
    }
  };

  const toggleTransportCapability = (capability: string) => {
    setTransportCapabilities(prev => 
      prev.includes(capability) 
        ? prev.filter(c => c !== capability)
        : [...prev, capability]
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading Sacred Mesh Seeds...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sacred Mesh Seeds</h2>
        <Badge variant="outline" className="text-primary">
          {seeds.length} Active Seeds
        </Badge>
      </div>

      {/* Create New Seed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Sacred Mesh Seed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="seedName">Seed Name</Label>
            <Input
              id="seedName"
              value={newSeedName}
              onChange={(e) => setNewSeedName(e.target.value)}
              placeholder="Enter a meaningful name for your seed"
            />
          </div>

          <div>
            <Label>Transport Capabilities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {TRANSPORT_OPTIONS.map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Switch
                    id={key}
                    checked={transportCapabilities.includes(key)}
                    onCheckedChange={() => toggleTransportCapability(key)}
                  />
                  <Label htmlFor={key} className="flex items-center gap-2 cursor-pointer">
                    <Icon className="h-4 w-4" />
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Consent Scope</Label>
            <div className="flex gap-4 mt-2">
              {(['public', 'circles', 'private'] as const).map((scope) => (
                <div key={scope} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={scope}
                    name="consentScope"
                    checked={consentScope === scope}
                    onChange={() => setConsentScope(scope)}
                  />
                  <Label htmlFor={scope} className="capitalize cursor-pointer">
                    {scope}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleCreateSeed} 
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? 'Creating...' : 'Create Sacred Mesh Seed'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Seeds */}
      <div className="grid gap-4">
        {seeds.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No Sacred Mesh seeds yet.</p>
                <p className="text-sm">Create your first seed to begin nature-inspired communications.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          seeds.map((seed) => (
            <Card key={seed.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Circle className={seed.status === 'active' ? 'h-3 w-3 fill-green-500 text-green-500' : 'h-3 w-3 fill-gray-400 text-gray-400'} />
                    {seed.seed_name}
                  </CardTitle>
                  <Badge variant={seed.status === 'active' ? 'default' : 'secondary'}>
                    {seed.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Generation {seed.genealogy_metadata.generation} • Created {new Date(seed.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Transport Capabilities */}
                <div>
                  <Label className="text-sm font-medium">Transport Capabilities</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {seed.transport_capabilities.map((capability) => {
                      const option = TRANSPORT_OPTIONS.find(opt => opt.key === capability);
                      if (!option) return null;
                      const Icon = option.icon;
                      return (
                        <Badge key={capability} variant="outline" className="flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          {option.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Sacred Signatures */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sacred Signatures</Label>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Radio className="h-3 w-3 text-blue-500" />
                      <span>Frequency:</span>
                      <code className="bg-muted px-1 rounded text-blue-600">
                        {seed.signatures.frequency}
                      </code>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-3 w-3 text-yellow-500" />
                      <span>Light:</span>
                      <code className="bg-muted px-1 rounded text-yellow-600">
                        {seed.signatures.light}
                      </code>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Leaf className="h-3 w-3 text-green-500" />
                      <span>Nature:</span>
                      <code className="bg-muted px-1 rounded text-green-600">
                        {seed.signatures.nature}
                      </code>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Atom className="h-3 w-3 text-purple-500" />
                      <span>Quantum:</span>
                      <code className="bg-muted px-1 rounded text-purple-600">
                        {seed.signatures.quantum}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyPublicKey(seed)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Copy Public Key
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportSeedIdentity(seed)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-3 w-3" />
                    Export Identity
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
