import { Handler, HandlerResponse } from '@netlify/functions';
import { firebase_collections } from '../../lib/firebase_collections';
import { createUpdateOrDeleteDoc } from '../../lib/handlers/createUpdateOrDeleteDoc';
import { errorResponse, response } from '../../lib/response';
import { auth, db } from '../../lib/firebase';
import deleteResultsInBatches from '../../lib/deleteResultsInBatches';

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
      const requestsSnap = await db
        .collection(firebase_collections.REQUESTS)
        .where('requestedById', '==', userId)
        .get();
      await deleteResultsInBatches(requestsSnap);
      // Delete approved leaves
      const approvedLeavesSnap = await db
        .collection(firebase_collections.APPROVED_LEAVES)
        .where('requestedById', '==', userId)
        .get();
      await deleteResultsInBatches(approvedLeavesSnap);
      // Delete rejected leaves
      const rejectedLeavesSnap = await db
        .collection(firebase_collections.REJECTED_LEAVES)
        .where('requestedById', '==', userId)
        .get();
      await deleteResultsInBatches(rejectedLeavesSnap);

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
