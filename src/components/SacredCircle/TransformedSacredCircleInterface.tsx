import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Settings, UserPlus, Phone, Video, Send, Image, Paperclip, Smile, X, Users, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CircleVideoCallManager } from './CircleVideoCallManager';
import { CircleMembersList } from './CircleMembersList';

interface TransformedSacredCircleInterfaceProps {
  circleId?: string;
  circleName?: string;
  onClose?: () => void;
  className?: string;
}

export const TransformedSacredCircleInterface: React.FC<TransformedSacredCircleInterfaceProps> = ({
  circleId,
  circleName = 'Circle Chat',
  onClose,
  className,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [messageText, setMessageText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showSigilPicker, setShowSigilPicker] = useState(false);
  const [selectedSigils, setSelectedSigils] = useState<string[]>([]);

  // Mock member data
  const mockMembers = [
    { id: '1', name: 'Alice Johnson', role: 'admin', avatar: '', isOnline: true },
    { id: '2', name: 'Bob Smith', role: 'member', avatar: '', isOnline: true },
    { id: '3', name: 'Carol Davis', role: 'member', avatar: '', isOnline: false },
    { id: '4', name: 'David Wilson', role: 'member', avatar: '', isOnline: true },
  ];

  // Sacred Shifter Sigils
  const sacredSigils = [
    '🌟', '✨', '🔮', '🧿', '🌙', '☯️', '🕯️', '🌀', '⚡', '💫',
    '🦋', '🌸', '🍃', '🌊', '🔥', '🌈', '👁️', '💎', '🌺', '🦅'
  ];

  const {
    messages,
    loading,
    sendMessage,
    fetchRecentMessages,
  } = useSacredCircles();

  // Handle sigil selection
  const handleSigilSelect = (sigil: string) => {
    if (selectedSigils.includes(sigil)) {
      setSelectedSigils(prev => prev.filter(s => s !== sigil));
    } else if (selectedSigils.length < 3) {
      setSelectedSigils(prev => [...prev, sigil]);
    }
  };

  // Add sigil to message text
  const addSigilToMessage = (sigil: string) => {
    setMessageText(prev => prev + sigil);
  };

  // Detect and render links in text
  const renderMessageContent = (content: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlPattern);
    
    return parts.map((part, index) => {
      if (part.match(urlPattern)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Handle message sending
  const handleSendMessage = async () => {
    if ((!messageText.trim() && attachedFiles.length === 0) || !user || !circleId) return;

    try {
      await sendMessage(messageText, 'circle', {
        circleId,
        attachedFiles: attachedFiles,
        selectedSigils: selectedSigils
      });
      
      setMessageText('');
      setAttachedFiles([]);
      setSelectedSigils([]);
      
      toast({
        title: "Message sent",
        description: "Your message has been sent to the group.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file attachment
  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  // Handle image attachment  
  const handleImageAttach = () => {
    imageInputRef.current?.click();
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
    toast({
      title: "Files attached",
      description: `${files.length} file(s) attached to your message.`,
    });
  };

  // Remove attached file
  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
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

  // Format message for display
  const formatMessage = (message: any) => {
    const isOwn = message.user_id === user?.id;
    const authorName = message.author?.display_name || 'Sacred Soul';
    
    // Enhanced date/time formatting
    const messageDate = new Date(message.created_at);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === messageDate.toDateString();
    
    let timeDisplay;
    if (isToday) {
      timeDisplay = messageDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (isYesterday) {
      timeDisplay = `Yesterday ${messageDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else {
      timeDisplay = messageDate.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return (
      <div key={message.id} className={cn(
        "flex gap-3 group mb-4",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}>
        {!isOwn && (
          <Avatar className="w-8 h-8 mt-1">
            <AvatarImage src={message.author?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {authorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={cn(
          "flex flex-col max-w-[70%]",
          isOwn ? "items-end" : "items-start"
        )}>
          {/* Author and timestamp header */}
          <div className={cn(
            "flex items-center gap-2 mb-1 px-3",
            isOwn ? "flex-row-reverse" : "flex-row"
          )}>
            <span className="text-xs font-medium text-primary">
              {isOwn ? 'You' : authorName}
            </span>
            <span className="text-xs text-muted-foreground">
              {timeDisplay}
            </span>
          </div>
          
          <div className={cn(
            "rounded-2xl overflow-hidden shadow-sm",
            isOwn 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          )}>
            {/* Text Content with link detection */}
            {message.content && (
              <div className="px-4 py-2 text-sm break-words">
                {renderMessageContent(message.content)}
              </div>
            )}
            
            {/* Image Content */}
            {message.has_image && message.image_url && (
              <div className={cn(
                "relative",
                message.content ? "border-t border-border/20" : ""
              )}>
                <img 
                  src={message.image_url} 
                  alt="Shared vision"
                  className="w-full h-auto max-h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.image_url, '_blank')}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Metadata tags */}
          {(message.chakra_tag || message.tone) && (
            <div className={cn(
              "flex items-center gap-1 mt-1 px-3",
              isOwn ? "justify-end" : "justify-start"
            )}>
              {message.chakra_tag && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {message.chakra_tag}
                </span>
              )}
              {message.tone && (
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {message.tone}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("h-screen flex flex-col bg-background relative", className)} style={{ minHeight: '100vh', maxHeight: '100vh' }}>
      {/* Fixed Header */}
      <div className="flex-shrink-0 flex items-center gap-3 p-4 border-b bg-card shadow-sm z-10" style={{ minHeight: '80px' }}>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-primary/10 text-primary">
            {circleName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">
            {circleName}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{mockMembers.filter(m => m.isOnline).length} active</span>
            </div>
            <span>•</span>
            <button 
              className="hover:text-foreground transition-colors cursor-pointer"
              onClick={() => setShowMembersList(true)}
            >
              {mockMembers.length} members
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {circleId && (
            <CircleVideoCallManager 
              circleId={circleId}
              circleName={circleName}
            />
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0"
            onClick={() => setShowMembersList(true)}
            title="View members"
          >
            <Users className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Messages Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        ref={scrollAreaRef}
        style={{ 
          flex: '1 1 auto',
          minHeight: '200px',
          paddingBottom: '180px', // Extra space for raised input area
          marginBottom: '0px'
        }}
      >
        {loading ? (
          <div className="text-center text-muted-foreground py-8">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center space-y-3 py-12">
            <p className="text-lg font-medium text-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Start the conversation with your first message
            </p>
          </div>
        ) : (
          messages.map(formatMessage)
        )}
      </div>

      {/* Fixed Message Input at Bottom - ALWAYS VISIBLE - ABOVE NAVIGATION */}
      <div 
        className="flex-shrink-0 border-t bg-card shadow-lg z-[55]" 
        style={{ 
          minHeight: '100px',
          maxHeight: '200px',
          position: 'fixed',
          bottom: '70px', // Raised above the Sacred Shifter navigation bar
          left: 0,
          right: 0,
          zIndex: 55, // Above bottom toolbar (z-50) but below floating components (z-60)
          backgroundColor: 'hsl(var(--card))',
          borderTop: '2px solid hsl(var(--border))',
          boxShadow: '0 -8px 16px -4px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Attached Files Preview */}
        {attachedFiles.length > 0 && (
          <div className="p-3 bg-muted/30 border-b">
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-background px-3 py-2 rounded-full text-sm">
                  <span className="truncate max-w-32">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Sigils Preview */}
        {selectedSigils.length > 0 && (
          <div className="px-4 py-2 bg-primary/5 border-b">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sacred Sigils:</span>
              <div className="flex gap-1">
                {selectedSigils.map((sigil, index) => (
                  <span key={index} className="text-lg animate-pulse" style={{ animationDelay: `${index * 0.2}s` }}>
                    {sigil}
                  </span>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setSelectedSigils([])}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Sigil Picker */}
        {showSigilPicker && (
          <div className="p-4 bg-muted/20 border-b">
            <div className="grid grid-cols-10 gap-2 max-w-md">
              {sacredSigils.map((sigil, index) => (
                <button
                  key={index}
                  onClick={() => addSigilToMessage(sigil)}
                  className="text-xl p-2 rounded-lg hover:bg-primary/10 transition-colors"
                  title={`Add ${sigil} to message`}
                >
                  {sigil}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Click sigils to add them to your message
            </div>
          </div>
        )}
        
        {/* Message Input Row - GUARANTEED VISIBLE */}
        <div 
          className="p-4 bg-card border-t border-border" 
          style={{ 
            backgroundColor: 'hsl(var(--card))',
            borderTop: '1px solid hsl(var(--border))',
            minHeight: '80px'
          }}
        >
          <div 
            className="flex items-center gap-3 w-full min-h-[48px]"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              minHeight: '48px'
            }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="h-12 w-12 p-0 shrink-0 border-2 bg-muted hover:bg-muted/80"
              onClick={handleFileAttach}
              title="Attach file"
              style={{
                backgroundColor: 'hsl(var(--muted))',
                border: '2px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))'
              }}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-12 w-12 p-0 shrink-0 border-2 bg-muted hover:bg-muted/80"
              onClick={handleImageAttach}
              title="Attach image"
              style={{
                backgroundColor: 'hsl(var(--muted))',
                border: '2px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))'
              }}
            >
              <Image className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "h-12 w-12 p-0 shrink-0 border-2 bg-muted hover:bg-muted/80",
                showSigilPicker && "bg-primary/20 border-primary"
              )}
              onClick={() => setShowSigilPicker(!showSigilPicker)}
              title="Sacred Sigils"
              style={{
                backgroundColor: showSigilPicker ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--muted))',
                border: `2px solid ${showSigilPicker ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                color: 'hsl(var(--foreground))'
              }}
            >
              <Smile className="h-5 w-5" />
            </Button>
            
            <div 
              className="flex-1 flex items-center gap-3"
              style={{ 
                flex: '1 1 auto',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message here..."
                className="flex-1 h-12 bg-background border-2 border-border focus:border-primary text-foreground text-base rounded-lg"
                disabled={loading}
                autoComplete="off"
                style={{ 
                  flex: '1 1 auto',
                  height: '48px',
                  backgroundColor: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '2px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '16px',
                  padding: '12px 16px'
                }}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={(!messageText.trim() && attachedFiles.length === 0) || loading}
                size="sm"
                className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium border-2 border-primary rounded-lg"
                style={{
                  height: '48px',
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  border: '2px solid hsl(var(--primary))',
                  borderRadius: '8px',
                  fontWeight: '500',
                  minWidth: '80px'
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Members List Modal */}
      {showMembersList && circleId && (
        <CircleMembersList
          circleId={circleId}
          isOpen={showMembersList}
          onClose={() => setShowMembersList(false)}
          userRole="member" // TODO: Get actual user role
        />
      )}
      
      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Members</h3>
            <div className="space-y-4">
              <Input placeholder="Search by name or email..." />
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {/* Mock suggested users */}
                {['John Doe', 'Jane Smith', 'Mike Johnson'].map((name) => (
                  <div key={name} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddMember(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddMember(false)}>
                Add Members
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Circle Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Circle Name</label>
                <Input value={circleName} disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Add a circle description..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Privacy</label>
                <select className="w-full p-2 border rounded-md bg-background">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowSettings(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};