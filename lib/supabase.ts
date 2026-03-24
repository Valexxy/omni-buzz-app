import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// If the keys are missing (like during build), we export a "lazy" creator
export const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // This return prevents the "Invalid URL" crash during build
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

// For backward compatibility in your other files
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;