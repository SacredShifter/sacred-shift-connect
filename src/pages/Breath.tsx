import React from 'react';
import { BreathingVisualizer } from '@/components/BreathingVisualizer';
import { VideoRenderTestPage } from '@/components/video/VideoRenderTestPage';

export default function Breath() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Breath of Source
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sacred breathing practices for transformation, healing, and consciousness expansion.
          </p>
        </div>
        
        <BreathingVisualizer />
        
        {/* Video Render Pipeline Test */}
        <div className="mt-12">
          <VideoRenderTestPage />
        </div>
      </div>
    </div>
  );
}