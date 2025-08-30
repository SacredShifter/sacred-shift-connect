import { VideoRenderPipeline } from './VideoRenderPipeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Test component to demonstrate the video rendering pipeline
export const VideoRenderTestPage = () => {
  // Generate a valid UUID for testing
  const mockPlanId = 'a0b1c2d3-4567-89ab-cdef-123456789abc';
  const mockPlanTitle = 'Sacred Geometry Meditation: Golden Ratio Journey';

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Video Rendering Pipeline Test</CardTitle>
            <CardDescription>
              Test the complete video rendering and YouTube publishing workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VideoRenderPipeline 
              planId={mockPlanId}
              planTitle={mockPlanTitle}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};