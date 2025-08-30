import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMicroPractices, useResistanceLogs, useMicroPracticeCompletions } from '@/hooks/useShadowPath';
import { MicroPracticeCard } from './MicroPracticeCard';
import { ResistanceLogger } from './ResistanceLogger';
import { Badge } from '@/components/ui/badge';
import { Moon, Sparkles, Eye, Heart } from 'lucide-react';

export const ShadowPathDashboard: React.FC = () => {
  const { data: microPractices, isLoading: practicesLoading } = useMicroPractices();
  const { data: resistanceLogs, isLoading: logsLoading } = useResistanceLogs();
  const { data: completions, isLoading: completionsLoading } = useMicroPracticeCompletions();

  if (practicesLoading || logsLoading || completionsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Sparkles className="h-8 w-8 animate-spin text-resonance" />
        <span className="ml-2">Loading Shadow Path...</span>
      </div>
    );
  }

  const recentCompletions = completions?.slice(0, 5) || [];
  const recentResistance = resistanceLogs?.slice(0, 3) || [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="border-truth/30">
        <CardHeader>
          <CardTitle className="font-sacred text-2xl text-truth flex items-center gap-3">
            <Moon className="h-6 w-6 text-resonance" />
            Shadow Path: The Sacred Journey of Gentleness
          </CardTitle>
          <p className="text-muted-foreground">
            For those who need micro-steps, trauma-informed practice, and radical self-compassion.
            Your resistance is information, your gaps are sacred, your return is celebration.
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="micro-practices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="micro-practices" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Micro-Practices
          </TabsTrigger>
          <TabsTrigger value="shadow-work" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Shadow Work
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Your Journey
          </TabsTrigger>
        </TabsList>

        <TabsContent value="micro-practices" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {microPractices?.map((practice) => (
              <MicroPracticeCard key={practice.id} practice={practice} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shadow-work" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ResistanceLogger />
            
            <Card className="border-truth/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-truth">
                  <Eye className="h-5 w-5 text-resonance" />
                  Recent Resistance Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentResistance.length > 0 ? (
                  recentResistance.map((log) => (
                    <div key={log.id} className="p-3 bg-truth/5 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {log.resistance_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-truth font-medium">{log.reason}</p>
                      <p className="text-xs text-muted-foreground">{log.reflection}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-6">
                    No resistance logs yet. When you need to skip practice, come here to witness it.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-truth/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-truth">
                  <Sparkles className="h-5 w-5 text-resonance" />
                  Recent Micro-Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentCompletions.length > 0 ? (
                  recentCompletions.map((completion) => (
                    <div key={completion.id} className="flex items-center justify-between p-3 bg-resonance/5 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-truth">
                          {completion.micro_practice.practice_name}
                        </p>
                        {completion.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            "{completion.notes}"
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(completion.completed_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-6">
                    No micro-practices completed yet. Start with any 30-second practice above.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-truth/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-truth">
                  <Heart className="h-5 w-5 text-resonance" />
                  Shadow Path Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-sacred text-truth">{completions?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Micro-Practices</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-sacred text-resonance">{resistanceLogs?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Witnessed Resistance</div>
                  </div>
                </div>
                
                <div className="bg-truth/5 p-4 rounded-lg text-center">
                  <p className="text-sm text-truth font-medium mb-2">Shadow Seals Available:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline">Witness Seal</Badge>
                    <Badge variant="outline">Shadowwalker Seal</Badge>
                    <Badge variant="outline">Resilience Seal</Badge>
                    <Badge variant="outline">Supporter Seal</Badge>
                    <Badge variant="outline">Silent Seal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};