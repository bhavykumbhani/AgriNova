import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isPlaceholderUrl =
  !supabaseUrl ||
  supabaseUrl.includes('your-project.supabase.co') ||
  !supabaseAnonKey ||
  supabaseAnonKey.includes('your-anon-key');

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !isPlaceholderUrl &&
  supabaseUrl.startsWith('http')
);

// Mock client proxy when keys are not configured yet, so the frontend never crashes
const createSafeSupabaseClient = () => {
  if (isSupabaseConfigured) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  
  // Safe development fallback logger
  return {
    isConfigured: false,
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase credentials not configured in .env') }),
      signUp: async () => ({ data: null, error: new Error('Supabase credentials not configured in .env') }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
    storage: {
      from: () => ({
        getPublicUrl: (path) => ({ data: { publicUrl: path } }),
      }),
    },
  };
};

export const supabase = createSafeSupabaseClient();
