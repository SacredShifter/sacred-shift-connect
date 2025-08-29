import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Navigation, 
  Star, 
  Clock,
  Eye,
  Heart,
  Crown,
  Sparkles
} from 'lucide-react';
import { getRouteByPath, getResonanceChain } from '@/config/routes.sacred';

export const WhereAmIWidget: React.FC = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const currentRoute = getRouteByPath(location.pathname);

  if (!currentRoute) {
    return null;
  }

  const resonanceChain = getResonanceChain(currentRoute.path);

  const getChakraIcon = (chakra: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      'Crown': Crown,
      'Third Eye': Eye,
      'Throat': Sparkles,
      'Heart': Heart,
      'Solar Plexus': Star,
      'Root': Navigation
    };
    return icons[chakra] || Star;
  };

  const ChakraIcon = getChakraIcon(currentRoute.chakraAlignment);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-background/95 backdrop-blur-sm border border-primary/20 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">You are in</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-auto p-1"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{currentRoute.sigil}</span>
            <div>
              <div className="font-semibold text-sm">{currentRoute.title}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ChakraIcon className="w-3 h-3" />
                {currentRoute.chakraAlignment}
              </div>
            </div>
          </div>

          <div className="flex gap-1 mb-2">
            <Badge variant="outline" className="text-xs capitalize">
              {currentRoute.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Level {currentRoute.consciousnessLevel}
            </Badge>
          </div>

          {isExpanded && (
            <div className="space-y-3 pt-3 border-t border-border/30">
              <div className="text-xs text-muted-foreground">
                {currentRoute.description}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Journey Stage</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {currentRoute.journeyStage}
                </Badge>
              </div>

              {currentRoute.sacredTiming && currentRoute.sacredTiming !== 'any' && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Sacred Timing</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <Badge variant="outline" className="text-xs capitalize">
                      {currentRoute.sacredTiming}
                    </Badge>
                  </div>
                </div>
              )}

              {resonanceChain.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Connected to</div>
                  <div className="flex flex-wrap gap-1">
                    {resonanceChain.slice(0, 2).map((chain, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {chain.sigil} {chain.title}
                      </Badge>
                    ))}
                    {resonanceChain.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{resonanceChain.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {currentRoute.synchronicityTriggers.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Synchronicity Active</div>
                  <div className="flex flex-wrap gap-1">
                    {currentRoute.synchronicityTriggers.slice(0, 2).map((trigger, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-gradient-to-r from-primary/5 to-secondary/5">
                        {trigger.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};