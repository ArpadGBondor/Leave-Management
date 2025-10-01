import { Handler } from '@netlify/functions';
import { auth } from '../../lib/firebase';
import { verifyBearerToken } from '../../lib/auth';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // const decodedToken =
    await verifyBearerToken(event.headers.authorization);

    // For this demo, let's allow users to test different roles.
    // Only allow superAdmin users to update roles
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

    await auth.setCustomUserClaims(userId, claims);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, claims }),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: err.message?.startsWith('Unauthorized')
        ? 401
        : err.message?.startsWith('Forbidden')
        ? 403
        : 500,
      body: JSON.stringify({ error: err.message || 'Failed to set user role' }),
    };
  }
};

export { handler };
