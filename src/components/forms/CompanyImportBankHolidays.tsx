import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import formatBankHolidayName from '../../utils/formatBankHolidayName';
import { useCompanyContext } from '../../context/company/useCompanyContext';

export default function CompanyImportBankHolidays() {
  const { startLoading, stopLoading } = useLoadingContext();
  const {
    importBankHolidaysFromGovUK,
    fetchImportedBankHolidayRegionsAndYears,
    importedRegionsAndYears,
    importedRegionsAndYearsLoaded,
  } = useCompanyContext();

  useEffect(() => {
    startLoading('fetch-imported-bank-holiday-regions-and-years');
    fetchImportedBankHolidayRegionsAndYears()
      .catch((error: unknown) =>
        toast.error(
          error instanceof Error
            ? error.message
            : 'Could not load imported regions and years'
        )
      )
      .finally(() => {
        stopLoading('fetch-imported-bank-holiday-regions-and-years');
      });
  }, []);

  const onSubmitImportBankHolidays = async (e: any) => {
    e.preventDefault();

    startLoading('import-company-bank-holidays');
    try {
      const result = await importBankHolidaysFromGovUK();
      toast.success(
        `Imported bank holidays (${result.created} new, ${result.updated} updated, ${result.skipped} skipped)`
      );
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not import bank holidays'
      );
    } finally {
      stopLoading('import-company-bank-holidays');
      startLoading('fetch-imported-bank-holiday-regions-and-years');
      try {
        await fetchImportedBankHolidayRegionsAndYears(true);
      } catch (error: unknown) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Could not load imported regions and years'
        );
      } finally {
        stopLoading('fetch-imported-bank-holiday-regions-and-years');
      }
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

      {!importedRegionsAndYearsLoaded ? (
        <div className="flex flex-col items-center ">
          <Spinner size="xl" />
        </div>
      ) : importedRegionsAndYears &&
        Object.keys(importedRegionsAndYears).length > 0 ? (
        <ul className="bg-brand-purple-100 p-4 rounded-xl mx-auto space-y-3">
          {Object.entries(importedRegionsAndYears).map(([region, years]) => (
            <li key={region}>
              <h4 className="font-bold text-brand-green-800">
                {formatBankHolidayName(region)}
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
        <p className="text-brand-green-800">No bank holidays imported yet.</p>
      )}

      <Button label="Check GOV.UK to import bank holidays" />
    </form>
  );
}
