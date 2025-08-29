import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart, Sparkles, Crown, TreePine, Star } from 'lucide-react';
import { ProfileFormData } from '../ProfileSetupFlow';

interface CommunityStepProps {
  data: ProfileFormData;
  onChange: (data: Partial<ProfileFormData>) => void;
}

// Mock circles data - in real implementation, this would come from the database
const availableCircles = [
  {
    id: 'healing-circle',
    name: 'Sacred Healing Circle',
    description: 'Collective healing practices and energy work',
    icon: Heart,
    members: 247,
    resonance: ['Healing', 'Light Worker', 'Empath']
  },
  {
    id: 'wisdom-keepers',
    name: 'Wisdom Keepers',
    description: 'Ancient wisdom and spiritual teachings',
    icon: Crown,
    members: 189,
    resonance: ['Wisdom', 'Teacher', 'Mystic']
  },
  {
    id: 'nature-spirits',
    name: 'Nature Spirits',
    description: 'Earth connection and nature-based spirituality',
    icon: TreePine,
    members: 324,
    resonance: ['Nature', 'Guardian', 'Earth']
  },
  {
    id: 'cosmic-navigators',
    name: 'Cosmic Navigators',
    description: 'Astrology, cosmic consciousness and star wisdom',
    icon: Star,
    members: 156,
    resonance: ['Consciousness', 'Seeker', 'Universe']
  },
  {
    id: 'creative-alchemists',
    name: 'Creative Alchemists',
    description: 'Sacred creativity and artistic expression',
    icon: Sparkles,
    members: 278,
    resonance: ['Creativity', 'Artist', 'Transformation']
  }
];

export const CommunityStep: React.FC<CommunityStepProps> = ({ data, onChange }) => {
  const toggleCircle = (circleId: string) => {
    const currentCircles = data.circles_joined || [];
    const isJoined = currentCircles.includes(circleId);
    
    if (isJoined) {
      onChange({
        circles_joined: currentCircles.filter(id => id !== circleId)
      });
    } else {
      onChange({
        circles_joined: [...currentCircles, circleId]
      });
    }
  };

  const getResonanceMatch = (circleResonance: string[]) => {
    if (!data.resonance_tags.length) return 0;
    const matches = circleResonance.filter(tag => 
      data.resonance_tags.some(userTag => 
        userTag.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(userTag.toLowerCase())
      )
    );
    return Math.round((matches.length / circleResonance.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="w-12 h-12 text-primary mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Sacred Circles</h3>
        <p className="text-sm text-muted-foreground">
          Join circles that resonate with your spiritual path and connect with like-minded souls.
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Available Sacred Circles</Label>
        
        <div className="space-y-3">
          {availableCircles.map((circle) => {
            const IconComponent = circle.icon;
            const isJoined = data.circles_joined.includes(circle.id);
            const resonanceMatch = getResonanceMatch(circle.resonance);

            return (
              <Card 
                key={circle.id} 
                className={`cursor-pointer transition-all duration-200 ${
                  isJoined 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => toggleCircle(circle.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{circle.name}</h4>
                          {resonanceMatch > 0 && (
                            <div className="flex items-center gap-1 text-xs text-primary">
                              <Sparkles className="w-3 h-3" />
                              {resonanceMatch}% match
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {circle.description}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {circle.members} members
                          </span>
                          
                          <div className="flex items-center gap-1">
                            <span>Resonance:</span>
                            <div className="flex gap-1">
                              {circle.resonance.slice(0, 2).map((tag) => (
                                <span 
                                  key={tag}
                                  className={`px-1.5 py-0.5 rounded text-xs ${
                                    data.resonance_tags.some(userTag => 
                                      userTag.toLowerCase().includes(tag.toLowerCase()) ||
                                      tag.toLowerCase().includes(userTag.toLowerCase())
                                    )
                                      ? 'bg-primary/20 text-primary'
                                      : 'bg-muted'
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                              {circle.resonance.length > 2 && (
                                <span className="text-xs">+{circle.resonance.length - 2}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant={isJoined ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCircle(circle.id);
                      }}
                    >
                      {isJoined ? 'Joined' : 'Join'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {data.circles_joined.length > 0 && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              You've joined {data.circles_joined.length} sacred circle{data.circles_joined.length !== 1 ? 's' : ''}. 
              You can always modify your circles later in your profile.
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Don't worry if you're unsure - you can explore and join circles anytime after setup.
          </p>
        </div>
      </div>
    </div>
  );
};