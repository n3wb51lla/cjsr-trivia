import { createClient } from '@supabase/supabase-js';
import { getEnvStatus, getRequiredEnv } from './env';

export const supabase = (() => {
  if (!getEnvStatus().isConfigured) return null;

  return createClient(
    getRequiredEnv('VITE_SUPABASE_URL'),
    getRequiredEnv('VITE_SUPABASE_ANON_KEY'),
  );
})();

