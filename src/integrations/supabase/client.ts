// Supabase client configuration - Sacred Shifter integration
// Direct URL configuration for optimal performance

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

import { env } from '@/lib/env';

// Environment-validated Supabase configuration (production-ready)
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

// Create client with optimized configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Demo mode check for Living Advertisement
export const isDemoMode = () => {
  return window.location.pathname === '/' || window.location.pathname === '/showcase';
}
