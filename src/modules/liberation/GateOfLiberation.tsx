import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface GateOfLiberationProps {
  onExit?: () => void;
}

export default function GateOfLiberation({ onExit }: GateOfLiberationProps) {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modules
          </Button>
        </div>

        {/* Main Content */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Gate of Liberation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Dissolve fear of death/life through embodied journey
            </p>
            
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-primary/20"></div>
              </div>
              <p className="text-muted-foreground">
                Liberation module is being restored. This provides the foundational 
                fear dissolution experience for Sacred Shifter transformation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}