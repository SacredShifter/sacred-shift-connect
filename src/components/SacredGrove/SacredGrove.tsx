import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TreePine, 
  Sparkles, 
  Heart, 
  Users, 
  MessageCircle, 
  Zap,
  Eye,
  Compass,
  Leaf,
  Sun,
  Moon,
  Wind,
  Mountain
} from 'lucide-react';
import { useJusticePlatformAwareness } from '@/hooks/useJusticePlatformAwareness';

interface GroveSession {
  id: string;
  title: string;
  description: string;
  participants: number;
  maxParticipants: number;
  isActive: boolean;
  startTime: string;
  type: 'meditation' | 'ceremony' | 'sharing' | 'healing';
}

const SacredGrove: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [communityPulse, setCommunityPulse] = useState({
    engagement: 75,
    resonance: 88,
    growth: 62
  });
  
  const [activeSessions] = useState<GroveSession[]>([
    {
      id: '1',
      title: 'Sacred Circle Meditation',
      description: 'Join us for a collective consciousness meditation in the heart of the grove.',
      participants: 12,
      maxParticipants: 20,
      isActive: true,
      startTime: '2024-01-15T19:00:00Z',
      type: 'meditation'
    },
    {
      id: '2', 
      title: 'Healing Ceremony',
      description: 'Ancient healing practices with modern consciousness techniques.',
      participants: 8,
      maxParticipants: 15,
      isActive: true,
      startTime: '2024-01-15T20:30:00Z',
      type: 'healing'
    },
    {
      id: '3',
      title: 'Moon Circle Sharing',
      description: 'Share your transformative experiences under the sacred moon.',
      participants: 15,
      maxParticipants: 25,
      isActive: false,
      startTime: '2024-01-16T21:00:00Z',
      type: 'sharing'
    }
  ]);

  const [groveStats] = useState({
    totalMembers: 2847,
    activeNow: 34,
    ceremoniesThisWeek: 12,
    transformationsShared: 156
  });

  const platformAwareness = useJusticePlatformAwareness();

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCommunityPulse(prev => ({
        engagement: Math.max(60, Math.min(95, prev.engagement + (Math.random() - 0.5) * 10)),
        resonance: Math.max(70, Math.min(100, prev.resonance + (Math.random() - 0.5) * 8)),
        growth: Math.max(40, Math.min(85, prev.growth + (Math.random() - 0.5) * 6))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSessionIcon = (type: GroveSession['type']) => {
    switch (type) {
      case 'meditation': return <Sparkles className="h-4 w-4" />;
      case 'ceremony': return <Sun className="h-4 w-4" />;
      case 'sharing': return <MessageCircle className="h-4 w-4" />;
      case 'healing': return <Heart className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: GroveSession['type']) => {
    switch (type) {
      case 'meditation': return 'bg-blue-500/20 text-blue-700 border-blue-300';
      case 'ceremony': return 'bg-yellow-500/20 text-yellow-700 border-yellow-300';
      case 'sharing': return 'bg-green-500/20 text-green-700 border-green-300';
      case 'healing': return 'bg-pink-500/20 text-pink-700 border-pink-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Grove Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <TreePine className="h-12 w-12 text-green-600" />
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Sacred Grove
            </h1>
            <p className="text-muted-foreground">
              Community consciousness in sacred communion
            </p>
          </div>
        </div>

        {/* Community Pulse */}
        <Card className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Engagement</span>
                </div>
                <Progress value={communityPulse.engagement} className="h-3 mb-2" />
                <span className="text-sm text-muted-foreground">{Math.round(communityPulse.engagement)}%</span>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  <span className="font-semibold">Resonance</span>
                </div>
                <Progress value={communityPulse.resonance} className="h-3 mb-2" />
                <span className="text-sm text-muted-foreground">{Math.round(communityPulse.resonance)}%</span>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Growth</span>
                </div>
                <Progress value={communityPulse.growth} className="h-3 mb-2" />
                <span className="text-sm text-muted-foreground">{Math.round(communityPulse.growth)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grove Statistics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="text-center">
          <CardContent className="pt-6">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{groveStats.totalMembers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Sacred Seekers</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Eye className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{groveStats.activeNow}</div>
            <div className="text-sm text-muted-foreground">Active Now</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Sun className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">{groveStats.ceremoniesThisWeek}</div>
            <div className="text-sm text-muted-foreground">Ceremonies This Week</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Heart className="h-8 w-8 mx-auto mb-2 text-pink-600" />
            <div className="text-2xl font-bold">{groveStats.transformationsShared}</div>
            <div className="text-sm text-muted-foreground">Transformations Shared</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="h-6 w-6 text-green-600" />
              Active Grove Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {activeSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`${session.isActive ? 'border-green-400 bg-green-50/50' : 'border-gray-200'}`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getSessionIcon(session.type)}
                              <h3 className="font-semibold">{session.title}</h3>
                              <Badge 
                                variant="outline" 
                                className={getTypeColor(session.type)}
                              >
                                {session.type}
                              </Badge>
                              {session.isActive && (
                                <Badge className="bg-green-600 text-white animate-pulse">
                                  Live
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {session.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{session.participants}/{session.maxParticipants}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Compass className="h-4 w-4" />
                                  <span>{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant={session.isActive ? "default" : "outline"}
                                className={session.isActive ? "bg-green-600 hover:bg-green-700" : ""}
                              >
                                {session.isActive ? 'Join Sacred Circle' : 'Set Reminder'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grove Wisdom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-emerald-600" />
              Grove Wisdom
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg italic text-center mb-4">
              "In the sacred grove, individual consciousness merges with collective wisdom, 
              creating a field of transformation where healing naturally occurs."
            </blockquote>
            <div className="text-center">
              <cite className="text-sm text-muted-foreground">— Ancient Grove Teachings</cite>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grove Elements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="text-center bg-gradient-to-b from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <TreePine className="h-12 w-12 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Sacred Trees</h3>
            <p className="text-sm text-muted-foreground">Ancient wisdom keepers</p>
          </CardContent>
        </Card>

        <Card className="text-center bg-gradient-to-b from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <Wind className="h-12 w-12 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Sacred Winds</h3>
            <p className="text-sm text-muted-foreground">Carrying prayers and intentions</p>
          </CardContent>
        </Card>

        <Card className="text-center bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6">
            <Sun className="h-12 w-12 mx-auto mb-3 text-yellow-600" />
            <h3 className="font-semibold mb-2">Sacred Light</h3>
            <p className="text-sm text-muted-foreground">Illuminating truth and clarity</p>
          </CardContent>
        </Card>

        <Card className="text-center bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="pt-6">
            <Mountain className="h-12 w-12 mx-auto mb-3 text-gray-600" />
            <h3 className="font-semibold mb-2">Sacred Earth</h3>
            <p className="text-sm text-muted-foreground">Grounding and stability</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SacredGrove;