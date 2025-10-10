# [Leave management](https://arpadgbondor.github.io/Leave-Management/)

- [Project goals](#project-goals)
- [Highlights](#highlights)
- [Environment variables](#environment-variables)

Work in progress...

![work in progress](work-in-progress.jpg)

## Project goals

- Practise React
- Practise Tailwind
- Practise Authentication
- Practise Database management
- Practise Serverless backend functions

## Highlights

- Database management
  - Firabase Firestore rules allow the web project to read collections from
    firebase, so the app can quickly access data
  - Netlify backend functions can use firebase-admin to securely modify data in
    the database
    - Database handler functions are generated through the createOrUpdateDoc
      function in the `libs/handlers` directory. Using HandlerConfigOptions, I
      can generate handler functions that can update documents of a collection
      in the root of the database, or of a subcollection in another document.
      The IDs of these documents and parent documents can get passed as fields
      of the request body, and HandlerConfigOptions can configure the field
      name, and also if these fields should be included or excluded in the
      document written in Firestore. The usage of these handler functions is
      restircted to logged in users, but it is also possible to further restrict
      them to only allow `Manager` or `Owner` users to use them.

## Environment variables

- Firebase config
  - VITE_FIREBASE_CONFIG_API_KEY
  - VITE_FIREBASE_CONFIG_AUTH_DOMAIN
  - VITE_FIREBASE_CONFIG_PROJECT_ID
  - VITE_FIREBASE_CONFIG_STORAGE_BUCKET
  - VITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID
  - VITE_FIREBASE_CONFIG_APP_ID
- Firebase admin configuration for backend functions
  - FIREBASE_SERVICE_ACCOUNT - stringified secret key
- Bank Holidays:
  - UK_BANK_HOLIDAY_API="https://www.gov.uk/bank-holidays.json"
