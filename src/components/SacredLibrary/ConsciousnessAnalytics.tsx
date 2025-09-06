import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Heart, 
  Star, 
  Clock, 
  Target, 
  Award,
  Calendar,
  PieChart,
  Activity,
  Zap,
  Users,
  BookOpen,
  Lightbulb,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ConsciousnessProfile, ConsciousnessLevel, CONSCIOUSNESS_LEVELS } from '@/types/consciousness';

interface AnalyticsData {
  consciousnessProfile: ConsciousnessProfile;
  weeklyProgress: {
    date: string;
    points: number;
    learningHours: number;
    contentConsumed: number;
    insightsShared: number;
  }[];
  dimensionProgress: {
    dimension: string;
    current: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  contentInsights: {
    totalContent: number;
    averageResonance: number;
    topCategories: { category: string; count: number; resonance: number }[];
    learningStreak: number;
    favoriteContentType: string;
  };
  communityStats: {
    insightsShared: number;
    likesReceived: number;
    wisdomCirclesJoined: number;
    mentorshipProvided: number;
  };
  sacredTiming: {
    optimalLearningTimes: string[];
    energyFrequency: string;
    lunarPhase: string;
    solarPosition: string;
  };
}

interface ConsciousnessAnalyticsProps {
  userProfile: ConsciousnessProfile | null;
  onUpdateProfile: (updates: Partial<ConsciousnessProfile>) => void;
}

export const ConsciousnessAnalytics: React.FC<ConsciousnessAnalyticsProps> = ({
  userProfile,
  onUpdateProfile
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'insights' | 'community' | 'timing'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock data generation - in real implementation, this would come from the API
  useEffect(() => {
    if (userProfile) {
      const generateMockData = (): AnalyticsData => {
        const currentLevel = CONSCIOUSNESS_LEVELS[userProfile.current_level];
        
        // Generate weekly progress data
        const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return {
            date: date.toISOString().split('T')[0],
            points: Math.floor(Math.random() * 50) + 10,
            learningHours: Math.floor(Math.random() * 3) + 1,
            contentConsumed: Math.floor(Math.random() * 5) + 1,
            insightsShared: Math.floor(Math.random() * 3)
          };
        });

        // Generate dimension progress
        const dimensionProgress = [
          { dimension: 'Awareness', current: userProfile.awareness, target: 100, trend: 'up' as const },
          { dimension: 'Presence', current: userProfile.presence, target: 100, trend: 'up' as const },
          { dimension: 'Compassion', current: userProfile.compassion, target: 100, trend: 'up' as const },
          { dimension: 'Wisdom', current: userProfile.wisdom, target: 100, trend: 'up' as const },
          { dimension: 'Creativity', current: userProfile.creativity, target: 100, trend: 'up' as const },
          { dimension: 'Intuition', current: userProfile.intuition, target: 100, trend: 'up' as const },
          { dimension: 'Integration', current: userProfile.integration, target: 100, trend: 'up' as const },
          { dimension: 'Service', current: userProfile.service, target: 100, trend: 'up' as const }
        ];

        // Generate content insights
        const contentInsights = {
          totalContent: userProfile.content_consumed,
          averageResonance: 75 + Math.random() * 20,
          topCategories: [
            { category: 'Meditation', count: 15, resonance: 85 },
            { category: 'Wisdom', count: 12, resonance: 78 },
            { category: 'Healing', count: 8, resonance: 82 },
            { category: 'Consciousness', count: 6, resonance: 90 }
          ],
          learningStreak: Math.floor(Math.random() * 30) + 1,
          favoriteContentType: 'video'
        };

        // Generate community stats
        const communityStats = {
          insightsShared: userProfile.insights_shared,
          likesReceived: Math.floor(Math.random() * 100) + 20,
          wisdomCirclesJoined: Math.floor(Math.random() * 5) + 1,
          mentorshipProvided: Math.floor(Math.random() * 10)
        };

        // Generate sacred timing data
        const sacredTiming = {
          optimalLearningTimes: userProfile.optimal_learning_times,
          energyFrequency: userProfile.energy_frequency_preference,
          lunarPhase: userProfile.lunar_phase_preference,
          solarPosition: 'morning'
        };

        return {
          consciousnessProfile: userProfile,
          weeklyProgress,
          dimensionProgress,
          contentInsights,
          communityStats,
          sacredTiming
        };
      };

      setAnalyticsData(generateMockData());
    }
  }, [userProfile]);

  const renderOverview = () => {
    if (!analyticsData) return null;

    const { consciousnessProfile, contentInsights, communityStats } = analyticsData;
    const currentLevel = CONSCIOUSNESS_LEVELS[consciousnessProfile.current_level];

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Consciousness Level</p>
                  <p className="text-2xl font-bold">{currentLevel.title}</p>
                  <p className="text-xs text-gray-500">{consciousnessProfile.total_points} points</p>
                </div>
                <div className="text-3xl">{currentLevel.sacred_symbol}</div>
              </div>
              <div className="mt-4">
                <Progress value={consciousnessProfile.level_progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {consciousnessProfile.level_progress.toFixed(1)}% to next level
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Learning Hours</p>
                  <p className="text-2xl font-bold">{consciousnessProfile.total_learning_hours.toFixed(1)}h</p>
                  <p className="text-xs text-gray-500">Total time invested</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Content Consumed</p>
                  <p className="text-2xl font-bold">{consciousnessProfile.content_consumed}</p>
                  <p className="text-xs text-gray-500">Pieces of wisdom</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Insights Shared</p>
                  <p className="text-2xl font-bold">{consciousnessProfile.insights_shared}</p>
                  <p className="text-xs text-gray-500">Wisdom contributions</p>
                </div>
                <Lightbulb className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consciousness Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Consciousness Dimensions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyticsData.dimensionProgress.map((dimension) => (
                <div key={dimension.dimension} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dimension.dimension}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{dimension.current}/100</span>
                      <div className={`w-2 h-2 rounded-full ${
                        dimension.trend === 'up' ? 'bg-green-500' :
                        dimension.trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                    </div>
                  </div>
                  <Progress value={dimension.current} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Streak */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Learning Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-500">{contentInsights.learningStreak}</p>
                <p className="text-sm text-gray-600">Days in a row</p>
              </div>
              <div className="text-6xl">🔥</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderProgress = () => {
    if (!analyticsData) return null;

    return (
      <div className="space-y-6">
        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.weeklyProgress.map((day, index) => (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Points: {day.points}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(day.points / 60) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📚 {day.learningHours}h</span>
                      <span>🎥 {day.contentConsumed} content</span>
                      <span>💡 {day.insightsShared} insights</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Top Content Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.contentInsights.topCategories.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="font-medium">{category.category}</span>
                    <Badge variant="outline">{category.count} items</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{category.resonance}% resonance</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${category.resonance}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderInsights = () => {
    if (!analyticsData) return null;

    const { contentInsights } = analyticsData;

    return (
      <div className="space-y-6">
        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Consciousness Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Learning Pattern Analysis</h4>
                <p className="text-sm text-blue-700">
                  You show strong engagement with meditation content (85% resonance) and prefer 
                  morning learning sessions. Your consciousness development is progressing 
                  steadily across all dimensions.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Recommended Next Steps</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Explore advanced meditation techniques to deepen your practice</li>
                  <li>• Share more insights to strengthen your service dimension</li>
                  <li>• Try content during your optimal learning times (morning, evening)</li>
                  <li>• Consider joining a wisdom circle for community learning</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Consciousness Growth Opportunities</h4>
                <p className="text-sm text-purple-700">
                  Your intuition dimension has the most growth potential. Consider exploring 
                  content about inner knowing, psychic development, and spiritual guidance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Content Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {contentInsights.averageResonance.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Average Resonance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {contentInsights.favoriteContentType}
                </div>
                <div className="text-sm text-gray-600">Preferred Format</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {contentInsights.totalContent}
                </div>
                <div className="text-sm text-gray-600">Total Content</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCommunity = () => {
    if (!analyticsData) return null;

    const { communityStats } = analyticsData;

    return (
      <div className="space-y-6">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{communityStats.insightsShared}</div>
              <div className="text-sm text-gray-600">Insights Shared</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{communityStats.likesReceived}</div>
              <div className="text-sm text-gray-600">Likes Received</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{communityStats.wisdomCirclesJoined}</div>
              <div className="text-sm text-gray-600">Wisdom Circles</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">{communityStats.mentorshipProvided}</div>
              <div className="text-sm text-gray-600">Mentorship Given</div>
            </CardContent>
          </Card>
        </div>

        {/* Community Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Community Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-green-900">Wisdom Contributor</h4>
                  <p className="text-sm text-green-700">Your insights are helping others on their journey</p>
                </div>
                <Award className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-blue-900">Active Learner</h4>
                  <p className="text-sm text-blue-700">Consistent engagement with the community</p>
                </div>
                <Star className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTiming = () => {
    if (!analyticsData) return null;

    const { sacredTiming } = analyticsData;

    return (
      <div className="space-y-6">
        {/* Sacred Timing Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Sacred Timing Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Optimal Learning Times</h4>
                  <div className="flex flex-wrap gap-2">
                    {sacredTiming.optimalLearningTimes.map((time) => (
                      <Badge key={time} variant="outline" className="capitalize">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Energy Frequency</h4>
                  <Badge className="bg-purple-100 text-purple-800">
                    {sacredTiming.energyFrequency}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Lunar Phase Preference</h4>
                  <Badge variant="outline" className="capitalize">
                    {sacredTiming.lunarPhase} Moon
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Solar Position</h4>
                  <Badge variant="outline" className="capitalize">
                    {sacredTiming.solarPosition}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timing Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Timing Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Best Learning Times</h4>
                <p className="text-sm text-blue-700">
                  Focus on learning during {sacredTiming.optimalLearningTimes.join(' and ')} 
                  for maximum absorption and retention.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">Energy Alignment</h4>
                <p className="text-sm text-green-700">
                  Your preferred {sacredTiming.energyFrequency} frequency aligns with 
                  {sacredTiming.energyFrequency === '528Hz' ? ' love and transformation' :
                   sacredTiming.energyFrequency === '432Hz' ? ' natural harmony' :
                   sacredTiming.energyFrequency === '741Hz' ? ' self-expression' : ' intuition and spiritual connection'}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Consciousness Analytics</h2>
          <p className="text-gray-600">Track your journey of consciousness development</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="timing">Timing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          {renderProgress()}
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          {renderInsights()}
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          {renderCommunity()}
        </TabsContent>

        <TabsContent value="timing" className="mt-6">
          {renderTiming()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
