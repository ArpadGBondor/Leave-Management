import { Handler } from '@netlify/functions';
import * as admin from 'firebase-admin';

let app: admin.app.App;

if (!admin.apps.length) {
  // Parse env var back into object
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT as string
  );

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  app = admin.app();
}

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // should only get called when a user is logged in
    const authHeader = event.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify token using Firebase Admin
    // const decodedToken =
    await admin.auth().verifyIdToken(idToken);

    // // Only allow superAdmin users to update roles
    // if (!decodedToken.SUPER_ADIM) {
    //   return { statusCode: 403, body: 'Forbidden' };
    // }

    const { userId, userType } = JSON.parse(event.body || '{}');

    let claims: Record<string, boolean> = {};
    switch (userType) {
      case 'Manager':
        claims = { ADMIN: true };
        break;
      case 'Owner':
        claims = { ADMIN: true, SUPER_ADIM: true };
        break;
      default:
        claims = {};
    }

    await admin.auth().setCustomUserClaims(userId, claims);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, claims }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to set user role' }),
    };
  }
};

export { handler };
