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
              {children}
            </SafetyProvider>
          </RealtimeOrchestraProvider>
        </PresetProvider>
      </CosmicDataProvider>
    </BiofeedbackProvider>
  );
};