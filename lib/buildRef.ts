import { db } from './firebase';
import { CollectionConfig } from './types';
import * as admin from 'firebase-admin';

export const buildRef = (
  body: any,
  path: CollectionConfig[],
  isCreate: boolean
) => {
  let ref: FirebaseFirestore.Firestore | FirebaseFirestore.DocumentReference =
    db;

  for (let i = 0; i < path.length; i++) {
    const { collection, idField, keepInDoc } = path[i];
    const id = body[idField];
    if (!id) {
      if (isCreate && i + 1 === path.length) {
        // if last ID is missing let's auto generate it
        ref = ref.collection(collection).doc();
        if (keepInDoc) {
          // if document should include ID, then add new ID to request body
          body[idField] = ref.id;
        }
      } else {
        throw new Error(`Bad request: Missing required field: ${idField}`);
      }
    } else {
      if (ref instanceof admin.firestore.DocumentReference) {
        // already at a document → go into subcollection
        ref = ref.collection(collection).doc(id);
      } else {
        // Firestore root → start collection
        ref = ref.collection(collection).doc(id);
      }
    }
  }

  return ref as FirebaseFirestore.DocumentReference;
};
