/**
 * Sacred Shifter Consciousness Assessment Dashboard
 * Visualizes real-time consciousness evolution and provides guidance
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Heart, 
  Lightbulb, 
  Users, 
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Crown,
  Eye,
  MessageSquare,
  Star,
  Activity,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { useConsciousnessAssessment } from '@/hooks/useConsciousnessAssessment';
import { useAuth } from '@/hooks/useAuth';

interface ChakraVisualizationProps {
  chakras: {
    root: number;
    sacral: number;
    solar: number;
    heart: number;
    throat: number;
    thirdEye: number;
    crown: number;
  };
}

const ChakraVisualization: React.FC<ChakraVisualizationProps> = ({ chakras }) => {
  const chakraData = [
    { name: 'Root', value: chakras.root, color: 'bg-red-500', position: 'bottom-0' },
    { name: 'Sacral', value: chakras.sacral, color: 'bg-orange-500', position: 'bottom-16' },
    { name: 'Solar', value: chakras.solar, color: 'bg-yellow-500', position: 'bottom-32' },
    { name: 'Heart', value: chakras.heart, color: 'bg-green-500', position: 'bottom-48' },
    { name: 'Throat', value: chakras.throat, color: 'bg-blue-500', position: 'bottom-64' },
    { name: 'Third Eye', value: chakras.thirdEye, color: 'bg-indigo-500', position: 'bottom-80' },
    { name: 'Crown', value: chakras.crown, color: 'bg-purple-500', position: 'top-0' }
  ];

  return (
    <div className="relative h-96 w-32 mx-auto">
      {chakraData.map((chakra, index) => (
        <div key={chakra.name} className={`absolute ${chakra.position} left-1/2 transform -translate-x-1/2`}>
          <div className="text-center mb-2">
            <div className={`w-8 h-8 rounded-full ${chakra.color} mx-auto mb-1 flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">{chakra.value}</span>
            </div>
            <div className="text-xs text-muted-foreground">{chakra.name}</div>
            <Progress value={chakra.value} className="w-16 h-1 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface DimensionRadarProps {
  dimensions: {
    awareness: number;
    compassion: number;
    wisdom: number;
    unity: number;
    transcendence: number;
  };
}

const DimensionRadar: React.FC<DimensionRadarProps> = ({ dimensions }) => {
  const dimensionData = [
    { name: 'Awareness', value: dimensions.awareness, icon: Eye, color: 'text-blue-500' },
    { name: 'Compassion', value: dimensions.compassion, icon: Heart, color: 'text-pink-500' },
    { name: 'Wisdom', value: dimensions.wisdom, icon: Lightbulb, color: 'text-yellow-500' },
    { name: 'Unity', value: dimensions.unity, icon: Users, color: 'text-green-500' },
    { name: 'Transcendence', value: dimensions.transcendence, icon: Sparkles, color: 'text-purple-500' }
  ];

  return (
    <div className="space-y-4">
      {dimensionData.map((dimension) => {
        const Icon = dimension.icon;
        return (
          <div key={dimension.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${dimension.color}`} />
                <span className="text-sm font-medium">{dimension.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{dimension.value}%</span>
            </div>
            <Progress 
              value={dimension.value} 
              className="h-2"
            />
          </div>
        );
      })}
    </div>
  );
};

export const ConsciousnessAssessmentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    currentAssessment, 
    assessmentHistory, 
    isAssessing, 
    performAssessment 
  } = useConsciousnessAssessment();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!user || isAssessing) return;
    
    setIsRefreshing(true);
    try {
      await performAssessment(user.id);
    } catch (error) {
      console.error('Failed to refresh assessment:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getConsciousnessLevel = (level: number) => {
    if (level >= 90) return { name: 'Transcendent', color: 'text-purple-500', icon: Crown };
    if (level >= 75) return { name: 'Awakened', color: 'text-indigo-500', icon: Sparkles };
    if (level >= 60) return { name: 'Expanding', color: 'text-blue-500', icon: TrendingUp };
    if (level >= 40) return { name: 'Growing', color: 'text-green-500', icon: Activity };
    if (level >= 20) return { name: 'Seeking', color: 'text-yellow-500', icon: Target };
    return { name: 'Beginning', color: 'text-orange-500', icon: Star };
  };

  const getArchetypeColor = (archetype: string) => {
    const colors: { [key: string]: string } = {
      warrior: 'text-red-500',
      healer: 'text-pink-500',
      sage: 'text-blue-500',
      creator: 'text-purple-500',
      mystic: 'text-indigo-500',
      guardian: 'text-green-500'
    };
    return colors[archetype] || 'text-gray-500';
  };

  if (!currentAssessment) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Consciousness Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground mb-4">Initializing consciousness assessment...</p>
            <Button onClick={handleRefresh} disabled={isAssessing}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Begin Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const consciousnessLevel = getConsciousnessLevel(currentAssessment.overallLevel);
  const LevelIcon = consciousnessLevel.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Consciousness Assessment
            </CardTitle>
            <Button 
              onClick={handleRefresh} 
              disabled={isAssessing || isRefreshing}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Level */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <LevelIcon className={`w-6 h-6 ${consciousnessLevel.color}`} />
                <span className="text-2xl font-bold">{currentAssessment.overallLevel}%</span>
              </div>
              <p className={`text-sm font-medium ${consciousnessLevel.color}`}>
                {consciousnessLevel.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Consciousness Level</p>
            </div>

            {/* Primary Archetype */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className={`w-6 h-6 ${getArchetypeColor(currentAssessment.archetypeAlignment.primary)}`} />
                <span className="text-lg font-semibold capitalize">
                  {currentAssessment.archetypeAlignment.primary}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Primary Archetype</p>
              <Badge variant="outline" className="mt-1">
                {currentAssessment.archetypeAlignment.balance}% Balance
              </Badge>
            </div>

            {/* Sacred Geometry */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                <span className="text-lg font-semibold">
                  {currentAssessment.sacredGeometryResonance.resonance}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Sacred Resonance</p>
              <Badge variant="outline" className="mt-1">
                {currentAssessment.sacredGeometryResonance.primary.replace('-', ' ')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Assessment Tabs */}
      <Tabs defaultValue="dimensions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          <TabsTrigger value="chakras">Chakras</TabsTrigger>
          <TabsTrigger value="recommendations">Guidance</TabsTrigger>
          <TabsTrigger value="evolution">Evolution</TabsTrigger>
        </TabsList>

        <TabsContent value="dimensions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Consciousness Dimensions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DimensionRadar dimensions={currentAssessment.dimensions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chakras" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Chakra Alignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChakraVisualization chakras={currentAssessment.chakraAlignment} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Sacred Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Next Milestone</h4>
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm">{currentAssessment.nextMilestone}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    {currentAssessment.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Evolution Path
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Your Journey</h4>
                  <div className="space-y-2">
                    {currentAssessment.evolutionPath.map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5">
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {assessmentHistory.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Progress Trend</h4>
                    <div className="text-sm text-muted-foreground">
                      Your consciousness has evolved by{' '}
                      <span className="font-semibold text-primary">
                        +{currentAssessment.overallLevel - assessmentHistory[0].overallLevel}%
                      </span>{' '}
                      since your last assessment.
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
