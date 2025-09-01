import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BiofeedbackMetrics } from '@/types/gaa-polarity';
import { Heart, Brain, Wind, Activity } from 'lucide-react';

interface BiofeedbackDisplayProps {
  metrics: BiofeedbackMetrics | null;
  isConnected?: boolean;
}

export const BiofeedbackDisplay: React.FC<BiofeedbackDisplayProps> = ({
  metrics,
  isConnected = false
}) => {
  if (!metrics) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Biofeedback Metrics
            <Badge variant="outline" className="ml-auto">
              Disconnected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No biofeedback data available</p>
            <p className="text-sm">Connect a device to begin monitoring</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Biofeedback Metrics
          <Badge variant={isConnected ? "default" : "outline"} className="ml-auto">
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Heart Rate Variability */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="font-medium">Heart Rate Variability</span>
            </div>
            <span className="text-sm font-mono">{metrics.heartRateVariability.toFixed(1)} ms</span>
          </div>
          <Progress value={Math.min(metrics.heartRateVariability, 100)} className="h-2" />
        </div>

        {/* Brainwave Activity */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            <span className="font-medium">Brainwave Activity</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="flex justify-between">
                <span>Alpha:</span>
                <span>{metrics.brainwaveActivity.alpha.toFixed(1)}µV</span>
              </div>
              <Progress value={metrics.brainwaveActivity.alpha} className="h-1" />
            </div>
            <div>
              <div className="flex justify-between">
                <span>Beta:</span>
                <span>{metrics.brainwaveActivity.beta.toFixed(1)}µV</span>
              </div>
              <Progress value={metrics.brainwaveActivity.beta} className="h-1" />
            </div>
            <div>
              <div className="flex justify-between">
                <span>Theta:</span>
                <span>{metrics.brainwaveActivity.theta.toFixed(1)}µV</span>
              </div>
              <Progress value={metrics.brainwaveActivity.theta} className="h-1" />
            </div>
            <div>
              <div className="flex justify-between">
                <span>Delta:</span>
                <span>{metrics.brainwaveActivity.delta.toFixed(1)}µV</span>
              </div>
              <Progress value={metrics.brainwaveActivity.delta} className="h-1" />
            </div>
          </div>
        </div>

        {/* Breathing Pattern */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Breathing Pattern</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="font-medium">{metrics.breathingPattern.rate.toFixed(1)}</p>
              <p className="text-muted-foreground">BPM</p>
            </div>
            <div className="text-center">
              <p className="font-medium">{(metrics.breathingPattern.depth * 100).toFixed(0)}%</p>
              <p className="text-muted-foreground">Depth</p>
            </div>
            <div className="text-center">
              <p className="font-medium">{(metrics.breathingPattern.coherence * 100).toFixed(0)}%</p>
              <p className="text-muted-foreground">Coherence</p>
            </div>
          </div>
        </div>

        {/* Autonomic Balance */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="font-medium">Autonomic Balance</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex justify-between">
                <span>Sympathetic:</span>
                <span>{(metrics.autonomicBalance.sympathetic * 100).toFixed(0)}%</span>
              </div>
              <Progress value={metrics.autonomicBalance.sympathetic * 100} className="h-1" />
            </div>
            <div>
              <div className="flex justify-between">
                <span>Parasympathetic:</span>
                <span>{(metrics.autonomicBalance.parasympathetic * 100).toFixed(0)}%</span>
              </div>
              <Progress value={metrics.autonomicBalance.parasympathetic * 100} className="h-1" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};