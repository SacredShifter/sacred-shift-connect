import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Info, 
  Heart, 
  Lightbulb, 
  Play, 
  X,
  CheckCircle2,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { TeachingLayer } from '@/components/TeachingLayer';
import { meditationTeachings } from '@/data/meditationTeachings';
import { TeachingProgressIndicator } from '@/components/TeachingProgressIndicator';

interface MeditationPractice {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  instructions: string[];
  color: string;
}

interface MeditationPracticeGuideProps {
  practices: MeditationPractice[];
  onSelectPractice: (practiceId: string) => void;
  className?: string;
}

export const MeditationPracticeGuide: React.FC<MeditationPracticeGuideProps> = ({
  practices,
  onSelectPractice,
  className = ''
}) => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [expandedPractice, setExpandedPractice] = useState<string>('');
  const [showTeachings, setShowTeachings] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log('🔍 MeditationPracticeGuide - Checking if user has seen guide before');
    console.log('👤 User ID:', user?.id);
    
    // Check if user has seen the guide before
    const hasSeenGuide = localStorage.getItem(`meditation-guide-seen-${user?.id}`);
    console.log('💾 Has seen guide before:', hasSeenGuide);
    
    if (!hasSeenGuide) {
      console.log('🆕 First time user - showing guide');
      setIsVisible(true);
    } else {
      console.log('👀 Returning user - guide hidden');
      setIsVisible(false);
    }
  }, [user?.id]);

  const handleClose = () => {
    console.log('🚫 CLOSING MEDITATION GUIDE - User clicked close button');
    if (user?.id) {
      localStorage.setItem(`meditation-guide-seen-${user.id}`, 'true');
      console.log('✅ Saved guide preference to localStorage');
    }
    setIsVisible(false);
  };

  const toggleGuide = () => {
    setIsVisible(!isVisible);
  };

  const handleStartPractice = (practiceId: string) => {
    onSelectPractice(practiceId);
    handleClose();
  };

  const toggleTeachings = (practiceId: string) => {
    setShowTeachings(prev => ({
      ...prev,
      [practiceId]: !prev[practiceId]
    }));
  };

  if (!isVisible) {
    return (
      <Button
        onClick={toggleGuide}
        variant="default"
        size="lg"
        className="fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg animate-pulse"
      >
        <Info className="w-5 h-5 mr-2" />
        View Practice Guide
      </Button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed inset-4 z-50 overflow-hidden ${className}`}
      >
        <Card className="h-full bg-background/95 backdrop-blur-md border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-xl font-sacred">
                  <Heart className="w-5 h-5 text-primary" />
                  Sacred Practice Guide
                </CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Discover the transformative power of each meditation practice
                </p>
              </div>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleClose}
                className="bg-destructive/20 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground min-w-[100px] font-semibold"
              >
                <X className="w-5 h-5 mr-2" />
                CLOSE
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="h-[calc(100%-5rem)] p-0">
            <ScrollArea className="h-full px-6">
              {/* Teaching Progress Indicator */}
              <div className="mb-6 mt-6">
                <TeachingProgressIndicator />
              </div>
              
              <div className="space-y-4 pb-6">
                {practices.map((practice, index) => (
                  <motion.div
                    key={practice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Collapsible
                      open={expandedPractice === practice.id}
                      onOpenChange={(open) => setExpandedPractice(open ? practice.id : '')}
                    >
                      <Card className="bg-card/40 backdrop-blur-sm border border-primary/20 rounded-xl overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full px-6 py-4 h-auto hover:bg-primary/5 rounded-none"
                          >
                            <div className="flex items-center gap-4 w-full">
                              <div className={`p-2 rounded-lg bg-gradient-to-br ${practice.color}/20`}>
                                {practice.icon}
                              </div>
                              <div className="text-left flex-1">
                                <h3 className="font-sacred font-semibold text-lg">{practice.name}</h3>
                                <p className="text-muted-foreground text-sm">{practice.description}</p>
                              </div>
                              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                            </div>
                          </Button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="px-6 pb-6">
                          <div className="space-y-6 pt-4">
                            {/* Benefits Section */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-purpose" />
                                <h4 className="font-semibold text-purpose">Why This Matters</h4>
                              </div>
                              <ul className="space-y-2">
                                {practice.benefits.map((benefit, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-alignment mt-0.5 flex-shrink-0" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Instructions Section */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Play className="w-4 h-4 text-resonance" />
                                <h4 className="font-semibold text-resonance">How to Practice</h4>
                              </div>
                              <ol className="space-y-2">
                                {practice.instructions.map((instruction, idx) => (
                                  <li key={idx} className="flex items-start gap-3 text-sm">
                                    <span className="bg-resonance/20 text-resonance rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                                      {idx + 1}
                                    </span>
                                    <span>{instruction}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* Deeper Knowledge Toggle */}
                            <div className="pt-4 border-t border-border/50">
                              <Button
                                onClick={() => toggleTeachings(practice.id)}
                                variant="outline"
                                className="w-full mb-3 bg-muted/50 hover:bg-muted"
                              >
                                <BookOpen className="w-4 h-4 mr-2" />
                                {showTeachings[practice.id] ? 'Hide' : 'Show'} Deeper Knowledge
                              </Button>
                              
                              {/* Teaching Layer */}
                              {showTeachings[practice.id] && meditationTeachings[practice.id] && (
                                <div className="mb-4">
                                  <TeachingLayer
                                    content={meditationTeachings[practice.id]}
                                    moduleId={`meditation-${practice.id}`}
                                  />
                                </div>
                              )}

                              {/* Start Practice Button */}
                              <Button
                                onClick={() => handleStartPractice(practice.id)}
                                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Begin {practice.name}
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};