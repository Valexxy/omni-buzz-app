import { createClient } from '@supabase/supabase-js';

// NEXT_PUBLIC_ prefix is mandatory for client-side access in Next.js
// We provide a fallback URL format so the build doesn't crash before it can read your Vercel keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);