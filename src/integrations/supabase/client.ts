// Supabase client configuration - Updated to fix VITE env error
// Using direct URLs as required by Lovable - No env variables needed

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Direct Supabase configuration (no env variables needed in Lovable)
const SUPABASE_URL = "https://mikltjgbvxrxndtszorb.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pa2x0amdidnhyeG5kdHN6b3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDI3MDksImV4cCI6MjA1OTIxODcwOX0.f4QfhZzSZJ92AjCfbkEMrrmzJrWI617H-FyjJKJ8_70"

// Create client with safe defaults
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
})
