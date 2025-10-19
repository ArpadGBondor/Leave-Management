import { Handler } from '@netlify/functions';
import { firebase_collections } from '../../lib/firebase_collections';
import { createUpdateOrDeleteDoc } from '../../lib/handlers/createUpdateOrDeleteDoc';

const handler: Handler = createUpdateOrDeleteDoc({
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
