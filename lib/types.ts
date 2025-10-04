import { FirebaseCollections } from './firebase_collections';

export type CollectionConfig = {
  collection: FirebaseCollections; // collection name
  idField: string; // field in body to use as doc ID
  keepInDoc?: boolean; // if true, field is kept in document; default = false
};

export type HandlerConfigOptions = {
  path: CollectionConfig[]; // sequence of collections/subcollections
  restrictToClaim?: 'ADMIN' | 'SUPER_ADMIN';
};
