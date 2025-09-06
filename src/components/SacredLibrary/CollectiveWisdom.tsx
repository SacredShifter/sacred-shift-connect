import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Star, Users, Crown, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConsciousnessProfile, ConsciousnessLevel, CONSCIOUSNESS_LEVELS } from '@/types/consciousness';
import { ContentItem } from '@/hooks/useContentSources';

interface WisdomInsight {
  id: string;
  user_id: string;
  content_id: string;
  insight_text: string;
  consciousness_level: ConsciousnessLevel;
  user_name: string;
  user_avatar?: string;
  created_at: string;
  likes: number;
  is_liked: boolean;
  tags: string[];
  resonance_score: number;
  wisdom_type: 'insight' | 'question' | 'practice' | 'experience' | 'teaching';
}

interface WisdomCircle {
  id: string;
  name: string;
  description: string;
  consciousness_level: ConsciousnessLevel;
  member_count: number;
  is_member: boolean;
  created_by: string;
  created_at: string;
  topics: string[];
  energy_frequency: string;
}

interface CollectiveWisdomProps {
  content: ContentItem | null;
  userProfile: ConsciousnessProfile | null;
  onInsightShare: (insight: string) => void;
}

export const CollectiveWisdom: React.FC<CollectiveWisdomProps> = ({
  content,
  userProfile,
  onInsightShare
}) => {
  const [insights, setInsights] = useState<WisdomInsight[]>([]);
  const [circles, setCircles] = useState<WisdomCircle[]>([]);
  const [newInsight, setNewInsight] = useState('');
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'insights' | 'circles' | 'share'>('insights');
  const [loading, setLoading] = useState(false);

  // Mock data - in real implementation, this would come from the API
  useEffect(() => {
    if (content) {
      setInsights([
        {
          id: '1',
          user_id: 'user1',
          content_id: content.id,
          insight_text: 'This content really opened my eyes to the power of presence. I\'ve been practicing the breathing technique mentioned and it\'s transformed my daily meditation.',
          consciousness_level: 'adept',
          user_name: 'Sarah Chen',
          user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          created_at: '2024-01-15T10:30:00Z',
          likes: 24,
          is_liked: false,
          tags: ['presence', 'breathing', 'meditation'],
          resonance_score: 87,
          wisdom_type: 'experience'
        },
        {
          id: '2',
          user_id: 'user2',
          content_id: content.id,
          insight_text: 'I\'m curious about how this relates to the chakra system. Has anyone experienced specific chakra activations during this practice?',
          consciousness_level: 'student',
          user_name: 'Marcus Johnson',
          user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          created_at: '2024-01-15T09:15:00Z',
          likes: 12,
          is_liked: true,
          tags: ['chakras', 'question', 'energy'],
          resonance_score: 72,
          wisdom_type: 'question'
        },
        {
          id: '3',
          user_id: 'user3',
          content_id: content.id,
          insight_text: 'For those new to this practice, I recommend starting with just 5 minutes daily. The key is consistency over intensity. Trust the process.',
          consciousness_level: 'teacher',
          user_name: 'Elena Rodriguez',
          user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          created_at: '2024-01-15T08:45:00Z',
          likes: 31,
          is_liked: false,
          tags: ['beginner', 'advice', 'consistency'],
          resonance_score: 94,
          wisdom_type: 'teaching'
        }
      ]);

      setCircles([
        {
          id: '1',
          name: 'Consciousness Seekers',
          description: 'A circle for those beginning their consciousness journey',
          consciousness_level: 'initiate',
          member_count: 1247,
          is_member: true,
          created_by: 'user1',
          created_at: '2024-01-01T00:00:00Z',
          topics: ['meditation', 'mindfulness', 'beginner'],
          energy_frequency: '432Hz'
        },
        {
          id: '2',
          name: 'Wisdom Teachers',
          description: 'Advanced practitioners sharing their knowledge',
          consciousness_level: 'teacher',
          member_count: 89,
          is_member: false,
          created_by: 'user2',
          created_at: '2024-01-05T00:00:00Z',
          topics: ['teaching', 'mentorship', 'advanced'],
          energy_frequency: '528Hz'
        },
        {
          id: '3',
          name: 'Energy Healers',
          description: 'Focus on energy work and healing practices',
          consciousness_level: 'practitioner',
          member_count: 456,
          is_member: true,
          created_by: 'user3',
          created_at: '2024-01-10T00:00:00Z',
          topics: ['healing', 'energy', 'chakras'],
          energy_frequency: '741Hz'
        }
      ]);
    }
  }, [content]);

  const handleShareInsight = async () => {
    if (!newInsight.trim() || !userProfile) return;

    setLoading(true);
    try {
      // In real implementation, this would call the API
      const insight: WisdomInsight = {
        id: Date.now().toString(),
        user_id: userProfile.user_id,
        content_id: content!.id,
        insight_text: newInsight,
        consciousness_level: userProfile.current_level,
        user_name: 'You',
        created_at: new Date().toISOString(),
        likes: 0,
        is_liked: false,
        tags: extractTags(newInsight),
        resonance_score: calculateResonanceScore(newInsight),
        wisdom_type: classifyWisdomType(newInsight)
      };

      setInsights(prev => [insight, ...prev]);
      setNewInsight('');
      onInsightShare(newInsight);
      
      // Track insight sharing
      // await trackInsightSharing(newInsight);
      
    } catch (error) {
      console.error('Error sharing insight:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeInsight = (insightId: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId 
        ? { 
            ...insight, 
            is_liked: !insight.is_liked,
            likes: insight.is_liked ? insight.likes - 1 : insight.likes + 1
          }
        : insight
    ));
  };

  const handleJoinCircle = (circleId: string) => {
    setCircles(prev => prev.map(circle => 
      circle.id === circleId 
        ? { 
            ...circle, 
            is_member: !circle.is_member,
            member_count: circle.is_member ? circle.member_count - 1 : circle.member_count + 1
          }
        : circle
    ));
  };

  const extractTags = (text: string): string[] => {
    const commonTags = [
      'meditation', 'mindfulness', 'breathing', 'energy', 'chakras', 'healing',
      'presence', 'awareness', 'consciousness', 'spirituality', 'wisdom',
      'beginner', 'advanced', 'practice', 'teaching', 'experience'
    ];
    
    return commonTags.filter(tag => 
      text.toLowerCase().includes(tag)
    ).slice(0, 3);
  };

  const calculateResonanceScore = (text: string): number => {
    // Simple heuristic based on text length and spiritual keywords
    const spiritualKeywords = [
      'consciousness', 'awareness', 'presence', 'wisdom', 'insight',
      'transformation', 'healing', 'love', 'peace', 'unity'
    ];
    
    const keywordCount = spiritualKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    ).length;
    
    const baseScore = Math.min(100, text.length * 2);
    const keywordBonus = keywordCount * 10;
    
    return Math.min(100, baseScore + keywordBonus);
  };

  const classifyWisdomType = (text: string): WisdomInsight['wisdom_type'] => {
    if (text.includes('?')) return 'question';
    if (text.includes('practice') || text.includes('technique')) return 'practice';
    if (text.includes('experienced') || text.includes('felt')) return 'experience';
    if (text.includes('recommend') || text.includes('suggest')) return 'teaching';
    return 'insight';
  };

  const getWisdomTypeIcon = (type: WisdomInsight['wisdom_type']) => {
    switch (type) {
      case 'question': return <MessageCircle className="w-4 h-4" />;
      case 'practice': return <BookOpen className="w-4 h-4" />;
      case 'experience': return <Heart className="w-4 h-4" />;
      case 'teaching': return <Crown className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getWisdomTypeColor = (type: WisdomInsight['wisdom_type']) => {
    switch (type) {
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'practice': return 'bg-green-100 text-green-800';
      case 'experience': return 'bg-pink-100 text-pink-800';
      case 'teaching': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderInsight = (insight: WisdomInsight) => (
    <motion.div
      key={insight.id}
      className="bg-white rounded-lg border border-gray-200 p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={insight.user_avatar} />
          <AvatarFallback>{insight.user_name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm">{insight.user_name}</span>
            <Badge variant="secondary" className="text-xs">
              {CONSCIOUSNESS_LEVELS[insight.consciousness_level].title}
            </Badge>
            <Badge className={`text-xs ${getWisdomTypeColor(insight.wisdom_type)}`}>
              {getWisdomTypeIcon(insight.wisdom_type)}
              <span className="ml-1 capitalize">{insight.wisdom_type}</span>
            </Badge>
          </div>
          
          <p className="text-gray-700 mb-3">{insight.insight_text}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLikeInsight(insight.id)}
                className={`flex items-center gap-1 text-sm ${
                  insight.is_liked ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${insight.is_liked ? 'fill-current' : ''}`} />
                {insight.likes}
              </button>
              
              <button className="flex items-center gap-1 text-sm text-gray-500">
                <MessageCircle className="w-4 h-4" />
                Reply
              </button>
              
              <button className="flex items-center gap-1 text-sm text-gray-500">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Sparkles className="w-3 h-3" />
                {insight.resonance_score}% resonance
              </div>
              <div className="text-xs text-gray-400">
                {new Date(insight.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {insight.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {insight.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderCircle = (circle: WisdomCircle) => (
    <motion.div
      key={circle.id}
      className="bg-white rounded-lg border border-gray-200 p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium">{circle.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {CONSCIOUSNESS_LEVELS[circle.consciousness_level].title}
            </Badge>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">{circle.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {circle.member_count} members
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {circle.energy_frequency}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {circle.topics.map(topic => (
              <Badge key={topic} variant="outline" className="text-xs">
                #{topic}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button
          size="sm"
          variant={circle.is_member ? "outline" : "default"}
          onClick={() => handleJoinCircle(circle.id)}
          className="ml-4"
        >
          {circle.is_member ? 'Leave' : 'Join'}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Collective Wisdom</h2>
        <Badge variant="outline" className="text-sm">
          {insights.length} insights
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        {[
          { key: 'insights', label: 'Insights', icon: Lightbulb },
          { key: 'circles', label: 'Wisdom Circles', icon: Users },
          { key: 'share', label: 'Share Insight', icon: MessageCircle }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {insights.length > 0 ? (
              insights.map(renderInsight)
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No insights yet. Be the first to share your wisdom!</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'circles' && (
          <motion.div
            key="circles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {circles.length > 0 ? (
              circles.map(renderCircle)
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No wisdom circles available yet.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'share' && (
          <motion.div
            key="share"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Share Your Insight</CardTitle>
                <p className="text-sm text-gray-600">
                  Share your wisdom and experiences with the community
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Share your insight, question, or experience about this content..."
                    value={newInsight}
                    onChange={(e) => setNewInsight(e.target.value)}
                    className="min-h-[120px]"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {newInsight.length} characters
                    </div>
                    
                    <Button
                      onClick={handleShareInsight}
                      disabled={!newInsight.trim() || loading}
                      className="gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {loading ? 'Sharing...' : 'Share Insight'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
