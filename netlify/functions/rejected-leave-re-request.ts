import type { Handler } from '@netlify/functions';
import { firebase_collections } from '../../lib/firebase_collections';
import { createMoveOrCopyHandler } from '../../lib/handlers/createMoveOrCopyHandler';

export const handler: Handler = createMoveOrCopyHandler({
  sourcePath: [
    { collection: firebase_collections.REJECTED_LEAVES, idField: 'id' },
  ],
  destinationPath: [
    { collection: firebase_collections.REQUESTS, idField: 'id' },
  ],
  action: 'MOVE',
});
