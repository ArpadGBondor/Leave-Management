import { Handler } from '@netlify/functions';
import { firebase_collections } from '../../lib/firebase_collections';
import { createOrUpdateDoc } from '../../lib/handlers/createOrUpdateDoc';

const handler: Handler = createOrUpdateDoc({
  path: [
    {
      collection: firebase_collections.USERS,
      idField: 'userId',
      keepInDoc: false,
    },
    {
      collection: firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION,
      idField: 'id',
      keepInDoc: true,
    },
  ],
});
export { handler };
