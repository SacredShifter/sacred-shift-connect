import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipWrapper } from "@/components/HelpSystem/TooltipWrapper";
import { getNavigationForRole } from "@/config/navigation";
import { useTaoFlowProgress } from "@/hooks/useTaoFlowProgress";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut, userRole } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const [userProfile, setUserProfile] = useState<{ display_name?: string; avatar_url?: string } | null>(null);
  
  // Get Tao Flow progress
  const { getAllUnlockedModules, isLoading: taoLoading } = useTaoFlowProgress();
  
  // Get navigation items filtered by Tao Flow progress and user role
  const getFilteredNavigation = () => {
    if (taoLoading) return getNavigationForRole(userRole); // Fallback to role-based while loading
    
    const roleBasedNavigation = getNavigationForRole(userRole);
    const unlockedModules = getAllUnlockedModules();
    const unlockedPaths = new Set(unlockedModules.map(m => m.path));
    
    // Filter navigation groups based on unlocked modules
    return roleBasedNavigation.map(group => ({
      ...group,
      children: group.children.filter(item => {
        // Always show account items, help items, and sign out
        if (group.id === 'grp-account' || group.id === 'grp-help' || item.id === 'signout') {
          return true;
        }
        
        // Admin/creator items are role-gated, not Tao Flow gated
        if (group.roles && group.roles.includes('admin')) {
          return true;
        }
        
        // Filter by Tao Flow unlock status
        return item.path ? unlockedPaths.has(item.path) : true;
      })
    })).filter(group => group.children.length > 0);
  };
  
  const navigationGroups = getFilteredNavigation();

  const isActive = (path: string) => currentPath === path;

  // Fetch user profile
  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Subscribe to profile changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (displayName?: string, email?: string) => {
    if (displayName) {
      return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'SS';
  };

  return (
    <Sidebar 
      className={`${isCollapsed ? "w-16" : "w-64"} h-screen border-r border-border/30`} 
      collapsible="icon" 
      data-tour="navigation-sidebar"
    >
      <SidebarContent className="bg-background/20 backdrop-blur-sm h-full flex flex-col overflow-y-auto">
        <div className="flex-1 overflow-y-auto">
          {navigationGroups.map((group) => {          
            return (
              <SidebarGroup 
                key={group.id}
              >
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                  {group.children.map((item) => {
                    const isItemActive = isActive(item.path || "");
                    
                    // Handle sign out specially
                    if (item.id === "signout") {
                      return (
                        <SidebarMenuItem key={item.id}>
                          <TooltipWrapper 
                            content={item.tooltip} 
                            side="right"
                            disabled={!isCollapsed}
                          >
                            <SidebarMenuButton 
                              onClick={handleSignOut}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <item.icon className="mr-2 h-4 w-4" />
                              {!isCollapsed && <span>{item.label}</span>}
                            </SidebarMenuButton>
                          </TooltipWrapper>
                        </SidebarMenuItem>
                      );
                    }

                    // Regular navigation items
                    if (item.path) {
                      return (
                        <SidebarMenuItem key={item.id}>
                          <TooltipWrapper 
                            content={item.tooltip} 
                            side="right"
                            disabled={!isCollapsed}
                          >
                            <SidebarMenuButton 
                              asChild
                              isActive={isItemActive}
                              className={isItemActive ? "bg-primary/10 text-primary font-medium" : ""}
                            >
                              <Link 
                                to={item.path} 
                                data-tour={`nav-${item.label.toLowerCase().replace(/ /g, '-')}`}
                              >
                                <item.icon className="mr-2 h-4 w-4" />
                                {!isCollapsed && <span>{item.label}</span>}
                              </Link>
                            </SidebarMenuButton>
                          </TooltipWrapper>
                        </SidebarMenuItem>
                      );
                    }

                    return null;
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
          })}
        </div>

        {/* User Info */}
        {user && !isCollapsed && (
          <div className="mt-auto p-4 border-t flex-shrink-0" data-tour="profile-section">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={userProfile?.avatar_url || ""} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(userProfile?.display_name, user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {userProfile?.display_name || user.email?.split('@')[0] || 'Seeker'}
                </p>
                <p className="text-xs text-muted-foreground">Seeker</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}