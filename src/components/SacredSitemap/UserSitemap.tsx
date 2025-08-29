import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  SACRED_ROUTES_REGISTRY, 
  SacredRouteMetadata, 
  getRoutesByCategory, 
  getTriLawScore,
  getResonanceChain 
} from '@/config/routes.sacred';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search, 
  MapPin, 
  Compass, 
  Star, 
  Navigation,
  Sparkles,
  Eye,
  Heart,
  Crown,
  Zap,
  ArrowRight
} from 'lucide-react';

interface JourneyProgress {
  visitedRoutes: string[];
  resonanceScore: number;
  consciousnessLevel: number;
  completedStages: string[];
}

export const UserSitemap: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [journeyProgress, setJourneyProgress] = useState<JourneyProgress>({
    visitedRoutes: ['/'],
    resonanceScore: 0.3,
    consciousnessLevel: 1,
    completedStages: ['entry']
  });

  // Load journey progress from localStorage (in a real app, this would come from Supabase)
  useEffect(() => {
    const saved = localStorage.getItem(`journey_progress_${user?.id}`);
    if (saved) {
      try {
        setJourneyProgress(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load journey progress:', error);
      }
    }
  }, [user?.id]);

  // Save journey progress
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`journey_progress_${user.id}`, JSON.stringify(journeyProgress));
    }
  }, [journeyProgress, user?.id]);

  // Track current route visit
  useEffect(() => {
    const currentPath = location.pathname;
    if (!journeyProgress.visitedRoutes.includes(currentPath)) {
      setJourneyProgress(prev => ({
        ...prev,
        visitedRoutes: [...prev.visitedRoutes, currentPath]
      }));
    }
  }, [location.pathname, journeyProgress.visitedRoutes]);

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

  const getAccessibleRoutes = () => {
    return SACRED_ROUTES_REGISTRY.filter(route => {
      if (route.adminOnly) return false;
      // In a real app, check user permissions here
      return true;
    });
  };

  const filteredRoutes = getAccessibleRoutes().filter(route => {
    const matchesSearch = searchTerm === '' || 
      route.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || route.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(getAccessibleRoutes().map(r => r.category))];

  const getJourneyRecommendations = (): SacredRouteMetadata[] => {
    // Simple recommendation logic based on consciousness level and resonance
    return getAccessibleRoutes()
      .filter(route => !journeyProgress.visitedRoutes.includes(route.path))
      .sort((a, b) => {
        // Prioritize routes close to user's consciousness level
        const aDiff = Math.abs(a.consciousnessLevel - journeyProgress.consciousnessLevel);
        const bDiff = Math.abs(b.consciousnessLevel - journeyProgress.consciousnessLevel);
        return aDiff - bDiff;
      })
      .slice(0, 3);
  };

  const RouteCard: React.FC<{ 
    route: SacredRouteMetadata; 
    isVisited: boolean;
    isRecommended: boolean;
  }> = ({ route, isVisited, isRecommended }) => {
    const ChakraIcon = getChakraIcon(route.chakraAlignment);
    const resonanceChain = getResonanceChain(route.path);
    const triLawScore = getTriLawScore(route);

    return (
      <Card 
        className={`transition-all duration-300 hover:scale-105 cursor-pointer border ${
          isVisited 
            ? 'border-primary/50 bg-primary/5' 
            : isRecommended 
              ? 'border-secondary/50 bg-gradient-to-br from-secondary/5 to-primary/5' 
              : 'border-border/30 hover:border-primary/30'
        }`}
        onClick={() => navigate(route.path)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="text-3xl">{route.sigil}</div>
                {isVisited && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{route.title}</CardTitle>
                  {isRecommended && (
                    <Badge variant="secondary" className="text-xs animate-pulse">
                      <Star className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <ChakraIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{route.chakraAlignment}</span>
                  <Badge variant="outline" className="text-xs">
                    Level {route.consciousnessLevel}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(route.path);
              }}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="mt-2">
            {route.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Sacred Quality Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sacred Quality</span>
            <div className="flex items-center gap-2">
              <Progress value={triLawScore * 100} className="w-20" />
              <span className="text-sm font-medium">{(triLawScore * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Journey Stage */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Journey Stage</span>
            <Badge 
              variant="outline" 
              className={`capitalize ${
                route.journeyStage === 'transcendence' 
                  ? 'bg-gradient-to-r from-primary/10 to-secondary/10' 
                  : ''
              }`}
            >
              {route.journeyStage}
            </Badge>
          </div>

          {/* Resonance Connections */}
          {resonanceChain.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Resonates with</div>
              <div className="flex gap-1 flex-wrap">
                {resonanceChain.slice(0, 3).map((chainRoute, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs bg-primary/5 hover:bg-primary/10 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(chainRoute.path);
                    }}
                  >
                    {chainRoute.sigil} {chainRoute.title}
                  </Badge>
                ))}
                {resonanceChain.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{resonanceChain.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Sacred Timing */}
          {route.sacredTiming && route.sacredTiming !== 'any' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sacred Timing</span>
              <Badge variant="outline" className="capitalize bg-amber-500/10">
                {route.sacredTiming}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const recommendations = getJourneyRecommendations();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Sacred Constellation Map
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Navigate your consciousness journey through the Sacred Shifter universe
          </p>
          
          {/* Journey Progress */}
          <Card className="max-w-md mx-auto bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Compass className="w-5 h-5" />
                Your Sacred Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Explored Paths</span>
                <span>{journeyProgress.visitedRoutes.length} / {getAccessibleRoutes().length}</span>
              </div>
              <Progress 
                value={(journeyProgress.visitedRoutes.length / getAccessibleRoutes().length) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-sm">
                <span>Consciousness Level</span>
                <Badge variant="outline">{journeyProgress.consciousnessLevel}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Location */}
        <div className="mb-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-medium">You are here:</span>
                <Badge variant="default">
                  {SACRED_ROUTES_REGISTRY.find(r => r.path === location.pathname)?.title || 'Unknown'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-secondary" />
              Recommended for Your Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((route) => (
                <RouteCard 
                  key={route.path} 
                  route={route} 
                  isVisited={journeyProgress.visitedRoutes.includes(route.path)}
                  isRecommended={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your sacred paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
            >
              All Paths
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <RouteCard 
              key={route.path} 
              route={route} 
              isVisited={journeyProgress.visitedRoutes.includes(route.path)}
              isRecommended={recommendations.some(r => r.path === route.path)}
            />
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <Card className="mt-8">
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">No paths found matching your search</div>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};