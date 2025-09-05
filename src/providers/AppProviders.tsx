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
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary name="AuthProvider">
      <AuthProvider>
        <ErrorBoundary name="BiofeedbackProvider">
          <BiofeedbackProvider>
            <ErrorBoundary name="CosmicDataProvider">
              <CosmicDataProvider>
                <ErrorBoundary name="PresetProvider">
                  <PresetProvider>
                    <ErrorBoundary name="RealtimeOrchestraProvider">
                      <RealtimeOrchestraProvider>
                        <ErrorBoundary name="SafetyProvider">
                          <SafetyProvider>
                            <ErrorBoundary name="DailyRoutineProvider">
                              <DailyRoutineProvider>
                                {children}
                              </DailyRoutineProvider>
                            </ErrorBoundary>
                          </SafetyProvider>
                        </ErrorBoundary>
                      </RealtimeOrchestraProvider>
                    </ErrorBoundary>
                  </PresetProvider>
                </ErrorBoundary>
              </CosmicDataProvider>
            </ErrorBoundary>
          </BiofeedbackProvider>
        </ErrorBoundary>
      </AuthProvider>
    </ErrorBoundary>
  );
};