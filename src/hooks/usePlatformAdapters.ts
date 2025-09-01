import { supabase } from '@/integrations/supabase/client';

export interface PlatformAdapter {
  name: string;
  type: string;
  icon: string;
  description: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'url' | 'select';
    required: boolean;
    options?: string[];
  }>;
  validateUrl?: (url: string) => boolean;
  extractId?: (url: string) => string | null;
}

export const platformAdapters: Record<string, PlatformAdapter> = {
  youtube: {
    name: 'YouTube',
    type: 'youtube',
    icon: '🎥',
    description: 'Sync videos from YouTube channels',
    fields: [
      {
        name: 'source_name',
        label: 'Source Name',
        type: 'text',
        required: true
      },
      {
        name: 'source_url',
        label: 'Channel URL',
        type: 'url',
        required: true
      },
      {
        name: 'sync_frequency_hours',
        label: 'Sync Frequency',
        type: 'select',
        required: true,
        options: ['1', '6', '12', '24', '168'] // 1h, 6h, 12h, 1d, 1w
      }
    ],
    validateUrl: (url: string) => {
      return /^https:\/\/(www\.)?youtube\.com\/(channel\/|user\/|@)/.test(url);
    },
    extractId: (url: string) => {
      const match = url.match(/(?:channel\/|user\/|@)([^\/?\s]+)/);
      return match ? match[1] : null;
    }
  },
  
  facebook: {
    name: 'Facebook',
    type: 'facebook',
    icon: '📘',
    description: 'Sync posts from Facebook pages (Coming Soon)',
    fields: [
      {
        name: 'source_name',
        label: 'Source Name',
        type: 'text',
        required: true
      },
      {
        name: 'source_url',
        label: 'Page URL',
        type: 'url',
        required: true
      }
    ],
    validateUrl: (url: string) => {
      return /^https:\/\/(www\.)?facebook\.com\//.test(url);
    }
  },

  instagram: {
    name: 'Instagram',
    type: 'instagram',
    icon: '📷',
    description: 'Sync posts from Instagram accounts (Coming Soon)',
    fields: [
      {
        name: 'source_name',
        label: 'Source Name',
        type: 'text',
        required: true
      },
      {
        name: 'source_url',
        label: 'Profile URL',
        type: 'url',
        required: true
      }
    ],
    validateUrl: (url: string) => {
      return /^https:\/\/(www\.)?instagram\.com\//.test(url);
    }
  },

  tiktok: {
    name: 'TikTok',
    type: 'tiktok',
    icon: '🎵',
    description: 'Sync videos from TikTok accounts (Coming Soon)',
    fields: [
      {
        name: 'source_name',
        label: 'Source Name',
        type: 'text',
        required: true
      },
      {
        name: 'source_url',
        label: 'Profile URL',
        type: 'url',
        required: true
      }
    ],
    validateUrl: (url: string) => {
      return /^https:\/\/(www\.)?tiktok\.com\//.test(url);
    }
  },

  twitter: {
    name: 'Twitter/X',
    type: 'twitter',
    icon: '🐦',
    description: 'Sync tweets from Twitter accounts (Coming Soon)',
    fields: [
      {
        name: 'source_name',
        label: 'Source Name',
        type: 'text',
        required: true
      },
      {
        name: 'source_url',
        label: 'Profile URL',
        type: 'url',
        required: true
      }
    ],
    validateUrl: (url: string) => {
      return /^https:\/\/(www\.)?(twitter\.com|x\.com)\//.test(url);
    }
  },

  podcast: {
    name: 'Podcast RSS',
    type: 'podcast',
    icon: '🎙️',
    description: 'Sync episodes from podcast RSS feeds (Coming Soon)',
    fields: [
      {
        name: 'source_name',
        label: 'Podcast Name',
        type: 'text',
        required: true
      },
      {
        name: 'source_url',
        label: 'RSS Feed URL',
        type: 'url',
        required: true
      }
    ],
    validateUrl: (url: string) => {
      return /^https?:\/\/.+\.xml?$/i.test(url) || url.includes('rss') || url.includes('feed');
    }
  }
};

export const usePlatformAdapters = () => {
  const getAdapter = (type: string): PlatformAdapter | undefined => {
    return platformAdapters[type];
  };

  const getAllAdapters = (): PlatformAdapter[] => {
    return Object.values(platformAdapters);
  };

  const validateSource = (type: string, url: string): boolean => {
    const adapter = getAdapter(type);
    if (!adapter?.validateUrl) return true;
    return adapter.validateUrl(url);
  };

  const getSupportedPlatforms = (): string[] => {
    return Object.keys(platformAdapters);
  };

  const getImplementedPlatforms = (): string[] => {
    return ['youtube']; // Only YouTube is fully implemented
  };

  return {
    getAdapter,
    getAllAdapters,
    validateSource,
    getSupportedPlatforms,
    getImplementedPlatforms,
    platformAdapters
  };
};