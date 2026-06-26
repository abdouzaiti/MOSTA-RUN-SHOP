import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  let url: string | undefined;
  let key: string | undefined;

  try {
    const env = (import.meta as any).env;
    if (env) {
      url = env.VITE_SUPABASE_URL;
      key = env.VITE_SUPABASE_ANON_KEY;
    }
  } catch (e) {
    console.warn('Supabase: Could not access import.meta.env');
  }

  // Check if we have valid strings that aren't placeholders or 'undefined'/'null' strings
  const isValid = (val: any): val is string => 
    typeof val === 'string' && 
    val.trim().length > 0 && 
    val !== 'undefined' && 
    val !== 'null' &&
    !val.includes('your-project') &&
    !val.includes('your-anon-key');

  if (!isValid(url) || !isValid(key)) {
    return null;
  }

  try {
    supabaseInstance = createClient(url, key);
    return supabaseInstance;
  } catch (e) {
    console.error('Supabase: Failed to create client:', e);
    return null;
  }
};

// For backward compatibility
export const supabase = getSupabase();
