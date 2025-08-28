import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, Search, MessageCircle, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id?: string;
  created_at: string;
  sender_profile: {
    display_name?: string;
    avatar_url?: string;
  };
}

interface Conversation {
  id: string;
  other_user: {
    id: string;
    display_name?: string;
    avatar_url?: string;
    email?: string;
  };
  last_message?: string;
  updated_at: string;
}

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by conversation partner
      const conversationMap = new Map();
      data?.forEach(msg => {
        const otherId = msg.sender_id === user?.id ? msg.recipient_id : msg.sender_id;

        if (!conversationMap.has(otherId)) {
          conversationMap.set(otherId, {
            id: otherId,
            other_user: {
              id: otherId,
              display_name: `User ${otherId.slice(0, 8)}`,
              avatar_url: null,
              email: `user-${otherId.slice(0, 8)}@example.com`
            },
            last_message: msg.content,
            updated_at: msg.created_at
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user?.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data?.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        recipient_id: msg.recipient_id,
        created_at: msg.created_at,
        sender_profile: {}
      })) || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          content: newMessage,
          sender_id: user.id,
          recipient_id: selectedConversation
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedConversation);
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Conversations List */}
      <div className="w-80 border-r border-primary/20 bg-background/50">
        <div className="p-4 border-b border-primary/20">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages
          </h2>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No conversations yet</p>
              <p className="text-sm text-muted-foreground">Start connecting with others</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation.id);
                  fetchMessages(conversation.id);
                }}
                className={`p-4 border-b border-primary/10 cursor-pointer hover:bg-accent transition-colors ${
                  selectedConversation === conversation.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={conversation.other_user.avatar_url} />
                    <AvatarFallback>
                      {conversation.other_user.display_name?.[0] || conversation.other_user.email?.[0] || '🌟'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {conversation.other_user.display_name || conversation.other_user.email}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {conversation.last_message}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    message.sender_id === user?.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent'
                  } rounded-lg p-3`}>
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-primary/20 p-4">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;