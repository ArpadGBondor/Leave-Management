import { Handler } from '@netlify/functions';
import { db } from '../../lib/firebase';
import { verifyBearerToken } from '../../lib/auth';
import * as admin from 'firebase-admin';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    //  const decodedToken =
    await verifyBearerToken(event.headers.authorization);

    // 2. Parse body
    const body = JSON.parse(event.body || '{}');

    // only allow updating your own doc unless user has ADMIN claims
    // if (body.id && body.id !== uid && !decodedToken.ADMIN) {
    //   return { statusCode: 403, body: 'Forbidden' };
    // }

    const ref = db.collection('users').doc(body.id);

    // 3. Create or update
    if (event.httpMethod === 'POST') {
      await ref.set(
        {
          ...body,
          created: admin.firestore.FieldValue.serverTimestamp(),
          updated: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: false }
      ); // create new
    } else {
      await ref.set(
        {
          ...body,
          updated: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      ); // update
    }

    const userDoc = (await ref.get()).data();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, user: userDoc }),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Failed to save user' }),
    };
  }
};

export { handler };
