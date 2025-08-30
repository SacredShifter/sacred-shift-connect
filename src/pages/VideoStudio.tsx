import React from 'react';
import { VideoRenderTestPage } from '@/components/video/VideoRenderTestPage';

export default function VideoStudio() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Video Studio
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete video rendering and YouTube publishing pipeline for your content.
          </p>
        </div>
        
        <VideoRenderTestPage />
      </div>
    </div>
  );
}