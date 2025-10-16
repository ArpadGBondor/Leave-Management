import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import HolidayEntitlement from '../../interface/HolidayEntitlement.interface';
import HolidayCalculationInputs from '../complexInputs/HolidayCalculationInputs';

export default function CompanyHolidayDefaults() {
  const [formData, setFormData] = useState<HolidayEntitlement>({
    base: 0,
    additional: 0,
    multiplier: 0,
    total: 0,
  });
  const defaultErrors = {
    base: '',
    additional: '',
    multiplier: '',
    total: '', // this is probably not needed
  };
  const [errors, setErrors] =
    useState<Record<keyof HolidayEntitlement, string>>(defaultErrors);

  const { startLoading, stopLoading } = useLoadingContext();
  const { updateHolidayEntitlement, holidayEntitlement } = useCompanyContext();

  const { base, additional, multiplier, total } = formData;

  useEffect(() => {
    if (holidayEntitlement)
      setFormData((prevState) => ({
        ...prevState,
        ...holidayEntitlement,
      }));
  }, []);

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const onSubmitHolidayEntitlement = async (e: any) => {
    e.preventDefault();

    startLoading('set-company-holiday-entitlement');
    try {
      await updateHolidayEntitlement({ base, additional, multiplier, total });
      toast.info('Default holiday configuration saved');
    } catch (error: any) {
      toast.error(
        error.message || 'Could not update default holiday configuration'
      );
    } finally {
      stopLoading('set-company-holiday-entitlement');
    }
  };

  return (
    <form
      onSubmit={onSubmitHolidayEntitlement}
      className="flex flex-col gap-4 w-full"
    >
      <h3 className="text-2xl font-bold text-brand-green-700">
        Yearly holiday entitlement
      </h3>

      <HolidayCalculationInputs
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setError={setError}
      />

      <Button label="Update default holiday configuration" />
    </form>
  );
}
