export const firebase_collections = {
  USERS: 'users', // stores user data
  HOLIDAY_ENTITLEMENT_SUBCOLLECTION: 'holiday-entitlement', // default holiday entitlement in company config can get overwritten on user level each document ID is a year number the overwrite applies for
  WORKDAYS_OF_THE_WEEK: 'workdays-of-the-week', // default holiday entitlement in company config can get overwritten on user level each document ID is a year number the overwrite applies for
  BANK_HOLIDAY_REGION: 'bank-holiday-region',
  BANK_HOLIDAYS: 'bank_holidays',
  BANK_HOLIDAY_IMPORTED_YEARS: 'bank_holiday_imported_years',
  CONFIG: 'config',
} as const;

export type FirebaseCollections =
  (typeof firebase_collections)[keyof typeof firebase_collections];
