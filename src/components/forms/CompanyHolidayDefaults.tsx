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
import LeaveEntitlementBaseInfo from '../info/LeaveEntitlementBaseInfo';
import LeaveEntitlementAdditionalInfo from '../info/LeaveEntitlementAdditionalInfo';
import LeaveEntitlementMultiplierInfo from '../info/LeaveEntitlementMultiplierInfo';
import LeaveEntitlementDeductionInfo from '../info/LeaveEntitlementDeductionInfo';

const CompanyHolidayDefaults = forwardRef((props, ref) => {
  const [formData, setFormData] = useState<HolidayEntitlement>({
    holidayEntitlementBase: 0,
    holidayEntitlementAdditional: 0,
    holidayEntitlementMultiplier: 0,
    holidayEntitlementDeduction: 0,
    holidayEntitlementTotal: 0,
  });
  const defaultErrors = {
    holidayEntitlementBase: '',
    holidayEntitlementAdditional: '',
    holidayEntitlementMultiplier: '',
    holidayEntitlementDeduction: '',
    holidayEntitlementTotal: '', // this is probably not needed
  };
  const [errors, setErrors] =
    useState<Record<keyof HolidayEntitlement, string>>(defaultErrors);

  const { startLoading, stopLoading } = useLoadingContext();
  const { updateHolidayEntitlement, holidayEntitlement } = useCompanyContext();

  const {
    holidayEntitlementBase,
    holidayEntitlementAdditional,
    holidayEntitlementMultiplier,
    holidayEntitlementDeduction,
    holidayEntitlementTotal,
  } = formData;

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
      holidayEntitlement.holidayEntitlementBase === holidayEntitlementBase &&
      holidayEntitlement.holidayEntitlementAdditional ===
        holidayEntitlementAdditional &&
      holidayEntitlement.holidayEntitlementMultiplier ===
        holidayEntitlementMultiplier &&
      holidayEntitlement.holidayEntitlementDeduction ===
        holidayEntitlementDeduction &&
      holidayEntitlement.holidayEntitlementTotal === holidayEntitlementTotal
    ) {
      return formResponse(
        'skipped',
        "Default holiday entitlement haven't changed"
      );
    }
    startLoading('set-company-holiday-entitlement');
    try {
      await updateHolidayEntitlement({
        holidayEntitlementBase,
        holidayEntitlementAdditional,
        holidayEntitlementMultiplier,
        holidayEntitlementDeduction,
        holidayEntitlementTotal,
      });
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
      className="flex flex-col gap-4 w-full border border-brand-green-600 rounded-xl p-4"
    >
      <h3 className="text-2xl font-bold text-brand-green-700">
        Company's default yearly holiday entitlement configuration
      </h3>
      <LeaveEntitlementBaseInfo />
      <LeaveEntitlementAdditionalInfo />
      <LeaveEntitlementMultiplierInfo />
      <LeaveEntitlementDeductionInfo />

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
