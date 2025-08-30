/**
 * Biofeedback Display - Real-time consciousness metrics
 * Displays HRV, EEG, breathing, and autonomic balance data
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Brain, 
  Wind, 
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { BiofeedbackMetrics } from '@/types/gaa-polarity';

interface BiofeedbackDisplayProps {
  metrics: BiofeedbackMetrics;
  isConnected: boolean;
  className?: string;
}

export const BiofeedbackDisplay: React.FC<BiofeedbackDisplayProps> = ({
  metrics,
  isConnected,
  className = ""
}) => {
  const getCoherenceColor = (coherence: number) => {
    if (coherence >= 0.8) return "hsl(var(--success))";
    if (coherence >= 0.6) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const getCoherenceLabel = (coherence: number) => {
    if (coherence >= 0.8) return "High";
    if (coherence >= 0.6) return "Medium";
    return "Low";
  };

  const getTrendIcon = (current: number, threshold: number) => {
    if (current > threshold) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (current < threshold) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-yellow-500" />;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (!isConnected) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Biofeedback sensors disconnected</p>
            <p className="text-sm">Connect sensors to view real-time data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Heart Rate Variability */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Heart Rate Variability
            <Badge 
              variant="outline"
              style={{ 
                borderColor: getCoherenceColor(metrics.heartRateVariability.coherenceRatio),
                color: getCoherenceColor(metrics.heartRateVariability.coherenceRatio)
              }}
            >
              {getCoherenceLabel(metrics.heartRateVariability.coherenceRatio)} Coherence
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">RMSSD</span>
                {getTrendIcon(metrics.heartRateVariability.rmssd, 30)}
              </div>
              <div className="text-2xl font-mono">
                {metrics.heartRateVariability.rmssd.toFixed(1)}
                <span className="text-sm text-muted-foreground ml-1">ms</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">pNN50</span>
                {getTrendIcon(metrics.heartRateVariability.pnn50, 20)}
              </div>
              <div className="text-2xl font-mono">
                {metrics.heartRateVariability.pnn50.toFixed(1)}
                <span className="text-sm text-muted-foreground ml-1">%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Coherence</span>
              <Progress 
                value={metrics.heartRateVariability.coherenceRatio * 100} 
                className="h-2"
              />
              <div className="text-sm font-mono text-center">
                {(metrics.heartRateVariability.coherenceRatio * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Last updated: {formatTimestamp(metrics.heartRateVariability.timestamp)}
          </div>
        </CardContent>
      </Card>

      {/* Brainwave Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Brainwave Activity
            <Badge 
              variant="outline"
              style={{ 
                borderColor: getCoherenceColor(metrics.brainwaveActivity.coherence),
                color: getCoherenceColor(metrics.brainwaveActivity.coherence)
              }}
            >
              {getCoherenceLabel(metrics.brainwaveActivity.coherence)} Coherence
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-3">
            {Object.entries({
              Delta: { value: metrics.brainwaveActivity.delta, color: 'bg-red-500', range: '0.5-4Hz' },
              Theta: { value: metrics.brainwaveActivity.theta, color: 'bg-orange-500', range: '4-8Hz' },
              Alpha: { value: metrics.brainwaveActivity.alpha, color: 'bg-yellow-500', range: '8-13Hz' },
              Beta: { value: metrics.brainwaveActivity.beta, color: 'bg-green-500', range: '13-30Hz' },
              Gamma: { value: metrics.brainwaveActivity.gamma, color: 'bg-purple-500', range: '30-100Hz' }
            }).map(([name, data]) => (
              <div key={name} className="space-y-2">
                <div className="text-center">
                  <div className="text-sm font-medium">{name}</div>
                  <div className="text-xs text-muted-foreground">{data.range}</div>
                </div>
                <div className="space-y-1">
                  <Progress 
                    value={data.value * 100} 
                    className="h-2"
                  />
                  <div className="text-xs font-mono text-center">
                    {(data.value * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-muted-foreground">Overall Coherence</span>
            <div className="flex items-center gap-2">
              <Progress 
                value={metrics.brainwaveActivity.coherence * 100} 
                className="h-2 w-20"
              />
              <span className="text-sm font-mono">
                {(metrics.brainwaveActivity.coherence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Last updated: {formatTimestamp(metrics.brainwaveActivity.timestamp)}
          </div>
        </CardContent>
      </Card>

      {/* Breathing Pattern */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-blue-500" />
            Breathing Pattern
            <Badge variant="outline">
              {metrics.breathingPattern.phase}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Rate</span>
              <div className="text-2xl font-mono">
                {metrics.breathingPattern.rate.toFixed(1)}
                <span className="text-sm text-muted-foreground ml-1">bpm</span>
              </div>
              {getTrendIcon(metrics.breathingPattern.rate, 12)}
            </div>
            
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Depth</span>
              <Progress 
                value={metrics.breathingPattern.depth * 100} 
                className="h-2"
              />
              <div className="text-sm font-mono text-center">
                {(metrics.breathingPattern.depth * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Coherence</span>
              <Progress 
                value={metrics.breathingPattern.coherence * 100} 
                className="h-2"
              />
              <div className="text-sm font-mono text-center">
                {(metrics.breathingPattern.coherence * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Last updated: {formatTimestamp(metrics.breathingPattern.timestamp)}
          </div>
        </CardContent>
      </Card>

      {/* Autonomic Balance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Autonomic Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sympathetic</span>
                <span className="text-sm font-mono">
                  {(metrics.autonomicBalance.sympathetic * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={metrics.autonomicBalance.sympathetic * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Parasympathetic</span>
                <span className="text-sm font-mono">
                  {(metrics.autonomicBalance.parasympathetic * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={metrics.autonomicBalance.parasympathetic * 100} 
                className="h-2"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Balance Score</span>
              <Badge 
                variant={
                  Math.abs(metrics.autonomicBalance.balance) < 0.2 ? "default" :
                  Math.abs(metrics.autonomicBalance.balance) < 0.5 ? "secondary" : "destructive"
                }
              >
                {metrics.autonomicBalance.balance > 0 ? "Sympathetic" : "Parasympathetic"} Dominant
              </Badge>
            </div>
            <Progress 
              value={((metrics.autonomicBalance.balance + 1) / 2) * 100} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Parasympathetic</span>
              <span>Balanced</span>
              <span>Sympathetic</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Last updated: {formatTimestamp(metrics.autonomicBalance.timestamp)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};