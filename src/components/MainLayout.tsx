import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdaptiveNavigation } from "@/components/navigation/AdaptiveNavigation";
import { NavigationModeToggle } from "@/components/navigation/NavigationModeToggle";
import { UIErrorBoundary } from "@/components/ErrorBoundary";
import { JusticePresenceIndicator } from "@/components/JusticePresenceIndicator";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { SovereignMeshHeader } from "@/components/SovereignMeshHeader";
import { SacredBreadcrumbs } from "@/components/SacredSitemap/SacredBreadcrumbs";
import { SacredBottomToolbar } from "@/components/SacredBottomToolbar";


export const MainLayout = () => {
  const location = useLocation();
  const isHermetic = location.pathname.startsWith('/learn/hermetic');
  
  return (
    <SidebarProvider>
      
      <div className="sidebar-layout min-h-screen flex w-full">
        {!isHermetic && (
          <UIErrorBoundary>
            <AdaptiveNavigation />
          </UIErrorBoundary>
        )}
        <SidebarInset className={`flex-1 flex flex-col min-h-screen ${isHermetic ? '!ml-0' : ''}`}>
          {!isHermetic && (
            <header className="h-14 md:h-12 flex items-center justify-between border-b border-border/30 backdrop-blur-md bg-background/40 px-3 md:px-4 shrink-0 sticky top-0 z-50 safe-area-top">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="mr-2 md:mr-4" />
                <NavigationModeToggle />
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <SovereignMeshHeader />
                <div className="flex items-center gap-1 md:gap-2">
                  <NotificationDropdown />
                  <JusticePresenceIndicator showDetails={false} size="sm" />
                </div>
              </div>
            </header>
          )}
          <main className={`flex-1 min-h-0 flex flex-col ${isHermetic ? '!h-screen' : ''}`}>
            <UIErrorBoundary>
              {!isHermetic && (
                <div className="px-6 pt-4">
                  <SacredBreadcrumbs />
                </div>
              )}
              <Outlet />
            </UIErrorBoundary>
          </main>
        </SidebarInset>
        <SacredBottomToolbar />
      </div>
    </SidebarProvider>
  );
};
