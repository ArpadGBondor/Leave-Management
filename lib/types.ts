import { FirebaseCollections } from './firebase_collections';
import { HandlerResponse } from '@netlify/functions';

export type CollectionConfig = {
  collection: FirebaseCollections; // collection name
  idField: string; // field in body to use as doc ID
  keepInDoc?: boolean; // if true, field is kept in document; default = false
};

export type HandlerConfigOptions = {
  path: CollectionConfig[]; // sequence of collections/subcollections
  restrictToClaim?: 'ADMIN' | 'SUPER_ADMIN';
  deleteAction?: (
    ref: FirebaseFirestore.DocumentReference
  ) => Promise<HandlerResponse>;
};

// imported bankholiday data from GOV
export type BankHolidayEvent = {
  title: string;
  date: string; // e.g. "2024-03-31"
  notes: string;
  bunting: boolean;
};

export type RegionData = {
  division: string;
  events: BankHolidayEvent[];
};

export type BankHolidayData = {
  'england-and-wales': RegionData;
  scotland: RegionData;
  'northern-ireland': RegionData;
};
