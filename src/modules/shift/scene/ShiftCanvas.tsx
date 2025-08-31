import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function ShiftCanvas() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary-glow/50 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary animate-spin"></div>
          </div>
          <h3 className="font-semibold mb-2">Shift Canvas</h3>
          <p className="text-sm text-muted-foreground">
            3D shift experience component restored
          </p>
        </CardContent>
      </Card>
    </div>
  );
}