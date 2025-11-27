import { Handler, HandlerResponse } from '@netlify/functions';
import { firebase_collections } from '../../lib/firebase_collections';
import { verifyBearerToken } from '../../lib/verifyBearerToken';
import { db } from '../../lib/firebase';
import { errorResponse, response } from '../../lib/response';

const handler: Handler = async (event): Promise<HandlerResponse> => {
  const isDelete = event.httpMethod === 'DELETE';

  try {
    // Approved leave cancellation is a DELETE request
    if (!isDelete) {
      throw new Error('Method not allowed');
    }

    // Verify bearer token
    const decodedToken = await verifyBearerToken(event.headers.authorization);
    // Only admins can apply cancellation
    if (!decodedToken['ADMIN']) {
      throw new Error('Forbidden');
    }

    // id should be passed in body
    if (!event.body) {
      throw new Error('Bad request: Request body is required');
    }
    const { id } = JSON.parse(event.body);
    if (!id) {
      throw new Error('Bad request: Missing required field: id');
    }

    const batch = db.batch();
    const approvedLeavesRef = db
      .collection(firebase_collections.APPROVED_LEAVES)
      .doc(id);
    const rejectedLeavesRef = db
      .collection(firebase_collections.REJECTED_LEAVES)
      .doc(id);
    const requestsRef = db.collection(firebase_collections.REQUESTS).doc(id);

    // Approved leave collection should contain the approved leave
    const approvedLeavesSnap = await approvedLeavesRef.get();
    if (!approvedLeavesSnap.exists) {
      throw new Error('Not found: Approved leave document not found');
    } else {
      batch.delete(approvedLeavesRef);
    }

    // Requests collection should contain the cancellation that is getting applied
    const requestsSnap = await requestsRef.get();
    if (!requestsSnap.exists) {
      throw new Error('Not found: Requests document not found');
    } else {
      batch.delete(requestsRef);
    }

    // Rejected leaves collection might contain something unrelated to the
    // current action, that we should not leave behind
    const rejectedLeavesSnap = await rejectedLeavesRef.get();
    if (rejectedLeavesSnap.exists) {
      batch.delete(rejectedLeavesRef);
    }

    await batch.commit();

    return response(200, {
      success: true,
      message: 'Documents deleted successfully',
    });
  } catch (err: unknown) {
    return errorResponse(err, 'delete');
  }
};

export { handler };
