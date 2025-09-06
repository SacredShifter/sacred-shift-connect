import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Infinity, Zap, Eye, Shield, X } from 'lucide-react';
import { getFelonyPrinciple, getFelonyPrincipleByContext } from '@/data/felonyPrincipleCodex';

interface FelonyPrincipleDisplayProps {
  context?: 'general' | 'tech' | 'communication' | 'consciousness';
  showDetails?: boolean;
  isCollapsible?: boolean;
  className?: string;
}

export const FelonyPrincipleDisplay: React.FC<FelonyPrincipleDisplayProps> = ({
  context = 'general',
  showDetails = true,
  isCollapsible = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(!isCollapsible);
  const [principle, setPrinciple] = useState(getFelonyPrincipleByContext(context));

  useEffect(() => {
    setPrinciple(getFelonyPrincipleByContext(context));
  }, [context]);

  const toggleExpanded = () => {
    if (isCollapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  const getContextIcon = (context: string) => {
    switch (context) {
      case 'tech':
        return <Zap className="h-5 w-5" />;
      case 'communication':
        return <Eye className="h-5 w-5" />;
      case 'consciousness':
        return <Shield className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getContextColor = (context: string) => {
    switch (context) {
      case 'tech':
        return 'text-blue-500';
      case 'communication':
        return 'text-green-500';
      case 'consciousness':
        return 'text-purple-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${className}`}
    >
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader 
          className={`cursor-pointer ${isCollapsible ? 'hover:bg-primary/5' : ''}`}
          onClick={toggleExpanded}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${getContextColor(context)}`}>
                {getContextIcon(context)}
              </div>
              <div>
                <CardTitle className="text-lg font-bold">
                  {principle.title}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Felony Principle
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Core Law
                  </Badge>
                </div>
              </div>
            </div>
            {isCollapsible && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <X className="h-4 w-4" />
                </motion.div>
              </Button>
            )}
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-4">
                {/* Core Principle */}
                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-lg font-medium text-foreground leading-relaxed">
                    "{principle.principle}"
                  </div>
                </div>

                {showDetails && (
                  <>
                    {/* Description */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">Description</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {principle.description}
                      </p>
                    </div>

                    {/* Technical Implementation */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">Technical Implementation</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {principle.technicalImplementation}
                      </p>
                    </div>

                    {/* Metaphysical Interpretation */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">Metaphysical Interpretation</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {principle.metaphysicalInterpretation}
                      </p>
                    </div>

                    {/* Resonance Properties */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/10">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">Resonance Properties</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Frequency:</span>
                            <span className="font-mono">{principle.resonanceFrequency}Hz</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Geometry:</span>
                            <span className="font-mono">{principle.sacredGeometry}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Trigger:</span>
                            <span className="font-mono">{principle.biometricTrigger}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">Visual Properties</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Aura Color:</span>
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: principle.auraColor }}
                            />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Weight:</span>
                            <span className="font-mono">{principle.weight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Core Law:</span>
                            <span className="font-mono">{principle.isCoreLaw ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Void → Breath → Word → Form Flow */}
                <div className="pt-4 border-t border-primary/10">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3">Creation Flow</h4>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-black rounded-full" />
                      <span className="text-muted-foreground">Void</span>
                    </div>
                    <Infinity className="h-4 w-4 text-primary" />
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-muted-foreground">Breath</span>
                    </div>
                    <Infinity className="h-4 w-4 text-primary" />
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-muted-foreground">Word</span>
                    </div>
                    <Infinity className="h-4 w-4 text-primary" />
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span className="text-muted-foreground">Form</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
