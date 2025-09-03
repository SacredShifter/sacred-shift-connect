// Multi-platform content source management system
// This integrates with the lotus interface for unified content orchestration

export type ContentPlatform = 
  | 'youtube' 
  | 'facebook' 
  | 'instagram' 
  | 'tiktok' 
  | 'twitter' 
  | 'podcast' 
  | 'blog' 
  | 'newsletter' 
  | 'rss' 
  | 'custom';

export interface ContentSourceConfig {
  platform: ContentPlatform;
  name: string;
  description?: string;
  icon: string;
  color: string;
  supportedFeatures: ContentFeature[];
  urlPatterns: RegExp[];
  apiRequired: boolean;
  syncCapabilities: SyncCapability[];
}

export type ContentFeature = 
  | 'video' 
  | 'audio' 
  | 'image' 
  | 'text' 
  | 'live' 
  | 'stories' 
  | 'reels' 
  | 'posts' 
  | 'comments' 
  | 'analytics';

export interface SyncCapability {
  type: 'realtime' | 'scheduled' | 'manual' | 'webhook';
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  batchSize: number;
  rateLimit?: number;
}

export interface ContentSourceMetadata {
  platform: ContentPlatform;
  externalId: string;
  handle?: string;
  displayName: string;
  description?: string;
  avatarUrl?: string;
  followerCount?: number;
  contentCount?: number;
  lastActivity?: string;
  verificationStatus?: 'verified' | 'unverified' | 'pending';
  categories?: string[];
  tags?: string[];
  language?: string;
  country?: string;
  timezone?: string;
  businessHours?: string;
  contactInfo?: {
    email?: string;
    website?: string;
    phone?: string;
  };
  socialLinks?: Record<string, string>;
  monetization?: {
    enabled: boolean;
    methods: string[];
    requirements?: string[];
  };
  compliance?: {
    gdpr: boolean;
    coppa: boolean;
    other: string[];
  };
}

export interface ContentSourceStats {
  totalContent: number;
  totalViews: number;
  totalEngagement: number;
  averageViewsPerContent: number;
  engagementRate: number;
  uploadFrequency: string;
  peakActivityHours: string[];
  contentPerformance: {
    topPerforming: number;
    averagePerforming: number;
    underPerforming: number;
  };
  audienceMetrics: {
    demographics?: Record<string, number>;
    interests?: string[];
    locations?: string[];
    devices?: Record<string, number>;
  };
  growthTrends: {
    followerGrowth: number;
    contentGrowth: number;
    engagementGrowth: number;
  };
}

export interface ContentSourceHealth {
  status: 'healthy' | 'warning' | 'error' | 'offline';
  lastSync: string;
  syncSuccessRate: number;
  errorCount: number;
  lastError?: string;
  nextSync: string;
  syncDuration: number;
  apiQuota: {
    used: number;
    limit: number;
    resetTime: string;
  };
  performance: {
    responseTime: number;
    throughput: number;
    reliability: number;
  };
}

// Platform-specific configurations
export const PLATFORM_CONFIGS: Record<ContentPlatform, ContentSourceConfig> = {
  youtube: {
    platform: 'youtube',
    name: 'YouTube',
    description: 'Video content platform with comprehensive analytics',
    icon: '🎥',
    color: '#FF0000',
    supportedFeatures: ['video', 'live', 'analytics', 'comments'],
    urlPatterns: [
      /^https?:\/\/(www\.)?youtube\.com\/channel\/([^\/]+)/,
      /^https?:\/\/(www\.)?youtube\.com\/@([^\/]+)/,
      /^https?:\/\/(www\.)?youtube\.com\/c\/([^\/]+)/,
      /^https?:\/\/(www\.)?youtube\.com\/user\/([^\/]+)/
    ],
    apiRequired: true,
    syncCapabilities: [
      { type: 'scheduled', frequency: 'daily', batchSize: 50 },
      { type: 'manual', frequency: 'immediate', batchSize: 100 }
    ]
  },
  facebook: {
    platform: 'facebook',
    name: 'Facebook',
    description: 'Social media platform with pages and groups',
    icon: '📘',
    color: '#1877F2',
    supportedFeatures: ['video', 'image', 'text', 'live', 'stories', 'posts'],
    urlPatterns: [
      /^https?:\/\/(www\.)?facebook\.com\/([^\/]+)/,
      /^https?:\/\/(www\.)?fb\.com\/([^\/]+)/
    ],
    apiRequired: true,
    syncCapabilities: [
      { type: 'scheduled', frequency: 'daily', batchSize: 25 },
      { type: 'webhook', frequency: 'immediate', batchSize: 10 }
    ]
  },
  instagram: {
    platform: 'instagram',
    name: 'Instagram',
    description: 'Visual content and stories platform',
    icon: '📸',
    color: '#E4405F',
    supportedFeatures: ['image', 'video', 'stories', 'reels', 'posts'],
    urlPatterns: [
      /^https?:\/\/(www\.)?instagram\.com\/([^\/]+)/,
      /^https?:\/\/(www\.)?instagr\.am\/([^\/]+)/
    ],
    apiRequired: true,
    syncCapabilities: [
      { type: 'scheduled', frequency: 'daily', batchSize: 30 },
      { type: 'manual', frequency: 'immediate', batchSize: 50 }
    ]
  },
  tiktok: {
    platform: 'tiktok',
    name: 'TikTok',
    description: 'Short-form video platform',
    icon: '🎵',
    color: '#000000',
    supportedFeatures: ['video', 'reels', 'trends', 'analytics'],
    urlPatterns: [
      /^https?:\/\/(www\.)?tiktok\.com\/@([^\/]+)/,
      /^https?:\/\/(www\.)?vm\.tiktok\.com\/([^\/]+)/
    ],
    apiRequired: true,
    syncCapabilities: [
      { type: 'scheduled', frequency: 'daily', batchSize: 40 },
      { type: 'manual', frequency: 'immediate', batchSize: 60 }
    ]
  },
  twitter: {
    platform: 'twitter',
    name: 'Twitter',
    description: 'Microblogging and social networking',
    icon: '🐦',
    color: '#1DA1F2',
    supportedFeatures: ['text', 'image', 'video', 'live', 'trends'],
    urlPatterns: [
      /^https?:\/\/(www\.)?twitter\.com\/([^\/]+)/,
      /^https?:\/\/(www\.)?x\.com\/([^\/]+)/
    ],
    apiRequired: true,
    syncCapabilities: [
      { type: 'realtime', frequency: 'immediate', batchSize: 100 },
      { type: 'scheduled', frequency: 'hourly', batchSize: 200 }
    ]
  },
  podcast: {
    platform: 'podcast',
    name: 'Podcast',
    description: 'Audio content and episodes',
    icon: '🎧',
    color: '#8A2BE2',
    supportedFeatures: ['audio', 'text', 'analytics'],
    urlPatterns: [
      /^https?:\/\/(www\.)?spotify\.com\/show\/([^\/]+)/,
      /^https?:\/\/(www\.)?apple\.co\/podcasts\/([^\/]+)/,
      /^https?:\/\/(www\.)?anchor\.fm\/([^\/]+)/
    ],
    apiRequired: false,
    syncCapabilities: [
      { type: 'scheduled', frequency: 'weekly', batchSize: 20 },
      { type: 'manual', frequency: 'immediate', batchSize: 50 }
    ]
  },
  blog: {
    platform: 'blog',
    name: 'Blog',
    description: 'Written content and articles',
    icon: '📝',
    color: '#00CED1',
    supportedFeatures: ['text', 'image', 'comments'],
    urlPatterns: [
      /^https?:\/\/([^\/]+)\.wordpress\.com/,
      /^https?:\/\/([^\/]+)\.blogspot\.com/,
      /^https?:\/\/([^\/]+)\.medium\.com/
    ],
    apiRequired: false,
    syncCapabilities: [
      { type: 'scheduled', frequency: 'daily', batchSize: 10 },
      { type: 'webhook', frequency: 'immediate', batchSize: 5 }
    ]
  },
  newsletter: {
    platform: 'newsletter',
    name: 'Newsletter',
    description: 'Email content and subscriptions',
    icon: '📧',
    color: '#FF6B6B',
    supportedFeatures: ['text', 'image', 'analytics'],
    urlPatterns: [
      /^https?:\/\/([^\/]+)\.substack\.com/,
      /^https?:\/\/([^\/]+)\.beehiiv\.com/,
      /^https?:\/\/([^\/]+)\.convertkit\.com/
    ],
    apiRequired: false,
    syncCapabilities: [
      { type: 'scheduled', frequency: 'weekly', batchSize: 5 },
      { type: 'manual', frequency: 'immediate', batchSize: 10 }
    ]
  },
  rss: {
    platform: 'rss',
    name: 'RSS Feed',
    description: 'Syndicated content feeds',
    icon: '📡',
    color: '#FFA500',
    supportedFeatures: ['text', 'image', 'audio'],
    urlPatterns: [
      /^https?:\/\/([^\/]+)\.xml$/,
      /^https?:\/\/([^\/]+)\/feed/,
      /^https?:\/\/([^\/]+)\/rss/
    ],
    apiRequired: false,
    syncCapabilities: [
      { type: 'scheduled', frequency: 'hourly', batchSize: 100 },
      { type: 'manual', frequency: 'immediate', batchSize: 200 }
    ]
  },
  custom: {
    platform: 'custom',
    name: 'Custom Source',
    description: 'Custom content source integration',
    icon: '🔧',
    color: '#808080',
    supportedFeatures: ['text', 'image', 'video', 'audio'],
    urlPatterns: [/.*/], // Accept any URL
    apiRequired: false,
    syncCapabilities: [
      { type: 'manual', frequency: 'immediate', batchSize: 50 },
      { type: 'webhook', frequency: 'immediate', batchSize: 25 }
    ]
  }
};

// Utility functions for content source management
export function getPlatformConfig(platform: ContentPlatform): ContentSourceConfig {
  return PLATFORM_CONFIGS[platform];
}

export function detectPlatformFromUrl(url: string): ContentPlatform | null {
  for (const [platform, config] of Object.entries(PLATFORM_CONFIGS)) {
    if (config.urlPatterns.some(pattern => pattern.test(url))) {
      return platform as ContentPlatform;
    }
  }
  return null;
}

export function validateSourceUrl(url: string, platform: ContentPlatform): boolean {
  const config = getPlatformConfig(platform);
  return config.urlPatterns.some(pattern => pattern.test(url));
}

export function getSourceIcon(platform: ContentPlatform): string {
  return getPlatformConfig(platform).icon;
}

export function getSourceColor(platform: ContentPlatform): string {
  return getPlatformConfig(platform).color;
}

export function getSupportedFeatures(platform: ContentPlatform): ContentFeature[] {
  return getPlatformConfig(platform).supportedFeatures;
}

export function canSyncRealtime(platform: ContentPlatform): boolean {
  const config = getPlatformConfig(platform);
  return config.syncCapabilities.some(cap => cap.type === 'realtime');
}

export function getOptimalSyncFrequency(platform: ContentPlatform): string {
  const config = getPlatformConfig(platform);
  const realtimeCap = config.syncCapabilities.find(cap => cap.type === 'realtime');
  if (realtimeCap) return realtimeCap.frequency;
  
  const scheduledCap = config.syncCapabilities.find(cap => cap.type === 'scheduled');
  return scheduledCap ? scheduledCap.frequency : 'daily';
}
