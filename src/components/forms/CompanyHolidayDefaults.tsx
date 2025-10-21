import { forwardRef, useImperativeHandle } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import HolidayEntitlement from '../../interface/HolidayEntitlement.interface';
import HolidayCalculationInputs from '../complexInputs/HolidayCalculationInputs';
import SubmitFormResponse, {
  formResponse,
} from '../../interface/SubmitFormResponse.interface';

const CompanyHolidayDefaults = forwardRef((props, ref) => {
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

  // Allow parent to trigger submit
  useImperativeHandle(ref, () => ({
    submit: onSubmitHolidayEntitlement,
  }));

  const onSubmitHolidayEntitlement = async (
    e: any
  ): Promise<SubmitFormResponse> => {
    e?.preventDefault();

    if (
      holidayEntitlement.base === base &&
      holidayEntitlement.additional === additional &&
      holidayEntitlement.multiplier === multiplier &&
      holidayEntitlement.total === total
    ) {
      return formResponse(
        'skipped',
        "Default holiday entitlement haven't changed"
      );
    }
    startLoading('set-company-holiday-entitlement');
    try {
      await updateHolidayEntitlement({ base, additional, multiplier, total });
      return formResponse('submitted', 'Default holiday entitlement saved');
    } catch (error: any) {
      return formResponse(
        'error',
        error.message || 'Could not update default holiday entitlement'
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
    </form>
  );
});
export default CompanyHolidayDefaults;
