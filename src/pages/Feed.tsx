import { SacredSocialFeed } from '@/components/SacredSocialFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Rss, Users, Calendar } from 'lucide-react';
import Messages from './Messages';
import { SacredEvents } from '@/components/SacredEvents';
import { Slogan } from '@/components/ui/Slogan';

const Feed = () => {
  return (
    <div className="h-full overflow-y-auto">
      <Slogan variant="watermark" />
      
      {/* Unified Sacred Social Platform */}
      <Tabs defaultValue="feed" className="h-full">
        <div className="border-b border-primary/10 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-6">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Feed
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Consciousness-Powered Communication Hub
                  </p>
                </div>
                
                <TabsList className="bg-background/50 border border-primary/20">
                  <TabsTrigger value="feed" className="flex items-center space-x-2">
                    <Rss className="w-4 h-4" />
                    <span>Feed</span>
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Messages</span>
                  </TabsTrigger>
                  <TabsTrigger value="circles" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Circles</span>
                  </TabsTrigger>
                  <TabsTrigger value="events" className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Events</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>
        </div>

        {/* Sacred Social Feed */}
        <TabsContent value="feed" className="mt-0">
          <div className="max-w-4xl mx-auto p-4">
            <SacredSocialFeed feedType="global" />
          </div>
        </TabsContent>

        {/* Integrated Messages */}
        <TabsContent value="messages" className="mt-0">
          <Messages />
        </TabsContent>

        {/* Quick Circles Access */}
        <TabsContent value="circles" className="mt-0">
          <div className="max-w-6xl mx-auto p-4">
            <SacredSocialFeed feedType="circles" />
          </div>
        </TabsContent>

        {/* Sacred Events */}
        <TabsContent value="events" className="mt-0">
          <div className="max-w-6xl mx-auto p-4">
            <SacredEvents />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Feed;