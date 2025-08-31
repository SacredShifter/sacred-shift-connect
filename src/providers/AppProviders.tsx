/**
 * App Providers - Nested provider structure for GAA system
 * Order matters: BiofeedbackProvider -> CosmicDataProvider -> PresetProvider -> RealtimeOrchestraProvider -> SafetyProvider
 */
import React from 'react';
import { BiofeedbackProvider } from './BiofeedbackProvider';
import { CosmicDataProvider } from './CosmicDataProvider';
import { PresetProvider } from './PresetProvider';
import { RealtimeOrchestraProvider } from './RealtimeOrchestraProvider';
import { SafetyProvider } from './SafetyProvider';
import { DailyRoutineProvider } from './DailyRoutineProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
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
  );
};