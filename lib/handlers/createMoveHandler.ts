import type { Handler } from '@netlify/functions';
import { buildRef } from '../buildRef';
import { CollectionConfig } from '../types';
import * as admin from 'firebase-admin';
import { response, errorResponse } from '../response';
import { db } from '../firebase';
import { verifyBearerToken } from '../verifyBearerToken';
import { cleanBody } from '../cleanBody';

export type HandlerConfigOptions = {
  sourcePath: CollectionConfig[]; // sequence of collections/subcollections
  destinationPath: CollectionConfig[]; // sequence of collections/subcollections
  restrictToClaim?: 'ADMIN' | 'SUPER_ADMIN';
};

export const createMoveHandler = ({
  sourcePath,
  destinationPath,
  restrictToClaim,
}: HandlerConfigOptions): Handler => {
  return async (event) => {
    try {
      if (event.httpMethod !== 'POST') {
        return response(405, 'Method Not Allowed');
      }

      const decodedToken = await verifyBearerToken(event.headers.authorization);
      if (restrictToClaim && !decodedToken[restrictToClaim]) {
        throw new Error('Forbidden');
      }

      // remove created field from request body
      const { created, ...body } = JSON.parse(event.body || '{}');
      const cleanUpdateFields = cleanBody(body, destinationPath);

      // Build references
      const sourceRef = buildRef(body, sourcePath, false);
      const sourceSnap = await sourceRef.get();

      if (!sourceSnap.exists) {
        return response(404, 'Source document not found');
      }

      const data = sourceSnap.data() as Record<string, any>;

      const destinationRef = buildRef(body, destinationPath, true);

      // Move using a batch for atomicity
      const batch = db.batch();
      batch.set(destinationRef, {
        ...data,
        ...cleanUpdateFields,
        updated: admin.firestore.FieldValue.serverTimestamp(),
      });
      batch.delete(sourceRef);

      await batch.commit();

      const finalDoc = (await destinationRef.get()).data();

      return response(200, {
        success: true,
        doc: finalDoc,
        path: destinationRef.path,
      });
    } catch (err: any) {
      return errorResponse(err, 'process');
    }
  };
};
