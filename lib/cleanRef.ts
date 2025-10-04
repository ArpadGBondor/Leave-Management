import { db } from './firebase';
import { CollectionConfig } from './types';
import * as admin from 'firebase-admin';

export const buildRef = (body: any, path: CollectionConfig[]) => {
  let ref: FirebaseFirestore.Firestore | FirebaseFirestore.DocumentReference =
    db;

  for (let i = 0; i < path.length; i++) {
    const { collection, idField } = path[i];
    const id = body[idField];
    if (!id) throw new Error(`Bad request. Missing required field: ${idField}`);

    if (ref instanceof admin.firestore.DocumentReference) {
      // already at a document → go into subcollection
      ref = ref.collection(collection).doc(id);
    } else {
      // Firestore root → start collection
      ref = ref.collection(collection).doc(id);
    }
  }

  return ref as FirebaseFirestore.DocumentReference;
};
