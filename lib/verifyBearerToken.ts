// lib/auth.ts
import { auth } from './firebase';

export async function verifyBearerToken(authorizationHeader?: string) {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid Authorization header');
  }

  const idToken = authorizationHeader.split('Bearer ')[1];
  return auth.verifyIdToken(idToken);
}
