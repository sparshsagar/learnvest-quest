// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yqaxebblkeqlsmqccrvd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYXhlYmJsa2VxbHNtcWNjcnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3MDE1ODIsImV4cCI6MjA1MjI3NzU4Mn0.vcNoYdDxBu1d_b7AeUXKPpQOSxrvnAFqBIlJTPS9hLo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);