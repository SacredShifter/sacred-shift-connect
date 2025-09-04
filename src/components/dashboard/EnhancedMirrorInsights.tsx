import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSynchronicityMirror } from '@/hooks/useSynchronicityMirror';
import { Eye, Sparkles, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EnhancedMirrorInsightsProps {
  onOpenMirror: () => void;
}

export const EnhancedMirrorInsights = ({ onOpenMirror }: EnhancedMirrorInsightsProps) => {
  const { currentReading } = useSynchronicityMirror();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Fetch real sealed truths from mirror journal entries
  const { data: sealedTruths, error: fetchError } = useQuery({
    queryKey: ['sealed-truths', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('mirror_journal_entries')
          .select('id, title, content, created_at, mood_tag, resonance_sigil')
          .eq('user_id', user.id)
          .eq('is_draft', false)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        return data?.map((entry, index) => ({
          id: entry.id,
          text: entry.content?.slice(0, 50) + '...' || 'Sacred insight captured...',
          timestamp: formatTimeAgo(entry.created_at),
          resonance: 0.8 + (index * 0.02), // Simulate resonance scores
          mood: entry.mood_tag || 'reflective'
        })) || [];
      } catch (err: any) {
        console.error('Error fetching sealed truths:', err);
        setError(err.message);
        return [];
      }
    },
    enabled: !!user,
    retry: 2
  });

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return past.toLocaleDateString();
  };

  const sigils = ['∴', '◊', '⟡', '※', '◈', '⬟'];
  const currentResonance = currentReading?.resonance_score || 0.78;

  // Error boundary component
  if (fetchError || error) {
    return (
      <Card className="bg-gradient-to-br from-background/80 to-background/40 border-destructive/20 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <h3 className="font-medium text-destructive mb-2">Mirror Insights Temporarily Unavailable</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Unable to load your insights. This may be due to a connection issue.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-background/80 to-background/40 border-primary/20 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Eye className="h-4 w-4 text-primary" />
          Mirror Insights
          <Badge variant="secondary" className="ml-auto text-xs">
            {Math.round(currentResonance * 100)}% resonance
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Resonance Trend */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Resonance Trend</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-1 rounded-full ${
                  i < Math.floor(currentResonance * 5) ? 'bg-primary' : 'bg-primary/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sealed Truths Feed */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Recent Sealed Truths
          </h4>
          <div className="space-y-2 max-h-24 overflow-y-auto">
            {sealedTruths && sealedTruths.length > 0 ? (
              sealedTruths.slice(0, 2).map((truth) => (
                <motion.div
                  key={truth.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs p-2 rounded bg-secondary/30 border border-secondary/50 hover:bg-secondary/40 transition-colors cursor-pointer"
                  onClick={() => onOpenMirror()}
                >
                  <p className="text-muted-foreground line-clamp-1">{truth.text}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground/70">{truth.timestamp}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-primary">{Math.round(truth.resonance * 100)}%</span>
                      <Badge variant="outline" className="text-xs h-4 px-1">
                        {truth.mood}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-xs p-2 rounded bg-muted/30 text-center text-muted-foreground">
                No sealed truths yet. Start journaling to capture insights.
              </div>
            )}
          </div>
        </div>

        {/* Sigil Collection */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Sacred Patterns</h4>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {sigils.slice(0, 4).map((sigil, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-xs text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                  title={`Sigil ${i + 1}: Resonance pattern from your insights`}
                >
                  {sigil}
                </motion.div>
              ))}
              <div className="w-6 h-6 rounded-full bg-secondary/30 border border-secondary/50 flex items-center justify-center text-xs text-muted-foreground">
                +{Math.max(0, (sealedTruths?.length || 0) - 4)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenMirror}
              className="h-7 px-2 text-xs hover:bg-primary/10"
            >
              <Zap className="h-3 w-3 mr-1" />
              Generate
            </Button>
          </div>
        </div>

        {/* Insight Summary */}
        {sealedTruths && sealedTruths.length > 0 && (
          <div className="pt-2 border-t border-primary/10">
            <p className="text-xs text-muted-foreground text-center">
              {sealedTruths.length} insights sealed • Last captured {sealedTruths[0]?.timestamp}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};