import { Handler } from '@netlify/functions';
import { verifyBearerToken } from '../verifyBearerToken';
import { response } from '../response';
import { HandlerConfigOptions } from '../types';
import { buildRef } from '../cleanRef';
import { cleanBody } from '../cleanBody';
import * as admin from 'firebase-admin';

export const createOrUpdateDoc =
  ({ path, restrictToClaim }: HandlerConfigOptions): Handler =>
  async (event) => {
    if (event.httpMethod !== 'POST' && event.httpMethod !== 'PUT') {
      return response(405, 'Method Not Allowed');
    }

    try {
      const decodedToken = await verifyBearerToken(event.headers.authorization);
      if (restrictToClaim && !decodedToken[restrictToClaim]) {
        throw new Error('Forbidden');
      }

      const body = JSON.parse(event.body || '{}');

      const ref = buildRef(body, path);
      const clean = cleanBody(body, path);

      if (event.httpMethod === 'POST') {
        await ref.set(
          {
            ...clean,
            created: admin.firestore.FieldValue.serverTimestamp(),
            updated: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: false }
        );
      } else {
        await ref.update({
          ...clean,
          updated: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      const doc = (await ref.get()).data();

      return response(200, { success: true, doc });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error)
        return response(
          err.message?.startsWith('Bad request')
            ? 400
            : err.message?.startsWith('Unauthorized')
            ? 401
            : err.message?.startsWith('Forbidden')
            ? 403
            : 500,
          {
            error: err.message || 'Failed to create or update document',
          }
        );
      return response(500, 'Unknown server error');
    }
  };
