/**
 * Karma Journal - Track and reflect on karmic actions and outcomes
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Tag, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface KarmaReflection {
  id: string;
  event: string;
  reflection: string;
  perceived_outcome: 'positive' | 'negative' | 'neutral';
  tags: string[];
  circle_id?: string;
  created_at: string;
}

export const KarmaJournal: React.FC = () => {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<KarmaReflection[]>([]);
  const [newReflection, setNewReflection] = useState<{
    event: string;
    reflection: string;
    perceived_outcome: 'positive' | 'negative' | 'neutral';
    tags: string[];
  }>({
    event: '',
    reflection: '',
    perceived_outcome: 'neutral',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadReflections();
    }
  }, [user]);

  const loadReflections = async () => {
    try {
      const { data, error } = await supabase
        .from('karma_reflections')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setReflections(data || []);
    } catch (error) {
      console.error('Failed to load karma reflections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveReflection = async () => {
    if (!newReflection.event.trim() || !newReflection.reflection.trim()) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('karma_reflections')
        .insert({
          event: newReflection.event.trim(),
          reflection: newReflection.reflection.trim(),
          perceived_outcome: newReflection.perceived_outcome,
          tags: newReflection.tags
        });

      if (error) throw error;

      // Reset form
      setNewReflection({
        event: '',
        reflection: '',
        perceived_outcome: 'neutral',
        tags: []
      });

      // Reload reflections
      await loadReflections();
    } catch (error) {
      console.error('Failed to save karma reflection:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !newReflection.tags.includes(newTag.trim())) {
      setNewReflection(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewReflection(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getOutcomeColor = (outcome: string): "default" | "destructive" | "secondary" => {
    switch (outcome) {
      case 'positive': return 'default';
      case 'negative': return 'destructive';
      default: return 'secondary';
    }
  };

  const getKarmaBalance = () => {
    const positive = reflections.filter(r => r.perceived_outcome === 'positive').length;
    const negative = reflections.filter(r => r.perceived_outcome === 'negative').length;
    return positive - negative;
  };

  const reflectionPrompts = [
    "What energy did I put into the world today?",
    "How did my actions affect others?",
    "What came back to me from this action?",
    "What lesson did this experience teach me?",
    "How can I improve my intentions next time?"
  ];

  if (isLoading) {
    return <div>Loading karma journal...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Karma Balance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Karma Journal
            <Badge variant={getKarmaBalance() >= 0 ? 'default' : 'destructive'}>
              Balance: {getKarmaBalance() > 0 ? '+' : ''}{getKarmaBalance()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-success">
                {reflections.filter(r => r.perceived_outcome === 'positive').length}
              </div>
              <div className="text-sm text-muted-foreground">Positive</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-muted-foreground">
                {reflections.filter(r => r.perceived_outcome === 'neutral').length}
              </div>
              <div className="text-sm text-muted-foreground">Neutral</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-destructive">
                {reflections.filter(r => r.perceived_outcome === 'negative').length}
              </div>
              <div className="text-sm text-muted-foreground">Negative</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Reflection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Karma Reflection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">What happened?</label>
            <Input
              value={newReflection.event}
              onChange={(e) => setNewReflection(prev => ({ ...prev, event: e.target.value }))}
              placeholder="Describe the action or event..."
            />
          </div>

          <div>
            <label className="text-sm font-medium">Reflection & Outcome</label>
            <Textarea
              value={newReflection.reflection}
              onChange={(e) => setNewReflection(prev => ({ ...prev, reflection: e.target.value }))}
              placeholder="What energy came back from this action? What did you learn?"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Perceived Outcome</label>
            <Select
              value={newReflection.perceived_outcome}
              onValueChange={(value: 'positive' | 'negative' | 'neutral') => 
                setNewReflection(prev => ({ ...prev, perceived_outcome: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive - Good energy returned</SelectItem>
                <SelectItem value="neutral">Neutral - No clear outcome yet</SelectItem>
                <SelectItem value="negative">Negative - Challenging energy returned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} size="sm">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newReflection.tags.map(tag => (
                <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={saveReflection} disabled={isSaving} className="w-full">
            {isSaving ? 'Saving...' : 'Save Reflection'}
          </Button>
        </CardContent>
      </Card>

      {/* Reflection Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>Reflection Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {reflectionPrompts.map((prompt, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                {prompt}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reflections */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reflections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reflections.map(reflection => (
            <div key={reflection.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-medium">{reflection.event}</h3>
                <div className="flex items-center gap-2">
                  {getOutcomeIcon(reflection.perceived_outcome)}
                  <Badge variant={getOutcomeColor(reflection.perceived_outcome) as any}>
                    {reflection.perceived_outcome}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">{reflection.reflection}</p>
              
              {reflection.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {reflection.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(reflection.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
          
          {reflections.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No karma reflections yet. Start by adding your first reflection above.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};