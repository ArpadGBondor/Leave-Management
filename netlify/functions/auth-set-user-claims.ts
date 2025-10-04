import { Handler } from '@netlify/functions';
import { auth } from '../../lib/firebase';
import { verifyBearerToken } from '../../lib/verifyBearerToken';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // const decodedToken =
    await verifyBearerToken(event.headers.authorization);

    // --- Validate request body ---
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    let parsed;
    try {
      parsed = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      };
    }

    if (!parsed || typeof parsed !== 'object') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Body must be a JSON object' }),
      };
    }

    const { userId, userType } = parsed;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required field: userId' }),
      };
    }

    if (!userType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required field: userType' }),
      };
    }

    let claims: Record<string, boolean> = {};
    switch (userType) {
      case 'Manager':
        claims = { ADMIN: true };
        break;
      case 'Owner':
        claims = { ADMIN: true, SUPER_ADMIN: true };
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
