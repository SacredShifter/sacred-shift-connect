import React, { useState, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  source_platform?: string;
  source_url?: string;
  external_url?: string;
  category_name?: string;
  featured_priority: number;
  energy_level: number;
  consciousness_level: string;
  genre_tags: string[];
  mood_tags: string[];
  teaching_notes?: string;
  created_at: string;
  content_type?: string;
  author_name?: string;
  author_url?: string;
}

interface MediaModalProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({
  media,
  isOpen,
  onClose
}) => {
  if (!media) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{media.title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full w-10 h-10 p-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <img
            src={media.thumbnail_url}
            alt={media.title}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-muted-foreground">{media.description}</p>
        <Button
          onClick={() => window.open(media.source_url || media.external_url, '_blank')}
          className="mt-4"
        >
          <Play className="w-4 h-4 mr-2" />
          Play on {media.source_platform || 'Sacred Shifter'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};