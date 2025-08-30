import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useContentSources } from '@/hooks/useContentSources';
import { ContentPlatform } from '@/components/PetalLotus';

interface AddSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPlatform?: ContentPlatform;
}

const PLATFORM_OPTIONS: { value: ContentPlatform; label: string; examples: string[] }[] = [
  { 
    value: 'youtube', 
    label: 'YouTube', 
    examples: [
      'https://www.youtube.com/channel/UCxxxxxx',
      'https://www.youtube.com/@username',
      'https://www.youtube.com/playlist?list=PLxxxxxx'
    ]
  },
  { 
    value: 'facebook', 
    label: 'Facebook', 
    examples: [
      'https://www.facebook.com/pagename',
      'https://www.facebook.com/groups/groupid'
    ]
  },
  { 
    value: 'instagram', 
    label: 'Instagram', 
    examples: [
      'https://www.instagram.com/username',
      '@username'
    ]
  },
  { 
    value: 'tiktok', 
    label: 'TikTok', 
    examples: [
      'https://www.tiktok.com/@username',
      '@username'
    ]
  },
  { 
    value: 'twitter', 
    label: 'Twitter/X', 
    examples: [
      'https://twitter.com/username',
      'https://x.com/username',
      '@username'
    ]
  },
  { 
    value: 'podcast', 
    label: 'Podcast', 
    examples: [
      'https://feeds.example.com/podcast.xml',
      'RSS Feed URL'
    ]
  }
];

const SYNC_FREQUENCIES = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'hourly', label: 'Every hour' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'manual', label: 'Manual only' }
];

export const AddSourceDialog: React.FC<AddSourceDialogProps> = ({
  open,
  onOpenChange,
  defaultPlatform
}) => {
  const [formData, setFormData] = useState({
    name: '',
    platform: defaultPlatform || 'youtube' as ContentPlatform,
    source_url: '',
    sync_frequency: 'daily',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const { addSource } = useContentSources();

  const selectedPlatform = PLATFORM_OPTIONS.find(p => p.value === formData.platform);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addSource(formData);
      onOpenChange(false);
      setFormData({
        name: '',
        platform: defaultPlatform || 'youtube',
        source_url: '',
        sync_frequency: 'daily',
        is_active: true
      });
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Content Source</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Source Name</Label>
            <Input
              id="name"
              placeholder="My YouTube Channel"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select
              value={formData.platform}
              onValueChange={(value: ContentPlatform) => 
                setFormData(prev => ({ ...prev, platform: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORM_OPTIONS.map(platform => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source_url">Source URL</Label>
            <Input
              id="source_url"
              placeholder={selectedPlatform?.examples[0] || 'Enter URL'}
              value={formData.source_url}
              onChange={(e) => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
              required
            />
            {selectedPlatform && (
              <div className="text-xs text-muted-foreground">
                <div className="font-medium mb-1">Examples:</div>
                {selectedPlatform.examples.map((example, i) => (
                  <div key={i} className="font-mono">{example}</div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sync_frequency">Sync Frequency</Label>
            <Select
              value={formData.sync_frequency}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, sync_frequency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SYNC_FREQUENCIES.map(freq => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Source'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};