import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Maximize2, Minimize2, Minus, Settings, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Sacred Components
import { SacredGeometryCenter } from './SacredGeometryCenter';
import { SacredNavigation } from './SacredNavigation';
import { SacredMessageVessel } from './SacredMessageVessel';
import { SacredMessageInput } from './SacredMessageInput';
import { SacredRitualOpening } from './SacredRitualOpening';

// Legacy components for advanced features
import { CircleSettingsModal } from '@/components/CircleSettingsModal';
import { AddMemberModal } from '@/components/AddMemberModal';
import { CollectiveMeditationSession } from '@/components/SacredCircle/CollectiveMeditationSession';
import { EnhancedMemberProfile } from '@/components/SacredCircle/EnhancedMemberProfile';

interface TransformedSacredCircleInterfaceProps {
  circleId?: string;
  circleName?: string;
  onClose?: () => void;
  className?: string;
  isMaximized?: boolean;
  isMinimized?: boolean;
  onMaximize?: () => void;
  onMinimize?: () => void;
  onRestore?: () => void;
}

export const TransformedSacredCircleInterface: React.FC<TransformedSacredCircleInterfaceProps> = ({
  circleId,
  circleName = 'Sacred Circle',
  onClose,
  className,
  isMaximized = false,
  isMinimized = false,
  onMaximize,
  onMinimize,
  onRestore
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Sacred Circle State
  const [showRitualOpening, setShowRitualOpening] = useState(true);
  const [activeRealm, setActiveRealm] = useState('communion');
  const [ceremonyPhase, setCeremonyPhase] = useState<'opening' | 'communion' | 'silence' | 'closing'>('communion');
  const [coherenceLevel, setCoherenceLevel] = useState(0.7);
  const [userIntention, setUserIntention] = useState('');
  const [userSigil, setUserSigil] = useState('');
  const [sacredPauseActive, setSacredPauseActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [internalMaximized, setInternalMaximized] = useState(false);
  const [internalMinimized, setInternalMinimized] = useState(false);

  // Use internal state as fallback when parent doesn't provide handlers
  const currentMaximized = isMaximized || internalMaximized;
  const currentMinimized = isMinimized || internalMinimized;

  const {
    messages,
    loading,
    sendMessage,
    fetchRecentMessages,
  } = useSacredCircles();

  // Handle window controls
  const handleMaximize = () => {
    if (onMaximize) {
      onMaximize();
    } else {
      setInternalMaximized(true);
      setInternalMinimized(false);
    }
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    } else {
      setInternalMinimized(true);
      setInternalMaximized(false);
    }
  };

  const handleRestore = () => {
    if (onRestore) {
      onRestore();
    } else {
      setInternalMaximized(false);
      setInternalMinimized(false);
    }
  };

  // Sacred ritual completion
  const handleRitualComplete = (intention: string, sigil: string) => {
    setUserIntention(intention);
    setUserSigil(sigil);
    setShowRitualOpening(false);
    setCeremonyPhase('communion');
    
    toast({
      title: "Sacred Opening Complete",
      description: "You have entered the sacred circle with intention.",
    });
  };

  // Sacred pause functionality
  const handleSacredPause = () => {
    setSacredPauseActive(true);
    setCeremonyPhase('silence');
    
    toast({
      title: "Sacred Pause Initiated",
      description: "The circle enters a moment of sacred silence.",
    });

    // Auto-restore after 30 seconds
    setTimeout(() => {
      setSacredPauseActive(false);
      setCeremonyPhase('communion');
    }, 30000);
  };

  // Handle message sending with sacred context
  const handleSendMessage = async (content: string, options: {
    messageMode: 'sacred' | 'quantum' | 'classic';
    selectedSigils: string[];
    attachedFiles: File[];
  }) => {
    if (!user || !circleId) return;

    try {
      const messageOptions = {
        chakraTag: options.messageMode === 'sacred' ? 'heart' : options.messageMode === 'quantum' ? 'third_eye' : 'heart',
        tone: options.messageMode === 'sacred' ? 'sacred' : options.messageMode === 'quantum' ? 'quantum' : 'harmonious',
        circleId,
        attachedFiles: options.attachedFiles,
        selectedSigils: options.selectedSigils,
        messageMode: options.messageMode,
        userIntention, // Include user's sacred intention
        userSigil // Include user's sacred sigil
      };

      await sendMessage(content, 'circle', messageOptions);
      
      // Update coherence based on message harmony
      setCoherenceLevel(prev => Math.min(prev + 0.1, 1.0));

      toast({
        title: "Sacred Message Sent",
        description: `Your ${options.messageMode} truth has been shared.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch messages on mount
  useEffect(() => {
    fetchRecentMessages(circleId);
  }, [fetchRecentMessages, circleId]);

  // Mock member data (would come from API)
  const mockMembers = [
    { id: '1', name: 'Alice Wisdom', role: 'admin', avatar: '', isOnline: true },
    { id: '2', name: 'Bob Light', role: 'moderator', avatar: '', isOnline: true },
    { id: '3', name: 'Carol Unity', role: 'member', avatar: '', isOnline: false },
    { id: '4', name: 'David Peace', role: 'member', avatar: '', isOnline: true },
  ];

  // Show ritual opening for first-time entry
  if (showRitualOpening) {
    return (
      <SacredRitualOpening
        circleName={circleName}
        onComplete={handleRitualComplete}
        participantCount={mockMembers.length}
      />
    );
  }

  // Render sacred circle interface
  return (
    <Card className={cn(
      "flex flex-col transition-all duration-500",
      "bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm",
      "border border-primary/20 shadow-[0_0_30px_hsl(var(--primary)/0.15)]",
      currentMaximized && "fixed inset-0 z-50 rounded-none animate-scale-in w-screen h-screen",
      currentMinimized && "h-12 overflow-hidden",
      !currentMaximized && !currentMinimized && "h-full",
      className
    )}>
      
      {/* Sacred Header */}
      <div className="flex items-center gap-4 p-6 border-b border-primary/20 bg-gradient-to-r from-primary/5 to-purpose/5">
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2 hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        {/* Sacred Circle Identity */}
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-purpose/30 flex items-center justify-center">
              <span className="text-xl">{userSigil || '🌸'}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          
          <div>
            <h3 className="font-sacred text-lg font-semibold text-foreground flex items-center gap-2">
              {circleName}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10">
                {mockMembers.length} souls
              </Badge>
              <span>Sacred communion • {ceremonyPhase}</span>
            </div>
          </div>
        </div>

        {/* Sacred Controls */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 hover:bg-primary/10"
            onClick={() => setShowAddMember(true)}
            title="Invite Soul"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 hover:bg-primary/10"
            onClick={() => setShowSettings(true)}
            title="Circle Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          {/* Window Controls */}
          <div className="flex items-center gap-1 ml-2 border-l border-primary/20 pl-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-yellow-500/20"
              onClick={handleMinimize}
              title="Minimize"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-green-500/20"
              onClick={currentMaximized ? handleRestore : handleMaximize}
              title={currentMaximized ? "Restore" : "Maximize"}
            >
              {currentMaximized ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Sacred Content */}
      <div className={cn("flex-1 flex flex-col", currentMinimized && "hidden")}>
        
        {/* Sacred Geometry Center */}
        <div className="px-6 py-4 border-b border-primary/10">
          <SacredGeometryCenter
            coherenceLevel={coherenceLevel}
            ceremonyPhase={ceremonyPhase}
            participantCount={mockMembers.length}
          />
        </div>

        {/* Sacred Navigation */}
        <SacredNavigation 
          activeRealm={activeRealm}
          onRealmChange={setActiveRealm}
        />

        {/* Sacred Realms Content */}
        <div className="flex-1 flex flex-col">
          
          {/* Sacred Communion (Messages) */}
          {activeRealm === 'communion' && (
            <>
              <ScrollArea 
                ref={scrollAreaRef}
                className="flex-1 px-6 py-4"
              >
                {sacredPauseActive ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="text-6xl animate-pulse">🤫</div>
                      <p className="text-lg font-medium">Sacred Silence</p>
                      <p className="text-sm text-muted-foreground">
                        The circle rests in sacred pause
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {loading ? (
                      <div className="text-center text-muted-foreground">
                        Loading sacred messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center space-y-3 py-12">
                        <div className="text-4xl">🌸</div>
                        <p className="text-lg font-medium">Sacred Silence</p>
                        <p className="text-sm text-muted-foreground">
                          Be the first to share your truth in this sacred space
                        </p>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <SacredMessageVessel
                          key={message.id}
                          message={{
                            ...message,
                            author: {
                              name: message.author?.display_name,
                              avatar: message.author?.avatar_url
                            }
                          }}
                          isOwn={message.user_id === user?.id}
                        />
                      ))
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Sacred Message Input */}
              {!sacredPauseActive && (
                <SacredMessageInput
                  onSendMessage={handleSendMessage}
                  onSacredPause={handleSacredPause}
                  disabled={loading}
                />
              )}
            </>
          )}

          {/* Collective Presence (Members & Energy) */}
          {activeRealm === 'collective' && (
            <div className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockMembers.map((member) => (
                  <div
                    key={member.id}
                    className="sacred-card p-4 text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary/30 to-purpose/30 flex items-center justify-center">
                      <span className="text-lg">{member.name[0]}</span>
                    </div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                    <div className={`w-2 h-2 rounded-full mx-auto mt-2 ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sacred Practice (Meditation & Ceremony) */}
          {activeRealm === 'transcendence' && (
            <div className="flex-1 p-6">
              <CollectiveMeditationSession circleId={circleId} />
            </div>
          )}
        </div>
      </div>

      {/* Sacred Modals - Simplified for now */}
      {showSettings && (
        <div className="fixed inset-0 bg-background/50 z-50 flex items-center justify-center">
          <div className="sacred-card p-6 max-w-md">
            <h3 className="text-lg font-medium mb-4">Circle Settings</h3>
            <Button onClick={() => setShowSettings(false)}>Close</Button>
          </div>
        </div>
      )}
      
      {showAddMember && (
        <div className="fixed inset-0 bg-background/50 z-50 flex items-center justify-center">
          <div className="sacred-card p-6 max-w-md">
            <h3 className="text-lg font-medium mb-4">Invite Sacred Soul</h3>
            <Button onClick={() => setShowAddMember(false)}>Close</Button>
          </div>
        </div>
      )}
    </Card>
  );
};