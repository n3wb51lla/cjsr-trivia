import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { getEnvStatus, getRequiredEnv } from './env';

export interface FirebaseServices {
  readonly app: FirebaseApp;
  readonly database: Database;
}

export const firebaseServices: FirebaseServices | null = (() => {
  if (!getEnvStatus().isConfigured) return null;

  const app = initializeApp({
    apiKey: getRequiredEnv('VITE_FIREBASE_API_KEY'),
    authDomain: getRequiredEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    databaseURL: getRequiredEnv('VITE_FIREBASE_DATABASE_URL'),
    projectId: getRequiredEnv('VITE_FIREBASE_PROJECT_ID'),
    appId: getRequiredEnv('VITE_FIREBASE_APP_ID'),
  });

  return {
    app,
    database: getDatabase(app),
  };
})();

