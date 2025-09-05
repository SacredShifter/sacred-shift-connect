/**
 * Standardized Loading State Component
 * Provides consistent loading states across the application
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
  variant?: 'default' | 'minimal' | 'spinner' | 'dots';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  size = 'md',
  text,
  className,
  fullScreen = false,
  variant = 'default'
}) => {
  const baseClasses = cn(
    'flex items-center justify-center',
    fullScreen && 'min-h-screen',
    className
  );

  const textClasses = cn(
    'ml-2 text-muted-foreground',
    textSizeClasses[size]
  );

  if (variant === 'minimal') {
    return (
      <div className={cn(baseClasses, 'p-2')}>
        <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div className={cn(baseClasses, 'p-4')}>
        <div className="relative">
          <Loader2 className={cn('animate-spin', sizeClasses[size])} />
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn(baseClasses, 'p-4')}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        {text && <p className={textClasses}>{text}</p>}
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn('animate-spin', sizeClasses[size])} />
        {text && <p className={textClasses}>{text}</p>}
      </div>
    </div>
  );
};

/**
 * Hook for managing loading states
 */
export const useLoadingState = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [loadingText, setLoadingText] = React.useState<string | undefined>();

  const startLoading = (text?: string) => {
    setIsLoading(true);
    setLoadingText(text);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingText(undefined);
  };

  const withLoading = async <T,>(
    operation: () => Promise<T>,
    text?: string
  ): Promise<T | null> => {
    try {
      startLoading(text);
      return await operation();
    } catch (error) {
      console.error('Operation failed:', error);
      return null;
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    withLoading
  };
};

/**
 * Loading wrapper for components
 */
interface LoadingWrapperProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'minimal' | 'spinner' | 'dots';
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  loadingText,
  children,
  fallback,
  size = 'md',
  variant = 'default'
}) => {
  if (isLoading) {
    return fallback || <LoadingState size={size} text={loadingText} variant={variant} />;
  }

  return <>{children}</>;
};
