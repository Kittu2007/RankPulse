import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

let _client: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!_client) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase env vars not set — auth features will be unavailable');
      _client = createSupabaseClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder'
      );
    } else {
      _client = createSupabaseClient(supabaseUrl, supabaseAnonKey);
    }
  }
  return _client;
}

export const supabase = {
  get client() {
    return createClient();
  }
};
