import { Handler, HandlerResponse } from '@netlify/functions';
import { firebase_collections } from '../../lib/firebase_collections';
import { createUpdateOrDeleteDoc } from '../../lib/handlers/createUpdateOrDeleteDoc';
import { errorResponse, response } from '../../lib/response';
import { auth, db } from '../../lib/firebase';

const handler: Handler = createUpdateOrDeleteDoc({
  path: [
    {
      collection: firebase_collections.USERS,
      idField: 'id',
      keepInDoc: true,
    },
  ],
  deleteAction: async (ref): Promise<HandlerResponse> => {
    try {
      const userId = ref.id;
      // delete auth user
      await auth.deleteUser(userId);
      // Delete document and subcollections too
      await db.recursiveDelete(ref);
      // Delete requests

      // Delete booked holidays

      return response(200, {
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error: unknown) {
      return errorResponse(error, 'delete');
    }
  },
});
export { handler };
