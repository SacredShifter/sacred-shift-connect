import { VideoRenderPipeline } from './VideoRenderPipeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
            
            {/* Admin Link */}
            <Card className="mt-8 bg-gradient-to-r from-red-500/10 to-red-500/5 border-red-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Video Studio Administration</h3>
                    <p className="text-sm text-muted-foreground">
                      Access advanced admin controls, YouTube policy compliance, and detailed analytics
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('/ai-admin', '_blank')}
                    className="border-red-500/20 hover:bg-red-500/10"
                  >
                    Open Admin Panel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};