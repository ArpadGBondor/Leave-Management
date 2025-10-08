import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { auth, db } from '../../firebase.config';
import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { firebase_collections } from '../../../lib/firebase_collections';

type BankHolidayMetadata = Record<string, string[]>;

export default function CompanyImportBankHolidays() {
  const { startLoading, stopLoading } = useLoadingContext();
  const [metadata, setMetadata] = useState<BankHolidayMetadata>({});

  // Fetch existing regions & years from Firestore
  const fetchMetadata = async () => {
    startLoading('fetch-bank-holidays-metadata');
    try {
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
      setMetadata(regions);
    } catch (error: any) {
      toast.error(error.message || 'Could not import bank holidays');
    } finally {
      stopLoading('fetch-bank-holidays-metadata');
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const onSubmitImportBankHolidays = async (e: any) => {
    e.preventDefault();

    startLoading('import-company-bank-holidays');
    try {
      const token = await auth.currentUser?.getIdToken();

      const response = await fetch('/api/import-bank-holidays', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Import failed: ${errMsg}`);
      }

      const result = await response.json();
      toast.success(
        `Imported bank holidays (${result.created} new, ${result.updated} updated, ${result.skipped} skipped)`
      );
    } catch (error: any) {
      toast.error(error.message || 'Could not import bank holidays');
    } finally {
      stopLoading('import-company-bank-holidays');
      await fetchMetadata();
    }
  };

  return (
    <form
      onSubmit={onSubmitImportBankHolidays}
      className="flex flex-col gap-4 w-full"
    >
      <h3 className="text-2xl font-bold text-brand-green-700">
        Imported bank holidays
      </h3>

      {metadata && Object.keys(metadata).length > 0 ? (
        <ul className="bg-brand-purple-100 p-4 rounded-xl mx-auto space-y-3">
          {Object.entries(metadata).map(([region, years]) => (
            <li key={region}>
              <h4 className="font-bold text-brand-green-800 capitalize">
                {region.replaceAll('-', ' ')}
              </h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {years.sort().map((year) => (
                  <span
                    key={year}
                    className="bg-brand-green-100 border border-brand-green-400 rounded-md px-2 py-1 text-sm text-brand-green-700"
                  >
                    {year}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic mt-2">
          No bank holidays imported yet. {JSON.stringify(metadata)}
        </p>
      )}

      <Button label="Check GOV.UK to import bank holidays" />
    </form>
  );
}
