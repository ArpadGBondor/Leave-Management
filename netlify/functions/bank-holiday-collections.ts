import { Handler } from '@netlify/functions';
import { verifyBearerToken } from '../../lib/verifyBearerToken';
import { db } from '../../lib/firebase';
import { response } from '../../lib/response';
import { firebase_collections } from '../../lib/firebase_collections';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return response(405, 'Method Not Allowed');
  }

  try {
    await verifyBearerToken(event.headers.authorization);

    const regionsSnapshot = await db
      .collection(firebase_collections.BANK_HOLIDAYS)
      .get();

    const data: Record<string, string[]> = {};

    for (const regionSnap of regionsSnapshot.docs) {
      const regionID = regionSnap.id;
      const subcollections = await regionSnap.ref.listCollections();
      data[regionID] = subcollections.map((sub) => sub.id);
    }

    return response(200, { success: true, regions: data });
  } catch (err: any) {
    console.error(err);
    return response(
      err.message?.startsWith('Unauthorized')
        ? 401
        : err.message?.startsWith('Forbidden')
        ? 403
        : 500,
      { error: err.message || 'Failed to set user role' }
    );
  }
};

export { handler };
