import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
}

interface MessagingCoreProps {
  circleId: string;
  userId: string;
}

export const MessagingCore: React.FC<MessagingCoreProps> = ({ circleId, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = () => {
    if (!newMessage.trim() || isLoading) return;

    const mockMessage: Message = {
      id: Date.now().toString(),
      body: newMessage,
      sender_id: userId,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, mockMessage]);
    setNewMessage('');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Messages
          <Badge variant="secondary">{messages.length}</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {messages.map((message) => (
            <div key={message.id} className="p-2 rounded bg-muted">
              <div className="text-sm text-muted-foreground">
                User {message.sender_id.slice(0, 8)}
              </div>
              <div>{message.body}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(message.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={isLoading || !newMessage.trim()}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};