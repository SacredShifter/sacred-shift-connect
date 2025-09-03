// Supabase client configuration - Sacred Shifter integration
// Environment-based configuration for production security

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Environment-based Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://mikltjgbvxrxndtszorb.supabase.co"
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pa2x0amdidnhyeG5kdHN6b3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDI3MDksImV4cCI6MjA1OTIxODcwOX0.f4QfhZzSZJ92AjCfbkEMrrmzJrWI617H-FyjJKJ8_70"

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing required Supabase environment variables')
}

// Create client with optimized configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
})
