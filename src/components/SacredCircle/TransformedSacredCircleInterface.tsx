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

  // Sacred Circle State - No ritual opening
  const [showRitualOpening, setShowRitualOpening] = useState(false);
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
        

        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div 
            ref={scrollAreaRef}
            className="flex-1 px-4 py-4 overflow-y-auto min-h-0"
          >
            <div className="space-y-4 pb-4">
              {loading ? (
                <div className="text-center text-muted-foreground py-8">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center space-y-3 py-12">
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm text-muted-foreground">
                    Be the first to start the conversation
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <SacredMessageVessel
                    key={message.id}
                    message={{
                      ...message,
                      author: {
                        name: message.author?.display_name || 'Unknown',
                        avatar: message.author?.avatar_url
                      }
                    }}
                    isOwn={message.user_id === user?.id}
                  />
                ))
              )}
            </div>
          </div>

          {/* Message Input - Always visible */}
          <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SacredMessageInput
              onSendMessage={handleSendMessage}
              onSacredPause={handleSacredPause}
              disabled={loading}
            />
          </div>
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