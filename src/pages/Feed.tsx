import { UnifiedActivityFeed } from '@/components/UnifiedActivityFeed';

const Feed = () => {
  return (
    <div className="h-full overflow-y-auto">
      
      {/* Unified Activity Feed */}
      <div className="border-b border-primary/10 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Sacred Feed
              </h1>
              <p className="text-sm text-muted-foreground">
                All platform activity in one unified consciousness stream
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Activity Stream */}
      <div className="max-w-4xl mx-auto p-4">
        <UnifiedActivityFeed />
      </div>
    </div>
  );
};

export default Feed;