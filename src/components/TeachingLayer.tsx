import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Atom, 
  Eye, 
  Sparkles, 
  Lock,
  Lightbulb,
  Heart,
  Star 
} from 'lucide-react';
import { useTeachingProgress } from '@/hooks/useTeachingProgress';

export interface TeachingContent {
  scientific: {
    title: string;
    description: string;
    prompt: string;
  };
  metaphysical: {
    title: string;
    description: string;
    prompt: string;
  };
  esoteric: {
    title: string;
    description: string;
    prompt: string;
  };
}

interface TeachingLayerProps {
  content: TeachingContent;
  moduleId: string;
  className?: string;
}

export const TeachingLayer: React.FC<TeachingLayerProps> = ({
  content,
  moduleId,
  className = ''
}) => {
  const { getUnlockedTiers, recordEngagement } = useTeachingProgress();
  const [activeTab, setActiveTab] = useState('scientific');
  
  const unlockedTiers = getUnlockedTiers();
  
  const tiers = [
    {
      id: 'scientific',
      label: 'Scientific',
      icon: <Atom className="w-4 h-4" />,
      content: content.scientific,
      unlocked: true, // Always available
      color: 'from-blue-500 to-cyan-500',
      description: 'Evidence-based understanding'
    },
    {
      id: 'metaphysical',
      label: 'Metaphysical',
      icon: <Eye className="w-4 h-4" />,
      content: content.metaphysical,
      unlocked: unlockedTiers.metaphysical,
      color: 'from-purple-500 to-violet-500',
      description: 'Energetic and consciousness perspectives'
    },
    {
      id: 'esoteric',
      label: 'Esoteric',
      icon: <Sparkles className="w-4 h-4" />,
      content: content.esoteric,
      unlocked: unlockedTiers.esoteric,
      color: 'from-amber-500 to-orange-500',
      description: 'Ancient wisdom and sacred teachings'
    }
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    recordEngagement(moduleId, value as 'scientific' | 'metaphysical' | 'esoteric');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
          {tiers.map((tier) => (
            <TabsTrigger
              key={tier.id}
              value={tier.id}
              disabled={!tier.unlocked}
              className="relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <div className="flex items-center gap-2">
                {tier.unlocked ? (
                  tier.icon
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{tier.label}</span>
              </div>
              {!tier.unlocked && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                  Locked
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {tiers.map((tier) => (
          <TabsContent key={tier.id} value={tier.id} className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`bg-gradient-to-br ${tier.color}/10 border-${tier.id === 'scientific' ? 'blue' : tier.id === 'metaphysical' ? 'purple' : 'amber'}-200/50`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${tier.color}/20`}>
                        {tier.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-sacred">{tier.content.title}</h3>
                        <p className="text-sm text-muted-foreground font-normal">
                          {tier.description}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      {tier.content.description}
                    </p>
                    
                    <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full bg-gradient-to-br ${tier.color}/30 flex-shrink-0`}>
                          {tier.id === 'scientific' ? (
                            <Lightbulb className="w-4 h-4" />
                          ) : tier.id === 'metaphysical' ? (
                            <Heart className="w-4 h-4" />
                          ) : (
                            <Star className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1 text-foreground">
                            {tier.id === 'scientific' ? 'Reflection Point' : 
                             tier.id === 'metaphysical' ? 'Contemplation' : 
                             'Sacred Inquiry'}
                          </h4>
                          <p className="text-sm text-muted-foreground italic">
                            "{tier.content.prompt}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};