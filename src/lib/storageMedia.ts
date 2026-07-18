import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import type { QuestionMedia } from '../types';
import { firebaseServices } from './firebase';

export function isMediaUploadConfigured(): boolean {
  return firebaseServices?.storage != null;
}

export async function uploadQuestionMedia(gameCode: string, questionId: number, file: File): Promise<QuestionMedia> {
  if (!firebaseServices?.storage) {
    throw new Error('Media upload is not configured for this deployment. Check VITE_FIREBASE_STORAGE_BUCKET in .env.local.');
  }

  const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
  if (!type) throw new Error('File must be an image or video.');

  const path = `games/${gameCode}/questions/${questionId}/${Date.now()}-${file.name}`;
  const fileRef = storageRef(firebaseServices.storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return { type, url };
}
