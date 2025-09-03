import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Calendar, Tag } from 'lucide-react';
import { KarmaReflection } from '@/hooks/useKarmaReflections';
import { format } from 'date-fns';

interface KarmaTimelineProps {
  reflections: KarmaReflection[];
  expandedEntries: Set<string>;
  onToggleExpanded: (id: string) => void;
}

export const KarmaTimeline: React.FC<KarmaTimelineProps> = ({
  reflections,
  expandedEntries,
  onToggleExpanded
}) => {
  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'positive': return '✨';
      case 'negative': return '⚡';
      default: return '🌱';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'positive': return 'bg-green-100 border-green-300 text-green-800';
      case 'negative': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  if (reflections.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No karma reflections yet. Start by documenting your first experience above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reflections.map((reflection) => (
        <Card key={reflection.id} className="relative">
          {/* Timeline connector */}
          <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border -z-10" />
          
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Outcome indicator */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${getOutcomeColor(reflection.outcome)}`}>
                <span className="text-lg">{getOutcomeIcon(reflection.outcome)}</span>
              </div>

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground truncate">
                    {reflection.event}
                  </h3>
                  <time className="text-sm text-muted-foreground whitespace-nowrap ml-2">
                    {format(new Date(reflection.created_at), 'MMM d, yyyy')}
                  </time>
                </div>

                {/* Reflection preview/full */}
                <div className="mb-3">
                  {expandedEntries.has(reflection.id) ? (
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {reflection.reflection}
                    </p>
                  ) : (
                    <p className="text-muted-foreground line-clamp-2">
                      {reflection.reflection}
                    </p>
                  )}
                  
                  {reflection.reflection.length > 150 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleExpanded(reflection.id)}
                      className="mt-1 p-0 h-auto text-primary"
                    >
                      {expandedEntries.has(reflection.id) ? (
                        <>Show less <ChevronUp className="w-4 h-4 ml-1" /></>
                      ) : (
                        <>Show more <ChevronDown className="w-4 h-4 ml-1" /></>
                      )}
                    </Button>
                  )}
                </div>

                {/* Tags */}
                {reflection.tags && reflection.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    {reflection.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};