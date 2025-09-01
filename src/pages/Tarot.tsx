import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, LayoutGrid, Eye, Sunrise } from 'lucide-react';
import { TarotDeckBrowser } from '@/modules/tarot/components/TarotDeckBrowser';
import { TarotStudyMode } from '@/modules/tarot/components/TarotStudyMode';
import { TarotDailyPull } from '@/modules/tarot/components/TarotDailyPull';

export default function TarotPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Tarot Learning Module
        </h1>
        <p className="text-muted-foreground mt-2">
          A resonance learning system aligned with the "As Above, So Below" principle.
        </p>
      </div>

      <Tabs defaultValue="browser" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="browser" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Deck Browser
          </TabsTrigger>
          <TabsTrigger value="study" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Study Mode
          </TabsTrigger>
          <TabsTrigger value="pull" className="flex items-center gap-2">
            <Sunrise className="h-4 w-4" />
            Daily Pull
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browser">
          <TarotDeckBrowser />
        </TabsContent>
        <TabsContent value="study">
          <TarotStudyMode />
        </TabsContent>
        <TabsContent value="pull">
          <TarotDailyPull />
        </TabsContent>
      </Tabs>
    </div>
  );
}
