import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Video, Mic, Sparkles, Heart, MessageCircle, Share2, Zap, Star } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface SacredPost {
  id: string;
  user_id: string;
  content: string;
  visibility?: string;
  chakra_tag?: string;
  tone?: string;
  frequency?: number;
  is_anonymous?: boolean;
  has_audio?: boolean;
  has_image?: boolean;
  audio_url?: string; 
  image_url?: string;
  group_id?: string;
  created_at: string;
  updated_at: string;
  // New social features (from migration)
  post_type?: string;
  media_urls?: string[];
  consciousness_metadata?: any;
  engagement_stats?: any;
  mood_signature?: string;
  user_profiles?: {
    display_name?: string;
    avatar_url?: string;
    consciousness_signature?: any;
    sacred_role?: string;
  };
  post_reactions?: Array<{
    reaction_type: string;
    user_id: string;
    reaction_intensity: number;
  }>;
  post_comments?: Array<{
    id: string;
    content: string;
    user_id: string;
    created_at: string;
  }>;
}

interface SacredSocialFeedProps {
  className?: string;
  feedType?: 'global' | 'circles' | 'friends';
}

export const SacredSocialFeed: React.FC<SacredSocialFeedProps> = ({ 
  className = "",
  feedType = 'global'
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<SacredPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'text' | 'image' | 'video' | 'audio' | 'sacred_sigil'>('text');
  const [consciousnessState, setConsciousnessState] = useState('balanced');
  const [chakraTag, setChakraTag] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  const consciousnessStates = [
    { value: 'elevated', label: '✨ Elevated', color: 'hsl(var(--primary))' },
    { value: 'balanced', label: '🌟 Balanced', color: 'hsl(120, 100%, 70%)' },
    { value: 'meditative', label: '🧘 Meditative', color: 'hsl(240, 100%, 80%)' },
    { value: 'creative', label: '🎨 Creative', color: 'hsl(300, 100%, 70%)' },
    { value: 'healing', label: '💚 Healing', color: 'hsl(140, 100%, 60%)' },
    { value: 'expanding', label: '🌌 Expanding', color: 'hsl(270, 100%, 75%)' }
  ];

  const chakraOptions = [
    { value: 'root', label: 'Root 🔴', color: 'hsl(0, 84%, 60%)' },
    { value: 'sacral', label: 'Sacral 🟠', color: 'hsl(24, 100%, 50%)' },
    { value: 'solar-plexus', label: 'Solar 🟡', color: 'hsl(60, 100%, 50%)' },
    { value: 'heart', label: 'Heart 💚', color: 'hsl(120, 100%, 50%)' },
    { value: 'throat', label: 'Throat 🔵', color: 'hsl(200, 100%, 50%)' },
    { value: 'third-eye', label: 'Third Eye 🟣', color: 'hsl(240, 100%, 70%)' },
    { value: 'crown', label: 'Crown 🟢', color: 'hsl(300, 100%, 80%)' }
  ];

  const fetchPosts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('circle_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      // Filter based on feed type
      if (feedType === 'circles') {
        // Get user's circles first
        const { data: userCircles } = await supabase
          .from('circle_group_members')
          .select('group_id')
          .eq('user_id', user.id);
        
        if (userCircles?.length) {
          const circleIds = userCircles.map(c => c.group_id);
          query = query.in('group_id', circleIds);
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform the data to match our interface with safe property access
      const transformedPosts = (data || []).map((post: any) => ({
        ...post,
        post_type: post.post_type || 'text',
        media_urls: post.media_urls || [],
        consciousness_metadata: post.consciousness_metadata || (post.tone ? {
          state: post.tone,
          frequency: post.frequency || 528,
          aura_reading: Math.random() * 100
        } : {}),
        engagement_stats: post.engagement_stats || { likes: 0, comments: 0, shares: 0, sacred_resonance: 0 },
        mood_signature: post.mood_signature || post.tone || 'balanced',
        post_reactions: [],
        post_comments: []
      }));

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load sacred feed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    toast({
      title: "Image Selected",
      description: "Image ready to share with your post ✨"
    });
  };

  const handleVoiceRecording = (audioBlob: Blob) => {
    setRecordedAudio(audioBlob);
    setShowVoiceRecorder(false);
    toast({
      title: "Voice Recorded",
      description: "Sacred sounds captured and ready to share 🎵"
    });
  };

  const handleMagicEnhancement = () => {
    if (newPost.trim()) {
      const magicPhrases = [
        "✨ Sacred energy flows through these words ✨",
        "🌟 Consciousness expands with this intention 🌟", 
        "💫 Divine wisdom speaks through this message 💫",
        "🔮 Universal love radiates from this thought 🔮"
      ];
      const randomPhrase = magicPhrases[Math.floor(Math.random() * magicPhrases.length)];
      setNewPost(prev => `${prev}\n\n${randomPhrase}`);
      toast({
        title: "Sacred Enhancement Applied",
        description: "Your message has been blessed with divine energy 🪄"
      });
    } else {
      toast({
        title: "Add Some Text First",
        description: "Write your message for magical enhancement ✨",
        variant: "destructive"
      });
    }
  };

  const createPost = async () => {
    if (!user || !newPost.trim()) return;

    try {
      const consciousnessMetadata = {
        state: consciousnessState,
        timestamp: new Date().toISOString(),
        aura_reading: Math.random() * 100, // Simulated for now
        frequency: 528 + Math.random() * 100 // Base healing frequency + variation
      };

      const { data, error } = await supabase
        .from('circle_posts')
        .insert({
          user_id: user.id,
          content: newPost,
          // Map consciousness features to existing schema
          chakra_tag: chakraTag || null,
          tone: consciousnessState,
          frequency: consciousnessMetadata.frequency,
          visibility: 'circle',
          // Try to add new fields if they exist
          ...(postType !== 'text' && { post_type: postType }),
          ...(Object.keys(consciousnessMetadata).length > 0 && { consciousness_metadata: consciousnessMetadata }),
          mood_signature: consciousnessState
        } as any)
        .select()
        .single();

      if (error) throw error;

      setNewPost('');
      setChakraTag('');
      setSelectedImage(null);
      setRecordedAudio(null);
      fetchPosts();

      toast({
        title: "Sacred Post Created",
        description: "Your consciousness has been shared with the collective",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create sacred post",
        variant: "destructive"
      });
    }
  };

  const addReaction = async (postId: string, reactionType: string) => {
    if (!user) return;

    try {
      // Try to add to the new post_reactions table, fallback to updating post stats
      const { error } = await supabase
        .from('post_reactions' as any)
        .upsert({
          post_id: postId,
          user_id: user.id,
          reaction_type: reactionType,
          reaction_intensity: 1.0,
          consciousness_state: consciousnessState
        });

      if (error) {
        console.warn('Post reactions table not available, updating engagement stats in local state');
        // Update local post state to show reaction
        setPosts(prevPosts => 
          prevPosts.map(p => 
            p.id === postId 
              ? {
                  ...p,
                  engagement_stats: {
                    ...p.engagement_stats,
                    sacred_resonance: (p.engagement_stats?.sacred_resonance || 0) + 1
                  }
                }
              : p
          )
        );
      } else {
        fetchPosts(); // Refresh to show updated reactions
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user, feedType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Sacred Post Creator */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || '🌟'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">Share Your Sacred Experience</h3>
              <p className="text-sm text-muted-foreground">Connect through consciousness</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's moving through your consciousness today?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px] border-primary/20 focus:border-primary"
          />
          
          <div className="flex flex-wrap gap-2">
            <select
              value={consciousnessState}
              onChange={(e) => setConsciousnessState(e.target.value)}
              className="px-3 py-1 rounded-full border border-primary/20 bg-background text-sm"
            >
              {consciousnessStates.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>

            <select
              value={chakraTag}
              onChange={(e) => setChakraTag(e.target.value)}
              className="px-3 py-1 rounded-full border border-primary/20 bg-background text-sm"
            >
              <option value="">Select Chakra (Optional)</option>
              {chakraOptions.map(chakra => (
                <option key={chakra.value} value={chakra.value}>
                  {chakra.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <ImageUploader onImageSelect={handleImageSelect} />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({ description: 'Video recording coming soon! 🎥' })}
              >
                <Video className="w-4 h-4" />
              </Button>
              {showVoiceRecorder ? (
                <VoiceRecorder onRecordingComplete={handleVoiceRecording} />
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowVoiceRecorder(true)}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMagicEnhancement}
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* File previews */}
          {(selectedImage || recordedAudio) && (
            <div className="flex gap-2 flex-wrap">
              {selectedImage && (
                <div className="flex items-center gap-2 bg-accent rounded-lg px-3 py-2">
                  <Camera className="w-4 h-4" />
                  <span className="text-sm">{selectedImage.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedImage(null)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              )}
              {recordedAudio && (
                <div className="flex items-center gap-2 bg-accent rounded-lg px-3 py-2">
                  <Mic className="w-4 h-4" />
                  <span className="text-sm">Voice recording ready</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setRecordedAudio(null)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <Button 
            onClick={createPost}
            disabled={!newPost.trim()}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            <Zap className="w-4 h-4 mr-2" />
            Share Sacred Energy
          </Button>
        </CardContent>
      </Card>

      {/* Sacred Feed */}
      <div className="space-y-4">
        {posts.map((post) => {
          const userReactions = post.post_reactions?.filter(r => r.user_id === user?.id) || [];
          const totalReactions = post.post_reactions?.length || 0;
          const totalComments = post.post_comments?.length || 0;

          return (
            <Card key={post.id} className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={post.user_profiles?.avatar_url} />
                      <AvatarFallback>
                        {post.user_profiles?.display_name?.[0] || '🌟'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">
                          {post.user_profiles?.display_name || 'Sacred Soul'}
                        </h4>
                        {post.user_profiles?.sacred_role && (
                          <Badge variant="outline" className="text-xs">
                            {post.user_profiles.sacred_role}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
                        {post.mood_signature && (
                          <Badge variant="secondary" className="text-xs">
                            {consciousnessStates.find(s => s.value === post.mood_signature)?.label || post.mood_signature}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {post.chakra_tag && (
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        borderColor: chakraOptions.find(c => c.value === post.chakra_tag)?.color,
                        color: chakraOptions.find(c => c.value === post.chakra_tag)?.color
                      }}
                    >
                      {chakraOptions.find(c => c.value === post.chakra_tag)?.label}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">{post.content}</p>

                {post.consciousness_metadata && (
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground bg-primary/5 rounded-lg p-3">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>Frequency: {Math.round(post.consciousness_metadata.frequency || 528)}Hz</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Aura: {Math.round(post.consciousness_metadata.aura_reading || 0)}%</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addReaction(post.id, 'sacred_blessing')}
                      className={`${userReactions.some(r => r.reaction_type === 'sacred_blessing') ? 'text-primary' : ''}`}
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      <span className="text-xs">{totalReactions}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs">{totalComments}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      <span className="text-xs">Share</span>
                    </Button>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addReaction(post.id, 'quantum_resonance')}
                      className={`${userReactions.some(r => r.reaction_type === 'quantum_resonance') ? 'text-primary' : ''}`}
                    >
                      <Zap className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addReaction(post.id, 'aura_boost')}
                      className={`${userReactions.some(r => r.reaction_type === 'aura_boost') ? 'text-primary' : ''}`}
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addReaction(post.id, 'chakra_alignment')}
                      className={`${userReactions.some(r => r.reaction_type === 'chakra_alignment') ? 'text-primary' : ''}`}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {posts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">The Sacred Feed Awaits</h3>
            <p className="text-muted-foreground">
              Be the first to share your consciousness with the collective
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};