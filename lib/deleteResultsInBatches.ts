import { db } from './firebase';

export default async function deleteResultsInBatches(
  snap: FirebaseFirestore.QuerySnapshot<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  >
) {
  const docs = snap.docs;
  for (let i = 0; i < docs.length; i += 500) {
    const batch = db.batch();
    const chunk = docs.slice(i, i + 500);
    chunk.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}
