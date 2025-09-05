/**
 * Sacred Shifter Sacred Initiation Dashboard
 * Complete initiation management with ceremonial components
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Sparkles, 
  Flame, 
  Star, 
  Eye,
  Zap,
  Shield,
  Key,
  Lock,
  CheckCircle,
  Play,
  Calendar,
  Award,
  BookOpen,
  Users,
  Target,
  TrendingUp
} from 'lucide-react';
import { 
  useSacredSeals, 
  useUserInitiations, 
  useSacredProgress, 
  useCheckSeals,
  SacredSeal,
  UserInitiation
} from '@/hooks/useSacredInitiations';
import { SacredInitiationCeremony } from './SacredInitiationCeremony';
import { SacredSealVisualization } from './SacredSealVisualization';

export const SacredInitiationDashboard: React.FC = () => {
  const { data: seals, isLoading: sealsLoading } = useSacredSeals();
  const { data: initiations, isLoading: initiationsLoading } = useUserInitiations();
  const { data: progress, isLoading: progressLoading } = useSacredProgress();
  const { mutate: checkSeals, isPending: isCheckingSeals } = useCheckSeals();

  const [selectedSeal, setSelectedSeal] = useState<SacredSeal | null>(null);
  const [showCeremony, setShowCeremony] = useState(false);
  const [ceremonyInitiation, setCeremonyInitiation] = useState<UserInitiation | null>(null);

  // Find pending ceremonies
  const pendingCeremonies = initiations?.filter(init => 
    !init.ceremony_completed && init.ceremony_completed_at === null
  ) || [];

  // Find available seals (not yet earned)
  const earnedSealIds = initiations?.map(init => init.seal_id) || [];
  const availableSeals = seals?.filter(seal => !earnedSealIds.includes(seal.id)) || [];

  // Get current highest seal
  const currentSeal = initiations?.[0] || null;

  const handleActivateSeal = (seal: SacredSeal) => {
    setSelectedSeal(seal);
  };

  const handleStartCeremony = (initiation: UserInitiation) => {
    setCeremonyInitiation(initiation);
    setShowCeremony(true);
  };

  const handleCeremonyComplete = () => {
    setShowCeremony(false);
    setCeremonyInitiation(null);
    // Refresh data
    window.location.reload();
  };

  const getSealIcon = (geometryType: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'flower-of-life': <Star className="w-5 h-5" />,
      'metatron-cube': <Shield className="w-5 h-5" />,
      'merkaba': <Zap className="w-5 h-5" />,
      'tree-of-life': <Eye className="w-5 h-5" />
    };
    return icons[geometryType] || <Crown className="w-5 h-5" />;
  };

  const getSealColor = (colorSignature: string) => {
    const colorMap: { [key: string]: string } = {
      'gold': 'text-yellow-500',
      'silver': 'text-gray-400',
      'purple': 'text-purple-500',
      'blue': 'text-blue-500',
      'green': 'text-green-500',
      'red': 'text-red-500',
      'orange': 'text-orange-500'
    };
    return colorMap[colorSignature.toLowerCase()] || 'text-purple-500';
  };

  if (sealsLoading || initiationsLoading || progressLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sacred initiations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Crown className="w-6 h-6 text-gold-400" />
              Sacred Initiation Dashboard
            </CardTitle>
            <Button 
              onClick={() => checkSeals()} 
              disabled={isCheckingSeals}
              className="bg-gold-500 hover:bg-gold-600"
            >
              {isCheckingSeals ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Check Progress
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{initiations?.length || 0}</div>
              <div className="text-sm text-purple-200">Seals Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{pendingCeremonies.length}</div>
              <div className="text-sm text-purple-200">Pending Ceremonies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{progress?.total_routines || 0}</div>
              <div className="text-sm text-purple-200">Total Practices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{progress?.current_streak || 0}</div>
              <div className="text-sm text-purple-200">Current Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Ceremonies Alert */}
      {pendingCeremonies.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="font-semibold text-amber-300">Sacred Ceremonies Await</h3>
                  <p className="text-sm text-amber-200">
                    You have {pendingCeremonies.length} ceremony{pendingCeremonies.length > 1 ? 'ies' : ''} ready to be completed
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => handleStartCeremony(pendingCeremonies[0])}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Begin Ceremony
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="seals">Sacred Seals</TabsTrigger>
          <TabsTrigger value="ceremonies">Ceremonies</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
        </TabsList>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Seal */}
            {currentSeal && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-gold-400" />
                    Current Seal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <div className={`text-3xl ${getSealColor(currentSeal.seal.color_signature)}`}>
                      {getSealIcon(currentSeal.seal.geometry_type)}
                    </div>
                    <h3 className="font-semibold text-white">{currentSeal.seal.seal_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentSeal.seal.description_text}
                    </p>
                    <Badge variant="outline" className="border-gold-400/50 text-gold-300">
                      Order {currentSeal.seal.seal_order}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Sacred Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Routines Completed</span>
                    <span className="text-white">{progress?.total_routines || 0}</span>
                  </div>
                  <Progress value={(progress?.total_routines || 0) / 100 * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Streak</span>
                    <span className="text-white">{progress?.current_streak || 0}</span>
                  </div>
                  <Progress value={(progress?.current_streak || 0) / 30 * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Journal Entries</span>
                    <span className="text-white">{progress?.journal_entries || 0}</span>
                  </div>
                  <Progress value={(progress?.journal_entries || 0) / 50 * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sacred Seals Tab */}
        <TabsContent value="seals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seals?.map((seal) => {
              const isEarned = earnedSealIds.includes(seal.id);
              const isPending = pendingCeremonies.some(init => init.seal_id === seal.id);
              
              return (
                <motion.div
                  key={seal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Card className={`${
                    isEarned 
                      ? 'bg-gradient-to-br from-gold-500/10 to-yellow-500/10 border-gold-400/30' 
                      : isPending
                      ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-400/30'
                      : 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-400/30'
                  }`}>
                    <CardHeader className="text-center">
                      <div className={`text-4xl mx-auto mb-2 ${getSealColor(seal.color_signature)}`}>
                        {getSealIcon(seal.geometry_type)}
                      </div>
                      <CardTitle className="text-lg">{seal.seal_name}</CardTitle>
                      <Badge variant="outline" className="w-fit mx-auto">
                        Order {seal.seal_order}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground text-center">
                        {seal.description_text}
                      </p>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Min Routines:</span>
                          <span>{seal.minimum_routines}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Streak Days:</span>
                          <span>{seal.requires_streak_days}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Journal Entries:</span>
                          <span>{seal.requires_journal_entries}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        {isEarned ? (
                          <Badge className="w-full justify-center bg-gold-500 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Earned
                          </Badge>
                        ) : isPending ? (
                          <Button 
                            onClick={() => handleStartCeremony(pendingCeremonies.find(init => init.seal_id === seal.id)!)}
                            className="w-full bg-amber-500 hover:bg-amber-600"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Complete Ceremony
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleActivateSeal(seal)}
                            variant="outline"
                            className="w-full border-purple-400/50 text-purple-300"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Requirements
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Ceremonies Tab */}
        <TabsContent value="ceremonies" className="space-y-4">
          <div className="space-y-4">
            {initiations?.map((initiation) => (
              <Card key={initiation.id} className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-400/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl ${getSealColor(initiation.seal.color_signature)}`}>
                        {getSealIcon(initiation.seal.geometry_type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{initiation.seal.seal_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Awarded {new Date(initiation.awarded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {initiation.ceremony_completed ? (
                        <Badge className="bg-gold-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ceremony Complete
                        </Badge>
                      ) : (
                        <Button 
                          onClick={() => handleStartCeremony(initiation)}
                          className="bg-amber-500 hover:bg-amber-600"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Begin Ceremony
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Visualization Tab */}
        <TabsContent value="visualization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seals?.slice(0, 4).map((seal) => (
              <SacredSealVisualization
                key={seal.id}
                seal={seal}
                isActive={selectedSeal?.id === seal.id}
                onActivate={() => handleActivateSeal(seal)}
                showControls={true}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Ceremony Modal */}
      {showCeremony && ceremonyInitiation && (
        <SacredInitiationCeremony
          initiation={ceremonyInitiation}
          onComplete={handleCeremonyComplete}
          onClose={() => setShowCeremony(false)}
        />
      )}
    </div>
  );
};
