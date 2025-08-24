import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is not set. Please check your .env file or environment variables.");
}

if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY is not set. Please check your .env file or environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
