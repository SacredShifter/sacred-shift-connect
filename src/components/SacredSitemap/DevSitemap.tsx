import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  SACRED_ROUTES_REGISTRY, 
  SacredRouteMetadata, 
  getRoutesByCategory, 
  getTriLawScore,
  validateRouteConsistency,
  getResonanceChain 
} from '@/config/routes.sacred';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Database, 
  Zap, 
  Shield, 
  Brain, 
  Activity,
  Network,
  Clock,
  Target
} from 'lucide-react';

export const DevSitemap: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: string[] } | null>(null);

  useEffect(() => {
    const result = validateRouteConsistency();
    setValidationResult(result);
  }, []);

  const filteredRoutes = SACRED_ROUTES_REGISTRY.filter(route => {
    const matchesSearch = searchTerm === '' || 
      route.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || route.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(SACRED_ROUTES_REGISTRY.map(r => r.category))];

  const RouteCard: React.FC<{ route: SacredRouteMetadata }> = ({ route }) => {
    const triLawScore = getTriLawScore(route);
    const resonanceChain = getResonanceChain(route.path);

    return (
      <Card className="mb-4 border border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <route.icon className="h-5 w-5 text-primary" />
              <span className="text-2xl">{route.sigil}</span>
              <CardTitle className="text-lg">{route.title}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant={route.adminOnly ? "destructive" : route.authRequired ? "secondary" : "outline"}>
                {route.adminOnly ? "Admin Only" : route.authRequired ? "Auth Required" : "Public"}
              </Badge>
              <Badge variant="outline" className="bg-primary/10">
                {route.category}
              </Badge>
            </div>
          </div>
          <CardDescription className="mt-2">
            <code className="bg-muted px-2 py-1 rounded text-sm mr-2">{route.path}</code>
            {route.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Tri-Law Scores */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-2 bg-primary/5 rounded">
              <div className="text-lg font-bold text-primary">{(triLawScore * 100).toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Overall</div>
            </div>
            <div className="text-center p-2 bg-blue-500/10 rounded">
              <div className="text-lg font-bold text-blue-600">{(route.triLawScores.truth * 100).toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Truth</div>
            </div>
            <div className="text-center p-2 bg-purple-500/10 rounded">
              <div className="text-lg font-bold text-purple-600">{(route.triLawScores.resonance * 100).toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Resonance</div>
            </div>
            <div className="text-center p-2 bg-green-500/10 rounded">
              <div className="text-lg font-bold text-green-600">{(route.triLawScores.sovereignty * 100).toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Sovereignty</div>
            </div>
          </div>

          {/* Sacred Properties */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="bg-violet-500/10">
              <Target className="w-3 h-3 mr-1" />
              {route.chakraAlignment}
            </Badge>
            <Badge variant="outline" className="bg-indigo-500/10">
              Level {route.consciousnessLevel}
            </Badge>
            <Badge variant="outline" className="bg-amber-500/10">
              {route.journeyStage}
            </Badge>
            <Badge variant="outline" className="bg-emerald-500/10">
              <Activity className="w-3 h-3 mr-1" />
              {route.performanceWeight}
            </Badge>
            {route.sacredTiming && (
              <Badge variant="outline" className="bg-cyan-500/10">
                <Clock className="w-3 h-3 mr-1" />
                {route.sacredTiming}
              </Badge>
            )}
          </div>

          {/* Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-1 font-medium mb-1">
                <Database className="w-4 h-4" />
                Supabase Tables ({route.supabaseTables.length})
              </div>
              <div className="text-muted-foreground">
                {route.supabaseTables.length > 0 ? route.supabaseTables.join(', ') : 'None'}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-1 font-medium mb-1">
                <Shield className="w-4 h-4" />
                RLS Policies ({route.rlsPolicies.length})
              </div>
              <div className="text-muted-foreground">
                {route.rlsPolicies.length > 0 ? route.rlsPolicies.join(', ') : 'None'}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-1 font-medium mb-1">
                <Zap className="w-4 h-4" />
                Edge Functions ({route.edgeFunctions.length})
              </div>
              <div className="text-muted-foreground">
                {route.edgeFunctions.length > 0 ? route.edgeFunctions.join(', ') : 'None'}
              </div>
            </div>
          </div>

          {/* Resonance Chains */}
          {resonanceChain.length > 0 && (
            <div>
              <div className="flex items-center gap-1 font-medium mb-2">
                <Network className="w-4 h-4" />
                Resonance Chain
              </div>
              <div className="flex gap-2 flex-wrap">
                {resonanceChain.map((chainRoute, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/5">
                    {chainRoute.sigil} {chainRoute.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Error Patterns */}
          {route.errorPatterns.length > 0 && (
            <div>
              <div className="flex items-center gap-1 font-medium mb-2 text-destructive">
                <AlertTriangle className="w-4 h-4" />
                Known Error Patterns
              </div>
              <div className="flex gap-2 flex-wrap">
                {route.errorPatterns.map((error, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {error}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Synchronicity Triggers */}
          {route.synchronicityTriggers.length > 0 && (
            <div>
              <div className="flex items-center gap-1 font-medium mb-2">
                <Brain className="w-4 h-4" />
                Synchronicity Triggers
              </div>
              <div className="flex gap-2 flex-wrap">
                {route.synchronicityTriggers.map((trigger, index) => (
                  <Badge key={index} variant="outline" className="bg-gradient-to-r from-primary/5 to-secondary/5 text-xs">
                    {trigger}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Sacred Cartography System
          </h1>
          <p className="text-lg text-muted-foreground">
            Development Sitemap & Route Intelligence Dashboard
          </p>
        </div>

        {/* Validation Status */}
        {validationResult && (
          <Alert className={`mb-6 ${validationResult.valid ? 'border-green-500' : 'border-destructive'}`}>
            <div className="flex items-center gap-2">
              {validationResult.valid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
              <AlertDescription>
                {validationResult.valid 
                  ? `Route registry is valid. ${SACRED_ROUTES_REGISTRY.length} routes registered.`
                  : `Route validation failed: ${validationResult.errors.join(', ')}`
                }
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Controls */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search routes, titles, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
            >
              All ({SACRED_ROUTES_REGISTRY.length})
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category} ({getRoutesByCategory(category).length})
              </Button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{SACRED_ROUTES_REGISTRY.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Tri-Law Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(SACRED_ROUTES_REGISTRY.reduce((sum, route) => sum + getTriLawScore(route), 0) / SACRED_ROUTES_REGISTRY.length * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Admin Only Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {SACRED_ROUTES_REGISTRY.filter(r => r.adminOnly).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Heavy Performance Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {SACRED_ROUTES_REGISTRY.filter(r => r.performanceWeight === 'heavy').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route) => (
              <RouteCard key={route.path} route={route} />
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="text-muted-foreground">No routes found matching your criteria</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};