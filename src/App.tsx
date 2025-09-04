import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import { TourProvider } from "@/components/TourProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import { MainLayout } from "@/components/MainLayout";
import { ToolbarWithComponents } from "@/components/ToolbarWithComponents";
import { GAADashboard } from "@/components/gaa/GAADashboard";
import { CosmicVisualization } from "@/components/gaa/CosmicVisualization";
import { SessionMetrics } from "@/components/gaa/SessionMetrics";
import { TermsOfService } from "@/pages/TermsOfService";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import { PrivacySettings } from "@/pages/PrivacySettings";

import { ErrorBoundary, UIErrorBoundary } from "@/components/ErrorBoundary";
import { ProductionReadyErrorBoundary } from "@/components/production/ProductionReadyErrorBoundary";
import { PerformanceMonitor } from "@/components/production/PerformanceMonitor";
import SacredScreensaver from "@/components/SacredScreensaver";

import Dashboard from './pages/Dashboard';
import DailyRitual from './pages/DailyRitual';
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Circles from "./pages/Circles";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Journal from "./pages/Journal";
import VideoLibrary from "./pages/VideoLibrary";
import VideoStudio from "./pages/VideoStudio";
import CollectiveAkashicConstellationPage from "./pages/CollectiveAkashicConstellation";
import RegistryEntry from "./pages/RegistryEntry";
import Codex from "./pages/Codex";
import Guidebook from "./pages/Guidebook";
import Support from "./pages/Support";
import Help from "./pages/Help";
import Status from "./pages/Status";
import ScreensaverPage from "./pages/Screensaver";
import Auth from "./pages/Auth";
import AuthConfirm from "./pages/AuthConfirm";
import NotFound from "./pages/NotFound";
import JusticeQuantumCommandNexus from '@/pages/JusticeQuantumCommandNexus';
import ConstellationMapper from "./pages/ConstellationMapper";
import Grove from "./pages/Grove";
import Liberation from "./pages/Liberation";
import { CollectiveCoherenceCircle } from "@/modules/collective";
import Shift from './pages/Shift';
import Meditation from './pages/Meditation';
import Breath from './pages/Breath';
import Learning3D from './pages/Learning3D';
import FeaturesComingSoon from './pages/FeaturesComingSoon';
import AdminLogs from './pages/AdminLogs';
import { DevSitemap } from './components/SacredSitemap/DevSitemap';
import { UserSitemap } from './components/SacredSitemap/UserSitemap';
import Ethos from './pages/Ethos';
import HardwarePulseFi from './pages/HardwarePulseFi';
import DailyPractice from './pages/DailyPractice';
import JourneyMap from './pages/JourneyMap';
import PreReleaseLanding from './pages/PreReleaseLanding';


function App() {
  // Mock components for GAA routes
  const TarotMode = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tarot Archetypes</h1>
      <div className="text-center text-muted-foreground">
        Deep5 Archetype selector will be displayed here
      </div>
    </div>
  );

  const CosmicPage = () => {
    const mockCosmicData = [{
      id: 'andromeda', name: 'Andromeda Galaxy', type: 'galaxy' as const,
      coordinates: { rightAscension: 10.68, declination: 41.27, distance: 2537000 },
      physicalProperties: { mass: 1.5e12, diameter: 220000 },
      geometricSignature: {
        vertices: [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
        boundingBox: { min: [0, 0, 0], max: [1, 1, 1] },
        sacredRatios: { phi: 1.618, pi: 3.14159, sqrt2: 1.414 }
      },
      audioMapping: { baseFrequency: 440, harmonicSeries: [1, 2, 3], amplitude: 0.5, duration: 10 },
      discoveryInfo: { confidence: 'confirmed' as const }
    }];
    
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Cosmic Visualization</h1>
        <div className="h-[600px]">
          <CosmicVisualization cosmicData={mockCosmicData} shadowEngineState={null} isActive={true} />
        </div>
      </div>
    );
  };

  const MetricsPage = () => {
    const mockGAAEngineState = {
      isInitialized: true, isPlaying: false, currentPhase: 'idle' as const,
      oscillatorCount: 0, currentGeometry: { complexity: 0.5, vertices: 8, faces: 6 },
      biofeedbackIntegration: false, lastUpdate: Date.now()
    };
    
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Session Metrics</h1>
        <SessionMetrics
          biofeedbackState={null} gaaEngineState={mockGAAEngineState}
          sessionDuration={300000} safetyAlerts={[]} isActive={false}
        />
      </div>
    );
  };

  return (
      <ProductionReadyErrorBoundary>
      <PerformanceMonitor />
      <ErrorBoundary name="Root">
          <TooltipProvider>
            <Toaster />
            <Sonner />
          <SacredScreensaver 
            timeout={120000} 
            enabled={true}
          >
            <div className="min-h-screen relative w-full bg-black">
            <Routes>
              <Route path="/portal" element={<PreReleaseLanding />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/confirm" element={<AuthConfirm />} />
              <Route
                element={
                  <ProtectedRoute>
                    <TourProvider>
                      <MainLayout />
                    </TourProvider>
                  </ProtectedRoute>
                }
                >
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/journey-map" element={<JourneyMap />} />
                  <Route path="/daily-ritual" element={<DailyRitual />} />
                  
                  {/* Redirects for old routes */}
                  <Route path="/youtube" element={<Navigate to="/library" replace />} />
                  <Route path="/videos" element={<Navigate to="/library" replace />} />
                  
                  {/* Core Routes */}
                  <Route path="/feed" element={<Feed />} />
                  
                   {/* Practice Routes */}
                   <Route path="/practice/daily" element={<DailyPractice />} />
                   <Route path="/breath" element={<Breath />} />
                   <Route path="/meditation" element={<Meditation />} />
                   <Route path="/journal" element={<Journal />} />
                   <Route path="/grove" element={<Grove />} />
                   
                    {/* GAA System Routes */}
                    <Route path="/gaa" element={<GAADashboard />} />
                    <Route path="/gaa/archetypes" element={<TarotMode />} />
                    <Route path="/gaa/cosmic" element={<CosmicPage />} />
                    <Route path="/gaa/metrics" element={<MetricsPage />} />
                    
                    {/* Hardware Routes */}
                    <Route path="/hardware/pulse-fi" element={<HardwarePulseFi />} />
                    
                    {/* Community Routes */}
                  <Route path="/circles" element={<Circles />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/codex" element={<Codex />} />
                  <Route path="/constellation" element={<ConstellationMapper />} />
                  
                  {/* Library Routes */}
                  <Route path="/library" element={<VideoLibrary />} />
                  <Route path="/video-studio" element={<VideoStudio />} />
                  
                  {/* Help & Docs Routes */}
                  <Route path="/help" element={<Help />} />
                  <Route path="/guidebook" element={<Guidebook />} />
                  <Route path="/sitemap" element={<UserSitemap />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/status" element={<Status />} />
                  <Route path="/screensaver" element={<ScreensaverPage />} />
                  
                  {/* Account Routes */}
                  <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/privacy" element={<PrivacySettings />} />
                  <Route path="/support-the-shift" element={<Support />} />
                  
                  {/* Admin Routes */}
                  <Route path="/ai-admin" element={<AdminRoute><JusticeQuantumCommandNexus /></AdminRoute>} />
                  <Route path="/admin/curation" element={<AdminRoute><VideoLibrary /></AdminRoute>} />
                  <Route path="/admin/logs" element={<AdminRoute><AdminLogs /></AdminRoute>} />
                  <Route path="/labs" element={<AdminRoute><FeaturesComingSoon /></AdminRoute>} />
                  
                  {/* Legacy Routes */}
                  <Route path="/registry" element={<CollectiveAkashicConstellationPage />} />
                  <Route path="/resonance/entries/:id" element={<RegistryEntry />} />
                  <Route path="/liberation" element={<Liberation />} />
                  <Route path="/collective" element={<CollectiveCoherenceCircle onExit={() => window.history.back()} />} />
                  <Route path="/learning-3d" element={<Learning3D />} />
                  <Route path="/shift" element={<Shift />} />
                  <Route path="/features-coming-soon" element={<FeaturesComingSoon />} />
                  <Route path="/dev/sitemap" element={<DevSitemap />} />
                  <Route path="/ethos" element={<Ethos />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Proper Toolbar with Component Loading */}
              <ToolbarWithComponents />
            </div>
        </SacredScreensaver>
        </TooltipProvider>
      </ErrorBoundary>
    </ProductionReadyErrorBoundary>
  );
}

export default App;