import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, X, Plus } from 'lucide-react';
import { ProfileFormData } from '../ProfileSetupFlow';

interface ResonanceStepProps {
  data: ProfileFormData;
  onChange: (data: Partial<ProfileFormData>) => void;
}

const suggestedTags = [
  'Love', 'Peace', 'Wisdom', 'Healing', 'Transformation', 
  'Consciousness', 'Unity', 'Balance', 'Creativity', 'Nature',
  'Sacred Geometry', 'Meditation', 'Dreams', 'Intuition', 'Magic',
  'Light Worker', 'Empath', 'Mystic', 'Healer', 'Teacher',
  'Artist', 'Seeker', 'Guardian', 'Wayshower', 'Bridge Builder'
];

const auraSignatures = [
  'Golden Light', 'Violet Flame', 'Crystalline Rainbow', 'Emerald Heart',
  'Sapphire Truth', 'Rose Gold Compassion', 'Silver Moon', 'Copper Earth',
  'Diamond Clarity', 'Indigo Wisdom', 'Coral Creation', 'Jade Harmony',
  'Amber Protection', 'Pearl Purity', 'Obsidian Depth', 'Opal Mystery'
];

export const ResonanceStep: React.FC<ResonanceStepProps> = ({ data, onChange }) => {
  const [newTag, setNewTag] = useState('');

  const addResonanceTag = (tag: string) => {
    if (tag && !data.resonance_tags.includes(tag)) {
      onChange({ 
        resonance_tags: [...data.resonance_tags, tag] 
      });
      setNewTag('');
    }
  };

  const removeResonanceTag = (tagToRemove: string) => {
    onChange({ 
      resonance_tags: data.resonance_tags.filter(tag => tag !== tagToRemove) 
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addResonanceTag(newTag.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Your Resonance Signature</h3>
        <p className="text-sm text-muted-foreground">
          Define your energetic frequency and spiritual essence to attract aligned experiences.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="soul_identity" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Soul Identity
          </Label>
          <Input
            id="soul_identity"
            value={data.soul_identity}
            onChange={(e) => onChange({ soul_identity: e.target.value })}
            placeholder="e.g., Light Weaver, Sacred Guardian, Bridge Builder..."
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            A phrase that captures your spiritual essence and purpose
          </p>
        </div>

        <div>
          <Label className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Resonance Tags
          </Label>
          <p className="text-xs text-muted-foreground mb-3">
            Keywords that represent your energy and interests. These help align synchronicity events.
          </p>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a resonance tag..."
                className="flex-1"
              />
              <Button 
                type="button"
                onClick={() => addResonanceTag(newTag.trim())}
                disabled={!newTag.trim()}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {data.resonance_tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Your Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {data.resonance_tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                        onClick={() => removeResonanceTag(tag)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">Suggested Tags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags
                  .filter(tag => !data.resonance_tags.includes(tag))
                  .slice(0, 12)
                  .map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addResonanceTag(tag)}
                      className="h-auto py-1 px-2 text-xs"
                    >
                      + {tag}
                    </Button>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="aura_signature" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Aura Signature
          </Label>
          <div className="mt-1 space-y-3">
            <Input
              id="aura_signature"
              value={data.aura_signature}
              onChange={(e) => onChange({ aura_signature: e.target.value })}
              placeholder="e.g., Golden Light, Violet Flame, Crystalline Rainbow..."
            />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Preset Signatures:</p>
              <div className="grid grid-cols-2 gap-2">
                {auraSignatures.slice(0, 8).map((signature) => (
                  <Button
                    key={signature}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onChange({ aura_signature: signature })}
                    className={`h-auto py-2 text-xs justify-start ${
                      data.aura_signature === signature ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    {signature}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Your unique energetic signature that influences your field presence
          </p>
        </div>
      </div>
    </div>
  );
};