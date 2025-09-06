import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Zap, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface QuickCheckData {
  mood: number;
  energy: number;
  clarity: number;
  stress: number;
}

interface QuickCheckSlidersProps {
  onComplete: (data: QuickCheckData) => void;
  onCancel: () => void;
}

const metrics = [
  {
    key: 'mood' as keyof QuickCheckData,
    label: 'Mood',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-500/10',
    description: 'How positive do you feel right now?',
    lowLabel: 'Low',
    highLabel: 'High'
  },
  {
    key: 'energy' as keyof QuickCheckData,
    label: 'Energy',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500/10',
    description: 'How energized and alert do you feel?',
    lowLabel: 'Drained',
    highLabel: 'Vibrant'
  },
  {
    key: 'clarity' as keyof QuickCheckData,
    label: 'Clarity',
    icon: Eye,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    description: 'How clear and focused is your mind?',
    lowLabel: 'Foggy',
    highLabel: 'Crystal Clear'
  },
  {
    key: 'stress' as keyof QuickCheckData,
    label: 'Stress',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-500/10',
    description: 'How much tension or pressure do you feel?',
    lowLabel: 'Calm',
    highLabel: 'Overwhelmed'
  }
];

export const QuickCheckSliders: React.FC<QuickCheckSlidersProps> = ({
  onComplete,
  onCancel
}) => {
  const [values, setValues] = useState<QuickCheckData>({
    mood: 5,
    energy: 5,
    clarity: 5,
    stress: 5
  });

  const [currentMetric, setCurrentMetric] = useState(0);

  const handleValueChange = (key: keyof QuickCheckData, value: number[]) => {
    setValues(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  const getMetricScore = (value: number) => {
    if (value <= 3) return { label: 'Low', color: 'text-red-600' };
    if (value <= 6) return { label: 'Moderate', color: 'text-yellow-600' };
    return { label: 'High', color: 'text-green-600' };
  };

  const getOverallState = () => {
    const avgScore = (values.mood + values.energy + values.clarity + (10 - values.stress)) / 4;
    if (avgScore >= 7) return { label: 'Balanced', color: 'text-green-600', bg: 'bg-green-500/10' };
    if (avgScore >= 5) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-500/10' };
    return { label: 'Needs Attention', color: 'text-red-600', bg: 'bg-red-500/10' };
  };

  const overallState = getOverallState();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Quick Check</h2>
        <p className="text-muted-foreground">
          Rate your current state across these key metrics
        </p>
      </div>

      {/* Overall State Indicator */}
      <Card className={`${overallState.bg} border-current/20`}>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className={`text-lg font-semibold ${overallState.color}`}>
              Current State: {overallState.label}
            </div>
            <div className="text-sm text-muted-foreground">
              Based on your current ratings
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Sliders */}
      <div className="space-y-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const value = values[metric.key];
          const score = getMetricScore(value);
          
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                        <Icon className={`h-5 w-5 ${metric.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{metric.label}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {metric.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={score.color}>
                      {score.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Slider */}
                  <div className="space-y-3">
                    <Slider
                      value={[value]}
                      onValueChange={(val) => handleValueChange(metric.key, val)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    
                    {/* Value Display */}
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {metric.lowLabel}
                      </div>
                      <div className={`text-2xl font-bold ${metric.color}`}>
                        {value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {metric.highLabel}
                      </div>
                    </div>
                  </div>

                  {/* Value Interpretation */}
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium">
                      {value <= 3 && "Consider a micro-reset or resonance drop"}
                      {value > 3 && value <= 6 && "Moderate state - good baseline"}
                      {value > 6 && "Strong state - great foundation for practice"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-center">Your Baseline Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-pink-500/10 rounded-lg">
                <div className="font-semibold text-pink-600">Mood</div>
                <div className="text-lg font-bold">{values.mood}/10</div>
              </div>
              <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                <div className="font-semibold text-yellow-600">Energy</div>
                <div className="text-lg font-bold">{values.energy}/10</div>
              </div>
              <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                <div className="font-semibold text-blue-600">Clarity</div>
                <div className="text-lg font-bold">{values.clarity}/10</div>
              </div>
              <div className="text-center p-3 bg-red-500/10 rounded-lg">
                <div className="font-semibold text-red-600">Stress</div>
                <div className="text-lg font-bold">{values.stress}/10</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={() => onComplete(values)} className="flex-1">
          <CheckCircle className="h-4 w-4 mr-2" />
          Log Baseline
        </Button>
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
};
