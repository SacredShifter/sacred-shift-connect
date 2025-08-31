/**
 * Session Metrics - Advanced session tracking and analytics
 * Displays real-time metrics, safety status, and session insights
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Heart, 
  Brain, 
  Shield, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Download,
  Eye,
  Zap,
  Play,
  RotateCcw,
  Trophy,
  HelpCircle,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiofeedbackMetrics, GAAEngineState } from '@/types/gaa-polarity';

interface SessionMetricsProps {
  biofeedbackState: any;
  gaaEngineState: GAAEngineState;
  sessionDuration: number;
  safetyAlerts: string[];
  isActive: boolean;
  onExportSession?: () => void;
  className?: string;
  compact?: boolean;
  orchestraMetrics?: {
    phaseError: number;
    participantCount: number;
    syncQuality: 'excellent' | 'good' | 'poor';
  };
  sessionBadges?: string[];
  onCompletionBadge?: (badge: string) => void;
}

interface MetricCard {
  title: string;
  value: string | number;
  unit?: string;
  status: 'safe' | 'warning' | 'critical' | 'optimal';
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

export const SessionMetrics: React.FC<SessionMetricsProps> = ({
  biofeedbackState,
  gaaEngineState,
  sessionDuration,
  safetyAlerts,
  isActive,
  onExportSession,
  className = '',
  compact = false,
  orchestraMetrics,
  sessionBadges = [],
  onCompletionBadge
}) => {
  const [showDetailed, setShowDetailed] = useState(false);
  const [sessionInsights, setSessionInsights] = useState<string[]>([]);
  const [expandedAlerts, setExpandedAlerts] = useState<string[]>([]);

  // Semantic coloring for safety alerts
  const getAlertVariant = (alert: string) => {
    if (alert.includes('error') || alert.includes('critical') || alert.includes('fail')) {
      return 'destructive';
    }
    if (alert.includes('low') || alert.includes('monitoring') || alert.includes('active')) {
      return 'default'; // amber/warning color
    }
    return 'secondary';
  };

  const getAlertIcon = (alert: string) => {
    if (alert.includes('error') || alert.includes('critical')) {
      return <AlertCircle className="w-3 h-3" />;
    }
    if (alert.includes('active') && alert.includes('Shadow')) {
      return <Eye className="w-3 h-3" />;
    }
    return <Shield className="w-3 h-3" />;
  };

  const toggleAlertDetail = (alert: string) => {
    setExpandedAlerts(prev => 
      prev.includes(alert) 
        ? prev.filter(a => a !== alert)
        : [...prev, alert]
    );
  };

  // Format duration
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate overall safety status
  const getSafetyStatus = (): 'safe' | 'warning' | 'critical' => {
    if (safetyAlerts.length === 0) return 'safe';
    const hasCritical = safetyAlerts.some(alert => 
      alert.includes('too high') || alert.includes('check consciousness')
    );
    return hasCritical ? 'critical' : 'warning';
  };

  // Generate metric cards
  const getMetricCards = (): MetricCard[] => {
    if (!biofeedbackState) return [];

    return [
      {
        title: 'Heart Rate',
        value: Math.round(biofeedbackState.heartRate),
        unit: 'BPM',
        status: biofeedbackState.heartRate > 100 ? 'warning' : 
                biofeedbackState.heartRate < 60 ? 'warning' : 'safe',
        icon: <Heart className="w-4 h-4" />,
        trend: 'stable'
      },
      {
        title: 'HRV',
        value: Math.round(biofeedbackState.heartRateVariability),
        unit: 'ms',
        status: biofeedbackState.heartRateVariability > 40 ? 'optimal' : 'safe',
        icon: <Activity className="w-4 h-4" />,
        trend: 'up'
      },
      {
        title: 'Breathing',
        value: Math.round(biofeedbackState.breathingRate),
        unit: '/min',
        status: biofeedbackState.breathingRate > 20 ? 'warning' : 'safe',
        icon: <Brain className="w-4 h-4" />,
        trend: 'stable'
      },
      {
        title: 'Alpha Waves',
        value: Math.round(biofeedbackState.brainwaveAlpha * 100),
        unit: '%',
        status: biofeedbackState.brainwaveAlpha > 0.4 ? 'optimal' : 'safe',
        icon: <Zap className="w-4 h-4" />,
        trend: 'up'
      }
    ];
  };

  // Generate session insights
  useEffect(() => {
    if (!isActive || !biofeedbackState) return;

    const insights: string[] = [];
    
    if (biofeedbackState.brainwaveAlpha > 0.4) {
      insights.push('Strong alpha wave activity detected - excellent meditation state');
    }
    
    if (biofeedbackState.heartRateVariability > 50) {
      insights.push('High heart rate variability indicates good autonomic balance');
    }
    
    if (sessionDuration > 600000) { // 10 minutes
      insights.push('Extended session duration - deepening practice detected');
    }
    
    if (safetyAlerts.length === 0 && sessionDuration > 300000) {
      insights.push('Stable physiological state maintained throughout session');
    }

    setSessionInsights(insights);
  }, [biofeedbackState, sessionDuration, safetyAlerts, isActive]);

  const safetyStatus = getSafetyStatus();
  const metricCards = getMetricCards();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4 text-green-400" />
              Session Metrics
              <Badge variant={safetyStatus === 'safe' ? 'default' : 'destructive'}>
                <Shield className="w-3 h-3 mr-1" />
                {safetyStatus.toUpperCase()}
              </Badge>
            </CardTitle>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailed(!showDetailed)}
              >
                <Eye className="w-4 h-4 mr-1" />
                {showDetailed ? 'Simple' : 'Detailed'}
              </Button>
              
              {onExportSession && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExportSession}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export JSON
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Session Duration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">Duration</span>
            </div>
            <div className="text-lg font-mono">
              {formatDuration(sessionDuration)}
            </div>
          </div>

          <Separator />

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {metricCards.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-l-4 ${
                  metric.status === 'optimal' ? 'border-l-green-500' :
                  metric.status === 'warning' ? 'border-l-yellow-500' :
                  metric.status === 'critical' ? 'border-l-red-500' :
                  'border-l-blue-500'
                }`}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {metric.icon}
                        <span className="text-xs font-medium">{metric.title}</span>
                      </div>
                      {metric.trend && (
                        <TrendingUp className={`w-3 h-3 ${
                          metric.trend === 'up' ? 'text-green-400' :
                          metric.trend === 'down' ? 'text-red-400 rotate-180' :
                          'text-gray-400'
                        }`} />
                      )}
                    </div>
                    <div className="text-lg font-bold">
                      {metric.value}{metric.unit && (
                        <span className="text-xs text-muted-foreground ml-1">
                          {metric.unit}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Safety Alerts */}
          <AnimatePresence>
            {safetyAlerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Separator />
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Safety Alerts</span>
                </div>
                {safetyAlerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="cursor-pointer"
                    onClick={() => toggleAlertDetail(alert)}
                  >
                    <Badge 
                      variant={getAlertVariant(alert)} 
                      className="w-full justify-start gap-2 p-2 hover:bg-opacity-80"
                    >
                      {getAlertIcon(alert)}
                      <span className="flex-1">{alert}</span>
                      {alert.includes('Shadow engine active') && (
                        <HelpCircle className="w-3 h-3" />
                      )}
                    </Badge>
                    
                    {/* Shadow Engine Detail Dropdown */}
                    {expandedAlerts.includes(alert) && alert.includes('Shadow engine active') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 p-3 bg-muted/20 rounded border text-xs space-y-1"
                      >
                        <div><strong>Shadow Engine Status:</strong></div>
                        <div>• Dark phase processing active</div>
                        <div>• Polarity sum: {((gaaEngineState.oscillatorCount || 0) * 10).toFixed(0)}% dark weight</div>
                        <div>• Audio limiter: {gaaEngineState.oscillatorCount > 5 ? 'Engaged' : 'Standby'}</div>
                        <div>• Integration mode: Harmonic shadow work</div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Orchestra Sync Meter */}
          {orchestraMetrics && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Orchestra Sync</span>
                  <Badge variant={
                    orchestraMetrics.syncQuality === 'excellent' ? 'default' :
                    orchestraMetrics.syncQuality === 'good' ? 'secondary' : 'destructive'
                  }>
                    {orchestraMetrics.syncQuality}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Phase Error:</span>
                    <div className="font-mono text-lg">{orchestraMetrics.phaseError}ms</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Participants:</span>
                    <div className="font-mono text-lg">{orchestraMetrics.participantCount}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Session Badges */}
          {sessionBadges.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium">Session Badges</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {sessionBadges.map((badge, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                        <Trophy className="w-3 h-3 mr-1" />
                        {badge}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Session Insights */}
          {showDetailed && sessionInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <Separator />
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Session Insights</span>
              </div>
              {sessionInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-green-500/10 border border-green-500/20 rounded p-2"
                >
                  <p className="text-xs text-green-300">{insight}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* GAA Engine Stats */}
          {showDetailed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <Separator />
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Engine Phase: {gaaEngineState?.currentPhase || 'Idle'}</div>
                <div>Oscillator Count: {gaaEngineState?.oscillatorCount || 0}</div>
                <div>Geometry Complexity: {gaaEngineState?.currentGeometry?.complexity || 'N/A'}</div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};