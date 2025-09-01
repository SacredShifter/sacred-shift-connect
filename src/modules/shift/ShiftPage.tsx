import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShiftCanvas from './scene/ShiftCanvas';

export default function ShiftPage() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button onClick={() => setIsPlaying(!isPlaying)} size="sm">
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>

        {/* Main Content */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Sacred Shift Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="aspect-video bg-background-inset rounded-lg overflow-hidden">
               <ShiftCanvas isPlaying={isPlaying} />
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}