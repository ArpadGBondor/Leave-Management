# [Leave management](https://arpadgbondor.github.io/Leave-Management/)

- [Project goals](#project-goals)
- [Highlights](#highlights)
- [Serverless Backend Functions](#serverless-backend-functions)
  - [/api/auth-set-user-claims (POST)](#apiauth-set-user-claims-post)
  - [/api/import-bank-holidays (POST)](#apiimport-bank-holidays-post)
  - [/api/config (POST|PUT|DELETE)](#apiconfig-postputdelete)
  - [/api/users (POST|PUT|DELETE)](#apiusers-postputdelete)
  - [/api/user-yearly-holiday-configuration (POST|PUT|DELETE)](#apiuser-yearly-holiday-configuration-postputdelete)
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

- Database Management

  - Firebase Firestore rules are configured to allow the web application to read collections directly from Firebase, enabling fast and efficient data access.

  - Netlify backend functions leverage the firebase-admin SDK to securely update, create, or delete data in the Firestore database.

  - Database handler functions are automatically generated using the createUpdateOrDeleteDoc utility located in the libs/handlers directory.
    Using HandlerConfigOptions, these functions can be configured to:

    - Update documents in a top-level collection or within a subcollection of another document.

    - Accept document IDs and parent document IDs as fields in the request body, with customizable field names.

    - Control whether these fields are included or excluded from the written Firestore document.

  - All handler functions are restricted to authenticated users by default. Additionally, access can be limited to specific roles, such as Manager or Owner, for enhanced security and data governance.

## Serverless Backend Functions

### /api/auth-set-user-claims (POST)

- Description:

  - This endpoint updates a user’s Firebase Authentication custom claims based
    on their userType:
    - Manager
      - { ADMIN: true }
    - Owner
      - { ADMIN: true, SUPER_ADMIN: true }
    - (any other value)
      - Removes all existing custom claims

- Request

  - Method: POST
  - Headers

    - Authorization: Bearer token
      - The token must belong to an authorised user.
    - Content-Type: application/json

  - Body:

    - `userId` (string)

      - Firebase Authentication user UID to modify.

    - `userType` (string)

      - 'Manager' user type sets ADMIN claim in Firebase Authentication

      - 'Owner' user type sets ADMIN and SUPER_ADMIN claims in Firebase
        Authentication

      - any other user type removes existing claims from Firebase
        Authentication

- Response 200 OK:

  - { "success": true, "claims": { "ADMIN": true, "SUPER_ADMIN": true } }

- Error responses:

  - 400 Bad request: {"error": "Bad request: ..."}
  - 401 Unauthorised: {"error": "Unauthorised"}
  - 403 Forbidden: {"error": "Forbidden"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

### /api/import-bank-holidays (POST)

- Description:

  - This endpoint retrieves the latest UK bank holiday data from the URL
    specified in the environment variable UK_BANK_HOLIDAY_API.
  - It then synchronizes this data into Firestore, ensuring that:
    - New bank holidays are created if they don’t exist.
    - Existing entries are updated only if their data has changed.
    - Unchanged entries are skipped to minimize unnecessary writes.
  - Each region (e.g., england-and-wales, scotland, northern-ireland) has its
    own Firestore document under the `bank_holidays` collection, and each year
    is stored as a subcollection within that region.
  - A record of imported years is stored in the `bank_holiday_imported_years`
    collection to track which years have been processed.

- Request:

  - Method: POST
  - Headers

    - Authorization: Bearer token
      - The token must belong to an authorised user.
    - Content-Type: application/json

  - Body: (none required)

- Response 200 OK:

  - {"success": true, "created": 10, "updated": 3, "skipped": 45 }

- Error responses:

  - 400 Bad request: {"error": "Bad request: ..."}
  - 401 Unauthorised: {"error": "Unauthorised"}
  - 403 Forbidden: {"error": "Forbidden"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

### /api/config (POST|PUT|DELETE)

- Description:

  - Manages documents in the `config` collection in Firestore.
  - This endpoint uses a reusable handler (createUpdateOrDeleteDoc) to perform create, update, and delete operations with consistent authentication, validation, and timestamp management.

- Request

  - Method: POST | PUT | DELETE
  - Headers

    - Authorization: Bearer token
      - The token must belong to an authorised user.
    - Content-Type: application/json

  - Body:

    - `id` (string): Document ID in firestore

    - `created` (timestamp) & `updated` (timestamp) fields are automatically managed by function

    - other fields: configuration data to store

- Response 200 OK:

  - { "success": true, "doc": { ... stored fields ... } }

- Error responses:

  - 400 Bad request: {"error": "Bad request: ..."}
  - 401 Unauthorised: {"error": "Unauthorised"}
  - 403 Forbidden: {"error": "Forbidden"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

### /api/users (POST|PUT|DELETE)

- Description:
  - Manages documents in the `users` collection in Firestore.
  - This endpoint uses a reusable handler (createUpdateOrDeleteDoc) to perform
    create, update, and delete operations with consistent authentication,
    validation, and timestamp management.
  - Custom Delete Behavior when a user is deleted:
    - The corresponding Firebase Authentication account
      (auth.deleteUser(userId)) is removed.
    - The user’s Firestore document and all subcollections are recursively deleted (db.recursiveDelete(ref)).
- Request:

  - Method: POST | PUT | DELETE
  - Headers

    - Authorization: Bearer token
      - The token must belong to an authorised user.
    - Content-Type: application/json

  - Body:

    - `id` (string): Firebase Auth user UID (used as document ID).

    - `created` (timestamp) & `updated` (timestamp) fields are automatically managed by function

    - other fields: user data to store (e.g.: name, email, ...)

- Response 200 OK:

  - { "success": true, "doc": { ... stored fields ... } }

- Error responses:

  - 400 Bad request: {"error": "Bad request: ..."}
  - 401 Unauthorised: {"error": "Unauthorised"}
  - 403 Forbidden: {"error": "Forbidden"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

### /api/user-yearly-holiday-configuration (POST|PUT|DELETE)

- Description:

  - Manages documents in the `holiday_entitlement` subcollection of user documents in Firestore.
  - This endpoint uses a reusable handler (createUpdateOrDeleteDoc) to perform create, update, and delete operations with consistent authentication, validation, and timestamp management.

- Request:

  - Method: POST | PUT | DELETE
  - Headers

    - Authorization: Bearer token
      - The token must belong to an authorised user.
    - Content-Type: application/json

  - Body:

    - `userId` (string): identifies the user (from the parent Firestore document),

    - `id` (string:) typically represents the year (e.g., "2025").

    - `created` (timestamp) & `updated` (timestamp) fields are automatically managed by function

    - other fields: configuration data to store

- Response 200 OK:

  - { "success": true, "doc": { ... stored fields ... } }

- Error responses:

  - 400 Bad request: {"error": "Bad request: ..."}
  - 401 Unauthorised: {"error": "Unauthorised"}
  - 403 Forbidden: {"error": "Forbidden"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

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
