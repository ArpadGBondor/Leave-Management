import { Handler, HandlerResponse } from '@netlify/functions';
import { verifyBearerToken } from '../verifyBearerToken';
import { errorResponse, response } from '../response';
import { CollectionConfig } from '../types';
import { buildRef } from '../buildRef';
import { cleanBody } from '../cleanBody';
import * as admin from 'firebase-admin';

export type HandlerConfigOptions = {
  path: CollectionConfig[]; // sequence of collections/subcollections
  restrictToClaim?: 'ADMIN' | 'SUPER_ADMIN';
  deleteAction?: (
    ref: FirebaseFirestore.DocumentReference
  ) => Promise<HandlerResponse>;
};

export const createUpdateOrDeleteDoc =
  ({ path, restrictToClaim, deleteAction }: HandlerConfigOptions): Handler =>
  async (event): Promise<HandlerResponse> => {
    const isCreate = event.httpMethod === 'POST';
    const isUpdate = event.httpMethod === 'PUT';
    const isDelete = event.httpMethod === 'DELETE';

    try {
      if (!isCreate && !isUpdate && !isDelete) {
        throw new Error('Method not allowed');
      }

      const decodedToken = await verifyBearerToken(event.headers.authorization);
      if (restrictToClaim && !decodedToken[restrictToClaim]) {
        throw new Error('Forbidden');
      }

      // remove created field from request body
      const { created, ...body } = JSON.parse(event.body || '{}');

      const ref = buildRef(body, path, isCreate);

      if (isDelete) {
        if (deleteAction) {
          return deleteAction(ref);
        } else {
          // Delete document
          await ref.delete();
          return response(200, {
            success: true,
            message: 'Document deleted successfully',
          });
        }
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
      return errorResponse(
        err,
        isCreate
          ? 'create'
          : isUpdate
          ? 'update'
          : isDelete
          ? 'delete'
          : 'process'
      );
    }
  };
