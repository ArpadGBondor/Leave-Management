import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import formatBankHolidayName from '../../utils/formatBankHolidayName';
import { useCompanyContext } from '../../context/company/useCompanyContext';

export default function CompanyImportBankHolidays() {
  const { startLoading, stopLoading } = useLoadingContext();
  const { importBankHolidaysFromGovUK, importedRegions, importedYears } =
    useCompanyContext();

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
    }
  };

  return (
    <form
      onSubmit={onSubmitImportBankHolidays}
      className="flex flex-col gap-4 w-full"
    >
      <h3 className="text-2xl font-bold text-brand-green-700">Bank holidays</h3>

      {importedRegions.length > 0 && importedYears.length > 0 ? (
        <div className="space-y-2">
          <h4 className="font-bold text-brand-green-800">Imported regions</h4>
          <ul className="flex flex-wrap gap-2 mt-1">
            {importedRegions.map((region) => (
              <li
                key={region}
                className="bg-brand-green-100 border border-brand-green-400 rounded-md px-2 py-1 text-sm text-brand-green-700 font-bold"
              >
                {formatBankHolidayName(region)}
              </li>
            ))}
          </ul>
          <h4 className="font-bold text-brand-green-800">Imported years</h4>
          <ul className="flex flex-wrap gap-2 mt-1">
            {importedYears.map((year) => (
              <li
                key={year}
                className="bg-brand-green-100 border border-brand-green-400 rounded-md px-2 py-1 text-sm text-brand-green-700 font-bold"
              >
                {year}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-brand-green-800">No bank holidays imported yet.</p>
      )}

      <Button label="Check GOV.UK to import bank holidays" />
    </form>
  );
}
