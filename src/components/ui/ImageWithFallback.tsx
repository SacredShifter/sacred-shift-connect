import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: React.ReactNode;
  onError?: (error: Error) => void;
  onLoad?: () => void;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc,
  className,
  width,
  height,
  placeholder,
  onError,
  onLoad,
  priority = false,
  loading = 'lazy'
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState<string | null>(src || null);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageState('loaded');
    onLoad?.();
  }, [onLoad]);

  const handleImageError = useCallback((error: Error) => {
    console.warn('Image failed to load:', currentSrc, error);
    
    // Try fallback if available and we haven't already tried it
    if (fallbackSrc && currentSrc !== fallbackSrc && !hasError) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
      return;
    }

    // If no fallback or fallback also failed, show error state
    setImageState('error');
    onError?.(error);
  }, [currentSrc, fallbackSrc, hasError, onError]);

  const handleRetry = useCallback(() => {
    setImageState('loading');
    setHasError(false);
    setCurrentSrc(src || null);
  }, [src]);

  // Default placeholder
  const defaultPlaceholder = (
    <div className="flex items-center justify-center bg-muted text-muted-foreground">
      <ImageIcon className="w-6 h-6" />
    </div>
  );

  // Error state
  if (imageState === 'error') {
    return (
      <div 
        className={cn(
          "flex flex-col items-center justify-center bg-muted text-muted-foreground rounded-md",
          className
        )}
        style={{ width, height }}
      >
        <AlertCircle className="w-6 h-6 mb-2" />
        <span className="text-xs text-center px-2">Image failed to load</span>
        <button
          onClick={handleRetry}
          className="mt-2 text-xs text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading state
  if (imageState === 'loading' && !currentSrc) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground rounded-md",
          className
        )}
        style={{ width, height }}
      >
        {placeholder || defaultPlaceholder}
      </div>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {imageState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "flex items-center justify-center bg-muted text-muted-foreground rounded-md",
              className
            )}
            style={{ width, height }}
          >
            <Loader2 className="w-6 h-6 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {currentSrc && (
        <motion.img
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "object-cover rounded-md transition-opacity duration-200",
            imageState === 'loaded' ? 'opacity-100' : 'opacity-0',
            className
          )}
          loading={loading}
          onLoad={handleImageLoad}
          onError={(e) => handleImageError(new Error('Image load failed'))}
          style={{ width, height }}
        />
      )}
    </div>
  );
};

// Specialized thumbnail component
interface ThumbnailProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackIcon?: string;
  className?: string;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  src,
  alt,
  size = 'md',
  fallbackIcon = '🎥',
  className
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const fallbackPlaceholder = (
    <div className="flex items-center justify-center bg-muted text-2xl rounded-full">
      {fallbackIcon}
    </div>
  );

  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      className={cn(
        "rounded-full overflow-hidden",
        sizeClasses[size],
        className
      )}
      placeholder={fallbackPlaceholder}
      fallbackSrc="/placeholder-avatar.png" // You can add a default avatar image
    />
  );
};

// Channel thumbnail component
interface ChannelThumbnailProps {
  src?: string | null;
  channelName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ChannelThumbnail: React.FC<ChannelThumbnailProps> = ({
  src,
  channelName,
  size = 'md',
  className
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const fallbackPlaceholder = (
    <div className="flex items-center justify-center bg-primary text-primary-foreground font-medium rounded-full">
      {getInitials(channelName)}
    </div>
  );

  return (
    <ImageWithFallback
      src={src}
      alt={`${channelName} channel thumbnail`}
      className={cn(
        "rounded-full overflow-hidden",
        sizeClasses[size],
        className
      )}
      placeholder={fallbackPlaceholder}
    />
  );
};
