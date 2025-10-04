import { Handler } from '@netlify/functions';
import { firebase_collections } from '../../lib/firebase_collections';
import { createOrUpdateDoc } from '../../lib/handlers/createOrUpdateDoc';

const handler: Handler = createOrUpdateDoc({
  path: [
    {
      collection: firebase_collections.CONFIG,
      idField: 'id',
    },
  ],
});

export { handler };
