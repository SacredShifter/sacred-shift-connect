import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConstellationView } from "@/components/constellation/ConstellationView";
import { useNavigation } from "@/providers/NavigationProvider";

export function SacredJourneyNavigation() {
  return <ConstellationView className="w-full h-screen" />;

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
        {/* Sacred Journey Header */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Sacred Journey</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Current Stage: <span className="text-primary font-medium">{currentStage}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {unlockedModules.length} of {totalAvailableModules} modules unlocked
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {navigationGroups.map((group) => {          
            return (
              <SidebarGroup 
                key={group.id}
              >
                <SidebarGroupLabel className="flex items-center justify-between">
                  {group.label}
                  {!isCollapsed && group.id !== 'grp-account' && group.id !== 'grp-help' && (
                    <Badge variant="secondary" className="text-xs">
                      {group.children.length}
                    </Badge>
                  )}
                </SidebarGroupLabel>
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

          {/* Locked Modules Hint */}
          {!isCollapsed && unlockedModules.length < totalAvailableModules && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs text-muted-foreground/70">
                Locked Content
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-2 py-3 text-xs text-muted-foreground/60 flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  <span>
                    {totalAvailableModules - unlockedModules.length} more modules await your journey
                  </span>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
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
                <p className="text-xs text-muted-foreground">Sacred Journey</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}