import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getEnvStatus, getOptionalEnv, getRequiredEnv } from './env';

export interface FirebaseServices {
  readonly app: FirebaseApp;
  readonly database: Database;
  readonly storage: FirebaseStorage | null;
}

export const firebaseServices: FirebaseServices | null = (() => {
  if (!getEnvStatus().isConfigured) return null;

  const storageBucket = getOptionalEnv('VITE_FIREBASE_STORAGE_BUCKET');
  const app = initializeApp({
    apiKey: getRequiredEnv('VITE_FIREBASE_API_KEY'),
    authDomain: getRequiredEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    databaseURL: getRequiredEnv('VITE_FIREBASE_DATABASE_URL'),
    projectId: getRequiredEnv('VITE_FIREBASE_PROJECT_ID'),
    appId: getRequiredEnv('VITE_FIREBASE_APP_ID'),
    storageBucket,
  });

  return {
    app,
    database: getDatabase(app),
    storage: storageBucket ? getStorage(app) : null,
  };
})();

