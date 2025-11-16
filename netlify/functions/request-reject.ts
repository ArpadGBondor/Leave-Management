import type { Handler } from '@netlify/functions';
import { firebase_collections } from '../../lib/firebase_collections';
import { createMoveHandler } from '../../lib/handlers/createMoveHandler';

export const handler: Handler = createMoveHandler({
  sourcePath: [{ collection: firebase_collections.REQUESTS, idField: 'id' }],
  destinationPath: [
    { collection: firebase_collections.REJECTED_LEAVES, idField: 'id' },
  ],
  restrictToClaim: 'ADMIN',
});
