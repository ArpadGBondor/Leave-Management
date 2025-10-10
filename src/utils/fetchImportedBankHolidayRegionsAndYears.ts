import { auth } from '../firebase.config';

export default async function fetchImportedBankHolidayRegionsAndYears() {
  const token = await auth.currentUser?.getIdToken();

  const response = await fetch('/api/bank-holiday-collections', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errMsg = await response.text();
    throw new Error(`Data fetch failed: ${errMsg}`);
  }

  const { regions } = await response.json();
  return regions;
}
