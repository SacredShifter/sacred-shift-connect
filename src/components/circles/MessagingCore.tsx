/**
 * Messaging Core - Real-time messaging with WebSocket and Supabase presence
 */
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Mic, MicOff, Image, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: string;
  circle_id: string;
  user_id: string;
  content: string;
  message_type: 'text' | 'voice' | 'image' | 'video';
  metadata?: {
    duration?: number;
    file_url?: string;
    thumbnail_url?: string;
  };
  created_at: string;
  user_profile?: {
    display_name: string;
    avatar_url?: string;
  };
  reactions?: Reaction[];
  thread_count?: number;
}

interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

interface TypingIndicator {
  user_id: string;
  display_name: string;
  timestamp: number;
}

interface MessagingCoreProps {
  circleId: string;
  currentUserId: string;
}

export const MessagingCore: React.FC<MessagingCoreProps> = ({
  circleId,
  currentUserId
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const channel = useRef<RealtimeChannel | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeMessaging();
    return () => cleanup();
  }, [circleId]);

  const initializeMessaging = async () => {
    try {
      // Load existing messages
      await loadMessages();

      // Setup real-time channel
      channel.current = supabase.channel(`circle-${circleId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `circle_id=eq.${circleId}`
        }, handleNewMessage)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'message_reactions',
        }, handleNewReaction)
        .on('presence', { event: 'sync' }, handlePresenceSync)
        .on('presence', { event: 'join' }, handlePresenceJoin)
        .on('presence', { event: 'leave' }, handlePresenceLeave)
        .on('broadcast', { event: 'typing' }, handleTypingBroadcast)
        .subscribe();

      // Track presence
      await channel.current.track({
        user_id: currentUserId,
        online_at: new Date().toISOString()
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize messaging:', error);
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user_profile:profiles(display_name, avatar_url),
          reactions:message_reactions(id, user_id, emoji, created_at)
        `)
        .eq('circle_id', circleId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (type: 'text' | 'voice' = 'text', content?: string, metadata?: any) => {
    if (type === 'text' && (!newMessage.trim() && !content)) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          circle_id: circleId,
          user_id: currentUserId,
          content: content || newMessage.trim(),
          message_type: type,
          metadata
        });

      if (error) throw error;
      
      if (type === 'text') {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleNewMessage = (payload: any) => {
    const newMessage = payload.new as Message;
    setMessages(prev => [...prev, newMessage]);
    scrollToBottom();
  };

  const handleNewReaction = (payload: any) => {
    const reaction = payload.new as Reaction;
    setMessages(prev => prev.map(msg => 
      msg.id === reaction.message_id
        ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
        : msg
    ));
  };

  const handlePresenceSync = () => {
    if (!channel.current) return;
    const presenceState = channel.current.presenceState();
    const users = Object.keys(presenceState).map(key => 
      presenceState[key][0].user_id
    );
    setOnlineUsers(users);
  };

  const handlePresenceJoin = (payload: any) => {
    console.log('User joined:', payload);
  };

  const handlePresenceLeave = (payload: any) => {
    console.log('User left:', payload);
  };

  const handleTypingBroadcast = (payload: any) => {
    const { user_id, display_name, is_typing } = payload.payload;
    
    if (user_id === currentUserId) return;

    setTypingUsers(prev => {
      if (is_typing) {
        return [...prev.filter(u => u.user_id !== user_id), {
          user_id,
          display_name,
          timestamp: Date.now()
        }];
      } else {
        return prev.filter(u => u.user_id !== user_id);
      }
    });
  };

  const handleTyping = () => {
    if (!channel.current) return;

    channel.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        user_id: currentUserId,
        display_name: 'Current User', // Get from profile
        is_typing: true
      }
    });

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      channel.current?.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          user_id: currentUserId,
          is_typing: false
        }
      });
    }, 2000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await uploadVoiceNote(blob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const uploadVoiceNote = async (blob: Blob) => {
    try {
      const fileName = `voice-${Date.now()}.webm`;
      const { data, error } = await supabase.storage
        .from('voice-notes')
        .upload(fileName, blob);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('voice-notes')
        .getPublicUrl(fileName);

      await sendMessage('voice', 'Voice message', {
        file_url: publicUrl,
        duration: 0 // Calculate actual duration
      });
    } catch (error) {
      console.error('Failed to upload voice note:', error);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: currentUserId,
          emoji
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const cleanup = () => {
    if (channel.current) {
      channel.current.unsubscribe();
    }
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
  };

  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Circle Messages
          <Badge variant="outline">
            {onlineUsers.length} online
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map(message => (
            <div key={message.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.user_profile?.avatar_url} />
                <AvatarFallback>
                  {message.user_profile?.display_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {message.user_profile?.display_name || 'Unknown User'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
                
                {message.message_type === 'text' && (
                  <p className="text-sm">{message.content}</p>
                )}
                
                {message.message_type === 'voice' && (
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    <span className="text-sm">Voice message</span>
                  </div>
                )}

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex gap-1">
                    {message.reactions.map(reaction => (
                      <Badge key={reaction.id} variant="outline" className="text-xs">
                        {reaction.emoji}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Quick reactions */}
              <div className="flex gap-1">
                {['❤️', '👍', '😂'].map(emoji => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-xs"
                    onClick={() => addReaction(message.id, emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          
          {/* Typing indicators */}
          {typingUsers.length > 0 && (
            <div className="text-sm text-muted-foreground italic">
              {typingUsers.map(u => u.display_name).join(', ')} typing...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Video className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => sendMessage()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};