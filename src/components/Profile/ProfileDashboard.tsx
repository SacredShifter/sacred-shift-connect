import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Calendar, 
  Globe, 
  Heart, 
  Sparkles, 
  Users, 
  Target,
  Flame,
  BookOpen,
  Wind,
  Clock,
  TrendingUp,
  Edit
} from 'lucide-react';
import { Profile } from '@/hooks/useProfile';

interface ProfileDashboardProps {
  profile: Profile;
  onEdit: () => void;
}

const journeyStageInfo = {
  'Entry': { 
    progress: 20, 
    color: 'text-red-500', 
    description: 'Beginning the sacred journey' 
  },
  'Expansion': { 
    progress: 40, 
    color: 'text-orange-500', 
    description: 'Expanding awareness and consciousness' 
  },
  'Integration': { 
    progress: 60, 
    color: 'text-yellow-500', 
    description: 'Integrating wisdom and practices' 
  },
  'Crown': { 
    progress: 80, 
    color: 'text-green-500', 
    description: 'Approaching mastery and service' 
  },
  'Beyond': { 
    progress: 100, 
    color: 'text-purple-500', 
    description: 'Transcendent consciousness embodied' 
  },
};

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ profile, onEdit }) => {
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0 || diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const stageInfo = journeyStageInfo[profile.current_stage || 'Entry'];
  const totalSessions = (profile.total_meditation_minutes || 0) + (profile.total_journal_entries || 0) + (profile.total_breath_sessions || 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <Card className="sacred-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                {profile.aura_signature && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-yellow-800" />
                  </div>
                )}
              </div>
              
              <div>
                <CardTitle className="text-2xl">{profile.full_name || 'Anonymous Shifter'}</CardTitle>
                {profile.soul_identity && (
                  <p className="text-lg text-primary font-medium">{profile.soul_identity}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {profile.date_of_birth && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {calculateAge(profile.date_of_birth)} years old
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {profile.timezone || 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Last active {formatLastLogin(profile.last_login)}
                  </span>
                </div>
              </div>
            </div>
            
            <Button onClick={onEdit} variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Progress */}
        <Card className="sacred-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5" />
              Journey Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`${stageInfo.color} border-current`}>
                  {profile.current_stage || 'Entry'}
                </Badge>
                <span className="text-sm font-medium">{stageInfo.progress}%</span>
              </div>
              <Progress value={stageInfo.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {stageInfo.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{profile.streak_days || 0}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{profile.synchronicity_score || 0}</div>
                  <div className="text-xs text-muted-foreground">Sync Score</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice Stats */}
        <Card className="sacred-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5" />
              Practice Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <Flame className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">Meditation</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{profile.total_meditation_minutes || 0}m</div>
                  <div className="text-xs text-muted-foreground">total</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">Journal Entries</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{profile.total_journal_entries || 0}</div>
                  <div className="text-xs text-muted-foreground">entries</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <Wind className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">Breath Sessions</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{profile.total_breath_sessions || 0}</div>
                  <div className="text-xs text-muted-foreground">sessions</div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{totalSessions}</div>
                  <div className="text-xs text-muted-foreground">Total Sacred Practices</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resonance Profile */}
        <Card className="sacred-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5" />
              Resonance Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.aura_signature && (
                <div>
                  <Label className="text-xs text-muted-foreground">Aura Signature</Label>
                  <Badge variant="secondary" className="w-full justify-center mt-1">
                    {profile.aura_signature}
                  </Badge>
                </div>
              )}

              {(profile.resonance_tags || []).length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Resonance Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(profile.resonance_tags || []).slice(0, 6).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(profile.resonance_tags || []).length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{(profile.resonance_tags || []).length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {(profile.circles_joined || []).length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Sacred Circles</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      {(profile.circles_joined || []).length} circle{(profile.circles_joined || []).length !== 1 ? 's' : ''} joined
                    </span>
                  </div>
                </div>
              )}

              {(profile.synchronicity_chain || []).length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Recent Synchronicity</Label>
                  <div className="text-xs text-muted-foreground mt-1">
                    {(profile.synchronicity_chain || []).slice(-3).join(' → ')}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};