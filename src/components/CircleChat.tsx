import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { TransformedSacredCircleInterface } from '@/components/SacredCircle/TransformedSacredCircleInterface';
import { useSacredCircles } from '@/hooks/useSacredCircles';
import { useAuth } from '@/hooks/useAuth';

interface CircleChatProps {
  className?: string;
}

export const CircleChat: React.FC<CircleChatProps> = ({ className }) => {
  const { user } = useAuth();
  const { circles, loading } = useSacredCircles();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);

  // Filter circles the user is a member of
  const userCircles = circles?.filter(circle => circle.is_member) || [];

  const handleCircleSelect = (circleId: string, circleName: string) => {
    setSelectedCircle(circleId);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCircle(null);
  };

  if (!user) return null;

  return (
    <div className={className}>
      {/* Circle Chat Interface */}
      {isOpen && selectedCircle && (
        <div className="fixed inset-0 bg-background z-50">
          <TransformedSacredCircleInterface 
            circleId={selectedCircle}
            circleName={circles?.find(c => c.id === selectedCircle)?.name || 'Sacred Circle'}
            onClose={handleClose}
            className="h-full w-full"
          />
        </div>
      )}

      {/* Circle Selection UI */}
      {!isOpen && (
        <Card className="w-80 max-h-96 flex flex-col shadow-lg">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">My Sacred Circles</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : userCircles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No Sacred Circles yet</p>
                <p className="text-xs">Join a circle to start chatting!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {userCircles.map((circle) => (
                  <div
                    key={circle.id}
                    onClick={() => handleCircleSelect(circle.id, circle.name)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{circle.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {circle.member_count || 0} members
                      </p>
                    </div>
                    <MessageCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};