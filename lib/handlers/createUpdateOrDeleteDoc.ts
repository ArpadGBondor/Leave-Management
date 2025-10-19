import { Handler } from '@netlify/functions';
import { verifyBearerToken } from '../verifyBearerToken';
import { response } from '../response';
import { HandlerConfigOptions } from '../types';
import { buildRef } from '../cleanRef';
import { cleanBody } from '../cleanBody';
import * as admin from 'firebase-admin';

export const createUpdateOrDeleteDoc =
  ({ path, restrictToClaim }: HandlerConfigOptions): Handler =>
  async (event) => {
    const isCreate = event.httpMethod === 'POST';
    const isUpdate = event.httpMethod === 'PUT';
    const isDelete = event.httpMethod === 'DELETE';

    if (!isCreate && !isUpdate && !isDelete) {
      return response(405, 'Method Not Allowed');
    }

    try {
      const decodedToken = await verifyBearerToken(event.headers.authorization);
      if (restrictToClaim && !decodedToken[restrictToClaim]) {
        throw new Error('Forbidden');
      }

      // remove created field from request body
      const { created, ...body } = JSON.parse(event.body || '{}');

      const ref = buildRef(body, path);

      if (isDelete) {
        // Delete document
        await ref.delete();
        return response(200, {
          success: true,
          message: 'Document deleted successfully',
        });
      }

      const clean = cleanBody(body, path);

      if (isCreate) {
        await ref.set(
          {
            ...clean,
            created: admin.firestore.FieldValue.serverTimestamp(),
            updated: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: false }
        );
      } else if (isUpdate) {
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
            error:
              err.message ||
              `Failed to ${
                isCreate
                  ? 'create'
                  : isUpdate
                  ? 'update'
                  : isDelete
                  ? 'delete'
                  : 'process'
              } document.`,
          }
        );
      return response(500, 'Unknown server error');
    }
  };
