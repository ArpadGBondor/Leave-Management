import { Handler, HandlerResponse } from '@netlify/functions';
import { firebase_collections } from '../../lib/firebase_collections';
import { verifyBearerToken } from '../../lib/verifyBearerToken';
import { db } from '../../lib/firebase';
import { errorResponse, response } from '../../lib/response';
import * as admin from 'firebase-admin';

const handler: Handler = async (event): Promise<HandlerResponse> => {
  const isPost = event.httpMethod === 'POST';

  try {
    // re-requesting a rejected cancellation request is a POST request
    if (!isPost) {
      throw new Error('Method not allowed');
    }

    // Verify bearer token
    const decodedToken = await verifyBearerToken(event.headers.authorization);
    // any user type can re-request rejected requests

    // id should be passed in body
    if (!event.body) {
      throw new Error('Bad request: Request body is required');
    }
    const { created, ...body } = JSON.parse(event.body);
    const { id } = body;
    if (!id) {
      throw new Error('Bad request: Missing required field: id');
    }

    const approvedLeavesRef = db
      .collection(firebase_collections.APPROVED_LEAVES)
      .doc(id);
    const rejectedLeavesRef = db
      .collection(firebase_collections.REJECTED_LEAVES)
      .doc(id);
    const requestsRef = db.collection(firebase_collections.REQUESTS).doc(id);

    const approvedLeavesSnap = await approvedLeavesRef.get();
    if (!approvedLeavesSnap.exists) {
      // approved leave should exist
      throw new Error('Not found: Approved leave document not found');
    }
    const rejectedLeavesSnap = await rejectedLeavesRef.get();
    if (!rejectedLeavesSnap.exists) {
      // rejected leave should exist
      throw new Error('Not found: Rejected leave document not found');
    }

    const data = approvedLeavesSnap.data() as Record<string, any>;

    const batch = db.batch();
    batch.set(requestsRef, {
      ...data, // copy of approved leave
      ...body, // passed fields (this sets request type to be cancelled)
      updated: admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.delete(rejectedLeavesRef);

    await batch.commit();
    const finalDoc = (await requestsRef.get()).data();

    return response(200, {
      success: true,
      doc: finalDoc,
      path: requestsRef.path,
    });
  } catch (err: unknown) {
    return errorResponse(err, 'delete');
  }
};

export { handler };
