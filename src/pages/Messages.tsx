import { useState, useRef, useEffect } from 'react';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { useUnreadDms } from '@/hooks/useUnreadDms';
import { useAuth } from '@/hooks/useAuth';
import { usePersonalSignature } from '@/hooks/usePersonalSignature';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Send, Eye, Heart, Brain, MoreHorizontal, ArrowLeft, Wifi, BookOpen, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { formatDistance } from 'date-fns/formatDistance';
import { StartDirectMessageModal } from '@/components/StartDirectMessageModal';
import { SacredQuantumMessageInterface } from '@/components/SacredQuantumMessageInterface';
import { SynchronicityThreads } from '@/components/SynchronicityThreads';
import { QuantumChatCore } from '@/components/QuantumChat/QuantumChatCore';
import { ClassicChatInterface } from '@/components/ClassicChatInterface';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';
import { toast } from 'sonner';

type ViewMode = 'sacred' | 'quantum' | 'classic';

export default function Messages() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showStartMessageModal, setShowStartMessageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('classic');
  const [showSynchronicity, setShowSynchronicity] = useState(false);
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);

  const { user } = useAuth();
  const { signature } = usePersonalSignature();
  const { conversations, messages, loading, fetchConversations, fetchMessages } = useDirectMessages();
  const { data: unreadDms } = useUnreadDms();

  // Determine optimal view mode based on user signature
  const getOptimalViewMode = (signature: any): ViewMode => {
    if (!signature) return 'classic';
    
    const spiritualityScore = (signature.spiritual_practice_frequency || 0) + 
                             (signature.meditation_experience || 0) + 
                             (signature.consciousness_exploration_interest || 0);
    
    if (spiritualityScore >= 7) return 'sacred';
    if (spiritualityScore >= 4) return 'quantum';
    return 'classic';
  };

  // Auto-adapt view mode based on user signature
  useEffect(() => {
    if (signature) {
      setViewMode(getOptimalViewMode(signature));
    }
  }, [signature]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Helper functions
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (timestamp: string) => {
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    // Get the other participant's ID for direct messaging
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      const otherParticipantId = conversation.other_participant?.id;
      if (otherParticipantId) {
        fetchMessages(otherParticipantId);
      }
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedConversationId(userId);
    setShowStartMessageModal(false);
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery) return true;
    const otherParticipant = conversation.other_participant;
    return otherParticipant?.display_name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading && conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Conversations Sidebar */}
        <div className={`${selectedConversationId ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r`}>
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b bg-background">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Messages</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStartMessageModal(true)}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* View Mode Selector */}
            <div className="space-y-2 mb-4">
              <div className="text-xs font-medium text-muted-foreground px-1">Message Mode</div>
              <div className="flex flex-col gap-1">
                <Button
                  variant={viewMode === 'sacred' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('sacred')}
                  className="justify-start text-xs h-8"
                >
                  <Heart className="h-3 w-3 mr-2" />
                  Sacred
                </Button>
                <Button
                  variant={viewMode === 'quantum' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('quantum')}
                  className="justify-start text-xs h-8"
                >
                  <Brain className="h-3 w-3 mr-2" />
                  Quantum
                </Button>
                <Button
                  variant={viewMode === 'classic' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('classic')}
                  className="justify-start text-xs h-8"
                >
                  <Send className="h-3 w-3 mr-2" />
                  Classic
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-2">
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No conversations yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStartMessageModal(true)}
                  className="mt-2"
                >
                  Start a conversation
                </Button>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className={`p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedConversationId === conversation.id ? 'bg-muted border-primary' : ''
                  }`}
                  onClick={() => handleConversationSelect(conversation.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.other_participant?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {conversation.other_participant?.display_name 
                          ? getInitials(conversation.other_participant.display_name)
                          : '?'
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">
                          {conversation.other_participant?.display_name || 'Unknown User'}
                        </p>
                        <div className="flex items-center space-x-2">
                          {(unreadDms as any)?.find?.((d: any) => d.sender_id === conversation.other_participant?.id)?.unread_count > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0">
                              {(unreadDms as any)?.find?.((d: any) => d.sender_id === conversation.other_participant?.id)?.unread_count}
                            </Badge>
                          )}
                          {conversation.last_message_at && (
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conversation.last_message_at)}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message?.content || 'Start a conversation...'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Chat Interface */}
        {selectedConversationId ? (
          <div className="flex-1 min-h-0 flex flex-col">
            {viewMode === 'sacred' && (
              <SacredQuantumMessageInterface
                selectedUserId={conversations.find(c => c.id === selectedConversationId)?.other_participant?.id || selectedConversationId}
                onBack={() => setSelectedConversationId(null)}
              />
            )}
            
            {viewMode === 'quantum' && (
              <SacredQuantumMessageInterface
                selectedUserId={conversations.find(c => c.id === selectedConversationId)?.other_participant?.id || selectedConversationId}
                onBack={() => setSelectedConversationId(null)}
              />
            )}
            
            {viewMode === 'classic' && (
              <ClassicChatInterface
                selectedUserId={conversations.find(c => c.id === selectedConversationId)?.other_participant?.id || selectedConversationId}
                onBack={() => setSelectedConversationId(null)}
              />
            )}
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Communication Portal
              </h3>
              <p className="text-muted-foreground mb-4">
                Select a conversation to begin messaging
              </p>
              <Button 
                onClick={() => setShowStartMessageModal(true)}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                Start New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Deeper Knowledge Section */}
      <div className="p-4 border-t">
        <div className="text-center">
          <div className="bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-6 max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setShowDeeperKnowledge(!showDeeperKnowledge)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-8 text-xl gap-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
              size="lg"
            >
              <Sparkles className="w-6 h-6" />
              {showDeeperKnowledge ? 'Hide' : 'Unlock'} Sacred Wisdom
              <BookOpen className="w-6 h-6" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Explore the sacred art of conscious communication and divine correspondence
            </p>
          </div>
        </div>

        {/* Teaching Layer */}
        {showDeeperKnowledge && (
          <div className="mt-6">
            <TeachingLayer
              content={ALL_MODULE_TEACHINGS.messages}
              moduleId="messages"
            />
          </div>
        )}
      </div>

      {/* Synchronicity Threads Overlay */}
      <SynchronicityThreads
        currentMessages={messages}
        isVisible={showSynchronicity}
        onToggle={() => setShowSynchronicity(!showSynchronicity)}
      />

      <StartDirectMessageModal
        isOpen={showStartMessageModal}
        onClose={() => setShowStartMessageModal(false)}
        onUserSelect={handleUserSelect}
      />
    </div>
  );
}