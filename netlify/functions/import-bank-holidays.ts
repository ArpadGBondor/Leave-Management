import { Handler } from '@netlify/functions';
import { verifyBearerToken } from '../../lib/verifyBearerToken';
import { db } from '../../lib/firebase';
import { response } from '../../lib/response';
import { BankHolidayData, BankHolidayEvent } from '../../lib/types';
import { firebase_collections } from '../../lib/firebase_collections';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return response(405, 'Method Not Allowed');
  }

  try {
    // const decodedToken =
    await verifyBearerToken(event.headers.authorization);

    const bankHolidayRespones = await fetch(
      process.env.UK_BANK_HOLIDAY_API as string
    );
    const bankHolidayData: BankHolidayData = await bankHolidayRespones.json();

    let created = 0,
      updated = 0,
      skipped = 0;

    for (const [region, details] of Object.entries(bankHolidayData)) {
      const regionRef = db
        .collection(firebase_collections.BANK_HOLIDAYS)
        .doc(region);
      await regionRef.set({}); // create empty document otherwise we won't be able to list it

      for (const event of details.events) {
        const year = event.date.split('-')[0];
        const yearRef = regionRef.collection(year);
        const docId = event.date;
        const docRef = yearRef.doc(docId);
        const snapshot = await docRef.get();

        const newData: BankHolidayEvent = {
          title: event.title,
          date: event.date,
          notes: event.notes,
          bunting: event.bunting,
        };

        if (!snapshot.exists) {
          await docRef.set(newData);
          created++;
        } else {
          const existing = snapshot.data() as BankHolidayEvent;
          const hasChanged = (
            Object.keys(newData) as (keyof typeof newData)[]
          ).some((key) => newData[key] !== existing[key]);

          if (hasChanged) {
            await docRef.update(newData);
            updated++;
          } else {
            skipped++;
          }
        }
      }
    }

    return response(200, { success: true, created, updated, skipped });
  } catch (err: any) {
    console.error(err);
    return response(
      err.message?.startsWith('Unauthorized')
        ? 401
        : err.message?.startsWith('Forbidden')
        ? 403
        : 500,
      { error: err.message || 'Failed to set user role' }
    );
  }
};

export { handler };
