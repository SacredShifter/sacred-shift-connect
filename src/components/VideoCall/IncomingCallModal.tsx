import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, PhoneOff, Video } from 'lucide-react';

interface IncomingCallModalProps {
  isOpen: boolean;
  callerName: string;
  callerAvatar?: string;
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  isOpen,
  callerName,
  callerAvatar,
  onAccept,
  onReject
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md bg-gradient-to-br from-background via-background/95 to-primary/5 border-primary/20">
        <div className="text-center py-6">
          
          {/* Incoming Call Animation */}
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping">
              <div className="w-32 h-32 mx-auto rounded-full bg-primary/20"></div>
            </div>
            <Avatar className="h-32 w-32 mx-auto relative z-10 ring-4 ring-primary/30 ring-offset-2 ring-offset-background">
              <AvatarImage src={callerAvatar} />
              <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                {callerName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Caller Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{callerName}</h2>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Video className="h-4 w-4" />
              <span className="text-sm">Incoming video call</span>
            </div>
          </div>

          {/* Call Actions */}
          <div className="flex items-center justify-center space-x-8">
            
            {/* Reject Call */}
            <Button
              variant="destructive"
              size="lg"
              onClick={onReject}
              className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg"
            >
              <PhoneOff className="h-8 w-8" />
            </Button>

            {/* Accept Call */}
            <Button
              variant="default"
              size="lg"
              onClick={onAccept}
              className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
            >
              <Phone className="h-8 w-8" />
            </Button>

          </div>

          {/* Hint Text */}
          <p className="text-xs text-muted-foreground mt-6">
            Sacred consciousness connection incoming
          </p>

        </div>
      </DialogContent>
    </Dialog>
  );
};