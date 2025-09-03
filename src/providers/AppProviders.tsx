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

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <TaoFlowProvider>
        <BiofeedbackProvider>
          <CosmicDataProvider>
            <PresetProvider>
              <RealtimeOrchestraProvider>
                <SafetyProvider>
                  <DailyRoutineProvider>
                    {children}
                  </DailyRoutineProvider>
                </SafetyProvider>
              </RealtimeOrchestraProvider>
            </PresetProvider>
          </CosmicDataProvider>
        </BiofeedbackProvider>
      </TaoFlowProvider>
    </AuthProvider>
  );
};