import React from 'react';
import { useCollectiveState } from '../context/CollectiveContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic } from 'lucide-react';

interface HUDProps {
    onStartAudio?: () => void;
}

export const HUD: React.FC<HUDProps> = ({ onStartAudio }) => {
  const { onExit } = useCollectiveState();

  return (
    <div className="fixed top-4 left-4 space-x-2">
      <Button variant="ghost" size="sm" onClick={onExit} className="bg-black/50 text-white">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Exit
      </Button>
      {onStartAudio && (
        <Button variant="ghost" size="sm" onClick={onStartAudio} className="bg-black/50 text-white">
            <Mic className="w-4 h-4 mr-2" />
            Start Audio
        </Button>
      )}
    </div>
  );
};