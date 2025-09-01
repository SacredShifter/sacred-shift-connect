import { 
  Home, 
  Rss, 
  Wind, 
  Sparkles, 
  BookOpen, 
  TreePine, 
  Users, 
  MessageCircle, 
  Archive, 
  Stars, 
  Video, 
  LifeBuoy, 
  BookOpenText, 
  Map, 
  Headphones, 
  Activity, 
  User, 
  Settings, 
  Heart, 
  LogOut,
  Shield,
  Brain,
  FlaskConical,
  FileSearch,
  BarChart3,
  Waves
} from "lucide-react";

export type Role = "seeker" | "creator" | "admin";

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  path?: string;
  children?: NavItem[];
  roles?: Role[];
  featureFlag?: string;
  tooltip?: string;
  redirectFrom?: string[];
  action?: () => void;
}

export interface NavGroup {
  id: string;
  label: string;
  icon?: string;
  children: NavItem[];
  roles?: Role[];
  defaultOpen?: boolean;
  collapsedByDefault?: boolean;
}

export const NAV_CONFIG: NavGroup[] = [
  {
    id: "grp-core",
    label: "Core",
    defaultOpen: true,
    children: [
      { 
        id: "dashboard", 
        label: "Dashboard", 
        icon: BarChart3, 
        path: "/dashboard",
        tooltip: "Sacred Journey Dashboard - Your consciousness evolution center"
      },
      { 
        id: "home", 
        label: "Home", 
        icon: Home, 
        path: "/", 
        tooltip: "Home - Sacred community hub and navigation center"
      },
      { 
        id: "feed", 
        label: "Feed", 
        icon: Rss, 
        path: "/feed",
        tooltip: "Social Hub - Feed, messages, and community connection"
      },
    ]
  },
  {
    id: "grp-practice",
    label: "Practice",
    defaultOpen: true,
    children: [
      { 
        id: "breath", 
        label: "Breath of Source", 
        icon: Wind, 
        path: "/breath",
        tooltip: "Sacred breathing practices for transformation and consciousness expansion"
      },
      { 
        id: "meditation", 
        label: "Meditation", 
        icon: Sparkles, 
        path: "/meditation",
        tooltip: "Individual practice and collective consciousness expansion"
      },
      { 
        id: "journal", 
        label: "Journal", 
        icon: BookOpen, 
        path: "/journal",
        tooltip: "Sacred journaling for inner exploration and reflection"
      },
      { 
        id: "grove", 
        label: "The Grove", 
        icon: TreePine, 
        path: "/grove",
        tooltip: "Community rituals & ceremonies"
      },
      { 
        id: "gaa", 
        label: "GAA Engine", 
        icon: Waves, 
        path: "/gaa",
        tooltip: "Geometrically Aligned Audio - Advanced consciousness harmonization technology"
      },
      { 
        id: "learning3d", 
        label: "3D Learning", 
        icon: Sparkles, 
        path: "/learning-3d",
        tooltip: "Interactive 3D learning modules for consciousness exploration"
      },
    ]
  },
  {
    id: "grp-community",
    label: "Community", 
    defaultOpen: true,
    children: [
      { 
        id: "circles", 
        label: "Circles", 
        icon: Users, 
        path: "/circles",
        tooltip: "Deep community engagement and consciousness evolution"
      },
      { 
        id: "messages", 
        label: "Messages", 
        icon: MessageCircle, 
        path: "/messages",
        tooltip: "Private consciousness communication"
      },
      { 
        id: "codex", 
        label: "Codex", 
        icon: Archive, 
        path: "/codex",
        tooltip: "Personal & Collective wisdom archives - unified knowledge exploration"
      },
      { 
        id: "mapper", 
        label: "Consciousness Mapper", 
        icon: Stars, 
        path: "/constellation",
        tooltip: "AI-powered consciousness cartography and pattern recognition"
      },
    ]
  },
  {
    id: "grp-library",
    label: "Library",
    collapsedByDefault: true,
    children: [
      { 
        id: "library", 
        label: "Library (Petals)", 
        icon: Video, 
        path: "/library", 
        redirectFrom: ["/youtube", "/videos"],
        tooltip: "Multi-platform content curation hub with sacred geometry visualization"
      },
    ]
  },
  {
    id: "grp-help",
    label: "Help & Docs",
    collapsedByDefault: true,
    children: [
      { 
        id: "help", 
        label: "Help Center", 
        icon: LifeBuoy, 
        path: "/help",
        tooltip: "FAQs, tutorials, and guidance"
      },
      { 
        id: "guidebook", 
        label: "Guidebook", 
        icon: BookOpenText, 
        path: "/guidebook",
        tooltip: "Ancient wisdom for modern transformation"
      },
      { 
        id: "sitemap", 
        label: "Sacred Sitemap", 
        icon: Map, 
        path: "/sitemap",
        tooltip: "Navigate your consciousness journey through the Sacred Shifter universe"
      },
      { 
        id: "contact", 
        label: "Contact Support", 
        icon: Headphones, 
        path: "/support",
        tooltip: "Get help from our consciousness support team"
      },
      { 
        id: "status", 
        label: "Status", 
        icon: Activity, 
        path: "/status",
        featureFlag: "status.enabled",
        tooltip: "System status and mesh connectivity"
      },
    ]
  },
  {
    id: "grp-account",
    label: "Account",
    children: [
      { 
        id: "profile", 
        label: "Profile", 
        icon: User, 
        path: "/profile",
        tooltip: "Your sacred identity and consciousness profile"
      },
      { 
        id: "settings", 
        label: "Settings", 
        icon: Settings, 
        path: "/settings",
        tooltip: "Customize your Sacred Shifter experience"
      },
      { 
        id: "privacy", 
        label: "Privacy & Data", 
        icon: Shield, 
        path: "/privacy",
        tooltip: "Manage privacy settings, sync options, Sacred Mesh, and data rights"
      },
      { 
        id: "support-shift", 
        label: "Support the Shift", 
        icon: Heart, 
        path: "/support-the-shift",
        tooltip: "Fuel the frequency with donations and support"
      },
      { 
        id: "signout", 
        label: "Sign Out", 
        icon: LogOut, 
        path: "/logout",
        tooltip: "Sign out of your Sacred Shifter account"
      },
    ]
  },
  {
    id: "grp-admin",
    label: "Admin",
    roles: ["admin", "creator"],
    children: [
      { 
        id: "ai-admin", 
        label: "AI Admin", 
        icon: Brain, 
        path: "/ai-admin",
        tooltip: "Advanced neural command center with consciousness mapping"
      },
      { 
        id: "curation", 
        label: "Curation Hub", 
        icon: Sparkles, 
        path: "/admin/curation",
        tooltip: "Manage content sources and curation settings"
      },
      { 
        id: "labs", 
        label: "Labs", 
        icon: FlaskConical, 
        path: "/labs",
        tooltip: "Feature flags and experimental functionality"
      },
      { 
        id: "logs", 
        label: "Audit & Logs", 
        icon: FileSearch, 
        path: "/admin/logs",
        tooltip: "System audit trails and consciousness analytics"
      },
    ]
  },
];

// Helper function to get navigation items filtered by role
export const getNavigationForRole = (userRole?: string): NavGroup[] => {
  return NAV_CONFIG.map(group => {
    // Filter out admin groups for non-admin users
    if (group.roles && !group.roles.includes(userRole as Role)) {
      return null;
    }

    // Filter items within groups based on roles
    const filteredChildren = group.children.filter(item => {
      if (item.roles && !item.roles.includes(userRole as Role)) {
        return false;
      }
      return true;
    });

    return {
      ...group,
      children: filteredChildren
    };
  }).filter(Boolean) as NavGroup[];
};

// Helper to get redirect mappings
export const getRedirectMappings = (): Record<string, string> => {
  const redirects: Record<string, string> = {};
  
  NAV_CONFIG.forEach(group => {
    group.children.forEach(item => {
      if (item.redirectFrom && item.path) {
        item.redirectFrom.forEach(oldPath => {
          redirects[oldPath] = item.path!;
        });
      }
    });
  });

  return redirects;
};