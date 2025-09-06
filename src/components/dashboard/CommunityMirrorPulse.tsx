import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, ChevronRight, Users, Sparkles, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const CommunityMirrorPulse = () => {
  const [activeSigil, setActiveSigil] = useState('◊');
  const [formationProgress, setFormationProgress] = useState(67);
  
  // Get real community data
  const { data: collectiveData, isLoading } = useQuery({
    queryKey: ['community-pulse'],
    queryFn: async () => {
      // Get today's date range
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      // Get community statistics
      const [meditationResponse, journalResponse, profilesResponse] = await Promise.all([
        supabase
          .from('meditation_sessions')
          .select('id')
          .gte('created_at', startOfDay.toISOString())
          .lt('created_at', endOfDay.toISOString()),
        
        supabase
          .from('mirror_journal_entries')
          .select('id')
          .gte('created_at', startOfDay.toISOString())
          .lt('created_at', endOfDay.toISOString()),
        
        supabase
          .from('profiles')
          .select('synchronicity_score, resonance_tags')
      ]);

      const activeMeditations = meditationResponse.data?.length || 0;
      const mirrorReadingsToday = journalResponse.data?.length || 0;
      const totalProfiles = profilesResponse.data?.length || 0;
      
      // Calculate average resonance from profiles
      const avgResonance = profilesResponse.data?.length > 0 
        ? Math.round(profilesResponse.data.reduce((sum, profile) => sum + (profile.synchronicity_score || 0), 0) / profilesResponse.data.length)
        : 0;

      return {
        activeMeditations,
        sacredCircles: Math.max(1, Math.floor(totalProfiles / 10)), // Estimate circles
        globalResonance: Math.max(50, avgResonance), // Ensure minimum 50%
        mirrorReadingsToday,
        collectiveSignil: 'Unity Consciousness',
        resonanceField: avgResonance > 70 ? 'Ascending' : avgResonance > 50 ? 'Stable' : 'Building'
      };
    }
  });

  const communitySignils = ['◊', '∴', '⟡', '※', '◈'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSigil(prev => {
        const currentIndex = communitySignils.indexOf(prev);
        return communitySignils[(currentIndex + 1) % communitySignils.length];
      });
      setFormationProgress(prev => (prev + Math.random() * 3 - 1.5));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-rose-500/10 to-pink-500/5 border-rose-500/20 relative overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Heart className="w-4 h-4 text-rose-500" />
            Community Mirror Pulse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-16 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-rose-500/10 to-pink-500/5 border-rose-500/20 relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-rose-500" />
          Community Mirror Pulse
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-auto"
          >
            <Badge variant="secondary" className="bg-rose-500/20 text-rose-700 border-rose-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              {collectiveData?.resonanceField || 'Building'}
            </Badge>
          </motion.div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Collective Sigil Formation */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-rose-500/10 to-rose-500/5 border border-rose-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium">Collective Sigil Forming</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSigil}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="text-lg text-rose-500 font-mono"
              >
                {activeSigil}
              </motion.div>
            </AnimatePresence>
          </div>
                      <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{collectiveData?.collectiveSignil || 'Unity Consciousness'}</span>
                <span className="font-medium">{Math.round(formationProgress)}%</span>
              </div>
              <Progress value={formationProgress} className="h-2" />
            </div>
        </div>

        {/* Live Community Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-2 rounded bg-rose-500/5">
            <span className="text-xs text-muted-foreground">Mirror Readings</span>
            <motion.span
              key={collectiveData?.mirrorReadingsToday || 0}
              initial={{ scale: 1.2, color: '#f43f5e' }}
              animate={{ scale: 1, color: 'inherit' }}
              className="font-semibold text-sm"
            >
              {collectiveData?.mirrorReadingsToday || 0}
            </motion.span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-rose-500/5">
            <span className="text-xs text-muted-foreground">Active Circles</span>
            <span className="font-semibold text-sm">{collectiveData?.sacredCircles || 0}</span>
          </div>
        </div>

        {/* Traditional Community Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Collective Meditations Today</span>
            <span className="font-semibold">{collectiveData?.activeMeditations || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Global Resonance Field</span>
            <div className="flex items-center gap-2">
              <Progress value={collectiveData?.globalResonance || 50} className="w-16 h-2" />
              <span className="text-sm font-semibold">{collectiveData?.globalResonance || 50}%</span>
            </div>
          </div>
        </div>

        <Link to="/circles" className="block">
          <Button variant="outline" size="sm" className="w-full mt-4 border-rose-500/30 text-rose-600 hover:bg-rose-500/10">
            <Users className="w-3 h-3 mr-2" />
            Join Community Mirror
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardContent>

      {/* Ambient glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-radial from-rose-500/20 via-transparent to-transparent"
        />
      </div>
    </Card>
  );
};