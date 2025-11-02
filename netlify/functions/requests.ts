import { Handler } from '@netlify/functions';
import { firebase_collections } from '../../lib/firebase_collections';
import { createUpdateOrDeleteDoc } from '../../lib/handlers/createUpdateOrDeleteDoc';

const handler: Handler = createUpdateOrDeleteDoc({
  path: [
    {
      collection: firebase_collections.REQUESTS,
      idField: 'id',
      keepInDoc: true,
    },
  ],
});

export { handler };
