# [Leave management](https://arpadgbondor.github.io/Leave-Management/)

- [Project goals](#project-goals)
- [Overview](#overview)
- [Highlights](#highlights)
  - [Real-time, Dashboard-like Behaviour](#real-time-dashboard-like-behaviour)
  - [Database Management](#database-management)
- [Pages](#pages)
  - [Getting Started](#getting-started)
  - [About](#about)
  - [Register](#register)
  - [Login](#login)
  - [Logout](#logout)
  - [Profile](#profile)
  - [Manage company](#manage-company)
  - [Manage team](#manage-team)
  - [Team member calendars](#team-member-calendars)
  - [Team's pending requests](#teams-pending-requests)
  - [Team's approved leaves](#teams-approved-leaves)
  - [Team's rejected leaves](#teams-rejected-leaves)
  - [Your calendar](#your-calendar)
  - [Your pending requests](#your-pending-requests)
  - [Your approved leaves](#your-approved-leaves)
  - [Your rejected leaves](#your-rejected-leaves)
- [Serverless Backend Functions](#serverless-backend-functions)
  - [/api/approved-leave-cancel (DELETE)](#apiapproved-leave-cancel-delete)
  - [/api/approved-leave-change-request (POST)](#apiapproved-leave-change-request-post)
  - [/api/auth-set-user-claims (POST)](#apiauth-set-user-claims-post)
  - [/api/config (POST|PUT|DELETE)](#apiconfig-postputdelete)
  - [/api/import-bank-holidays (POST)](#apiimport-bank-holidays-post)
  - [/api/rejected-leaves (POST|PUT|DELETE)](#apirejected-leaves-postputdelete)
  - [/api/rejected-leave-re-request (POST)](#apirejected-leave-re-request-post)
  - [/api/requests (POST|PUT|DELETE)](#apirequests-postputdelete)
  - [/api/request-approve (POST)](#apirequest-approve-post)
  - [/api/request-reject (POST)](#apirequest-reject-post)
  - [/api/user (POST|PUT|DELETE)](#apiuser-postputdelete)
  - [/api/user-yearly-holiday-configuration (POST|PUT|DELETE)](#apiuser-yearly-holiday-configuration-postputdelete)
- [Environment variables](#environment-variables)

## Project goals

- Practise React
- Practise Tailwind
- Practise Authentication
- Practise Database management
- Practise Serverless backend functions

## Overview

Overview

The Leave Management is a demo web application that allows users to register, manage leave requests, and configure company-wide holiday policies. It demonstrates a typical employee leave workflow, including authentication, user roles, and entitlement management.

- Note:

  This is a demo application. In a production environment, user management and permissions would be tightly controlled by the company’s management or system administrators.

## Highlights

### Real-time, Dashboard-like Behaviour

- The application uses Firebase Firestore real-time listeners (subscriptions)
  across most pages. Any change in the database, whether triggered by the current user or another
  user, is reflected immediately in the UI without requiring a page refresh.

- When data in Firestore changes, the UI of the following features will synchronise automatically:

  - Personal and team calendars
  - Pending, approved, and rejected leave lists
  - Team request queues for Managers and Owners
  - Remaining yearly holiday entitlement calculations
  - Role-dependent views and permissions

- Actions taken by one user (for example, a manager approving a leave request)
  are instantly visible to all affected users:

  - The employee sees the update on their Home dashboard and request lists
  - Managers see team views update in real time
  - Calendars recalculate availability immediately

- Reports are intentionally excluded from using real-time subscriptions.
  These are calculated on demand to reduce unnecessary reads and improve
  performance.

### Database Management

- Firebase Firestore rules are configured to allow the web application to read collections directly from Firebase, enabling fast and efficient data access.

- Netlify backend functions leverage the firebase-admin SDK to securely update, create, or delete data in the Firestore database.

- Database handler functions are automatically generated using the createUpdateOrDeleteDoc utility located in the libs/handlers directory.
  Using HandlerConfigOptions, these functions can be configured to:

  - Update documents in a top-level collection or within a subcollection of another document.

  - Accept document IDs and parent document IDs as fields in the request body, with customizable field names.

  - Control whether these fields are included or excluded from the written Firestore document.

- All handler functions are restricted to authenticated users by default. Additionally, access can be limited to specific roles, such as Manager or Owner, for enhanced security and data governance.

## Pages

### Getting Started

- This page introduces new users to the application and explains the three
  available roles: Employee, Manager, and Owner.

- All users begin as Employees, but (for demo purposes) can switch roles from
  the Profile page at any time.

- As an Employee a user can:

  - Update personal details on the Profile page
  - Create and track leave requests
  - View approved and rejected leaves
  - See their personalised calendar on the Home page (workdays, bank holidays, leave, yearly entitlement)

- Managers have all Employee permissions plus team-level tools:

  - Approve or reject team leave requests
  - View team approved/rejected leaves
  - Manage team member data on Manage team page (roles, entitlements, workdays,
    employment dates)
  - View team calendars

- Owners have full admin control:

  - Configure company defaults on Manage company page (entitlements, work schedule,
    bank holidays)
  - Defaults apply automatically unless overridden per user

### About

- This project is a Leave Management practice application, built to keep my React skills sharp and explore practical UI and data-handling patterns.

- Created by [Árpád Gábor Bondor](https://github.com/ArpadGBondor) (2025)

- The background image used in the UI is a photo by [Asad Photo Maldives](https://www.pexels.com/hu-hu/foto/457882/), sourced from Pexels:

### Register

- Users can register by:

  - Filling out the registration form (name, email, password, and profile picture), or

  - Using Google Single Sign-On (SSO).

- Registration is open to everyone for demo purposes.

- In a production system, only Management should be able to add or remove users.

### Login

- Users can log in using:

  - Email + Password, or

  - Google SSO.

### Logout

- Users can sign out by navigating to the Logout page.

- This clears their active session and returns them to the login page.

### Profile

- Users can:

  - Change their name, profile image, and user type.

  - (For demo purposes) promote themselves to Manager roles to explore restricted features.

- SSO users can set a password on their Firebase Authentication record to enable email + password login in the future.

  - Known Issue: When logging in with Google SSO for the first time, Firebase may remove any previously stored password.

  - This feature allows users to restore email login access if that occurs.

- Right to be Forgotten:
  - Users can delete their own accounts.
    This feature ensures that testers can remove their data from the system at any time.

### Manage company

- Restricted to: Owners only.

- Allows configuring company-wide default settings applied to all users unless overridden individually.
- Owners can manage:

  - Default yearly holiday entitlement
  - Default work schedule (standard workdays of the week)
  - Default bank holiday region

- Bank holidays:

  - The system comes preloaded with several years of UK bank holiday data.
  - When new years are published on GOV.UK, a built-in import process can be run
    to update the data.

- Updates made here:

  - Apply automatically to all new users
  - Update existing users unless they have custom (overridden) personal settings

- Provides a central place to maintain consistent leave and working-time
  policies across the organisation.

### Manage team

- Restricted to: Managers and Owners.

- Managers and Owners can update team member details, including:

  - User type / role (promotions allowed; restrictions not enforced in the demo)
  - Employment start date
  - Employment end date

- They can also configure individual yearly settings for each user:

  - Yearly holiday entitlement
  - Work schedule (workdays of the week)
  - Bank holiday region

### Team member calendars

- Restricted to: Managers and Owners.

- Displays the calendar for an individual user.

- Each calendar provides a real-time overview of an individual employee’s
  availability and leave status.

- For each team member, the calendar shows:

  - Configured workdays
  - Bank holidays based on the user’s selected region
  - Pending leave requests
  - Approved leave requests
  - Remaining yearly holiday entitlement

- Calendars are powered by Firebase Firestore real-time subscriptions. Any change to leave data or configuration is reflected immediately, including:

  - New leave requests
  - Approvals or rejections by managers
  - Change or cancellation requests
  - Updates to company-wide or user-level settings

- Managers and Owners can use this page to view team members’ calendars for
  planning and monitoring availability.

### Team's pending requests

- Restricted to: Managers and Owners.
- Shows all pending leave requests submitted by team members.
- Managers and Owners can:

  - Review request details (dates, type, notes, workday count)
  - Approve a request
  - Reject a request (with an optional reason)
  - Submit new leave requests on behalf of team members if needed

- Supports all request types:

  - New request
  - Change request
  - Cancellation request

- Actions taken here automatically update:

  - The employee’s pending/approved/rejected lists
  - Their personal calendar

- Provides a central place for managers to handle all outstanding team leave decisions.

### Team's approved leaves

- Restricted to: Managers and Owners.
- Displays all approved leave requests for team members.
- Managers and Owners can:

  - View details of approved leaves (dates, type, notes, workday count)
  - Undo approval, returning a leave request to the pending state if adjustments are needed

- Actions automatically update:

  - The employee’s calendars
  - Their pending, approved, and rejected leave lists

- Provides a central place to track confirmed team leaves and make adjustments when necessary.

### Team's rejected leaves

- Restricted to: Managers and Owners.
- Displays all rejected leave requests for team members.
- Managers and Owners can:

  - View details of rejected leaves (dates, type, notes, workday count)
  - Reopen rejected requests, returning them to the pending state if adjustments are needed

- Actions automatically update:

  - The employee’s calendars
  - Their pending, approved, and rejected leave lists

- Provides a central place for managers to track and handle all rejected leave requests for the team.

### Your calendar

- Displays the logged-in user’s personal leave calendar.

- The calendar shows:

  - Workdays based on the user’s configured work schedule
  - Bank holidays for the selected region
  - Pending leave requests
  - Approved leaves
  - Remaining yearly holiday entitlement

- The calendar updates automatically in real time based on:

  - The user’s role (Employee, Manager, Owner)
  - Their user-level configured or company default holiday entitlement
  - Approved, pending, changed, or cancelled leave requests

- Any action taken by the user or by a manager (approval, rejection, cancellation)
  is reflected immediately without page refresh.

- This page serves as the **primary day-to-day dashboard** for employees to:
  - Track upcoming time off
  - Understand remaining entitlement
  - Visually plan future leave requests

### Your pending requests

- Displays all leave requests that are awaiting manager approval.

- Users can create new requests using the “Submit new request” button.

- Supported leave types:

  - Annual Leave
  - Other Leave Type (custom non-annual categories)

- Each request includes:

  - From and To dates
  - Calculated number of workdays
  - Optional manual adjustment (when user overrides the auto-calculation)

- Pending requests can be:

  - Edited (dates, type, notes, workday count)
  - Deleted before approval

- Request types include:

  - New request – normal unapproved request; details can change
  - Change request – modifies an already-approved request
  - Cancellation request – cancels an approved request
  - Approved request – displayed in the Approved Requests page; not editable here

- The list updates automatically as requests are:

  - Submitted
  - Modified
  - Approved or rejected by a manager

### Your approved leaves

- Displays all leave requests that have been approved by a manager.
- Users can:

  - View details of each approved leave (dates, type, notes, number of workdays)
  - Submit a change request if they need to adjust an approved leave
  - Submit a cancellation request if they want to cancel the leave

- Approved leaves are read-only, except for initiating change or cancellation
  requests.
- The list updates automatically whenever:

  - A new leave is approved
  - An existing approved leave is changed or cancelled

- Helps users track all confirmed time off and plan future leave accordingly.

### Your rejected leaves

- Displays all leave requests that have been rejected by a manager.
- Users can:

  - View details of each rejected leave (dates, type, notes, number of workdays)
  - Re-submit a new request based on the rejected leave by adjusting dates, type, or workdays

- Rejected leaves remain read-only, except for creating a new request.
- The list updates automatically whenever:

  - A request is rejected
  - A new request is submitted

- Helps users track unsuccessful leave requests and plan adjustments for future submissions.

## Serverless Backend Functions

### /api/approved-leave-cancel (DELETE)

- Description:

  - This endpoint deletes documents with the same ID from 3 collections:
    - requests
    - approved-leaves
    - rejected-leaves
  - The requests and approved-leaves collections have to contain a document with
    the provided ID otherwise a 404 error is returned
  - This endpoint is restricted to only serve ADMIN users.

- Request

  - Method: DELETE
  - Headers

    - Authorization: Bearer token
      - The token must belong to an authorised user.
    - Content-Type: application/json

  - Body:

    - `id` (string): Document ID in firestore

- Response 200 OK:

  - { "success": true, "message": "Documents deleted successfully" }

- Error responses:

  - 400 Bad request: {"error": "Bad request: ..."}
  - 401 Unauthorised: {"error": "Unauthorised"}
  - 403 Forbidden: {"error": "Forbidden"}
  - 405 Method not allowed: {"error": "Method not allowed"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

### /api/approved-leave-change-request (POST)

- Description:

  - Copies documents from `approved-leaves` collection to `requests` collection.
  - This endpoint uses a reusable handler (createMoveOrCopyHandler) to copy and modify a document from one collection to another one.

- Request:

  - Method: POST
  - Headers

    - Authorization: Bearer token
      - The token must belong to an authorised user.
    - Content-Type: application/json

  - Body:

    - `id` (string): Document ID in firestore

    - `updated` (timestamp) field is automatically updated by function

    - other fields: all passed fields will overwrite the fields of the soudestination document.

- Response 200 OK:

  - { "success": true, "doc": { ... stored fields ... } }

- Error responses:

  - 400 Bad request: {"error": "Bad request: ..."}
  - 401 Unauthorised: {"error": "Unauthorised"}
  - 403 Forbidden: {"error": "Forbidden"}
  - 404 Not found: {"error": "Not found: ..."}
  - 405 Method not allowed: {"error": "Method not allowed"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

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
  - 405 Method not allowed: {"error": "Method not allowed"}
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
  - 405 Method not allowed: {"error": "Method not allowed"}
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
  - 405 Method not allowed: {"error": "Method not allowed"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

### /api/rejected-leaves (POST|PUT|DELETE)

- Description:

  - Manages documents in the `rejected-leaves` collection in Firestore.
  - This endpoint uses a reusable handler (createUpdateOrDeleteDoc) to perform create, update, and delete operations with consistent authentication, validation, and timestamp management.

- Request:

  - Method: POST | PUT | DELETE
  - Headers

    - Authorization: Bearer token
      - The token must belong to an authorised user.
    - Content-Type: application/json

  - Body:

    - `id` (string): Document ID in firestore

    - `created` (timestamp) & `updated` (timestamp) fields are automatically managed by function

    - other fields: POST/PUT requests write/overwrite all passed fields on the document.

- Response 200 OK:

  - { "success": true, "doc": { ... stored fields ... } }

- Error responses:

  - 400 Bad request: {"error": "Bad request: ..."}
  - 401 Unauthorised: {"error": "Unauthorised"}
  - 403 Forbidden: {"error": "Forbidden"}
  - 405 Method not allowed: {"error": "Method not allowed"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

### /api/rejected-leave-re-request (POST)

- Description:

  - Moves documents from `requested-leaves` collection to `requests` collection.
  - This endpoint uses a reusable handler (createMoveOrCopyHandler) to move a document from one collection to another one.

- Request:

  - Method: POST
  - Headers

    - Authorization: Bearer token
      - The token must belong to an authorised user.
    - Content-Type: application/json

  - Body:

    - `id` (string): Document ID in firestore

    - `updated` (timestamp) field is automatically updated by function

    - other fields: all passed fields will overwrite the fields of the source document.

- Response 200 OK:

  - { "success": true, "doc": { ... stored fields ... } }

- Error responses:

  - 400 Bad request: {"error": "Bad request: ..."}
  - 401 Unauthorised: {"error": "Unauthorised"}
  - 403 Forbidden: {"error": "Forbidden"}
  - 404 Not found: {"error": "Not found: ..."}
  - 405 Method not allowed: {"error": "Method not allowed"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

### /api/requests (POST|PUT|DELETE)

- Description:

  - Manages documents in the `requests` collection in Firestore.
  - This endpoint uses a reusable handler (createUpdateOrDeleteDoc) to perform create, update, and delete operations with consistent authentication, validation, and timestamp management.

- Request:

  - Method: POST | PUT | DELETE
  - Headers

    - Authorization: Bearer token
      - The token must belong to an authorised user.
    - Content-Type: application/json

  - Body:

    - `id` (string): Document ID in firestore

    - `created` (timestamp) & `updated` (timestamp) fields are automatically managed by function

    - other fields: POST/PUT requests write/overwrite all passed fields on the document.

- Response 200 OK:

  - { "success": true, "doc": { ... stored fields ... } }

- Error responses:

  - 400 Bad request: {"error": "Bad request: ..."}
  - 401 Unauthorised: {"error": "Unauthorised"}
  - 403 Forbidden: {"error": "Forbidden"}
  - 405 Method not allowed: {"error": "Method not allowed"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

### /api/request-approve (POST)

- Description:

  - Moves documents from `requests` collection to `approved-leaves` collection.
  - This endpoint uses a reusable handler (createMoveOrCopyHandler) to move a document from one collection to another one.
  - This endpoint is restricted to only serve ADMIN users.

- Request:

  - Method: POST
  - Headers

    - Authorization: Bearer token
      - The token must belong to an authorised user.
    - Content-Type: application/json

  - Body:

    - `id` (string): Document ID in firestore

    - `updated` (timestamp) field is automatically updated by function

    - other fields: all passed fields will overwrite the fields of the source document.

- Response 200 OK:

  - { "success": true, "doc": { ... stored fields ... } }

- Error responses:

  - 400 Bad request: {"error": "Bad request: ..."}
  - 401 Unauthorised: {"error": "Unauthorised"}
  - 403 Forbidden: {"error": "Forbidden"}
  - 404 Not found: {"error": "Not found: ..."}
  - 405 Method not allowed: {"error": "Method not allowed"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

### /api/request-reject (POST)

- Description:

  - Moves documents from `requests` collection to `rejected-leaves` collection.
  - This endpoint uses a reusable handler (createMoveOrCopyHandler) to move a document from one collection to another one.
  - This endpoint is restricted to only serve ADMIN users.

- Request:

  - Method: POST
  - Headers

    - Authorization: Bearer token
      - The token must belong to an authorised user.
    - Content-Type: application/json

  - Body:

    - `id` (string): Document ID in firestore

    - `updated` (timestamp) field is automatically updated by function

    - other fields: all passed fields will overwrite the fields of the source document.

- Response 200 OK:

  - { "success": true, "doc": { ... stored fields ... } }

- Error responses:

  - 400 Bad request: {"error": "Bad request: ..."}
  - 401 Unauthorised: {"error": "Unauthorised"}
  - 403 Forbidden: {"error": "Forbidden"}
  - 404 Not found: {"error": "Not found: ..."}
  - 405 Method not allowed: {"error": "Method not allowed"}
  - 500 Internal Server Error: {"error": "Unknown server error"}

### /api/user (POST|PUT|DELETE)

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
  - 405 Method not allowed: {"error": "Method not allowed"}
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
  - 405 Method not allowed: {"error": "Method not allowed"}
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
