import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useKarmaReflections } from '@/hooks/useKarmaReflections';
import { KarmaTimeline } from './KarmaTimeline';
import { KarmaAnalytics } from './KarmaAnalytics';
import { PlusCircle, Clock, BarChart3, X } from 'lucide-react';
import { toast } from 'sonner';

interface KarmaJournalProps {
  userId: string;
}

export const KarmaJournal: React.FC<KarmaJournalProps> = ({ userId }) => {
  const { reflections, isLoading, addReflection, getKarmicBalance, getFilteredReflections } = useKarmaReflections(userId);
  
  // Form state
  const [event, setEvent] = useState('');
  const [reflection, setReflection] = useState('');
  const [outcome, setOutcome] = useState<'positive' | 'negative' | 'neutral'>('neutral');
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // UI state
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [outcomeFilter, setOutcomeFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!event.trim() || !reflection.trim()) {
      toast.error('Please fill in both event and reflection fields');
      return;
    }

    const success = await addReflection(event, reflection, outcome, tags);
    
    if (success) {
      setEvent('');
      setReflection('');
      setOutcome('neutral');
      setTags([]);
      toast.success('Karma reflection saved successfully');
    } else {
      toast.error('Failed to save reflection. Please try again.');
    }
  };

  const handleToggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEntries(newExpanded);
  };

  const filteredReflections = getFilteredReflections(outcomeFilter, tagFilter);
  const allTags = Array.from(new Set(reflections.flatMap(r => r.tags)));

  const resetForm = () => {
    setEvent('');
    setReflection('');
    setOutcome('neutral');
    setTags([]);
    setCurrentTag('');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Karma Journal
          <Badge variant="secondary">{reflections.length} entries</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <Tabs defaultValue="create" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            {/* New Entry Form */}
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Description</label>
                <Input
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  placeholder="What happened? (e.g., 'Helped a colleague with their project')"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reflection</label>
                <Textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Reflect on the experience, your actions, and what you learned..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Outcome</label>
                <Select value={outcome} onValueChange={(value) => setOutcome(value as 'positive' | 'negative' | 'neutral')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">✨ Positive - Enhanced well-being</SelectItem>
                    <SelectItem value="negative">⚡ Negative - Created suffering</SelectItem>
                    <SelectItem value="neutral">🌱 Neutral - Learning experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex gap-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => handleRemoveTag(tag)} 
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !event.trim() || !reflection.trim()}
                  className="flex-1"
                >
                  {isLoading ? 'Saving...' : 'Save Reflection'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Clear
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="flex-1 flex flex-col">
            {/* Filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All outcomes</SelectItem>
                  <SelectItem value="positive">✨ Positive</SelectItem>
                  <SelectItem value="negative">⚡ Negative</SelectItem>
                  <SelectItem value="neutral">🌱 Neutral</SelectItem>
                </SelectContent>
              </Select>
              
              {allTags.length > 0 && (
                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {(outcomeFilter || tagFilter) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setOutcomeFilter('');
                    setTagFilter('');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              <KarmaTimeline 
                reflections={filteredReflections}
                expandedEntries={expandedEntries}
                onToggleExpanded={handleToggleExpanded}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <KarmaAnalytics 
              reflections={reflections}
              karmicBalance={getKarmicBalance()}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};