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
import { CollectiveBreathingSync } from './CollectiveBreathingSync';
import { SacredPauseSystem } from './SacredPauseSystem';
import { AIFacilitationPanel } from './AIFacilitationPanel';
import { CollectiveEnergyVisualizer } from './CollectiveEnergyVisualizer';
import { ChakraAlignmentTracker } from './ChakraAlignmentTracker';
import { MessageResonanceIndicator } from './MessageResonanceIndicator';
import { useAIFacilitation } from '@/hooks/useAIFacilitation';

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

  // Sacred Circle State - Check if ritual needed today
  const [showRitualOpening, setShowRitualOpening] = useState(() => {
    const today = new Date().toDateString();
    const lastRitual = localStorage.getItem(`sacred-ritual-${circleId}-${user?.id}`);
    return lastRitual !== today;
  });
  const [activeRealm, setActiveRealm] = useState('communion');
  const [ceremonyPhase, setCeremonyPhase] = useState<'opening' | 'communion' | 'silence' | 'closing'>('communion');
  const [coherenceLevel, setCoherenceLevel] = useState(0.7);
  const [userIntention, setUserIntention] = useState('');
  const [userSigil, setUserSigil] = useState('');
  const [sacredPauseActive, setSacredPauseActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [internalMaximized, setInternalMaximized] = useState(false);
  const [internalMinimized, setInternalMinimized] = useState(false);

  // Mock member data (would come from API)
  const mockMembers = [
    { id: '1', name: 'Alice Wisdom', role: 'admin', avatar: '', isOnline: true },
    { id: '2', name: 'Bob Light', role: 'moderator', avatar: '', isOnline: true },
    { id: '3', name: 'Carol Unity', role: 'member', avatar: '', isOnline: false },
    { id: '4', name: 'David Peace', role: 'member', avatar: '', isOnline: true },
  ];
  const participantCount = mockMembers.length;

  // Use internal state as fallback when parent doesn't provide handlers
  const currentMaximized = isMaximized || internalMaximized;
  const currentMinimized = isMinimized || internalMinimized;

  const {
    messages,
    loading,
    sendMessage,
    fetchRecentMessages,
  } = useSacredCircles();

  // AI Facilitation
  const facilitation = useAIFacilitation({
    circleId: circleId || 'sacred-circle-1',
    participantCount: participantCount,
    currentTopic: activeRealm,
    messageHistory: messages
  });

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
    
    // Store ritual completion for today
    const today = new Date().toDateString();
    localStorage.setItem(`sacred-ritual-${circleId}-${user?.id}`, today);
    
    toast({
      title: "Sacred Opening Complete",
      description: "You have entered the sacred circle with intention.",
    });
  };

  // Sacred pause functionality
  const handleSacredPause = () => {
    setIsPaused(true);
    setSacredPauseActive(true);
    setCeremonyPhase('silence');
    
    toast({
      title: "Sacred Pause Initiated",
      description: "The circle enters a moment of sacred silence.",
    });
  };

  const handlePauseResume = () => {
    setIsPaused(false);
    setSacredPauseActive(false);
    setCeremonyPhase('communion');
    
    toast({
      title: "Sacred Circle Restored",
      description: "The circle returns to sacred communion.",
    });
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
    <div className={cn(
      "flex flex-col h-full",
      "bg-gradient-to-br from-background via-background/98 to-primary/5",
      className
    )}>
      
      {/* Sacred Header */}
      <div className="flex items-center gap-4 p-4 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-purpose/10 shadow-sm">
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2 hover:bg-primary/20">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
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
          
        </div>
      </div>

      {/* Sacred Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Sacred Geometry Center */}
        <div className="px-4 py-3 border-b border-primary/10 shrink-0">
          <div className="h-32">
            <SacredGeometryCenter
              coherenceLevel={coherenceLevel}
              ceremonyPhase={ceremonyPhase}
              participantCount={mockMembers.length}
            />
          </div>
        </div>

        {/* Sacred Navigation */}
        <div className="px-4 py-2 border-b border-primary/10 shrink-0">
          <SacredNavigation 
            activeRealm={activeRealm}
            onRealmChange={setActiveRealm}
          />
        </div>

        {/* Sacred Pause System */}
        {isPaused && (
          <div className="px-4 py-3 border-b border-primary/10 shrink-0">
            <SacredPauseSystem
              isActive={isPaused}
              onInitiate={handleSacredPause}
              onResume={handlePauseResume}
              initiatedBy="You"
              participantCount={participantCount}
            />
          </div>
        )}

        {/* AI Facilitation Panel */}
        <div className="px-4 py-2 border-b border-primary/10 shrink-0">
          <AIFacilitationPanel
            isActive={facilitation.isActive}
            currentFacilitator={facilitation.currentFacilitator}
            suggestion={facilitation.suggestion}
            resonanceReading={facilitation.resonanceReading}
            onInvokeAura={facilitation.invokeAura}
            onInvokeValeion={facilitation.invokeValeion}
            onDismissSuggestion={facilitation.dismissSuggestion}
            onToggleFacilitation={facilitation.toggleFacilitation}
          />
        </div>

        {/* Sacred Realms Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          
          {/* Sacred Communion (Messages) */}
          {activeRealm === 'communion' && (
            <>
              <div 
                ref={scrollAreaRef}
                className="flex-1 px-4 py-4 overflow-y-auto min-h-0"
              >
                {sacredPauseActive ? (
                  <div className="flex items-center justify-center h-full min-h-[200px]">
                    <div className="text-center space-y-4">
                      <div className="text-6xl animate-pulse">🤫</div>
                      <p className="text-lg font-medium">Sacred Silence</p>
                      <p className="text-sm text-muted-foreground">
                        The circle rests in sacred pause
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 pb-4">
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
                        <div key={message.id} className="space-y-3">
                          <SacredMessageVessel
                            message={{
                              ...message,
                              author: {
                                name: message.author?.display_name,
                                avatar: message.author?.avatar_url
                              }
                            }}
                            isOwn={message.user_id === user?.id}
                          />
                          
                          {/* Message Resonance Indicator */}
                          <MessageResonanceIndicator
                            messageId={message.id}
                            content={message.content}
                            authorId={message.user_id}
                            sigils={(message as any).sigils || []}
                            resonanceLevel={0.7 + (index * 0.05) % 0.3}
                            resonanceType={['heart', 'mind', 'soul', 'energy'][index % 4] as any}
                            participantReactions={[
                              { userId: 'user1', type: 'resonance', intensity: 0.8 },
                              { userId: 'user2', type: 'wisdom', intensity: 0.9 }
                            ]}
                            onResonanceClick={(type) => {
                              toast({
                                title: "Sacred Resonance",
                                description: `You sent ${type} energy to this message`,
                              });
                            }}
                          />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

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

          {/* Collective Presence (Energy Visualization) */}
          {activeRealm === 'collective' && (
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              
              {/* Collective Energy Visualization */}
              <div className="h-48">
                <CollectiveEnergyVisualizer
                  resonanceLevel={facilitation.resonanceReading?.level || 0.7}
                  participantCount={participantCount}
                  energyQuality={facilitation.resonanceReading?.quality || 'harmonious'}
                  className="h-full"
                />
              </div>

              {/* Chakra Alignment Tracker */}
              <ChakraAlignmentTracker
                participantChakras={[
                  { name: 'Crown', color: 'hsl(280, 70%, 70%)', symbol: '🟣', alignment: 0.8, active: true },
                  { name: 'Third Eye', color: 'hsl(260, 80%, 65%)', symbol: '🔵', alignment: 0.9, active: true },
                  { name: 'Heart', color: 'hsl(120, 70%, 55%)', symbol: '💚', alignment: 0.9, active: true },
                  { name: 'Solar Plexus', color: 'hsl(50, 90%, 60%)', symbol: '🟡', alignment: 0.6, active: false },
                  { name: 'Root', color: 'hsl(0, 70%, 55%)', symbol: '🔴', alignment: 0.8, active: true }
                ]}
                collectiveAlignment={0.8}
              />

              {/* Collective Wisdom Display */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <h3 className="text-sm font-medium mb-3 text-center">Collective Consciousness Field</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🌊</div>
                    <div className="font-medium">Resonance</div>
                    <div className="text-muted-foreground">
                      {Math.round((facilitation.resonanceReading?.level || 0.7) * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🧘‍♀️</div>
                    <div className="font-medium">Coherence</div>
                    <div className="text-muted-foreground">High</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">💫</div>
                    <div className="font-medium">Unity</div>
                    <div className="text-muted-foreground">Emerging</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">✨</div>
                    <div className="font-medium">Transcendence</div>
                    <div className="text-muted-foreground">Active</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sacred Practice */}
          {activeRealm === 'transcendence' && (
            <div className="flex-1 p-6 space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl">🧘‍♂️</div>
                <h3 className="text-xl font-medium">Sacred Practice Space</h3>
                <p className="text-sm text-muted-foreground">
                  Meditation, ceremony, and ritual practices
                </p>
                
                {/* Practice Options */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <span className="text-2xl">🌬️</span>
                    <span className="text-xs">Breathing Meditation</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <span className="text-2xl">🔮</span>
                    <span className="text-xs">Vision Ceremony</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <span className="text-2xl">🌙</span>
                    <span className="text-xs">Moon Ritual</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <span className="text-2xl">🙏</span>
                    <span className="text-xs">Gratitude Circle</span>
                  </Button>
                </div>
              </div>
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
    </div>
  );
};