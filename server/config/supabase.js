const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

let supabase = null;

const isPlaceholderUrl =
  !env.SUPABASE_URL ||
  env.SUPABASE_URL.includes('your-project.supabase.co') ||
  env.SUPABASE_ANON_KEY.includes('your-supabase');

if (!isPlaceholderUrl && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY)) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;
  supabase = createClient(env.SUPABASE_URL, key, {
    auth: {
      persistSession: false,
    },
  });
  console.log('[Supabase] Initialized client with URL:', env.SUPABASE_URL);
} else {
  console.log('[Supabase] Running in local repository fallback mode (Supabase credentials not configured).');
}

module.exports = {
  supabase,
  isConfigured: Boolean(supabase),
};
