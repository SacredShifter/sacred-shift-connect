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
  Star,
  Infinity,
  Waves,
  Crown
} from 'lucide-react';
import { useTeachingProgress } from '@/hooks/useTeachingProgress';
import { SacredResonanceIndicator } from '@/components/SacredResonanceIndicator';
import { WisdomPathways } from '@/components/WisdomPathways';
import { InitiationProgressTracker } from '@/components/InitiationProgressTracker';

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
  const { getUnlockedTiers, recordEngagement, getInitiationStage } = useTeachingProgress();
  const [activeTab, setActiveTab] = useState('scientific');
  const [showSacredIntegration, setShowSacredIntegration] = useState(false);
  
  const unlockedTiers = getUnlockedTiers();
  const initiationStage = getInitiationStage();
  
  const tiers = [
    {
      id: 'scientific',
      label: 'Scientific',
      icon: <Atom className="w-4 h-4" />,
      content: content.scientific,
      unlocked: true, // Always available
      color: 'from-blue-500 to-cyan-500',
      description: 'Evidence-based understanding',
      sacredName: 'The Foundation of Truth'
    },
    {
      id: 'metaphysical',
      label: 'Metaphysical',
      icon: <Eye className="w-4 h-4" />,
      content: content.metaphysical,
      unlocked: unlockedTiers.metaphysical,
      color: 'from-purple-500 to-violet-500',
      description: 'Energetic and consciousness perspectives',
      sacredName: 'The Realm of Experience'
    },
    {
      id: 'esoteric',
      label: 'Esoteric',
      icon: <Sparkles className="w-4 h-4" />,
      content: content.esoteric,
      unlocked: unlockedTiers.esoteric,
      color: 'from-amber-500 to-orange-500',
      description: 'Ancient wisdom and sacred teachings',
      sacredName: 'The Hidden Mysteries'
    }
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    recordEngagement(moduleId, value as 'scientific' | 'metaphysical' | 'esoteric');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Sacred Integration Toggle */}
      <div className="text-center">
        <Button
          onClick={() => setShowSacredIntegration(!showSacredIntegration)}
          variant="outline"
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3 px-6 text-lg gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
        >
          <Infinity className="w-5 h-5" />
          {showSacredIntegration ? 'Hide' : 'Show'} Sacred Integration
          <Crown className="w-5 h-5" />
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Experience the full resonance field and wisdom connections
        </p>
      </div>

      {/* Sacred Integration Components */}
      <AnimatePresence>
        {showSacredIntegration && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <SacredResonanceIndicator />
              <InitiationProgressTracker />
            </div>
            <WisdomPathways currentModule={moduleId} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Teaching Content */}
      <div className="space-y-4">
        {/* Initiation Stage Header */}
        <Card className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border-violet-200/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="font-sacred text-lg text-violet-300">
                    {initiationStage.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {initiationStage.title}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-violet-500/10 text-violet-300 border-violet-400/30">
                Stage {initiationStage.level}
              </Badge>
            </div>
          </CardContent>
        </Card>

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
                    <div className="relative">
                      {tier.icon}
                      {tier.id === activeTab && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-indigo-500/30 rounded-full blur-sm"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                          }}
                           transition={{
                             duration: 2,
                             repeat: 9999,
                             ease: "easeInOut"
                           }}
                        />
                      )}
                    </div>
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <div className="text-left">
                    <span className="hidden sm:inline text-sm font-medium">{tier.label}</span>
                    <p className="hidden lg:block text-xs text-muted-foreground">
                      {tier.sacredName}
                    </p>
                  </div>
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
                <Card className={`bg-gradient-to-br ${tier.color}/10 border-${tier.id === 'scientific' ? 'blue' : tier.id === 'metaphysical' ? 'purple' : 'amber'}-200/50 backdrop-blur-sm`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${tier.color}/20 relative`}>
                        {tier.icon}
                        <motion.div
                          className="absolute inset-0 rounded-lg"
                          animate={{
                            boxShadow: [
                              `0 0 0px ${tier.color.includes('blue') ? 'rgba(59, 130, 246, 0)' : tier.color.includes('purple') ? 'rgba(147, 51, 234, 0)' : 'rgba(245, 158, 11, 0)'}`,
                              `0 0 20px ${tier.color.includes('blue') ? 'rgba(59, 130, 246, 0.3)' : tier.color.includes('purple') ? 'rgba(147, 51, 234, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                              `0 0 0px ${tier.color.includes('blue') ? 'rgba(59, 130, 246, 0)' : tier.color.includes('purple') ? 'rgba(147, 51, 234, 0)' : 'rgba(245, 158, 11, 0)'}`
                            ]
                          }}
                          transition={{ duration: 3, repeat: 9999 }}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-sacred flex items-center gap-2">
                          {tier.content.title}
                          <Waves className="w-4 h-4 text-muted-foreground" />
                        </h3>
                        <p className="text-sm text-muted-foreground font-normal">
                          {tier.sacredName} • {tier.description}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/30">
                      <p className="text-foreground leading-relaxed">
                        {tier.content.description}
                      </p>
                    </div>
                    
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
                            {tier.id === 'scientific' ? 'Sacred Inquiry' : 
                             tier.id === 'metaphysical' ? 'Soul Contemplation' : 
                             'Divine Reflection'}
                          </h4>
                          <p className="text-sm text-muted-foreground italic mb-3">
                            "{tier.content.prompt}"
                          </p>
                          <div className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-lg p-2 border border-violet-400/20">
                            <p className="text-xs text-violet-200 text-center">
                              Allow this question to resonate within your consciousness field
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sacred Integration Note */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-center p-3 bg-gradient-to-r from-gold-500/10 to-amber-500/10 rounded-lg border border-gold-400/20"
                    >
                      <Infinity className="w-4 h-4 mx-auto mb-1 text-gold-400" />
                      <p className="text-xs text-gold-200">
                        This teaching integrates with all other Sacred Shifter modules, creating fractal patterns of wisdom across your entire journey.
                      </p>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        ))}
        </Tabs>
      </div>
    </div>
  );
};