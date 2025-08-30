import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRoutineTemplates } from '@/hooks/useRoutineTemplates';
import { useCreateUserRoutine } from '@/hooks/useUserRoutine';
import { SacredGeometry3D } from '@/components/SacredGeometry3D';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Eye, Zap, Users, Crown } from 'lucide-react';

const CATEGORY_ICONS = {
  'healing': Heart,
  'awakening': Eye,
  'balance': Sparkles,
  'collective': Users,
  'advanced': Crown,
  'starter': Zap
};

const ARCHETYPE_DESCRIPTIONS = {
  'The Wounded Healer': 'From shadow into light, through courage and compassion.',
  'The Seeker': 'Piercing veils of illusion to touch the truth beneath.',
  'The Grounded One': 'Finding center in chaos, stability in flow.',
  'The Council': 'Weaving individual threads into collective resonance.',
  'The Master Builder': 'Embodying the full mandala of awakened consciousness.',
  'The Pilgrim': 'Taking the first sacred steps on the pathless path.'
};

export const RoutineTemplateSelector: React.FC<{
  onSelect: (templateId: string) => void;
  onClose: () => void;
}> = ({ onSelect, onClose }) => {
  const { data: templates, isLoading } = useRoutineTemplates();
  const createRoutine = useCreateUserRoutine();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSelect = async (templateId: string) => {
    if (selectedTemplate === templateId && !isConfirming) {
      setIsConfirming(true);
      return;
    }
    
    if (isConfirming && selectedTemplate === templateId) {
      try {
        await createRoutine.mutateAsync({ templateId });
        onSelect(templateId);
        onClose();
      } catch (error) {
        console.error('Failed to create routine:', error);
      }
    } else {
      setSelectedTemplate(templateId);
      setIsConfirming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="sacred-glow animate-pulse">
          <Sparkles className="h-8 w-8 text-resonance" />
        </div>
      </div>
    );
  }

  const categorizedTemplates = templates?.reduce((acc, template) => {
    if (!acc[template.category]) acc[template.category] = [];
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof templates>) || {};

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-sacred text-3xl text-truth">Choose Your Sacred Path</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Each routine is a living mandala, a pathway of initiation into deeper resonance. 
          Select the archetype that calls to your current journey.
        </p>
      </div>

      {Object.entries(categorizedTemplates).map(([category, categoryTemplates]) => {
        const IconComponent = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || Sparkles;
        
        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-3 px-4">
              <IconComponent className="h-5 w-5 text-resonance" />
              <h3 className="font-sacred text-xl capitalize text-truth">
                {category === 'starter' ? 'Sacred Beginnings' : 
                 category === 'healing' ? 'Healing & Truth' :
                 category === 'awakening' ? 'Expansion & Awakening' :
                 category === 'balance' ? 'Everyday Balance' :
                 category === 'collective' ? 'Sacred Collective' :
                 category === 'advanced' ? 'Advanced Mastery' : category}
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  layout
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`sacred-card cursor-pointer transition-all duration-500 relative overflow-hidden group ${
                      selectedTemplate === template.id ? 'ring-2 ring-resonance shadow-[0_0_30px_hsl(var(--resonance)/0.5)]' : ''
                    }`}
                    onClick={() => handleSelect(template.id)}
                  >
                    {/* Sacred Geometry Background */}
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                      <SacredGeometry3D
                        type={template.sacred_geometry as any}
                        color={template.color_primary}
                        animate={selectedTemplate === template.id}
                      />
                    </div>
                    
                    <CardHeader className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant="secondary"
                          className="text-xs font-sacred"
                        >
                          {template.archetype}
                        </Badge>
                        {template.unlock_requirements?.level > 1 && (
                          <Crown className="h-4 w-4 text-purpose opacity-60" />
                        )}
                      </div>
                      
                      <CardTitle className="font-sacred text-truth group-hover:text-resonance transition-colors">
                        {template.name}
                      </CardTitle>
                      
                      <p className="text-sm text-muted-foreground font-codex italic">
                        {ARCHETYPE_DESCRIPTIONS[template.archetype as keyof typeof ARCHETYPE_DESCRIPTIONS] || 
                         'A sacred path of transformation and growth.'}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 space-y-4">
                      <p className="text-sm text-foreground/80">
                        {template.description}
                      </p>
                      
                      {/* Sequence Preview */}
                      <div className="flex flex-wrap gap-2">
                        {template.sequence_data?.modules?.map((module: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {module}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Action Button */}
                      <AnimatePresence>
                        {selectedTemplate === template.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Button
                              className={`w-full sacred-button ${
                                isConfirming ? 'animate-pulse' : ''
                              }`}
                              disabled={createRoutine.isPending}
                            >
                              {isConfirming ? (
                                createRoutine.isPending ? 'Initiating...' : 'Confirm Sacred Choice'
                              ) : 'Select This Path'}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};