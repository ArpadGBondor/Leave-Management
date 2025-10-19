import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import BankHolidayRegion from '../../interface/BankHolidayRegion.interface';
import BankHolidayRegionDropdown from '../complexInputs/BankHolidayRegionDropdown';

export default function CompanyBankHolidayRegionDefault() {
  const [formData, setFormData] = useState<BankHolidayRegion>({
    bankHolidayRegionId: '',
    numberOfBankHolidays: 0,
  });
  const { startLoading, stopLoading } = useLoadingContext();
  const { updateBankHolidayRegion, bankHolidayRegion, importedYears } =
    useCompanyContext();

  const { bankHolidayRegionId, numberOfBankHolidays } = formData;

  useEffect(() => {
    if (bankHolidayRegion)
      setFormData((prevState) => ({
        ...prevState,
        ...bankHolidayRegion,
      }));
  }, []);

  const onSubmitBankHolidayRegion = async (e: any) => {
    e.preventDefault();

    startLoading('set-company-bank-holiday-region');
    try {
      await updateBankHolidayRegion({
        bankHolidayRegionId,
        numberOfBankHolidays,
      });
      toast.info('Default bank holiday region saved');
    } catch (error: any) {
      toast.error(
        error.message || 'Could not update default bank holiday region'
      );
    } finally {
      stopLoading('set-company-bank-holiday-region');
    }
  };

  const currentYear = () => {
    // No imported years
    if (importedYears.length < 1) return '';
    const current: string = new Date().getFullYear().toString();
    // Current year is imported
    if (importedYears.includes(current)) return current;
    // Take one available year
    return importedYears[0];
  };

  return (
    <form
      onSubmit={onSubmitBankHolidayRegion}
      className="flex flex-col gap-4 w-full"
    >
      <h3 className="text-2xl font-bold text-brand-green-700">
        Default Bank Holiday Region
      </h3>

      <BankHolidayRegionDropdown
        formData={formData}
        setFormData={setFormData}
        year={currentYear()}
      />

      <Button label="Update default bank holiday region" />
    </form>
  );
}
