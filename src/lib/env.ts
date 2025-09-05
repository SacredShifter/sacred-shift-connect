/**
 * Environment Variable Validation and Configuration
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_SENTRY_DSN?: string;
  SENTRY_AUTH_TOKEN?: string;
  SENTRY_ORG?: string;
  SENTRY_PROJECT?: string;
  OPENAI_API_KEY?: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

class EnvironmentValidator {
  private config: Partial<EnvConfig> = {};
  private errors: string[] = [];

  validate(): EnvConfig {
    this.errors = [];
    this.config = {};

    // Check if we're in demo mode (Living Advertisement)
    const isDemoMode = window.location.pathname === '/' || window.location.pathname === '/showcase';
    
    if (isDemoMode) {
      // For Living Advertisement, use demo values
      this.config.VITE_SUPABASE_URL = 'https://demo.supabase.co';
      this.config.VITE_SUPABASE_ANON_KEY = 'demo-key-for-living-advertisement';
    } else {
      // Required environment variables for full app
      this.validateRequired('VITE_SUPABASE_URL', 'Supabase URL is required');
      this.validateRequired('VITE_SUPABASE_ANON_KEY', 'Supabase anonymous key is required');
    }
    
    // Optional environment variables
    this.validateOptional('VITE_SENTRY_DSN');
    this.validateOptional('SENTRY_AUTH_TOKEN');
    this.validateOptional('SENTRY_ORG');
    this.validateOptional('SENTRY_PROJECT');
    this.validateOptional('OPENAI_API_KEY');
    
    // NODE_ENV with default
    this.config.NODE_ENV = (import.meta.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development';

    // Validate Supabase URL format (skip for demo mode)
    if (this.config.VITE_SUPABASE_URL && !isDemoMode) {
      this.validateSupabaseUrl(this.config.VITE_SUPABASE_URL);
    }

    // Validate Supabase key format (skip for demo mode)
    if (this.config.VITE_SUPABASE_ANON_KEY && !isDemoMode) {
      this.validateSupabaseKey(this.config.VITE_SUPABASE_ANON_KEY);
    }

    // Validate Sentry DSN format
    if (this.config.VITE_SENTRY_DSN) {
      this.validateSentryDsn(this.config.VITE_SENTRY_DSN);
    }

    if (this.errors.length > 0) {
      throw new Error(`Environment validation failed:\n${this.errors.join('\n')}`);
    }

    return this.config as EnvConfig;
  }

  private validateRequired(key: keyof EnvConfig, message: string) {
    const value = import.meta.env[key];
    if (!value || value.trim() === '') {
      this.errors.push(message);
    } else {
      this.config[key] = value as any;
    }
  }

  private validateOptional(key: keyof EnvConfig) {
    const value = import.meta.env[key];
    if (value && value.trim() !== '') {
      this.config[key] = value as any;
    }
  }

  private validateSupabaseUrl(url: string) {
    try {
      const urlObj = new URL(url);
      if (!urlObj.hostname.includes('supabase.co')) {
        this.errors.push('VITE_SUPABASE_URL must be a valid Supabase URL');
      }
    } catch {
      this.errors.push('VITE_SUPABASE_URL must be a valid URL');
    }
  }

  private validateSupabaseKey(key: string) {
    // Supabase keys are JWT tokens, should start with 'eyJ'
    if (!key.startsWith('eyJ')) {
      this.errors.push('VITE_SUPABASE_ANON_KEY must be a valid Supabase JWT token');
    }
  }

  private validateSentryDsn(dsn: string) {
    try {
      const url = new URL(dsn);
      if (!url.hostname.includes('sentry.io')) {
        this.errors.push('VITE_SENTRY_DSN must be a valid Sentry DSN');
      }
    } catch {
      this.errors.push('VITE_SENTRY_DSN must be a valid URL');
    }
  }

  getErrors(): string[] {
    return this.errors;
  }
}

// Validate environment variables on import
const validator = new EnvironmentValidator();
let envConfig: EnvConfig;

try {
  envConfig = validator.validate();
} catch (error) {
  console.error('Environment validation failed:', error);
  
  // In development, show detailed error
  if (import.meta.env.DEV) {
    console.error('Missing or invalid environment variables:');
    validator.getErrors().forEach(error => console.error(`  - ${error}`));
    console.error('\nPlease check your .env.local file and ensure all required variables are set.');
  }
  
  // In production, throw error to prevent app from starting
  throw error;
}

export const env = envConfig;

// Environment-specific configurations
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Feature flags based on environment
export const features = {
  enableSentry: isProduction && !!env.VITE_SENTRY_DSN,
  enableAnalytics: isProduction,
  enableDebugLogging: isDevelopment,
  enableHMR: isDevelopment,
  enableSourceMaps: isDevelopment,
  enablePerformanceMonitoring: isProduction,
  enableErrorReporting: isProduction
};

// Log environment configuration (without sensitive data)
if (isDevelopment) {
  console.log('Environment configuration:', {
    NODE_ENV: env.NODE_ENV,
    features,
    supabaseUrl: env.VITE_SUPABASE_URL,
    hasSentryDsn: !!env.VITE_SENTRY_DSN,
    hasOpenAIKey: !!env.OPENAI_API_KEY
  });
}
