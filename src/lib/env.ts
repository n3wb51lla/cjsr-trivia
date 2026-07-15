const REQUIRED_ENV = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const;

type RequiredEnvKey = (typeof REQUIRED_ENV)[number];

export interface EnvStatus {
  isConfigured: boolean;
  missing: RequiredEnvKey[];
}

export function getEnvStatus(): EnvStatus {
  const missing = REQUIRED_ENV.filter(key => !import.meta.env[key]);
  return {
    isConfigured: missing.length === 0,
    missing,
  };
}

export function getRequiredEnv(key: RequiredEnvKey): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

