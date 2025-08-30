import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Settings, UserPlus, Phone, Video, Send, Image, Paperclip, Smile, X, Users } from 'lucide-react';
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

  // Mock member data
  const mockMembers = [
    { id: '1', name: 'Alice Johnson', role: 'admin', avatar: '', isOnline: true },
    { id: '2', name: 'Bob Smith', role: 'member', avatar: '', isOnline: true },
    { id: '3', name: 'Carol Davis', role: 'member', avatar: '', isOnline: false },
    { id: '4', name: 'David Wilson', role: 'member', avatar: '', isOnline: true },
  ];

  const {
    messages,
    loading,
    sendMessage,
    fetchRecentMessages,
  } = useSacredCircles();

  // Handle message sending
  const handleSendMessage = async () => {
    if ((!messageText.trim() && attachedFiles.length === 0) || !user || !circleId) return;

    try {
      await sendMessage(messageText, 'circle', {
        circleId,
        attachedFiles: attachedFiles,
        selectedSigils: []
      });
      
      setMessageText('');
      setAttachedFiles([]);
      
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
    const authorName = message.author?.display_name || 'Unknown User';
    const time = new Date(message.created_at).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return (
      <div key={message.id} className={cn(
        "flex gap-3 group",
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
          {!isOwn && (
            <span className="text-xs text-muted-foreground mb-1 px-3">
              {authorName}
            </span>
          )}
          
          <div className={cn(
            "rounded-2xl px-4 py-2 text-sm break-words",
            isOwn 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          )}>
            {message.content}
          </div>
          
          <span className={cn(
            "text-xs text-muted-foreground mt-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity",
            isOwn ? "text-right" : "text-left"
          )}>
            {time}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("h-screen flex flex-col bg-background", className)}>
      {/* Fixed Header */}
      <div className="flex-shrink-0 flex items-center gap-3 p-4 border-b bg-card shadow-sm">
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

      {/* Fixed Message Input at Bottom - ALWAYS VISIBLE */}
      <div className="flex-shrink-0 border-t bg-card shadow-lg" style={{ minHeight: '80px' }}>
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
        
        {/* Message Input Row - GUARANTEED VISIBLE */}
        <div className="p-4 bg-background border-t border-border">
          <div className="flex items-center gap-3 w-full min-h-[48px]">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0 shrink-0 border-2"
              onClick={handleFileAttach}
              title="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0 shrink-0 border-2"
              onClick={handleImageAttach}
              title="Attach image"
            >
              <Image className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 flex items-center gap-2">
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
                className="flex-1 h-12 bg-muted border-2 border-border focus:border-primary text-foreground text-base"
                disabled={loading}
                autoComplete="off"
                style={{ 
                  backgroundColor: 'var(--muted)',
                  color: 'var(--foreground)',
                  border: '2px solid var(--border)'
                }}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={(!messageText.trim() && attachedFiles.length === 0) || loading}
                size="sm"
                className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium border-2 border-primary"
              >
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