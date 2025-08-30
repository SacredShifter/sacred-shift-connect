import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { TourProvider } from "@/components/TourProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import { MainLayout } from "@/components/MainLayout";
import { ToolbarWithComponents } from "@/components/ToolbarWithComponents";

import { ErrorBoundary, UIErrorBoundary } from "@/components/ErrorBoundary";
import { ProductionReadyErrorBoundary } from "@/components/production/ProductionReadyErrorBoundary";
import { PerformanceMonitor } from "@/components/production/PerformanceMonitor";
import SacredScreensaver from "@/components/SacredScreensaver";

import Dashboard from './pages/Dashboard';
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Circles from "./pages/Circles";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Journal from "./pages/Journal";
import VideoLibrary from "./pages/VideoLibrary";
import CollectiveAkashicConstellationPage from "./pages/CollectiveAkashicConstellation";
import RegistryEntry from "./pages/RegistryEntry";
import AkashicConstellationPage from "./pages/AkashicConstellation";
import Guidebook from "./pages/Guidebook";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import AuthConfirm from "./pages/AuthConfirm";
import NotFound from "./pages/NotFound";
import AuraQuantumCommandNexus from '@/pages/AuraQuantumCommandNexus';
import ConstellationMapper from "./pages/ConstellationMapper";
import Grove from "./pages/Grove";
import Liberation from "./pages/Liberation";
import Shift from './pages/Shift';
import Meditation from './pages/Meditation';
import Breath from './pages/Breath';
import Learning3D from './pages/Learning3D';
import FeaturesComingSoon from './pages/FeaturesComingSoon';
import { DevSitemap } from './components/SacredSitemap/DevSitemap';
import { UserSitemap } from './components/SacredSitemap/UserSitemap';


function App() {
  return (
    <ProductionReadyErrorBoundary>
      <PerformanceMonitor />
      <ErrorBoundary name="Root">
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <SacredScreensaver 
          timeout={120000} 
          visualType="breath_orb" 
          enabled={true}
        >
          <div className="min-h-screen relative w-full bg-black">
            <Routes>
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
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/circles" element={<Circles />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/videos" element={<VideoLibrary />} />
                  <Route path="/registry" element={<CollectiveAkashicConstellationPage />} />
                  <Route path="/resonance/entries/:id" element={<RegistryEntry />} />
                  <Route path="/codex" element={<AkashicConstellationPage />} />
                  <Route path="/grove" element={<Grove />} />
                  <Route path="/liberation" element={<Liberation />} />
                  <Route path="/guidebook" element={<Guidebook />} />
                  <Route path="/learning-3d" element={<Learning3D />} />
                  <Route path="/constellation" element={<ConstellationMapper />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/ai-admin" element={<AdminRoute><AuraQuantumCommandNexus /></AdminRoute>} />
                  <Route path="/shift" element={<Shift />} />
                  <Route path="/meditation" element={<Meditation />} />
                  <Route path="/breath" element={<Breath />} />
                  <Route path="/features-coming-soon" element={<FeaturesComingSoon />} />
                  <Route path="/sitemap" element={<UserSitemap />} />
                  <Route path="/dev/sitemap" element={<DevSitemap />} />
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