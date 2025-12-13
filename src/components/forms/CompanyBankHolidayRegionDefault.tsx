import { forwardRef, useImperativeHandle } from 'react';
import { useEffect, useState } from 'react';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import BankHolidayRegion from '../../interface/BankHolidayRegion.interface';
import BankHolidayRegionDropdown from '../complexInputs/BankHolidayRegionDropdown';
import SubmitFormResponse, {
  formResponse,
} from '../../interface/SubmitFormResponse.interface';

const CompanyBankHolidayRegionDefault = forwardRef((props, ref) => {
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

  // Allow parent to trigger submit
  useImperativeHandle(ref, () => ({
    submit: onSubmitBankHolidayRegion,
  }));

  const onSubmitBankHolidayRegion = async (
    e: any
  ): Promise<SubmitFormResponse> => {
    e?.preventDefault();

    if (
      bankHolidayRegion.bankHolidayRegionId === bankHolidayRegionId &&
      bankHolidayRegion.numberOfBankHolidays === numberOfBankHolidays
    ) {
      return formResponse(
        'skipped',
        "Default bank holiday region haven't changed"
      );
    }

    startLoading('set-company-bank-holiday-region');
    try {
      await updateBankHolidayRegion({
        bankHolidayRegionId,
        numberOfBankHolidays,
      });
      return formResponse('submitted', 'Default bank holiday region saved');
    } catch (error: any) {
      return formResponse(
        'error',
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
      className="flex flex-col gap-4 w-full border border-brand-green-600 rounded-xl p-4"
    >
      <h3 className="text-2xl font-bold text-brand-green-700">
        Company's default bank holiday region
      </h3>

      <BankHolidayRegionDropdown
        formData={formData}
        setFormData={setFormData}
        year={currentYear()}
      />
      {formData.numberOfBankHolidays > 0 && currentYear() && (
        <p className=" text-brand-green-800 text-center">
          Number of bank holiday days in {currentYear()}:{' '}
          <span className="font-bold">{formData.numberOfBankHolidays}</span>
        </p>
      )}
    </form>
  );
});
export default CompanyBankHolidayRegionDefault;
