/**
 * Standardized Error Handling Utilities
 * Provides consistent error handling patterns across the application
 */

import { logger } from './logger';

export interface ErrorContext {
  component: string;
  function: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  fallbackValue?: any;
  retryable?: boolean;
}

/**
 * Standardized error handler for async operations
 */
export const handleAsyncError = async <T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  options: ErrorHandlerOptions = {}
): Promise<T | null> => {
  const {
    showToast = false,
    logLevel = 'error',
    fallbackValue = null,
    retryable = false
  } = options;

  try {
    return await operation();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Log the error with context
    logger[logLevel](`Error in ${context.component}.${context.function}`, {
      ...context,
      error: errorMessage,
      metadata: {
        ...context.metadata,
        retryable,
        timestamp: new Date().toISOString()
      }
    });

    // Show toast if requested
    if (showToast) {
      // This would integrate with your toast system
      console.error(`[${context.component}] ${errorMessage}`);
    }

    return fallbackValue;
  }
};

/**
 * Standardized error handler for Supabase operations
 */
export const handleSupabaseError = async <T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  context: ErrorContext,
  options: ErrorHandlerOptions = {}
): Promise<T | null> => {
  try {
    const { data, error } = await operation();
    
    if (error) {
      logger.error(`Supabase error in ${context.component}.${context.function}`, {
        ...context,
        error: error.message || error,
        metadata: {
          ...context.metadata,
          supabaseError: true,
          errorCode: error.code,
          errorDetails: error.details,
          errorHint: error.hint
        }
      });
      
      if (options.showToast) {
        console.error(`[${context.component}] Database error: ${error.message}`);
      }
      
      return options.fallbackValue || null;
    }
    
    return data;
  } catch (error) {
    return handleAsyncError(
      () => Promise.reject(error),
      context,
      options
    );
  }
};

/**
 * Standardized error handler for React Query operations
 */
export const handleQueryError = (error: any, context: ErrorContext) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  logger.error(`Query error in ${context.component}.${context.function}`, {
    ...context,
    error: errorMessage,
    metadata: {
      ...context.metadata,
      queryError: true,
      timestamp: new Date().toISOString()
    }
  });
  
  return errorMessage;
};

/**
 * Safe property access with fallback
 */
export const safeGet = <T>(
  obj: any,
  path: string,
  fallback: T
): T => {
  try {
    return path.split('.').reduce((current, key) => {
      return current?.[key];
    }, obj) ?? fallback;
  } catch {
    return fallback;
  }
};

/**
 * Safe array operations
 */
export const safeMap = <T, U>(
  array: T[] | null | undefined,
  mapper: (item: T, index: number) => U,
  fallback: U[] = []
): U[] => {
  if (!Array.isArray(array)) return fallback;
  
  try {
    return array.map(mapper);
  } catch {
    return fallback;
  }
};

/**
 * Safe async operation with timeout
 */
export const withTimeout = <T>(
  operation: Promise<T>,
  timeoutMs: number,
  context: ErrorContext
): Promise<T | null> => {
  return Promise.race([
    operation,
    new Promise<null>((_, reject) => 
      setTimeout(() => {
        logger.warn(`Operation timeout in ${context.component}.${context.function}`, {
          ...context,
          metadata: {
            ...context.metadata,
            timeoutMs,
            timestamp: new Date().toISOString()
          }
        });
        reject(new Error('Operation timeout'));
      }, timeoutMs)
    )
  ]).catch(() => null);
};

/**
 * Retry mechanism for failed operations
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
  context: ErrorContext
): Promise<T | null> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        logger.warn(`Retry attempt ${attempt}/${maxRetries} for ${context.component}.${context.function}`, {
          ...context,
          error: lastError.message,
          metadata: {
            ...context.metadata,
            attempt,
            maxRetries,
            delayMs
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  
  logger.error(`All retry attempts failed for ${context.component}.${context.function}`, {
    ...context,
    error: lastError?.message || 'Unknown error',
    metadata: {
      ...context.metadata,
      maxRetries,
      finalAttempt: true
    }
  });
  
  return null;
};
