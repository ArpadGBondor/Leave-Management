import { Handler } from '@netlify/functions';
import { auth } from '../../lib/firebase';
import { verifyBearerToken } from '../../lib/verifyBearerToken';
import { errorResponse, response } from '../../lib/response';

const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      throw new Error('Method not allowed');
    }

    // const decodedToken =
    await verifyBearerToken(event.headers.authorization);

    // --- Validate request body ---
    if (!event.body) {
      throw new Error('Bad request: Request body is required');
    }

    let parsed;
    try {
      parsed = JSON.parse(event.body);
    } catch {
      throw new Error('Bad request: Invalid JSON body');
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Bad request: Body must be a JSON object');
    }

    const { userId, userType } = parsed;

    if (!userId) {
      throw new Error('Bad request: Missing required field: userId');
    }

    if (!userType) {
      throw new Error('Bad request: Missing required field: userType');
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
