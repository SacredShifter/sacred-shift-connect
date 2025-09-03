import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { KarmaReflection } from '@/hooks/useKarmaReflections';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

interface KarmaAnalyticsProps {
  reflections: KarmaReflection[];
  karmicBalance: number;
}

export const KarmaAnalytics: React.FC<KarmaAnalyticsProps> = ({
  reflections,
  karmicBalance
}) => {
  const positiveCount = reflections.filter(r => r.outcome === 'positive').length;
  const negativeCount = reflections.filter(r => r.outcome === 'negative').length;
  const neutralCount = reflections.filter(r => r.outcome === 'neutral').length;
  const totalCount = reflections.length;

  const positivePercentage = totalCount > 0 ? (positiveCount / totalCount) * 100 : 0;
  const negativePercentage = totalCount > 0 ? (negativeCount / totalCount) * 100 : 0;
  const neutralPercentage = totalCount > 0 ? (neutralCount / totalCount) * 100 : 0;

  const getBalanceIcon = () => {
    if (karmicBalance > 0) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (karmicBalance < 0) return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  const getBalanceColor = () => {
    if (karmicBalance > 0) return 'text-green-600';
    if (karmicBalance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Get recent trend (last 5 entries)
  const recentReflections = reflections.slice(0, 5);
  const recentBalance = recentReflections.reduce((balance, reflection) => {
    switch (reflection.outcome) {
      case 'positive': return balance + 1;
      case 'negative': return balance - 1;
      default: return balance;
    }
  }, 0);

  if (totalCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Resonance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>Analytics will appear once you start documenting karma reflections.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Resonance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Karmic Balance */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getBalanceIcon()}
            <span className={`text-2xl font-bold ${getBalanceColor()}`}>
              {karmicBalance > 0 ? '+' : ''}{karmicBalance}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Current Karmic Balance</p>
          {recentReflections.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Recent trend (last 5): {recentBalance > 0 ? '+' : ''}{recentBalance}
            </p>
          )}
        </div>

        {/* Outcome Distribution */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Outcome Distribution</h4>
          
          <div className="space-y-3">
            {/* Positive */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <span>✨</span> Positive
                </span>
                <span>{positiveCount} ({positivePercentage.toFixed(0)}%)</span>
              </div>
              <Progress value={positivePercentage} className="h-2" />
            </div>

            {/* Negative */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <span>⚡</span> Negative
                </span>
                <span>{negativeCount} ({negativePercentage.toFixed(0)}%)</span>
              </div>
              <Progress 
                value={negativePercentage} 
                className="h-2 [&>div]:bg-red-500" 
              />
            </div>

            {/* Neutral */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <span>🌱</span> Neutral
                </span>
                <span>{neutralCount} ({neutralPercentage.toFixed(0)}%)</span>
              </div>
              <Progress 
                value={neutralPercentage} 
                className="h-2 [&>div]:bg-gray-500" 
              />
            </div>
          </div>
        </div>

        {/* Total Entries */}
        <div className="text-center pt-4 border-t">
          <p className="text-2xl font-bold text-foreground">{totalCount}</p>
          <p className="text-sm text-muted-foreground">Total Reflections</p>
        </div>
      </CardContent>
    </Card>
  );
};