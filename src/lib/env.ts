const REQUIRED_ENV = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

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

export function getOptionalEnv(key: string): string | undefined {
  return import.meta.env[key];
}
