import { UnifiedActivityFeed } from '@/components/UnifiedActivityFeed';
import { SacredSocialFeed } from '@/components/SacredSocialFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Activity, MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const navigate = useNavigate();
  
  return (
    <div className="h-full overflow-y-auto">
      
      {/* Enhanced Feed Header */}
      <div className="border-b border-primary/10 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Sacred Feed
              </h1>
              <p className="text-sm text-muted-foreground">
                Unified consciousness stream across all platform dimensions
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/circles')}
                variant="outline"
                size="sm"
                className="border-primary/20 hover:border-primary/50"
              >
                <Users className="w-4 h-4 mr-2" />
                Circles
              </Button>
              <Button 
                onClick={() => navigate('/messages')}
                variant="outline"
                size="sm"
                className="border-primary/20 hover:border-primary/50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Interface */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="unified" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="unified" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Unified Stream
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Social Feed
            </TabsTrigger>
            <TabsTrigger value="circles" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Circle Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unified" className="space-y-4">
            <UnifiedActivityFeed />
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <SacredSocialFeed feedType="global" />
          </TabsContent>

          <TabsContent value="circles" className="space-y-4">
            <SacredSocialFeed feedType="circles" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Feed;