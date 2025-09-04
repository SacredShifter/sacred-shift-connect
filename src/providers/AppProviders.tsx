/**
 * App Providers - Nested provider structure for GAA system
 * Order matters: AuthProvider -> BiofeedbackProvider -> CosmicDataProvider -> PresetProvider -> RealtimeOrchestraProvider -> SafetyProvider
 */
import * as React from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { BiofeedbackProvider } from './BiofeedbackProvider';
import { CosmicDataProvider } from './CosmicDataProvider';
import { PresetProvider } from './PresetProvider';
import { RealtimeOrchestraProvider } from './RealtimeOrchestraProvider';
import { SafetyProvider } from './SafetyProvider';
import { DailyRoutineProvider } from './DailyRoutineProvider';
import { TaoFlowProvider } from './TaoFlowProvider';
import { TaoFlowNotificationProvider } from './TaoFlowNotificationProvider';
import { NavigationProvider } from './NavigationProvider';
import { Toaster } from "@/components/ui/sonner";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <NavigationProvider>
        <TaoFlowProvider>
          <TaoFlowNotificationProvider>
            <BiofeedbackProvider>
              <CosmicDataProvider>
                <PresetProvider>
                  <RealtimeOrchestraProvider>
                    <SafetyProvider>
                      <DailyRoutineProvider>
                        <Toaster />
                        {children}
                      </DailyRoutineProvider>
                    </SafetyProvider>
                  </RealtimeOrchestraProvider>
                </PresetProvider>
              </CosmicDataProvider>
            </BiofeedbackProvider>
          </TaoFlowNotificationProvider>
        </TaoFlowProvider>
      </NavigationProvider>
    </AuthProvider>
  );
};