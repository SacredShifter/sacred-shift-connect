import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Users, Lock, Globe, Filter, TrendingUp, Clock, Star, Calendar, Heart, Sparkles, User, Zap, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { CreateCircleModal } from '@/components/CreateCircleModal';
import { SacredCircleInterface } from '@/components/SacredCircleInterface';
import { TransformedSacredCircleInterface } from '@/components/SacredCircle/TransformedSacredCircleInterface';
import { SacredSocialFeed } from '@/components/SacredSocialFeed';
import { SacredProfile } from '@/components/SacredProfile';
import { SacredEvents } from '@/components/SacredEvents';
import { useToast } from '@/hooks/use-toast';
import { Slogan } from '@/components/ui/Slogan';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';

interface FilterOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const filterOptions: FilterOption[] = [
  { id: 'all', label: 'All Circles', icon: Globe },
  { id: 'joined', label: 'My Circles', icon: Users },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'recent', label: 'Recently Created', icon: Clock },
  { id: 'featured', label: 'Featured', icon: Star },
];

const Circles = () => {
  const { user } = useAuth();
  const { circles, loading, error, joinCircle, leaveCircle } = useSacredCircles();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [isCircleMaximized, setIsCircleMaximized] = useState(false);
  const [isCircleMinimized, setIsCircleMinimized] = useState(false);
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);

  // Get joined circle IDs from the actual circles data
  const joinedCircleIds = new Set(
    circles?.filter(circle => circle.is_member).map(circle => circle.id) || []
  );

  // Filter circles based on search and filter options
  const filteredCircles = circles?.filter(circle => {
    const matchesSearch = circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         circle.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (activeFilter) {
      case 'joined':
        return joinedCircleIds.has(circle.id);
      case 'trending':
        return (circle.member_count || 0) > 10; // Simple trending logic
      case 'recent':
        return new Date(circle.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000; // Last 7 days
      case 'featured':
        return (circle.member_count || 0) > 50; // Simple featured logic
      default:
        return true;
    }
  }) || [];

  const handleJoinLeave = async (circleId: string) => {
    try {
      if (joinedCircleIds.has(circleId)) {
        await leaveCircle(circleId);
        toast({
          title: "Left Sacred Circle",
          description: "You have successfully left the circle.",
        });
      } else {
        await joinCircle(circleId);
        toast({
          title: "Joined Sacred Circle",
          description: "Welcome to the circle! You can now participate in discussions.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update circle membership",
        variant: "destructive",
      });
    }
  };

  const getChakraColor = (chakra?: string) => {
    const chakraColors: Record<string, string> = {
      'root': 'hsl(0, 84%, 60%)',
      'sacral': 'hsl(24, 100%, 50%)',
      'solar-plexus': 'hsl(60, 100%, 50%)',
      'heart': 'hsl(120, 100%, 50%)',
      'throat': 'hsl(200, 100%, 50%)',
      'third-eye': 'hsl(240, 100%, 70%)',
      'crown': 'hsl(300, 100%, 80%)',
    };
    return chakraColors[chakra?.toLowerCase() || ''] || 'hsl(var(--primary))';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-destructive">
          Error loading circles: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      
      {/* Sacred Circles Header */}
      <div className="border-b border-primary/10 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Sacred Circles
              </h1>
              <p className="text-sm text-muted-foreground">
                Deep community engagement and consciousness evolution
              </p>
            </div>
            
            <Button 
              onClick={() => setCreateModalOpen(true)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Circle
            </Button>
          </div>
        </div>
      </div>

      {/* Main Circles Content */}
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search sacred circles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-primary/20 focus:border-primary"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {filterOptions.map((option) => {
              const IconComponent = option.icon;
              const isActive = activeFilter === option.id;
              return (
                <Button
                  key={option.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(option.id)}
                  className={`whitespace-nowrap ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'border-primary/20 hover:border-primary/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-muted-foreground">
          {filteredCircles.length} circle{filteredCircles.length !== 1 ? 's' : ''} found
        </div>

        {/* Circles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCircles.map((circle) => {
            const isJoined = joinedCircleIds.has(circle.id);
            const isPrivate = circle.is_private;
            
            return (
              <Card key={circle.id} className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {isPrivate ? (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Globe className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {isPrivate ? 'Private' : 'Public'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{circle.member_count || 0}</span>
                    </div>
                  </div>
                  
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {circle.name}
                    </CardTitle>
                    {circle.description && (
                      <CardDescription className="mt-2 line-clamp-2">
                        {circle.description}
                      </CardDescription>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Chakra Focus Badge */}
                  {circle.chakra_focus && (
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        borderColor: getChakraColor(circle.chakra_focus),
                        color: getChakraColor(circle.chakra_focus)
                      }}
                    >
                      🧘 {circle.chakra_focus}
                    </Badge>
                  )}

                  {/* Frequency Range */}
                  {circle.frequency_range && (
                    <Badge variant="secondary" className="text-xs">
                      🎵 {circle.frequency_range}
                    </Badge>
                  )}
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button
                    variant={isJoined ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleJoinLeave(circle.id)}
                    className={`flex-1 ${
                      isJoined 
                        ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground' 
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    {isJoined ? 'Leave' : 'Join'} Circle
                  </Button>
                  
                  {isJoined && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCircle(circle.id)}
                      className="border-primary/20 hover:border-primary/50"
                    >
                      Enter Sacred Circle
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCircles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No circles found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || activeFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a Sacred Circle!'
              }
            </p>
            {(!searchTerm && activeFilter === 'all') && (
              <Button 
                onClick={() => setCreateModalOpen(true)}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Circle
              </Button>
            )}
          </div>
        )}

        {/* Create Circle Modal */}
        <CreateCircleModal 
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
        />

        {/* Deeper Knowledge Section */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => setShowDeeperKnowledge(!showDeeperKnowledge)}
            className="gap-2"
          >
            <BookOpen className="w-4 h-4" />
            {showDeeperKnowledge ? 'Hide' : 'Show'} Deeper Knowledge
            {showDeeperKnowledge ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {/* Teaching Layer */}
        {showDeeperKnowledge && (
          <div className="mt-6">
            <TeachingLayer
              content={ALL_MODULE_TEACHINGS.circles}
              moduleId="circles"
            />
          </div>
        )}
      </div>

      {/* Full-Screen Sacred Circle Interface */}
      {selectedCircle && (
        <div className="fixed inset-0 bg-background z-50">
          <TransformedSacredCircleInterface 
            circleId={selectedCircle}
            circleName={circles?.find(c => c.id === selectedCircle)?.name || 'Sacred Circle'}
            onClose={() => setSelectedCircle(null)}
            className="h-full w-full"
          />
        </div>
      )}
    </div>
  );
};

export default Circles;