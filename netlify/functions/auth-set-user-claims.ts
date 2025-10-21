import { Handler } from '@netlify/functions';
import { auth } from '../../lib/firebase';
import { verifyBearerToken } from '../../lib/verifyBearerToken';
import { errorResponse, response } from '../../lib/response';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return response(405, 'Method Not Allowed');
  }

  try {
    // const decodedToken =
    await verifyBearerToken(event.headers.authorization);

    // --- Validate request body ---
    if (!event.body) {
      return response(400, { error: 'Request body is required' });
    }

    let parsed;
    try {
      parsed = JSON.parse(event.body);
    } catch {
      return response(400, { error: 'Invalid JSON body' });
    }

    if (!parsed || typeof parsed !== 'object') {
      return response(400, { error: 'Body must be a JSON object' });
    }

    const { userId, userType } = parsed;

    if (!userId) {
      return response(400, { error: 'Missing required field: userId' });
    }

    if (!userType) {
      return response(400, { error: 'Missing required field: userType' });
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

    return response(200, { success: true, claims });
  } catch (err: any) {
    return errorResponse(err, 'process');
  }
};

export { handler };
